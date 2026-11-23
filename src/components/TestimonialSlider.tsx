import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  PanInfo,
} from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  Quote,
} from "lucide-react";
import { CLIENT_TESTIMONIALS } from "../data/companyConfig";
import {
  EASE_SMOOTH,
  VIEWPORT_ONCE,
  fadeUpVariants,
  revealZoomVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../lib/motion";
import { SpotlightCard } from "./SpotlightCard";
import {
  getRealisticServiceSymbol,
  SymbolShieldGuard,
} from "./RealisticIcons";

interface TestimonialSliderProps {
  openContactModal: (serviceName?: string) => void;
}

const AUTO_ADVANCE_MS = 6500;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 56 : -56,
    opacity: 0,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { duration: 0.42, ease: EASE_SMOOTH },
      opacity: { duration: 0.3, ease: EASE_SMOOTH },
      scale: { duration: 0.42, ease: EASE_SMOOTH },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -56 : 56,
    opacity: 0,
    scale: 0.985,
    transition: {
      x: { duration: 0.32, ease: EASE_SMOOTH },
      opacity: { duration: 0.24, ease: EASE_SMOOTH },
      scale: { duration: 0.32, ease: EASE_SMOOTH },
    },
  }),
};

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  openContactModal,
}) => {
  const [[activeIndex, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 25,
    mass: 0.4,
  });

  const ambientY = useTransform(smoothScroll, [0, 1], [-36, 44]);

  const totalSlides = CLIENT_TESTIMONIALS.length;
  const activeStory = CLIENT_TESTIMONIALS[activeIndex];

  const paginate = useCallback(
    (step: number) => {
      setSlide(([prevIdx]) => {
        const nextIdx = (prevIdx + step + totalSlides) % totalSlides;
        return [nextIdx, step >= 0 ? 1 : -1];
      });
    },
    [totalSlides]
  );

  const jumpTo = (targetIdx: number) => {
    setSlide(([prevIdx]) => {
      if (prevIdx === targetIdx) return [prevIdx, 1];
      return [targetIdx, targetIdx > prevIdx ? 1 : -1];
    });
  };

  useEffect(() => {
    if (isPaused || isHovered || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      paginate(1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, isHovered, shouldReduceMotion, paginate, activeIndex]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -55 || info.velocity.x < -300) {
      paginate(1);
    } else if (info.offset.x > 55 || info.velocity.x > 300) {
      paginate(-1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="relative py-20 sm:py-28 studio-section-alt border-b transition-colors overflow-hidden"
    >
      {/* Architectural Grid + Tactile Grain + Scroll-Linked Ambient Depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-grain" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-arch-grid opacity-45"
      />
      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { y: ambientY }}
        className="pointer-events-none absolute -top-28 left-1/4 w-[32rem] h-[32rem] rounded-full bg-blue-600/8 dark:bg-blue-500/10 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { y: ambientY }}
        className="pointer-events-none absolute -bottom-24 right-1/4 w-[26rem] h-[26rem] rounded-full bg-lime-500/10 dark:bg-lime-400/8 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header + Slider Controls (whileInView reveal) */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-lime-400 uppercase tracking-wider">
              <span>VERIFIED CLIENT OUTCOMES</span>
              <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">
                /
              </span>
              <span>INDIAN SME DEPLOYMENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Measurable Engineering Impact Across Indian Businesses
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Real before-and-after transformations delivered for fleet operators, distributors, healthcare suppliers, and regional manufacturers.
            </p>
          </div>

          {/* Interactive Transport Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-mono font-bold tabular-nums text-slate-500 dark:text-slate-400 mr-1">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(totalSlides).padStart(2, "0")}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
              title={isPaused ? "Resume slider" : "Pause slider"}
              className="w-10 h-10 rounded-xl studio-tile hover:border-blue-400 dark:hover:border-lime-400 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ x: -1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => paginate(-1)}
              aria-label="Previous client story"
              className="w-10 h-10 rounded-xl studio-tile hover:border-blue-400 dark:hover:border-lime-400 text-slate-800 dark:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ x: 1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => paginate(1)}
              aria-label="Next client story"
              className="w-10 h-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 dark:from-blue-500 dark:to-blue-700 text-white flex items-center justify-center transition-all shadow-[0_4px_12px_-2px_rgba(15,23,42,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Animated Slider Stage (whileInView revealZoom) */}
        <motion.div
          variants={revealZoomVariants}
          custom={0.08}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") paginate(1);
            if (e.key === "ArrowLeft") paginate(-1);
          }}
          aria-roledescription="carousel"
          aria-label="Client Success Stories"
          className="outline-none"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeStory.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={shouldReduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <SpotlightCard
                spotlightColor="rgba(132, 204, 22, 0.14)"
                className="rounded-3xl studio-card overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Left 7 Cols */}
                  <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                            {getRealisticServiceSymbol(
                              activeStory.serviceId,
                              "w-6 h-6"
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <span className="text-blue-700 dark:text-lime-400 uppercase tracking-wider">
                              {activeStory.serviceTitle}
                            </span>
                            <span
                              className="text-slate-300 dark:text-slate-700"
                              aria-hidden="true"
                            >
                              /
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {activeStory.timeframe}
                            </span>
                          </div>
                        </div>

                        <Quote
                          className="w-7 h-7 text-slate-200 dark:text-slate-800 shrink-0"
                          aria-hidden="true"
                        />
                      </div>

                      <blockquote className="text-lg sm:text-[1.35rem] font-semibold text-slate-900 dark:text-white leading-relaxed">
                        &ldquo;{activeStory.quote}&rdquo;
                      </blockquote>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
                        <div className="border-t-2 border-slate-300/80 dark:border-slate-700 pt-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Operational Bottleneck
                          </span>
                          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            {activeStory.beforeState}
                          </p>
                        </div>

                        <div className="border-t-2 border-emerald-600 dark:border-lime-400 pt-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-lime-400 block">
                            Engineered Outcome
                          </span>
                          <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                            {activeStory.outcomeState}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-slate-800 text-lime-400 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-800 dark:border-slate-700">
                          {activeStory.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {activeStory.clientName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {activeStory.role} / {activeStory.company} /{" "}
                            {activeStory.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-lime-400">
                        <SymbolShieldGuard className="w-4 h-4 shrink-0" />
                        <span>Verified Deployment</span>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Cols */}
                  <div className="lg:col-span-5 bg-gradient-to-b from-[#131A27] to-[#0A0E16] text-white p-6 sm:p-9 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-blue-600/20 blur-3xl"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-lime-500/15 blur-3xl"
                    />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400">
                          Measured Impact
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Case #{activeStory.indexLabel}
                        </span>
                      </div>

                      <div className="divide-y divide-white/10 border-t border-b border-white/10">
                        <div className="py-5 space-y-1">
                          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white block">
                            {activeStory.primaryMetric}
                          </span>
                          <span className="text-xs font-semibold text-lime-400 block">
                            {activeStory.primaryMetricLabel}
                          </span>
                        </div>

                        <div className="py-5 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-2xl font-bold tabular-nums text-blue-400 block">
                              {activeStory.secondaryMetric}
                            </span>
                            <span className="text-xs text-slate-300">
                              {activeStory.secondaryMetricLabel}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                            {getRealisticServiceSymbol(
                              activeStory.serviceId,
                              "w-5 h-5"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-2 space-y-3">
                      <motion.button
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openContactModal(activeStory.serviceTitle)}
                        className="group w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-lime-500 to-lime-400 hover:from-lime-400 hover:to-lime-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <span>Consult on {activeStory.serviceTitle}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                      <p className="text-[11px] text-slate-400 text-center">
                        30-day milestone guarantee / Written specification included
                      </p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom Interactive Story Switcher — Unboxed Progress Tabs */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2"
        >
          {CLIENT_TESTIMONIALS.map((story, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={story.id}
                variants={staggerItemVariants}
                type="button"
                onClick={() => jumpTo(idx)}
                className="group text-left pt-3 relative overflow-hidden transition-opacity"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  {isActive && !isPaused && !isHovered && !shouldReduceMotion ? (
                    <motion.div
                      key={`progress-${activeIndex}-${isPaused}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: AUTO_ADVANCE_MS / 1000,
                        ease: "linear",
                      }}
                      className="h-full w-full origin-left bg-gradient-to-r from-blue-600 to-lime-500"
                    />
                  ) : (
                    <div
                      className={`h-full w-full transition-opacity ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-lime-500 opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      isActive
                        ? "text-blue-700 dark:text-lime-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {story.indexLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    {story.city.split(",")[0]}
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  }`}
                >
                  {story.company}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {story.primaryMetric} {story.primaryMetricLabel}
                </p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
