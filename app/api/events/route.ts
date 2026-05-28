import { z } from "zod";
import { getDb, schema } from "@/db";
import { json, parseBody, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

const eventSchema = z.object({
  user_id: z.string().uuid().optional(),
  name: z.string().min(1),
  props: z.record(z.string(), z.unknown()).optional(),
});

// POST /api/events — generic analytics event.
export async function POST(request: Request) {
  const parsed = await parseBody(request, eventSchema);
  if ("error" in parsed) return parsed.error;
  const b = parsed.data;

  try {
    const db = getDb();
    const inserted = await db
      .insert(schema.events)
      .values({
        userId: b.user_id ?? null,
        name: b.name,
        props: b.props ?? null,
      })
      .returning();
    return json({ event: inserted[0] }, 201);
  } catch (e) {
    console.error("POST /api/events", e);
    return serverError();
  }
}
