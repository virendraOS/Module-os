import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  companyName: text("company_name"),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  role: text("role").notNull().default("client"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  referenceId: text("reference_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  userUid: text("user_uid"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  service: text("service").notNull(),
  callbackDay: text("callback_day").notNull().default("Today"),
  callbackSlot: text("callback_slot").notNull().default("10 AM – 1 PM"),
  message: text("message").notNull(),
  status: text("status").notNull().default("New"),
  notesJson: text("notes_json").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientCompany: text("client_company").notNull(),
  title: text("title").notNull(),
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  status: text("status").notNull().default("Active"),
  progress: integer("progress").notNull().default(0),
  nextMilestone: text("next_milestone").notNull(),
  lastUpdated: text("last_updated").notNull(),
  startDate: text("start_date").notNull(),
  targetDueDate: text("target_due_date").notNull(),
  phasesJson: text("phases_json").notNull().default("[]"),
  milestonesJson: text("milestones_json").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectUpdates = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  type: text("type").notNull().default("update"),
  content: text("content").notNull(),
  timestampLabel: text("timestamp_label").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  inquiries: many(inquiries),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(users, {
    fields: [inquiries.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  updates: many(projectUpdates),
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, {
    fields: [projectUpdates.projectId],
    references: [projects.id],
  }),
}));
