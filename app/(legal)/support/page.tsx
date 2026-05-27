import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support · FaxJet",
};

const FAQ = [
  {
    q: "How long does a fax take to deliver?",
    a: "Most faxes complete in 30–90 seconds. Larger documents and busy recipient lines can take longer.",
  },
  {
    q: "What happens if my fax fails?",
    a: "You are not charged for a failed transmission. FaxJet shows the specific failure reason (line busy, no answer, interrupted) and lets you retry with one tap.",
  },
  {
    q: "Is FaxJet HIPAA compliant?",
    a: "Yes. Documents are encrypted in transit and transmitted via a HIPAA-compliant fax gateway. Healthcare providers can email hipaa@pyxastudio.com to request a Business Associate Agreement.",
  },
  {
    q: "Can I send a fax to international numbers?",
    a: "v1 supports the United States and Canada. Additional countries will roll out in a future update.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Open iOS Settings › tap your Apple ID › Subscriptions › FaxJet › Cancel. The change takes effect at the end of the current billing period.",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-none">
      <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A]">
        Support
      </h1>
      <p className="mt-4 text-base text-[#3F3F46]">
        Real humans, real fast. Email{" "}
        <a
          href="mailto:support@pyxastudio.com"
          className="text-[#1B5E47] underline"
        >
          support@pyxastudio.com
        </a>{" "}
        and we&apos;ll get back to you within one business day.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">
          Frequently asked
        </h2>
        <div className="mt-6 divide-y divide-[#D1D5DB] rounded-2xl border border-[#D1D5DB] bg-white">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#0A0A0A]">
                {item.q}
                <span className="text-[#1B5E47] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#3F3F46]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-[#1B5E47]/30 bg-[#E8F5EF] p-6">
        <h2 className="text-lg font-semibold text-[#0F3D2E]">
          Need a refund?
        </h2>
        <p className="mt-2 text-sm text-[#1B5E47]">
          Apple handles all refunds for App Store purchases. Visit{" "}
          <a
            href="https://reportaproblem.apple.com"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            reportaproblem.apple.com
          </a>{" "}
          and select FaxJet to submit a refund request.
        </p>
      </section>
    </div>
  );
}
