"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import StarRating from "@/components/ui/StarRating";

interface AdminCourse {
  courseId: string;
  title: string;
  active: boolean;
  rating: number;
  totalLessons: number;
  activeStudentCount: number;
}

export default function AdminCoursesPage() {
  const { firebaseUser } = useAuth();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    const idToken = await firebaseUser.getIdToken();
    const res = await fetch("/api/courses/create", {
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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          <p className="mt-1 text-sm text-gray-500">Create and edit trainee program tracks.</p>
        </div>
        <Button href="/admin/courses/new">New Course</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Create your first trainee track to see it here."
          ctaLabel="New Course"
          ctaHref="/admin/courses/new"
        />
      ) : (
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {courses.map((course) => (
            <Link
              key={course.courseId}
              href={`/admin/courses/${course.courseId}/edit`}
              className="flex items-center justify-between px-5 py-4 transition hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {course.totalLessons} lessons · {course.activeStudentCount} students ·{" "}
                  {course.active ? "Active" : "Inactive"}
                </p>
              </div>
              <StarRating rating={course.rating} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
