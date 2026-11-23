export interface SeoConfigItem {
  id: string;
  slug: string;
  serviceTitle: string;
  category: string;
  title: string;
  ogTitle: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
  keywords: string[];
  canonicalPath: string;
}

export const SITE_BRAND = {
  shortName: "Xelvion Innova Tech",
  legalName: "Xelvion Innova Tech Core Private Limited",
  siteUrl: "https://xelvion.in",
  locale: "en_IN",
  logoPath: "/assets/aistudio/xelvion_logo__1__d1799ed9.png",
  phone: "+91-82876-43838",
  city: "Bengaluru & New Delhi, India",
} as const;

export const DEFAULT_SEO: SeoConfigItem = {
  id: "home",
  slug: "",
  serviceTitle: "Home",
  category: "Technology Consulting",
  title: "Xelvion Innova Tech | Cloud, Data & Software for Indian SMEs",
  ogTitle: "Xelvion Innova Tech – Cloud, Data & Automation for Indian SMEs",
  description:
    "Build resilient cloud servers, dispatch logistics software, WhatsApp chatbots, databases, and AI data filters with Xelvion Innova Tech. Request a free scope.",
  ogImage: "/og/hero-xelvion.jpg",
  ogImageAlt: "Xelvion Innova Tech engineering operations and enterprise SME workspace",
  keywords: [
    "Xelvion Innova Tech Core Private Limited",
    "Xelvion Innova Tech",
    "Indian SME software services",
    "Cloud Services India",
    "Logistics Dispatch Software",
    "WhatsApp Business Chatbot India",
    "Telegram Alert Bot",
    "Database Management System",
    "AI Data Filter Software",
    "Video Editing & Social Media Management",
    "Business Maintenance",
  ],
  canonicalPath: "/",
};

export const SERVICE_SEO_CATALOG: Record<string, SeoConfigItem> = {
  "cloud-services": {
    id: "cloud-services",
    slug: "cloud-services",
    serviceTitle: "Cloud Services",
    category: "Infrastructure",
    title: "Cloud Services & Migration | Xelvion Innova Tech",
    ogTitle: "Cloud Services for Indian SMEs – Migration, SSL & 24/7 Backups",
    description:
      "Move office apps onto resilient AWS Mumbai & GCP Delhi cloud servers with zero downtime, automated daily encrypted backups, and 24/7 monitoring.",
    ogImage: "/og/cloud-servers.jpg",
    ogImageAlt: "Enterprise cloud server racks with cobalt and lime optical fiber accents",
    keywords: [
      "Cloud Services India",
      "AWS Mumbai SME migration",
      "GCP Delhi cloud hosting",
      "automated daily cloud backups",
      "zero downtime server migration",
    ],
    canonicalPath: "/services/cloud-services",
  },
  "video-editing": {
    id: "video-editing",
    slug: "video-editing",
    serviceTitle: "Video Editing",
    category: "Creative Media",
    title: "Business Video Editing & Reels | Xelvion Innova Tech",
    ogTitle: "Commercial Video Editing – Reels, Shorts & Brand Films for SMEs",
    description:
      "Turn raw smartphone footage from your showroom or factory into sharp branded Reels, YouTube explainers, and ad creatives with crisp English/Hindi captions.",
    ogImage: "/og/video-studio.jpg",
    ogImageAlt: "Modern color-calibrated video editing suite and timeline workstation",
    keywords: [
      "business video editing India",
      "Instagram Reels editing for SMEs",
      "YouTube product explainer video",
      "corporate video editing studio",
    ],
    canonicalPath: "/services/video-editing",
  },
  "social-media-management": {
    id: "social-media-management",
    slug: "social-media-management",
    serviceTitle: "Social Media Management",
    category: "Creative Media",
    title: "Social Media Management for SMEs | Xelvion Innova Tech",
    ogTitle: "Social Media Management – Content Calendars & Brand Growth",
    description:
      "Consistent Instagram, LinkedIn, and Facebook publishing for Indian SMEs with monthly content plans, custom post designs, and transparent analytics.",
    ogImage: "/og/social-command.jpg",
    ogImageAlt: "Editorial brand strategy desk with structured digital content grid",
    keywords: [
      "social media management Indian SMEs",
      "B2B LinkedIn Instagram management",
      "monthly content calendar agency",
      "scheduled business social posting",
    ],
    canonicalPath: "/services/social-media-management",
  },
  "logistics-services": {
    id: "logistics-services",
    slug: "logistics-services",
    serviceTitle: "Logistics Services",
    category: "Supply Chain",
    title: "Logistics & Dispatch Software | Xelvion Innova Tech",
    ogTitle: "Offline-First Logistics Dispatch & POD Tracking Software",
    description:
      "Custom dispatch dashboards, live shipment tracking, and offline-capable driver Proof of Delivery software built for Indian highway and fleet networks.",
    ogImage: "/og/cloud-logistics.jpg",
    ogImageAlt: "Connected fleet dispatch console and offline Proof of Delivery platform",
    keywords: [
      "logistics dispatch software India",
      "offline Proof of Delivery app",
      "fleet shipment tracking dashboard",
      "LR bilty courier management software",
    ],
    canonicalPath: "/services/logistics-services",
  },
  "database-management": {
    id: "database-management-system",
    slug: "database-management",
    serviceTitle: "Database Management System",
    category: "Data Systems",
    title: "Database Management Systems (DBMS) | Xelvion Innova Tech",
    ogTitle: "Centralized PostgreSQL DBMS – Replace Slow Excel Spreadsheets",
    description:
      "Replace fragile multi-user Excel sheets with a fast PostgreSQL relational database featuring speed indexing, role-based access control, and backups.",
    ogImage: "/og/database-engine.jpg",
    ogImageAlt: "Isometric relational database storage cluster linked with fiber lines",
    keywords: [
      "database management system India",
      "PostgreSQL migration from Excel",
      "role-based access control database",
      "SQL query speed tuning",
    ],
    canonicalPath: "/services/database-management",
  },
  "ai-data-filter": {
    id: "ai-based-data-filter-software",
    slug: "ai-data-filter",
    serviceTitle: "AI-based Data Filter Software",
    category: "Data Systems",
    title: "AI Data Filter & Deduplication | Xelvion Innova Tech",
    ogTitle: "Private AI Data Filter – Clean & Classify Messy Spreadsheets",
    description:
      "Automatically remove duplicate leads, fix broken GST/phone entries, and classify thousands of catalog rows in an isolated private pipeline.",
    ogImage: "/og/ai-filter.jpg",
    ogImageAlt: "Private AI data sanitization pipeline filtering messy records",
    keywords: [
      "AI data filter software",
      "Excel deduplication automation",
      "SKU catalog classification AI",
      "private enterprise data sanitization",
    ],
    canonicalPath: "/services/ai-data-filter",
  },
  "data-maintenance": {
    id: "data-maintenance",
    slug: "data-maintenance",
    serviceTitle: "Data Maintenance",
    category: "Data Systems",
    title: "Monthly Data Maintenance & Audits | Xelvion Innova Tech",
    ogTitle: "Dedicated Monthly Data Hygiene, Backup Drills & Audits",
    description:
      "Keep business databases error-free every month with scheduled duplicate cleanup, verified backup restore drills, index checks, and health reports.",
    ogImage: "/og/database-engine.jpg",
    ogImageAlt: "Automated encrypted backup vaults and monthly database integrity monitor",
    keywords: [
      "monthly data maintenance service",
      "database backup restore verification",
      "enterprise data hygiene audit",
      "scheduled SQL maintenance",
    ],
    canonicalPath: "/services/data-maintenance",
  },
  "whatsapp-chatbot": {
    id: "whatsapp-chatbot",
    slug: "whatsapp-chatbot",
    serviceTitle: "WhatsApp Chatbot",
    category: "Conversational Tech",
    title: "Official WhatsApp Business Chatbot | Xelvion Innova Tech",
    ogTitle: "24/7 WhatsApp Business API Bot – Bilingual Lead Capture & Handover",
    description:
      "Automate customer replies in English, Hindi, or Hinglish on the official WhatsApp Business API with instant lead capture, bookings, and staff handover.",
    ogImage: "/og/whatsapp-automation.jpg",
    ogImageAlt: "Enterprise WhatsApp Business conversational automation on dark slate desk",
    keywords: [
      "WhatsApp Business API chatbot India",
      "bilingual Hindi English WhatsApp bot",
      "automated WhatsApp lead capture",
      "Meta verified business automation",
    ],
    canonicalPath: "/services/whatsapp-chatbot",
  },
  "telegram-chatbot": {
    id: "telegram-chatbot",
    slug: "telegram-chatbot",
    serviceTitle: "Telegram Chatbot",
    category: "Conversational Tech",
    title: "Custom Telegram Alert & Ops Bots | Xelvion Innova Tech",
    ogTitle: "Telegram Automation Bots – Live Order Alerts & Team Commands",
    description:
      "Equip operations teams with instant Telegram order alerts, role-restricted lookup commands, and automated FAQ workflows hosted with 24/7 uptime.",
    ogImage: "/og/whatsapp-automation.jpg",
    ogImageAlt: "Automated Telegram alert and internal team dispatch bot interface",
    keywords: [
      "Telegram business bot development",
      "automated team order alerts Telegram",
      "custom Telegram command workflow",
      "Telegram support automation India",
    ],
    canonicalPath: "/services/telegram-chatbot",
  },
  "business-maintenance": {
    id: "business-maintenance",
    slug: "business-maintenance",
    serviceTitle: "Business Maintenance",
    category: "Technical Support",
    title: "Website & App Maintenance SLA | Xelvion Innova Tech",
    ogTitle: "Ongoing Software & Website Maintenance With Direct Engineers",
    description:
      "Protect websites and business tools post-launch with priority bug fixes, SSL renewals, security patches, and direct access to senior engineers.",
    ogImage: "/og/hero-xelvion.jpg",
    ogImageAlt: "Xelvion engineering operations desk providing ongoing system maintenance",
    keywords: [
      "website maintenance SLA India",
      "ongoing software support retainer",
      "SSL security patching service",
      "dedicated technical support SMEs",
    ],
    canonicalPath: "/services/business-maintenance",
  },
};

export function getServiceSeo(slugOrId?: string | null): SeoConfigItem | null {
  if (!slugOrId) return null;
  const normalized = slugOrId.trim().toLowerCase();
  if (SERVICE_SEO_CATALOG[normalized]) {
    return SERVICE_SEO_CATALOG[normalized];
  }
  const byId = Object.values(SERVICE_SEO_CATALOG).find(
    (item) => item.id === normalized || item.slug === normalized
  );
  return byId || null;
}

export function buildServiceJsonLd(seo: SeoConfigItem, origin: string): Record<string, unknown> {
  const cleanOrigin = origin.replace(/\/+$/, "");
  const pageUrl = `${cleanOrigin}${seo.canonicalPath}`;
  const imageUrl = `${cleanOrigin}${seo.ogImage}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: seo.serviceTitle,
        serviceType: seo.category,
        description: seo.description,
        url: pageUrl,
        image: imageUrl,
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        provider: {
          "@type": "Organization",
          name: SITE_BRAND.legalName,
          url: cleanOrigin,
          telephone: SITE_BRAND.phone,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${cleanOrigin}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${cleanOrigin}/#services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: seo.serviceTitle,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
