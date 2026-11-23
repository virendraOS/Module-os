import type { Transition, Variants } from "motion/react";

export const EASE_SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const TRANSITION_FAST: Transition = {
  duration: 0.22,
  ease: EASE_SMOOTH,
};

export const TRANSITION_BASE: Transition = {
  duration: 0.48,
  ease: EASE_SMOOTH,
};

export const TRANSITION_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.04,
} as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.54,
      delay,
      ease: EASE_SMOOTH,
    },
  }),
};

export const revealSlideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.54,
      delay,
      ease: EASE_SMOOTH,
    },
  }),
};

export const revealSlideRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.54,
      delay,
      ease: EASE_SMOOTH,
    },
  }),
};

export const revealZoomVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.56,
      delay,
      ease: EASE_SMOOTH,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.46,
      ease: EASE_SMOOTH,
    },
  },
};

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

export const modalPanelVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: EASE_SMOOTH },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};
