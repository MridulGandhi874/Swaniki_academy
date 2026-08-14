import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/utils/auth-server";
import ProgressModel from "@/lib/models/Progress";
import UserModel from "@/lib/models/User";
import CourseModel from "@/lib/models/Course";
import SubmissionModel from "@/lib/models/Submission";

/**
 * There's no real payment processor in this app — "purchase" here means
 * enrollment (a Progress doc), and "revenue" is the sum of each enrolled
 * course's price. This is a computed view, not a ledger of real transactions.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await connectDB();

  const [enrollments, users, courses, submissions] = await Promise.all([
    ProgressModel.find({}).sort({ _id: -1 }).lean(),
    UserModel.find({}).lean(),
    CourseModel.find({}).lean(),
    SubmissionModel.find({}).lean(),
  ]);

  const userByUid = new Map(users.map((u) => [u.uid, u]));
  const courseById = new Map(courses.map((c) => [c.courseId, c]));
  const submissionByKey = new Map(submissions.map((s) => [`${s.uid}::${s.courseId}`, s]));

  let totalRevenue = 0;

  const orders = enrollments.map((enrollment) => {
    const user = userByUid.get(enrollment.uid);
    const course = courseById.get(enrollment.courseId);
    const submission = submissionByKey.get(`${enrollment.uid}::${enrollment.courseId}`);
    const price = course?.price ?? 0;
    totalRevenue += price;

    let status: "Enrolled" | "In Progress" | "Completed" | "Certified" = "Enrolled";
    if (submission?.status === "approved") status = "Certified";
    else if (enrollment.isCompleted) status = "Completed";
    else if ((enrollment.completedDays?.length ?? 0) > 0) status = "In Progress";

    return {
      studentName: user?.displayName || user?.email || "Unknown",
      studentEmail: user?.email ?? "",
      courseTitle: course?.title ?? enrollment.courseId,
      price,
      status,
      enrolledAt: (enrollment as { _id: { getTimestamp: () => Date } })._id.getTimestamp().getTime(),
    };
  });

  return NextResponse.json({ orders, totalRevenue });
}
