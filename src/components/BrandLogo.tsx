import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandLogoProps["size"]>, { box: string; img: string }> = {
  sm: {
    box: "h-9 px-2 py-1 rounded-xl",
    img: "h-6 w-auto",
  },
  md: {
    box: "h-10 px-2.5 py-1.5 rounded-xl",
    img: "h-7 w-auto",
  },
  lg: {
    box: "h-16 px-4 py-2.5 rounded-2xl",
    img: "h-11 w-auto",
  },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
}) => {
  const dims = SIZE_CLASSES[size];

  return (
    <div
      className={`inline-flex items-center justify-center bg-white dark:bg-slate-50 border border-slate-200/90 dark:border-white/20 shadow-xs group-hover:shadow-md group-hover:border-lime-500/40 dark:group-hover:border-lime-400/50 group-hover:scale-[1.03] transition-all duration-200 shrink-0 ${dims.box} ${className}`}
    >
      <img
        src="/assets/aistudio/xelvion_logo__1__d1799ed9.png"
        alt="Xelvion Innova Tech Logo"
        className={`${dims.img} object-contain select-none pointer-events-none`}
        loading="eager"
      />
    </div>
  );
};
