import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// RevenueCat webhook. Auth via the Authorization header configured in the RC
// dashboard (REVENUECAT_WEBHOOK_AUTH). Idempotent on event.id. Upserts the
// current subscription row (purchases) + appends to the event log
// (purchase_events). Must return 200 on success — RC retries 5× otherwise.

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Event types that (re)assert a live subscription.
const ACTIVE_TYPES = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
  "SUBSCRIPTION_EXTENDED",
  "NON_RENEWING_PURCHASE",
]);

type RCEvent = {
  id?: string;
  type?: string;
  app_user_id?: string;
  product_id?: string;
  entitlement_ids?: string[];
  entitlement_id?: string;
  store?: string;
  environment?: string;
  price?: number;
  price_in_purchased_currency?: number;
  currency?: string;
  country_code?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  purchased_at_ms?: number;
  expiration_at_ms?: number;
  event_timestamp_ms?: number;
  unsubscribe_detected_at_ms?: number;
};

function planFromProduct(productId: string | null): string | null {
  if (!productId) return null;
  if (productId.includes("weekly")) return "weekly";
  if (productId.includes("monthly")) return "monthly";
  return null;
}

function msToDate(ms: number | undefined): Date | null {
  return typeof ms === "number" && ms > 0 ? new Date(ms) : null;
}

function numStr(n: number | undefined): string | null {
  return typeof n === "number" ? String(n) : null;
}

export async function POST(request: Request) {
  // 1. Auth.
  const expected = process.env.REVENUECAT_WEBHOOK_AUTH;
  const got = request.headers.get("authorization");
  if (!expected || got !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const e = (body as { event?: RCEvent } | null)?.event;
  if (!e || typeof e.id !== "string" || typeof e.type !== "string") {
    return json({ error: "Missing event" }, 400);
  }

  try {
    const db = getDb();

    // 2. Resolve our user. RC app_user_id == users.id (set via Purchases.logIn).
    const appUserId = e.app_user_id ?? null;
    let userId: string | null = null;
    if (appUserId && UUID_RE.test(appUserId)) {
      const rows = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.id, appUserId))
        .limit(1);
      if (rows.length > 0) userId = rows[0]!.id;
    }

    const productId = e.product_id ?? null;
    const store = e.store ?? null;
    const environment = e.environment ?? null;
    const usdPrice = numStr(e.price);
    const countryCode = e.country_code ?? null;
    const otx = e.original_transaction_id ?? null;

    // 3. Upsert current subscription state FIRST (idempotent by
    //    original_transaction_id) so a transient failure retries safely.
    if (e.type !== "TEST" && otx) {
      const expiresAt = msToDate(e.expiration_at_ms);
      const now = Date.now();
      const future = !!expiresAt && expiresAt.getTime() > now;
      const unsubAt = msToDate(e.unsubscribe_detected_at_ms);

      let status: string;
      let isActive: boolean;
      if (e.type === "EXPIRATION") {
        status = "expired";
        isActive = false;
      } else if (e.type === "SUBSCRIPTION_PAUSED") {
        status = "paused";
        isActive = false;
      } else if (e.type === "BILLING_ISSUE") {
        status = "billing_issue";
        isActive = future;
      } else if (e.type === "CANCELLATION") {
        status = "cancelled";
        isActive = future;
      } else if (ACTIVE_TYPES.has(e.type)) {
        status = "active";
        isActive = !expiresAt || future;
      } else {
        status = "active";
        isActive = future;
      }

      const set = {
        userId,
        appUserId,
        productId,
        plan: planFromProduct(productId),
        entitlement: e.entitlement_ids?.[0] ?? e.entitlement_id ?? "pro",
        status,
        isActive,
        store,
        environment,
        eventType: e.type,
        price: numStr(e.price_in_purchased_currency) ?? usdPrice,
        currency: e.currency ?? null,
        usdPrice,
        countryCode,
        transactionId: e.transaction_id ?? null,
        expiresAt,
        unsubscribeDetectedAt:
          unsubAt ?? (e.type === "CANCELLATION" ? new Date() : null),
        updatedAt: new Date(),
      };

      await db
        .insert(schema.purchases)
        .values({
          ...set,
          originalTransactionId: otx,
          purchasedAt: msToDate(e.purchased_at_ms),
        })
        .onConflictDoUpdate({
          target: schema.purchases.originalTransactionId,
          set, // purchasedAt omitted → first-purchase timestamp sticks
        });
    }

    // 4. Append to the event log (dedup gate on event_id).
    await db
      .insert(schema.purchaseEvents)
      .values({
        eventId: e.id,
        userId,
        appUserId,
        originalTransactionId: otx,
        type: e.type,
        productId,
        store,
        environment,
        priceUsd: usdPrice,
        countryCode,
        raw: body,
        eventAt: msToDate(e.event_timestamp_ms) ?? msToDate(e.purchased_at_ms),
      })
      .onConflictDoNothing({ target: schema.purchaseEvents.eventId });

    return json({ ok: true });
  } catch (err) {
    console.error("POST /api/webhooks/revenuecat", err);
    // 500 → RevenueCat retries (5,10,20,40,80 min). Idempotency makes retry safe.
    return json({ error: "Internal error" }, 500);
  }
}
