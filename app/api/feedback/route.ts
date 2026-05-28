import { z } from "zod";
import { getDb, schema } from "@/db";
import { json, parseBody, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

const feedbackSchema = z.object({
  user_id: z.string().uuid().optional(),
  message: z.string().min(1).max(5000),
  email: z.string().email().optional(),
});

// POST /api/feedback — Settings "Send feedback" submission.
export async function POST(request: Request) {
  const parsed = await parseBody(request, feedbackSchema);
  if ("error" in parsed) return parsed.error;
  const b = parsed.data;

  try {
    const db = getDb();
    const inserted = await db
      .insert(schema.feedback)
      .values({
        userId: b.user_id ?? null,
        message: b.message,
        email: b.email ?? null,
      })
      .returning();
    return json({ feedback: inserted[0] }, 201);
  } catch (e) {
    console.error("POST /api/feedback", e);
    return serverError();
  }
}
