import { z } from "zod";

/**
 * Curated list of official services strictly provided by Xelvion Innova Tech.
 */
export const OFFICIAL_SERVICES = [
  "Cloud Services",
  "Video Editing",
  "Social Media Management",
  "Logistics Services",
  "Database Management System",
  "AI-based Data Filter Software",
  "Data Maintenance",
  "WhatsApp Chatbot",
  "Telegram Chatbot",
  "Business Maintenance"
] as const;

export type OfficialService = (typeof OFFICIAL_SERVICES)[number];

export const getValidService = (candidate?: string): OfficialService => {
  if (candidate && (OFFICIAL_SERVICES as readonly string[]).includes(candidate)) {
    return candidate as OfficialService;
  }
  return OFFICIAL_SERVICES[0];
};

/**
 * Standard Indian phone number regex:
 * Accepts:
 * - 10-digit mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210, 98765 43210)
 * - Country code prefix (+91, 91, or 0) with optional spaces or hyphens (e.g., +91 98765 43210, +91-98765-43210)
 */
export const INDIAN_PHONE_REGEX = /^(?:(?:\+91|91|0)[\s\-]?)?[6-9](?:[\s\-]?\d){9}$/;

/**
 * Zod validation schema for contact inquiry forms.
 * Validates:
 * - name: string (minimum 2 characters, max 80 characters)
 * - phone: string conforming to Indian phone format
 * - service: enum of the 10 approved services
 * - message: string with minimum 10 characters
 * - consent: boolean, must be true (DPDP Act 2023 compliance)
 * - optional fields: email, budgetRange, honeypot
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(80, { message: "Name cannot exceed 80 characters." })
    .regex(/^[a-zA-Z\s.'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and dots."
    }),

  phone: z
    .string()
    .trim()
    .regex(INDIAN_PHONE_REGEX, {
      message: "Please enter a valid 10-digit Indian phone number (e.g. +91 98765 43210 or 9876543210)."
    }),

  service: z.enum(OFFICIAL_SERVICES, {
    message: "Please select one of our 10 official services."
  }),

  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1500, { message: "Message cannot exceed 1,500 characters." }),

  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy consent to submit your inquiry."
    }),

  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid work email address." })
    .optional()
    .or(z.literal("")),

  budgetRange: z.string().optional(),

  // Anti-bot honeypot
  honeypot: z.string().optional()
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
