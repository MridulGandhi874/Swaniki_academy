import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getVerifiedUid } from "@/lib/utils/auth-server";
import CourseModel from "@/lib/models/Course";
import ProgressModel from "@/lib/models/Progress";
import UserModel from "@/lib/models/User";

export async function GET(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const progressDocs = await ProgressModel.find({ uid }).lean();
  const courseIds = progressDocs.map((p) => p.courseId);
  const courses = await CourseModel.find({ courseId: { $in: courseIds } }).lean();
  const courseById = new Map(courses.map((c) => [c.courseId, c]));

  const enrolledCourses = progressDocs
    .map((progress) => {
      const course = courseById.get(progress.courseId);
      if (!course) return null;
      const totalLessons = course.modules?.length ?? 0;
      const completedLessons = progress.completedDays?.length ?? 0;
      const percentComplete = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        courseId: course.courseId,
        title: course.title,
        bannerUrl: course.bannerUrl,
        rating: course.rating,
        totalLessons,
        completedLessons,
        percentComplete,
        isCompleted: progress.isCompleted,
        currentDay: progress.currentDay,
        completedDays: progress.completedDays ?? [],
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return NextResponse.json({ courses: enrolledCourses });
}

export async function POST(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { courseId, completeDay } = body as { courseId?: string; completeDay?: number };
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await connectDB();

  const course = await CourseModel.findOne({ courseId }).lean();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const totalModules = course.modules?.length ?? 0;

  let progress = await ProgressModel.findOne({ uid, courseId });
  const isNewEnrollment = !progress;

  if (!progress) {
    progress = await ProgressModel.create({
      uid,
      courseId,
      currentDay: 1,
      completedDays: [],
      isCompleted: false,
      updatedAt: Date.now(),
    });
  }

  if (typeof completeDay === "number") {
    const completedSet = new Set<number>(progress.completedDays);
    completedSet.add(completeDay);
    progress.completedDays = Array.from(completedSet).sort((a, b) => a - b);
    progress.currentDay = Math.min(completeDay + 1, Math.max(totalModules, 1));
    progress.isCompleted = totalModules > 0 && progress.completedDays.length >= totalModules;
    progress.updatedAt = Date.now();
    await progress.save();
  }

  if (isNewEnrollment) {
    await UserModel.updateOne({ uid }, { $addToSet: { enrolledCourses: courseId } });
    await CourseModel.updateOne({ courseId }, { $inc: { activeStudentCount: 1 } });
  }

  const percentComplete = totalModules > 0 ? Math.round((progress.completedDays.length / totalModules) * 100) : 0;

  return NextResponse.json({ progress, percentComplete });
}
