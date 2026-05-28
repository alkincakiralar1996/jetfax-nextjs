import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

// POST /api/admin/logout — clear the admin session cookie.
export async function POST() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return json({ ok: true });
}
