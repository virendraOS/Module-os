export interface PhaseItem {
  id: string;
  name: "Discovery" | "Design" | "Development" | "Testing" | "Launch" | "Maintenance";
  status: "completed" | "in-progress" | "pending";
  dateRange: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  status: "Done" | "In progress" | "Pending";
  dueDate: string;
  completedAt?: string;
}

export interface ActivityUpdate {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: "Xelvion Lead Engineer" | "Xelvion DevOps" | "Client Coordinator" | "Admin";
  type: "update" | "milestone" | "file" | "message";
  content: string;
  timestamp: string;
}

export interface ProjectData {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  title: string;
  serviceId: string;
  serviceName: string;
  status: "Active" | "Completed" | "In Review";
  progress: number;
  nextMilestone: string;
  lastUpdated: string;
  startDate: string;
  targetDueDate: string;
  phases: PhaseItem[];
  milestones: MilestoneItem[];
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: "New" | "Contacted" | "Won" | "Lost";
  notes: string[];
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  company: string;
  phone: string;
  avatarInitials: string;
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "user-admin-1",
    name: "Vikram Rathore",
    email: "admin@xelvion.in",
    role: "admin",
    company: "Xelvion Innova Tech Core Pvt Ltd",
    phone: "+91 98450 11223",
    avatarInitials: "VR"
  },
  {
    id: "user-client-1",
    name: "Rajesh Kalyan",
    email: "client@kalyanlogistics.in",
    role: "client",
    company: "Kalyan Regional Freight Lines",
    phone: "+91 98200 44556",
    avatarInitials: "RK"
  },
  {
    id: "user-client-2",
    name: "Ananya Mehta",
    email: "ananya@suratsilk.co",
    role: "client",
    company: "Surat Silk Mills",
    phone: "+91 97110 33221",
    avatarInitials: "AM"
  }
];

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: "proj-101",
    clientId: "user-client-1",
    clientName: "Rajesh Kalyan",
    clientEmail: "client@kalyanlogistics.in",
    clientCompany: "Kalyan Regional Freight Lines",
    title: "Regional Dispatch & Consignee Tracking System",
    serviceId: "logistics-services",
    serviceName: "Logistics Services",
    status: "Active",
    progress: 68,
    nextMilestone: "Live Mobile POD Field Test with 20 Drivers",
    lastUpdated: "Today at 09:42 AM IST",
    startDate: "01 Sep 2026",
    targetDueDate: "25 Oct 2026",
    phases: [
      { id: "ph-1", name: "Discovery", status: "completed", dateRange: "01 Sep - 07 Sep" },
      { id: "ph-2", name: "Design", status: "completed", dateRange: "08 Sep - 18 Sep" },
      { id: "ph-3", name: "Development", status: "in-progress", dateRange: "19 Sep - 12 Oct" },
      { id: "ph-4", name: "Testing", status: "pending", dateRange: "13 Oct - 20 Oct" },
      { id: "ph-5", name: "Launch", status: "pending", dateRange: "21 Oct - 25 Oct" },
      { id: "ph-6", name: "Maintenance", status: "pending", dateRange: "Post Launch (12 Mo)" }
    ],
    milestones: [
      {
        id: "m-1",
        title: "Database Schema & Dispatch Sync Hook",
        description: "PostgreSQL dispatch schema, vehicle logs, and route sync engine.",
        status: "Done",
        dueDate: "14 Sep 2026",
        completedAt: "13 Sep 2026"
      },
      {
        id: "m-2",
        title: "Central Coordinator Web Dashboard",
        description: "Full vehicle dispatch assignment, route checkpoint milestones, and consignee status views.",
        status: "Done",
        dueDate: "28 Sep 2026",
        completedAt: "27 Sep 2026"
      },
      {
        id: "m-3",
        title: "Mobile Driver POD Web Interface",
        description: "Lightweight mobile screen for driver photo signature upload in rural tier-2 connectivity.",
        status: "In progress",
        dueDate: "18 Oct 2026"
      },
      {
        id: "m-4",
        title: "Final Hardening, SSL & Staff Handover",
        description: "Staff live training session, automated backups on AWS Mumbai, and administrator vault handover.",
        status: "Pending",
        dueDate: "25 Oct 2026"
      }
    ]
  },
  {
    id: "proj-102",
    clientId: "user-client-2",
    clientName: "Ananya Mehta",
    clientEmail: "ananya@suratsilk.co",
    clientCompany: "Surat Silk Mills",
    title: "Meta WhatsApp Business Auto-Catalog & Order Bot",
    serviceId: "whatsapp-chatbot",
    serviceName: "WhatsApp Chatbot",
    status: "Active",
    progress: 45,
    nextMilestone: "Meta Template Approval & Gujarati/Hindi Dialogue Tuning",
    lastUpdated: "Yesterday at 04:15 PM IST",
    startDate: "15 Sep 2026",
    targetDueDate: "10 Nov 2026",
    phases: [
      { id: "ph-1", name: "Discovery", status: "completed", dateRange: "15 Sep - 20 Sep" },
      { id: "ph-2", name: "Design", status: "in-progress", dateRange: "21 Sep - 05 Oct" },
      { id: "ph-3", name: "Development", status: "in-progress", dateRange: "06 Oct - 28 Oct" },
      { id: "ph-4", name: "Testing", status: "pending", dateRange: "29 Oct - 04 Nov" },
      { id: "ph-5", name: "Launch", status: "pending", dateRange: "05 Nov - 10 Nov" },
      { id: "ph-6", name: "Maintenance", status: "pending", dateRange: "Post Launch" }
    ],
    milestones: [
      {
        id: "m-201",
        title: "Meta Business Manager Verification",
        description: "Verified official Meta green-tick business phone registration and webhook tunnel.",
        status: "Done",
        dueDate: "25 Sep 2026",
        completedAt: "24 Sep 2026"
      },
      {
        id: "m-202",
        title: "Conversational Flow & Hinglish Scripts",
        description: "Interactive button menus for fabric catalog and sample swatch dispatch.",
        status: "In progress",
        dueDate: "20 Oct 2026"
      },
      {
        id: "m-203",
        title: "Internal Sales Rep Alert Routing",
        description: "Direct instant WhatsApp alerts to Surat sales desk when high-volume wholesale inquiries occur.",
        status: "Pending",
        dueDate: "05 Nov 2026"
      }
    ]
  }
];

export const INITIAL_UPDATES: ActivityUpdate[] = [
  {
    id: "upd-1",
    projectId: "proj-101",
    authorName: "Amitabh Verma",
    authorRole: "Xelvion Lead Engineer",
    type: "update",
    content: "Pushed build v0.8.4 to staging: Driver POD web signature flow tested with simulated 2G mobile network latency. Touch latency dropped from 1.2s to sub-180ms.",
    timestamp: "Today, 09:42 AM IST"
  },
  {
    id: "upd-2",
    projectId: "proj-101",
    authorName: "Pooja Rao",
    authorRole: "Xelvion DevOps",
    type: "milestone",
    content: "Milestone Completed: Central Coordinator Web Dashboard signed off with JSON parser verification.",
    timestamp: "27 Sep 2026, 05:10 PM IST"
  },
  {
    id: "upd-3",
    projectId: "proj-101",
    authorName: "Rajesh Kalyan",
    authorRole: "Client Coordinator",
    type: "message",
    content: "Verified the route tracker with our Hub manager in Hubli. Consignee SMS link preview is rendering clearly on Jio phones.",
    timestamp: "25 Sep 2026, 02:30 PM IST"
  }
];

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    name: "Sunil Agarwal",
    phone: "+91 98301 22987",
    email: "sunil@agarwalsteel.in",
    service: "AI-based Data Filter Software",
    message: "We have 15 years of scrap dispatch records across 40 different Excel formats. Need an automated script or web tool to deduplicate customer records and normalize vendor names.",
    status: "New",
    notes: ["High intent, called back once. Prefers phone call post 4 PM."],
    createdAt: "Today at 08:15 AM"
  },
  {
    id: "lead-2",
    name: "Kavita Deshmukh",
    phone: "+91 94220 55120",
    email: "kavita@nashikorganics.com",
    service: "WhatsApp Chatbot",
    message: "Need instant WhatsApp lead capture for export inquiries during European business hours.",
    status: "Contacted",
    notes: ["Demo flow scheduled for Thursday 11 AM."],
    createdAt: "Yesterday at 03:40 PM"
  },
  {
    id: "lead-3",
    name: "Manpreet Singh",
    phone: "+91 98140 88231",
    email: "manpreet@ludhianaauto.com",
    service: "Cloud Services",
    message: "Currently running on an old Windows Server 2012 in our Ludhiana plant. Need full cloud migration to AWS with daily backup safeguards.",
    status: "Won",
    notes: ["Onboarding kickoff scheduled."],
    createdAt: "08 Oct 2026"
  }
];

const STORAGE_KEYS = {
  CURRENT_USER: "xelvion_current_user",
  PROJECTS: "xelvion_projects",
  UPDATES: "xelvion_updates",
  LEADS: "xelvion_notifications_leads"
};

export const getStoredData = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn("Storage error", err);
  }
};

export { STORAGE_KEYS };
