import React from "react";
import { COMPANY_INFO, SERVICES_LIST } from "../data/companyConfig";
import { BrandLogo } from "./BrandLogo";
import { PWAInstallButton } from "./PWAInstallButton";

interface FooterProps {
  onSelectService: (slug: string) => void;
  openContactModal: () => void;
  openLegalModal: (type: "privacy" | "terms" | "guarantee") => void;
  openAuthModal: () => void;
  openShortcutsModal?: () => void;
  openAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectService,
  openContactModal,
  openLegalModal,
  openAuthModal,
  openShortcutsModal,
  openAdmin,
}) => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#F4F3EE] via-[#F2F5EA] to-[#E9EFE0] dark:from-[#0C100E] dark:via-[#111713] dark:to-[#090C0A] text-slate-600 dark:text-slate-300 border-t border-slate-300/60 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] py-14 px-4 sm:px-6 transition-colors">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-grain" />
      {/* Subtle Logo-Matched Lime & Charcoal Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full bg-lime-400/15 dark:bg-lime-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 w-72 h-72 rounded-full bg-slate-900/5 dark:bg-lime-400/5 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Registered Info */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="group flex items-center gap-3">
              <BrandLogo size="md" />
              <div>
                <p className="font-bold text-sm text-[#1E1E1E] dark:text-white">
                  {COMPANY_INFO.legalName}
                </p>
                <p className="text-[11px] font-mono text-lime-700 dark:text-lime-400 font-semibold">
                  CIN: {COMPANY_INFO.cin}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              Pragmatic cloud infrastructure, logistics tech, WhatsApp &amp; Telegram chatbots, DBMS, and AI data filtering built for Indian small and medium businesses.
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
              <p>{COMPANY_INFO.headquarters.address}</p>
              <p className="font-medium text-[#1E1E1E] dark:text-slate-200">
                {COMPANY_INFO.contact.phoneDisplay} / {COMPANY_INFO.contact.email}
              </p>
            </div>
          </div>

          {/* Core Services */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E] dark:text-white">
              Core Services
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {SERVICES_LIST.slice(0, 8).map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => onSelectService(srv.slug)}
                  className="text-left text-slate-600 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-400 font-medium transition-colors truncate"
                >
                  {srv.title}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions & Policies */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E] dark:text-white">
              Company &amp; Legal
            </h4>
            <div className="flex flex-col items-start gap-2.5 text-xs">
              <button
                onClick={openContactModal}
                className="text-[#1E1E1E] dark:text-white hover:text-lime-700 dark:hover:text-lime-400 font-semibold transition-colors"
              >
                Book Free Consultation
              </button>
              <button
                onClick={openAuthModal}
                className="text-lime-700 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-300 font-semibold transition-colors"
              >
                Account Login
              </button>
              <button
                onClick={() => openLegalModal("guarantee")}
                className="text-slate-600 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-400 transition-colors"
              >
                30-Day Milestone Guarantee
              </button>
              <button
                onClick={() => openLegalModal("privacy")}
                className="text-slate-600 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-400 transition-colors"
              >
                Privacy &amp; Data Sovereignty
              </button>
              <button
                onClick={() => openLegalModal("terms")}
                className="text-slate-600 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-400 transition-colors"
              >
                Terms of Engagement
              </button>
              {openShortcutsModal && (
                <button
                  type="button"
                  onClick={openShortcutsModal}
                  className="text-slate-600 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-400 transition-colors"
                >
                  Keyboard Shortcuts (?)
                </button>
              )}
              <PWAInstallButton variant="footer" />
              {openAdmin && (
                <button
                  onClick={openAdmin}
                  className="text-slate-500 dark:text-slate-400 hover:text-[#1E1E1E] dark:hover:text-white transition-colors"
                >
                  Admin Console
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
