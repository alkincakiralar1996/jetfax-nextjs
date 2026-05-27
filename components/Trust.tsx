import { Reveal, Stagger, StaggerItem, staggerVariants } from "./Reveal";

const PILLARS = [
  {
    title: "HIPAA-compliant gateway",
    body: "Built on a regulated carrier with the controls medical, legal, and financial offices require.",
  },
  {
    title: "256-bit encryption",
    body: "Documents are encrypted in transit. Nothing leaves your device unencrypted.",
  },
  {
    title: "No third-party tracking",
    body: "No advertising SDKs. No analytics tied to you. We don’t sell your data — ever.",
  },
  {
    title: "Documents not stored",
    body: "We delete document content after delivery. Only the delivery receipt is retained.",
  },
];

export function Trust() {
  return (
    <section className="relative bg-[#0F3D2E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,176,32,0.18),transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFB020]">
            Trust
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for people whose paperwork actually matters.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#CFE8DA]">
            We’re the fax app medical, legal, and financial offices can
            actually deploy. Encryption end-to-end, HIPAA-compliant carriers,
            zero tracking, zero retention of document content.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PILLARS.map((p) => (
            <StaggerItem
              key={p.title}
              variants={staggerVariants}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB020] text-[#0A0A0A]">
                  <ShieldIcon className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#CFE8DA]">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5l-8-3z" />
    </svg>
  );
}
