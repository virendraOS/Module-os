import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_SMOOTH } from "../lib/motion";
import {
  SymbolShieldGuard,
  SymbolEngineeringCore,
  SymbolOfflineSync,
  SymbolMilestonePrecision,
} from "./RealisticIcons";
import { VISUAL_ASSETS } from "../lib/serviceVisuals";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { HeroParticles } from "./HeroParticles";

interface HeroSectionProps {
  openContactModal: () => void;
}

const COMMITMENTS = [
  {
    icon: SymbolShieldGuard,
    title: "30-Day Milestone Guarantee",
    desc: "Free revisions if specifications are not met",
  },
  {
    icon: SymbolEngineeringCore,
    title: "Direct Engineering Support",
    desc: "Speak directly with engineers, not sales middlemen",
  },
  {
    icon: SymbolOfflineSync,
    title: "Offline-First Resilience",
    desc: "Works smoothly on Tier-2/3 Indian mobile connections",
  },
  {
    icon: SymbolMilestonePrecision,
    title: "Clear Milestone Delivery",
    desc: "Written scope, realistic dates, and clean handover",
  },
];

const HERO_SHOWCASE_FRAMES = [
  {
    id: "lab",
    image: VISUAL_ASSETS.heroTech,
    title: "Built for Indian Operations",
    subtitle: "Dependable engineering hubs across Bengaluru & New Delhi NCR.",
    tag: "Engineering Lab",
  },
  {
    id: "cloud",
    image: VISUAL_ASSETS.cloudServers,
    title: "High-Availability Cloud Racks",
    subtitle: "Zero-downtime AWS Mumbai & GCP Delhi enterprise deployments.",
    tag: "Cloud Infrastructure",
  },
  {
    id: "db",
    image: VISUAL_ASSETS.databaseEngine,
    title: "Relational DBMS & Private AI",
    subtitle: "Sub-second PostgreSQL clusters and isolated Excel sanitization.",
    tag: "Data Architecture",
  },
];

const TECH_ECOSYSTEM = [
  "AWS Mumbai Region",
  "Google Cloud Delhi",
  "PostgreSQL Clusters",
  "Meta WhatsApp Cloud API",
  "Offline-First IndexedDB",
  "Private AI Data Pipelines",
  "Automated Encrypted Vaults",
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  openContactModal,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [frameIdx, setFrameIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.975]);

  // Smooth 3D Perspective Mouse-Tilt on Hero Showcase Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 180,
    damping: 22,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(px);
    mouseY.set(py);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % HERO_SHOWCASE_FRAMES.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [prefersReduced]);

  const activeFrame = HERO_SHOWCASE_FRAMES[frameIdx];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden studio-hero-surface pt-10 pb-12 lg:pt-16 lg:pb-16 border-b transition-colors"
    >
      {/* Animated architectural grid & subtle studio atmosphere */}
      <AmbientBackdrop variant="hero" />

      {/* Interactive tsParticles digital engineering node network */}
      <HeroParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (7 cols): Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Kicker with clean hairline dividers */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
              className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-blue-800 dark:text-blue-400 tracking-wide"
            >
              <span>INDIAN SME DIGITAL ENGINEERING</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                /
              </span>
              <span>NO JARGON</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                /
              </span>
              <span className="text-emerald-700 dark:text-lime-400">
                DIRECT ACCOUNTABILITY
              </span>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: EASE_SMOOTH }}
              className="text-4xl sm:text-5xl lg:text-[3.45rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance"
            >
              Dependable Digital &amp; Software Systems for{" "}
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-lime-400 bg-clip-text text-transparent">
                Indian SMEs
              </span>
              .
            </motion.h1>

            {/* One-Line Concrete Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.12, ease: EASE_SMOOTH }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
            >
              We build reliable cloud infrastructure, dispatch logistics tech, WhatsApp &amp; Telegram chatbots, DBMS, and AI data filters engineered for Indian business operations.
            </motion.p>

            {/* 4 Honest SME Commitments — Open Unboxed Editorial Grid */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.18, ease: EASE_SMOOTH }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80"
            >
              {COMMITMENTS.map((item) => {
                const Symbol = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-3"
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                      <Symbol className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.24, ease: EASE_SMOOTH }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={openContactModal}
                className="group px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-700 rounded-xl transition-all shadow-[0_6px_20px_-4px_rgba(37,99,235,0.45),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_10px_26px_-4px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.32)] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Get a Free Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>

              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#services"
                className="px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-lime-400 studio-tile rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Explore Our 10 Services</span>
              </motion.a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3, ease: EASE_SMOOTH }}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              Direct consultation with our engineering team / No sales pressure / Written technical scope
            </motion.p>
          </div>

          {/* Right Column (5 cols): Frameless Full-Bleed Photography Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.58, delay: 0.14, ease: EASE_SMOOTH }}
            style={prefersReduced ? undefined : { y: visualY, scale: visualScale, perspective: 1100 }}
            className="lg:col-span-5"
          >
            <motion.div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={prefersReduced ? undefined : { rotateX, rotateY }}
              className="group relative rounded-3xl overflow-hidden studio-photo-frame h-[420px] sm:h-[470px]"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFrame.id}
                  src={activeFrame.image}
                  alt={activeFrame.title}
                  initial={{ opacity: 0, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE_SMOOTH }}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Editorial dark gradient scrim + subtle optical bezel rim for crisp overlaid typography */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090F]/95 via-[#070B12]/40 to-black/20" />
              <div className="pointer-events-none absolute inset-0 rounded-3xl studio-photo-bezel" />

              {/* Top minimal tag + frame indicator dots */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-lime-400 uppercase tracking-wider drop-shadow-sm">
                  {activeFrame.tag}
                </span>
                <div className="flex items-center gap-1.5">
                  {HERO_SHOWCASE_FRAMES.map((frame, i) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => setFrameIdx(i)}
                      aria-label={`Preview ${frame.tag}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === frameIdx
                          ? "w-7 bg-lime-400"
                          : "w-2.5 bg-white/45 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dynamic Editorial Caption directly overlaid on photography */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFrame.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <SymbolShieldGuard className="w-5 h-5 shrink-0" />
                        <span className="text-base font-bold text-white tracking-tight">
                          {activeFrame.title}
                        </span>
                      </div>
                      <span className="text-lime-400 font-mono text-[11px] font-semibold shrink-0">
                        10 Services
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-2">
                      {activeFrame.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Continuous Infrastructure Stack Marquee Strip */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 hidden sm:inline">
              Engineered Stack
            </span>
            <div className="flex-1 overflow-hidden relative">
              <motion.div
                animate={
                  prefersReduced
                    ? undefined
                    : { x: ["0%", "-50%"] }
                }
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 24,
                }}
                className="flex items-center gap-6 whitespace-nowrap w-max text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                {[...TECH_ECOSYSTEM, ...TECH_ECOSYSTEM].map((tech, idx) => (
                  <React.Fragment key={`${tech}-${idx}`}>
                    <span className="hover:text-blue-700 dark:hover:text-lime-400 transition-colors">
                      {tech}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                      /
                    </span>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
