import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "../data/companyConfig";
import {
  VIEWPORT_ONCE,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  modalBackdropVariants,
  modalPanelVariants,
} from "../lib/motion";
import { SymbolDiscoveryLens } from "./RealisticIcons";
import { SeoHead } from "./SeoHead";
import { ScrollProgressBar } from "./ScrollProgressBar";

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const articleScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  return (
    <section
      id="blog"
      className="relative py-16 sm:py-24 studio-section-primary border-b transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-lime-400 uppercase tracking-wider">
              <span>SME KNOWLEDGE BASE</span>
              <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">/</span>
              <span>PRACTICAL PLAYBOOKS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Technical Insights for Indian Business Owners
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Straightforward guides on cloud security, WhatsApp automation, and spreadsheet data sanitization without developer jargon.
            </p>
          </div>
        </motion.div>

        {/* 3 Articles Open Editorial Columns (No Boxy Cards) */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {BLOG_POSTS.map((post, idx) => (
            <motion.article
              key={post.slug}
              variants={staggerItemVariants}
              className="group border-t-2 border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-lime-400 pt-6 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-4">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="font-mono text-slate-400 dark:text-slate-600">
                    0{idx + 1}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">/</span>
                  <span className="text-blue-700 dark:text-lime-400 font-semibold">{post.category}</span>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">/</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => setSelectedPost(post)}
                  className="cursor-pointer text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors leading-snug"
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Read button */}
              <div className="pt-5 mt-5 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="font-bold text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-lime-400 flex items-center gap-1.5 transition-colors"
                >
                  <span>Read Technical Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                  {post.publishedDate}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Viewport-Safe Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            key="blog-reader-backdrop"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPost(null);
            }}
            className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              variants={modalPanelVariants}
              className="relative w-full max-w-2xl max-h-[90dvh] flex flex-col studio-modal-panel rounded-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <SeoHead
                title={`${selectedPost.title} | Xelvion Innova Tech`}
                ogTitle={selectedPost.title}
                description={selectedPost.excerpt}
                canonicalPath={`/#blog-${selectedPost.slug}`}
                ogType="article"
                ogImage="/og/hero-xelvion.jpg"
                ogImageAlt={`${selectedPost.title} — Xelvion Technical Guide`}
                restoreDefaultOnUnmount={true}
                jsonLd={{
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: selectedPost.title,
                  description: selectedPost.excerpt,
                  articleSection: selectedPost.category,
                  publisher: {
                    "@type": "Organization",
                    name: "Xelvion Innova Tech Core Private Limited",
                  },
                }}
              />
              {/* Pinned Header */}
              <div className="shrink-0 p-5 sm:px-6 bg-gradient-to-b from-[#131924] to-[#0B0F17] text-white flex items-start justify-between gap-4 border-b border-white/10">
                <div className="flex items-start gap-3 pr-2">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <SymbolDiscoveryLens className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-lime-400 font-semibold">
                      <span>{selectedPost.category}</span>
                      <span className="text-slate-600" aria-hidden="true">/</span>
                      <span className="text-blue-400">{selectedPost.readTime}</span>
                    </div>
                    <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
                  aria-label="Close article"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>

              {/* Scroll-Linked Reading Progress Bars (Viewport Top & Modal Header Seam) */}
              <ScrollProgressBar containerRef={articleScrollRef} placement="viewport" />
              <ScrollProgressBar containerRef={articleScrollRef} placement="inline" />

              {/* Scrollable Body */}
              <div
                ref={articleScrollRef}
                className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
              >
                <p className="font-semibold text-slate-900 dark:text-white text-base pb-3 border-b border-slate-100 dark:border-slate-800">
                  {selectedPost.excerpt}
                </p>
                {selectedPost.content.map((paragraph, idx) => (
                  <p key={idx} className="text-slate-600 dark:text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Pinned Footer */}
              <div className="shrink-0 p-4 px-6 studio-recessed border-t border-b-0 border-x-0 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Published by Xelvion Innova Tech Editorial Team</span>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors"
                >
                  Close Article
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
