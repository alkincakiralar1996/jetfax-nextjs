import { sql, gte, count } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = getDb();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      total: count(),
      onboarded: sql<number>`count(*) filter (where ${schema.users.hasOnboardingComplete})`,
    })
    .from(schema.users);

  const [recent] = await db
    .select({ c: count() })
    .from(schema.users)
    .where(gte(schema.users.createdAt, sevenDaysAgo));

  const bySegment = await db
    .select({ segment: schema.users.segment, c: count() })
    .from(schema.users)
    .groupBy(schema.users.segment);

  const byRegion = await db
    .select({ region: schema.users.region, c: count() })
    .from(schema.users)
    .groupBy(schema.users.region);

  const [feedbackCount] = await db
    .select({ c: count() })
    .from(schema.feedback);

  return {
    total: Number(totals?.total ?? 0),
    onboarded: Number(totals?.onboarded ?? 0),
    recent: Number(recent?.c ?? 0),
    bySegment,
    byRegion,
    feedbackCount: Number(feedbackCount?.c ?? 0),
  };
}

export default async function AdminOverview() {
  let stats;
  try {
    stats = await getStats();
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  const pct =
    stats.total > 0 ? Math.round((stats.onboarded / stats.total) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total users" value={stats.total} />
        <Stat label="Onboarded" value={`${stats.onboarded} (${pct}%)`} />
        <Stat label="New · 7d" value={stats.recent} />
        <Stat label="Feedback" value={stats.feedbackCount} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Breakdown title="By segment" rows={stats.bySegment.map((r) => ({ label: r.segment ?? "—", c: Number(r.c) }))} />
        <Breakdown title="By country" rows={stats.byRegion.map((r) => ({ label: r.region ?? "—", c: Number(r.c) }))} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[#0F3D2E]/10 bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold text-[#0F3D2E]">{value}</div>
    </div>
  );
}

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; c: number }[];
}) {
  return (
    <div className="rounded-xl border border-[#0F3D2E]/10 bg-white p-5">
      <div className="text-sm font-semibold text-[#0A0A0A]">{title}</div>
      <div className="mt-3 flex flex-col gap-2">
        {rows.length === 0 ? (
          <span className="text-sm text-[#6B7280]">No data yet.</span>
        ) : (
          rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[#3F3F46]">{r.label}</span>
              <span className="font-semibold text-[#0A0A0A]">{r.c}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
