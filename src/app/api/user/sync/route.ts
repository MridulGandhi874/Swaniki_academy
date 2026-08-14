import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/User";

export async function POST(req: NextRequest) {
  if (!adminAuth) {
    return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectDB();

  const user = await UserModel.findOneAndUpdate(
    { uid: decoded.uid },
    {
      $setOnInsert: {
        uid: decoded.uid,
        role: "student",
        enrolledCourses: [],
        completedLessons: [],
        createdAt: Date.now(),
      },
      $set: {
        email: decoded.email ?? "",
        displayName: decoded.name ?? "",
        photoURL: decoded.picture ?? "",
      },
    },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ user });
}
