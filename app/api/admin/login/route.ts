import { cookies } from "next/headers";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  checkCredentials,
  createSessionToken,
} from "@/lib/admin-auth";
import { json, parseBody } from "@/lib/api";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// POST /api/admin/login — static-cred check, sets signed httpOnly cookie.
export async function POST(request: Request) {
  const parsed = await parseBody(request, loginSchema);
  if ("error" in parsed) return parsed.error;
  const { username, password } = parsed.data;

  if (!checkCredentials(username, password)) {
    return json({ error: "Invalid credentials" }, 401);
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return json({ ok: true });
}
