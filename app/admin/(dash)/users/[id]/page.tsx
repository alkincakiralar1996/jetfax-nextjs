import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

function fmt(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_STYLE: Record<string, string> = {
  delivered: "bg-[#E8F5EF] text-[#1B5E47]",
  pending: "bg-[#FFF4DD] text-[#92400E]",
  failed: "bg-[#FEE2E2] text-[#DC2626]",
};

export default async function AdminUserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user: typeof schema.users.$inferSelect | undefined;
  let faxes: (typeof schema.faxes.$inferSelect)[] = [];
  let dbError = false;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    user = rows[0];
    if (user) {
      faxes = await db
        .select()
        .from(schema.faxes)
        .where(eq(schema.faxes.userId, id))
        .orderBy(desc(schema.faxes.createdAt))
        .limit(200);
    }
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div>
        <BackLink />
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <BackLink />
        <p className="mt-4 text-sm text-[#6B7280]">User not found.</p>
      </div>
    );
  }

  const info: [string, string][] = [
    ["Device ID", user.deviceId],
    ["Platform", user.platform ?? "—"],
    ["OS version", user.osVersion ?? "—"],
    ["Device model", user.deviceModel ?? "—"],
    ["Model name", user.deviceModelName ?? "—"],
    ["App version", user.appVersion ?? "—"],
    ["Locale", user.locale ?? "—"],
    ["Country", user.region ?? "—"],
    ["Timezone", user.timezone ?? "—"],
    ["Segment", user.segment ?? "—"],
    ["Onboarded", user.hasOnboardingComplete ? "Yes" : "No"],
    [
      "Notifications",
      user.notificationStatus === null
        ? "—"
        : user.notificationStatus
          ? "On"
          : "Off",
    ],
    ["ATT status", user.attStatus ?? "—"],
    ["Created", fmt(user.createdAt)],
    ["Last open", fmt(user.lastOpenedAt)],
  ];

  return (
    <div>
      <BackLink />
      <h1 className="mt-3 text-2xl font-bold tracking-tight">User detail</h1>
      <p className="mt-1 font-mono text-xs text-[#6B7280]">{user.id}</p>

      {/* Info grid */}
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-px overflow-hidden rounded-xl border border-[#0F3D2E]/10 bg-white sm:grid-cols-2">
        {info.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              {k}
            </span>
            <span className="truncate text-right text-sm font-medium text-[#0A0A0A]">
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* Faxes */}
      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-lg font-bold tracking-tight">Fax history</h2>
        <span className="text-sm text-[#6B7280]">{faxes.length} faxes</span>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-[#0F3D2E]/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#0F3D2E]/10 bg-[#FAFAF7] text-xs uppercase tracking-wider text-[#6B7280]">
            <tr>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Pages</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Confirmation</th>
              <th className="px-4 py-3">Sent</th>
            </tr>
          </thead>
          <tbody>
            {faxes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">
                  No faxes sent yet.
                </td>
              </tr>
            ) : (
              faxes.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-[#0F3D2E]/5 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#0A0A0A]">
                      {f.recipientLabel ?? "—"}
                    </div>
                    <div className="font-mono text-xs text-[#6B7280]">
                      {f.recipientNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">{f.pageCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLE[f.status] ?? "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#3F3F46]">
                    {f.confirmationNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">
                    {fmt(f.sentAt)}
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

function BackLink() {
  return (
    <Link
      href="/admin/users"
      className="text-sm font-medium text-[#1B5E47] hover:underline"
    >
      ← Users
    </Link>
  );
}
