import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getVerifiedUid } from "@/lib/utils/auth-server";
import UserModel from "@/lib/models/User";

const STRING_FIELDS = [
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
  "fieldOfStudy",
  "yearStage",
  "skillLevel",
  "primaryGoal",
] as const;

const BOOLEAN_FIELDS = ["onboardingCompleted", "onboardingSkipped"] as const;

export async function PATCH(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {};

  for (const field of STRING_FIELDS) {
    if (typeof body[field] === "string") update[field] = body[field];
  }
  for (const field of BOOLEAN_FIELDS) {
    if (typeof body[field] === "boolean") update[field] = body[field];
  }
  if (Array.isArray(body.specializations)) {
    update.specializations = body.specializations.filter((s: unknown) => typeof s === "string");
  }

  await connectDB();

  if (update.firstName !== undefined || update.lastName !== undefined) {
    const existing = await UserModel.findOne({ uid }).lean();
    const firstName = update.firstName ?? existing?.firstName ?? "";
    const lastName = update.lastName ?? existing?.lastName ?? "";
    update.displayName = `${firstName} ${lastName}`.trim() || existing?.displayName || "";
  }

  const user = await UserModel.findOneAndUpdate({ uid }, { $set: update }, { new: true }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}
