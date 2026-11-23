import React from "react";
import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useOnlineStatus } from "../hooks/usePWAInstall";
import { EASE_SMOOTH } from "../lib/motion";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: EASE_SMOOTH }}
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/95 dark:bg-amber-950/95 px-3.5 py-2 text-xs font-semibold text-white dark:text-amber-200 shadow-lg backdrop-blur-md"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>Offline Mode — Cached portal view active</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
