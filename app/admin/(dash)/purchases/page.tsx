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

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Purchases</h1>
        <span className="text-sm text-[#6B7280]">{rows.length} shown</span>
      </div>

      <p className="mt-4 rounded-lg border border-[#FFB020]/30 bg-[#FFF4DD] px-4 py-3 text-sm text-[#92400E]">
        <strong className="font-semibold">Read-only stub.</strong> Write logic
        lands with the RevenueCat webhook in a later phase. Schema + this view
        exist now so the table is ready to populate.
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
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">USD</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Txn</th>
                <th className="px-4 py-3">Purchased</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-[#6B7280]"
                  >
                    No purchases yet — wiring lands with RevenueCat.
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
                    <td className="px-4 py-3 text-xs">{p.productId ?? "—"}</td>
                    <td className="px-4 py-3">{p.plan ?? "—"}</td>
                    <td className="px-4 py-3">{p.status ?? "—"}</td>
                    <td className="px-4 py-3">
                      {p.price ? `${p.price} ${p.currency ?? ""}`.trim() : "—"}
                    </td>
                    <td className="px-4 py-3">{p.usdPrice ?? "—"}</td>
                    <td className="px-4 py-3">{p.countryCode ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#3F3F46]">
                      {p.transactionId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">
                      {fmt(p.purchasedAt)}
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
