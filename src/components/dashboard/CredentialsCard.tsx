"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

interface ApprovedSubmission {
  courseId: string;
  score: number;
  evaluatedAt: number;
  certificateId: string | null;
}

export default function CredentialsCard() {
  const { firebaseUser } = useAuth();
  const [credentials, setCredentials] = useState<ApprovedSubmission[]>([]);
  const [courseTitles, setCourseTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    if (!firebaseUser) return;
    const idToken = await firebaseUser.getIdToken();

    const [submissionsRes, coursesRes] = await Promise.all([
      fetch("/api/submissions/evaluate", { headers: { Authorization: `Bearer ${idToken}` } }),
      fetch("/api/courses"),
    ]);

    if (submissionsRes.ok) {
      const data = await submissionsRes.json();
      const approved = (data.submissions ?? []).filter(
        (s: { status: string }) => s.status === "approved"
      );
      setCredentials(approved);
    }
    if (coursesRes.ok) {
      const data = await coursesRes.json();
      const map: Record<string, string> = {};
      for (const c of data.courses ?? []) map[c.courseId] = c.title;
      setCourseTitles(map);
    }
    setLoading(false);
  }, [firebaseUser]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  async function copyLink(certificateId: string) {
    const url = `${window.location.origin}/verify/${certificateId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(certificateId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <EmptyState
        title="No credentials yet"
        description="Submit and pass a project evaluation to earn your first certificate."
      />
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((cred) =>
        !cred.certificateId ? null : (
          <div
            key={cred.courseId}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {courseTitles[cred.courseId] ?? cred.courseId}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Issued {new Date(cred.evaluatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button href={`/verify/${cred.certificateId}`} target="_blank" variant="outline" size="sm">
                Preview
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => copyLink(cred.certificateId!)}
              >
                {copiedId === cred.certificateId ? "Copied!" : "Copy Link"}
              </Button>
              <Button href={`/verify/${cred.certificateId}?print=1`} target="_blank" size="sm">
                Print
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
