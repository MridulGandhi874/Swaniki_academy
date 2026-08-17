"use client";

import { useState } from "react";
import Link from "next/link";

export default function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-blue-800">
        Tell us what you&rsquo;re studying to get better course picks.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/welcome"
          className="whitespace-nowrap text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          Complete your profile →
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-blue-400 hover:text-blue-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
