"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "@/components/ui/Tabs";

const tabs = [
  {
    id: "build",
    label: "Build",
    title: "Ship real, hands-on projects",
    description:
      "Every module ends with something you actually build — not a quiz, not a checkbox. You leave each day with working code.",
  },
  {
    id: "review",
    label: "Get Reviewed",
    title: "Feedback like a real internship",
    description:
      "Submit your work and get it reviewed the way a manager would review a pull request — specific, actionable, and honest.",
  },
  {
    id: "track",
    label: "Track Progress",
    title: "A dashboard that doesn't lie",
    description:
      "Your completion percentage, active courses, and streaks are pulled straight from what you've actually finished.",
  },
];

export default function ValuePropTabs() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Learn by doing, not by watching
        </h2>
      </div>

      <div className="mt-8 flex justify-center">
        <Tabs
          tabs={tabs.map(({ id, label }) => ({ id, label }))}
          activeId={activeId}
          onChange={setActiveId}
        />
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-semibold text-gray-900">{active.title}</h3>
            <p className="mt-3 text-gray-500">{active.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
