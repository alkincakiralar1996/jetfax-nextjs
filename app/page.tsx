import Link from "next/link";

const features = [
  {
    title: "Send a fax in 60 seconds",
    body: "Snap a photo, enter the number, hit send. We handle the rest.",
  },
  {
    title: "Delivery confirmation",
    body: "Get a PDF receipt with a confirmation number on every transmission.",
  },
  {
    title: "HIPAA-compliant gateway",
    body: "Encrypted in transit. Trusted by medical, legal, and financial professionals.",
  },
  {
    title: "No machine, no store",
    body: "Scan paper documents straight from your iPhone camera. Auto-deskew + sharpen.",
  },
];

const stats = [
  { label: "Average delivery", value: "52s" },
  { label: "Failed fax fee", value: "$0" },
  { label: "Encryption", value: "256-bit" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-[#FAFAF7] text-[#0A0A0A]">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 pb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <PaperPlane className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">FaxJet</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-[#3F3F46] sm:flex">
          <a href="#features" className="hover:text-[#1B5E47]">
            Features
          </a>
          <a href="#pricing" className="hover:text-[#1B5E47]">
            Pricing
          </a>
          <Link href="/privacy" className="hover:text-[#1B5E47]">
            Privacy
          </Link>
          <Link href="/support" className="hover:text-[#1B5E47]">
            Support
          </Link>
        </nav>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-[#0F3D2E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1B5E47]"
        >
          Get on iPhone
        </a>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pt-12 pb-24 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F5EF] px-3 py-1 text-xs font-semibold tracking-wide text-[#1B5E47]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
            HIPAA-compliant · Made for iPhone
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-[#0A0A0A] sm:text-6xl">
            Send a fax in 60 seconds.{" "}
            <span className="text-[#1B5E47]">From your phone.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#3F3F46]">
            FaxJet is the fastest way to send a fax from your iPhone. No machine,
            no store, no paper. Scan, send, and get a delivery receipt — all in
            under a minute.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFB020] px-6 text-base font-semibold text-[#0A0A0A] shadow-[0_4px_16px_rgba(255,176,32,0.35)] hover:bg-[#ffba34]"
            >
              <AppleIcon className="h-5 w-5" />
              Download on the App Store
            </a>
            <a
              href="#features"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] bg-white px-6 text-base font-semibold text-[#0F3D2E] hover:border-[#1B5E47]"
            >
              See how it works
            </a>
          </div>
          <p className="text-sm text-[#6B7280]">
            3-day free trial · $9.99/week · Cancel anytime
          </p>
        </div>

        <PaperPlane
          aria-hidden
          className="pointer-events-none absolute -right-12 top-12 h-72 w-72 opacity-90 sm:right-12 sm:top-16 sm:h-96 sm:w-96"
        />
      </section>

      {/* Stat strip */}
      <section className="border-y border-[#D1D5DB] bg-white">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 divide-y divide-[#D1D5DB] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center px-8 py-8 text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-[#0F3D2E]">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-[#6B7280]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
          Built for professionals who still get asked to fax.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[#3F3F46]">
          Medical, legal, tax, and insurance offices still rely on fax. We made
          sending one as fast as a text.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[#D1D5DB] bg-white p-6 transition hover:border-[#1B5E47] hover:shadow-[0_8px_24px_rgba(15,61,46,0.08)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F5EF] text-[#1B5E47]">
                <CheckIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0A0A0A]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3F3F46]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-t border-[#D1D5DB] bg-[#0F3D2E] text-white"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            One price. Unlimited faxes.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#CFE8DA]">
            Start with a 3-day free trial. Cancel from Settings anytime — no
            phone calls, no hoops.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold uppercase tracking-wider text-[#CFE8DA]">
                Single fax
              </div>
              <div className="mt-3 text-3xl font-bold">$4.99</div>
              <div className="mt-1 text-sm text-[#CFE8DA]">one-time</div>
              <p className="mt-6 text-sm text-white/70">
                Send a one-off fax without a subscription.
              </p>
            </div>
            <div className="relative rounded-2xl border-2 border-[#FFB020] bg-[#E8F5EF] p-6 text-[#0A0A0A] shadow-[0_8px_24px_rgba(15,61,46,0.18)]">
              <span className="absolute -top-3 left-4 rounded-full bg-[#FFB020] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                Most Popular
              </span>
              <div className="text-sm font-semibold uppercase tracking-wider text-[#1B5E47]">
                Unlimited Weekly
              </div>
              <div className="mt-3 text-3xl font-bold">$9.99</div>
              <div className="mt-1 text-sm text-[#3F3F46]">per week</div>
              <p className="mt-6 text-sm text-[#3F3F46]">
                3-day free trial. Send unlimited faxes anywhere in the US.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
              <div className="text-sm font-semibold uppercase tracking-wider text-[#CFE8DA]">
                Unlimited Monthly
              </div>
              <div className="mt-3 text-3xl font-bold">$19.99</div>
              <div className="mt-1 text-sm text-[#CFE8DA]">per month</div>
              <p className="mt-6 text-sm text-white/70">
                Save 50% versus weekly. Same unlimited delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop driving to FedEx.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#3F3F46]">
          FaxJet sends, confirms, and saves a receipt — all in under a minute.
        </p>
        <a
          href="#"
          className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFB020] px-8 text-base font-semibold text-[#0A0A0A] shadow-[0_4px_16px_rgba(255,176,32,0.35)] hover:bg-[#ffba34]"
        >
          <AppleIcon className="h-5 w-5" />
          Download FaxJet
        </a>
      </section>

      <Footer />
    </main>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#D1D5DB] bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <PaperPlane className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-tight">FaxJet</span>
          <span className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} Pyxa Studio
          </span>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-[#3F3F46]">
          <Link href="/privacy" className="hover:text-[#1B5E47]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#1B5E47]">
            Terms
          </Link>
          <Link href="/support" className="hover:text-[#1B5E47]">
            Support
          </Link>
          <a
            href="mailto:support@pyxastudio.com"
            className="hover:text-[#1B5E47]"
          >
            support@pyxastudio.com
          </a>
        </nav>
      </div>
    </footer>
  );
}

function PaperPlane({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      {...props}
    >
      <g transform="rotate(-22 120 120)">
        <g stroke="#FFB020" strokeWidth="11" strokeLinecap="round">
          <line x1="40" y1="155" x2="105" y2="155" />
          <line x1="55" y1="135" x2="100" y2="135" opacity="0.9" />
          <line x1="68" y1="175" x2="98" y2="175" opacity="0.75" />
        </g>
        <g fill="#0F3D2E">
          <path d="M120 60 L205 90 L130 135 Z" />
          <path d="M120 60 L130 135 L102 165 Z" opacity="0.88" />
          <path d="M102 165 L130 135 L205 90 L155 175 Z" opacity="0.78" />
        </g>
      </g>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.78.93-2.075 1.65-3.05 1.65-.107 0-.214-.015-.235-.022-.013-.06-.044-.244-.044-.45 0-1.13.583-2.21 1.196-2.92.738-.83 1.99-1.49 3.02-1.55.043.18.29.21.29.21zM21 17.1c-.6 1.34-.876 1.94-1.65 3.12-1.083 1.66-2.61 3.74-4.5 3.76-1.67.02-2.1-1.08-4.36-1.07-2.27.01-2.74 1.09-4.41 1.07-1.89-.02-3.34-1.9-4.43-3.56C.95 18.34.1 14.6 1.45 12.07c.95-1.78 2.45-2.91 4.05-2.93 1.63-.03 3.17 1.1 4.18 1.1 1.01 0 2.88-1.36 4.86-1.16.83.04 3.14.34 4.63 2.5-4.06 2.22-3.4 8.05.83 9.52z" />
    </svg>
  );
}
