"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";

export interface MongoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  coverURL: string;
  role: "student" | "admin";
  enrolledCourses: string[];
  completedLessons: string[];
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  occupation: string;
  timezone: string;
  bio: string;
  publicDisplayName: string;
  fieldOfStudy: string;
  yearStage: string;
  specializations: string[];
  skillLevel: string;
  primaryGoal: string;
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
  createdAt: number;
}

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  mongoUser: MongoUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshMongoUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function syncUser(firebaseUser: FirebaseUser): Promise<MongoUser | null> {
  try {
    const idToken = await firebaseUser.getIdToken();
    const res = await fetch("/api/user/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user as MongoUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(() => Boolean(auth));
  const router = useRouter();

  // Tracks the uid we last synced to Mongo for, so token refreshes (which
  // also fire onIdTokenChanged) don't trigger redundant /api/user/sync
  // calls or flash loading state — only real sign-in/sign-out transitions do.
  const syncedUidRef = useRef<string | null>(null);
  const explicitSignOutRef = useRef(false);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        syncedUidRef.current = null;
        setMongoUser(null);
        setLoading(false);
        if (explicitSignOutRef.current) {
          explicitSignOutRef.current = false;
          router.replace("/login");
        }
        return;
      }

      if (syncedUidRef.current !== user.uid) {
        syncedUidRef.current = user.uid;
        const synced = await syncUser(user);
        setMongoUser(synced);
      }

      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInWithGoogle() {
    if (!auth) {
      throw new Error("Firebase is not configured. Add your Firebase keys to .env.local.");
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string }).code;
      // Deliberately no signInWithRedirect fallback: it depends on
      // sessionStorage surviving a full-page round trip to Google and back,
      // which modern browser storage-partitioning (Safari ITP, Chrome
      // partitioning, private browsing) frequently breaks with a "missing
      // initial state" error. Popup doesn't have that failure mode.
      if (code === "auth/popup-blocked") {
        throw new Error("Your browser blocked the sign-in popup. Please allow popups for this site and try again.");
      }
      if (code === "auth/cancelled-popup-request" || code === "auth/popup-closed-by-user") {
        return;
      }
      throw err;
    }
  }

  async function signOutUser() {
    if (!auth) return;
    explicitSignOutRef.current = true;
    syncedUidRef.current = null;
    setMongoUser(null);
    setFirebaseUser(null);
    await signOut(auth);
  }

  async function refreshMongoUser() {
    if (!firebaseUser) return;
    const synced = await syncUser(firebaseUser);
    setMongoUser(synced);
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        mongoUser,
        loading,
        signInWithGoogle,
        signOutUser,
        refreshMongoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
