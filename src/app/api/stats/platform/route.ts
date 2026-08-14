import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/Course";
import ProgressModel from "@/lib/models/Progress";

export async function GET() {
  await connectDB();

  const [distinctTrainees, activeCourses, completedCourses] = await Promise.all([
    ProgressModel.distinct("uid"),
    CourseModel.countDocuments({ active: true }),
    ProgressModel.countDocuments({ isCompleted: true }),
  ]);

  return NextResponse.json({
    totalTraineesEnrolled: distinctTrainees.length,
    activeCourses,
    completedCourses,
  });
}
