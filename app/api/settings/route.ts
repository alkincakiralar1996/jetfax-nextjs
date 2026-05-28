import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { json, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  id: 1,
  appStoreUrl: "https://apps.apple.com/app/id6773434191",
  privacyUrl: "https://jetfax-nextjs.vercel.app/privacy",
  termsUrl: "https://jetfax-nextjs.vercel.app/terms",
  supportUrl: "https://jetfax-nextjs.vercel.app/support",
};

// GET /api/settings — singleton app config. Self-seeds row id=1 on first read.
export async function GET() {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.id, 1))
      .limit(1);

    if (rows.length === 0) {
      const seeded = await db
        .insert(schema.settings)
        .values(DEFAULTS)
        .returning();
      return json({ settings: seeded[0] });
    }
    return json({ settings: rows[0] });
  } catch (e) {
    console.error("GET /api/settings", e);
    return serverError();
  }
}
