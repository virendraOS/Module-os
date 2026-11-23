import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  LogOut,
  User,
  Building2,
  Phone,
  CheckCircle2,
  Loader2,
  Settings,
  ArrowRight,
  Lock,
  Bookmark,
  CalendarClock,
  Trash2,
} from "lucide-react";
import { useAuth, USER_PROFILE_LIMITS } from "../contexts/AuthContext";
import { modalBackdropVariants, modalPanelVariants, EASE_SMOOTH } from "../lib/motion";
import { BrandLogo } from "./BrandLogo";
import {
  SymbolShieldGuard,
  SymbolEngineeringCore,
  SymbolCorporateSeal,
} from "./RealisticIcons";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  const {
    user,
    profile,
    isAdmin,
    consultations,
    bookmarks,
    signInWithGoogle,
    updateProfileDetails,
    toggleServiceBookmark,
    logout,
  } = useAuth();

  const [accountTab, setAccountTab] = useState<"profile" | "consultations" | "saved">("profile");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setCompanyName(profile.companyName || "");
      setPhone(profile.phone || "");
    } else if (user) {
      setDisplayName(user.displayName || "");
      setCompanyName("");
      setPhone("");
    }
    setErrorMsg("");
    setSavedNotice(false);
  }, [profile, user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not complete Google Sign-In.";
      if (msg.includes("auth/popup-closed-by-user")) {
        setErrorMsg("Sign-in window was closed. Please try again.");
      } else if (msg.includes("auth/popup-blocked")) {
        setErrorMsg("Popup was blocked by your browser. Please allow popups and try again.");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSavedNotice(false);
    setBusy(true);
    try {
      await updateProfileDetails({
        displayName,
        companyName,
        phone,
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to save profile changes."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await logout();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const initials = (profile?.displayName || user?.displayName || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="login-modal-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
        >
          <motion.div
            variants={modalPanelVariants}
            className="relative w-full max-w-3xl max-h-[92dvh] flex flex-col studio-modal-panel rounded-3xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            {/* Sticky Close Button Bar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl studio-tile text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close login modal"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12">
              {/* Left Architectural Brand Showcase Panel */}
              <div className="md:col-span-5 relative overflow-hidden bg-gradient-to-br from-[#121927] via-[#0B0F18] to-[#0A1429] text-white p-6 sm:p-8 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-white/10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-lime-500/15 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"
                />

                <div className="relative z-10 space-y-5">
                  <div className="group inline-flex items-center gap-3">
                    <BrandLogo size="md" />
                    <div>
                      <p className="text-sm font-bold tracking-tight text-white">
                        Xelvion Innova Tech
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        Core Private Limited
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-lime-400">
                      <Lock className="w-3.5 h-3.5" />
                      Verified Account Access
                    </span>
                    <h2
                      id="login-modal-title"
                      className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug"
                    >
                      {user
                        ? "Manage Your Engineering Workspace"
                        : "Enterprise Sign-In for Indian SMEs"}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Connect your verified Google identity to keep your company details, consultations, and saved architectures synced across devices.
                    </p>
                  </div>
                </div>

                {/* Realistic Trust Emblem Cards */}
                <div className="relative z-10 space-y-2.5">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <SymbolShieldGuard className="w-7 h-7 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">DPDP Act 2023 Compliant</p>
                      <p className="text-[11px] text-slate-400">Encrypted Google OAuth verification</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <SymbolEngineeringCore className="w-7 h-7 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">Direct Architect Desk</p>
                      <p className="text-[11px] text-slate-400">Zero sales middlemen on consultations</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <SymbolCorporateSeal className="w-7 h-7 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">30-Day Milestone Guarantee</p>
                      <p className="text-[11px] text-slate-400">Written scope & clear IP ownership</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Interactive Form / Account Surface */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center studio-section-primary">
                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!user ? (
                  <motion.div
                    key="logged-out-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                    className="space-y-6 my-auto"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Welcome Back
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Sign in in one click using your verified Google workspace or personal account. No extra passwords to remember.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={busy}
                      className="group w-full py-3.5 px-5 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold flex items-center justify-between shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      <span className="flex items-center gap-3">
                        {busy ? (
                          <Loader2 className="w-5 h-5 animate-spin text-lime-400 dark:text-blue-600" />
                        ) : (
                          <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                              />
                            </svg>
                          </span>
                        )}
                        <span>{busy ? "Connecting securely..." : "Continue with Google"}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Protected by Google Identity Verification</span>
                      <button
                        type="button"
                        onClick={onClose}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logged-in-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                    className="space-y-4"
                  >
                    {/* Signed-in User Summary Card */}
                    <div className="p-4 rounded-2xl studio-tile flex items-center gap-3.5 pr-10">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={displayName || "Profile"}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-lime-500/40 border border-slate-200 dark:border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {profile?.displayName || user.displayName || "Account User"}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-lime-100 dark:bg-lime-950/70 text-lime-800 dark:text-lime-300 border border-lime-200 dark:border-lime-800/70">
                            {isAdmin ? "Admin" : "Verified"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Account Workspace Navigation Tabs */}
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl studio-recessed text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setAccountTab("profile")}
                        className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                          accountTab === "profile"
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountTab("consultations")}
                        className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                          accountTab === "consultations"
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <CalendarClock className="w-3.5 h-3.5" />
                        <span>Passes ({consultations.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountTab("saved")}
                        className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                          accountTab === "saved"
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Saved ({bookmarks.length})</span>
                      </button>
                    </div>

                    {accountTab === "profile" && (
                      <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Full Name *</span>
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={USER_PROFILE_LIMITS.displayNameMax}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3.5 py-2.5 studio-input rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Company Name</span>
                            </label>
                            <input
                              type="text"
                              maxLength={USER_PROFILE_LIMITS.companyNameMax}
                              placeholder="e.g. Sharma Logistics Pvt Ltd"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full px-3.5 py-2.5 studio-input rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Phone Number</span>
                            </label>
                            <input
                              type="tel"
                              maxLength={USER_PROFILE_LIMITS.phoneMax}
                              placeholder="+91 98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-3.5 py-2.5 studio-input rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono transition-shadow"
                            />
                          </div>
                        </div>

                        <AnimatePresence>
                          {savedNotice && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Profile saved securely.</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="pt-2 flex flex-col gap-2">
                          <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={busy}
                            className="w-full py-2.5 px-4 rounded-xl bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white font-semibold transition-colors shadow-sm disabled:opacity-60"
                          >
                            {busy ? "Saving..." : "Save Profile"}
                          </motion.button>
                        </div>
                      </form>
                    )}

                    {accountTab === "consultations" && (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
                        {consultations.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              No consultation passes yet
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              Book a consultation on the site while signed in to track your pass ID and callback window here.
                            </p>
                          </div>
                        ) : (
                          consultations.map((c) => (
                            <div
                              key={c.referenceId}
                              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-blue-700 dark:text-lime-400">
                                  {c.referenceId}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                                  {c.status}
                                </span>
                              </div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {c.serviceTitle}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Callback: {c.callbackDay} / {c.callbackSlot}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {accountTab === "saved" && (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
                        {bookmarks.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              No shortlisted services yet
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              Open any service specification card and click Save to keep it in your engineering shortlist.
                            </p>
                          </div>
                        ) : (
                          bookmarks.map((b) => (
                            <div
                              key={b.serviceId}
                              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate">
                                  {b.serviceTitle}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {b.category}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  void toggleServiceBookmark({
                                    id: b.serviceId,
                                    title: b.serviceTitle,
                                    category: b.category,
                                  })
                                }
                                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                aria-label={`Remove ${b.serviceTitle}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs">
                      {isAdmin && (
                        <motion.button
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={onOpenAdmin}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-lime-400" />
                          <span>Open Admin Console</span>
                        </motion.button>
                      )}

                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={busy}
                        className="w-full py-2 px-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
