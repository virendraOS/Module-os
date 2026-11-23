import React, { useState, useEffect, useCallback } from "react";
import {
  ProjectData,
  LeadItem,
  ActivityUpdate,
  INITIAL_PROJECTS,
  INITIAL_LEADS,
  INITIAL_UPDATES,
} from "../data/portalStore";
import { OWNER_CONFIG } from "../data/companyConfig";
import { BrandLogo } from "./BrandLogo";
import { useAuth } from "../contexts/AuthContext";
import { PWAInstallButton } from "./PWAInstallButton";

interface AdminPanelProps {
  onBackToWebsite: () => void;
}

interface RegisteredClientRow {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  companyName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToWebsite,
}) => {
  const { getAuthToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "projects" | "clients">("overview");

  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  const [updates, setUpdates] = useState<ActivityUpdate[]>(INITIAL_UPDATES);
  const [clients, setClients] = useState<RegisteredClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "proj-101");
  const [updateText, setUpdateText] = useState("");
  const [newProgress, setNewProgress] = useState(projects[0]?.progress || 68);
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setActionError("");
    try {
      const token = await getAuthToken();
      if (!token) return;
      const res = await fetch("/api/admin/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Unable to load dashboard records.");
      }
      const data = await res.json();
      if (Array.isArray(data.leads)) setLeads(data.leads);
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects);
        setSelectedProjectId((curr) =>
          data.projects.some((p: ProjectData) => p.id === curr)
            ? curr
            : data.projects[0].id
        );
        const activeProj =
          data.projects.find((p: ProjectData) => p.id === selectedProjectId) ||
          data.projects[0];
        if (activeProj) setNewProgress(activeProj.progress);
      }
      if (Array.isArray(data.updates)) setUpdates(data.updates);
      if (Array.isArray(data.clients)) setClients(data.clients);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Could not load records."
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, selectedProjectId]);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleLeadStatusChange = async (leadId: string, status: LeadItem["status"]) => {
    setActionError("");
    const previous = leads;
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));

    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(leadId)}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Could not update status.");
      }
    } catch (err: unknown) {
      setLeads(previous);
      setActionError(err instanceof Error ? err.message : "Failed to update lead status.");
    }
  };

  const handleAddLeadNote = async (leadId: string) => {
    const note = leadNotes[leadId];
    if (!note || !note.trim()) return;
    setActionError("");

    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(leadId)}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ note: note.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Could not save note.");
      }
      const data = await res.json();
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, notes: data.notes || l.notes } : l))
      );
      setLeadNotes((prev) => ({ ...prev, [leadId]: "" }));
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to save note.");
    }
  };

  const handlePushUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim() || !activeProject) return;
    setActionError("");

    try {
      const token = await getAuthToken();
      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(activeProject.id)}/updates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            content: updateText.trim(),
            progress: newProgress,
          }),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Could not publish project update.");
      }
      const saved = await res.json();
      setUpdates((prev) => [saved, ...prev]);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? { ...p, progress: saved.progress ?? newProgress, lastUpdated: "Just now" }
            : p
        )
      );
      setUpdateText("");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to save project update.");
    }
  };

  const handleToggleMilestone = async (milestoneId: string) => {
    if (!activeProject) return;
    setActionError("");

    try {
      const token = await getAuthToken();
      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(activeProject.id)}/milestones/${encodeURIComponent(milestoneId)}`,
        {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Could not toggle milestone.");
      }
      const data = await res.json();
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                milestones: data.milestones || p.milestones,
                progress: typeof data.progress === "number" ? data.progress : p.progress,
                lastUpdated: data.lastUpdated || "Just now",
              }
            : p
        )
      );
      if (typeof data.progress === "number") {
        setNewProgress(data.progress);
      }
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to toggle milestone.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Admin Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              ← Back to Website
            </button>
            <div className="border-l border-slate-200 dark:border-slate-700 pl-3 flex items-center gap-2.5">
              <BrandLogo size="sm" />
              <div>
                <span className="font-bold text-sm block text-slate-900 dark:text-white">Admin Console</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {OWNER_CONFIG.companyName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <span className="text-xs text-slate-500 dark:text-slate-400">Refreshing...</span>
            )}
            <PWAInstallButton variant="admin" />
          </div>
        </div>
      </header>

      {/* Admin Subnav */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto py-2.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-1 transition-colors ${activeTab === "overview" ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-1 transition-colors ${activeTab === "leads" ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-1 transition-colors ${activeTab === "projects" ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`pb-1 transition-colors ${activeTab === "clients" ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
          >
            Accounts ({clients.length})
          </button>
        </div>
      </div>

      {/* Admin Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {actionError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
            {actionError}
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Active Projects</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{projects.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Inbound Leads</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{leads.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase block">New Leads Pending Call</span>
                <span className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400">
                  {leads.filter((l) => l.status === "New").length}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Inbound Submissions</h3>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {leads.slice(0, 5).map((l) => (
                  <div key={l.id} className="py-2.5 flex justify-between items-center gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{l.name}</span> · {l.phone} · <span className="text-blue-700 dark:text-blue-400">{l.service}</span>
                    </div>
                    <span className="font-mono text-slate-500 dark:text-slate-400">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LEADS TABLE */}
        {activeTab === "leads" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Contact Form Submissions</h3>
              <span className="text-slate-500 dark:text-slate-400 font-mono">Count: {leads.length}</span>
            </div>

            <div className="space-y-4">
              {leads.map((l) => (
                <div key={l.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{l.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-2">Phone: {l.phone}</span>
                      <span className="text-blue-700 dark:text-blue-400 ml-2 font-medium">Service: {l.service}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Status:</span>
                      <select
                        value={l.status}
                        onChange={(e) => void handleLeadStatusChange(l.id, e.target.value as LeadItem["status"])}
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 text-xs"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800 rounded whitespace-pre-wrap">
                    {l.message}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">Notes:</span>
                    {l.notes?.map((n, idx) => (
                      <div key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-300 dark:border-slate-700">
                        {n}
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add note..."
                        value={leadNotes[l.id] || ""}
                        onChange={(e) => setLeadNotes({ ...leadNotes, [l.id]: e.target.value })}
                        className="flex-1 p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs"
                      />
                      <button
                        onClick={() => void handleAddLeadNote(l.id)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-xs font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && activeProject && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Select project:</span>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setNewProgress(p.progress);
                  }}
                  className={`w-full text-left p-3 rounded-xl border ${p.id === activeProject.id ? "bg-white dark:bg-slate-900 border-blue-600" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"}`}
                >
                  <span className="font-bold block text-slate-900 dark:text-white">{p.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{p.clientCompany} · {p.progress}%</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{activeProject.title}</h3>
                <span className="text-slate-500 dark:text-slate-400">{activeProject.clientCompany}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Sprint progress:</span>
                  <span className="font-mono text-blue-700 dark:text-blue-400">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Milestones (click to toggle Done / In progress):</span>
                {activeProject.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => void handleToggleMilestone(m.id)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white">{m.title}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Due: {m.dueDate}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.status === "Done" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"}`}>
                      {m.status} (toggle)
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePushUpdate} className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Log internal project update:</span>
                <textarea
                  rows={2}
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  placeholder="e.g. Staging build verified with offline driver cache..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-medium text-xs"
                >
                  Save update
                </button>
              </form>

              {updates.filter((u) => u.projectId === activeProject.id).length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Recent updates:</span>
                  {updates
                    .filter((u) => u.projectId === activeProject.id)
                    .map((u) => (
                      <div key={u.id} className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{u.authorName}</span>
                          <span>{u.timestamp}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{u.content}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTERED ACCOUNTS */}
        {activeTab === "clients" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Registered Accounts</h3>
            {clients.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No verified user accounts have signed in yet.</p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {clients.map((c) => (
                  <div key={c.id} className="py-3 flex justify-between items-center gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {c.displayName || c.email}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {c.companyName ? `${c.companyName} · ` : ""}{c.email}{c.phone ? ` · ${c.phone}` : ""}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
