"use client";

interface SortFilterBarProps {
  sort: string;
  onSortChange: (sort: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  resultCount: number;
}

const options = [
  { value: "newest", label: "Release Date (newest 1st)" },
  { value: "oldest", label: "Release Date (oldest 1st)" },
  { value: "rating", label: "Highest Rated" },
];

export default function SortFilterBar({
  sort,
  onSortChange,
  search,
  onSearchChange,
  resultCount,
}: SortFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search program tracks..."
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <p className="whitespace-nowrap text-sm text-gray-500">{resultCount} program tracks</p>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
