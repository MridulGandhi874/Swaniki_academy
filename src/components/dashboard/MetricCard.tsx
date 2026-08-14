import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

export default function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-soft-periwinkle)]/20 text-[var(--color-soft-slate)]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--color-soft-slate)]">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
