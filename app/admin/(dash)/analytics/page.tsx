import { and, count, eq, gte, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

const DAYS = 30;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Point = { key: string; label: string; value: number };

// Build a continuous DAYS-long series ending today, filling gaps with 0.
function series(map: Map<string, number>): Point[] {
  const out: Point[] = [];
  const now = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = dayKey(d);
    out.push({
      key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: map.get(key) ?? 0,
    });
  }
  return out;
}

function toMap(rows: { d: string | null; c: number }[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of rows) if (r.d) m.set(r.d.slice(0, 10), Number(r.c));
  return m;
}

async function getAnalytics() {
  const db = getDb();
  const since = new Date();
  since.setDate(since.getDate() - (DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const dayOf = (col: AnyPgColumn) =>
    sql<string>`to_char(date_trunc('day', ${col}), 'YYYY-MM-DD')`;

  const [
    usersRows,
    onboardedRows,
    faxRows,
    deliveredRows,
    salesRows,
    totals,
    faxTotal,
    salesTotal,
  ] = await Promise.all([
    db
      .select({ d: dayOf(schema.users.createdAt), c: count() })
      .from(schema.users)
      .where(gte(schema.users.createdAt, since))
      .groupBy(sql`1`),
    db
      .select({ d: dayOf(schema.users.createdAt), c: count() })
      .from(schema.users)
      .where(
        and(
          gte(schema.users.createdAt, since),
          eq(schema.users.hasOnboardingComplete, true),
        ),
      )
      .groupBy(sql`1`),
    db
      .select({ d: dayOf(schema.faxes.createdAt), c: count() })
      .from(schema.faxes)
      .where(gte(schema.faxes.createdAt, since))
      .groupBy(sql`1`),
    db
      .select({ d: dayOf(schema.faxes.createdAt), c: count() })
      .from(schema.faxes)
      .where(
        and(
          gte(schema.faxes.createdAt, since),
          eq(schema.faxes.status, "delivered"),
        ),
      )
      .groupBy(sql`1`),
    db
      .select({ d: dayOf(schema.purchases.createdAt), c: count() })
      .from(schema.purchases)
      .where(gte(schema.purchases.createdAt, since))
      .groupBy(sql`1`),
    db
      .select({
        total: count(),
        onboarded: sql<number>`count(*) filter (where ${schema.users.hasOnboardingComplete})`,
      })
      .from(schema.users),
    db.select({ c: count() }).from(schema.faxes),
    db.select({ c: count() }).from(schema.purchases),
  ]);

  const newUsers = series(toMap(usersRows));
  const onboarded = series(toMap(onboardedRows));
  const faxes = series(toMap(faxRows));
  const delivered = series(toMap(deliveredRows));
  const sales = series(toMap(salesRows));

  const onboardingRate = newUsers.map((u, i) => ({
    ...u,
    value: u.value > 0 ? Math.round((onboarded[i]!.value / u.value) * 100) : 0,
  }));
  const salesRate = newUsers.map((u, i) => ({
    ...u,
    value: u.value > 0 ? Math.round((sales[i]!.value / u.value) * 100) : 0,
  }));
  const deliveryRate = faxes.map((f, i) => ({
    ...f,
    value: f.value > 0 ? Math.round((delivered[i]!.value / f.value) * 100) : 0,
  }));

  const total = Number(totals[0]?.total ?? 0);
  const onboardedTotal = Number(totals[0]?.onboarded ?? 0);
  const salesCount = Number(salesTotal[0]?.c ?? 0);

  return {
    cards: {
      total,
      onboardingPct: total > 0 ? Math.round((onboardedTotal / total) * 100) : 0,
      faxes: Number(faxTotal[0]?.c ?? 0),
      sales: salesCount,
      conversionPct: total > 0 ? Math.round((salesCount / total) * 100) : 0,
      new7d: newUsers.slice(-7).reduce((s, p) => s + p.value, 0),
    },
    charts: { newUsers, onboarded, faxes, sales, onboardingRate, salesRate, deliveryRate },
  };
}

export default async function AdminAnalytics() {
  let data;
  try {
    data = await getAnalytics();
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Growth Analytics</h1>
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  const { cards, charts } = data;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Growth Analytics</h1>
        <span className="text-sm text-[#6B7280]">Last {DAYS} days</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total users" value={cards.total} />
        <Stat label="New · 7d" value={cards.new7d} />
        <Stat label="Onboarding %" value={`${cards.onboardingPct}%`} />
        <Stat label="Faxes sent" value={cards.faxes} />
        <Stat label="Sales" value={cards.sales} />
        <Stat label="Conversion %" value={`${cards.conversionPct}%`} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Chart title="New users / day" data={charts.newUsers} color="#1B5E47" />
        <Chart title="Onboarding completions / day" data={charts.onboarded} color="#2E8B5E" />
        <Chart title="Faxes sent / day" data={charts.faxes} color="#0F3D2E" />
        <Chart title="New sales / day" data={charts.sales} color="#FFB020" />
        <Chart title="Onboarding conversion rate" data={charts.onboardingRate} color="#2E8B5E" suffix="%" max={100} />
        <Chart title="Sales conversion rate" data={charts.salesRate} color="#FFB020" suffix="%" max={100} />
        <Chart title="Fax delivery rate" data={charts.deliveryRate} color="#10B981" suffix="%" max={100} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[#0F3D2E]/10 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[#0F3D2E]">{value}</div>
    </div>
  );
}

function Chart({
  title,
  data,
  color,
  suffix = "",
  max,
}: {
  title: string;
  data: Point[];
  color: string;
  suffix?: string;
  max?: number;
}) {
  const peak = max ?? Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const gap = 0.6;
  const barW = (100 - gap * (n - 1)) / n;
  const latest = data[data.length - 1];
  const totalSum = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl border border-[#0F3D2E]/10 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-xs text-[#6B7280]">
          {suffix === "%"
            ? `latest ${latest?.value ?? 0}%`
            : `${totalSum} total`}
        </div>
      </div>
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="mt-3 h-32 w-full"
      >
        {data.map((d, i) => {
          const h = peak > 0 ? (d.value / peak) * 38 : 0;
          const x = i * (barW + gap);
          return (
            <rect
              key={d.key}
              x={x}
              y={40 - Math.max(h, d.value > 0 ? 0.6 : 0)}
              width={barW}
              height={Math.max(h, d.value > 0 ? 0.6 : 0)}
              fill={color}
            >
              <title>{`${d.label}: ${d.value}${suffix}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-[#9CA3AF]">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(n / 2)]?.label}</span>
        <span>{latest?.label}</span>
      </div>
    </div>
  );
}
