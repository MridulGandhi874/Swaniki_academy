import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/Course";

export async function GET(req: NextRequest) {
  await connectDB();

  const courseId = req.nextUrl.searchParams.get("courseId");
  if (courseId) {
    const course = await CourseModel.findOne({ courseId, active: true }).lean();
    return NextResponse.json({ courses: course ? [course] : [] });
  }

  const sort = req.nextUrl.searchParams.get("sort") ?? "newest";
  const sortSpec: Record<string, 1 | -1> =
    sort === "oldest" ? { createdAt: 1 } : sort === "rating" ? { rating: -1 } : { createdAt: -1 };

  const courses = await CourseModel.find({ active: true }).sort(sortSpec).lean();

  return NextResponse.json({ courses });
}
