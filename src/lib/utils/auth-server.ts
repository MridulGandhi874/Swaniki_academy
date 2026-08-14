import "server-only";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/User";

export async function getVerifiedUid(req: NextRequest): Promise<string | null> {
  if (!adminAuth) return null;

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return { ok: false as const, status: 401, error: "Unauthorized" };

  await connectDB();
  const user = await UserModel.findOne({ uid }).lean();
  if (!user || user.role !== "admin") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, uid, user };
}
