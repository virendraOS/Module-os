import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  VIEWPORT_ONCE,
  fadeUpVariants,
  revealSlideRightVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../lib/motion";
import {
  SymbolOfflineSync,
  SymbolEngineeringCore,
  SymbolShieldGuard,
  SymbolCorporateSeal,
} from "./RealisticIcons";
import { VISUAL_ASSETS } from "../lib/serviceVisuals";
import { AmbientBackdrop } from "./AmbientBackdrop";

interface WhyXelvionProps {
  openContactModal: () => void;
}

export const WhyXelvion: React.FC<WhyXelvionProps> = ({ openContactModal }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
  });

  const spotlightImgY = useTransform(smoothProgress, [0, 1], [-18, 18]);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative py-20 sm:py-28 studio-section-alt border-b transition-colors overflow-hidden"
    >
      <AmbientBackdrop variant="section" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="max-w-3xl space-y-3.5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <span>THE XELVION CODE</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              /
            </span>
            <span className="text-emerald-700 dark:text-lime-400">
              NO FLUFF COMMITMENT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Why Indian SMEs Choose Xelvion Over Generic Agencies
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Most software vendors in India either overpromise enterprise complexity or deliver fragile templates that break within months. We engineer sturdy systems designed specifically for Indian operational realities.
          </p>
        </motion.div>

        {/* Open Two-Column Editorial Spread (No Heavy Card Boxes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column (7 cols): Open Numbered Engineering Commitments with Hairline Dividers */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-7 divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800"
          >
            {[
              {
                num: "01",
                icon: <SymbolOfflineSync className="w-7 h-7" />,
                title: "Offline-First Architecture",
                desc: "Indian logistics routes, warehouse floors, and factory basements often face unstable 4G. Our web software queues inputs locally and synchronizes automatically the moment connectivity restores.",
                tag: "Zero data loss during network blackouts",
                tagColor: "text-amber-700 dark:text-amber-400",
              },
              {
                num: "02",
                icon: <SymbolEngineeringCore className="w-7 h-7" />,
                title: "Focused 10-Service Discipline",
                desc: "We never stretch into areas we do not specialize in. Every system is built across our 10 battle-tested domains—from cloud hosting and logistics tools to WhatsApp automation and data hygiene.",
                tag: "100% custom-fit operational workflows",
                tagColor: "text-blue-700 dark:text-blue-400",
              },
              {
                num: "03",
                icon: <SymbolShieldGuard className="w-7 h-7" />,
                title: "30-Day Milestone Guarantee",
                desc: "Every project has clear, documented acceptance criteria. If a delivered module does not match the signed specification, all rework is 100% complimentary until it passes testing.",
                tag: "Written SLA acceptance criteria",
                tagColor: "text-emerald-700 dark:text-lime-400",
              },
              {
                num: "04",
                icon: <SymbolCorporateSeal className="w-7 h-7" />,
                title: "Registered Corporate Accountability",
                desc: "We are a legally incorporated Indian Private Limited company. Every engagement includes clear written specifications, bilateral NDA protection, and full source ownership handover.",
                tag: "Full IP & documentation handover",
                tagColor: "text-slate-700 dark:text-slate-300",
              },
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                variants={staggerItemVariants}
                className="group py-6 first:pt-5 last:pb-5 flex items-start gap-5 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                    {pillar.num}
                  </span>
                  <motion.div
                    animate={prefersReduced ? undefined : { y: [0, -4, 0] }}
                    transition={{
                      duration: 3.6 + idx * 0.45,
                      delay: idx * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 will-change-transform"
                  >
                    {pillar.icon}
                  </motion.div>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors">
                      {pillar.title}
                    </h3>
                    <span className={`text-xs font-semibold ${pillar.tagColor}`}>
                      {pillar.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column (5 cols): Full-Bleed Tall Photography Spotlight with subtle ambient float */}
          <motion.div
            variants={revealSlideRightVariants}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-5 flex"
          >
            <motion.div
              animate={prefersReduced ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="group relative w-full min-h-[440px] lg:min-h-full rounded-3xl overflow-hidden studio-photo-frame flex flex-col justify-end will-change-transform"
            >
              <motion.img
                style={prefersReduced ? undefined : { y: spotlightImgY, scale: 1.09 }}
                src={VISUAL_ASSETS.cloudLogistics}
                alt="Xelvion Cloud & Logistics Software Dashboard Preview"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090F] via-[#070B12]/70 to-black/15" />
              <div className="pointer-events-none absolute inset-0 rounded-3xl studio-photo-bezel" />

              <div className="relative z-10 p-6 sm:p-8 space-y-4 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span>ARCHITECTURE SPOTLIGHT</span>
                  <span aria-hidden="true" className="text-slate-500">
                    /
                  </span>
                  <span className="text-lime-400">
                    LOGISTICS &amp; CLOUD
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white leading-snug">
                  Engineered for High-Frequency Dispatch &amp; Data Streams
                </h3>

                <p className="text-sm text-slate-200/90 leading-relaxed">
                  Whether synchronizing interstate transport manifests or streaming warehouse telemetry, our architectures maintain sub-second response times without expensive cloud lock-in.
                </p>

                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href="#process"
                    className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1.5 group/link"
                  >
                    <span>View Our 5-Step Process</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-200" />
                  </a>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={openContactModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-white hover:bg-lime-50 rounded-xl transition-colors shadow-sm"
                  >
                    Ask Engineering Question
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
