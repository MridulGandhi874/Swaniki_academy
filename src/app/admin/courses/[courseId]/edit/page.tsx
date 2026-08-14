"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseForm from "@/components/admin/CourseForm";
import {
  apiCourseToDraft,
  draftToApiPayload,
  type ApiCourse,
  type CourseDraft,
} from "@/components/admin/types";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { firebaseUser } = useAuth();
  const router = useRouter();

  const [draft, setDraft] = useState<CourseDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!firebaseUser) return;
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/courses/create", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const match = (data.courses as ApiCourse[]).find((c) => c.courseId === courseId);
        if (match) {
          setDraft(apiCourseToDraft(match));
        } else {
          setNotFound(true);
        }
      }
      setLoading(false);
    }
    load();
  }, [firebaseUser, courseId]);

  async function handleSubmit(next: CourseDraft) {
    if (!firebaseUser) throw new Error("Not signed in.");
    const idToken = await firebaseUser.getIdToken();
    const res = await fetch("/api/courses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(draftToApiPayload(next)),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to update course.");
    }
    router.push("/admin/courses");
  }

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (notFound || !draft) {
    return <EmptyState title="Course not found" description="This course may have been removed." />;
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Edit Course</h1>
      <CourseForm
        initialData={draft}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        lockCourseId
      />
    </div>
  );
}
