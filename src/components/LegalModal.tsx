import React, { useRef } from "react";
import { motion } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { COMPANY_INFO } from "../data/companyConfig";
import { modalBackdropVariants, modalPanelVariants } from "../lib/motion";
import { SymbolShieldGuard } from "./RealisticIcons";
import { ScrollProgressBar } from "./ScrollProgressBar";

interface LegalModalProps {
  type: "privacy" | "terms" | "guarantee" | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const legalScrollRef = useRef<HTMLDivElement>(null);
  if (!type) return null;

  return (
    <motion.div
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <motion.div
        variants={modalPanelVariants}
        className="relative w-full max-w-2xl max-h-[90dvh] flex flex-col studio-modal-panel rounded-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Pinned Header */}
        <div className="shrink-0 p-5 bg-gradient-to-b from-[#131924] to-[#0B0F17] text-white flex items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <SymbolShieldGuard className="w-6 h-6 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {type === "privacy" && "Privacy & Data Protection Policy"}
              {type === "terms" && "Terms of Service & Engagement"}
              {type === "guarantee" && "30-Day Milestone Guarantee & Refund Policy"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white hover:border-white/25 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
            aria-label="Close legal modal"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        <ScrollProgressBar containerRef={legalScrollRef} placement="viewport" />
        <ScrollProgressBar containerRef={legalScrollRef} placement="inline" />

        {/* Scrollable Body */}
        <div
          ref={legalScrollRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
        >
          {type === "guarantee" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-lime-400" />
                  <span>The 30-Day Milestone Commitment</span>
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  Under the corporate charter of {COMPANY_INFO.legalName}, every software deployment or digital deliverable is governed by unambiguous written acceptance criteria.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  1. Acceptance Criteria Verification
                </h4>
                <p>
                  Before work commences, a milestone specification sheet is shared and agreed with your team. This defines performance thresholds, functional buttons, API response times, and target device compatibility.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  2. Complimentary Rework Guarantee
                </h4>
                <p>
                  If any delivered code or asset fails to pass the agreed specifications during the 30-day review period, our engineering pod will revise, debug, and redeploy at zero additional cost to your business.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  3. Engagement & Cancellation Policy
                </h4>
                <p>
                  All engagements are documented under {COMPANY_INFO.legalName} (CIN: {COMPANY_INFO.cin}). If a client decides to discontinue prior to milestone sprint initiation, unallocated deposits are returned within 5 banking days.
                </p>
              </div>
            </div>
          )}

          {type === "privacy" && (
            <div className="space-y-4">
              <p>
                {COMPANY_INFO.legalName} (&ldquo;Xelvion&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) values the confidentiality of Indian business operations. We maintain strict data residency and isolation protocols.
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  1. Non-Disclosure & Data Sovereignty
                </h4>
                <p>
                  All supplier catalogs, client database dumps, and dispatch manifests shared with our team are stored on isolated, encrypted volumes within Indian cloud regions (AWS Mumbai / GCP Delhi). Your data is never sold, leased, or shared.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  2. No AI Training on Proprietary Data
                </h4>
                <p>
                  Our AI Data Filter tools and scripts execute on private models. Your customer lists and proprietary inventory files are never fed into public LLM training sets.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  3. Data Deletion Right
                </h4>
                <p>
                  Upon project completion or contract termination, clients may request permanent cryptographic erasure of all staging backups and source assets within 48 hours.
                </p>
              </div>
            </div>
          )}

          {type === "terms" && (
            <div className="space-y-4">
              <p>
                These terms govern all engineering engagements and consulting agreements executed with {COMPANY_INFO.legalName}.
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  1. Scope of Services
                </h4>
                <p>
                  Xelvion provides custom engineering strictly within its 10 declared service lines. We do not provide or resell generic off-the-shelf CRM or ERP packages.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  2. Intellectual Property
                </h4>
                <p>
                  Upon settlement of milestone invoices, all bespoke source code, database schemas, graphic assets, and bot scripts become the exclusive intellectual property of the client.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  3. Governing Jurisdiction
                </h4>
                <p>
                  This agreement is governed by the laws of India, under the jurisdiction of courts in Bengaluru, Karnataka.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Footer */}
        <div className="shrink-0 p-4 studio-recessed border-t border-b-0 border-x-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
