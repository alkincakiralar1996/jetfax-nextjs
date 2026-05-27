"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { PaperPlane, AppleIcon } from "./Brand";

const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#how", label: "How it works" },
  { href: "#use-cases", label: "For" },
  { href: "#versus", label: "Compare" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const padY = useTransform(scrollY, [0, 80], [20, 10]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 24));
  }, [scrollY]);

  return (
    <motion.header
      style={{ paddingTop: padY, paddingBottom: padY }}
      className="sticky top-0 z-50 backdrop-blur-md transition-colors"
    >
      <motion.div
        style={{
          backgroundColor: scrolled
            ? "rgba(250,250,247,0.85)"
            : "rgba(250,250,247,0)",
        }}
        className="absolute inset-0"
      />
      <motion.div
        style={{ opacity: borderOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#0F3D2E]/10"
      />
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group relative flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="block h-8 w-8"
          >
            <PaperPlane className="h-8 w-8" />
          </motion.span>
          <span className="text-lg font-semibold tracking-tight">FaxJet</span>
        </Link>
        <nav className="hidden gap-1 text-sm text-[#3F3F46] md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative rounded-full px-3 py-1.5 transition-colors hover:text-[#0F3D2E]"
            >
              <span className="relative z-10">{l.label}</span>
              <span className="absolute inset-0 -z-0 rounded-full bg-[#E8F5EF] opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </nav>
        <motion.a
          href="#download"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#0F3D2E] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(15,61,46,0.18)] hover:bg-[#1B5E47]"
        >
          <AppleIcon className="h-4 w-4" />
          Get on iPhone
        </motion.a>
      </div>
    </motion.header>
  );
}
