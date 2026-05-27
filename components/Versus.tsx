import { Reveal } from "./Reveal";
import { CheckIcon } from "./Brand";

const ROWS = [
  {
    label: "Send time",
    faxjet: "60 seconds",
    fedex: "30+ min round-trip",
    efax: "5–10 min UX maze",
    yes: ["faxjet"],
  },
  {
    label: "Price per fax",
    faxjet: "Unlimited included",
    fedex: "$2/page",
    efax: "Hidden tiers",
    yes: ["faxjet"],
  },
  {
    label: "Delivery confirmation",
    faxjet: "PDF receipt + #",
    fedex: "Paper receipt",
    efax: "Email, maybe",
    yes: ["faxjet"],
  },
  {
    label: "HIPAA-compliant",
    faxjet: "Yes",
    fedex: "Depends on store",
    efax: "Some tiers",
    yes: ["faxjet"],
  },
  {
    label: "Free trial",
    faxjet: "3 days",
    fedex: "—",
    efax: "Card-walled",
    yes: ["faxjet"],
  },
  {
    label: "Failed fax fee",
    faxjet: "$0",
    fedex: "Still $2",
    efax: "Credit-burned",
    yes: ["faxjet"],
  },
  {
    label: "Modern iPhone UI",
    faxjet: "Yes",
    fedex: "—",
    efax: "2008 vibes",
    yes: ["faxjet"],
  },
];

export function Versus() {
  return (
    <section id="versus" className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1B5E47]">
            How we compare
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
            FaxJet vs. driving to FedEx (or every other fax app).
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-12 overflow-x-auto">
          <div className="min-w-[720px] overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white shadow-[0_18px_42px_rgba(15,61,46,0.06)]">
            <div className="grid grid-cols-4 bg-[#0F3D2E] text-sm font-semibold uppercase tracking-wider text-white">
              <div className="px-5 py-4">Feature</div>
              <div className="relative px-5 py-4">
                <span className="absolute -top-2 right-3 rounded-full bg-[#FFB020] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#0A0A0A]">
                  Best
                </span>
                FaxJet
              </div>
              <div className="px-5 py-4 text-[#CFE8DA]">FedEx run</div>
              <div className="px-5 py-4 text-[#CFE8DA]">eFax / iFax</div>
            </div>
            {ROWS.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-4 border-t border-[#0F3D2E]/8 text-sm ${
                  i % 2 ? "bg-[#FAFAF7]" : "bg-white"
                }`}
              >
                <div className="px-5 py-4 font-semibold text-[#0A0A0A]">
                  {r.label}
                </div>
                <Cell value={r.faxjet} highlight={r.yes.includes("faxjet")} />
                <Cell value={r.fedex} muted />
                <Cell value={r.efax} muted />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Cell({
  value,
  highlight = false,
  muted = false,
}: {
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-5 py-4 ${
        highlight
          ? "bg-[#E8F5EF] font-semibold text-[#0F3D2E]"
          : muted
            ? "text-[#6B7280]"
            : "text-[#0A0A0A]"
      }`}
    >
      {highlight ? <CheckIcon className="h-4 w-4 text-[#1B5E47]" /> : null}
      <span>{value}</span>
    </div>
  );
}
