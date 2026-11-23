import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  X,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Layers,
  FileText,
  Share2,
  Check,
  Bookmark,
} from "lucide-react";
import { ServiceDetail } from "../data/companyConfig";
import { modalBackdropVariants, modalPanelVariants } from "../lib/motion";
import { getRealisticServiceSymbol, SymbolShieldGuard } from "./RealisticIcons";
import { getServiceVisual } from "../lib/serviceVisuals";
import { SeoHead } from "./SeoHead";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { buildServiceJsonLd, getServiceSeo } from "../lib/seoConfig";
import { useAuth } from "../contexts/AuthContext";

interface ServiceDetailModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onRequestQuote,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const { isServiceBookmarked, toggleServiceBookmark } = useAuth();
  if (!service) return null;
  const bookmarked = isServiceBookmarked(service.id);
  const visual = getServiceVisual(service.id);
  const serviceSeo = getServiceSeo(service.slug) || getServiceSeo(service.id);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/services/${service.slug}`
      : `/services/${service.slug}`;

  const handleShareService = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: serviceSeo?.ogTitle || `${service.title} | Xelvion Innova Tech`,
          text: serviceSeo?.description || service.shortBenefit,
          url: shareUrl,
        });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        window.setTimeout(() => setCopiedLink(false), 2200);
      }
    } catch {
      // Clipboard/share cancelled silently
    }
  };

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
        className="relative w-full max-w-3xl max-h-[90dvh] flex flex-col studio-modal-panel rounded-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {serviceSeo && (
          <SeoHead
            title={serviceSeo.title}
            ogTitle={serviceSeo.ogTitle}
            description={serviceSeo.description}
            keywords={serviceSeo.keywords}
            canonicalPath={serviceSeo.canonicalPath}
            ogType="website"
            ogImage={serviceSeo.ogImage}
            ogImageAlt={serviceSeo.ogImageAlt}
            jsonLd={buildServiceJsonLd(
              serviceSeo,
              typeof window !== "undefined" ? window.location.origin : "https://xelvion.in"
            )}
          />
        )}
        {/* Pinned Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 bg-gradient-to-b from-[#131924] to-[#0B0F17] text-white flex items-start justify-between gap-4 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              {getRealisticServiceSymbol(service.id, "w-7 h-7")}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-lime-400">
                <span>{service.category}</span>
                <span className="text-slate-600" aria-hidden="true">/</span>
                <span className="text-blue-400">Custom Engineering Scope</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {service.shortBenefit}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={savingBookmark}
              onClick={async () => {
                setSavingBookmark(true);
                try {
                  await toggleServiceBookmark({
                    id: service.id,
                    title: service.title,
                    category: service.category,
                  });
                } finally {
                  setSavingBookmark(false);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                bookmarked
                  ? "bg-lime-400/15 border-lime-400/60 text-lime-400"
                  : "bg-slate-900 border-slate-700 text-slate-200 hover:text-lime-400 hover:border-lime-500/50"
              }`}
              aria-label={bookmarked ? `Remove ${service.title} from saved services` : `Save ${service.title} for consultation`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-lime-400 text-lime-400" : ""}`} />
              <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={handleShareService}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-lime-400 hover:border-lime-500/50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              aria-label={`Copy shareable link for ${service.title}`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-400" />
                  <span className="hidden sm:inline text-lime-400">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Scroll-Linked Progress Bars (Viewport Top & Modal Header Seam) */}
        <ScrollProgressBar containerRef={bodyScrollRef} placement="viewport" />
        <ScrollProgressBar containerRef={bodyScrollRef} placement="inline" />

        {/* Scrollable Body content */}
        <div
          ref={bodyScrollRef}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 dark:text-slate-300 text-sm"
        >
          {/* Real Visual Preview Banner */}
          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden studio-photo-frame">
            <img
              src={visual.image}
              alt={visual.alt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090F]/85 via-transparent to-black/15" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl studio-photo-bezel" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-lime-400">
                {visual.accentLabel}
              </span>
              <span className="text-slate-200 font-medium">
                {service.category}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Service Overview
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {service.overview}
            </p>
          </div>

          {/* Who it's for (Structured Cards, Zero Bullet Lists) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Who It Is Built For
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {service.whoItsFor.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl studio-tile text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-lime-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's included (Structured Feature Blocks, Zero Bullet Dots) */}
          <div className="space-y-3 studio-recessed p-4 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              What Is Included In The Engagement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.whatsIncluded.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg studio-tile text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Concrete Deliverables */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <SymbolShieldGuard className="w-4 h-4" />
              Guaranteed Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 studio-tile rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Execution Process */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Step-by-Step Delivery Process
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.process.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700"
                >
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                    Step {idx + 1}: {step.step}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-lg text-xs space-y-1 border border-slate-200/60 dark:border-slate-800"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pinned Footer CTA */}
        <div className="shrink-0 px-5 sm:px-6 py-4 studio-recessed border-t border-b-0 border-x-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>30-day milestone guarantee</span>
            <span aria-hidden="true">/</span>
            <span>Written technical specifications</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onRequestQuote(service.title);
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Consult on {service.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
