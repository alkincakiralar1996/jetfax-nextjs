import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

async function createFaq(formData: FormData) {
  "use server";
  const db = getDb();
  await db.insert(schema.faq).values({
    question: ((formData.get("question") as string) || "").trim(),
    answer: ((formData.get("answer") as string) || "").trim(),
    category: ((formData.get("category") as string) || "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  });
  revalidatePath("/admin/faq");
}

async function updateFaq(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const db = getDb();
  await db
    .update(schema.faq)
    .set({
      question: ((formData.get("question") as string) || "").trim(),
      answer: ((formData.get("answer") as string) || "").trim(),
      category: ((formData.get("category") as string) || "").trim() || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
      published: formData.get("published") === "on",
      updatedAt: new Date(),
    })
    .where(eq(schema.faq.id, id));
  revalidatePath("/admin/faq");
}

async function deleteFaq(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const db = getDb();
  await db.delete(schema.faq).where(eq(schema.faq.id, id));
  revalidatePath("/admin/faq");
}

const inputCls =
  "w-full rounded-lg border border-[#0F3D2E]/15 bg-white px-3 py-2 text-sm text-[#0A0A0A] outline-none transition focus:border-[#0F3D2E]/40";

export default async function AdminFaq() {
  let rows: (typeof schema.faq.$inferSelect)[] = [];
  let dbError = false;
  try {
    const db = getDb();
    rows = await db
      .select()
      .from(schema.faq)
      .orderBy(asc(schema.faq.sortOrder), asc(schema.faq.createdAt));
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help Center / FAQ</h1>
        <p className="mt-4 rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          Database not reachable. Set DATABASE_URL + run db:push.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Help Center / FAQ</h1>
        <span className="text-sm text-[#6B7280]">{rows.length} entries</span>
      </div>
      <p className="mt-1 text-sm text-[#6B7280]">
        Published entries appear in the app&apos;s Help Center.
      </p>

      {/* Create */}
      <form
        action={createFaq}
        className="mt-6 flex flex-col gap-3 rounded-xl border border-[#0F3D2E]/10 bg-white p-5"
      >
        <div className="text-sm font-semibold text-[#0A0A0A]">New entry</div>
        <input name="question" placeholder="Question" className={inputCls} required />
        <textarea name="answer" placeholder="Answer" rows={3} className={inputCls} required />
        <div className="flex gap-3">
          <input name="category" placeholder="Category" className={inputCls} />
          <input
            name="sortOrder"
            type="number"
            defaultValue={(rows.length + 1) * 1}
            placeholder="Sort"
            className="w-24 rounded-lg border border-[#0F3D2E]/15 bg-white px-3 py-2 text-sm outline-none"
          />
          <label className="flex shrink-0 items-center gap-2 text-sm text-[#3F3F46]">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-[#0F3D2E]" />
            Published
          </label>
        </div>
        <button
          type="submit"
          className="self-start rounded-lg bg-[#0F3D2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1B5E47]"
        >
          Add entry
        </button>
      </form>

      {/* Existing */}
      <div className="mt-6 flex flex-col gap-4">
        {rows.map((f) => (
          <form
            key={f.id}
            action={updateFaq}
            className="flex flex-col gap-3 rounded-xl border border-[#0F3D2E]/10 bg-white p-5"
          >
            <input type="hidden" name="id" value={f.id} />
            <input name="question" defaultValue={f.question} className={inputCls} />
            <textarea name="answer" defaultValue={f.answer} rows={3} className={inputCls} />
            <div className="flex flex-wrap items-center gap-3">
              <input
                name="category"
                defaultValue={f.category ?? ""}
                placeholder="Category"
                className={inputCls + " flex-1"}
              />
              <input
                name="sortOrder"
                type="number"
                defaultValue={f.sortOrder}
                className="w-24 rounded-lg border border-[#0F3D2E]/15 bg-white px-3 py-2 text-sm outline-none"
              />
              <label className="flex items-center gap-2 text-sm text-[#3F3F46]">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={f.published}
                  className="h-4 w-4 accent-[#0F3D2E]"
                />
                Published
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[#0F3D2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1B5E47]"
              >
                Save
              </button>
              <button
                type="submit"
                formAction={deleteFaq}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2]"
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
