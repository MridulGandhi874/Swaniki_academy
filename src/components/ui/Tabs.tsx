"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  pillClassName?: string;
}

export default function Tabs({ tabs, activeId, onChange, className = "", pillClassName = "" }: TabsProps) {
  return (
    <div role="tablist" className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } ${pillClassName}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
