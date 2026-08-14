"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "5K+", label: "Trainees Trained" },
  { value: "20+", label: "Program Tracks" },
  { value: "98%", label: "Success Rate" },
  { value: "100%", label: "Remote-Ready" },
];

export default function StatsBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
