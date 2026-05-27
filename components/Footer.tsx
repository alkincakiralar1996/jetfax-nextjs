import Link from "next/link";
import { PaperPlane } from "./Brand";

export function Footer() {
  return (
    <footer className="border-t border-[#0F3D2E]/10 bg-white">
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
