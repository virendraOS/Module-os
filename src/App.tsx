import React, { useState, useEffect } from "react";
import { MotionConfig, AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ServicesGrid } from "./components/ServicesGrid";
import { LiveVisualizationLab } from "./components/LiveVisualizationLab";
import { ServiceDetailModal } from "./components/ServiceDetailModal";
import { WhyXelvion } from "./components/WhyXelvion";
import { TestimonialSlider } from "./components/TestimonialSlider";
import { ProcessTimeline } from "./components/ProcessTimeline";
import { ContactSection } from "./components/ContactSection";
import { AboutSection } from "./components/AboutSection";
import { BlogSection } from "./components/BlogSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { LegalModal } from "./components/LegalModal";
import { AdminPanel } from "./components/AdminPanel";
import { LoginModal } from "./components/LoginModal";
import { BrandLogo } from "./components/BrandLogo";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SERVICES_LIST, ServiceDetail } from "./data/companyConfig";
import { modalBackdropVariants, modalPanelVariants } from "./lib/motion";
import { SeoHead } from "./components/SeoHead";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { DEFAULT_SEO, getServiceSeo } from "./lib/seoConfig";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { KeyboardShortcutManager } from "./components/KeyboardShortcutManager";
import { OfflineIndicator } from "./components/OfflineIndicator";

function resolveServiceFromLocation(): ServiceDetail | null {
  if (typeof window === "undefined") return null;
  const pathMatch = window.location.pathname.match(/^\/services\/([^/?#]+)\/?$/i);
  const querySlug = new URLSearchParams(window.location.search).get("service");
  const candidate = (pathMatch?.[1] || querySlug || "").trim().toLowerCase();
  if (!candidate) return null;
  return (
    SERVICES_LIST.find(
      (s) => s.slug.toLowerCase() === candidate || s.id.toLowerCase() === candidate
    ) || null
  );
}

function AppContent() {
  const { user, profile, isAdmin, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState<"home" | "admin">("home");

  // Selected Service for detailed view modal (supports direct /services/:slug or ?service=:slug links)
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(() =>
    resolveServiceFromLocation()
  );

  // Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInitialService, setContactInitialService] = useState<string | undefined>(undefined);

  // Legal Modal State
  const [legalType, setLegalType] = useState<"privacy" | "terms" | "guarantee" | null>(null);

  // Login / Account Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Keyboard Shortcut Help Dialog State
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  // Theme State (light / dark)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("xelvion_theme");
      if (saved === "dark" || saved === "light") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("xelvion_theme", theme);
  }, [theme]);

  // Synchronize browser back/forward navigation with service modal
  useEffect(() => {
    const handlePopState = () => {
      setSelectedService(resolveServiceFromLocation());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openServiceDetail = (service: ServiceDetail) => {
    setSelectedService(service);
    if (typeof window !== "undefined") {
      const targetUrl = `/services/${service.slug}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ serviceSlug: service.slug }, "", targetUrl);
      }
    }
  };

  const closeServiceDetail = () => {
    setSelectedService(null);
    if (typeof window !== "undefined") {
      const isServicePath = /^\/services\/[^/?#]+/i.test(window.location.pathname);
      const hasServiceQuery = new URLSearchParams(window.location.search).has("service");
      if (isServicePath || hasServiceQuery) {
        window.history.pushState(null, "", "/");
      }
    }
  };

  // Close active modal cleanly with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (contactModalOpen) setContactModalOpen(false);
      else if (selectedService) closeServiceDetail();
      else if (legalType) setLegalType(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [contactModalOpen, selectedService, legalType]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleOpenContact = (serviceTitle?: string) => {
    setContactInitialService(serviceTitle);
    setContactModalOpen(true);
  };

  const handleSelectServiceBySlug = (slug: string) => {
    const srv = SERVICES_LIST.find(s => s.slug === slug || s.id === slug);
    if (srv) {
      openServiceDetail(srv);
    }
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setCurrentTab("admin");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleNavigateHome = () => {
    setCurrentTab("home");
    setContactModalOpen(false);
    setLegalType(null);
    setAuthModalOpen(false);
    if (selectedService) {
      closeServiceDetail();
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleShortcutOpenContact = () => {
    setCurrentTab("home");
    if (selectedService) {
      closeServiceDetail();
    }
    setLegalType(null);
    setAuthModalOpen(false);
    setContactModalOpen(true);
  };

  const shortcutOverlay = (
    <>
      <KeyboardShortcutManager
        theme={theme}
        onOpenContact={handleShortcutOpenContact}
        onNavigateHome={handleNavigateHome}
        onToggleTheme={handleToggleTheme}
        isHelpOpen={shortcutHelpOpen}
        setIsHelpOpen={setShortcutHelpOpen}
      />
      <OfflineIndicator />
    </>
  );

  // Protected Admin Panel view
  if (currentTab === "admin" && isAdmin) {
    return (
      <>
        <SeoHead
          title="Admin Console | Xelvion Innova Tech"
          description="Internal administration console for managing client leads and active software engineering projects."
          robots="noindex, nofollow"
          canonicalPath="/"
        />
        <AdminPanel
          onBackToWebsite={() => {
            setCurrentTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
        {shortcutOverlay}
      </>
    );
  }

  const activeConsultSeo = contactInitialService
    ? getServiceSeo(
        SERVICES_LIST.find((s) => s.title === contactInitialService)?.slug
      )
    : null;

  // Public Website Home View
  return (
    <div className="min-h-screen flex flex-col studio-canvas text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Base Home SEO (yields cleanly when ServiceDetailModal or Consultation Modal is open) */}
      {!selectedService && !contactModalOpen && (
        <SeoHead
          title={DEFAULT_SEO.title}
          ogTitle={DEFAULT_SEO.ogTitle}
          description={DEFAULT_SEO.description}
          keywords={DEFAULT_SEO.keywords}
          canonicalPath={DEFAULT_SEO.canonicalPath}
          ogImage={DEFAULT_SEO.ogImage}
          ogImageAlt={DEFAULT_SEO.ogImageAlt}
        />
      )}
      {!selectedService && contactModalOpen && (
        <SeoHead
          title={
            activeConsultSeo
              ? `Book Free ${activeConsultSeo.serviceTitle} Scope | Xelvion Innova Tech`
              : "Book Free Technical Architecture Consultation | Xelvion Innova Tech"
          }
          ogTitle={
            activeConsultSeo
              ? `Free ${activeConsultSeo.serviceTitle} Technical Scope – Xelvion Innova Tech`
              : "Free Technical Architecture & Engineering Scope – Xelvion Innova Tech"
          }
          description={
            activeConsultSeo
              ? activeConsultSeo.description
              : "Request a zero-cost 48-hour technical roadmap and callback from Xelvion Innova Tech engineers in Bengaluru and New Delhi."
          }
          ogImage={activeConsultSeo?.ogImage || DEFAULT_SEO.ogImage}
          ogImageAlt={activeConsultSeo?.ogImageAlt || DEFAULT_SEO.ogImageAlt}
          canonicalPath={activeConsultSeo?.canonicalPath || "/#contact"}
        />
      )}
      {!selectedService && !legalType && <ScrollProgressBar placement="viewport" />}
      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab: string) => setCurrentTab(tab as "home" | "admin")}
        openContactModal={handleOpenContact}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isLoggedIn={!!user}
        userName={profile?.displayName || user?.displayName}
        currentUserRole={isAdmin ? "admin" : "client"}
        onLogout={() => {
          logout();
          if (currentTab === "admin") setCurrentTab("home");
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          openContactModal={() => handleOpenContact()}
        />

        {/* 2. Services Grid (The 10 Strict Services) */}
        <ServicesGrid
          onSelectService={(service) => openServiceDetail(service)}
          openContactModal={(serviceName) => handleOpenContact(serviceName)}
        />

        {/* 2.5 Interactive Live Software Visualization Lab */}
        <LiveVisualizationLab
          openContactModal={(serviceName) => handleOpenContact(serviceName)}
        />

        {/* 3. Why Xelvion */}
        <WhyXelvion
          openContactModal={() => handleOpenContact()}
        />

        {/* 4. Client Success Stories & Outcomes Slider */}
        <TestimonialSlider
          openContactModal={(serviceName) => handleOpenContact(serviceName)}
        />

        {/* 5. Process Timeline */}
        <ProcessTimeline
          openContactModal={() => handleOpenContact()}
        />

        {/* 5. About Xelvion */}
        <AboutSection />

        {/* 6. Knowledge Base & Practical Guides */}
        <BlogSection />

        {/* 7. Contact & Free Consultation Form */}
        <ContactSection
          initialService={contactInitialService}
        />

        {/* 8. FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectService={handleSelectServiceBySlug}
        openContactModal={() => handleOpenContact()}
        openLegalModal={(type) => setLegalType(type)}
        openAuthModal={() => setAuthModalOpen(true)}
        openShortcutsModal={() => setShortcutHelpOpen(true)}
        openAdmin={isAdmin ? handleOpenAdmin : undefined}
      />

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            key={selectedService.id}
            service={selectedService}
            onClose={closeServiceDetail}
            onRequestQuote={(title) => handleOpenContact(title)}
          />
        )}
      </AnimatePresence>

      {/* Contact Quick Modal (Viewport-safe pinned header + internal scroll) */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            key="quick-contact-backdrop"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) setContactModalOpen(false);
            }}
            className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          >
            <motion.div
              variants={modalPanelVariants}
              className="relative w-full max-w-5xl max-h-[92dvh] flex flex-col studio-modal-panel rounded-3xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Consultation Booking Studio"
            >
              <div className="shrink-0 px-5 sm:px-6 py-4 bg-gradient-to-b from-[#131924] to-[#0B0F17] text-white flex items-center justify-between gap-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <BrandLogo size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold tracking-tight text-white">
                        Consultation Booking Studio
                      </span>
                      <span className="hidden sm:inline text-xs font-semibold text-lime-400">
                        / Free 48-Hr Technical Scope
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Direct senior architect callback within 4 business hours
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  aria-label="Close consultation modal"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/[0.06] border border-white/10 hover:bg-white/[0.12] hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 studio-section-primary">
                <ContactSection
                  initialService={contactInitialService}
                  isModal={true}
                  onCloseModal={() => setContactModalOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Policies Modal */}
      <AnimatePresence>
        {legalType && (
          <LegalModal
            key={legalType}
            type={legalType}
            onClose={() => setLegalType(null)}
          />
        )}
      </AnimatePresence>

      {/* Firebase Auth Login & Account Modal */}
      <LoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenAdmin={() => {
          setAuthModalOpen(false);
          setCurrentTab("admin");
        }}
      />

      {shortcutOverlay}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
