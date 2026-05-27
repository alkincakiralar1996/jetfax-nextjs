import { Reveal, Stagger, StaggerItem, staggerVariants } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Scan or pick a document",
    body: "Tap Scan and point your phone at any page. We auto-deskew, sharpen, and convert. Or pick from Photos / Files.",
  },
  {
    n: "02",
    title: "Enter the recipient number",
    body: "US + Canada supported. Add an optional cover page with To / From / Subject / Message.",
  },
  {
    n: "03",
    title: "Hit Send",
    body: "Watch the progress live. Most faxes complete in 30–90 seconds. We retry on transient line errors automatically.",
  },
  {
    n: "04",
    title: "Get a PDF receipt",
    body: "Confirmation number, page count, transmission time, recipient — saved to your device and your fax history.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1B5E47]">
            How it works
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
            Four taps from your couch to their fax machine.
          </h2>
        </Reveal>

        <Stagger className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* connector line — only visible on lg */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[#1B5E47]/25 to-transparent lg:block" />
          {STEPS.map((s) => (
            <StaggerItem
              key={s.n}
              variants={staggerVariants}
              className="relative"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F3D2E] text-base font-bold text-white shadow-[0_8px_22px_rgba(15,61,46,0.22)]">
                {s.n}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#0A0A0A]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3F3F46]">
                {s.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
