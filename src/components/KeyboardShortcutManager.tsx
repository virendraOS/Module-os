import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, X, Sun, Moon, Home, MessageSquare } from "lucide-react";
import { EASE_SMOOTH, modalBackdropVariants, modalPanelVariants } from "../lib/motion";

export interface KeyboardShortcutManagerProps {
  theme: "light" | "dark";
  onOpenContact: () => void;
  onNavigateHome: () => void;
  onToggleTheme: () => void;
  isHelpOpen: boolean;
  setIsHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ShortcutFeedback {
  id: number;
  keyLabel: string;
  message: string;
  kind: "contact" | "home" | "theme";
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  if (target.closest("[contenteditable='true'], [role='textbox']")) return true;
  return false;
}

const SHORTCUT_ITEMS = [
  {
    key: "C",
    label: "Open Contact Studio",
    description: "Launch the consultation booking modal from anywhere",
    icon: MessageSquare,
  },
  {
    key: "H",
    label: "Navigate Home",
    description: "Return to the main landing page and scroll to the top",
    icon: Home,
  },
  {
    key: "T",
    label: "Toggle Theme",
    description: "Switch between Daylight Limestone and Obsidian Dark themes",
    icon: Sun,
  },
  {
    key: "?",
    label: "Shortcut Guide",
    description: "Open or dismiss this keyboard shortcuts reference",
    icon: Keyboard,
  },
] as const;

export const KeyboardShortcutManager: React.FC<KeyboardShortcutManagerProps> = ({
  theme,
  onOpenContact,
  onNavigateHome,
  onToggleTheme,
  isHelpOpen,
  setIsHelpOpen,
}) => {
  const [feedback, setFeedback] = useState<ShortcutFeedback | null>(null);
  const timerRef = useRef<number | null>(null);

  const showFeedback = useCallback(
    (keyLabel: string, message: string, kind: ShortcutFeedback["kind"]) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setFeedback({ id: Date.now(), keyLabel, message, kind });
      timerRef.current = window.setTimeout(() => {
        setFeedback(null);
      }, 1850);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Never hijack browser/OS modifier shortcuts or held-key repeats
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

      // Never hijack typing inside form inputs, textareas, selects, or rich editors
      if (isEditableTarget(e.target)) return;

      if (e.key === "Escape" && isHelpOpen) {
        e.preventDefault();
        setIsHelpOpen(false);
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      // Skip single-letter shortcuts if Shift is held (e.g. Shift+C)
      if (e.shiftKey) return;

      const normalized = e.key.toLowerCase();

      if (normalized === "c") {
        e.preventDefault();
        setIsHelpOpen(false);
        onOpenContact();
        showFeedback("C", "Consultation Studio opened", "contact");
      } else if (normalized === "h") {
        e.preventDefault();
        setIsHelpOpen(false);
        onNavigateHome();
        showFeedback("H", "Navigated to Home", "home");
      } else if (normalized === "t") {
        e.preventDefault();
        const nextTheme = theme === "dark" ? "Light Mode" : "Dark Mode";
        onToggleTheme();
        showFeedback("T", `Switched to ${nextTheme}`, "theme");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    theme,
    isHelpOpen,
    setIsHelpOpen,
    onOpenContact,
    onNavigateHome,
    onToggleTheme,
    showFeedback,
  ]);

  return (
    <>
      {/* Subtle bottom-right shortcut feedback toast */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end"
      >
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASE_SMOOTH }}
              className="studio-modal-panel rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md studio-recessed font-mono text-[11px] font-bold text-blue-700 dark:text-lime-400">
                {feedback.keyLabel}
              </span>
              <span className="flex items-center gap-1.5">
                {feedback.kind === "theme" &&
                  (theme === "dark" ? (
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ))}
                {feedback.kind === "home" && (
                  <Home className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
                )}
                {feedback.kind === "contact" && (
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
                )}
                <span>{feedback.message}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Power-User Keyboard Shortcuts Reference Dialog (? key) */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            key="shortcut-help-backdrop"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsHelpOpen(false);
            }}
            className="fixed inset-0 z-[75] bg-slate-950/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalPanelVariants}
              role="dialog"
              aria-modal="true"
              aria-labelledby="shortcuts-modal-title"
              className="w-full max-w-md studio-modal-panel rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 bg-gradient-to-b from-[#131924] to-[#0B0F17] text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center">
                    <Keyboard className="w-4 h-4 text-lime-400" />
                  </div>
                  <div>
                    <h2
                      id="shortcuts-modal-title"
                      className="text-sm font-bold text-white leading-tight"
                    >
                      Keyboard Shortcuts
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Quick navigation outside form inputs
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  aria-label="Close keyboard shortcuts dialog"
                  className="p-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-2.5">
                {SHORTCUT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl studio-tile flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-lime-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <kbd className="shrink-0 inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg studio-recessed font-mono text-xs font-bold text-slate-800 dark:text-lime-400">
                        {item.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-3 studio-recessed border-t border-b-0 border-x-0 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Press Esc to close any active dialog</span>
                <button
                  type="button"
                  onClick={() => setIsHelpOpen(false)}
                  className="font-semibold text-blue-700 dark:text-lime-400 hover:underline"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
