"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

const features = [
  {
    title: "Daily structured modules",
    description: "Bite-sized daily tracks instead of an endless, unstructured video backlog.",
    icon: "📅",
  },
  {
    title: "Real hands-on projects",
    description: "Every track ships with a mini-project you actually build, not just watch.",
    icon: "🛠️",
  },
  {
    title: "Progress that's real",
    description: "Your dashboard reflects exactly what you've completed — no vanity metrics.",
    icon: "📊",
  },
  {
    title: "Code-first lessons",
    description: "Reader pages built for code blocks, DevTools walkthroughs, and real syntax.",
    icon: "💻",
  },
  {
    title: "Certificates that mean it",
    description: "Earned only after every module and assignment in the track is complete.",
    icon: "🎓",
  },
  {
    title: "Built for trainees",
    description: "Designed around internship-style accountability, not passive consumption.",
    icon: "🚀",
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-gray-50/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Swaniki Academy feels like a product, not a portal
          </h2>
          <p className="mt-4 text-gray-500">
            Every part of the trainee experience is designed around actually doing the work.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
