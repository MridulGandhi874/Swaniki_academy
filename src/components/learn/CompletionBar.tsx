"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

interface CompletionBarProps {
  isCompleted: boolean;
  onMarkComplete: () => void;
  marking: boolean;
  nextHref: string | null;
}

export default function CompletionBar({
  isCompleted,
  onMarkComplete,
  marking,
  nextHref,
}: CompletionBarProps) {
  return (
    <div className="sticky bottom-0 mt-10 flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={onMarkComplete}
        disabled={isCompleted || marking}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
          isCompleted
            ? "bg-green-50 text-green-600"
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        }`}
      >
        {isCompleted ? "Completed" : marking ? "Marking..." : "Mark Completed"}
      </button>

      {nextHref ? (
        <Link
          href={nextHref}
          className="rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          Next Module
        </Link>
      ) : (
        <Button href="/dashboard" variant="outline">
          Back to Dashboard
        </Button>
      )}
    </div>
  );
}
