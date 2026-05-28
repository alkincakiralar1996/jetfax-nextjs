import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

function fmt(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminUsers() {
  let rows: (typeof schema.users.$inferSelect)[] = [];
  let dbError = false;
  try {
    const db = getDb();
    rows = await db
      .select()
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt))
      .limit(200);
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <span className="text-sm text-[#6B7280]">{rows.length} shown</span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#0F3D2E]/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#0F3D2E]/10 bg-[#FAFAF7] text-xs uppercase tracking-wider text-[#6B7280]">
            <tr>
              <th className="px-4 py-3">Device</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Locale</th>
              <th className="px-4 py-3">Segment</th>
              <th className="px-4 py-3">Onboarded</th>
              <th className="px-4 py-3">App</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Last open</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-[#6B7280]">
                  No users yet.
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#0F3D2E]/5 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#3F3F46]">
                    {u.deviceId.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">{u.platform ?? "—"}</td>
                  <td className="px-4 py-3">{u.region ?? "—"}</td>
                  <td className="px-4 py-3">{u.locale ?? "—"}</td>
                  <td className="px-4 py-3">{u.segment ?? "—"}</td>
                  <td className="px-4 py-3">
                    {u.hasOnboardingComplete ? (
                      <span className="rounded-full bg-[#E8F5EF] px-2 py-0.5 text-xs font-semibold text-[#1B5E47]">
                        ✓
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs font-semibold text-[#6B7280]">
                        ✗
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">
                    {u.appVersion ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">
                    {fmt(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">
                    {fmt(u.lastOpenedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
