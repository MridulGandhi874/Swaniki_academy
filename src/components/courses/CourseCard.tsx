import StarRating from "@/components/ui/StarRating";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export interface CourseCardData {
  courseId: string;
  title: string;
  bannerUrl?: string;
  authorName?: string;
  badge?: string;
  price?: number;
  rating?: number;
  activeStudentCount?: number;
  totalLessons?: number;
}

interface CourseCardProps {
  course: CourseCardData;
  enrolled?: boolean;
  completed?: boolean;
  continueHref?: string;
  onEnroll?: () => void;
  enrolling?: boolean;
}

export default function CourseCard({
  course,
  enrolled = false,
  completed = false,
  continueHref,
  onEnroll,
  enrolling = false,
}: CourseCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative block h-44 w-full bg-gray-100">
        {course.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.bannerUrl} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 text-blue-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
        )}
        {course.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {course.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <p className="line-clamp-2 text-sm font-semibold uppercase tracking-wide text-white">
            {course.title}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <StarRating rating={course.rating ?? 0} />
          {typeof course.price === "number" && (
            <span className="text-base font-bold text-blue-600">₹{course.price.toLocaleString("en-IN")}</span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-bold text-gray-900">{course.title}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {course.activeStudentCount ?? 0} active students · {course.totalLessons ?? 0} modules
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Avatar name={course.authorName || "Instructor"} size={28} />
          <span className="text-sm text-gray-600">{course.authorName || "Academy Instructor"}</span>
        </div>

        <div className="mt-5">
          {completed && continueHref ? (
            <Button href={continueHref} variant="outline" className="w-full">
              Review Course
            </Button>
          ) : enrolled && continueHref ? (
            <Button href={continueHref} variant="outline" className="w-full">
              Continue Learning
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={enrolling}
              onClick={onEnroll}
            >
              {enrolling ? "Enrolling..." : "Enroll Trainee"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
