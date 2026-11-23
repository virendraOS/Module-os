import type { Request, Response, NextFunction } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "../lib/firebase-admin.ts";
import { getOrCreateUser, isAdminEmail } from "../db/users.ts";

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: {
    id: number;
    uid: string;
    email: string;
    displayName: string | null;
    companyName: string | null;
    phone: string | null;
    photoUrl: string | null;
    role: string;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];
  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  try {
    if (decodedToken.uid && decodedToken.email) {
      const dbUser = await getOrCreateUser(
        decodedToken.uid,
        decodedToken.email,
        typeof decodedToken.name === "string" ? decodedToken.name : null,
        typeof decodedToken.picture === "string" ? decodedToken.picture : null
      );
      req.dbUser = dbUser;
    }
    return next();
  } catch (error: unknown) {
    console.error("Error synchronizing user profile with database:", error);
    return res.status(500).json({ error: "Account synchronization failed. Please try again." });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    if (decodedToken.uid && decodedToken.email) {
      req.dbUser = await getOrCreateUser(
        decodedToken.uid,
        decodedToken.email,
        typeof decodedToken.name === "string" ? decodedToken.name : null,
        typeof decodedToken.picture === "string" ? decodedToken.picture : null
      );
    }
  } catch (error) {
    console.warn("Optional auth verification skipped due to invalid token or DB sync issue:", error);
  }
  return next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const emailVerified = req.user?.email_verified === true;
  if (!req.user || !emailVerified || !isAdminEmail(req.user.email)) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  return next();
};
