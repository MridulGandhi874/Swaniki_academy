import { connectDB } from "@/lib/db";
import { decodeCertificateId } from "@/lib/utils/certificate";
import UserModel from "@/lib/models/User";
import CourseModel from "@/lib/models/Course";
import SubmissionModel from "@/lib/models/Submission";
import EmptyState from "@/components/ui/EmptyState";
import AutoPrintTrigger from "@/components/AutoPrintTrigger";
import Logo from "@/components/Logo";

interface VerifyPageProps {
  params: Promise<{ certificateId: string }>;
  searchParams: Promise<{ print?: string }>;
}

async function getCertificateData(certificateId: string) {
  const decoded = decodeCertificateId(certificateId);
  if (!decoded) return null;
  const { uid, courseId } = decoded;

  await connectDB();

  // The Submission's "approved" status is the only source of truth for
  // completion — nothing certificate-shaped is stored, so this is derived
  // fresh on every request.
  const submission = await SubmissionModel.findOne({ uid, courseId, status: "approved" }).lean();
  if (!submission) return null;

  const [user, course] = await Promise.all([
    UserModel.findOne({ uid }).lean(),
    CourseModel.findOne({ courseId }).lean(),
  ]);
  if (!user) return null;

  return {
    issueDate: submission.evaluatedAt,
    studentName: user.publicDisplayName || user.displayName || user.email,
    courseTitle: course?.title ?? courseId,
  };
}

export default async function VerifyCertificatePage({ params, searchParams }: VerifyPageProps) {
  const { certificateId } = await params;
  const { print } = await searchParams;
  const data = await getCertificateData(certificateId);

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <EmptyState
          variant="error"
          title="Certificate not found"
          description={`"${certificateId}" doesn't match any issued credential. Double-check the link.`}
        />
      </div>
    );
  }

  const { issueDate, studentName, courseTitle } = data;
  const firstName = studentName.split(" ")[0] || studentName;
  const formattedDate = new Date(issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[var(--color-soft-periwinkle)]/25 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        {print === "1" && <AutoPrintTrigger />}

        <div className="relative w-full overflow-hidden rounded-[2rem] bg-white p-10 shadow-[0_30px_80px_rgba(37,99,235,0.16)] sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-[var(--color-soft-periwinkle)]/[0.08]" />
          <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border-2 border-blue-100 sm:inset-6" />

          <div className="relative text-center">
            <div className="flex justify-center">
              <Logo size={44} showText={false} />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
              Swaniki Academy
            </p>
            <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Certificate of Completion
            </h1>

            <div className="mx-auto mt-8 h-px w-16 bg-blue-200" />

            <p className="mt-8 text-sm text-gray-500">This certifies that</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{studentName}</p>

            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-gray-600">
              has successfully completed{" "}
              <span className="font-semibold text-blue-700">{courseTitle}</span>, a project-based
              internship-style program at Swaniki Academy. Over the course of the program,{" "}
              {firstName} worked through structured, hands-on modules and submitted a real-world
              capstone project that was evaluated against professional engineering standards —
              demonstrating genuine, applied skill, not passive video completion.
            </p>

            <p className="mt-8 text-xs font-medium uppercase tracking-wide text-gray-400">
              Issued {formattedDate}
            </p>

            <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-green-600"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-sm font-semibold text-green-700">Verified Official Credential</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">Issued and verified by Swaniki Academy</p>
      </div>
    </div>
  );
}
