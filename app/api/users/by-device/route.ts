import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { json, badRequest, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/users/by-device?device_id=... — reinstall recovery.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("device_id");
  if (!deviceId) return badRequest("device_id is required");

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.deviceId, deviceId))
      .limit(1);
    return json({ user: rows[0] ?? null });
  } catch (e) {
    console.error("GET /api/users/by-device", e);
    return serverError();
  }
}
