"use client";

import { motion } from "motion/react";
import { PaperPlaneWhite, AppleIcon } from "./Brand";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative overflow-hidden rounded-3xl bg-[#0F3D2E] px-8 py-16 text-center text-white shadow-[0_28px_60px_rgba(15,61,46,0.25)] sm:px-16 sm:py-20"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 opacity-70 sm:h-64 sm:w-64"
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <PaperPlaneWhite className="h-full w-full" />
          </motion.div>

          <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-[#FFB020]">
            Stop driving to FedEx
          </p>
          <h2 className="relative mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Send your next fax in 60 seconds.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-[#CFE8DA]">
            Free for 3 days. Cancel anytime — straight from iOS Settings, no
            phone calls.
          </p>
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#"
            className="relative mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFB020] px-8 text-base font-semibold text-[#0A0A0A] shadow-[0_10px_28px_rgba(255,176,32,0.45)] hover:bg-[#ffba34]"
          >
            <AppleIcon className="h-5 w-5" />
            Download FaxJet
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
