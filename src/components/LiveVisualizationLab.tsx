import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  CheckCircle2,
  Send,
  Truck,
  Database,
} from "lucide-react";
import {
  EASE_SMOOTH,
  VIEWPORT_ONCE,
  fadeUpVariants,
  revealSlideLeftVariants,
  revealSlideRightVariants,
  TRANSITION_SPRING,
} from "../lib/motion";
import { getServiceVisual } from "../lib/serviceVisuals";
import { SymbolShieldGuard } from "./RealisticIcons";
import { AmbientBackdrop } from "./AmbientBackdrop";

interface LiveVisualizationLabProps {
  openContactModal: (serviceName?: string) => void;
}

type LabTabId = "ai-filter" | "offline-pod" | "whatsapp-bot";

interface MessyRow {
  id: string;
  vendor: string;
  phone: string;
  category: string;
  issue: string;
  cleanVendor: string;
  cleanPhone: string;
  isDuplicate?: boolean;
}

const SAMPLE_ROWS: MessyRow[] = [
  {
    id: "r1",
    vendor: "shree balaji tradrs",
    phone: "9876543210",
    category: "Unassigned",
    issue: "Typo + Lowercase",
    cleanVendor: "Shree Balaji Traders",
    cleanPhone: "+91 98765 43210",
  },
  {
    id: "r2",
    vendor: "SHREE BALAJI TRADERS",
    phone: "+91-9876543210",
    category: "Hardware",
    issue: "Duplicate Entry",
    cleanVendor: "Shree Balaji Traders",
    cleanPhone: "+91 98765 43210",
    isDuplicate: true,
  },
  {
    id: "r3",
    vendor: "kaveri med supply ",
    phone: "09811223344",
    category: "Unassigned",
    issue: "Extra Zero + Spaces",
    cleanVendor: "Kaveri Med Supply",
    cleanPhone: "+91 98112 23344",
  },
  {
    id: "r4",
    vendor: "vardhaman indl.",
    phone: "9910088221",
    category: "Industrial",
    issue: "Abbreviated Name",
    cleanVendor: "Vardhaman Industrial",
    cleanPhone: "+91 99100 88221",
  },
  {
    id: "r5",
    vendor: "KAVERI MED SUPPLY",
    phone: "9811223344",
    category: "Pharma",
    issue: "Duplicate Phone",
    cleanVendor: "Kaveri Med Supply",
    cleanPhone: "+91 98112 23344",
    isDuplicate: true,
  },
];

interface BotMessage {
  sender: "user" | "bot";
  text: string;
}

const INITIAL_BOT_CHAT: BotMessage[] = [
  {
    sender: "bot",
    text: "Namaste! Welcome to Xelvion Automated Support Desk. Tap any option below to test a live workflow:",
  },
];

const BOT_ACTIONS = [
  {
    label: "Track Dispatch LR #4821",
    reply:
      "LR #4821 (Delhi -> Jaipur) departed Manesar Hub at 08:40 AM. Expected arrival: 04:15 PM today. POD link ready.",
  },
  {
    label: "Request Bulk Catalog",
    reply:
      "Catalog PDF dispatched! Which city should we route your wholesale quotation to?",
  },
  {
    label: "Book Engineer Callback",
    reply:
      "Slot reserved! Our coordinator has logged your request and will call within 4 business hours.",
  },
];

export const LiveVisualizationLab: React.FC<LiveVisualizationLabProps> = ({
  openContactModal,
}) => {
  const [activeTab, setActiveTab] = useState<LabTabId>("ai-filter");

  // Tab 1: AI Data Filter State
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  // Tab 2: Offline POD State
  const [isOnline, setIsOnline] = useState(false);
  const [queuedCount, setQueuedCount] = useState(1);
  const [syncedCount, setSyncedCount] = useState(14);
  const [syncPulse, setSyncPulse] = useState(false);

  // Tab 3: WhatsApp Bot State
  const [chatLog, setChatLog] = useState<BotMessage[]>(INITIAL_BOT_CHAT);
  const [botTyping, setBotTyping] = useState(false);

  const handleRunAiFilter = () => {
    if (isScanning || isCleaned) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsCleaned(true);
    }, 950);
  };

  const handleCapturePod = () => {
    if (isOnline) {
      setSyncPulse(true);
      setSyncedCount((s) => s + 1);
      setTimeout(() => setSyncPulse(false), 600);
    } else {
      setQueuedCount((q) => q + 1);
    }
  };

  const handleToggleNetwork = () => {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    if (nextOnline && queuedCount > 0) {
      setSyncPulse(true);
      const pending = queuedCount;
      setTimeout(() => {
        setSyncedCount((s) => s + pending);
        setQueuedCount(0);
        setSyncPulse(false);
      }, 650);
    }
  };

  const handleBotOption = (label: string, reply: string) => {
    if (botTyping) return;
    setChatLog((prev) => [...prev, { sender: "user", text: label }]);
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      setChatLog((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 520);
  };

  const activeVisualMeta =
    activeTab === "ai-filter"
      ? getServiceVisual("ai-based-data-filter-software")
      : activeTab === "offline-pod"
      ? getServiceVisual("logistics-services")
      : getServiceVisual("whatsapp-chatbot");

  const activeServiceTitle =
    activeTab === "ai-filter"
      ? "AI-based Data Filter Software"
      : activeTab === "offline-pod"
      ? "Logistics Services"
      : "WhatsApp Chatbot";

  const visibleRows = isCleaned
    ? SAMPLE_ROWS.filter((r) => !r.isDuplicate)
    : SAMPLE_ROWS;

  return (
    <section className="relative py-16 sm:py-24 studio-section-alt border-b transition-colors overflow-hidden">
      <AmbientBackdrop variant="section" showNetwork={true} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header + Mode Switcher */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-lime-400 uppercase tracking-wider">
              <span>INTERACTIVE SOFTWARE SANDBOX</span>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                /
              </span>
              <span>REAL-TIME VISUALIZATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Test How Our Engineering Systems Work Live
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Do not rely on static screenshots alone. Interact directly with live simulations of our AI Data Filter, Offline Logistics POD Sync, and WhatsApp Automation workflows.
            </p>
          </div>

          {/* Segmented Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 studio-recessed rounded-2xl shrink-0">
            {[
              { id: "ai-filter" as const, label: "AI Data Filter" },
              { id: "offline-pod" as const, label: "Offline Logistics Sync" },
              { id: "whatsapp-bot" as const, label: "WhatsApp Bot Flow" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                    active
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="viz-lab-tab"
                      transition={TRANSITION_SPRING}
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 dark:from-blue-500 dark:to-blue-700 shadow-[0_2px_8px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.2)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main 12-Col Split: Interactive Simulator (7 cols) + Real Architectural Visual Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT 7 COLS: Interactive Live Simulator */}
          <motion.div
            variants={revealSlideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7 studio-card rounded-3xl overflow-hidden flex flex-col justify-between"
          >
            <AnimatePresence mode="wait">
              {activeTab === "ai-filter" && (
                <motion.div
                  key="lab-ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: EASE_SMOOTH }}
                  className="p-5 sm:p-7 space-y-5 flex-1 flex flex-col justify-between"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Live Spreadsheet Sanitization Pipeline
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isCleaned
                          ? "3 clean verified vendors ready for ERP / PostgreSQL export (2 duplicates purged)"
                          : "5 messy vendor rows detected with typos, duplicate entries, and inconsistent numbers"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCleaned && (
                        <button
                          type="button"
                          onClick={() => setIsCleaned(false)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      )}
                      <motion.button
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleRunAiFilter}
                        disabled={isScanning || isCleaned}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 disabled:opacity-60 inline-flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {isScanning
                            ? "Scanning Rows..."
                            : isCleaned
                            ? "Sanitized!"
                            : "Run AI Sanitizer"}
                        </span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Animated Table with Laser Scan Sweep */}
                  <div className="relative rounded-2xl overflow-hidden studio-recessed">
                    {isScanning && (
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: ["0%", "95%", "0%"] }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-lime-400 to-blue-500 shadow-[0_0_16px_rgba(132,204,22,0.8)] z-20 pointer-events-none"
                      />
                    )}

                    <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                      <AnimatePresence initial={false}>
                        {visibleRows.map((row) => (
                          <motion.div
                            layout
                            key={row.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, x: 40, height: 0 }}
                            transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                            className="px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <span
                                className={`font-bold block truncate ${
                                  isCleaned
                                    ? "text-slate-900 dark:text-white"
                                    : row.isDuplicate
                                    ? "text-rose-700 dark:text-rose-400"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {isCleaned ? row.cleanVendor : row.vendor}
                              </span>
                              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                {isCleaned ? row.cleanPhone : row.phone}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-[11px] font-semibold ${
                                  isCleaned
                                    ? "text-emerald-700 dark:text-lime-400"
                                    : row.isDuplicate
                                    ? "text-rose-600 dark:text-rose-400"
                                    : "text-amber-700 dark:text-amber-400"
                                }`}
                              >
                                {isCleaned ? "Verified Clean" : row.issue}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "offline-pod" && (
                <motion.div
                  key="lab-pod"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: EASE_SMOOTH }}
                  className="p-5 sm:p-7 space-y-5 flex-1 flex flex-col justify-between"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Offline-First Driver Dispatch &amp; Cloud Queue
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Test capturing POD receipts while offline—watch zero-loss auto-sync when signal returns.
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={handleToggleNetwork}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-2 transition-colors ${
                        isOnline
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-lime-400"
                          : "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {isOnline ? (
                        <>
                          <Wifi className="w-4 h-4" />
                          <span>4G Online (Tap to Cut Signal)</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4" />
                          <span>0G Dead Zone (Tap to Restore 4G)</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Interactive Flow Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-4 rounded-2xl studio-recessed">
                    <div className="p-4 rounded-xl studio-tile space-y-1 text-center">
                      <Truck className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Driver Device
                      </span>
                      <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 block tabular-nums">
                        Local Queue: {queuedCount} Pending
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <div className="w-full h-1.5 rounded-full bg-slate-300/70 dark:bg-slate-800 overflow-hidden relative">
                        {syncPulse && (
                          <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 0.55, ease: "easeInOut" }}
                            className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-lime-400 rounded-full"
                          />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {isOnline ? "Encrypted Auto-Sync Active" : "Caching Locally in IndexedDB"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl studio-tile space-y-1 text-center">
                      <Database className="w-6 h-6 mx-auto text-emerald-600 dark:text-lime-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        HQ Cloud Vault
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 dark:text-lime-400 block tabular-nums">
                        Synced PODs: {syncedCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Zero driver data lost even across zero-network highway corridors.
                    </span>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCapturePod}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Capture Delivery POD (+1)</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === "whatsapp-bot" && (
                <motion.div
                  key="lab-wa"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: EASE_SMOOTH }}
                  className="p-5 sm:p-7 space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Interactive WhatsApp Business API Bot
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tap a customer prompt below to see instant automated responses &amp; lead routing.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setChatLog(INITIAL_BOT_CHAT)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Chat</span>
                    </button>
                  </div>

                  {/* Simulated Chat Feed */}
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2.5 h-48 overflow-y-auto">
                    {chatLog.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-emerald-600 text-white rounded-br-xs"
                              : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {botTyping && (
                      <div className="text-[11px] font-mono text-lime-400 pl-1">
                        Xelvion Bot is typing...
                      </div>
                    )}
                  </div>

                  {/* Quick Reply Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {BOT_ACTIONS.map((act) => (
                      <motion.button
                        key={act.label}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleBotOption(act.label, act.reply)}
                        disabled={botTyping}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-lime-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>{act.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT 5 COLS: Real Architectural Visual Frame */}
          <motion.div
            variants={revealSlideRightVariants}
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-5 bg-gradient-to-b from-[#121722] to-[#090C12] rounded-3xl studio-photo-frame overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative h-64 sm:h-72 overflow-hidden bg-[#0A0D13]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeVisualMeta.image}
                  src={activeVisualMeta.image}
                  alt={activeVisualMeta.alt}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_SMOOTH }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090C12] via-[#090C12]/35 to-black/15" />
              <div className="pointer-events-none absolute inset-0 studio-photo-bezel" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-lime-400 uppercase tracking-wider">
                  {activeVisualMeta.accentLabel}
                </span>
                <SymbolShieldGuard className="w-5 h-5 shrink-0" />
              </div>
            </div>

            <div className="p-6 space-y-4 text-white flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Production Architecture
                </span>
                <h4 className="text-lg font-bold text-white">
                  {activeServiceTitle}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Custom-engineered specifically around your operational data, backed by documented milestones and full source ownership.
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openContactModal(activeServiceTitle)}
                className="group/btn w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Build Custom {activeServiceTitle}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
