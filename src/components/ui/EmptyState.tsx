import type { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: ReactNode;
  variant?: "default" | "error";
}

function DefaultIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 4v5" />
    </svg>
  );
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center">
      <div
        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
          variant === "error" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
        }`}
      >
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>}
      {ctaLabel && ctaHref && (
        <Button href={ctaHref} className="mt-6">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
