import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getVerifiedUid } from "@/lib/utils/auth-server";
import UserModel from "@/lib/models/User";

const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "username",
  "phone",
  "occupation",
  "timezone",
  "bio",
  "publicDisplayName",
  "photoURL",
  "coverURL",
] as const;

export async function PATCH(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const update: Record<string, string> = {};
  for (const field of ALLOWED_FIELDS) {
    if (typeof body[field] === "string") update[field] = body[field];
  }

  if (update.firstName !== undefined || update.lastName !== undefined) {
    await connectDB();
    const existing = await UserModel.findOne({ uid }).lean();
    const firstName = update.firstName ?? existing?.firstName ?? "";
    const lastName = update.lastName ?? existing?.lastName ?? "";
    update.displayName = `${firstName} ${lastName}`.trim() || existing?.displayName || "";
  } else {
    await connectDB();
  }

  const user = await UserModel.findOneAndUpdate({ uid }, { $set: update }, { new: true }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}
