import React from "react";
import { AmbientNetworkCanvas } from "./AmbientNetworkCanvas";

interface AmbientBackdropProps {
  variant?: "hero" | "section" | "banner";
  showNetwork?: boolean;
}

export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({
  variant = "section",
  showNetwork = false,
}) => {
  if (variant === "banner") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="studio-grain absolute inset-0" />
        <div className="animate-aurora-float absolute -top-24 -left-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="animate-aurora-reverse absolute -bottom-24 -right-12 w-72 h-72 rounded-full bg-lime-400/18 blur-3xl" />
        <div className="animate-beam-sweep absolute -inset-y-16 w-56 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Subtle tactile paper / anodized metal grain */}
        <div className="studio-grain absolute inset-0" />

        {/* Seamless animated architectural drafting grid */}
        <div className="animate-grid-drift absolute -inset-12 bg-arch-grid opacity-75 dark:opacity-90" />

        {/* Calibrated directional key-light & atmospheric bounce */}
        <div className="animate-aurora-float absolute -top-40 right-[-5rem] w-[34rem] h-[34rem] rounded-full bg-blue-600/10 dark:bg-blue-500/14 blur-3xl" />
        <div className="animate-aurora-reverse absolute -bottom-36 -left-24 w-[28rem] h-[28rem] rounded-full bg-lime-500/10 dark:bg-lime-400/10 blur-3xl" />
        <div className="animate-aurora-float absolute top-1/3 left-1/3 w-[20rem] h-[20rem] rounded-full bg-amber-400/6 dark:bg-sky-400/8 blur-3xl" />

        {/* Soft overhead studio vignette framing */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/35 dark:from-white/[0.03] to-transparent" />

        {/* Diagonal subtle signal shimmer beam */}
        <div className="animate-beam-sweep absolute -inset-y-24 w-64 bg-gradient-to-r from-transparent via-blue-400/8 dark:via-lime-400/8 to-transparent blur-2xl" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="studio-grain absolute inset-0" />
      <div className="animate-grid-drift absolute -inset-12 bg-arch-grid opacity-40 dark:opacity-55" />
      {showNetwork && <AmbientNetworkCanvas className="opacity-50 dark:opacity-65" />}
      <div className="animate-aurora-float absolute -top-24 right-[-5rem] w-[28rem] h-[28rem] rounded-full bg-blue-600/6 dark:bg-blue-500/10 blur-3xl" />
      <div className="animate-aurora-reverse absolute -bottom-28 left-[-4rem] w-[24rem] h-[24rem] rounded-full bg-lime-600/6 dark:bg-lime-400/8 blur-3xl" />
    </div>
  );
};
