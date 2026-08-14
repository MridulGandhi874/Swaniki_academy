import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

// Strip accidental wrapping quotes — a common copy-paste artifact when a value
// is pulled from a .env file (where "..." is file syntax stripped by dotenv)
// into a host UI (Vercel, etc.) that stores the pasted text verbatim.
function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  ? stripWrappingQuotes(process.env.FIREBASE_ADMIN_PROJECT_ID)
  : undefined;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  ? stripWrappingQuotes(process.env.FIREBASE_ADMIN_CLIENT_EMAIL)
  : undefined;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ? stripWrappingQuotes(process.env.FIREBASE_ADMIN_PRIVATE_KEY).replace(/\\n/g, "\n")
  : undefined;

const adminConfigured = Boolean(projectId && clientEmail && privateKey);

let adminAuthInstance: Auth | null = null;

if (adminConfigured) {
  try {
    const adminApp = getApps().length
      ? getApp()
      : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    adminAuthInstance = getAuth(adminApp);
  } catch (err) {
    // Never let a malformed credential crash the whole serverless function —
    // fail closed into "not configured" and log the real reason.
    console.error("Firebase Admin failed to initialize — check FIREBASE_ADMIN_* env vars:", err);
  }
} else {
  console.warn(
    "Firebase Admin env vars are not set — server-side auth verification is disabled until they are configured."
  );
}

export const adminAuth = adminAuthInstance;
