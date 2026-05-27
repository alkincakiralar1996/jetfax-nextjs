import { Reveal, Stagger, StaggerItem, staggerVariants } from "./Reveal";

const CASES = [
  {
    emoji: "🏥",
    title: "Medical",
    body: "Patient intake, prescriptions, referrals, lab results. HIPAA-compliant gateway means your office stays compliant.",
    examples: ["Patient forms", "Prescriptions", "Records release"],
  },
  {
    emoji: "⚖️",
    title: "Legal",
    body: "Signed contracts, court filings, settlement letters. Receipts with confirmation numbers stand up to audit.",
    examples: ["Contracts", "Court documents", "NDA signatures"],
  },
  {
    emoji: "💰",
    title: "Tax & Finance",
    body: "IRS forms, lender authorizations, lender comp packets. Send during tax season without leaving your desk.",
    examples: ["IRS 8821", "Lender packets", "Power of attorney"],
  },
  {
    emoji: "🏢",
    title: "Insurance & Claims",
    body: "Adjuster paperwork, claim attachments, supporting evidence. Confirmation receipts kill the “we never got it” excuse.",
    examples: ["Claim forms", "Adjuster docs", "Subrogation"],
  },
  {
    emoji: "💼",
    title: "Small business",
    body: "Lease addenda, vendor agreements, payroll authorizations — everything your accountant or bank still wants by fax.",
    examples: ["Lease addenda", "Vendor docs", "Payroll auth"],
  },
  {
    emoji: "📋",
    title: "Anything else",
    body: "If someone still has a fax machine, we can reach it. US and Canada in v1. More countries coming.",
    examples: ["Personal forms", "Government filings", "Schools"],
  },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative border-y border-[#0F3D2E]/10 bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1B5E47]">
            Who it&apos;s for
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
            Built for the people who still get told &ldquo;just fax it over.&rdquo;
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <StaggerItem
              key={c.title}
              variants={staggerVariants}
              className="group rounded-2xl border border-[#D1D5DB] bg-[#FAFAF7] p-6 transition hover:-translate-y-0.5 hover:border-[#1B5E47]/40 hover:shadow-[0_12px_32px_rgba(15,61,46,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-[#0F3D2E]/8">
                {c.emoji}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#0A0A0A]">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3F3F46]">
                {c.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.examples.map((e) => (
                  <li
                    key={e}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1B5E47] ring-1 ring-[#1B5E47]/15"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
