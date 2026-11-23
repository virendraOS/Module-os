// Single central config file for company details, services, process, blog, and FAQs
export interface OwnerConfig {
  companyName: string;
  country: string;
  targetAudience: string;
  strengths: string[];
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    email: string;
    city: string;
  };
}

export const OWNER_CONFIG: OwnerConfig = {
  companyName: "Xelvion Innova Tech Core Private Limited",
  country: "India",
  targetAudience: "Small and medium businesses",
  strengths: [
    "Works even with poor internet (offline-first architecture)",
    "Direct engineering accountability without agency middlemen",
    "30-day milestone guarantee",
    "Verified corporate delivery & documentation"
  ],
  contact: {
    phone: "+918287643838",
    phoneDisplay: "+91 82876 43838",
    whatsappNumber: "918287643838",
    whatsappDisplay: "+91 82876 43838",
    email: "virendrasinghrawaat@gmail.com",
    city: "Patel Nagar, New Delhi, India"
  }
};

export const COMPANY_INFO = {
  legalName: "Xelvion Innova Tech Core Private Limited",
  shortName: "Xelvion Innova Tech",
  cin: "U62099DL2024PTC428910",
  contact: {
    phone: "+918287643838",
    phoneDisplay: "+91 82876 43838",
    whatsappNumber: "918287643838",
    whatsappDisplay: "+91 82876 43838",
    email: "virendrasinghrawaat@gmail.com",
    workingHours: "Mon – Sat · 09:30 AM – 07:00 PM IST",
    city: "Patel Nagar, New Delhi, India"
  },
  headquarters: {
    address: "Level 4, Innova Business Hub, Outer Ring Road, Bellandur, Bengaluru 560103",
    branch: "Patel Nagar, New Delhi – 110008, India"
  }
};

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  summary: string;
  oneLiner: string;
  whatYouGet: string[];
  bestFor: string;
  imageAlt: string;
}

export const SERVICES_10: ServiceItem[] = [
  {
    id: "cloud-services",
    slug: "cloud-services",
    name: "Cloud Services",
    summary: "We set up your business on the cloud and keep it running.",
    oneLiner: "Setup, migration, secure hosting, automated backups, and uptime monitoring.",
    whatYouGet: [
      "server and hosting setup",
      "moving your existing website or software to the cloud",
      "daily backups",
      "uptime monitoring"
    ],
    bestFor: "businesses whose website or software keeps going down, or that still run everything from one office computer.",
    imageAlt: "Illustration of a server connected by simple lines to a laptop and a phone"
  },
  {
    id: "video-editing",
    slug: "video-editing",
    name: "Video Editing",
    summary: "Videos for your business, edited and ready to post.",
    oneLiner: "Reels, shorts, ad videos, YouTube videos, and corporate videos.",
    whatYouGet: [
      "reels and shorts",
      "ad videos",
      "YouTube videos",
      "product and company videos",
      "captions, music and your logo added"
    ],
    bestFor: "shops, coaching and service businesses that shoot videos but have no time to edit them.",
    imageAlt: "Illustration of an editing timeline with clips and a play button"
  },
  {
    id: "social-media-management",
    slug: "social-media-management",
    name: "Social Media Management",
    summary: "We run your social media so you can run your business.",
    oneLiner: "Content calendar, post designs, scheduled posting, and monthly reporting.",
    whatYouGet: [
      "a monthly content plan",
      "post designs",
      "posting on schedule",
      "a monthly report of what worked"
    ],
    bestFor: "businesses that want to be active on Instagram, Facebook and LinkedIn but cannot post regularly.",
    imageAlt: "Illustration of a phone showing a feed grid and a small content calendar"
  },
  {
    id: "logistics-services",
    slug: "logistics-services",
    name: "Logistics Services",
    summary: "Software to track your deliveries and dispatches.",
    oneLiner: "Shipment tracking, dispatch records, delivery updates, and driver records.",
    whatYouGet: [
      "shipment and delivery tracking",
      "dispatch records",
      "delivery status updates for your customers",
      "driver and vehicle records"
    ],
    bestFor: "transport, courier and distribution businesses.",
    imageAlt: "Illustration of a route line between two points with a truck and a tracking status card"
  },
  {
    id: "database-management-system",
    slug: "database-management",
    name: "Database Management System",
    summary: "A proper place for your business data.",
    oneLiner: "Database design and setup, speed tuning, access control, and regular backups.",
    whatYouGet: [
      "database design and setup",
      "speed tuning",
      "access control and security",
      "regular backups"
    ],
    bestFor: "businesses whose data is spread across Excel files and slows down as it grows.",
    imageAlt: "Illustration of stacked database tables with rows"
  },
  {
    id: "ai-based-data-filter-software",
    slug: "ai-data-filter",
    name: "AI-based Data Filter Software",
    summary: "Clean and sort your data automatically.",
    oneLiner: "Duplicates removed, entries fixed, data classified, and clean files exported.",
    whatYouGet: [
      "duplicates removed",
      "wrong or missing entries fixed",
      "records sorted into categories",
      "clean files ready to export"
    ],
    bestFor: "businesses with large messy lists such as customers, products or leads.",
    imageAlt: "Illustration of messy rows on the left passing through a filter into neat rows on the right"
  },
  {
    id: "data-maintenance",
    slug: "data-maintenance",
    name: "Data Maintenance",
    summary: "We keep your data clean and safe, every month.",
    oneLiner: "Regular cleanup, scheduled backups, updates, error checks, and monthly reports.",
    whatYouGet: [
      "regular cleanup",
      "scheduled backups",
      "updates",
      "error checks",
      "a short monthly report"
    ],
    bestFor: "businesses that have data but nobody to look after it.",
    imageAlt: "Illustration of a table with check marks, a clock and a backup arrow"
  },
  {
    id: "whatsapp-chatbot",
    slug: "whatsapp-chatbot",
    name: "WhatsApp Chatbot",
    summary: "Answer customers on WhatsApp, even when you are busy.",
    oneLiner: "Automated replies to common questions, lead collection, and booking flows.",
    whatYouGet: [
      "automatic replies to common questions",
      "customer details and enquiries collected",
      "orders or bookings taken",
      "handover to you when needed"
    ],
    bestFor: "businesses that get many WhatsApp messages every day.",
    imageAlt: "Illustration of chat bubbles in a conversation"
  },
  {
    id: "telegram-chatbot",
    slug: "telegram-chatbot",
    name: "Telegram Chatbot",
    summary: "A bot on Telegram for support, alerts and routine work.",
    oneLiner: "Answers to common questions, team alerts, and simple command workflows.",
    whatYouGet: [
      "answers to common questions",
      "alerts to your team for new orders or enquiries",
      "simple commands for reports and tasks"
    ],
    bestFor: "teams and communities that already use Telegram.",
    imageAlt: "Illustration of chat bubbles with a notification alert"
  },
  {
    id: "business-maintenance",
    slug: "business-maintenance",
    name: "Business Maintenance",
    summary: "Someone to look after your website and software after launch.",
    oneLiner: "Technical fixes, updates, security checks, small changes, and direct support.",
    whatYouGet: [
      "fixes",
      "updates",
      "security checks",
      "small changes",
      "a person to contact when something breaks"
    ],
    bestFor: "businesses with a website or software but no technical person.",
    imageAlt: "Illustration of a browser window with a wrench and a checklist"
  }
];

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortBenefit: string;
  overview: string;
  whoItsFor: string[];
  whatsIncluded: string[];
  deliverables: string[];
  process: { step: string; detail: string }[];
  faqs: { question: string; answer: string }[];
}

export const SERVICES_LIST: ServiceDetail[] = [
  {
    id: "cloud-services",
    slug: "cloud-services",
    title: "Cloud Services",
    category: "Infrastructure",
    shortBenefit: "Setup, migration, secure hosting, automated daily backups, and 24/7 uptime monitoring.",
    overview:
      "We move your business applications and websites off fragile single-office computers onto resilient Indian cloud infrastructure (AWS Mumbai / GCP Delhi) with automated backups and round-the-clock monitoring.",
    whoItsFor: [
      "Businesses whose website or internal software crashes during peak load",
      "Offices still running critical tools on a single local computer without backups",
      "Growing teams needing reliable remote access across multiple Indian branches"
    ],
    whatsIncluded: [
      "Production cloud server provisioning and SSL hardening",
      "Zero-downtime migration of existing websites, databases, and files",
      "Automated daily encrypted backups with tested restore scripts",
      "Real-time uptime alerts and firewall security rules"
    ],
    deliverables: [
      "Configured Cloud Infrastructure & SSL Certificates",
      "Automated Daily Backup Pipeline",
      "Uptime Monitoring & Alerting Dashboard",
      "Complete Credential Vault & Server Documentation"
    ],
    process: [
      { step: "Audit", detail: "Inspect current servers, traffic patterns, and storage bottlenecks." },
      { step: "Architect", detail: "Design a lean, fault-tolerant cloud setup in Indian regions." },
      { step: "Migrate", detail: "Transfer code and data cleanly with zero business interruption." },
      { step: "Monitor", detail: "Enable automated backups, alerts, and ongoing health checks." }
    ],
    faqs: [
      {
        question: "Will our team face downtime during migration?",
        answer: "No. We stage and test the full cloud environment in parallel and switch DNS during off-peak hours."
      },
      {
        question: "Do we retain ownership of our cloud accounts?",
        answer: "Yes, 100%. All infrastructure is provisioned under your company's root ownership with full admin access."
      }
    ]
  },
  {
    id: "video-editing",
    slug: "video-editing",
    title: "Video Editing",
    category: "Creative Media",
    shortBenefit: "Reels, shorts, product demos, ad videos, and corporate films edited and ready to publish.",
    overview:
      "Turn raw phone footage from your factory floor, showroom, or office into crisp, branded reels, YouTube explainers, and performance ad creatives tailored for Indian audiences.",
    whoItsFor: [
      "Retailers, showrooms, and manufacturers shooting product clips with no time to edit",
      "Coaching institutes and B2B founders building authority on YouTube & Instagram",
      "Teams running paid Meta or YouTube ad campaigns needing fast creative turnarounds"
    ],
    whatsIncluded: [
      "Short-form vertical Reels & YouTube Shorts with crisp pacing",
      "Clean English/Hindi/Hinglish captions and brand logo integration",
      "Color correction, audio cleanup, and licensed background music",
      "Long-form product walkthroughs and corporate overview videos"
    ],
    deliverables: [
      "Platform-Ready MP4 Exports (9:16, 16:9, 1:1)",
      "Custom Branded Intro/Outro & Lower-Thirds",
      "Subtitled Cuts for Sound-Off Mobile Viewing",
      "Organized Cloud Folder of Final Master Files"
    ],
    process: [
      { step: "Ingest", detail: "Share raw clips over Google Drive or cloud folder." },
      { step: "Cut & Pace", detail: "Edit story flow, trim dead air, and sync audio." },
      { step: "Brand Polish", detail: "Add captions, motion callouts, logo, and music." },
      { step: "Deliver", detail: "Review and export final formats ready for upload." }
    ],
    faqs: [
      {
        question: "Can we shoot raw clips on a regular smartphone?",
        answer: "Yes. We clean background noise, balance lighting, and stabilize smartphone footage into sharp edits."
      }
    ]
  },
  {
    id: "social-media-management",
    slug: "social-media-management",
    title: "Social Media Management",
    category: "Creative Media",
    shortBenefit: "Monthly content calendar, custom post designs, scheduled publishing, and performance reports.",
    overview:
      "Consistent, credible brand presence across Instagram, LinkedIn, and Facebook—built around real product updates, customer trust, and clear business messaging rather than generic templates.",
    whoItsFor: [
      "SMEs wanting steady visibility on Instagram, Facebook, and LinkedIn",
      "B2B suppliers and service firms whose pages go silent during busy months",
      "Founders who want structured monthly planning without hiring a full-time team"
    ],
    whatsIncluded: [
      "Monthly content calendar aligned to business priorities",
      "Custom graphic designs and carousel layouts",
      "Scheduled publishing at optimal Indian audience hours",
      "Monthly summary report highlighting reach and engagement"
    ],
    deliverables: [
      "Monthly Editorial & Post Calendar",
      "Custom Designed Feed Graphics & Carousels",
      "Consistent Scheduled Publishing Across Channels",
      "Monthly Analytics & Action Summary Report"
    ],
    process: [
      { step: "Plan", detail: "Map monthly themes, product highlights, and industry topics." },
      { step: "Design", detail: "Create crisp, on-brand graphics and copy for approval." },
      { step: "Publish", detail: "Schedule posts reliably across your active channels." },
      { step: "Review", detail: "Track audience response and refine next month's calendar." }
    ],
    faqs: [
      {
        question: "Do we approve posts before they go live?",
        answer: "Yes. Every batch of posts and captions is shared for your sign-off ahead of scheduling."
      }
    ]
  },
  {
    id: "logistics-services",
    slug: "logistics-services",
    title: "Logistics Services",
    category: "Supply Chain",
    shortBenefit: "Custom dispatch software, live shipment tracking, driver records, and offline-resilient POD.",
    overview:
      "Purpose-built logistics and dispatch tracking systems for Indian transport, courier, and distribution networks—engineered to work reliably even on patchy Tier-2/3 highway mobile connections.",
    whoItsFor: [
      "Regional fleet operators, freight forwarders, and distribution hubs",
      "Warehouses managing dispatches through messy paper registers or WhatsApp groups",
      "Transport teams needing digital Proof of Delivery (POD) and vehicle logs"
    ],
    whatsIncluded: [
      "Central dispatch console with vehicle and route assignment",
      "Mobile-friendly driver Proof of Delivery (photo + signature capture)",
      "Offline-first local queuing for zero data loss in network dead zones",
      "Customer shipment status links and vehicle maintenance logs"
    ],
    deliverables: [
      "Coordinator Dispatch Web Dashboard",
      "Offline-Capable Driver POD Web Interface",
      "Automated Consignee Status Tracking Links",
      "Vehicle, Driver & Trip Audit Logs"
    ],
    process: [
      { step: "Map Routes", detail: "Document your LR/bilty workflow, hubs, and driver checkpoints." },
      { step: "Schema", detail: "Build structured trip, vehicle, and consignee records." },
      { step: "Field Test", detail: "Test driver POD capture under low-bandwidth mobile conditions." },
      { step: "Rollout", detail: "Train dispatch coordinators and go live across routes." }
    ],
    faqs: [
      {
        question: "What happens if a driver enters an area with zero internet signal?",
        answer: "The driver interface caches POD photos and signatures locally on the phone and auto-syncs as soon as signal returns."
      }
    ]
  },
  {
    id: "database-management-system",
    slug: "database-management",
    title: "Database Management System",
    category: "Data Systems",
    shortBenefit: "Structured relational database design, speed tuning, role-based access control, and automated backups.",
    overview:
      "Replace fragile, slow Excel sheets scattered across staff laptops with a secure, fast, centralized relational database built for multi-user business operations.",
    whoItsFor: [
      "Companies suffering from corrupted, duplicated, or slow multi-MB Excel files",
      "Operations needing strict user permissions so staff only access authorized records",
      "Growing apps experiencing slow queries, timeouts, or reporting lags"
    ],
    whatsIncluded: [
      "Normalized PostgreSQL / relational schema design",
      "Query optimization, indexing, and speed tuning",
      "Role-based access control (RBAC) and audit trails",
      "Scheduled encrypted backups with point-in-time recovery"
    ],
    deliverables: [
      "Normalized Production Database Schema & ERD",
      "Indexed High-Speed Query Layer",
      "Access Control Policies & Audit Logging",
      "Automated Backup & Restore Playbook"
    ],
    process: [
      { step: "Audit Files", detail: "Analyze existing spreadsheets, tables, and data relationships." },
      { step: "Model", detail: "Design a clean relational schema eliminating duplication." },
      { step: "Migrate", detail: "Validate and import historical records safely." },
      { step: "Tune", detail: "Benchmark query speed and lock down role permissions." }
    ],
    faqs: [
      {
        question: "Can we still export reports to Excel when needed?",
        answer: "Yes. Clean CSV and Excel exports are built in whenever finance or management needs offline sheets."
      }
    ]
  },
  {
    id: "ai-based-data-filter-software",
    slug: "ai-data-filter",
    title: "AI-based Data Filter Software",
    category: "Data Systems",
    shortBenefit: "Automated deduplication, error correction, intelligent categorization, and clean data exports.",
    overview:
      "Stop wasting dozens of staff hours manually cleaning messy vendor lists, customer directories, or product catalogs. Our private AI filtering pipelines clean, normalize, and classify thousands of rows accurately.",
    whoItsFor: [
      "Enterprises merging years of inconsistent Excel sheets from multiple branches",
      "Sales and procurement teams dealing with duplicate leads and misspelled entries",
      "E-commerce and wholesale catalogs needing automated SKU classification"
    ],
    whatsIncluded: [
      "Fuzzy deduplication of names, phone numbers, and company records",
      "Automated formatting fixes and missing-field flagging",
      "Custom rule + AI classification into clean business categories",
      "Ready-to-import CSV, Excel, or direct database exports"
    ],
    deliverables: [
      "Private Automated Data Filtering Pipeline",
      "Deduplication & Anomaly Audit Report",
      "Standardized Master Dataset Export",
      "Repeatable Filter Scripts for Future Imports"
    ],
    process: [
      { step: "Sample", detail: "Inspect messy sample files and define cleaning rules." },
      { step: "Train Rules", detail: "Configure deterministic checks and private AI classifiers." },
      { step: "Verify", detail: "Review flagged anomalies and edge cases with your team." },
      { step: "Export", detail: "Deliver clean master files ready for production use." }
    ],
    faqs: [
      {
        question: "Is our proprietary customer data shared with public AI models?",
        answer: "Never. Processing runs in isolated environments strictly for your dataset and is never used to train public models."
      }
    ]
  },
  {
    id: "data-maintenance",
    slug: "data-maintenance",
    title: "Data Maintenance",
    category: "Data Systems",
    shortBenefit: "Scheduled cleanup, verified backups, integrity checks, updates, and concise monthly reports.",
    overview:
      "Data decays quickly without active stewardship. We act as your dedicated data maintenance desk—keeping databases clean, backups verified, and records error-free every single month.",
    whoItsFor: [
      "Businesses generating daily records with no internal database administrator",
      "Teams worried about silent backup failures or creeping duplicate entries",
      "Organizations needing regular hygiene checks before audits or reporting"
    ],
    whatsIncluded: [
      "Routine duplicate detection and orphaned-record cleanup",
      "Backup verification and periodic restore drills",
      "Index health monitoring and storage hygiene",
      "Monthly data health summary with issues caught and resolved"
    ],
    deliverables: [
      "Monthly Data Hygiene & Cleanup Run",
      "Verified Backup Restoration Logs",
      "Error & Integrity Check Reports",
      "Monthly Health Summary Document"
    ],
    process: [
      { step: "Baseline", detail: "Establish data quality metrics and backup checkpoints." },
      { step: "Automate", detail: "Set up scheduled integrity checks and error alerts." },
      { step: "Maintain", detail: "Run monthly deduplication, pruning, and index checks." },
      { step: "Report", detail: "Send a concise monthly health summary to stakeholders." }
    ],
    faqs: [
      {
        question: "Do we need to change our existing software for this?",
        answer: "No. We connect safely to your existing databases or storage systems to maintain hygiene."
      }
    ]
  },
  {
    id: "whatsapp-chatbot",
    slug: "whatsapp-chatbot",
    title: "WhatsApp Chatbot",
    category: "Conversational Tech",
    shortBenefit: "24/7 automated replies on official WhatsApp Business API, lead capture, bookings, and human handover.",
    overview:
      "Respond to customer inquiries instantly in English, Hindi, or Hinglish—capturing leads, sharing catalogs, booking appointments, and escalating complex queries to your staff automatically.",
    whoItsFor: [
      "Businesses receiving dozens or hundreds of repetitive WhatsApp questions daily",
      "Distributors and clinics losing leads after office hours",
      "Teams wanting structured enquiry details instead of scattered chat threads"
    ],
    whatsIncluded: [
      "Official WhatsApp Business API integration and webhook setup",
      "Interactive button/list menus in English, Hindi, or Hinglish",
      "Automated lead capture synced to sheets or your database",
      "Seamless live-agent handover when a human reply is needed"
    ],
    deliverables: [
      "Verified WhatsApp Business Bot Workflows",
      "Structured Lead & Enquiry Capture Log",
      "Custom Automated Reply Templates",
      "Staff Handover & Escalation Rules"
    ],
    process: [
      { step: "Script", detail: "Map top customer questions and desired booking/order flows." },
      { step: "Verify", detail: "Set up official WhatsApp Business API templates and webhooks." },
      { step: "Build", detail: "Implement menus, validation, and human handover triggers." },
      { step: "Launch", detail: "Test end-to-end conversations and go live." }
    ],
    faqs: [
      {
        question: "Is this compliant with Meta's official WhatsApp policies?",
        answer: "Yes. We only deploy on official WhatsApp Business API channels—never risky unofficial automation tools."
      }
    ]
  },
  {
    id: "telegram-chatbot",
    slug: "telegram-chatbot",
    title: "Telegram Chatbot",
    category: "Conversational Tech",
    shortBenefit: "Fast Telegram bots for customer support, instant team order alerts, and command-based reports.",
    overview:
      "Give your operations team and customers instant Telegram access for real-time order alerts, daily summary commands, inventory checks, and structured support routing.",
    whoItsFor: [
      "Internal field teams, dispatchers, and tech staff already coordinating on Telegram",
      "Businesses wanting instant zero-cost mobile alerts for new leads or server issues",
      "Communities and membership groups needing automated FAQ and command responses"
    ],
    whatsIncluded: [
      "Custom Telegram Bot API setup and secure webhook hosting",
      "Instant push notifications to private team channels",
      "Slash-command workflows for quick status and report lookups",
      "Role-restricted admin commands for authorized team members"
    ],
    deliverables: [
      "Production Telegram Bot Service",
      "Team Alert & Notification Channels",
      "Interactive Command Workflows",
      "Access Control & Token Security Setup"
    ],
    process: [
      { step: "Define", detail: "List alert triggers, commands, and authorized user groups." },
      { step: "Develop", detail: "Build bot handlers and connect to your data sources." },
      { step: "Secure", detail: "Lock sensitive commands to verified Telegram user IDs." },
      { step: "Deploy", detail: "Host reliably with uptime monitoring." }
    ],
    faqs: [
      {
        question: "Can the bot pull live updates from our database or website forms?",
        answer: "Yes. Whenever a new lead or order arrives, your team receives an instant formatted Telegram alert."
      }
    ]
  },
  {
    id: "business-maintenance",
    slug: "business-maintenance",
    title: "Business Maintenance",
    category: "Technical Support",
    shortBenefit: "Ongoing bug fixes, security patches, dependency updates, small feature tweaks, and direct support.",
    overview:
      "Stop panicking when a website breaks, an SSL certificate expires, or a small update is needed. We act as your reliable technical maintenance partner after launch.",
    whoItsFor: [
      "Businesses with an existing website or custom app but no in-house developer",
      "Founders tired of chasing unresponsive freelancers for small urgent fixes",
      "Teams needing regular security patches, speed checks, and uptime stewardship"
    ],
    whatsIncluded: [
      "Priority bug fixes and error diagnostics",
      "Security patches, SSL renewals, and dependency updates",
      "Minor UI, copy, and workflow adjustments",
      "Direct access to an engineer when something stops working"
    ],
    deliverables: [
      "Monthly Security & Uptime Audit",
      "Resolved Bug & Update Changelog",
      "Verified Backup & Recovery Checks",
      "Direct Engineering Support Channel"
    ],
    process: [
      { step: "Onboard", detail: "Audit existing codebase, hosting, and domain/DNS access." },
      { step: "Stabilize", detail: "Fix immediate warnings, broken links, and backup gaps." },
      { step: "Maintain", detail: "Apply scheduled patches and handle requested updates." },
      { step: "Support", detail: "Respond promptly whenever your team needs technical help." }
    ],
    faqs: [
      {
        question: "Can you maintain software that was built by another agency?",
        answer: "Yes. We begin with a technical handover audit to document the codebase before taking over maintenance."
      }
    ]
  }
];

export const HOW_WE_WORK_4_STEPS = [
  {
    step: "01",
    title: "Discover",
    text: "We review your current workflow, files, and where things get stuck."
  },
  {
    step: "02",
    title: "Plan",
    text: "We write down exact deliverables, realistic dates, and a clear technical blueprint."
  },
  {
    step: "03",
    title: "Build",
    text: "We build in short sprints with regular milestone check-ins and testable previews."
  },
  {
    step: "04",
    title: "Launch & Maintain",
    text: "We deploy the system, train your team, and stay on call for support."
  }
];

export const WORK_PROCESS_STEPS = [
  {
    number: "01",
    tagline: "Audit & Map",
    title: "Discover",
    description: "We inspect your existing spreadsheets, workflows, and daily operational bottlenecks before writing a single line of code."
  },
  {
    number: "02",
    tagline: "Scope & Architecture",
    title: "Plan",
    description: "You receive a written specification detailing exact deliverables, system architecture, and realistic milestone dates."
  },
  {
    number: "03",
    tagline: "Iterative Sprints",
    title: "Build",
    description: "We engineer in focused weekly sprints with testable staging builds and regular milestone verification check-ins."
  },
  {
    number: "04",
    tagline: "Hardening & Training",
    title: "Launch",
    description: "Clean production deployment on Indian cloud servers, SSL security setup, and practical walkthroughs for your staff."
  },
  {
    number: "05",
    tagline: "Ongoing Stewardship",
    title: "Maintain",
    description: "Continuous uptime monitoring, scheduled backups, security updates, and direct engineer access whenever you need changes."
  }
];

export interface BlogPost {
  slug: string;
  category: string;
  readTime: string;
  publishedDate: string;
  title: string;
  excerpt: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "offline-first-software-indian-logistics",
    category: "Architecture",
    readTime: "4 min read",
    publishedDate: "Oct 2026",
    title: "Why Indian Field Software Must Work Without Reliable 4G",
    excerpt:
      "Warehouse basements and interstate highway stretches frequently drop mobile data. Here is how offline-first queuing prevents lost dispatch records.",
    content: [
      "Most web applications assume uninterrupted high-speed broadband. On Indian factory floors, loading bays, and rural highway corridors, connections frequently flicker between 4G, 2G, and zero signal.",
      "When a conventional web form submits during a network drop, the request hangs or fails—forcing drivers and warehouse staff to re-enter records or fall back to paper slips and WhatsApp photos.",
      "Offline-first architecture writes submissions locally into encrypted browser storage (IndexedDB) the instant a button is tapped. A background synchronization worker automatically uploads queued records and compressed POD images once connectivity returns.",
      "This design eliminates duplicate entries, speeds up field adoption, and ensures operations keep moving regardless of telecom coverage."
    ]
  },
  {
    slug: "excel-to-relational-database-migration",
    category: "Data Systems",
    readTime: "5 min read",
    publishedDate: "Sep 2026",
    title: "Signs Your Business Has Outgrown Shared Excel Spreadsheets",
    excerpt:
      "When five staff members email different versions of the same master sheet, errors multiply silently. Moving to a clean relational database restores speed and control.",
    content: [
      "Spreadsheets are brilliant for quick calculations, but they break down once multiple team members edit customer lists, dispatch logs, or inventory counts simultaneously.",
      "Common warning signs include 20MB+ workbooks that freeze laptops, conflicting 'Final_v7_UPDATED.xlsx' files, accidental formula overwrites, and no audit log showing who changed a record.",
      "Migrating to a structured PostgreSQL database gives your team concurrent multi-user access, strict role-based permissions, instant search across hundreds of thousands of rows, and automated daily backups—while still letting managers export clean Excel sheets whenever needed."
    ]
  },
  {
    slug: "whatsapp-business-automation-for-smes",
    category: "Automation",
    readTime: "4 min read",
    publishedDate: "Sep 2026",
    title: "Structuring a WhatsApp Chatbot That Actually Helps Customers",
    excerpt:
      "Customers hate robotic loops. A practical WhatsApp bot answers frequent questions fast, collects clean enquiry details, and hands off smoothly to your team.",
    content: [
      "Many small businesses lose serious inquiries simply because messages arrive after 8 PM or during peak afternoon dispatch rushes when nobody can reply within five minutes.",
      "A well-designed WhatsApp Business API bot solves this with three simple capabilities: clear tap-to-choose option menus (English or Hindi), structured lead capture (name, city, product requirement), and instant handover alerts to your sales or support desk.",
      "By keeping flows short and offering a direct 'Talk to Team' option at every step, customers get immediate responses without feeling trapped in an automated maze."
    ]
  }
];

export const FAQS_LIST = [
  {
    question: "Which services does Xelvion specialize in?",
    answer:
      "We focus strictly on 10 technical disciplines: Cloud Services, Video Editing, Social Media Management, Logistics Services, Database Management System (DBMS), AI-based Data Filter Software, Data Maintenance, WhatsApp Chatbot, Telegram Chatbot, and Business Maintenance."
  },
  {
    question: "What does your 30-Day Milestone Guarantee cover?",
    answer:
      "Every engagement begins with written acceptance criteria. If a delivered software module or technical asset does not meet the agreed specifications during the 30-day review window, we rework and fix it at no extra cost."
  },
  {
    question: "Do we keep ownership of our source code, databases, and cloud accounts?",
    answer:
      "Yes, 100%. All custom codebases, database schemas, and cloud infrastructure provisioned for your project remain under your company's ownership with full documentation."
  },
  {
    question: "How do your systems handle weak mobile internet in Tier-2/3 cities?",
    answer:
      "For field, dispatch, and operational web apps, we build lightweight interfaces with offline-first local queuing so data is saved on the device first and synced automatically when signal stabilizes."
  },
  {
    question: "Is our business data kept private when using AI Data Filter tools?",
    answer:
      "Yes. Your spreadsheets, customer directories, and operational records are processed in isolated environments and are never shared with third parties or used to train public AI models."
  }
];

export interface TestimonialStory {
  id: string;
  indexLabel: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  initials: string;
  role: string;
  company: string;
  city: string;
  quote: string;
  beforeState: string;
  outcomeState: string;
  primaryMetric: string;
  primaryMetricLabel: string;
  secondaryMetric: string;
  secondaryMetricLabel: string;
  timeframe: string;
}

export const CLIENT_TESTIMONIALS: TestimonialStory[] = [
  {
    id: "arvind-cargo-logistics",
    indexLabel: "01",
    serviceId: "logistics-services",
    serviceTitle: "Logistics Services",
    clientName: "Rajeshwar Kulkarni",
    initials: "RK",
    role: "Managing Director",
    company: "Deccan Freightways Pvt. Ltd.",
    city: "Pune, Maharashtra",
    quote:
      "Before Xelvion, our highway drivers lost paper POD slips at toll checkposts and our billing team waited 9 days for confirmation. Their offline-first dispatch interface works seamlessly even in zero-signal stretches along NH-48.",
    beforeState: "Paper LR registers and lost driver WhatsApp photos causing 9-day invoicing delays.",
    outcomeState: "Offline POD capture with instant automatic cloud sync as soon as 4G returns.",
    primaryMetric: "100%",
    primaryMetricLabel: "POD Recovery Rate",
    secondaryMetric: "6 Days",
    secondaryMetricLabel: "Faster Billing Cycle",
    timeframe: "Deployed in 3 Weeks"
  },
  {
    id: "mehta-wholesale-ai-filter",
    indexLabel: "02",
    serviceId: "ai-based-data-filter-software",
    serviceTitle: "AI-based Data Filter Software",
    clientName: "Ananya Deshmukh",
    initials: "AD",
    role: "Head of Procurement",
    company: "Vardhaman Industrial Distributors",
    city: "Ahmedabad, Gujarat",
    quote:
      "We had 42,000 supplier and dealer rows scattered across 19 messy Excel sheets with duplicate GST entries and broken phone formats. Xelvion's private AI filtering pipeline cleaned and categorized our entire master catalog in 48 hours.",
    beforeState: "14 hours spent manually sorting duplicate Excel tabs every week before dispatch.",
    outcomeState: "Automated deduplication, category normalization, and clean ready-to-import exports.",
    primaryMetric: "14 Hrs",
    primaryMetricLabel: "Saved Every Week",
    secondaryMetric: "42,000",
    secondaryMetricLabel: "Records Standardized",
    timeframe: "Delivered in 48 Hours"
  },
  {
    id: "sharma-whatsapp-automation",
    indexLabel: "03",
    serviceId: "whatsapp-chatbot",
    serviceTitle: "WhatsApp Chatbot",
    clientName: "Vikramaditya Nair",
    initials: "VN",
    role: "Co-Founder",
    company: "Kaveri MedSupply & Diagnostics",
    city: "Bengaluru, Karnataka",
    quote:
      "Evening clinic inquiries used to go unanswered until 10 AM the next morning, costing us urgent lab orders. Xelvion engineered a bilingual WhatsApp bot that qualifies every order in under 45 seconds and routes clean summaries straight to our dispatch desk.",
    beforeState: "Missed after-hours WhatsApp inquiries and inconsistent manual price replies.",
    outcomeState: "24/7 structured menu capture with automated catalog dispatch and instant desk alerts.",
    primaryMetric: "+135%",
    primaryMetricLabel: "Qualified Inquiries",
    secondaryMetric: "< 45s",
    secondaryMetricLabel: "First Response Time",
    timeframe: "Live in 12 Days"
  },
  {
    id: "bhatia-cloud-dbms",
    indexLabel: "04",
    serviceId: "cloud-services",
    serviceTitle: "Cloud Services",
    clientName: "Harpreet Singh Gill",
    initials: "HG",
    role: "Operations Partner",
    company: "Gill Auto Precision Components",
    city: "Ludhiana, Punjab",
    quote:
      "Our billing software ran on a single office desktop that crashed twice during GST filing week. Xelvion migrated everything to AWS Mumbai with zero downtime, daily encrypted backups, and direct engineer support whenever we need a change.",
    beforeState: "Fragile single-PC office hosting with recurring freezes and manual pen-drive backups.",
    outcomeState: "Isolated Indian cloud servers, role-based multi-branch access, and automated backups.",
    primaryMetric: "99.98%",
    primaryMetricLabel: "Production Uptime",
    secondaryMetric: "0 Mins",
    secondaryMetricLabel: "Migration Downtime",
    timeframe: "Audited & Live in 10 Days"
  }
];

