import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getVerifiedUid } from "@/lib/utils/auth-server";
import { evaluateSubmission, isValidProjectUrl } from "@/lib/utils/evaluation";
import { generateSubmissionId } from "@/lib/utils/ids";
import { encodeCertificateId } from "@/lib/utils/certificate";
import CourseModel from "@/lib/models/Course";
import SubmissionModel from "@/lib/models/Submission";

const PASS_THRESHOLD = 75;

export async function POST(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { courseId, projectUrl } = body as { courseId?: string; projectUrl?: string };

  if (!courseId || !projectUrl) {
    return NextResponse.json({ error: "courseId and projectUrl are required" }, { status: 400 });
  }
  if (!isValidProjectUrl(projectUrl)) {
    return NextResponse.json(
      { error: "projectUrl must be a valid http(s) link (GitHub repo, PDF, or Google Drive link)." },
      { status: 400 }
    );
  }

  await connectDB();

  const course = await CourseModel.findOne({ courseId }).lean();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const criteria =
    course.evaluationCriteria && course.evaluationCriteria.length > 0
      ? course.evaluationCriteria
      : [
          { criterion: "Code Structure", weight: 30, description: "" },
          { criterion: "Architecture & Documentation", weight: 30, description: "" },
          { criterion: "Live Proof & Functionality", weight: 40, description: "" },
        ];

  const { totalScore, rubricBreakdown } = await evaluateSubmission(projectUrl, criteria);
  const status = totalScore >= PASS_THRESHOLD ? "approved" : "rejected";

  const existing = await SubmissionModel.findOne({ uid, courseId }).lean();
  const submissionId = existing?.submissionId ?? generateSubmissionId();

  // The Submission doc IS the completion trigger — status "approved" means
  // the student passed. No separate certificate record is ever written; the
  // certificateId below is just a reversible encoding of (uid, courseId) so
  // the credential can be regenerated live from this same Submission
  // whenever it's requested (see /verify/[certificateId]).
  const submission = await SubmissionModel.findOneAndUpdate(
    { uid, courseId },
    {
      $set: {
        submissionId,
        uid,
        courseId,
        projectUrl,
        status,
        score: totalScore,
        rubricBreakdown,
        evaluatedAt: Date.now(),
      },
      $setOnInsert: { createdAt: Date.now() },
    },
    { upsert: true, new: true }
  ).lean();

  const certificate =
    status === "approved"
      ? { certificateId: encodeCertificateId(uid, courseId), verificationUrl: `/verify/${encodeCertificateId(uid, courseId)}` }
      : null;

  return NextResponse.json({ submission, certificate });
}

export async function GET(req: NextRequest) {
  const uid = await getVerifiedUid(req);
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courseId = req.nextUrl.searchParams.get("courseId");
  await connectDB();

  const query = courseId ? { uid, courseId } : { uid };
  const submissions = await SubmissionModel.find(query).lean();

  const withCertificates = submissions.map((s) => ({
    ...s,
    certificateId: s.status === "approved" ? encodeCertificateId(s.uid, s.courseId) : null,
  }));

  return NextResponse.json({ submissions: withCertificates });
}
