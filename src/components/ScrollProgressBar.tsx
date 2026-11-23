import React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

interface ScrollProgressBarProps {
  /** Optional scrollable container ref for long-form modal readers (Service Details, Blog, Legal). Defaults to window scroll. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Placement: "viewport" pins to the very top edge of the browser viewport; "inline" renders flush at the bottom of a modal header. */
  placement?: "viewport" | "inline";
  className?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  containerRef,
  placement = "viewport",
  className = "",
}) => {
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined
  );

  const smoothScaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  const scaleX = prefersReduced ? scrollYProgress : smoothScaleX;

  if (placement === "inline") {
    return (
      <div
        aria-hidden="true"
        className={`relative h-[3px] w-full bg-slate-800/80 overflow-hidden pointer-events-none shrink-0 ${className}`}
      >
        <motion.div
          style={{ scaleX }}
          className="h-full w-full origin-left bg-gradient-to-r from-blue-500 via-sky-400 to-lime-400 will-change-transform"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 h-[3px] pointer-events-none ${
        containerRef
          ? "z-[75] bg-slate-200 dark:bg-slate-800"
          : "z-[70] bg-slate-200/40 dark:bg-slate-800/50"
      } ${className}`}
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-blue-600 via-sky-500 to-lime-400 dark:from-blue-500 dark:via-sky-400 dark:to-lime-400 shadow-[0_0_10px_rgba(59,130,246,0.45)] will-change-transform"
      />
    </div>
  );
};
