import React, { useEffect } from "react";
import { DEFAULT_SEO } from "../lib/seoConfig";

export interface SeoHeadProps {
  title?: string;
  ogTitle?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  ogImageAlt?: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | null;
  restoreDefaultOnUnmount?: boolean;
}

function upsertMetaTag(attr: "name" | "property", key: string, content: string): void {
  if (!content) return;
  let meta = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonicalLink(href: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function resolveAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${window.location.origin}${normalizedPath}`;
}

function applySeoSnapshot(config: {
  title: string;
  ogTitle: string;
  description: string;
  keywordsString: string;
  canonicalPath?: string;
  ogType: string;
  ogImage: string;
  ogImageAlt: string;
  robots: string;
  jsonLdSerialized: string;
}): void {
  const resolvedCanonical = config.canonicalPath
    ? resolveAbsoluteUrl(config.canonicalPath)
    : `${window.location.origin}${window.location.pathname}`;
  const resolvedImage = resolveAbsoluteUrl(config.ogImage);

  document.title = config.title;
  upsertMetaTag("name", "title", config.title);
  upsertMetaTag("name", "description", config.description);
  if (config.keywordsString) {
    upsertMetaTag("name", "keywords", config.keywordsString);
  }
  upsertMetaTag("name", "robots", config.robots);

  upsertCanonicalLink(resolvedCanonical);

  upsertMetaTag("property", "og:type", config.ogType);
  upsertMetaTag("property", "og:locale", "en_IN");
  upsertMetaTag("property", "og:site_name", "Xelvion Innova Tech Core Private Limited");
  upsertMetaTag("property", "og:url", resolvedCanonical);
  upsertMetaTag("property", "og:title", config.ogTitle);
  upsertMetaTag("property", "og:description", config.description);
  upsertMetaTag("property", "og:image", resolvedImage);
  upsertMetaTag("property", "og:image:secure_url", resolvedImage);
  upsertMetaTag("property", "og:image:width", "1200");
  upsertMetaTag("property", "og:image:height", "630");
  upsertMetaTag("property", "og:image:alt", config.ogImageAlt);

  upsertMetaTag("name", "twitter:card", "summary_large_image");
  upsertMetaTag("name", "twitter:url", resolvedCanonical);
  upsertMetaTag("name", "twitter:title", config.ogTitle);
  upsertMetaTag("name", "twitter:description", config.description);
  upsertMetaTag("name", "twitter:image", resolvedImage);
  upsertMetaTag("name", "twitter:image:alt", config.ogImageAlt);

  const scriptId = "xelvion-dynamic-jsonld";
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (config.jsonLdSerialized) {
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = config.jsonLdSerialized;
  } else if (scriptEl) {
    scriptEl.remove();
  }
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = DEFAULT_SEO.title,
  ogTitle,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  canonicalPath,
  ogType = "website",
  ogImage = DEFAULT_SEO.ogImage,
  ogImageAlt = DEFAULT_SEO.ogImageAlt,
  robots = "index, follow",
  jsonLd = null,
  restoreDefaultOnUnmount = false,
}) => {
  const effectiveOgTitle = ogTitle || title;
  const keywordsString = keywords.join(", ");
  const jsonLdSerialized = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    applySeoSnapshot({
      title,
      ogTitle: effectiveOgTitle,
      description,
      keywordsString,
      canonicalPath,
      ogType,
      ogImage,
      ogImageAlt,
      robots,
      jsonLdSerialized,
    });

    return () => {
      if (restoreDefaultOnUnmount) {
        applySeoSnapshot({
          title: DEFAULT_SEO.title,
          ogTitle: DEFAULT_SEO.ogTitle,
          description: DEFAULT_SEO.description,
          keywordsString: DEFAULT_SEO.keywords.join(", "),
          canonicalPath: DEFAULT_SEO.canonicalPath,
          ogType: "website",
          ogImage: DEFAULT_SEO.ogImage,
          ogImageAlt: DEFAULT_SEO.ogImageAlt,
          robots: "index, follow",
          jsonLdSerialized: "",
        });
      }
    };
  }, [
    title,
    effectiveOgTitle,
    description,
    keywordsString,
    canonicalPath,
    ogType,
    ogImage,
    ogImageAlt,
    robots,
    jsonLdSerialized,
    restoreDefaultOnUnmount,
  ]);

  return null;
};
