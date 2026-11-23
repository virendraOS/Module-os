import heroXelvionImg from "../assets/images/hero_xelvion_tech_1791961903056.jpg";
import aiFilterImg from "../assets/images/service_ai_filter_1791961902628.jpg";
import cloudLogisticsImg from "../assets/images/service_cloud_logistics_1791961902994.jpg";
import cloudServersImg from "../assets/images/visual_cloud_servers_1794597909884.jpg";
import whatsappAutomationImg from "../assets/images/visual_whatsapp_automation_1794597910351.jpg";
import databaseEngineImg from "../assets/images/visual_database_engine_1794597911265.jpg";
import videoStudioImg from "../assets/images/visual_video_studio_1794597911324.jpg";
import socialCommandImg from "../assets/images/visual_social_command_1794597911665.jpg";

export const VISUAL_ASSETS = {
  heroTech: heroXelvionImg,
  aiFilter: aiFilterImg,
  cloudLogistics: cloudLogisticsImg,
  cloudServers: cloudServersImg,
  whatsappAutomation: whatsappAutomationImg,
  databaseEngine: databaseEngineImg,
  videoStudio: videoStudioImg,
  socialCommand: socialCommandImg,
} as const;

export interface ServiceVisualMeta {
  image: string;
  alt: string;
  accentLabel: string;
}

export const SERVICE_VISUALS: Record<string, ServiceVisualMeta> = {
  "cloud-services": {
    image: cloudServersImg,
    alt: "Enterprise cloud server racks with cobalt and lime optical fiber accents",
    accentLabel: "AWS Mumbai / GCP Delhi",
  },
  "video-editing": {
    image: videoStudioImg,
    alt: "Modern color-calibrated video editing suite and timeline workstation",
    accentLabel: "Reels / Corporate Films",
  },
  "social-media-management": {
    image: socialCommandImg,
    alt: "Editorial brand strategy desk with structured digital content grid",
    accentLabel: "Calendar / Feed Growth",
  },
  "logistics-services": {
    image: cloudLogisticsImg,
    alt: "Connected fleet dispatch console and offline Proof of Delivery platform",
    accentLabel: "Offline POD / Dispatch",
  },
  "database-management-system": {
    image: databaseEngineImg,
    alt: "Isometric relational database storage cluster linked with fiber lines",
    accentLabel: "PostgreSQL / Indexed RBAC",
  },
  "ai-based-data-filter-software": {
    image: aiFilterImg,
    alt: "Private AI data sanitization pipeline filtering messy records",
    accentLabel: "Private Deduplication",
  },
  "data-maintenance": {
    image: databaseEngineImg,
    alt: "Automated encrypted backup vaults and monthly database integrity monitor",
    accentLabel: "Encrypted Snapshots",
  },
  "whatsapp-chatbot": {
    image: whatsappAutomationImg,
    alt: "Enterprise WhatsApp Business conversational automation on dark slate desk",
    accentLabel: "Official Cloud API",
  },
  "telegram-chatbot": {
    image: whatsappAutomationImg,
    alt: "Automated Telegram alert and internal team dispatch bot interface",
    accentLabel: "Instant Alert Bots",
  },
  "business-maintenance": {
    image: heroXelvionImg,
    alt: "Xelvion engineering operations desk providing ongoing system maintenance",
    accentLabel: "Dedicated SLA Desk",
  },
};

export function getServiceVisual(serviceId: string): ServiceVisualMeta {
  return (
    SERVICE_VISUALS[serviceId] || {
      image: heroXelvionImg,
      alt: "Xelvion Innova Tech engineering architecture",
      accentLabel: "Custom Engineering",
    }
  );
}
