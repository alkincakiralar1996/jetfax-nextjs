import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { json, parseBody, serverError } from "@/lib/api";
import { confirmationNumber } from "@/lib/fax";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["delivered", "pending", "failed"]).optional(),
  failure_reason: z.string().nullish(),
  duration_seconds: z.number().int().nullish(),
});

// GET /api/faxes/:id — single fax metadata.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.faxes)
      .where(eq(schema.faxes.id, id))
      .limit(1);
    if (rows.length === 0) return json({ error: "Not found" }, 404);
    return json({ fax: rows[0] });
  } catch (e) {
    console.error("GET /api/faxes/[id]", e);
    return serverError();
  }
}

// PATCH /api/faxes/:id — update status (used for future resend / real send).
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = await parseBody(request, patchSchema);
  if ("error" in parsed) return parsed.error;
  const b = parsed.data;

  try {
    const db = getDb();
    const patch: Record<string, unknown> = {};
    if (b.status !== undefined) {
      patch.status = b.status;
      if (b.status === "delivered") {
        patch.deliveredAt = new Date();
        patch.confirmationNumber = confirmationNumber();
        patch.failureReason = null;
      } else if (b.status === "failed") {
        patch.failureReason = b.failure_reason ?? null;
      }
    }
    if (b.duration_seconds !== undefined)
      patch.durationSeconds = b.duration_seconds;

    if (Object.keys(patch).length === 0)
      return json({ error: "No updatable fields" }, 400);

    const updated = await db
      .update(schema.faxes)
      .set(patch)
      .where(eq(schema.faxes.id, id))
      .returning();
    if (updated.length === 0) return json({ error: "Not found" }, 404);
    return json({ fax: updated[0] });
  } catch (e) {
    console.error("PATCH /api/faxes/[id]", e);
    return serverError();
  }
}

// DELETE /api/faxes/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const db = getDb();
    await db.delete(schema.faxes).where(eq(schema.faxes.id, id));
    return json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/faxes/[id]", e);
    return serverError();
  }
}
