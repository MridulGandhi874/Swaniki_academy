"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseCard, { type CourseCardData } from "@/components/courses/CourseCard";
import RecommendedSection from "@/components/courses/RecommendedSection";
import SortFilterBar from "@/components/courses/SortFilterBar";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

const PAGE_SIZE = 9;

export default function CoursesPage() {
  const { firebaseUser, mongoUser, signInWithGoogle, refreshMongoUser } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchCourses = useCallback(async (sortValue: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/courses?sort=${sortValue}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCourses(data.courses ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(sort);
    setPage(1);
  }, [sort, fetchCourses]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const pageCourses = useMemo(
    () => filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredCourses, page]
  );

  const enrolledSet = new Set(mongoUser?.enrolledCourses ?? []);

  async function handleEnroll(courseId: string) {
    if (!firebaseUser) {
      try {
        await signInWithGoogle();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Sign-in failed.");
        return;
      }
    }

    setEnrollingId(courseId);
    try {
      const idToken = await firebaseUser?.getIdToken();
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courseId }),
      });
      if (!res.ok) throw new Error("Enroll failed");
      await refreshMongoUser();
      router.push(`/learn/${courseId}/1`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Enroll failed.");
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Program Tracks</h1>
        <p className="mt-2 text-gray-500">Browse trainee tracks and start building today.</p>
      </div>

      {!search.trim() && (
        <div className="mb-10">
          <RecommendedSection />
        </div>
      )}

      <SortFilterBar
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
        resultCount={filteredCourses.length}
      />

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            variant="error"
            title="Couldn't load program tracks"
            description="Something went wrong fetching courses. Please try again shortly."
          />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses available yet"
            description="Check back soon — new trainee tracks are added regularly."
            {...(mongoUser?.role === "admin"
              ? { ctaLabel: "Go to Admin", ctaHref: "/admin/courses" }
              : {})}
          />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="No matching program tracks"
            description={`Nothing matches "${search}". Try a different search term.`}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageCourses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  enrolled={enrolledSet.has(course.courseId)}
                  continueHref={`/learn/${course.courseId}/1`}
                  enrolling={enrollingId === course.courseId}
                  onEnroll={() => handleEnroll(course.courseId)}
                />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
