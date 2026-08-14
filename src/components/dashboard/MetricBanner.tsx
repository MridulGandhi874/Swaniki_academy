interface MetricBannerProps {
  totalTraineesEnrolled: number;
  activeCourses: number;
  completedCourses: number;
}

export default function MetricBanner({
  totalTraineesEnrolled,
  activeCourses,
  completedCourses,
}: MetricBannerProps) {
  const stats = [
    { label: "Total Trainees Enrolled", value: totalTraineesEnrolled },
    { label: "Active Courses", value: activeCourses },
    { label: "Completed Courses", value: completedCourses },
  ];

  return (
    <div className="rounded-2xl bg-[var(--color-soft-periwinkle)] px-6 py-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
        Platform Impact
      </p>
      <div className="mt-4 grid grid-cols-1 divide-y divide-white/25 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {stats.map((stat) => (
          <div key={stat.label} className="py-4 text-center first:pt-0 sm:py-0 sm:first:pl-0 sm:px-8">
            <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
            <p className="mt-1 text-sm text-white/85">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
