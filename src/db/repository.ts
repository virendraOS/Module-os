import { desc, eq } from "drizzle-orm";
import { db } from "./index.ts";
import { inquiries, projects, projectUpdates } from "./schema.ts";
import {
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_UPDATES,
  type LeadItem,
  type MilestoneItem,
  type PhaseItem,
} from "../data/portalStore.ts";

function safeParseJsonArray<T>(raw: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export async function createInquiryDb(input: {
  referenceId: string;
  userId?: number | null;
  userUid?: string | null;
  name: string;
  phone: string;
  email?: string;
  service: string;
  callbackDay?: string;
  callbackSlot?: string;
  message: string;
}) {
  try {
    const initialNote = `Ref ID: ${input.referenceId}. Callback: ${
      input.callbackDay || "Today"
    } (${input.callbackSlot || "Within 4 business hours"}).`;

    const result = await db
      .insert(inquiries)
      .values({
        referenceId: input.referenceId,
        userId: input.userId ?? null,
        userUid: input.userUid ?? null,
        name: input.name,
        phone: input.phone,
        email: input.email || "",
        service: input.service,
        callbackDay: input.callbackDay || "Today",
        callbackSlot: input.callbackSlot || "Within 4 business hours",
        message: input.message,
        status: "New",
        notesJson: JSON.stringify([initialNote]),
      })
      .onConflictDoNothing({ target: inquiries.referenceId })
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error("Failed to persist inquiry to PostgreSQL:", error);
    throw new Error("Could not store consultation record. Please try again later.", {
      cause: error,
    });
  }
}

export async function getInquiriesByUserUidDb(uid: string) {
  try {
    const rows = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.userUid, uid))
      .orderBy(desc(inquiries.createdAt));

    return rows.map((row) => ({
      id: row.referenceId,
      referenceId: row.referenceId,
      name: row.name,
      phone: row.phone,
      email: row.email,
      service: row.service,
      callbackDay: row.callbackDay,
      callbackSlot: row.callbackSlot,
      message: row.message,
      status: row.status as LeadItem["status"],
      notes: safeParseJsonArray<string>(row.notesJson),
      createdAt: row.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch user inquiries from PostgreSQL:", error);
    throw new Error("Failed to fetch consultations. Please try again later.", {
      cause: error,
    });
  }
}

export async function ensureSeedInquiriesIfEmpty() {
  try {
    const existing = await db.select({ id: inquiries.id }).from(inquiries).limit(1);
    if (existing.length > 0) return;

    for (const lead of INITIAL_LEADS) {
      await db
        .insert(inquiries)
        .values({
          referenceId: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          service: lead.service,
          callbackDay: "Today",
          callbackSlot: "10 AM – 1 PM",
          message: lead.message,
          status: lead.status,
          notesJson: JSON.stringify(lead.notes || []),
        })
        .onConflictDoNothing({ target: inquiries.referenceId });
    }
  } catch (error) {
    console.error("Failed to seed inquiries:", error);
    throw new Error("Failed to initialize leads repository.", { cause: error });
  }
}

export async function getAllInquiriesDb() {
  try {
    await ensureSeedInquiriesIfEmpty();
    const rows = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));

    return rows.map((row) => ({
      id: row.referenceId,
      referenceId: row.referenceId,
      name: row.name,
      phone: row.phone,
      email: row.email,
      service: row.service,
      callbackDay: row.callbackDay,
      callbackSlot: row.callbackSlot,
      message: row.message,
      status: row.status as LeadItem["status"],
      notes: safeParseJsonArray<string>(row.notesJson),
      createdAt: row.createdAt.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));
  } catch (error) {
    console.error("Failed to fetch all inquiries:", error);
    throw new Error("Failed to load leads. Please try again later.", {
      cause: error,
    });
  }
}

export async function updateInquiryStatusDb(
  referenceId: string,
  status: LeadItem["status"]
) {
  try {
    const updated = await db
      .update(inquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(inquiries.referenceId, referenceId))
      .returning();

    return updated[0] || null;
  } catch (error) {
    console.error("Failed to update inquiry status:", error);
    throw new Error("Failed to update lead status. Please try again later.", {
      cause: error,
    });
  }
}

export async function addInquiryNoteDb(referenceId: string, note: string) {
  try {
    const rows = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.referenceId, referenceId))
      .limit(1);

    if (!rows[0]) return null;

    const currentNotes = safeParseJsonArray<string>(rows[0].notesJson);
    const stampedNote = `${new Date().toLocaleDateString("en-IN")}: ${note.trim()}`;
    const nextNotes = [...currentNotes, stampedNote];

    const updated = await db
      .update(inquiries)
      .set({
        notesJson: JSON.stringify(nextNotes),
        updatedAt: new Date(),
      })
      .where(eq(inquiries.referenceId, referenceId))
      .returning();

    return updated[0]
      ? {
          id: updated[0].referenceId,
          notes: nextNotes,
        }
      : null;
  } catch (error) {
    console.error("Failed to add inquiry note:", error);
    throw new Error("Failed to save lead note. Please try again later.", {
      cause: error,
    });
  }
}

export async function ensureSeedProjectsIfEmpty() {
  try {
    const existing = await db.select({ id: projects.id }).from(projects).limit(1);
    if (existing.length > 0) return;

    const slugToId = new Map<string, number>();

    for (const proj of INITIAL_PROJECTS) {
      const inserted = await db
        .insert(projects)
        .values({
          slug: proj.id,
          clientName: proj.clientName,
          clientEmail: proj.clientEmail,
          clientCompany: proj.clientCompany,
          title: proj.title,
          serviceId: proj.serviceId,
          serviceName: proj.serviceName,
          status: proj.status,
          progress: proj.progress,
          nextMilestone: proj.nextMilestone,
          lastUpdated: proj.lastUpdated,
          startDate: proj.startDate,
          targetDueDate: proj.targetDueDate,
          phasesJson: JSON.stringify(proj.phases),
          milestonesJson: JSON.stringify(proj.milestones),
        })
        .onConflictDoNothing({ target: projects.slug })
        .returning({ id: projects.id, slug: projects.slug });

      if (inserted[0]) {
        slugToId.set(inserted[0].slug, inserted[0].id);
      }
    }

    for (const upd of INITIAL_UPDATES) {
      const dbProjectId = slugToId.get(upd.projectId);
      if (dbProjectId) {
        await db.insert(projectUpdates).values({
          projectId: dbProjectId,
          authorName: upd.authorName,
          authorRole: upd.authorRole,
          type: upd.type,
          content: upd.content,
          timestampLabel: upd.timestamp,
        });
      }
    }
  } catch (error) {
    console.error("Failed to seed initial projects:", error);
    throw new Error("Failed to initialize project records.", { cause: error });
  }
}

export async function getProjectsWithUpdatesDb() {
  try {
    await ensureSeedProjectsIfEmpty();
    const projectRows = await db.select().from(projects).orderBy(projects.id);
    const updateRows = await db
      .select()
      .from(projectUpdates)
      .orderBy(desc(projectUpdates.createdAt));

    return {
      projects: projectRows.map((row) => ({
        id: row.slug,
        clientId: row.slug,
        clientName: row.clientName,
        clientEmail: row.clientEmail,
        clientCompany: row.clientCompany,
        title: row.title,
        serviceId: row.serviceId,
        serviceName: row.serviceName,
        status: row.status as "Active" | "Completed" | "In Review",
        progress: row.progress,
        nextMilestone: row.nextMilestone,
        lastUpdated: row.lastUpdated,
        startDate: row.startDate,
        targetDueDate: row.targetDueDate,
        phases: safeParseJsonArray<PhaseItem>(row.phasesJson),
        milestones: safeParseJsonArray<MilestoneItem>(row.milestonesJson),
      })),
      updates: updateRows.map((u) => {
        const parentProj = projectRows.find((p) => p.id === u.projectId);
        return {
          id: `upd-${u.id}`,
          projectId: parentProj?.slug || String(u.projectId),
          authorName: u.authorName,
          authorRole: u.authorRole as
            | "Xelvion Lead Engineer"
            | "Xelvion DevOps"
            | "Client Coordinator"
            | "Admin",
          type: u.type as "update" | "milestone" | "file" | "message",
          content: u.content,
          timestamp: u.timestampLabel,
        };
      }),
    };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw new Error("Failed to fetch engineering projects. Please try again later.", {
      cause: error,
    });
  }
}

export async function toggleProjectMilestoneDb(slug: string, milestoneId: string) {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);

    const project = rows[0];
    if (!project) return null;

    const currentMilestones = safeParseJsonArray<MilestoneItem>(project.milestonesJson);
    const nextMilestones = currentMilestones.map((m) => {
      if (m.id !== milestoneId) return m;
      const nextStatus: MilestoneItem["status"] =
        m.status === "Done"
          ? "In progress"
          : m.status === "In progress"
            ? "Done"
            : "In progress";
      return {
        ...m,
        status: nextStatus,
        completedAt: nextStatus === "Done" ? "Just now" : undefined,
      };
    });

    const doneCount = nextMilestones.filter((m) => m.status === "Done").length;
    const autoProgress =
      nextMilestones.length > 0
        ? Math.round((doneCount / nextMilestones.length) * 100)
        : project.progress;

    const updated = await db
      .update(projects)
      .set({
        milestonesJson: JSON.stringify(nextMilestones),
        progress: autoProgress,
        lastUpdated: "Just now",
        updatedAt: new Date(),
      })
      .where(eq(projects.id, project.id))
      .returning();

    return {
      progress: updated[0].progress,
      milestones: nextMilestones,
      lastUpdated: updated[0].lastUpdated,
    };
  } catch (error) {
    console.error("Failed to toggle project milestone:", error);
    throw new Error("Failed to update project milestone. Please try again later.", {
      cause: error,
    });
  }
}

export async function addProjectUpdateDb(input: {
  slug: string;
  authorName: string;
  content: string;
  progress: number;
}) {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, input.slug))
      .limit(1);

    const project = rows[0];
    if (!project) return null;

    const timestampLabel = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const insertedUpdate = await db
      .insert(projectUpdates)
      .values({
        projectId: project.id,
        authorName: input.authorName,
        authorRole: "Admin",
        type: "update",
        content: input.content,
        timestampLabel,
      })
      .returning();

    const safeProgress = Math.max(0, Math.min(100, Math.round(input.progress)));
    await db
      .update(projects)
      .set({
        progress: safeProgress,
        lastUpdated: "Just now",
        updatedAt: new Date(),
      })
      .where(eq(projects.id, project.id));

    return {
      id: `upd-${insertedUpdate[0].id}`,
      projectId: project.slug,
      authorName: insertedUpdate[0].authorName,
      authorRole: "Admin" as const,
      type: "update" as const,
      content: insertedUpdate[0].content,
      timestamp: insertedUpdate[0].timestampLabel,
      progress: safeProgress,
    };
  } catch (error) {
    console.error("Failed to log project update:", error);
    throw new Error("Failed to save project update. Please try again later.", {
      cause: error,
    });
  }
}
