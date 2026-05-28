import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { json, parseBody, serverError } from "@/lib/api";
import { confirmationNumber } from "@/lib/fax";

export const dynamic = "force-dynamic";

const coverSchema = z
  .object({
    to: z.string(),
    from: z.string(),
    subject: z.string(),
    message: z.string(),
  })
  .partial()
  .nullish();

const createSchema = z.object({
  user_id: z.string().uuid().nullish(),
  recipient_label: z.string().nullish(),
  recipient_number: z.string().min(1),
  recipient_country: z.string().nullish(),
  page_count: z.number().int().min(1),
  has_cover: z.boolean().optional(),
  cover: coverSchema,
  status: z.enum(["delivered", "pending", "failed"]).optional(),
  failure_reason: z.string().nullish(),
  duration_seconds: z.number().int().nullish(),
  sent_at: z.string().nullish(), // ISO timestamp
});

// POST /api/faxes — record a fax. Real transmission (Telnyx) lands later, so
// status defaults to optimistic "delivered" with a server-issued confirmation.
// Page image bytes are NOT sent here — they stay on the device.
export async function POST(request: Request) {
  const parsed = await parseBody(request, createSchema);
  if ("error" in parsed) return parsed.error;
  const b = parsed.data;

  const status = b.status ?? "delivered";
  const sentAt = b.sent_at ? new Date(b.sent_at) : new Date();

  try {
    const db = getDb();
    const inserted = await db
      .insert(schema.faxes)
      .values({
        userId: b.user_id ?? null,
        recipientLabel: b.recipient_label ?? null,
        recipientNumber: b.recipient_number,
        recipientCountry: b.recipient_country ?? null,
        pageCount: b.page_count,
        hasCover: b.has_cover ?? false,
        cover: b.cover ?? null,
        status,
        sentAt,
        confirmationNumber:
          status === "delivered" ? confirmationNumber() : null,
        deliveredAt: status === "delivered" ? new Date() : null,
        durationSeconds:
          status === "delivered"
            ? (b.duration_seconds ?? Math.round(20 + Math.random() * 40))
            : null,
        failureReason: status === "failed" ? (b.failure_reason ?? null) : null,
      })
      .returning();

    return json({ fax: inserted[0] }, 201);
  } catch (e) {
    console.error("POST /api/faxes", e);
    return serverError();
  }
}

// GET /api/faxes?user_id=&status= — list a user's faxes, newest first.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("user_id");
  const status = url.searchParams.get("status");

  try {
    const db = getDb();
    const conds = [];
    if (userId) conds.push(eq(schema.faxes.userId, userId));
    if (status) conds.push(eq(schema.faxes.status, status));

    const rows = await db
      .select()
      .from(schema.faxes)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(schema.faxes.createdAt))
      .limit(200);

    return json({ faxes: rows });
  } catch (e) {
    console.error("GET /api/faxes", e);
    return serverError();
  }
}
