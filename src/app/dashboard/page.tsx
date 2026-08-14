"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import MetricCard from "@/components/dashboard/MetricCard";
import InProgressCourseRow from "@/components/dashboard/InProgressCourseRow";
import CourseCard from "@/components/courses/CourseCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

interface EnrolledCourse {
  courseId: string;
  title: string;
  bannerUrl?: string;
  rating: number;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  isCompleted: boolean;
  currentDay: number;
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
      <path d="M6 19a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function DashboardOverviewPage() {
  const { firebaseUser } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    if (!firebaseUser) return;
    const idToken = await firebaseUser.getIdToken();
    const res = await fetch("/api/progress/update", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCourses(data.courses ?? []);
    }
    setLoading(false);
  }, [firebaseUser]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const activeCourses = courses.filter((c) => !c.isCompleted);
  const completedCourses = courses.filter((c) => c.isCompleted);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Enrolled Courses" value={courses.length} icon={<BookIcon />} />
        <MetricCard label="Active Courses" value={activeCourses.length} icon={<ClockIcon />} />
        <MetricCard label="Completed Courses" value={completedCourses.length} icon={<CheckIcon />} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-soft-slate)]">In Progress Courses</h2>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : activeCourses.length === 0 ? (
          <EmptyState
            title="You haven't started any courses yet"
            description="Browse the catalog and enroll in a trainee track to get going."
            ctaLabel="Browse Courses"
            ctaHref="/courses"
          />
        ) : (
          <div className="space-y-4">
            {activeCourses.map((course) => (
              <InProgressCourseRow
                key={course.courseId}
                courseId={course.courseId}
                title={course.title}
                bannerUrl={course.bannerUrl}
                rating={course.rating}
                completedLessons={course.completedLessons}
                totalLessons={course.totalLessons}
                percentComplete={course.percentComplete}
                nextDay={course.currentDay}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && completedCourses.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[var(--color-soft-slate)]">Completed Courses</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                completed
                continueHref={`/learn/${course.courseId}/1`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
