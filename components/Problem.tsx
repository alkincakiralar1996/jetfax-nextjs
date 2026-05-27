import { Reveal, Stagger, StaggerItem, staggerVariants } from "./Reveal";

const PAIN = [
  {
    title: "Driving to FedEx for one page",
    body: "30 minutes round-trip, $2 per page, plus the awkward chat at the counter.",
    stat: "$2",
    sub: "per page",
  },
  {
    title: "Apps that look like 2008",
    body: "Existing fax apps are clunky, slow, and full of upsell traps that nobody asked for.",
    stat: "★ 2.3",
    sub: "avg competitor rating",
  },
  {
    title: "Faxes that vanish",
    body: "No confirmation, no receipt, no idea if the form ever made it. Try explaining that to your doctor.",
    stat: "0%",
    sub: "delivery proof",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative border-y border-[#0F3D2E]/10 bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1B5E47]">
            The problem
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
            Faxing in 2026 is somehow still painful.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#3F3F46]">
            Your doctor needs the form today. Your lawyer needs the signed
            page. Your insurer wants it by 5. And none of them accept email.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PAIN.map((p) => (
            <StaggerItem
              key={p.title}
              variants={staggerVariants}
              className="group relative overflow-hidden rounded-2xl border border-[#D1D5DB] bg-[#FAFAF7] p-6 transition hover:border-[#0F3D2E]/30 hover:shadow-[0_12px_32px_rgba(15,61,46,0.06)]"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-[#DC2626]">
                  {p.stat}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#6B7280]">
                  {p.sub}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#0A0A0A]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3F3F46]">
                {p.body}
              </p>
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#FEE2E2]/40 blur-2xl transition group-hover:scale-110" />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F5EF] px-4 py-2 text-sm font-semibold text-[#1B5E47]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
            FaxJet fixes all three. Below.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
