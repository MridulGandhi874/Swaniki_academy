"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseCard, { type CourseCardData } from "./CourseCard";
import Skeleton from "@/components/ui/Skeleton";

export default function RecommendedSection() {
  const { firebaseUser, mongoUser, signInWithGoogle, refreshMongoUser } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [personalized, setPersonalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchRecommended = useCallback(async () => {
    setLoading(true);
    const headers: HeadersInit = {};
    if (firebaseUser) {
      headers.Authorization = `Bearer ${await firebaseUser.getIdToken()}`;
    }
    const res = await fetch("/api/courses/recommended", { headers });
    if (res.ok) {
      const data = await res.json();
      setCourses(data.courses ?? []);
      setPersonalized(Boolean(data.personalized));
    }
    setLoading(false);
  }, [firebaseUser]);

  useEffect(() => {
    fetchRecommended();
  }, [fetchRecommended]);

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
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

  if (!loading && courses.length === 0) return null;

  const enrolledSet = new Set(mongoUser?.enrolledCourses ?? []);

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-[var(--color-soft-slate)]">
        {personalized ? "Recommended for You" : "Most Popular Tracks"}
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        {personalized
          ? "Matched to the specializations and level you told us about."
          : "Set your specialization interest in My Profile to personalize this."}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
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
      )}
    </div>
  );
}
