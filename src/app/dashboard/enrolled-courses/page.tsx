"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Tabs from "@/components/ui/Tabs";
import CourseCard from "@/components/courses/CourseCard";
import SubmissionPanel, { type SubmissionData } from "@/components/dashboard/SubmissionPanel";
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

export default function EnrolledCoursesPage() {
  const { firebaseUser } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, SubmissionData>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("enrolled");

  const fetchCourses = useCallback(async () => {
    if (!firebaseUser) return;
    const idToken = await firebaseUser.getIdToken();

    const [coursesRes, submissionsRes] = await Promise.all([
      fetch("/api/progress/update", { headers: { Authorization: `Bearer ${idToken}` } }),
      fetch("/api/submissions/evaluate", { headers: { Authorization: `Bearer ${idToken}` } }),
    ]);

    if (coursesRes.ok) {
      const data = await coursesRes.json();
      setCourses(data.courses ?? []);
    }
    if (submissionsRes.ok) {
      const data = await submissionsRes.json();
      const map: Record<string, SubmissionData> = {};
      for (const s of data.submissions ?? []) map[s.courseId] = s;
      setSubmissions(map);
    }
    setLoading(false);
  }, [firebaseUser]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const active = courses.filter((c) => !c.isCompleted);
  const completed = courses.filter((c) => c.isCompleted);

  const visible = filter === "active" ? active : filter === "completed" ? completed : courses;

  const tabs = [
    { id: "enrolled", label: `Enrolled Courses (${courses.length})` },
    { id: "active", label: `Active Courses (${active.length})` },
    { id: "completed", label: `Completed Courses (${completed.length})` },
  ];

  return (
    <div>
      <h1 className="mb-6 text-lg font-bold text-[var(--color-soft-slate)]">Enrolled Courses</h1>
      <Tabs tabs={tabs} activeId={filter} onChange={setFilter} className="mb-8" />

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="No courses here yet"
          description="Enroll in a trainee track from the catalog to see it here."
          ctaLabel="Browse Courses"
          ctaHref="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {visible.map((course) => (
            <div key={course.courseId}>
              <CourseCard
                course={course}
                enrolled={!course.isCompleted}
                completed={course.isCompleted}
                continueHref={`/learn/${course.courseId}/${course.isCompleted ? 1 : course.currentDay}`}
              />
              <SubmissionPanel
                courseId={course.courseId}
                submission={submissions[course.courseId] ?? null}
                onUpdated={(submission) =>
                  setSubmissions((prev) => ({ ...prev, [course.courseId]: submission }))
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
