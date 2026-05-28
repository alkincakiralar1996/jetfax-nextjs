import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { json, badRequest, parseBody, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  device_id: z.string().min(1),
  platform: z.string().nullish(),
  os_version: z.string().nullish(),
  device_model: z.string().nullish(),
  device_model_name: z.string().nullish(),
  app_version: z.string().nullish(),
  locale: z.string().nullish(),
  region: z.string().nullish(),
  timezone: z.string().nullish(),
  segment: z.string().nullish(),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  segment: z.string().optional(),
  has_onboarding_complete: z.boolean().optional(),
  notification_status: z.boolean().optional(),
  att_status: z.string().optional(),
  last_opened_at: z.string().optional(),
});

// POST /api/users — upsert by device_id. Reinstall returns the existing row.
export async function POST(request: Request) {
  const parsed = await parseBody(request, createSchema);
  if ("error" in parsed) return parsed.error;
  const b = parsed.data;

  try {
    const db = getDb();
    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.deviceId, b.device_id))
      .limit(1);

    if (existing.length > 0) {
      const user = existing[0];
      await db
        .update(schema.users)
        .set({ lastOpenedAt: new Date() })
        .where(eq(schema.users.id, user.id));
      return json({ user, reused: true });
    }

    const inserted = await db
      .insert(schema.users)
      .values({
        deviceId: b.device_id,
        platform: b.platform,
        osVersion: b.os_version,
        deviceModel: b.device_model,
        deviceModelName: b.device_model_name,
        appVersion: b.app_version,
        locale: b.locale,
        region: b.region,
        timezone: b.timezone,
        segment: b.segment,
        lastOpenedAt: new Date(),
      })
      .returning();

    return json({ user: inserted[0], reused: false }, 201);
  } catch (e) {
    console.error("POST /api/users", e);
    return serverError();
  }
}

// PATCH /api/users — update mutable fields by id.
export async function PATCH(request: Request) {
  const parsed = await parseBody(request, patchSchema);
  if ("error" in parsed) return parsed.error;
  const b = parsed.data;

  try {
    const db = getDb();
    const patch: Record<string, unknown> = {};
    if (b.segment !== undefined) patch.segment = b.segment;
    if (b.has_onboarding_complete !== undefined)
      patch.hasOnboardingComplete = b.has_onboarding_complete;
    if (b.notification_status !== undefined)
      patch.notificationStatus = b.notification_status;
    if (b.att_status !== undefined) patch.attStatus = b.att_status;
    if (b.last_opened_at !== undefined)
      patch.lastOpenedAt = new Date(b.last_opened_at);

    if (Object.keys(patch).length === 0) {
      return badRequest("No updatable fields provided");
    }

    const updated = await db
      .update(schema.users)
      .set(patch)
      .where(eq(schema.users.id, b.id))
      .returning();

    if (updated.length === 0) return json({ error: "Not found" }, 404);
    return json({ user: updated[0] });
  } catch (e) {
    console.error("PATCH /api/users", e);
    return serverError();
  }
}
