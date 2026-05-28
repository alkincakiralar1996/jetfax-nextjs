import Link from "next/link";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
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

async function toggleResolved(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const next = formData.get("next") === "true";
  const db = getDb();
  await db
    .update(schema.feedback)
    .set({ resolved: next })
    .where(eq(schema.feedback.id, id));
  revalidatePath("/admin/feedback");
}

async function deleteFeedback(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const db = getDb();
  await db.delete(schema.feedback).where(eq(schema.feedback.id, id));
  revalidatePath("/admin/feedback");
}

const TABS = [
  { key: "", label: "All" },
  { key: "feedback", label: "Feedback" },
  { key: "support", label: "Support" },
];

export default async function AdminFeedback({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const activeKind = kind === "feedback" || kind === "support" ? kind : "";

  let rows: (typeof schema.feedback.$inferSelect)[] = [];
  let dbError = false;
  try {
    const db = getDb();
    const base = db.select().from(schema.feedback);
    rows = activeKind
      ? await base
          .where(eq(schema.feedback.kind, activeKind))
          .orderBy(desc(schema.feedback.createdAt))
          .limit(300)
      : await base.orderBy(desc(schema.feedback.createdAt)).limit(300);
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback &amp; Support</h1>
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Feedback &amp; Support</h1>
        <span className="text-sm text-[#6B7280]">{rows.length} shown</span>
      </div>

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/admin/feedback?kind=${t.key}` : "/admin/feedback"}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              activeKind === t.key
                ? "bg-[#0F3D2E] text-white"
                : "bg-white text-[#3F3F46] hover:bg-[#E8F5EF]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-[#0F3D2E]/10 bg-white px-4 py-8 text-center text-sm text-[#6B7280]">
            No submissions yet.
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border bg-white p-4 ${
                r.resolved ? "border-[#0F3D2E]/5 opacity-60" : "border-[#0F3D2E]/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    r.kind === "support"
                      ? "bg-[#FFF4DD] text-[#92400E]"
                      : "bg-[#E8F5EF] text-[#1B5E47]"
                  }`}
                >
                  {r.kind}
                </span>
                {r.resolved ? (
                  <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs font-semibold text-[#6B7280]">
                    resolved
                  </span>
                ) : null}
                <span className="ml-auto text-xs text-[#6B7280]">
                  {fmt(r.createdAt)}
                </span>
              </div>

              {r.subject ? (
                <div className="mt-2 text-sm font-semibold text-[#0A0A0A]">
                  {r.subject}
                </div>
              ) : null}
              <p className="mt-1 whitespace-pre-wrap text-sm text-[#3F3F46]">
                {r.message}
              </p>

              <div className="mt-2 flex items-center gap-3 text-xs text-[#6B7280]">
                {r.email ? <span>{r.email}</span> : null}
                {r.userId ? (
                  <Link
                    href={`/admin/users/${r.userId}`}
                    className="font-mono text-[#1B5E47] hover:underline"
                  >
                    {r.userId.slice(0, 8)}…
                  </Link>
                ) : (
                  <span>anonymous</span>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <form action={toggleResolved}>
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={(!r.resolved).toString()}
                    />
                    <button
                      type="submit"
                      className="rounded-md px-2 py-1 font-semibold text-[#1B5E47] hover:bg-[#E8F5EF]"
                    >
                      {r.resolved ? "Reopen" : "Mark resolved"}
                    </button>
                  </form>
                  <form action={deleteFeedback}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-md px-2 py-1 font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
