import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

function resolveFirebaseProjectId(): string | undefined {
  if (process.env.FIREBASE_PROJECT_ID?.trim()) {
    return process.env.FIREBASE_PROJECT_ID.trim();
  }

  const candidatePaths = [
    path.resolve(process.cwd(), "firebase-applet-config.json"),
    path.resolve(process.cwd(), "..", "..", "firebase-applet-config.json"),
  ];

  for (const configPath of candidatePaths) {
    try {
      if (fs.existsSync(configPath)) {
        const parsed = JSON.parse(fs.readFileSync(configPath, "utf-8")) as {
          projectId?: string;
        };
        if (parsed.projectId) {
          return parsed.projectId;
        }
      }
    } catch {
      // Try next path or environment fallback
    }
  }

  return process.env.GOOGLE_CLOUD_PROJECT?.trim() || undefined;
}

if (!getApps().length) {
  const projectId = resolveFirebaseProjectId();
  initializeApp(projectId ? { projectId } : undefined);
}

export const adminAuth = getAuth();
