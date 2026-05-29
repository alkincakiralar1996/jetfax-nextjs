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

function StatusBadge({
  status,
  isActive,
}: {
  status: string | null;
  isActive: boolean;
}) {
  const label = status ?? (isActive ? "active" : "—");
  const cls = isActive
    ? "bg-[#E8F5EF] text-[#1B5E47]"
    : status === "cancelled"
      ? "bg-[#FFF4DD] text-[#92400E]"
      : "bg-[#F3F4F6] text-[#6B7280]";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${cls}`}
    >
      {label}
    </span>
  );
}

export default async function AdminPurchases() {
  let rows: (typeof schema.purchases.$inferSelect)[] = [];
  let dbError = false;
  try {
    const db = getDb();
    rows = await db
      .select()
      .from(schema.purchases)
      .orderBy(desc(schema.purchases.createdAt))
      .limit(200);
  } catch {
    dbError = true;
  }

  const active = rows.filter((r) => r.isActive).length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <span className="text-sm text-[#6B7280]">
          {active} active · {rows.length} shown
        </span>
      </div>
      <p className="mt-1 text-sm text-[#6B7280]">
        Live subscription state, kept in sync by the RevenueCat webhook
        (/api/webhooks/revenuecat). One row per subscription.
      </p>

      {dbError ? (
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#0F3D2E]/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#0F3D2E]/10 bg-[#FAFAF7] text-xs uppercase tracking-wider text-[#6B7280]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Env</th>
                <th className="px-4 py-3">Purchased</th>
                <th className="px-4 py-3">Expires</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-[#6B7280]"
                  >
                    No subscriptions yet.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#0F3D2E]/5 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#3F3F46]">
                      {p.userId ? `${p.userId.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-4 py-3 capitalize">{p.plan ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} isActive={p.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      {p.price ? `${p.price} ${p.currency ?? ""}`.trim() : "—"}
                    </td>
                    <td className="px-4 py-3">{p.countryCode ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">
                      {p.environment === "SANDBOX" ? (
                        <span className="rounded bg-[#FFF4DD] px-1.5 py-0.5 font-semibold text-[#92400E]">
                          SANDBOX
                        </span>
                      ) : (
                        (p.environment ?? "—")
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">
                      {fmt(p.purchasedAt)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">
                      {fmt(p.expiresAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
