import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

const adminConfigured = Boolean(projectId && clientEmail && privateKey);

let adminAuthInstance: Auth | null = null;

if (adminConfigured) {
  const adminApp = getApps().length
    ? getApp()
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  adminAuthInstance = getAuth(adminApp);
} else {
  console.warn(
    "Firebase Admin env vars are not set in .env.local — server-side auth verification is disabled until they are configured."
  );
}

export const adminAuth = adminAuthInstance;
