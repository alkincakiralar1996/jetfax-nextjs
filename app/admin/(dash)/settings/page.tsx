import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  id: 1,
  appStoreUrl: "https://apps.apple.com/app/id6773434191",
  privacyUrl: "https://jetfax-nextjs.vercel.app/privacy",
  termsUrl: "https://jetfax-nextjs.vercel.app/terms",
  supportUrl: "https://jetfax-nextjs.vercel.app/support",
  maintenanceMode: false,
};

async function loadSettings() {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.id, 1))
    .limit(1);
  if (rows.length === 0) {
    const seeded = await db
      .insert(schema.settings)
      .values(DEFAULTS)
      .returning();
    return seeded[0]!;
  }
  return rows[0]!;
}

async function saveSettings(formData: FormData) {
  "use server";
  const db = getDb();
  const values = {
    id: 1,
    appStoreUrl: (formData.get("appStoreUrl") as string) || null,
    privacyUrl: (formData.get("privacyUrl") as string) || null,
    termsUrl: (formData.get("termsUrl") as string) || null,
    supportUrl: (formData.get("supportUrl") as string) || null,
    updatedAt: new Date(),
  };
  await db
    .insert(schema.settings)
    .values(values)
    .onConflictDoUpdate({ target: schema.settings.id, set: values });
  revalidatePath("/admin/settings");
}

export default async function AdminSettings() {
  let s;
  try {
    s = await loadSettings();
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-[#6B7280]">
        Singleton config the mobile app reads at boot.
      </p>

      <form action={saveSettings} className="mt-6 flex flex-col gap-5">
        <Field
          label="App Store URL"
          name="appStoreUrl"
          defaultValue={s.appStoreUrl ?? ""}
        />
        <Field
          label="Privacy URL"
          name="privacyUrl"
          defaultValue={s.privacyUrl ?? ""}
        />
        <Field
          label="Terms URL"
          name="termsUrl"
          defaultValue={s.termsUrl ?? ""}
        />
        <Field
          label="Support URL"
          name="supportUrl"
          defaultValue={s.supportUrl ?? ""}
        />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-lg bg-[#0F3D2E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B5E47]"
          >
            Save changes
          </button>
          <span className="text-xs text-[#6B7280]">
            Updated {new Date(s.updatedAt).toLocaleString("en-US")}
          </span>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        {label}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="rounded-lg border border-[#0F3D2E]/15 bg-white px-3 py-2.5 text-sm text-[#0A0A0A] outline-none transition focus:border-[#0F3D2E]/40"
      />
    </label>
  );
}
