import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { FAQS_LIST } from "../data/companyConfig";
import { EASE_SMOOTH, VIEWPORT_ONCE, fadeUpVariants } from "../lib/motion";
import { SymbolDiscoveryLens } from "./RealisticIcons";

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative py-16 sm:py-24 studio-section-alt border-b transition-colors overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-grain" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 dark:text-lime-400 uppercase tracking-wider">
            <SymbolDiscoveryLens className="w-4 h-4" />
            <span>TRANSPARENCY FIRST</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Clear answers on our service boundaries, delivery milestones, and 30-day guarantee.
          </p>
        </motion.div>

        {/* Clean Hairline-Divided Editorial Accordion (No Boxy Cards) */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800"
        >
          {FAQS_LIST.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full py-5 text-left flex items-center justify-between gap-4 group"
                >
                  <span
                    className={`text-base sm:text-lg font-bold transition-colors ${
                      isOpen
                        ? "text-blue-700 dark:text-lime-400"
                        : "text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.24, ease: EASE_SMOOTH }}
                    className="p-1 text-slate-500 dark:text-slate-400 shrink-0"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-colors ${
                        isOpen ? "text-blue-600 dark:text-lime-400" : ""
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: EASE_SMOOTH }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pr-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
