import React, { useState } from "react";
import { Download, Smartphone, Share, PlusSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { EASE_SMOOTH } from "../lib/motion";

interface PWAInstallButtonProps {
  variant?: "navbar" | "mobile" | "footer" | "admin";
  onClickComplete?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "navbar",
  onClickComplete,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Never show when already running as an installed standalone PWA
  if (isInstalled) {
    return null;
  }

  // Only show when browser supports native install prompt or on iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      onClickComplete?.();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const renderButton = () => {
    if (variant === "mobile") {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full text-left py-2 px-3 text-sm font-semibold text-emerald-700 dark:text-lime-400 bg-emerald-50/70 dark:bg-lime-950/30 border border-emerald-200/80 dark:border-lime-500/30 rounded-md flex items-center gap-2 transition-colors"
        >
          {isInstallable ? (
            <Download className="w-4 h-4 shrink-0" />
          ) : (
            <Smartphone className="w-4 h-4 shrink-0" />
          )}
          <span>{isInstallable ? "Install Xelvion App" : "Add App to Home Screen"}</span>
        </button>
      );
    }

    if (variant === "footer") {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-lime-400 hover:text-emerald-800 dark:hover:text-lime-300 font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isInstallable ? "Install Xelvion App" : "Install on iOS"}</span>
        </button>
      );
    }

    if (variant === "admin") {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          title="Install Xelvion Portal as a desktop/mobile app"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-lime-400 bg-emerald-50 dark:bg-lime-950/40 border border-emerald-200 dark:border-lime-500/30 hover:bg-emerald-100 dark:hover:bg-lime-950/60 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isInstallable ? "Install Portal App" : "Install on iOS"}</span>
        </button>
      );
    }

    // Default "navbar" compact studio tile
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={handleInstallClick}
        title={isInstallable ? "Install Xelvion Portal App" : "Add Xelvion App to Home Screen"}
        className="px-2.5 py-2 text-xs font-semibold text-emerald-700 dark:text-lime-400 studio-tile hover:border-emerald-400/70 dark:hover:border-lime-400/50 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
      >
        {isInstallable ? (
          <Download className="w-3.5 h-3.5" />
        ) : (
          <Smartphone className="w-3.5 h-3.5" />
        )}
        <span className="hidden xl:inline">{isInstallable ? "Install App" : "Install"}</span>
      </motion.button>
    );
  };

  return (
    <>
      {renderButton()}

      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Install Xelvion Portal on iOS"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: EASE_SMOOTH }}
              className="w-full max-w-sm rounded-2xl studio-modal-panel p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/apple-touch-icon.png"
                    alt="Xelvion App Icon"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/15 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Install Xelvion Portal
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Add to iPhone / iPad Home Screen
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close install instructions"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3 p-2.5 rounded-xl studio-recessed">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <span>
                    1. Tap the <strong>Share</strong> button in the Safari toolbar.
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl studio-recessed">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-lime-950/40 text-emerald-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span>
                    2. Scroll down and select <strong>Add to Home Screen</strong>.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowIOSGuide(false);
                  onClickComplete?.();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
