import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  lift?: number;
}

/**
 * Interactive card with subtle mouse-tracking spotlight sheen and smooth elevation.
 * Uses GPU-composited transforms and opacity; honors prefers-reduced-motion.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(37, 99, 235, 0.09)",
  lift = -5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReduced ? undefined : { y: lift }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Interactive spotlight sheen */}
      {!prefersReduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: coords.active ? 1 : 0,
            background: `radial-gradient(360px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 72%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
