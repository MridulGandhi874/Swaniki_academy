"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseForm from "@/components/admin/CourseForm";
import { emptyCourse, draftToApiPayload, type CourseDraft } from "@/components/admin/types";

export default function NewCoursePage() {
  const { firebaseUser } = useAuth();
  const router = useRouter();

  async function handleSubmit(draft: CourseDraft) {
    if (!firebaseUser) throw new Error("Not signed in.");
    const idToken = await firebaseUser.getIdToken();
    const res = await fetch("/api/courses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(draftToApiPayload(draft)),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to create course.");
    }
    router.push("/admin/courses");
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">New Course</h1>
      <CourseForm initialData={emptyCourse()} onSubmit={handleSubmit} submitLabel="Create Course" />
    </div>
  );
}
