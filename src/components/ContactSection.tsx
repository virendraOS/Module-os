import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
  X,
  Calendar,
  Clock,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { COMPANY_INFO, SERVICES_LIST } from "../data/companyConfig";
import { getStoredData, setStoredData, STORAGE_KEYS, LeadItem } from "../data/portalStore";
import { useAuth } from "../contexts/AuthContext";
import {
  EASE_SMOOTH,
  VIEWPORT_ONCE,
  fadeUpVariants,
  TRANSITION_SPRING,
} from "../lib/motion";
import { SpotlightCard } from "./SpotlightCard";
import {
  SymbolWhatsAppBot,
  SymbolShieldGuard,
  SymbolMilestonePrecision,
  getRealisticServiceSymbol,
} from "./RealisticIcons";

interface ContactSectionProps {
  initialService?: string;
  onSuccess?: () => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

const CALLBACK_DAYS = ["Today", "Tomorrow", "This Week"] as const;
const CALLBACK_SLOTS = [
  "10 AM – 1 PM",
  "2 PM – 5 PM",
  "5 PM – 7 PM",
  "Urgent ASAP",
] as const;

const QUICK_PROMPTS_BY_SERVICE: Record<string, string[]> = {
  "Cloud Services": [
    "Migrate office server to Indian cloud with daily backups",
    "Fix frequent website downtime & slow hosting speed",
    "Setup multi-branch secure remote access",
  ],
  "Logistics Services": [
    "Need offline-capable driver Proof of Delivery (POD) tracking",
    "Digitize manual LR/bilty & daily dispatch registers",
    "Share live shipment tracking links with customers",
  ],
  "WhatsApp Chatbot": [
    "Automate 24/7 customer inquiry replies & lead capture",
    "Send automated order status & dispatch alerts on WhatsApp",
    "Book appointments & collect catalog orders automatically",
  ],
  "AI-based Data Filter Software": [
    "Clean & deduplicate messy supplier/customer Excel sheets",
    "Classify thousands of raw SKU/inventory rows automatically",
    "Standardize phone numbers & fix missing client entries",
  ],
  "Database Management System": [
    "Move slow multi-MB Excel sheets into a fast central database",
    "Add staff role permissions & automated daily backups",
    "Speed up slow reporting queries across branches",
  ],
};

const DEFAULT_PROMPTS = [
  "Automate repetitive manual staff work & daily Excel tracking",
  "Need a documented 30-day milestone roadmap & architecture review",
  "Fix reliability bottlenecks in our current business workflow",
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService,
  onSuccess,
  isModal = false,
  onCloseModal,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: initialService || SERVICES_LIST[0].title,
    callbackDay: CALLBACK_DAYS[0] as string,
    callbackSlot: CALLBACK_SLOTS[0] as string,
    message: "",
    consent: true,
    companyWebsiteHoneypot: "",
  });

  const { user, profile, getAuthToken, saveConsultationToUserHistory } = useAuth();
  const prefersReduced = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [autoReplySent, setAutoReplySent] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<{
    name: boolean;
    phone: boolean;
    email: boolean;
    message: boolean;
  }>({
    name: false,
    phone: false,
    email: false,
    message: false,
  });
  const [shakeCount, setShakeCount] = useState<{
    name: number;
    phone: number;
    email: number;
    message: number;
    banner: number;
  }>({
    name: 0,
    phone: 0,
    email: 0,
    message: 0,
    banner: 0,
  });

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    if (!user && !profile) return;
    setFormData((prev) => ({
      ...prev,
      name: prev.name || profile?.displayName || user?.displayName || "",
      email: prev.email || profile?.email || user?.email || "",
      phone: prev.phone || profile?.phone || "",
    }));
  }, [user, profile]);

  const activeService = useMemo(
    () =>
      SERVICES_LIST.find((s) => s.title === formData.service) ||
      SERVICES_LIST[0],
    [formData.service]
  );

  const quickPrompts = useMemo(
    () => QUICK_PROMPTS_BY_SERVICE[activeService.title] || DEFAULT_PROMPTS,
    [activeService.title]
  );

  const trimmedName = formData.name.trim();
  const cleanPhoneDigits = formData.phone.replace(/[^0-9]/g, "");
  const trimmedEmail = formData.email.trim();
  const trimmedMessage = formData.message.trim();

  const isNameValid = trimmedName.length >= 2;
  const isPhoneValid = cleanPhoneDigits.length >= 10 && cleanPhoneDigits.length <= 15;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const isMessageValid = trimmedMessage.length >= 5;

  const showNameError = (touched.name || submitAttempted) && !isNameValid;
  const showPhoneError = (touched.phone || submitAttempted) && !isPhoneValid;
  const showEmailError = (touched.email || submitAttempted) && !isEmailValid;
  const showMessageError = (touched.message || submitAttempted) && !isMessageValid;

  const triggerShake = (fields: Array<keyof typeof shakeCount>) => {
    if (prefersReduced) return;
    setShakeCount((prev) => {
      const next = { ...prev };
      for (const f of fields) {
        next[f] = prev[f] + 1;
      }
      return next;
    });
  };

  const handleFieldBlur = (field: keyof typeof touched, valid: boolean, hasValue: boolean) => {
    if (!hasValue && !submitAttempted) return;
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (!valid) {
      triggerShake([field]);
    }
  };

  const completionScore = useMemo(() => {
    let score = 20; // Service + Schedule pre-selected
    if (isNameValid) score += 20;
    if (isPhoneValid) score += 25;
    if (isEmailValid) score += 15;
    if (isMessageValid) score += 20;
    return Math.min(100, score);
  }, [isNameValid, isPhoneValid, isEmailValid, isMessageValid]);

  const handleApplyPrompt = (promptText: string) => {
    setFormData((prev) => ({
      ...prev,
      message: promptText,
    }));
    setTouched((prev) => ({ ...prev, message: true }));
    setErrorMsg("");
  };

  const handleCopyRef = () => {
    if (!referenceId || typeof navigator === "undefined" || !navigator.clipboard)
      return;
    navigator.clipboard.writeText(referenceId).then(() => {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.companyWebsiteHoneypot.trim().length > 0) {
      setReferenceId("XIT-" + Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
      return;
    }

    setSubmitAttempted(true);
    setTouched({ name: true, phone: true, email: true, message: true });

    const invalidFields: Array<keyof typeof shakeCount> = [];
    if (!isNameValid) invalidFields.push("name");
    if (!isPhoneValid) invalidFields.push("phone");
    if (!isEmailValid) invalidFields.push("email");
    if (!isMessageValid) invalidFields.push("message");

    if (invalidFields.length > 0) {
      triggerShake([...invalidFields, "banner"]);
      if (!isNameValid) {
        setErrorMsg("Please enter your full name (at least 2 characters).");
      } else if (!isPhoneValid) {
        setErrorMsg("Please enter a valid 10-digit Indian phone number.");
      } else if (!isEmailValid) {
        setErrorMsg("Please enter a valid business email address.");
      } else {
        setErrorMsg(
          "Please write a short description of your requirement (at least 5 characters)."
        );
      }
      return;
    }

    if (!formData.consent) {
      triggerShake(["banner"]);
      setErrorMsg(
        "Please confirm consent so our engineering team can contact you."
      );
      return;
    }

    const rawProblem = trimmedMessage;
    const enrichedMessage = `[Preferred Callback: ${formData.callbackDay} / ${formData.callbackSlot} IST]\n${rawProblem}`;

    setSubmitting(true);
    try {
      const token = user ? await getAuthToken() : null;
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          service: formData.service,
          callbackDay: formData.callbackDay,
          callbackSlot: formData.callbackSlot,
          message: enrichedMessage,
          consent: formData.consent,
          honeypot: formData.companyWebsiteHoneypot,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMsg(
          result?.error ||
            "Could not send your inquiry right now. Please try again."
        );
        return;
      }

      const ref =
        typeof result?.referenceId === "string" && result.referenceId
          ? result.referenceId
          : "XIT-" + Math.floor(100000 + Math.random() * 900000);
      setReferenceId(ref);
      setAutoReplySent(Boolean(result?.autoReplySent));

      if (user && user.emailVerified) {
        await saveConsultationToUserHistory({
          referenceId: ref,
          serviceTitle: formData.service,
          callbackDay: formData.callbackDay,
          callbackSlot: formData.callbackSlot,
          phone: formData.phone.trim(),
          message: rawProblem,
        });
      } else {
        const existingLeads = getStoredData<LeadItem[]>(STORAGE_KEYS.LEADS, []);
        const newLead: LeadItem = {
          id: "lead-" + Date.now(),
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          service: formData.service,
          message: enrichedMessage,
          status: "New",
          notes: [
            `Ref ID: ${ref}. Callback: ${formData.callbackDay} (${formData.callbackSlot}).`,
          ],
          createdAt: "Just now",
        };
        setStoredData(STORAGE_KEYS.LEADS, [newLead, ...existingLeads]);
      }

      setSubmitted(true);

      // Fire brand-themed celebration burst (respects prefers-reduced-motion, never triggered for honeypot bots)
      try {
        confetti({
          particleCount: 75,
          spread: 68,
          origin: { y: 0.62 },
          colors: ["#2563EB", "#84CC16", "#10B981", "#4F46E5", "#F8FAFC"],
          zIndex: 9999,
          disableForReducedMotion: true,
        });
        window.setTimeout(() => {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 52,
            origin: { x: 0.18, y: 0.68 },
            colors: ["#2563EB", "#84CC16", "#10B981"],
            zIndex: 9999,
            disableForReducedMotion: true,
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 52,
            origin: { x: 0.82, y: 0.68 },
            colors: ["#2563EB", "#84CC16", "#4F46E5"],
            zIndex: 9999,
            disableForReducedMotion: true,
          });
        }, 180);
      } catch {
        // Confetti canvas errors never block submission state
      }

      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg(
        `Network error while sending your inquiry. Please call or WhatsApp us directly at ${COMPANY_INFO.contact.phoneDisplay}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste Xelvion Team,${
      referenceId ? ` Booking Ref: ${referenceId}.` : ""
    } I would like to schedule a consultation for *${formData.service}* (${
      formData.callbackDay
    }, ${formData.callbackSlot}).${
      formData.message.trim() ? ` Requirement: ${formData.message.trim()}` : ""
    }`
  );
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.contact.whatsappNumber}?text=${whatsappMessage}`;

  const WrapperTag = isModal ? "div" : "section";
  const scopeUID = isModal ? "modal" : "page";

  return (
    <WrapperTag
      id={isModal ? undefined : "contact"}
      className={
        isModal
          ? "w-full"
          : "relative py-16 sm:py-24 studio-section-primary border-b transition-colors overflow-hidden"
      }
    >
      {/* Subtle architectural background on full page section */}
      {!isModal && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-grain" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-arch-grid opacity-45"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 w-[34rem] h-[34rem] rounded-full bg-blue-600/8 dark:bg-blue-500/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 -left-24 w-[28rem] h-[28rem] rounded-full bg-lime-500/10 dark:bg-lime-400/8 blur-3xl"
          />
        </>
      )}

      <div
        className={
          isModal ? "w-full" : "relative z-10 max-w-7xl mx-auto px-4 sm:px-6"
        }
      >
        {/* Top Section Header (Full Page Only) */}
        {!isModal && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="max-w-3xl mb-10 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-lime-400 uppercase tracking-wider">
              <span>ENGINEERING CONSULTATION STUDIO</span>
              <span
                aria-hidden="true"
                className="text-slate-300 dark:text-slate-700"
              >
                /
              </span>
              <span>48-HOUR WRITTEN SCOPE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Book Your Free Technical Architecture &amp; Consultation Session
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Select your core requirement, pick a convenient callback slot, and receive a documented engineering roadmap from our Bengaluru &amp; New Delhi system architects—at zero cost and zero obligation.
            </p>
          </motion.div>
        )}

        <div
          className={`grid grid-cols-1 lg:grid-cols-12 ${
            isModal ? "gap-6" : "gap-8 lg:gap-10"
          } items-start`}
        >
          {/* LEFT COLUMN (5 cols): Live Selected Service Showcase + 3-Step Promise + Direct Channels */}
          <motion.div
            variants={fadeUpVariants}
            initial={isModal ? "visible" : "hidden"}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-5 space-y-4"
          >
            {/* Dynamic Selected Service Preview Card */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#131A27] to-[#0A0E16] text-white p-5 sm:p-6 border border-white/10 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-600/20 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-lime-500/15 blur-2xl"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                  className="relative z-10 space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-sm">
                      {getRealisticServiceSymbol(activeService.id, "w-7 h-7")}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-lime-400">
                        <span>SELECTED TRACK</span>
                        <span className="text-slate-600" aria-hidden="true">
                          /
                        </span>
                        <span className="text-blue-400">
                          {activeService.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeService.shortBenefit}
                  </p>

                  {/* Top 2 Deliverables Preview (Zero Bullet Lists) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeService.deliverables.slice(0, 2).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2"
                      >
                        <SymbolShieldGuard className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium text-slate-200 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* What Happens Next: 3-Step Clarity */}
            <div className="p-4 sm:p-5 rounded-2xl studio-recessed space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  What Happens After You Book
                </span>
                <span className="text-[11px] font-mono font-semibold text-blue-700 dark:text-lime-400">
                  Zero Cost
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { num: "01", title: "4-Hr Callback", sub: "Senior Engineer" },
                  { num: "02", title: "System Audit", sub: "Live Bottlenecks" },
                  { num: "03", title: "48-Hr Spec", sub: "Milestone Plan" },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="p-2.5 rounded-xl studio-tile space-y-0.5"
                  >
                    <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-lime-400 block">
                      {step.num}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {step.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Priority Channels */}
            <div className="space-y-2.5">
              {/* WhatsApp Priority Channel */}
              <SpotlightCard
                spotlightColor="rgba(16, 185, 129, 0.16)"
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50 dark:bg-emerald-950/35 hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                      <SymbolWhatsAppBot className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-900 dark:group-hover:text-emerald-300">
                        Instant WhatsApp Priority Desk
                      </h4>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                        {COMPANY_INFO.contact.whatsappDisplay}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-lime-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Chat Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              </SpotlightCard>

              {/* Phone & Email Compact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${COMPANY_INFO.contact.phone}`}
                  className="p-3 studio-tile rounded-xl flex items-center gap-2.5 hover:border-blue-400/60 dark:hover:border-blue-500/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/60 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Direct Call
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white block truncate">
                      {COMPANY_INFO.contact.phoneDisplay}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="p-3 studio-tile rounded-xl flex items-center gap-2.5 hover:border-indigo-400/60 dark:hover:border-indigo-500/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Email Desk
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white block truncate">
                      {COMPANY_INFO.contact.email}
                    </span>
                  </div>
                </a>
              </div>

              {!isModal && (
                <div className="p-3.5 studio-tile rounded-xl flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-lime-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-slate-600 dark:text-slate-300">
                    <p>
                      <strong className="text-slate-900 dark:text-white">
                        Bengaluru HQ:
                      </strong>{" "}
                      {COMPANY_INFO.headquarters.address}
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">
                        New Delhi Hub:
                      </strong>{" "}
                      {COMPANY_INFO.headquarters.branch} / CIN:{" "}
                      <span className="font-mono">{COMPANY_INFO.cin}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN (7 cols): Interactive Booking Studio */}
          <motion.div
            variants={fadeUpVariants}
            custom={0.08}
            initial={isModal ? "visible" : "hidden"}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7 studio-card rounded-2xl overflow-hidden"
          >
            {/* Live Readiness Progress Header */}
            <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-slate-200/80 dark:border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <SymbolMilestonePrecision className="w-5 h-5 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {submitted
                        ? "Consultation Pass Confirmed"
                        : "Configure Your Free Consultation"}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {submitted
                        ? "Booking logged and routed to our engineering desk"
                        : "30-day milestone guarantee / Direct senior engineer callback"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold tabular-nums text-blue-700 dark:text-lime-400 shrink-0">
                  {submitted ? "100%" : `${completionScore}%`} Ready
                </span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: (submitted ? 100 : completionScore) / 100,
                  }}
                  transition={{ duration: 0.35, ease: EASE_SMOOTH }}
                  className="h-full w-full origin-left rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-lime-500"
                />
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* CELEBRATORY CONFIRMED CONSULTATION PASS */
                  <motion.div
                    key="submitted-pass"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                    className="space-y-6 py-2"
                  >
                    <div className="text-center space-y-3">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={TRANSITION_SPRING}
                        className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-lime-400 flex items-center justify-center mx-auto shadow-sm"
                      >
                        <CheckCircle2 className="w-9 h-9" />
                      </motion.div>
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        Consultation Reserved, {formData.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                        Our engineering coordinator has received your brief and will call{" "}
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {formData.phone}
                        </span>{" "}
                        within 4 business hours.
                      </p>
                      {autoReplySent && formData.email && (
                        <p className="text-xs font-medium text-emerald-700 dark:text-lime-400">
                          A confirmation copy with your Booking Pass has been emailed to{" "}
                          <span className="font-mono">{formData.email}</span>.
                        </p>
                      )}
                    </div>

                    {/* Ticket Summary Card */}
                    <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Booking Reference Pass
                          </span>
                          <span className="text-base font-mono font-bold text-blue-700 dark:text-lime-400">
                            {referenceId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyRef}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          {copiedRef ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Pass ID</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                            {getRealisticServiceSymbol(
                              activeService.id,
                              "w-5 h-5"
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                              Service Track
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {formData.service}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                              Preferred Window
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {formData.callbackDay} / {formData.callbackSlot}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors inline-flex items-center gap-2 shadow-xs"
                      >
                        <SymbolWhatsAppBot className="w-4 h-4" />
                        <span>Fast-Track on WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setReferenceId("");
                          setAutoReplySent(false);
                          setSubmitAttempted(false);
                          setTouched({ name: false, phone: false, email: false, message: false });
                          setShakeCount({ name: 0, phone: 0, email: 0, message: 0, banner: 0 });
                          setFormData({
                            name: "",
                            phone: "",
                            email: "",
                            service: SERVICES_LIST[0].title,
                            callbackDay: CALLBACK_DAYS[0],
                            callbackSlot: CALLBACK_SLOTS[0],
                            message: "",
                            consent: true,
                            companyWebsiteHoneypot: "",
                          });
                        }}
                        className="px-4 py-2.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-900 rounded-xl transition-colors"
                      >
                        Book Another Consultation
                      </button>
                      {isModal && onCloseModal && (
                        <button
                          type="button"
                          onClick={onCloseModal}
                          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Close Window</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* INTERACTIVE MULTI-STEP BOOKING FORM */
                  <motion.form
                    key="form-studio"
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onSubmit={handleSubmit}
                    className="space-y-5 text-xs sm:text-sm"
                  >
                    {/* Invisible Honeypot Field (traps automated bots; zero friction & unreachable for humans/autofill) */}
                    <div
                      className="sr-only pointer-events-none select-none"
                      aria-hidden="true"
                    >
                      <label htmlFor={`website-${scopeUID}`}>
                        Leave this field blank
                      </label>
                      <input
                        type="text"
                        id={`website-${scopeUID}`}
                        name="website"
                        value={formData.companyWebsiteHoneypot}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyWebsiteHoneypot: e.target.value,
                          })
                        }
                        tabIndex={-1}
                        autoComplete="new-password"
                        inputMode="none"
                      />
                    </div>

                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div
                          key={`err-banner-${shakeCount.banner}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={
                            prefersReduced || shakeCount.banner === 0
                              ? { opacity: 1, y: 0 }
                              : { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, -2, 2, 0] }
                          }
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.36, ease: EASE_SMOOTH }}
                          role="alert"
                          className="p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl text-xs font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 1. Interactive 10-Service Tile Picker */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          1. Choose Core Service *
                        </label>
                        <span className="text-[11px] font-medium text-blue-700 dark:text-lime-400 truncate max-w-[180px]">
                          {formData.service}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                        {SERVICES_LIST.map((srv) => {
                          const selected = formData.service === srv.title;
                          return (
                            <motion.button
                              key={srv.id}
                              type="button"
                              whileTap={{ scale: 0.985 }}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  service: srv.title,
                                }))
                              }
                              className={`relative text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 min-h-[46px] ${
                                selected
                                  ? "border-blue-600 dark:border-lime-400 bg-blue-50/90 dark:bg-[#192335] shadow-[0_2px_10px_-2px_rgba(37,99,235,0.2),inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-[0_4px_14px_-2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                                  : "studio-tile hover:border-slate-400/50 dark:hover:border-white/20"
                              }`}
                            >
                              {selected && (
                                <motion.span
                                  layoutId={`booking-srv-ring-${scopeUID}`}
                                  transition={{
                                    duration: 0.24,
                                    ease: EASE_SMOOTH,
                                  }}
                                  className="absolute inset-0 rounded-xl ring-1 ring-blue-600/30 dark:ring-lime-400/40 pointer-events-none"
                                />
                              )}
                              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0">
                                {getRealisticServiceSymbol(srv.id, "w-4 h-4")}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span
                                  className={`text-xs font-bold block truncate ${
                                    selected
                                      ? "text-blue-800 dark:text-lime-300"
                                      : "text-slate-800 dark:text-slate-200"
                                  }`}
                                >
                                  {srv.title}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                                  {srv.category}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Callback Day & Time Slot Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
                          <span>2. Preferred Day</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 p-1 studio-recessed rounded-xl">
                          {CALLBACK_DAYS.map((day) => {
                            const active = formData.callbackDay === day;
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    callbackDay: day,
                                  }))
                                }
                                className={`relative py-2 px-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                                  active
                                    ? "text-white"
                                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                {active && (
                                  <motion.span
                                    layoutId={`booking-day-pill-${scopeUID}`}
                                    transition={{
                                      duration: 0.22,
                                      ease: EASE_SMOOTH,
                                    }}
                                    className="absolute inset-0 rounded-lg bg-gradient-to-b from-slate-800 to-slate-950 dark:from-blue-500 dark:to-blue-700 shadow-[0_2px_6px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.18)]"
                                  />
                                )}
                                <span className="relative z-10">{day}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
                          <span>Callback Window (IST)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 p-1 studio-recessed rounded-xl">
                          {CALLBACK_SLOTS.map((slot) => {
                            const active = formData.callbackSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    callbackSlot: slot,
                                  }))
                                }
                                className={`relative py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap truncate ${
                                  active
                                    ? "text-white"
                                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                {active && (
                                  <motion.span
                                    layoutId={`booking-slot-pill-${scopeUID}`}
                                    transition={{
                                      duration: 0.22,
                                      ease: EASE_SMOOTH,
                                    }}
                                    className="absolute inset-0 rounded-lg bg-blue-700 dark:bg-blue-600 shadow-2xs"
                                  />
                                )}
                                <span className="relative z-10">{slot}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 3. Contact Coordinates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <label
                            htmlFor={`contact-name-${scopeUID}`}
                            className="text-xs font-semibold text-slate-700 dark:text-slate-300 block"
                          >
                            3. Your Full Name *
                          </label>
                          {isNameValid && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-[10px] font-semibold text-emerald-700 dark:text-lime-400 flex items-center gap-0.5"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Looks good
                            </motion.span>
                          )}
                        </div>
                        <motion.div
                          key={`name-wrap-${shakeCount.name}`}
                          animate={
                            !prefersReduced && shakeCount.name > 0
                              ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                              : undefined
                          }
                          transition={{ duration: 0.36 }}
                          className="relative flex items-center"
                        >
                          <input
                            id={`contact-name-${scopeUID}`}
                            type="text"
                            required
                            placeholder="e.g. Ramesh Sharma"
                            aria-invalid={showNameError}
                            aria-describedby={showNameError ? `contact-name-err-${scopeUID}` : undefined}
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errorMsg) setErrorMsg("");
                            }}
                            onBlur={() =>
                              handleFieldBlur("name", isNameValid, formData.name.length > 0)
                            }
                            className={`w-full pl-3.5 pr-9 py-2.5 studio-input rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 text-xs sm:text-sm transition-all ${
                              showNameError
                                ? "border-red-500/85 dark:border-red-400/85 focus:ring-red-500/40"
                                : isNameValid
                                ? "border-emerald-500/75 dark:border-lime-400/70 focus:ring-emerald-500/40 dark:focus:ring-lime-400/40"
                                : "focus:ring-blue-600 dark:focus:ring-lime-400 focus:border-transparent"
                            }`}
                          />
                          <div className="pointer-events-none absolute right-3 flex items-center">
                            {isNameValid ? (
                              <motion.span
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.18 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                              </motion.span>
                            ) : showNameError ? (
                              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            ) : null}
                          </div>
                        </motion.div>
                        <AnimatePresence>
                          {showNameError && (
                            <motion.p
                              id={`contact-name-err-${scopeUID}`}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              role="alert"
                              className="text-[11px] font-medium text-red-600 dark:text-red-400"
                            >
                              Enter your full name (at least 2 characters).
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <label
                            htmlFor={`contact-phone-${scopeUID}`}
                            className="text-xs font-semibold text-slate-700 dark:text-slate-300 block"
                          >
                            Mobile / WhatsApp Number *
                          </label>
                          {isPhoneValid && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-[10px] font-semibold text-emerald-700 dark:text-lime-400 flex items-center gap-0.5"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </motion.span>
                          )}
                        </div>
                        <motion.div
                          key={`phone-wrap-${shakeCount.phone}`}
                          animate={
                            !prefersReduced && shakeCount.phone > 0
                              ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                              : undefined
                          }
                          transition={{ duration: 0.36 }}
                          className="relative flex items-center"
                        >
                          <span className="absolute left-3 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 select-none">
                            IN
                          </span>
                          <input
                            id={`contact-phone-${scopeUID}`}
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            aria-invalid={showPhoneError}
                            aria-describedby={showPhoneError ? `contact-phone-err-${scopeUID}` : undefined}
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              });
                              if (errorMsg) setErrorMsg("");
                            }}
                            onBlur={() =>
                              handleFieldBlur("phone", isPhoneValid, formData.phone.length > 0)
                            }
                            className={`w-full pl-9 pr-9 py-2.5 studio-input rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 text-xs sm:text-sm font-mono transition-all ${
                              showPhoneError
                                ? "border-red-500/85 dark:border-red-400/85 focus:ring-red-500/40"
                                : isPhoneValid
                                ? "border-emerald-500/75 dark:border-lime-400/70 focus:ring-emerald-500/40 dark:focus:ring-lime-400/40"
                                : "focus:ring-blue-600 dark:focus:ring-lime-400 focus:border-transparent"
                            }`}
                          />
                          <div className="pointer-events-none absolute right-3 flex items-center">
                            {isPhoneValid ? (
                              <motion.span
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.18 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                              </motion.span>
                            ) : showPhoneError ? (
                              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            ) : null}
                          </div>
                        </motion.div>
                        <AnimatePresence>
                          {showPhoneError && (
                            <motion.p
                              id={`contact-phone-err-${scopeUID}`}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              role="alert"
                              className="text-[11px] font-medium text-red-600 dark:text-red-400"
                            >
                              Enter a valid 10-digit Indian phone number.
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor={`contact-email-${scopeUID}`}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300 block"
                        >
                          Business Email Address *
                        </label>
                        {isEmailValid && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[10px] font-semibold text-emerald-700 dark:text-lime-400 flex items-center gap-0.5"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Valid Email
                          </motion.span>
                        )}
                      </div>
                      <motion.div
                        key={`email-wrap-${shakeCount.email}`}
                        animate={
                          !prefersReduced && shakeCount.email > 0
                            ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                            : undefined
                        }
                        transition={{ duration: 0.36 }}
                        className="relative flex items-center"
                      >
                        <input
                          id={`contact-email-${scopeUID}`}
                          type="email"
                          required
                          placeholder="name@company.com"
                          aria-invalid={showEmailError}
                          aria-describedby={showEmailError ? `contact-email-err-${scopeUID}` : undefined}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errorMsg) setErrorMsg("");
                          }}
                          onBlur={() =>
                            handleFieldBlur("email", isEmailValid, formData.email.length > 0)
                          }
                          className={`w-full pl-3.5 pr-9 py-2.5 studio-input rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 text-xs sm:text-sm transition-all ${
                            showEmailError
                              ? "border-red-500/85 dark:border-red-400/85 focus:ring-red-500/40"
                              : isEmailValid
                              ? "border-emerald-500/75 dark:border-lime-400/70 focus:ring-emerald-500/40 dark:focus:ring-lime-400/40"
                              : "focus:ring-blue-600 dark:focus:ring-lime-400 focus:border-transparent"
                          }`}
                        />
                        <div className="pointer-events-none absolute right-3 flex items-center">
                          {isEmailValid ? (
                            <motion.span
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.18 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                            </motion.span>
                          ) : showEmailError ? (
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                          ) : null}
                        </div>
                      </motion.div>
                      <AnimatePresence>
                        {showEmailError && (
                          <motion.p
                            id={`contact-email-err-${scopeUID}`}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            role="alert"
                            className="text-[11px] font-medium text-red-600 dark:text-red-400"
                          >
                            Please enter a valid email address (e.g. name@company.com).
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 4. One-Tap Bottleneck Presets + Description */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor={`contact-msg-${scopeUID}`}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                        >
                          <span>4. Operational Problem Summary *</span>
                          {isMessageValid && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-[10px] font-semibold text-emerald-700 dark:text-lime-400 inline-flex items-center gap-0.5"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </motion.span>
                          )}
                        </label>
                        <span className="text-[10px] font-semibold text-blue-700 dark:text-lime-400 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Quick-fill ideas
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {quickPrompts.map((prompt) => (
                          <motion.button
                            key={prompt}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleApplyPrompt(prompt)}
                            className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                              formData.message === prompt
                                ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-lime-400 text-blue-800 dark:text-lime-300"
                                : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-slate-700"
                            }`}
                          >
                            + {prompt}
                          </motion.button>
                        ))}
                      </div>

                      <motion.div
                        key={`msg-wrap-${shakeCount.message}`}
                        animate={
                          !prefersReduced && shakeCount.message > 0
                            ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                            : undefined
                        }
                        transition={{ duration: 0.36 }}
                        className="relative"
                      >
                        <textarea
                          id={`contact-msg-${scopeUID}`}
                          rows={3}
                          required
                          minLength={5}
                          placeholder="Describe your manual bottleneck, existing spreadsheets, or desired automation outcome..."
                          aria-invalid={showMessageError}
                          aria-describedby={showMessageError ? `contact-msg-err-${scopeUID}` : undefined}
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (errorMsg) setErrorMsg("");
                          }}
                          onBlur={() =>
                            handleFieldBlur("message", isMessageValid, formData.message.length > 0)
                          }
                          className={`w-full pl-3.5 pr-9 py-2.5 studio-input rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 text-xs sm:text-sm transition-all ${
                            showMessageError
                              ? "border-red-500/85 dark:border-red-400/85 focus:ring-red-500/40"
                              : isMessageValid
                              ? "border-emerald-500/75 dark:border-lime-400/70 focus:ring-emerald-500/40 dark:focus:ring-lime-400/40"
                              : "focus:ring-blue-600 dark:focus:ring-lime-400 focus:border-transparent"
                          }`}
                        />
                        <div className="pointer-events-none absolute top-3 right-3 flex items-center">
                          {isMessageValid ? (
                            <motion.span
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.18 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                            </motion.span>
                          ) : showMessageError ? (
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                          ) : null}
                        </div>
                      </motion.div>
                      <AnimatePresence>
                        {showMessageError && (
                          <motion.p
                            id={`contact-msg-err-${scopeUID}`}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            role="alert"
                            className="text-[11px] font-medium text-red-600 dark:text-red-400"
                          >
                            Please describe your requirement (at least 5 characters).
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* DPDP Privacy Consent */}
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            consent: e.target.checked,
                          });
                          if (errorMsg) setErrorMsg("");
                        }}
                        className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-600"
                      />
                      <span>
                        I consent to Xelvion contacting me via phone, WhatsApp, or email regarding this inquiry (DPDP Act 2023 compliant).
                      </span>
                    </label>

                    {/* Submit & Cancel actions */}
                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        type="submit"
                        disabled={submitting}
                        className="group relative flex-1 py-3.5 px-5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 rounded-xl transition-all shadow-md hover:shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 overflow-hidden"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming Booking...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            <span>Book Free Engineering Consultation</span>
                          </>
                        )}
                      </motion.button>
                      {isModal && onCloseModal && (
                        <button
                          type="button"
                          onClick={onCloseModal}
                          className="py-3.5 px-5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-2 pt-0.5">
                      <SymbolShieldGuard className="w-4 h-4 shrink-0" />
                      <span>
                        100% Confidential / Bilateral NDA available / Response in 4 hours
                      </span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </WrapperTag>
  );
};
