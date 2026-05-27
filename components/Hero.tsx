"use client";

import { motion } from "motion/react";
import { PaperPlane, AppleIcon } from "./Brand";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* gradient blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#E8F5EF] blur-3xl"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-12 h-80 w-80 rounded-full bg-[#FFF4DD] blur-3xl"
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pt-12 pb-24 sm:pt-20">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#1B5E47] shadow-sm ring-1 ring-[#1B5E47]/15"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFB020] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
          </span>
          HIPAA-compliant · Made for iPhone
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-[#0A0A0A] sm:text-6xl"
        >
          Send a fax in 60 seconds.{" "}
          <span className="text-[#1B5E47]">From your phone.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-2xl text-lg leading-relaxed text-[#3F3F46]"
        >
          FaxJet is the fastest way to send a fax from your iPhone. No machine,
          no store, no paper. Scan, send, and get a delivery receipt — all in
          under a minute.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <motion.a
            id="download"
            href="#"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFB020] px-6 text-base font-semibold text-[#0A0A0A] shadow-[0_8px_28px_rgba(255,176,32,0.35)] hover:bg-[#ffba34]"
          >
            <AppleIcon className="h-5 w-5" />
            Download on the App Store
          </motion.a>
          <a
            href="#how"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] bg-white/70 px-6 text-base font-semibold text-[#0F3D2E] backdrop-blur transition hover:border-[#1B5E47] hover:bg-white"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm text-[#6B7280]"
        >
          Failed fax? No charge. Always.
        </motion.p>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-12 right-0 hidden h-[420px] w-[420px] sm:right-8 sm:top-16 sm:block"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <PaperPlane className="h-full w-full" />
      </motion.div>
    </section>
  );
}
