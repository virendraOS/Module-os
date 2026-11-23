import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  UserCheck, 
  LogIn,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { EASE_SMOOTH } from "../lib/motion";
import { BrandLogo } from "./BrandLogo";
import { PWAInstallButton } from "./PWAInstallButton";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openContactModal: (service?: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isLoggedIn: boolean;
  userName?: string | null;
  currentUserRole?: "admin" | "client";
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setCurrentTab,
  openContactModal,
  theme,
  onToggleTheme,
  isLoggedIn,
  userName,
  currentUserRole,
  onLogout,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "services", label: "Services" },
    { id: "why-us", label: "Why Xelvion" },
    { id: "process", label: "Process" },
    { id: "about", label: "About" },
    { id: "blog", label: "Knowledge Base" }
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab("home");
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 studio-glass-bar transition-colors">
      {/* Main Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 single-line links) — Zone 3 (1-2 actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 xl:gap-6">
        {/* Zone 1: Single Brand Wordmark */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setCurrentTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-left group flex items-center gap-2.5 sm:gap-3 shrink-0"
        >
          <BrandLogo size="md" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
              Xelvion Innova Tech
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium hidden sm:block">
              Core Pvt Ltd <span className="hidden xl:inline">/ Indian SME Engineering</span>
            </span>
          </div>
        </motion.button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative py-1 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:bg-blue-600 dark:after:bg-blue-400 after:transition-transform after:duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Theme Toggle + Login/Account + Consultation CTA) */}
        <div className="hidden sm:flex items-center gap-2.5 xl:gap-3 shrink-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Switch to Light Mode (Press T)" : "Switch to Dark Mode (Press T)"}
            className="p-2 rounded-lg studio-tile hover:border-blue-400/50 dark:hover:border-lime-400/40 text-slate-700 dark:text-amber-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                  className="block"
                >
                  <Sun className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 45, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -45, scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                  className="block"
                >
                  <Moon className="w-4 h-4 text-slate-700" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <PWAInstallButton variant="navbar" />

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenAuth()}
                className="px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 studio-tile hover:border-blue-400/50 dark:hover:border-white/20 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>{userName || (currentUserRole === "admin" ? "Admin Account" : "My Account")}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onLogout}
                title="Logout"
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-2 py-1.5 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-lime-400 studio-tile rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openContactModal()}
            title="Get Consultation (Press C)"
            className="group px-4 py-2 text-xs font-semibold text-white bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-700 rounded-lg transition-all shadow-[0_2px_8px_-1px_rgba(37,99,235,0.45),inset_0_1px_0_rgba(255,255,255,0.28)] flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Get Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </motion.button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="sm:hidden p-2 rounded-lg text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          <button
            onClick={onOpenAuth}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            title={isLoggedIn ? "Account" : "Login"}
          >
            {isLoggedIn ? <UserCheck className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: EASE_SMOOTH }}
            className="lg:hidden studio-section-primary border-b px-4 py-4 space-y-3"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left py-2 px-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 px-3 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/50 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{userName || "My Account"}</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/50 rounded-md flex items-center gap-2 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to Account</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <PWAInstallButton
                variant="mobile"
                onClickComplete={() => setMobileMenuOpen(false)}
              />
              <button
                onClick={() => {
                  openContactModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
              >
                Get Free Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
