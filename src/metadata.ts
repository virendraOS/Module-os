import { OWNER_CONFIG, SERVICES_10 } from "./data/companyConfig";
import { VISUAL_ASSETS } from "./lib/serviceVisuals";

export interface NextMetadata {
  metadataBase?: URL;
  title: string | { default: string; template: string };
  description: string;
  applicationName?: string;
  authors?: Array<{ name: string; url?: string }>;
  generator?: string;
  keywords?: string[];
  referrer?: string;
  creator?: string;
  publisher?: string;
  category?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    nocache?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      noimageindex?: boolean;
      "max-video-preview"?: number | string;
      "max-image-preview"?: "none" | "standard" | "large";
      "max-snippet"?: number;
    };
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  openGraph?: {
    type?: string;
    locale?: string;
    url?: string;
    title?: string;
    description?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "player" | "app";
    title?: string;
    description?: string;
    images?: string[];
  };
}

export const BUSINESS_KEYWORDS: string[] = [
  OWNER_CONFIG.companyName,
  "Xelvion Innova Tech",
  "Indian SME software services",
  "small and medium businesses India",
  "software company New Delhi",
  "Cloud Services",
  "Video Editing",
  "Social Media Management",
  "Logistics Services",
  "Database Management System",
  "DBMS",
  "AI-based Data Filter Software",
  "Data Maintenance",
  "WhatsApp Chatbot",
  "Telegram Chatbot",
  "Business Maintenance",
  "cloud migration and backups",
  "secure cloud hosting India",
  "dispatch management software",
  "shipment tracking dashboard",
  "relational database optimization",
  "spreadsheet data deduplication software",
  "AI data classification",
  "Meta WhatsApp business bot",
  "telegram staff alert bot",
  "ongoing technical maintenance",
  "offline-first architecture",
  "works with poor internet",
  "30-day guarantee"
];

const SITE_URL = "https://xelvion.in";

export const siteMetadata: NextMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${OWNER_CONFIG.companyName} | Digital & Software Services`,
    template: `%s | ${OWNER_CONFIG.companyName}`
  },
  description:
    "Digital and software services for Indian small and medium businesses: Cloud Services, Video Editing, Social Media Management, Logistics Services, DBMS, AI Data Filter Software, Data Maintenance, WhatsApp & Telegram Chatbots, and Business Maintenance.",
  applicationName: OWNER_CONFIG.companyName,
  authors: [{ name: OWNER_CONFIG.companyName, url: SITE_URL }],
  generator: "Vite + React",
  keywords: BUSINESS_KEYWORDS,
  referrer: "origin-when-cross-origin",
  creator: OWNER_CONFIG.companyName,
  publisher: OWNER_CONFIG.companyName,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: SITE_URL
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: `${OWNER_CONFIG.companyName} | Digital & Software Services for Indian SMEs`,
    description:
      "Dependable cloud setups, logistics software, WhatsApp & Telegram chatbots, DBMS, and AI data filters engineered for Indian SMEs.",
    siteName: OWNER_CONFIG.companyName,
    images: [
      {
        url: "/og/hero-xelvion.jpg",
        width: 1200,
        height: 630,
        alt: `${OWNER_CONFIG.companyName} Engineering Office`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER_CONFIG.companyName} | Software Services for Indian SMEs`,
    description:
      "Cloud services, logistics software, chatbots, DBMS, and AI data filtering backed by our 30-day guarantee.",
    images: ["/og/hero-xelvion.jpg"]
  }
};

export const pageMetadata: Record<string, NextMetadata> = {
  home: {
    title: `${OWNER_CONFIG.companyName} | Software & Digital Services for Indian SMEs`,
    description:
      "We build cloud setups, logistics software, chatbots, databases, and AI data filters for Indian small and medium businesses.",
    keywords: BUSINESS_KEYWORDS,
    alternates: {
      canonical: `${SITE_URL}/`
    },
    robots: {
      index: true,
      follow: true
    }
  },
  services: {
    title: `Our 10 Services | ${OWNER_CONFIG.companyName}`,
    description:
      "Explore our 10 focused services: Cloud Services, Video Editing, Social Media Management, Logistics Services, DBMS, AI Data Filter Software, Data Maintenance, WhatsApp Chatbot, Telegram Chatbot, and Business Maintenance.",
    keywords: [
      ...SERVICES_10.map((s) => s.name),
      "Indian SME software services",
      "offline-first software support"
    ],
    alternates: {
      canonical: `${SITE_URL}/services`
    },
    robots: {
      index: true,
      follow: true
    }
  },
  about: {
    title: `About Us | ${OWNER_CONFIG.companyName}`,
    description:
      "Learn about Xelvion Innova Tech Core Private Limited, delivering pragmatic software systems designed for Indian operational conditions.",
    keywords: [
      OWNER_CONFIG.companyName,
      "about Xelvion",
      "software company New Delhi",
      "Indian SME digital partner",
      "offline-first architecture India"
    ],
    alternates: {
      canonical: `${SITE_URL}/about`
    },
    robots: {
      index: true,
      follow: true
    }
  },
  contact: {
    title: `Contact Us | ${OWNER_CONFIG.companyName}`,
    description:
      "Contact Xelvion Innova Tech Core Private Limited for inquiries regarding cloud services, chatbots, logistics software, and data management.",
    keywords: [
      "contact Xelvion",
      "software inquiry India",
      "WhatsApp business consultation"
    ],
    alternates: {
      canonical: `${SITE_URL}/contact`
    },
    robots: {
      index: true,
      follow: true
    }
  },
  legal: {
    title: `Privacy Policy & Terms | ${OWNER_CONFIG.companyName}`,
    description:
      "Privacy policy compliant with the Digital Personal Data Protection (DPDP) Act 2023, Terms of Service, and our 30-Day Milestone Guarantee.",
    keywords: [
      "DPDP Act 2023 privacy policy",
      "Xelvion terms of service",
      "30-day milestone guarantee"
    ],
    alternates: {
      canonical: `${SITE_URL}/legal`
    },
    robots: {
      index: true,
      follow: true
    }
  },
  admin: {
    title: `Admin Console | ${OWNER_CONFIG.companyName}`,
    description: "Internal administration console for managing leads and active projects.",
    robots: {
      index: false,
      follow: false
    }
  }
};

export function generateJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: OWNER_CONFIG.companyName,
        legalName: OWNER_CONFIG.companyName,
        url: SITE_URL,
        description:
          "Digital and software services company providing cloud setups, logistics software, chatbots, DBMS, and AI data filtering for Indian small and medium businesses.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Patel Nagar, New Delhi",
          addressRegion: "Delhi",
          addressCountry: "IN"
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: OWNER_CONFIG.contact.phone,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: OWNER_CONFIG.companyName,
        publisher: {
          "@id": `${SITE_URL}/#organization`
        }
      },
      {
        "@type": "ItemList",
        name: "Services Offered",
        itemListElement: SERVICES_10.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.name,
          description: service.oneLiner
        }))
      }
    ]
  };
}

export function applyDocumentMetadata(pageKey: string): void {
  if (typeof document === "undefined") return;

  const meta = pageMetadata[pageKey] || siteMetadata;
  const title = typeof meta.title === "string" ? meta.title : meta.title?.default || "";

  if (title) {
    document.title = title;
  }

  const setMeta = (name: string, content: string, isProperty = false) => {
    if (!content) return;
    const attr = isProperty ? "property" : "name";
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  if (meta.description) {
    setMeta("description", meta.description);
    setMeta("og:description", meta.description, true);
    setMeta("twitter:description", meta.description);
  }

  if (title) {
    setMeta("og:title", title, true);
    setMeta("twitter:title", title);
  }

  if (meta.keywords && meta.keywords.length > 0) {
    setMeta("keywords", meta.keywords.join(", "));
  }

  if (meta.robots) {
    const robotsContent = `${meta.robots.index ? "index" : "noindex"}, ${meta.robots.follow ? "follow" : "nofollow"}`;
    setMeta("robots", robotsContent);
  }
}
