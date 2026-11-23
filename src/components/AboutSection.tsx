import React from "react";
import { motion } from "motion/react";
import { COMPANY_INFO } from "../data/companyConfig";
import {
  VIEWPORT_ONCE,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../lib/motion";
import {
  SymbolCorporateSeal,
  SymbolShieldGuard,
  SymbolLogisticsFleet,
} from "./RealisticIcons";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 studio-section-alt border-b transition-colors overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-grain" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-arch-grid opacity-45"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="max-w-3xl space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-lime-400 uppercase tracking-wider">
            <span>ABOUT XELVION</span>
            <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">/</span>
            <span>CORPORATE IDENTITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Building Real Engineering Foundations for Indian SMEs
          </h2>
          <p className="text-base sm:text-[1.0625rem] text-slate-600 dark:text-slate-300 leading-relaxed">
            {COMPANY_INFO.legalName} was incorporated with a direct mission: bring institutional-grade software stability, cloud security, and automation to small and mid-market Indian enterprises with clear operational focus.
          </p>
        </motion.div>

        {/* Open Editorial Narrative & Values Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-4">
          {/* Mission & Story (7 cols) */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7 border-t-2 border-blue-700 dark:border-lime-400 pt-7 space-y-6"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-lime-400 block">
                Engineering Manifesto
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                Our Story: Why We Refuse &ldquo;Vanity Tech&rdquo;
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Too many Indian businesses have been burned by digital marketing agencies selling inflated vanity metrics or freelancers who abandon custom codebases as soon as an unhandled exception occurs.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                At Xelvion, we do not build generic cookie-cutter templates. We examine your actual operational choke points—whether it is a dispatch truck stuck at a border checkpost without signal, or 40 incompatible supplier spreadsheets requiring 12 hours of weekly manual sorting—and engineer hardened, maintainable solutions.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Registered Entity
                </span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white block">
                  CIN: {COMPANY_INFO.cin}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Core Philosophy
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300 block">
                  Zero black-box code. Full documentation and source ownership.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Open Hairline-Divided Values (5 cols) */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-5 divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800"
          >
            <motion.div variants={staggerItemVariants} className="group py-5 flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <SymbolCorporateSeal className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Honest Engineering Scope
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  If your requirement is outside our 10 focused services (such as generic ERPs or custom blockchain), we will tell you upfront instead of accepting retainers for services we do not champion.
                </p>
              </div>
            </motion.div>

            <motion.div variants={staggerItemVariants} className="group py-5 flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <SymbolShieldGuard className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Direct Engineering Accountability
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You communicate directly with system architects and engineers on our desk, eliminating the frustration of non-technical account middle-men.
                </p>
              </div>
            </motion.div>

            <motion.div variants={staggerItemVariants} className="group py-5 flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <SymbolLogisticsFleet className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Dual Office Footprint
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Engineering lab headquartered in Bellandur, Bengaluru; Northern operations and industrial logistics desk located in Electronic City, Noida.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
