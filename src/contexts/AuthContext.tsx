import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';

export const ADMIN_EMAIL = 'skylarkvirendra@gmail.com';
export const ADMIN_EMAILS = [
  'skylarkvirendra@gmail.com',
  'virendrasinghrawaat@gmail.com',
] as const;

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail === normalized);
}

// Schema limits synchronized verbatim with firebase-blueprint.json
export const USER_PROFILE_LIMITS = {
  displayNameMin: 1,
  displayNameMax: 80,
  companyNameMax: 100,
  phoneMax: 20,
  phonePattern: /^[0-9+\-\s()]*$/,
  photoUrlMax: 500,
  emailMax: 160,
} as const;

export const CONSULTATION_LIMITS = {
  referenceIdMin: 3,
  referenceIdMax: 64,
  serviceTitleMax: 100,
  callbackDayMax: 40,
  callbackSlotMax: 60,
  phoneMax: 25,
  messageMax: 1500,
} as const;

export const BOOKMARK_LIMITS = {
  serviceIdMax: 128,
  serviceTitleMax: 100,
  categoryMax: 80,
} as const;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  companyName?: string;
  phone?: string;
}

export interface UserConsultationRecord {
  uid: string;
  referenceId: string;
  serviceTitle: string;
  callbackDay: string;
  callbackSlot: string;
  phone: string;
  message: string;
  status: 'New' | 'Contacted' | 'Won' | 'Lost';
  createdAtMs: number;
}

export interface ServiceBookmarkRecord {
  uid: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  createdAtMs: number;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  authReady: boolean;
  isAdmin: boolean;
  consultations: UserConsultationRecord[];
  bookmarks: ServiceBookmarkRecord[];
  getAuthToken: () => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  updateProfileDetails: (updates: {
    displayName: string;
    companyName?: string;
    phone?: string;
  }) => Promise<void>;
  saveConsultationToUserHistory: (input: {
    referenceId: string;
    serviceTitle: string;
    callbackDay: string;
    callbackSlot: string;
    phone: string;
    message: string;
  }) => Promise<void>;
  toggleServiceBookmark: (service: {
    id: string;
    title: string;
    category: string;
  }) => Promise<boolean>;
  isServiceBookmarked: (serviceId: string) => boolean;
  refreshUserConsultationsFromSql: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toTimestampMs(val: unknown): number {
  if (val && typeof val === 'object' && 'toMillis' in val && typeof (val as Timestamp).toMillis === 'function') {
    return (val as Timestamp).toMillis();
  }
  if (typeof val === 'string') {
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }
  return Date.now();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileReadyUid, setProfileReadyUid] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [firestoreConsultations, setFirestoreConsultations] = useState<UserConsultationRecord[]>([]);
  const [sqlConsultations, setSqlConsultations] = useState<UserConsultationRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<ServiceBookmarkRecord[]>([]);

  const isAdmin = Boolean(
    user && user.emailVerified && isAdminEmail(user.email)
  );

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    const activeUser = auth.currentUser;
    if (!activeUser) return null;
    try {
      return await activeUser.getIdToken();
    } catch {
      return null;
    }
  }, []);

  const syncWithBackendSql = useCallback(async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken();
      const [meRes, inqRes] = await Promise.all([
        fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/my-inquiries', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (meRes.ok) {
        const meJson = await meRes.json();
        const sqlUser = meJson?.user;
        if (sqlUser) {
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  companyName: prev.companyName || sqlUser.companyName || undefined,
                  phone: prev.phone || sqlUser.phone || undefined,
                }
              : prev
          );
        }
      }

      if (inqRes.ok) {
        const inqJson = await inqRes.json();
        const rows = Array.isArray(inqJson?.inquiries) ? inqJson.inquiries : [];
        setSqlConsultations(
          rows.map((r: Record<string, unknown>) => ({
            uid: firebaseUser.uid,
            referenceId: String(r.referenceId || r.id || ''),
            serviceTitle: String(r.service || ''),
            callbackDay: String(r.callbackDay || 'Today'),
            callbackSlot: String(r.callbackSlot || 'Within 4 business hours'),
            phone: String(r.phone || ''),
            message: String(r.message || ''),
            status: (r.status as UserConsultationRecord['status']) || 'New',
            createdAtMs: toTimestampMs(r.createdAt),
          }))
        );
      }
    } catch {
      // Backend sync remains resilient without blocking UI interaction
    }
  }, []);

  const refreshUserConsultationsFromSql = useCallback(async () => {
    const activeUser = auth.currentUser;
    if (!activeUser) return;
    await syncWithBackendSql(activeUser);
  }, [syncWithBackendSql]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setProfileReadyUid(null);
        setFirestoreConsultations([]);
        setSqlConsultations([]);
        setBookmarks([]);
        setAuthReady(true);
        return;
      }

      const userPath = `users/${firebaseUser.uid}`;
      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            uid: data.uid,
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            companyName: data.companyName,
            phone: data.phone,
          });
          setProfileReadyUid(firebaseUser.uid);
        } else if (firebaseUser.email && firebaseUser.emailVerified) {
          const safeDisplayName = (
            firebaseUser.displayName ||
            firebaseUser.email.split('@')[0] ||
            'User'
          )
            .trim()
            .slice(0, USER_PROFILE_LIMITS.displayNameMax);

          const safePhoto =
            firebaseUser.photoURL &&
            firebaseUser.photoURL.length <= USER_PROFILE_LIMITS.photoUrlMax
              ? firebaseUser.photoURL
              : undefined;

          const newProfilePayload: Record<string, unknown> = {
            uid: firebaseUser.uid,
            email: firebaseUser.email.slice(0, USER_PROFILE_LIMITS.emailMax),
            displayName: safeDisplayName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          if (safePhoto) {
            newProfilePayload.photoURL = safePhoto;
          }

          await setDoc(doc(db, 'users', firebaseUser.uid), newProfilePayload);
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: safeDisplayName,
            photoURL: safePhoto,
          });
          setProfileReadyUid(firebaseUser.uid);
        }

        void syncWithBackendSql(firebaseUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, userPath);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, [syncWithBackendSql]);

  // Real-time Firestore subscriptions for signed-in user's consultations and bookmarks
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified || profileReadyUid !== user.uid) {
      return;
    }

    const consultationsPath = `users/${user.uid}/consultations`;
    const bookmarksPath = `users/${user.uid}/bookmarks`;

    const consultationsQuery = query(
      collection(db, 'users', user.uid, 'consultations'),
      where('uid', '==', user.uid)
    );

    const bookmarksQuery = query(
      collection(db, 'users', user.uid, 'bookmarks'),
      where('uid', '==', user.uid)
    );

    const unsubConsultations = onSnapshot(
      consultationsQuery,
      (snapshot) => {
        const items: UserConsultationRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            uid: String(d.uid || user.uid),
            referenceId: String(d.referenceId || docSnap.id),
            serviceTitle: String(d.serviceTitle || ''),
            callbackDay: String(d.callbackDay || ''),
            callbackSlot: String(d.callbackSlot || ''),
            phone: String(d.phone || ''),
            message: String(d.message || ''),
            status: (d.status as UserConsultationRecord['status']) || 'New',
            createdAtMs: toTimestampMs(d.createdAt),
          };
        });
        items.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setFirestoreConsultations(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, consultationsPath);
      }
    );

    const unsubBookmarks = onSnapshot(
      bookmarksQuery,
      (snapshot) => {
        const items: ServiceBookmarkRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            uid: String(d.uid || user.uid),
            serviceId: String(d.serviceId || docSnap.id),
            serviceTitle: String(d.serviceTitle || ''),
            category: String(d.category || ''),
            createdAtMs: toTimestampMs(d.createdAt),
          };
        });
        items.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setBookmarks(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, bookmarksPath);
      }
    );

    return () => {
      unsubConsultations();
      unsubBookmarks();
    };
  }, [authReady, user, profileReadyUid]);

  // Merge Firestore and Cloud SQL consultation records by referenceId (prefer PostgreSQL admin status when present)
  const consultations = React.useMemo(() => {
    const merged = new Map<string, UserConsultationRecord>();
    for (const item of firestoreConsultations) {
      merged.set(item.referenceId, item);
    }
    for (const sqlItem of sqlConsultations) {
      const existing = merged.get(sqlItem.referenceId);
      if (existing) {
        merged.set(sqlItem.referenceId, {
          ...existing,
          status: sqlItem.status,
        });
      } else {
        merged.set(sqlItem.referenceId, sqlItem);
      }
    }
    return Array.from(merged.values()).sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [firestoreConsultations, sqlConsultations]);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const updateProfileDetails = async (updates: {
    displayName: string;
    companyName?: string;
    phone?: string;
  }) => {
    if (!user) {
      throw new Error('User is not signed in.');
    }

    const cleanName = updates.displayName.trim();
    if (
      cleanName.length < USER_PROFILE_LIMITS.displayNameMin ||
      cleanName.length > USER_PROFILE_LIMITS.displayNameMax
    ) {
      throw new Error(
        `Name must be between 1 and ${USER_PROFILE_LIMITS.displayNameMax} characters.`
      );
    }

    const cleanCompany = (updates.companyName || '').trim();
    if (cleanCompany.length > USER_PROFILE_LIMITS.companyNameMax) {
      throw new Error(
        `Company name cannot exceed ${USER_PROFILE_LIMITS.companyNameMax} characters.`
      );
    }

    const cleanPhone = (updates.phone || '').trim();
    if (
      cleanPhone.length > USER_PROFILE_LIMITS.phoneMax ||
      !USER_PROFILE_LIMITS.phonePattern.test(cleanPhone)
    ) {
      throw new Error('Please enter a valid phone number (max 20 characters).');
    }

    const userPath = `users/${user.uid}`;
    const payload: Record<string, unknown> = {
      displayName: cleanName,
      companyName: cleanCompany,
      phone: cleanPhone,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, 'users', user.uid), payload);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: cleanName,
              companyName: cleanCompany,
              phone: cleanPhone,
            }
          : prev
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, userPath);
    }

    const token = await getAuthToken();
    if (token) {
      await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: cleanName,
          companyName: cleanCompany,
          phone: cleanPhone,
        }),
      });
    }
  };

  const saveConsultationToUserHistory = async (input: {
    referenceId: string;
    serviceTitle: string;
    callbackDay: string;
    callbackSlot: string;
    phone: string;
    message: string;
  }) => {
    if (!user || !user.emailVerified) return;

    const cleanRef = input.referenceId.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, CONSULTATION_LIMITS.referenceIdMax);
    if (cleanRef.length < CONSULTATION_LIMITS.referenceIdMin) return;

    const cleanPhone = input.phone.replace(/[^0-9+\-\s()]/g, '').trim().slice(0, CONSULTATION_LIMITS.phoneMax);
    const consultationPath = `users/${user.uid}/consultations/${cleanRef}`;

    const docPayload = {
      uid: user.uid,
      referenceId: cleanRef,
      serviceTitle: input.serviceTitle.trim().slice(0, CONSULTATION_LIMITS.serviceTitleMax),
      callbackDay: (input.callbackDay.trim() || 'Today').slice(0, CONSULTATION_LIMITS.callbackDayMax),
      callbackSlot: (input.callbackSlot.trim() || '10 AM – 1 PM').slice(0, CONSULTATION_LIMITS.callbackSlotMax),
      phone: cleanPhone.length >= 7 ? cleanPhone : '0000000000',
      message: (input.message.trim() || 'Consultation requested').slice(0, CONSULTATION_LIMITS.messageMax),
      status: 'New',
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'consultations', cleanRef), docPayload);
      void refreshUserConsultationsFromSql();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, consultationPath);
    }
  };

  const isServiceBookmarked = useCallback(
    (serviceId: string) => bookmarks.some((b) => b.serviceId === serviceId),
    [bookmarks]
  );

  const toggleServiceBookmark = async (service: {
    id: string;
    title: string;
    category: string;
  }): Promise<boolean> => {
    if (!user || !user.emailVerified) {
      await signInWithGoogle();
      return false;
    }

    const cleanServiceId = service.id.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, BOOKMARK_LIMITS.serviceIdMax);
    const bookmarkPath = `users/${user.uid}/bookmarks/${cleanServiceId}`;
    const alreadySaved = bookmarks.some((b) => b.serviceId === cleanServiceId);

    try {
      if (alreadySaved) {
        await deleteDoc(doc(db, 'users', user.uid, 'bookmarks', cleanServiceId));
        return false;
      }

      await setDoc(doc(db, 'users', user.uid, 'bookmarks', cleanServiceId), {
        uid: user.uid,
        serviceId: cleanServiceId,
        serviceTitle: service.title.trim().slice(0, BOOKMARK_LIMITS.serviceTitleMax),
        category: service.category.trim().slice(0, BOOKMARK_LIMITS.categoryMax),
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      handleFirestoreError(
        error,
        alreadySaved ? OperationType.DELETE : OperationType.CREATE,
        bookmarkPath
      );
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authReady,
        isAdmin,
        consultations,
        bookmarks,
        getAuthToken,
        signInWithGoogle,
        updateProfileDetails,
        saveConsultationToUserHistory,
        toggleServiceBookmark,
        isServiceBookmarked,
        refreshUserConsultationsFromSql,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
