"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "./Reveal";

const ITEMS = [
  {
    q: "How long does a fax take to deliver?",
    a: "Most faxes complete in 30 to 90 seconds. Larger documents and busy lines can take a few minutes. You'll see live progress while it sends.",
  },
  {
    q: "What happens if a fax fails?",
    a: "Failed transmissions are not charged. We retry transient line errors automatically. You'll see the specific failure reason (busy, no answer, line interrupted) and can retry with one tap.",
  },
  {
    q: "Is it really HIPAA-compliant?",
    a: "Yes. FaxJet uses a HIPAA-compliant fax gateway with end-to-end encryption. Healthcare providers can email hipaa@pyxastudio.com to request a signed Business Associate Agreement.",
  },
  {
    q: "Can I send international faxes?",
    a: "v1 supports the United States and Canada. UK, Germany, France, and Australia are next on the roadmap.",
  },
  {
    q: "Do you store my documents?",
    a: "No. Document content is deleted from our servers once the transmission outcome is finalized. Only the delivery receipt (recipient number, page count, confirmation number, outcome) is retained for your records.",
  },
  {
    q: "How do I cancel?",
    a: "iOS Settings › your Apple ID › Subscriptions › FaxJet › Cancel. No phone calls, no support tickets. The change takes effect at the end of the current billing period.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-y border-[#0F3D2E]/10 bg-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1B5E47]">
            Questions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
            Asked. Answered.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-[#0F3D2E]/10 overflow-hidden rounded-2xl border border-[#0F3D2E]/10 bg-[#FAFAF7]">
          {ITEMS.map((item, i) => (
            <FaqRow key={item.q} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqRow({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="bg-white"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#FAFAF7]"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[#0A0A0A]">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 20 }}
          className="text-2xl leading-none text-[#1B5E47]"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-[#3F3F46]">
              {a}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
