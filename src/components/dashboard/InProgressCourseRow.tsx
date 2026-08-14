import StarRating from "@/components/ui/StarRating";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

interface InProgressCourseRowProps {
  courseId: string;
  title: string;
  bannerUrl?: string;
  rating: number;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  nextDay: number;
}

export default function InProgressCourseRow({
  courseId,
  title,
  bannerUrl,
  rating,
  completedLessons,
  totalLessons,
  percentComplete,
  nextDay,
}: InProgressCourseRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center">
      <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-40">
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 text-blue-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1">
        <StarRating rating={rating} />
        <h3 className="mt-1 text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {completedLessons} of {totalLessons} lessons
        </p>
        <ProgressBar percent={percentComplete} showLabel className="mt-3 max-w-md" />
      </div>

      <Button href={`/learn/${courseId}/${nextDay}`} variant="outline">
        Continue Learning
      </Button>
    </div>
  );
}
