import React from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { WORK_PROCESS_STEPS } from "../data/companyConfig";
import {
  EASE_SMOOTH,
  VIEWPORT_ONCE,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../lib/motion";
import {
  SymbolDiscoveryLens,
  SymbolCorporateSeal,
  SymbolEngineeringCore,
  SymbolLaunchRocket,
  SymbolSystemSupport,
} from "./RealisticIcons";
import { AmbientBackdrop } from "./AmbientBackdrop";

interface ProcessTimelineProps {
  openContactModal: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ openContactModal }) => {
  const stepIcons = [
    <SymbolDiscoveryLens className="w-6 h-6" />,
    <SymbolCorporateSeal className="w-6 h-6" />,
    <SymbolEngineeringCore className="w-6 h-6" />,
    <SymbolLaunchRocket className="w-6 h-6" />,
    <SymbolSystemSupport className="w-6 h-6" />,
  ];

  return (
    <section id="process" className="relative overflow-hidden py-16 sm:py-24 studio-section-primary border-b transition-colors">
      <AmbientBackdrop variant="section" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="max-w-3xl space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <span>5-STEP TIMELINE</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-emerald-700 dark:text-lime-400">STRUCTURED EXECUTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            How We Work: From Bottleneck to Tested System
          </h2>
          <p className="text-base sm:text-[1.0625rem] text-slate-600 dark:text-slate-300 leading-relaxed">
            No endless meetings or opaque black-box development. Every phase has clear documentation, testable code drops, and regular milestone verification check-ins.
          </p>
        </motion.div>

        {/* 5-Step Open Architectural Timeline */}
        <div className="relative pt-2">
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, ease: EASE_SMOOTH }}
            className="hidden md:block absolute top-8 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-blue-600/50 via-indigo-500/40 to-lime-500/60 pointer-events-none"
          />

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-7 relative"
          >
            {WORK_PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                variants={staggerItemVariants}
                className="group relative flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Step Node & Number */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl studio-tile flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500 dark:group-hover:border-lime-400 transition-all duration-200 relative z-10">
                      {stepIcons[idx]}
                    </div>
                    <span className="font-mono text-2xl font-extrabold text-slate-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-lime-400 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Header */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                      {step.tagline}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Description */}
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Open Status Footnote */}
                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                  <span>Documented Output</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Transparent SLA Summary Banner */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="relative overflow-hidden bg-gradient-to-r from-[#0F1B35] via-[#111827] to-[#0B0F17] border border-white/10 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]"
        >
          <AmbientBackdrop variant="banner" />
          <div className="relative z-10 space-y-1.5 max-w-2xl">
            <h4 className="text-lg font-bold text-white">
              Ready to automate your operations with predictable milestones?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule a 20-minute operational discovery call. We analyze your requirements and deliver a transparent technical blueprint within 48 hours.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={openContactModal}
            className="relative z-10 px-6 py-3 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-lime-50 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            Start Discovery Session
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};
