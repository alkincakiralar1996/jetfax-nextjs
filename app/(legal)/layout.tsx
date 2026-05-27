import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col bg-[#FAFAF7] text-[#0A0A0A]">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8 pb-6">
        <Link href="/" className="flex items-center gap-2">
          <PaperPlane className="h-7 w-7" />
          <span className="text-base font-semibold tracking-tight">
            FaxJet
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-[#1B5E47] hover:underline"
        >
          ← Back home
        </Link>
      </header>

      <article className="mx-auto w-full max-w-3xl px-6 py-12 text-[#0A0A0A]">
        {children}
      </article>

      <footer className="border-t border-[#D1D5DB] bg-white">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start justify-between gap-2 px-6 py-8 sm:flex-row">
          <span className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} Pyxa Studio
          </span>
          <nav className="flex gap-4 text-xs text-[#3F3F46]">
            <Link href="/privacy" className="hover:text-[#1B5E47]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#1B5E47]">
              Terms
            </Link>
            <Link href="/support" className="hover:text-[#1B5E47]">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className}>
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
