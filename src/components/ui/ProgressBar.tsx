interface ProgressBarProps {
  percent: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ percent, className = "", showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={className}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs font-medium text-blue-600">{clamped}% Complete</p>}
    </div>
  );
}
