"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Course } from "@/lib/models/Course";
import ModuleAccordionNav from "@/components/learn/ModuleAccordionNav";
import LessonReader from "@/components/learn/LessonReader";
import CompletionBar from "@/components/learn/CompletionBar";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function LearnPage() {
  const { courseId, dayId } = useParams<{ courseId: string; dayId: string }>();
  const dayNum = Number(dayId);
  const { firebaseUser, loading: authLoading, signInWithGoogle } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);

    const idToken = await firebaseUser.getIdToken();

    const [courseRes, progressRes] = await Promise.all([
      fetch(`/api/courses?courseId=${courseId}`),
      fetch("/api/progress/update", { headers: { Authorization: `Bearer ${idToken}` } }),
    ]);

    if (courseRes.ok) {
      const data = await courseRes.json();
      const found = data.courses?.[0] ?? null;
      setCourse(found);
      if (!found) setNotFound(true);
    }

    let hasProgress = false;
    if (progressRes.ok) {
      const data = await progressRes.json();
      const match = (data.courses ?? []).find((c: { courseId: string }) => c.courseId === courseId);
      if (match) {
        setCompletedDays(match.completedDays ?? []);
        hasProgress = true;
      }
    }

    if (!hasProgress) {
      const enrollRes = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ courseId }),
      });
      if (enrollRes.ok) {
        const data = await enrollRes.json();
        setCompletedDays(data.progress?.completedDays ?? []);
      }
    }

    setLoading(false);
  }, [firebaseUser, courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMarkComplete() {
    if (!firebaseUser) return;
    setMarking(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ courseId, completeDay: dayNum }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedDays(data.progress?.completedDays ?? []);
      }
    } finally {
      setMarking(false);
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          title="Sign in to access this lesson"
          description="You need to be signed in and enrolled to view course content."
        />
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => signInWithGoogle().catch((err) => alert(err.message))}
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState title="Course not found" description="This course may be inactive or no longer exists." />
      </div>
    );
  }

  const activeModule = course.modules.find((m) => m.day === dayNum);
  const sortedModules = [...course.modules].sort((a, b) => a.day - b.day);
  const nextModule = sortedModules.find((m) => m.day > dayNum);
  const isCurrentCompleted = completedDays.includes(dayNum);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <ModuleAccordionNav
          courseId={courseId}
          modules={sortedModules.map((m) => ({ day: m.day, title: m.title }))}
          activeDay={dayNum}
          completedDays={completedDays}
        />

        <div>
          {activeModule ? (
            <>
              <LessonReader module={activeModule} />
              <CompletionBar
                isCompleted={isCurrentCompleted}
                onMarkComplete={handleMarkComplete}
                marking={marking}
                nextHref={nextModule ? `/learn/${courseId}/${nextModule.day}` : null}
              />
            </>
          ) : (
            <EmptyState title="Module not found" description="This day doesn't exist in this course." />
          )}
        </div>
      </div>
    </div>
  );
}
