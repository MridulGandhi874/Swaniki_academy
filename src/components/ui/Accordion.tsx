"use client";

import { useState, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  meta?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export default function Accordion({ items, defaultOpenId, className = "" }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={`divide-y divide-gray-100 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                {item.title}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                {item.meta}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {isOpen && <div className="pb-4 text-sm text-gray-600">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
