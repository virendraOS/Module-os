import React from "react";

interface SymbolProps {
  className?: string;
}

/**
 * Realistic, layered gradient SVG emblems with depth, highlights, and crisp contours.
 * Designed to harmonize with Xelvion's Cobalt, Emerald/Lime, Amber, and Obsidian palette.
 */

export const SymbolCloudRack: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cloudGrad" x1="6" y1="8" x2="34" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="rackGrad" x1="8" y1="22" x2="32" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <path
      d="M12.5 24h16a6.5 6.5 0 0 0 1.3-12.87A8.5 8.5 0 0 0 13.4 9.2 6 6 0 0 0 12.5 24Z"
      fill="url(#cloudGrad)"
    />
    <path
      d="M13 11.5a6.5 6.5 0 0 1 11.2-2.2"
      stroke="#DBEAFE"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
    <rect x="7" y="21" width="26" height="6.5" rx="2.2" fill="url(#rackGrad)" stroke="#475569" strokeWidth="0.9" />
    <rect x="7" y="29" width="26" height="6.5" rx="2.2" fill="url(#rackGrad)" stroke="#475569" strokeWidth="0.9" />
    <circle cx="11.5" cy="24.25" r="1.3" fill="#84CC16" />
    <circle cx="15.5" cy="24.25" r="1.3" fill="#38BDF8" />
    <rect x="22" y="23.5" width="7" height="1.5" rx="0.75" fill="#64748B" />
    <circle cx="11.5" cy="32.25" r="1.3" fill="#84CC16" />
    <rect x="22" y="31.5" width="7" height="1.5" rx="0.75" fill="#64748B" />
  </svg>
);

export const SymbolVideoStudio: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="vidBody" x1="4" y1="10" x2="36" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="vidGlass" x1="15" y1="14" x2="27" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>
    <rect x="4" y="8" width="32" height="24" rx="5.5" fill="url(#vidBody)" />
    <rect x="5" y="9" width="30" height="22" rx="4.5" stroke="#FDE68A" strokeOpacity="0.45" strokeWidth="1" />
    <rect x="8" y="12" width="3.5" height="3" rx="0.8" fill="#FFFBEB" fillOpacity="0.65" />
    <rect x="8" y="18.5" width="3.5" height="3" rx="0.8" fill="#FFFBEB" fillOpacity="0.65" />
    <rect x="8" y="25" width="3.5" height="3" rx="0.8" fill="#FFFBEB" fillOpacity="0.65" />
    <rect x="28.5" y="12" width="3.5" height="3" rx="0.8" fill="#FFFBEB" fillOpacity="0.65" />
    <rect x="28.5" y="18.5" width="3.5" height="3" rx="0.8" fill="#FFFBEB" fillOpacity="0.65" />
    <rect x="28.5" y="25" width="3.5" height="3" rx="0.8" fill="#FFFBEB" fillOpacity="0.65" />
    <path d="M16.5 14.8a1.2 1.2 0 0 1 1.84-1.02l8.2 5.2a1.2 1.2 0 0 1 0 2.04l-8.2 5.2a1.2 1.2 0 0 1-1.84-1.02V14.8Z" fill="url(#vidGlass)" />
  </svg>
);

export const SymbolSocialPulse: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="socGrad1" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
    </defs>
    <path d="M13 20l14-8M13 20l14 8" stroke="#6366F1" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="11" cy="20" r="6" fill="url(#socGrad1)" stroke="#E0E7FF" strokeWidth="1.2" />
    <circle cx="29" cy="11" r="5.5" fill="url(#socGrad1)" stroke="#E0E7FF" strokeWidth="1.2" />
    <circle cx="29" cy="29" r="5.5" fill="#84CC16" stroke="#ECFCCB" strokeWidth="1.2" />
    <circle cx="10" cy="18.8" r="1.6" fill="#FFFFFF" fillOpacity="0.7" />
    <circle cx="28" cy="10" r="1.4" fill="#FFFFFF" fillOpacity="0.7" />
    <path d="M27 29l1.3 1.4 2.7-2.8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SymbolLogisticsFleet: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cargoGrad" x1="4" y1="10" x2="25" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="cabGrad" x1="24" y1="15" x2="36" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <rect x="4" y="10" width="21" height="17" rx="3" fill="url(#cargoGrad)" />
    <path d="M7.5 14h14M7.5 18h10" stroke="#D1FAE5" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <path d="M24 14h6.8a2.5 2.5 0 0 1 2.2 1.32l2.6 4.88c.26.48.4 1.02.4 1.57V27H24V14Z" fill="url(#cabGrad)" />
    <path d="M26 16.2h4.2l2 3.8H26v-3.8Z" fill="#BAE6FD" />
    <circle cx="11" cy="29.5" r="4" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.4" />
    <circle cx="11" cy="29.5" r="1.4" fill="#94A3B8" />
    <circle cx="30" cy="29.5" r="4" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.4" />
    <circle cx="30" cy="29.5" r="1.4" fill="#84CC16" />
  </svg>
);

export const SymbolDatabaseVault: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="dbBody" x1="7" y1="8" x2="33" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
      <linearGradient id="dbTop" x1="7" y1="6" x2="33" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M8 12v18c0 3.04 5.37 5.5 12 5.5s12-2.46 12-5.5V12H8Z" fill="url(#dbBody)" />
    <ellipse cx="20" cy="12" rx="12" ry="5" fill="url(#dbTop)" stroke="#DBEAFE" strokeWidth="0.9" />
    <path d="M8 18.5c0 2.76 5.37 5 12 5s12-2.24 12-5" stroke="#93C5FD" strokeWidth="1.3" strokeOpacity="0.65" />
    <path d="M8 24.5c0 2.76 5.37 5 12 5s12-2.24 12-5" stroke="#93C5FD" strokeWidth="1.3" strokeOpacity="0.65" />
    <circle cx="27" cy="21" r="1.4" fill="#84CC16" />
    <circle cx="27" cy="27" r="1.4" fill="#84CC16" />
  </svg>
);

export const SymbolAiFilter: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="funnelGrad" x1="6" y1="8" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#6B21A8" />
      </linearGradient>
    </defs>
    <circle cx="14" cy="6.5" r="2.2" fill="#94A3B8" />
    <circle cx="20" cy="5.5" r="2.4" fill="#84CC16" />
    <circle cx="26" cy="6.5" r="2.2" fill="#38BDF8" />
    <path
      d="M6.8 11.2A1.8 1.8 0 0 1 8.3 8.5h23.4a1.8 1.8 0 0 1 1.5 2.7l-9.2 12.1v8.7a1.5 1.5 0 0 1-.83 1.34l-4.5 2.25A1.5 1.5 0 0 1 16.5 34.2V23.3L6.8 11.2Z"
      fill="url(#funnelGrad)"
    />
    <path d="M10.5 12h19" stroke="#F3E8FF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.65" />
    <circle cx="20" cy="34" r="2.6" fill="#84CC16" stroke="#ECFCCB" strokeWidth="1" />
  </svg>
);

export const SymbolDataVaultDrive: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="nvmeGrad" x1="5" y1="8" x2="35" y2="33" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <rect x="6" y="7" width="28" height="11.5" rx="3" fill="url(#nvmeGrad)" stroke="#64748B" strokeWidth="1" />
    <rect x="6" y="21.5" width="28" height="11.5" rx="3" fill="url(#nvmeGrad)" stroke="#64748B" strokeWidth="1" />
    <circle cx="11.5" cy="12.75" r="2" fill="#38BDF8" />
    <rect x="16" y="11.75" width="13" height="2" rx="1" fill="#94A3B8" />
    <circle cx="11.5" cy="27.25" r="2" fill="#84CC16" />
    <rect x="16" y="26.25" width="13" height="2" rx="1" fill="#94A3B8" />
  </svg>
);

export const SymbolWhatsAppBot: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="waGrad" x1="5" y1="6" x2="35" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path
      d="M20 5C11.72 5 5 11.27 5 19c0 3.04 1.04 5.85 2.81 8.14L6 34l7.15-1.88A15.6 15.6 0 0 0 20 33c8.28 0 15-6.27 15-14S28.28 5 20 5Z"
      fill="url(#waGrad)"
    />
    <rect x="12.5" y="13.5" width="15" height="11" rx="3.2" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="17" cy="19" r="1.5" fill="#059669" />
    <circle cx="23" cy="19" r="1.5" fill="#059669" />
    <path d="M18 11.5h4" stroke="#ECFDF5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SymbolTelegramBot: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="tgGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="15.5" fill="url(#tgGrad)" />
    <path
      d="M28.4 12.6 10.6 19.6c-.8.32-.78 1.45.03 1.74l4.46 1.56 1.74 5.38c.22.69 1.08.91 1.61.42l2.58-2.38 4.82 3.57c.68.5 1.65.13 1.83-.7l2.9-14.95c.2-.99-.75-1.82-1.69-1.44Z"
      fill="#FFFFFF"
    />
    <path d="M15.1 22.9 25.4 15.6l-7.1 8.5-.3 3.2-2.9-4.4Z" fill="#BAE6FD" />
  </svg>
);

export const SymbolShieldGuard: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="shGrad" x1="7" y1="5" x2="33" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path
      d="M20 4.5 7.5 9.6v9.8c0 8.02 5.34 14.95 12.5 17.1 7.16-2.15 12.5-9.08 12.5-17.1V9.6L20 4.5Z"
      fill="url(#shGrad)"
    />
    <path
      d="M20 6.8 9.5 11.1v8.3c0 6.84 4.46 12.82 10.5 14.84 6.04-2.02 10.5-8 10.5-14.84v-8.3L20 6.8Z"
      stroke="#A7F3D0"
      strokeOpacity="0.45"
      strokeWidth="1"
    />
    <path d="m14.8 20.2 3.6 3.6 7-7.4" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SymbolEngineeringCore: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="engGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <rect x="6" y="7" width="28" height="26" rx="6" fill="url(#engGrad)" />
    <path d="m15.5 16-4 4 4 4M24.5 16l4 4-4 4M21.5 14l-3 12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SymbolOfflineSync: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="offGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="15" fill="url(#offGrad)" />
    <path d="M13 17a10 10 0 0 1 14 0M16 21a6 6 0 0 1 8 0" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" />
    <circle cx="20" cy="26.5" r="2.2" fill="#FFFFFF" />
    <circle cx="31" cy="10" r="4" fill="#84CC16" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

export const SymbolMilestonePrecision: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="clkGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="15" fill="url(#clkGrad)" />
    <circle cx="20" cy="20" r="11" stroke="#E0E7FF" strokeOpacity="0.45" strokeWidth="1.2" />
    <path d="M20 12.5V20l5 3" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="20" r="1.8" fill="#84CC16" />
  </svg>
);

export const SymbolCorporateSeal: React.FC<SymbolProps> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="corpGrad" x1="6" y1="5" x2="34" y2="35" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <rect x="8" y="6" width="24" height="28" rx="4" fill="url(#corpGrad)" stroke="#64748B" strokeWidth="1" />
    <path d="M13 13h14M13 18h14M13 23h8" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
    <circle cx="27" cy="27" r="5.5" fill="#84CC16" stroke="#0F172A" strokeWidth="1.5" />
    <path d="m24.8 27 1.5 1.5 3-3" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SymbolDiscoveryLens: React.FC<SymbolProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="lensGrad" x1="6" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <path d="m25 25 8.5 8.5" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
    <circle cx="17.5" cy="17.5" r="10.5" fill="url(#lensGrad)" stroke="#DBEAFE" strokeWidth="1.5" />
    <path d="M13 14.5a6 6 0 0 1 6-3" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const SymbolLaunchRocket: React.FC<SymbolProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="rktGrad" x1="10" y1="6" x2="32" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M22 6c6 0 11 5 11 11-3.5 5-9 10-14 11l-7-7c1-5 6-10.5 10-15Z" fill="url(#rktGrad)" />
    <circle cx="24" cy="15" r="2.8" fill="#FFFFFF" />
    <path d="M12 22c-3 1-5 4-5 7 3 0 6-2 7-5" fill="#F59E0B" />
  </svg>
);

export const SymbolSystemSupport: React.FC<SymbolProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="supGrad" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="14" stroke="url(#supGrad)" strokeWidth="6" />
    <circle cx="20" cy="20" r="14" stroke="#84CC16" strokeWidth="6" strokeDasharray="11 11" />
    <circle cx="20" cy="20" r="6.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
  </svg>
);

export function getRealisticServiceSymbol(id: string, className = "w-7 h-7") {
  switch (id) {
    case "cloud-services":
      return <SymbolCloudRack className={className} />;
    case "video-editing":
      return <SymbolVideoStudio className={className} />;
    case "social-media-management":
      return <SymbolSocialPulse className={className} />;
    case "logistics-services":
      return <SymbolLogisticsFleet className={className} />;
    case "database-management-system":
      return <SymbolDatabaseVault className={className} />;
    case "ai-based-data-filter-software":
      return <SymbolAiFilter className={className} />;
    case "data-maintenance":
      return <SymbolDataVaultDrive className={className} />;
    case "whatsapp-chatbot":
      return <SymbolWhatsAppBot className={className} />;
    case "telegram-chatbot":
      return <SymbolTelegramBot className={className} />;
    case "business-maintenance":
      return <SymbolSystemSupport className={className} />;
    default:
      return <SymbolCloudRack className={className} />;
  }
}
