import express from "express";
import type { Request, Response } from "express";
import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import dotenv from "dotenv";
import { z } from "zod";
import {
  requireAuth,
  optionalAuth,
  requireAdmin,
  type AuthRequest,
} from "../middleware/auth.ts";
import { getAllUsersDb, updateUserProfileDb } from "../db/users.ts";
import {
  createInquiryDb,
  getInquiriesByUserUidDb,
  getAllInquiriesDb,
  updateInquiryStatusDb,
  addInquiryNoteDb,
  getProjectsWithUpdatesDb,
  toggleProjectMilestoneDb,
  addProjectUpdateDb,
} from "../db/repository.ts";

// Load environment variables from .env
dotenv.config();

export const app = express();

// Normalize Netlify serverless rewrite prefix (/.netlify/functions/api/* -> /api/*)
app.use((req, _res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    const suffix = req.url.slice("/.netlify/functions/api".length);
    req.url = `/api${suffix.startsWith("/") ? suffix : suffix ? `/${suffix}` : ""}`;
  }
  next();
});

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Official 10 services strictly offered
const OFFICIAL_SERVICES = [
  "Cloud Services",
  "Video Editing",
  "Social Media Management",
  "Logistics Services",
  "Database Management System",
  "AI-based Data Filter Software",
  "Data Maintenance",
  "WhatsApp Chatbot",
  "Telegram Chatbot",
  "Business Maintenance",
] as const;

// Server-side Zod validation schema
const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters."),
  phone: z
    .string()
    .trim()
    .min(7, "Please provide a valid phone number.")
    .max(25, "Phone number is too long.")
    .refine(
      (val) => val.replace(/[^0-9]/g, "").length >= 10,
      "Please enter a valid 10-digit phone number."
    ),
  service: z.enum(OFFICIAL_SERVICES, {
    message: "Invalid service selected.",
  }),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters.")
    .max(1500, "Message cannot exceed 1500 characters."),
  consent: z
    .boolean()
    .refine((val) => val === true, "Privacy policy consent is required."),
  email: z
    .string()
    .trim()
    .email("Invalid email format.")
    .optional()
    .or(z.literal("")),
  callbackDay: z.string().trim().max(40).optional(),
  callbackSlot: z.string().trim().max(60).optional(),
  honeypot: z.string().optional(),
});

interface MailTransportConfig {
  provider: "smtp" | "gmail";
  from: string;
  to: string;
  cc?: string;
  transporter: Transporter;
}

function getMailTransport(): MailTransportConfig | null {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE.trim().toLowerCase() === "true"
      : smtpPort === 465;
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();

  const configuredTo =
    process.env.INQUIRY_TO?.trim() ||
    process.env.EMAIL_TO?.trim() ||
    process.env.CONTACT_EMAIL?.trim() ||
    gmailUser ||
    smtpUser ||
    "virendrasinghrawaat@gmail.com";

  const fallbackCc =
    configuredTo.toLowerCase() === "skylarkvirendra@gmail.com"
      ? "virendrasinghrawaat@gmail.com"
      : "skylarkvirendra@gmail.com";

  const configuredCc = process.env.INQUIRY_CC?.trim() || fallbackCc;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const fromAddress = process.env.SMTP_FROM?.trim() || `"Xelvion Inquiries" <${smtpUser}>`;
    return {
      provider: "smtp",
      from: fromAddress,
      to: configuredTo,
      cc: configuredCc,
      transporter,
    };
  }

  if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const fromAddress = process.env.SMTP_FROM?.trim() || `"Xelvion Inquiries" <${gmailUser}>`;
    return {
      provider: "gmail",
      from: fromAddress,
      to: configuredTo,
      cc: configuredCc,
      transporter,
    };
  }

  return null;
}

// In-memory rate limiting and deduplication store
interface RateLimitEntry {
  count: number;
  firstRequest: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const recentSubmissions = new Map<string, number>();

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > 10 * 60 * 1000) {
      rateLimitMap.delete(ip);
    }
  }
  for (const [hash, time] of recentSubmissions.entries()) {
    if (now - time > 60 * 1000) {
      recentSubmissions.delete(hash);
    }
  }
}, 15 * 60 * 1000).unref();

function sanitizeHeader(input: string): string {
  return input.replace(/[\r\n\t]/g, " ").trim();
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Safe health check endpoint (exposes zero credentials)
app.get("/api/health", (_req: Request, res: Response): void => {
  const mailConfig = getMailTransport();
  res.status(200).json({
    ok: true,
    emailConfigured: Boolean(mailConfig),
    provider: mailConfig?.provider || "none",
  });
});

// Inquiry API endpoint (supports both guest visitors and signed-in Firebase accounts)
app.post("/api/inquiry", optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown-ip";

    // Rate Limiting: Max 5 inquiries per 10 minutes per IP
    const now = Date.now();
    const rateData = rateLimitMap.get(clientIp);
    if (rateData) {
      if (now - rateData.firstRequest < 10 * 60 * 1000) {
        if (rateData.count >= 5) {
          res.status(429).json({
            error: "Too many inquiries sent from this connection. Please try again after a few minutes or call us directly.",
          });
          return;
        }
        rateData.count += 1;
      } else {
        rateLimitMap.set(clientIp, { count: 1, firstRequest: now });
      }
    } else {
      rateLimitMap.set(clientIp, { count: 1, firstRequest: now });
    }

    // Bot Spam Protection: Check Honeypot fields
    const honeypotCandidates = [
      req.body?.honeypot,
      req.body?.website,
      req.body?.companyWebsiteHoneypot,
    ];
    const triggeredHoneypot = honeypotCandidates.some(
      (val) => typeof val === "string" && val.trim().length > 0
    );
    if (triggeredHoneypot) {
      res.status(200).json({
        success: true,
        referenceId: "XIT-" + Math.floor(100000 + Math.random() * 900000),
        message: "Your inquiry has been received. We will contact you shortly.",
      });
      return;
    }

    // Validate request payload
    const validationResult = inquirySchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "Invalid submission data.";
      res.status(400).json({
        error: firstIssue,
        details: validationResult.error.flatten(),
      });
      return;
    }

    const { name, phone, email, service, message, callbackDay, callbackSlot } = validationResult.data;

    // Deduplication check: prevent accidental double-clicks within 30 seconds
    const submissionHash = `${clientIp}-${name.toLowerCase()}-${phone}-${service}`;
    const lastSubTime = recentSubmissions.get(submissionHash);
    const dedupRef = "XIT-" + Math.floor(100000 + Math.random() * 900000);
    if (lastSubTime && now - lastSubTime < 30 * 1000) {
      res.status(200).json({
        success: true,
        referenceId: dedupRef,
        autoReplySent: false,
        message: "Your inquiry has already been submitted and is currently being processed by our team.",
      });
      return;
    }
    recentSubmissions.set(submissionHash, now);

    // Prepare clean email variables (header-safe)
    const cleanName = sanitizeHeader(name);
    const cleanPhone = sanitizeHeader(phone);
    const cleanEmail = email ? sanitizeHeader(email) : "";
    const cleanService = sanitizeHeader(service);
    const cleanCallbackWindow =
      callbackDay || callbackSlot
        ? sanitizeHeader([callbackDay, callbackSlot].filter(Boolean).join(" / ") + " IST")
        : "Within 4 business hours";
    const referenceId = "XIT-" + Math.floor(100000 + Math.random() * 900000);

    const submissionTimeIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });
    const submissionTimeUTC = new Date().toISOString();

    const textContent = `
NEW WEBSITE INQUIRY — XELVION INNOVA TECH
==================================================
Booking Pass: ${referenceId}
From: ${cleanName}
Phone: ${cleanPhone}
Email: ${cleanEmail || "Not provided"}
Service: ${cleanService}
Preferred Callback: ${cleanCallbackWindow}
Submission Time: ${submissionTimeIST} (IST) / ${submissionTimeUTC}

Requirement Details:
--------------------------------------------------
${message.trim()}
--------------------------------------------------

Consent: DPDP Act 2023 verified (True)
Client IP: ${clientIp}
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; background-color: #FAFAF7; margin: 0; padding: 24px; line-height: 1.5; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 6px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .header { border-bottom: 2px solid #1E40AF; padding-bottom: 14px; margin-bottom: 20px; }
    .title { font-size: 18px; font-weight: 700; color: #1E40AF; margin: 0; }
    .subtitle { font-size: 12px; color: #6B7280; margin-top: 4px; }
    .field-row { margin-bottom: 12px; font-size: 14px; }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; font-weight: 600; display: block; margin-bottom: 2px; }
    .field-value { color: #111827; font-size: 14px; font-weight: 500; }
    .message-box { background: #FAFAF7; border: 1px solid #E5E7EB; border-radius: 4px; padding: 14px; margin-top: 14px; font-size: 14px; white-space: pre-wrap; color: #1F2937; line-height: 1.6; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #F3F4F6; font-size: 11px; color: #9CA3AF; }
    .badge { display: inline-block; background: #EFF6FF; color: #1E40AF; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; border: 1px solid #BFDBFE; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">New Website Inquiry (${escapeHtml(referenceId)})</h1>
      <div class="subtitle">Xelvion Innova Tech Core Private Limited &bull; Inbound Lead</div>
    </div>

    <div class="field-row">
      <span class="field-label">Selected Service</span>
      <span class="badge">${escapeHtml(cleanService)}</span>
    </div>

    <div class="field-row">
      <span class="field-label">Preferred Callback Window</span>
      <span class="field-value">${escapeHtml(cleanCallbackWindow)}</span>
    </div>

    <div class="field-row">
      <span class="field-label">Visitor Name</span>
      <span class="field-value">${escapeHtml(cleanName)}</span>
    </div>

    <div class="field-row">
      <span class="field-label">Phone Number</span>
      <span class="field-value"><a href="tel:${escapeHtml(cleanPhone)}" style="color: #1E40AF; text-decoration: none; font-weight: 600;">${escapeHtml(cleanPhone)}</a></span>
    </div>

    <div class="field-row">
      <span class="field-label">Email Address</span>
      <span class="field-value">
        ${cleanEmail ? `<a href="mailto:${escapeHtml(cleanEmail)}" style="color: #1E40AF; text-decoration: none;">${escapeHtml(cleanEmail)}</a>` : '<span style="color: #9CA3AF;">Not provided</span>'}
      </span>
    </div>

    <div class="field-row">
      <span class="field-label">Inquiry Details</span>
      <div class="message-box">${escapeHtml(message.trim())}</div>
    </div>

    <div class="footer">
      <div>Received: ${submissionTimeIST} (IST)</div>
      <div>DPDP Act 2023 Consent: Confirmed</div>
      <div>Reply directly to this email to contact the visitor if an email was provided.</div>
    </div>
  </div>
</body>
</html>
    `.trim();

    const mailConfig = getMailTransport();
    let dbPersisted = false;
    try {
      await createInquiryDb({
        referenceId,
        userId: req.dbUser?.id ?? null,
        userUid: req.user?.uid ?? null,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        service: cleanService,
        callbackDay: callbackDay || "Today",
        callbackSlot: callbackSlot || "Within 4 business hours",
        message: message.trim(),
      });
      dbPersisted = true;
    } catch (dbErr) {
      console.error("[PostgreSQL Inquiry Persist Warning]", dbErr);
    }

    if (!mailConfig) {
      console.warn(
        `[Email Server Notice] Mail credentials not configured in .env. Inquiry ${referenceId} persisted=${dbPersisted} for ${cleanName} (${cleanPhone}) - Service: ${cleanService}`
      );

      res.status(200).json({
        success: true,
        persisted: dbPersisted,
        simulated: !dbPersisted,
        referenceId,
        autoReplySent: false,
        message: "Thank you. Your consultation request has been logged and routed to our engineering coordination desk.",
      });
      return;
    }

    const mailOptions: SendMailOptions = {
      from: mailConfig.from,
      to: mailConfig.to,
      subject: `New Website Inquiry [${referenceId}]: ${cleanService} - ${cleanName}`,
      text: textContent,
      html: htmlContent,
    };

    if (mailConfig.cc && mailConfig.cc !== mailConfig.to) {
      mailOptions.cc = mailConfig.cc;
    }

    if (cleanEmail) {
      mailOptions.replyTo = `"${cleanName}" <${cleanEmail}>`;
    }

    const sendInfo = await mailConfig.transporter.sendMail(mailOptions);
    console.log(`[Email Sent via ${mailConfig.provider}] Message ID: ${sendInfo.messageId} to ${mailConfig.to}`);

    // Dispatch Branded Customer Auto-Reply Confirmation Email
    let autoReplySent = false;
    if (cleanEmail) {
      try {
        const whatsappText = encodeURIComponent(
          `Namaste Xelvion Team, following up on my Booking Pass ${referenceId} for ${cleanService}.`
        );
        const customerText = `
Namaste ${cleanName},

Thank you for booking an engineering consultation with Xelvion Innova Tech Core Private Limited. Your inquiry has been received and assigned to our senior architecture desk.

CONSULTATION PASS DETAILS
--------------------------------------------------
Booking Reference ID : ${referenceId}
Service Track        : ${cleanService}
Preferred Callback   : ${cleanCallbackWindow}
Contact Number       : ${cleanPhone}
Submitted At         : ${submissionTimeIST} (IST)

WHAT HAPPENS NEXT?
1. 4-Hour Callback: Our senior coordinator will call ${cleanPhone} during your preferred window.
2. Live Bottleneck Audit: We review your workflow files and operational requirements.
3. 48-Hour Written Scope: You receive a clear technical roadmap with a 30-day milestone guarantee.

Need an urgent update?
WhatsApp / Call: +91 82876 43838
Email: virendrasinghrawaat@gmail.com

Warm regards,
Engineering Coordination Desk
Xelvion Innova Tech Core Private Limited
CIN: U62099DL2024PTC428910
        `.trim();

        const customerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1E1E; background-color: #F4F7EE; margin: 0; padding: 24px; line-height: 1.55; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #D9E5C3; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06); }
    .top-banner { background: #1E1E1E; padding: 24px 28px; border-bottom: 4px solid #84CC16; color: #FFFFFF; }
    .brand { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0; color: #FFFFFF; }
    .brand-sub { font-size: 11px; color: #A3E635; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4px; }
    .body-pad { padding: 28px; }
    .greeting { font-size: 16px; font-weight: 700; color: #1E1E1E; margin: 0 0 10px 0; }
    .intro { font-size: 14px; color: #475569; margin: 0 0 20px 0; }
    .pass-box { background: #F8FBF2; border: 1px solid #CBE0A4; border-radius: 10px; padding: 18px; margin-bottom: 22px; }
    .pass-id { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 18px; font-weight: 800; color: #1E40AF; margin-top: 2px; }
    .grid-row { margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 13px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; font-weight: 700; display: block; }
    .val { font-weight: 600; color: #0F172A; margin-top: 2px; display: block; }
    .steps-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #1E1E1E; font-weight: 800; margin: 0 0 10px 0; }
    .step-item { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; font-size: 13px; color: #334155; }
    .cta-row { margin-top: 22px; text-align: center; }
    .wa-btn { display: inline-block; background: #16A34A; color: #FFFFFF !important; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 8px; }
    .footer { background: #F8FAFC; padding: 18px 28px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-banner">
      <div class="brand">Xelvion Innova Tech</div>
      <div class="brand-sub">Consultation Pass Confirmed / 30-Day Milestone Guarantee</div>
    </div>
    <div class="body-pad">
      <p class="greeting">Namaste ${escapeHtml(cleanName)},</p>
      <p class="intro">
        Thank you for reaching out to <strong>Xelvion Innova Tech Core Private Limited</strong>. Your consultation request is confirmed and assigned to our senior engineering coordination desk.
      </p>

      <div class="pass-box">
        <span class="label">Official Booking Pass ID</span>
        <div class="pass-id">${escapeHtml(referenceId)}</div>

        <div class="grid-row">
          <span class="label">Selected Service Track</span>
          <span class="val">${escapeHtml(cleanService)}</span>
        </div>

        <div class="grid-row">
          <span class="label">Preferred Callback Window</span>
          <span class="val">${escapeHtml(cleanCallbackWindow)} (on ${escapeHtml(cleanPhone)})</span>
        </div>
      </div>

      <p class="steps-title">What Happens Next</p>
      <div class="step-item"><strong>01. 4-Hour Callback:</strong> Our engineering coordinator will contact you at ${escapeHtml(cleanPhone)}.</div>
      <div class="step-item"><strong>02. Bottleneck Audit:</strong> We inspect your workflow files and operational goals without sales fluff.</div>
      <div class="step-item"><strong>03. 48-Hour Written Scope:</strong> You receive a clear technical milestone specification at zero cost.</div>

      <div class="cta-row">
        <a class="wa-btn" href="https://wa.me/918287643838?text=${whatsappText}" target="_blank" rel="noopener noreferrer">
          Fast-Track on WhatsApp (+91 82876 43838)
        </a>
      </div>
    </div>
    <div class="footer">
      <div><strong>Xelvion Innova Tech Core Private Limited</strong> (CIN: U62099DL2024PTC428910)</div>
      <div>Bengaluru HQ &bull; New Delhi Hub &bull; Direct Desk: +91 82876 43838 / virendrasinghrawaat@gmail.com</div>
    </div>
  </div>
</body>
</html>
        `.trim();

        const replyInfo = await mailConfig.transporter.sendMail({
          from: mailConfig.from,
          to: cleanEmail,
          replyTo: mailConfig.to,
          subject: `Consultation Confirmed [${referenceId}] — Xelvion Innova Tech`,
          text: customerText,
          html: customerHtml,
        });
        autoReplySent = true;
        console.log(`[Customer Auto-Reply Sent] Message ID: ${replyInfo.messageId} to ${cleanEmail}`);
      } catch (autoReplyErr) {
        console.warn("[Customer Auto-Reply Warning] Failed to deliver confirmation to visitor:", autoReplyErr);
      }
    }

    res.status(200).json({
      success: true,
      referenceId,
      autoReplySent,
      message: "Thank you. Your inquiry has been sent to our team. We will review it and get back to you shortly.",
    });
  } catch (error: unknown) {
    console.error("[Email API Error]", error);
    res.status(500).json({
      error: "We could not dispatch your email right now. Please call or WhatsApp us directly at +91 82876 43838.",
    });
  }
});

// Dedicated Test Email Endpoint to verify delivery to .env configured inbox
app.post("/api/send-test-email", async (_req: Request, res: Response): Promise<void> => {
  try {
    const mailConfig = getMailTransport();
    if (!mailConfig) {
      res.status(400).json({
        success: false,
        error: "Email credentials not configured. Set GMAIL_USER + GMAIL_APP_PASSWORD or SMTP_HOST + SMTP_USER + SMTP_PASS in .env.",
      });
      return;
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const info = await mailConfig.transporter.sendMail({
      from: mailConfig.from,
      to: mailConfig.to,
      ...(mailConfig.cc && mailConfig.cc !== mailConfig.to ? { cc: mailConfig.cc } : {}),
      subject: `Test Message from Website: Email System Verified (${timestamp})`,
      text: `Hello,\n\nThis test confirms your Nodemailer setup is connected and delivering website inquiries.\n\nTime: ${timestamp} IST\nRecipient: ${mailConfig.to}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-bottom: 6px;">Xelvion Innova Tech Core Private Limited</h2>
          <p style="color: #64748b; font-size: 13px; margin: 0 0 16px 0;">Website Inquiry Email Verification</p>
          <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            Your Nodemailer integration is active. Website contact form submissions are emailed directly to <strong>${escapeHtml(mailConfig.to)}</strong>.
          </p>
          <p style="font-size: 12px; color: #64748b;">Timestamp: ${timestamp} IST</p>
        </div>
      `,
    });

    console.log(`[Test Email Sent] Message ID: ${info.messageId} to ${mailConfig.to}`);
    res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: `Test email successfully sent to ${mailConfig.to}!`,
    });
  } catch (error: unknown) {
    console.error("[Test Email Error]", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      error: "Failed to dispatch test email: " + msg,
    });
  }
});

const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required.").max(80),
  companyName: z.string().trim().max(100).optional().default(""),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number characters.")
    .optional()
    .default(""),
});

const leadStatusSchema = z.object({
  status: z.enum(["New", "Contacted", "Won", "Lost"]),
});

const leadNoteSchema = z.object({
  note: z.string().trim().min(1, "Note cannot be empty.").max(500),
});

const projectUpdateSchema = z.object({
  content: z.string().trim().min(2, "Update text is required.").max(1000),
  progress: z.number().min(0).max(100),
});

// Authenticated User Profile & Consultation History Routes (PostgreSQL)
app.get("/api/me", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.dbUser) {
      res.status(404).json({ error: "User record not found." });
      return;
    }
    res.json({ user: req.dbUser });
  } catch (error: unknown) {
    console.error("Failed to fetch /api/me:", error);
    res.status(500).json({ error: "Failed to load account profile." });
  }
});

app.patch("/api/me", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid profile update." });
      return;
    }

    const updated = await updateUserProfileDb(req.user!.uid, parsed.data);
    if (!updated) {
      res.status(404).json({ error: "User profile not found." });
      return;
    }
    res.json({ user: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update profile.";
    res.status(500).json({ error: msg });
  }
});

app.get("/api/my-inquiries", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rows = await getInquiriesByUserUidDb(req.user!.uid);
    res.json({ inquiries: rows });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch consultations.";
    res.status(500).json({ error: msg });
  }
});

// Protected Admin Console API Routes (PostgreSQL)
app.get("/api/admin/overview", requireAuth, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [leads, projectData, clients] = await Promise.all([
      getAllInquiriesDb(),
      getProjectsWithUpdatesDb(),
      getAllUsersDb(),
    ]);
    res.json({
      leads,
      projects: projectData.projects,
      updates: projectData.updates,
      clients,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load admin overview.";
    res.status(500).json({ error: msg });
  }
});

app.patch("/api/admin/inquiries/:referenceId/status", requireAuth, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = leadStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid lead status." });
      return;
    }
    const updated = await updateInquiryStatusDb(req.params.referenceId, parsed.data.status);
    if (!updated) {
      res.status(404).json({ error: "Lead not found." });
      return;
    }
    res.json({ referenceId: updated.referenceId, status: updated.status });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update status.";
    res.status(500).json({ error: msg });
  }
});

app.post("/api/admin/inquiries/:referenceId/notes", requireAuth, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = leadNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid note." });
      return;
    }
    const updated = await addInquiryNoteDb(req.params.referenceId, parsed.data.note);
    if (!updated) {
      res.status(404).json({ error: "Lead not found." });
      return;
    }
    res.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to add note.";
    res.status(500).json({ error: msg });
  }
});

app.patch("/api/admin/projects/:slug/milestones/:milestoneId", requireAuth, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await toggleProjectMilestoneDb(req.params.slug, req.params.milestoneId);
    if (!result) {
      res.status(404).json({ error: "Project not found." });
      return;
    }
    res.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to toggle milestone.";
    res.status(500).json({ error: msg });
  }
});

app.post("/api/admin/projects/:slug/updates", requireAuth, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = projectUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid update payload." });
      return;
    }
    const authorName =
      req.dbUser?.displayName || req.user?.name || req.user?.email || "Xelvion Admin";
    const result = await addProjectUpdateDb({
      slug: req.params.slug,
      authorName,
      content: parsed.data.content,
      progress: parsed.data.progress,
    });
    if (!result) {
      res.status(404).json({ error: "Project not found." });
      return;
    }
    res.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to log project update.";
    res.status(500).json({ error: msg });
  }
});
