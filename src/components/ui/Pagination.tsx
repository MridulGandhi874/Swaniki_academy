"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          &lt;
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
              p === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
