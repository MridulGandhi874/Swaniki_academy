"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

interface RubricEntry {
  criterion: string;
  scoreObtained: number;
  maxScore: number;
  feedback: string;
}

export interface SubmissionData {
  submissionId: string;
  courseId: string;
  projectUrl: string;
  status: "pending" | "approved" | "rejected";
  score: number;
  rubricBreakdown: RubricEntry[];
  evaluatedAt: number;
}

interface SubmissionPanelProps {
  courseId: string;
  submission: SubmissionData | null;
  onUpdated: (submission: SubmissionData, certificate: { certificateId: string } | null) => void;
}

const statusStyles: Record<string, string> = {
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
};

export default function SubmissionPanel({ courseId, submission, onUpdated }: SubmissionPanelProps) {
  const { firebaseUser } = useAuth();
  const [url, setUrl] = useState(submission?.projectUrl ?? "");
  const [showForm, setShowForm] = useState(!submission);
  const [showRubric, setShowRubric] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!firebaseUser || !url.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/submissions/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ courseId, projectUrl: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Evaluation failed.");
      onUpdated(data.submission, data.certificate);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 rounded-2xl bg-gray-50 p-4">
      {submission && !showForm ? (
        <div>
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[submission.status]}`}
            >
              {submission.status} · {submission.score}/100
            </span>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Resubmit
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowRubric((s) => !s)}
            className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            {showRubric ? "Hide" : "View"} rubric breakdown
          </button>

          {showRubric && (
            <ul className="mt-3 space-y-2">
              {submission.rubricBreakdown.map((r, i) => (
                <li key={i} className="rounded-lg bg-white p-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-gray-800">
                    <span>{r.criterion}</span>
                    <span>
                      {r.scoreObtained}/{r.maxScore}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-500">{r.feedback}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Project URL (GitHub repo, PDF, or Google Drive link)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/you/project"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            />
            <Button type="button" size="sm" disabled={submitting || !url.trim()} onClick={handleSubmit}>
              {submitting ? "Evaluating..." : "Submit for Evaluation"}
            </Button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
