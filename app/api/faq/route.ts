import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { json, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/faq — published help-center entries, read by the mobile app.
export async function GET() {
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.faq.id,
        question: schema.faq.question,
        answer: schema.faq.answer,
        category: schema.faq.category,
        sortOrder: schema.faq.sortOrder,
      })
      .from(schema.faq)
      .where(eq(schema.faq.published, true))
      .orderBy(asc(schema.faq.sortOrder), asc(schema.faq.createdAt));
    return json({ faq: rows });
  } catch (e) {
    console.error("GET /api/faq", e);
    return serverError();
  }
}
