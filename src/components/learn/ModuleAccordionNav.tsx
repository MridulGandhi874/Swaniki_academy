"use client";

import Link from "next/link";

export interface ModuleNavItem {
  day: number;
  title: string;
}

interface ModuleAccordionNavProps {
  courseId: string;
  modules: ModuleNavItem[];
  activeDay: number;
  completedDays: number[];
}

export default function ModuleAccordionNav({
  courseId,
  modules,
  activeDay,
  completedDays,
}: ModuleAccordionNavProps) {
  const completedSet = new Set(completedDays);

  return (
    <nav className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
      {modules.map((module) => {
        const isActive = module.day === activeDay;
        const isDone = completedSet.has(module.day);

        return (
          <Link
            key={module.day}
            href={`/learn/${courseId}/${module.day}`}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm transition ${
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isDone
                  ? "bg-green-500 text-white"
                  : isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                module.day
              )}
            </span>
            <span className="line-clamp-2 font-medium">
              Day {module.day} — {module.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
