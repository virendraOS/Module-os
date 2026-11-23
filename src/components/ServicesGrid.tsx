import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES_LIST, ServiceDetail } from "../data/companyConfig";
import {
  EASE_SMOOTH,
  VIEWPORT_ONCE,
  fadeUpVariants,
  revealZoomVariants,
  TRANSITION_SPRING,
} from "../lib/motion";
import { getRealisticServiceSymbol } from "./RealisticIcons";
import { getServiceVisual } from "../lib/serviceVisuals";
import { AmbientBackdrop } from "./AmbientBackdrop";

interface ServicesGridProps {
  onSelectService: (service: ServiceDetail) => void;
  openContactModal: (serviceName?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onSelectService,
  openContactModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  const ambientGlowY = useTransform(smoothProgress, [0, 1], [-40, 50]);

  const categories = [
    "All",
    "Infrastructure",
    "Conversational Tech",
    "Data Systems",
    "Supply Chain",
    "Creative Media",
    "Technical Support",
  ];

  const filteredServices =
    selectedCategory === "All"
      ? SERVICES_LIST
      : SERVICES_LIST.filter(
          (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 sm:py-28 studio-section-primary border-b transition-colors overflow-hidden"
    >
      <AmbientBackdrop variant="section" />
      {/* Scroll-linked subtle atmospheric glow */}
      <motion.div
        aria-hidden="true"
        style={prefersReduced ? undefined : { y: ambientGlowY }}
        className="pointer-events-none absolute top-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-blue-500/6 dark:bg-blue-600/10 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header (whileInView reveal) */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              <span>SPECIALIZED PORTFOLIO</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                /
              </span>
              <span className="text-emerald-700 dark:text-lime-400">
                10 FOCUSED DISCIPLINES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Pragmatic Engineering Services for Indian Enterprises
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We do not pretend to do everything. We focus exclusively on 10 technical disciplines where we have battle-tested architectures and guaranteed milestone outcomes.
            </p>
          </div>

          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 border-t-2 border-blue-600 dark:border-lime-400 pt-3 max-w-xs leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              Clear Engineering Boundary
            </span>
            We do not sell generic off-the-shelf ERPs. Every architecture is built directly around your exact workflow.
          </div>
        </motion.div>

        {/* Minimal Underline Category Filter Tabs */}
        <motion.div
          variants={fadeUpVariants}
          custom={0.08}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200 dark:border-slate-800"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative pb-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-blue-700 dark:text-lime-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeServiceCategory"
                    transition={TRANSITION_SPRING}
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-blue-700 dark:bg-lime-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Unboxed Editorial Services Showcase */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE_SMOOTH }}
            className="space-y-14"
          >
            {/* Flagship Split Rows when viewing All */}
            {selectedCategory === "All" && (
              <div className="space-y-12 pb-10 border-b border-slate-200 dark:border-slate-800">
                {filteredServices.slice(0, 2).map((service, idx) => {
                  const visual = getServiceVisual(service.id);
                  const reverse = idx % 2 === 1;
                  return (
                    <motion.div
                      key={service.id}
                      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VIEWPORT_ONCE}
                      transition={{ duration: 0.48, ease: EASE_SMOOTH }}
                      className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                    >
                      {/* Edge-to-Edge Studio Photo with subtle ambient float */}
                      <motion.div
                        animate={prefersReduced ? undefined : { y: [0, -7, 0] }}
                        transition={{
                          duration: 4.8 + idx * 0.7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        whileHover={prefersReduced ? undefined : { scale: 1.01 }}
                        onClick={() => onSelectService(service)}
                        className={`lg:col-span-6 cursor-pointer relative aspect-[16/10] rounded-3xl overflow-hidden studio-photo-frame will-change-transform ${
                          reverse ? "lg:order-2" : ""
                        }`}
                      >
                        <img
                          src={visual.image}
                          alt={visual.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090F]/85 via-[#070B12]/25 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 rounded-3xl studio-photo-bezel" />
                        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-lime-400">
                            {visual.accentLabel}
                          </span>
                          <motion.div
                            animate={prefersReduced ? undefined : { y: [0, -3, 0] }}
                            transition={{
                              duration: 3.4 + idx * 0.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="w-9 h-9 rounded-xl bg-slate-950/85 border border-white/15 flex items-center justify-center"
                          >
                            {getRealisticServiceSymbol(service.id, "w-5 h-5")}
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Open Unboxed Typography & Deliverables */}
                      <div className={`lg:col-span-6 space-y-4 ${reverse ? "lg:order-1" : ""}`}>
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                          <span className="font-mono text-slate-400 dark:text-slate-500">
                            0{idx + 1}
                          </span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                            /
                          </span>
                          <span className="uppercase tracking-wider">{service.category}</span>
                        </div>

                        <h3
                          onClick={() => onSelectService(service)}
                          className="cursor-pointer text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors leading-tight"
                        >
                          {service.title}
                        </h3>

                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {service.shortBenefit}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {service.whatsIncluded.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300"
                            >
                              <Check className="w-4 h-4 text-emerald-600 dark:text-lime-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 flex flex-wrap items-center gap-4">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => openContactModal(service.title)}
                            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 dark:bg-lime-400 dark:text-slate-950 dark:hover:bg-lime-300 rounded-xl transition-colors shadow-sm"
                          >
                            Book {service.title}
                          </motion.button>
                          <button
                            onClick={() => onSelectService(service)}
                            className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-lime-400 inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span>View Technical Scope</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Open Photo-First Architectural Grid (Zero Card Boxes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {(selectedCategory === "All"
                ? filteredServices.slice(2)
                : filteredServices
              ).map((service, index) => {
                const displayNumber =
                  selectedCategory === "All" ? index + 3 : index + 1;
                const visual = getServiceVisual(service.id);

                return (
                  <motion.article
                    key={service.id}
                    initial={prefersReduced ? false : { opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{
                      duration: 0.42,
                      delay: Math.min((index % 3) * 0.07, 0.21),
                      ease: EASE_SMOOTH,
                    }}
                    className="group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      {/* Frameless Rounded Studio Photo with subtle staggered float */}
                      <motion.div
                        animate={prefersReduced ? undefined : { y: [0, -5, 0] }}
                        transition={{
                          duration: 4.4 + (index % 3) * 0.6,
                          delay: (index % 3) * 0.25,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        onClick={() => onSelectService(service)}
                        className="cursor-pointer relative aspect-[16/10] w-full rounded-2xl overflow-hidden studio-photo-frame transition-all duration-300 will-change-transform"
                      >
                        <img
                          src={visual.image}
                          alt={visual.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090F]/90 via-[#070B12]/25 to-black/15" />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl studio-photo-bezel" />

                        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-white/95 drop-shadow-xs">
                            {service.category}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-lime-400 tabular-nums">
                            {String(displayNumber).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                          <span className="text-[11px] font-mono font-semibold text-slate-200 truncate">
                            {visual.accentLabel}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-slate-950/85 border border-white/15 flex items-center justify-center shrink-0">
                            {getRealisticServiceSymbol(service.id, "w-4 h-4")}
                          </div>
                        </div>
                      </motion.div>

                      {/* Open Unboxed Typography */}
                      <div className="space-y-2">
                        <h3
                          onClick={() => onSelectService(service)}
                          className="cursor-pointer text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors leading-snug"
                        >
                          {service.title}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {service.shortBenefit}
                        </p>

                        <div className="space-y-1.5 pt-2">
                          {service.whatsIncluded.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Clean Hairline Footer Actions */}
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onSelectService(service)}
                        className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-lime-400 flex items-center gap-1.5 transition-colors"
                      >
                        <span>View Specifications</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </button>

                      <button
                        onClick={() => openContactModal(service.title)}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-lime-400 transition-colors"
                      >
                        Consult Now →
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Open Guarantee Strip (No Heavy Floating Box) */}
        <motion.div
          variants={revealZoomVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-1.5 max-w-2xl">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              Every Service is Backed by Our 30-Day Milestone Guarantee
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Written technical specifications, test scripts, and transparent milestones. If an agreed milestone fails verification, we fix it at our own cost.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openContactModal()}
            className="px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-blue-700 dark:bg-lime-400 dark:text-slate-950 dark:hover:bg-lime-300 rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            Schedule Discovery Discussion
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
