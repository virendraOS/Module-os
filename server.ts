import type { Request } from "express";
import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { app, escapeHtml } from "./src/server/app.ts";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === "production";

interface ServerServiceSeo {
  slug: string;
  id: string;
  serviceTitle: string;
  category: string;
  title: string;
  ogTitle: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
  keywords: string;
}

const SERVER_SERVICE_SEO: ServerServiceSeo[] = [
  {
    slug: "cloud-services",
    id: "cloud-services",
    serviceTitle: "Cloud Services",
    category: "Infrastructure",
    title: "Cloud Services & Migration | Xelvion Innova Tech",
    ogTitle: "Cloud Services for Indian SMEs – Migration, SSL & 24/7 Backups",
    description:
      "Move office apps onto resilient AWS Mumbai & GCP Delhi cloud servers with zero downtime, automated daily encrypted backups, and 24/7 monitoring.",
    ogImage: "/og/cloud-servers.jpg",
    ogImageAlt: "Enterprise cloud server racks with cobalt and lime optical fiber accents",
    keywords: "Cloud Services India, AWS Mumbai SME migration, GCP Delhi cloud hosting, automated daily cloud backups",
  },
  {
    slug: "video-editing",
    id: "video-editing",
    serviceTitle: "Video Editing",
    category: "Creative Media",
    title: "Business Video Editing & Reels | Xelvion Innova Tech",
    ogTitle: "Commercial Video Editing – Reels, Shorts & Brand Films for SMEs",
    description:
      "Turn raw smartphone footage from your showroom or factory into sharp branded Reels, YouTube explainers, and ad creatives with crisp English/Hindi captions.",
    ogImage: "/og/video-studio.jpg",
    ogImageAlt: "Modern color-calibrated video editing suite and timeline workstation",
    keywords: "business video editing India, Instagram Reels editing for SMEs, YouTube product explainer video",
  },
  {
    slug: "social-media-management",
    id: "social-media-management",
    serviceTitle: "Social Media Management",
    category: "Creative Media",
    title: "Social Media Management for SMEs | Xelvion Innova Tech",
    ogTitle: "Social Media Management – Content Calendars & Brand Growth",
    description:
      "Consistent Instagram, LinkedIn, and Facebook publishing for Indian SMEs with monthly content plans, custom post designs, and transparent analytics.",
    ogImage: "/og/social-command.jpg",
    ogImageAlt: "Editorial brand strategy desk with structured digital content grid",
    keywords: "social media management Indian SMEs, B2B LinkedIn Instagram management, monthly content calendar",
  },
  {
    slug: "logistics-services",
    id: "logistics-services",
    serviceTitle: "Logistics Services",
    category: "Supply Chain",
    title: "Logistics & Dispatch Software | Xelvion Innova Tech",
    ogTitle: "Offline-First Logistics Dispatch & POD Tracking Software",
    description:
      "Custom dispatch dashboards, live shipment tracking, and offline-capable driver Proof of Delivery software built for Indian highway and fleet networks.",
    ogImage: "/og/cloud-logistics.jpg",
    ogImageAlt: "Connected fleet dispatch console and offline Proof of Delivery platform",
    keywords: "logistics dispatch software India, offline Proof of Delivery app, fleet shipment tracking dashboard",
  },
  {
    slug: "database-management",
    id: "database-management-system",
    serviceTitle: "Database Management System",
    category: "Data Systems",
    title: "Database Management Systems (DBMS) | Xelvion Innova Tech",
    ogTitle: "Centralized PostgreSQL DBMS – Replace Slow Excel Spreadsheets",
    description:
      "Replace fragile multi-user Excel sheets with a fast PostgreSQL relational database featuring speed indexing, role-based access control, and backups.",
    ogImage: "/og/database-engine.jpg",
    ogImageAlt: "Isometric relational database storage cluster linked with fiber lines",
    keywords: "database management system India, PostgreSQL migration from Excel, SQL query speed tuning",
  },
  {
    slug: "ai-data-filter",
    id: "ai-based-data-filter-software",
    serviceTitle: "AI-based Data Filter Software",
    category: "Data Systems",
    title: "AI Data Filter & Deduplication | Xelvion Innova Tech",
    ogTitle: "Private AI Data Filter – Clean & Classify Messy Spreadsheets",
    description:
      "Automatically remove duplicate leads, fix broken GST/phone entries, and classify thousands of catalog rows in an isolated private pipeline.",
    ogImage: "/og/ai-filter.jpg",
    ogImageAlt: "Private AI data sanitization pipeline filtering messy records",
    keywords: "AI data filter software, Excel deduplication automation, SKU catalog classification AI",
  },
  {
    slug: "data-maintenance",
    id: "data-maintenance",
    serviceTitle: "Data Maintenance",
    category: "Data Systems",
    title: "Monthly Data Maintenance & Audits | Xelvion Innova Tech",
    ogTitle: "Dedicated Monthly Data Hygiene, Backup Drills & Audits",
    description:
      "Keep business databases error-free every month with scheduled duplicate cleanup, verified backup restore drills, index checks, and health reports.",
    ogImage: "/og/database-engine.jpg",
    ogImageAlt: "Automated encrypted backup vaults and monthly database integrity monitor",
    keywords: "monthly data maintenance service, database backup restore verification, enterprise data hygiene",
  },
  {
    slug: "whatsapp-chatbot",
    id: "whatsapp-chatbot",
    serviceTitle: "WhatsApp Chatbot",
    category: "Conversational Tech",
    title: "Official WhatsApp Business Chatbot | Xelvion Innova Tech",
    ogTitle: "24/7 WhatsApp Business API Bot – Bilingual Lead Capture & Handover",
    description:
      "Automate customer replies in English, Hindi, or Hinglish on the official WhatsApp Business API with instant lead capture, bookings, and staff handover.",
    ogImage: "/og/whatsapp-automation.jpg",
    ogImageAlt: "Enterprise WhatsApp Business conversational automation on dark slate desk",
    keywords: "WhatsApp Business API chatbot India, bilingual Hindi English WhatsApp bot, automated lead capture",
  },
  {
    slug: "telegram-chatbot",
    id: "telegram-chatbot",
    serviceTitle: "Telegram Chatbot",
    category: "Conversational Tech",
    title: "Custom Telegram Alert & Ops Bots | Xelvion Innova Tech",
    ogTitle: "Telegram Automation Bots – Live Order Alerts & Team Commands",
    description:
      "Equip operations teams with instant Telegram order alerts, role-restricted lookup commands, and automated FAQ workflows hosted with 24/7 uptime.",
    ogImage: "/og/whatsapp-automation.jpg",
    ogImageAlt: "Automated Telegram alert and internal team dispatch bot interface",
    keywords: "Telegram business bot development, automated team order alerts Telegram, command workflow bot",
  },
  {
    slug: "business-maintenance",
    id: "business-maintenance",
    serviceTitle: "Business Maintenance",
    category: "Technical Support",
    title: "Website & App Maintenance SLA | Xelvion Innova Tech",
    ogTitle: "Ongoing Software & Website Maintenance With Direct Engineers",
    description:
      "Protect websites and business tools post-launch with priority bug fixes, SSL renewals, security patches, and direct access to senior engineers.",
    ogImage: "/og/hero-xelvion.jpg",
    ogImageAlt: "Xelvion engineering operations desk providing ongoing system maintenance",
    keywords: "website maintenance SLA India, ongoing software support retainer, SSL security patching service",
  },
];

function resolveRequestOrigin(req: Request): string {
  const configuredAppUrl = process.env.APP_URL?.trim();
  if (configuredAppUrl && /^https?:\/\//i.test(configuredAppUrl)) {
    return configuredAppUrl.replace(/\/+$/, "");
  }
  const forwardedProto = (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0]?.trim();
  const proto = forwardedProto || req.protocol || "http";
  const host = (req.headers["x-forwarded-host"] as string | undefined)?.split(",")[0]?.trim() || req.get("host") || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function replaceMetaContent(html: string, attr: "name" | "property", key: string, value: string): string {
  const safeVal = escapeHtml(value);
  const regex = new RegExp(`(<meta\\s+[^>]*${attr}=["']${key}["'][^>]*content=)["'][^"']*["']([^>]*>)`, "i");
  if (regex.test(html)) {
    return html.replace(regex, `$1"${safeVal}"$2`);
  }
  return html;
}

function injectDynamicSeoIntoHtml(html: string, req: Request): string {
  const origin = resolveRequestOrigin(req);
  const pathMatch = req.path.match(/^\/services\/([^/?#]+)\/?$/i);
  const querySlug = typeof req.query.service === "string" ? req.query.service : "";
  const lookupKey = (pathMatch?.[1] || querySlug || "").trim().toLowerCase();

  const matchedService = lookupKey
    ? SERVER_SERVICE_SEO.find(
        (s) => s.slug === lookupKey || s.id === lookupKey
      ) || null
    : null;

  const pageUrl = matchedService
    ? `${origin}/services/${matchedService.slug}`
    : `${origin}/`;
  const title = matchedService
    ? matchedService.title
    : "Xelvion Innova Tech | Cloud, Data & Software for Indian SMEs";
  const ogTitle = matchedService
    ? matchedService.ogTitle
    : "Xelvion Innova Tech – Cloud, Data & Automation for Indian SMEs";
  const description = matchedService
    ? matchedService.description
    : "Build resilient cloud servers, dispatch logistics software, WhatsApp chatbots, databases, and AI data filters with Xelvion Innova Tech. Request a free scope.";
  const imageUrl = `${origin}${matchedService ? matchedService.ogImage : "/og/hero-xelvion.jpg"}`;
  const imageAlt = matchedService
    ? matchedService.ogImageAlt
    : "Xelvion Innova Tech engineering operations and enterprise SME workspace";
  const keywords = matchedService
    ? matchedService.keywords
    : "Xelvion Innova Tech Core Private Limited, Indian SME software services, Cloud Services India, Logistics Dispatch Software, WhatsApp Chatbot India";

  let output = html;
  output = output.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  output = output.replace(
    /(<link\s+[^>]*rel=["']canonical["'][^>]*href=)["'][^"']*["']([^>]*>)/i,
    `$1"${escapeHtml(pageUrl)}"$2`
  );

  output = replaceMetaContent(output, "name", "title", title);
  output = replaceMetaContent(output, "name", "description", description);
  output = replaceMetaContent(output, "name", "keywords", keywords);

  output = replaceMetaContent(output, "property", "og:url", pageUrl);
  output = replaceMetaContent(output, "property", "og:title", ogTitle);
  output = replaceMetaContent(output, "property", "og:description", description);
  output = replaceMetaContent(output, "property", "og:image", imageUrl);
  output = replaceMetaContent(output, "property", "og:image:alt", imageAlt);

  output = replaceMetaContent(output, "name", "twitter:url", pageUrl);
  output = replaceMetaContent(output, "name", "twitter:title", ogTitle);
  output = replaceMetaContent(output, "name", "twitter:description", description);
  output = replaceMetaContent(output, "name", "twitter:image", imageUrl);
  output = replaceMetaContent(output, "name", "twitter:image:alt", imageAlt);

  if (matchedService) {
    const serviceJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: matchedService.serviceTitle,
      serviceType: matchedService.category,
      description: matchedService.description,
      url: pageUrl,
      image: imageUrl,
      areaServed: { "@type": "Country", name: "India" },
      provider: {
        "@type": "Organization",
        name: "Xelvion Innova Tech Core Private Limited",
        url: origin,
      },
    });
    output = output.replace(
      "</head>",
      `  <script id="xelvion-dynamic-jsonld" type="application/ld+json">${serviceJsonLd}</script>\n  </head>`
    );
  }

  return output;
}

// Setup server based on environment
async function startServer() {
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ...(process.env.DISABLE_HMR === "true"
          ? { hmr: false, ws: false }
          : { ws: { server: httpServer } }),
      },
      appType: "spa",
    });

    app.get(["/", "/services/:slug"], async (req, res, next) => {
      if (path.extname(req.path)) {
        next();
        return;
      }
      try {
        const templatePath = path.resolve(currentDirname, "index.html");
        let html = await fs.promises.readFile(templatePath, "utf-8");
        html = await vite.transformIndexHtml(req.originalUrl, html);
        html = injectDynamicSeoIntoHtml(html, req);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        next(err);
      }
    });

    if (process.env.DISABLE_HMR === "true") {
      app.get("/@vite/client", (_req, res) => {
        res
          .setHeader("Cache-Control", "no-store, no-cache, must-revalidate")
          .type("application/javascript")
          .send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    style.textContent = content;
    document.head.appendChild(style);
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    style.remove();
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url) { return url; }
export class ErrorOverlay extends HTMLElement {}
`);
      });
    }

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(currentDirname, "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", async (req, res, next) => {
      try {
        const distHtmlPath = path.resolve(distPath, "index.html");
        const rawHtml = await fs.promises.readFile(distHtmlPath, "utf-8");
        const enrichedHtml = injectDynamicSeoIntoHtml(rawHtml, req);
        res.status(200).set({ "Content-Type": "text/html" }).end(enrichedHtml);
      } catch (err) {
        next(err);
      }
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [mode: ${isProduction ? "production" : "development"}]`);
  });
}

export { app };

const isServerless = Boolean(
  process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
);

if (!isServerless) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
