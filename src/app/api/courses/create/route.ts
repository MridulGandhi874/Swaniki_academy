import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/Course";
import { requireAdmin } from "@/lib/utils/auth-server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const courses = await CourseModel.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const {
    courseId,
    title,
    description,
    bannerUrl,
    price,
    badge,
    domainTags,
    skillLevel,
    totalDays,
    rating,
    modules,
    evaluationCriteria,
    active,
  } = body;

  if (!courseId || !title) {
    return NextResponse.json({ error: "courseId and title are required" }, { status: 400 });
  }

  await connectDB();

  const totalLessons = Array.isArray(modules)
    ? modules.reduce((sum: number, m: { lessons?: unknown[] }) => sum + (m.lessons?.length ?? 0), 0)
    : 0;

  const course = await CourseModel.findOneAndUpdate(
    { courseId },
    {
      $set: {
        title,
        description: description ?? "",
        bannerUrl: bannerUrl ?? "",
        price: typeof price === "number" ? price : 0,
        badge: badge ?? "",
        domainTags: Array.isArray(domainTags) ? domainTags : [],
        skillLevel: skillLevel ?? "beginner",
        totalDays: typeof totalDays === "number" ? totalDays : 14,
        rating: typeof rating === "number" ? rating : 0,
        modules: modules ?? [],
        evaluationCriteria: Array.isArray(evaluationCriteria) ? evaluationCriteria : [],
        totalLessons,
        active: active ?? true,
      },
      $setOnInsert: { courseId, createdAt: Date.now(), activeStudentCount: 0 },
    },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ course }, { status: 201 });
}
