"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const steps = [
  {
    step: "Step 1",
    title: "Submit Dummy Project",
    description:
      "Apply what you've learned to a real-world style brief. Push your work, get it reviewed, and iterate like you would on an actual team.",
    cta: "Submit a Project",
    href: "/dashboard/enrolled-courses",
  },
  {
    step: "Step 2",
    title: "Apply for Certificate",
    description:
      "Finish every module in your track and request your completion certificate — proof you didn't just watch, you built.",
    cta: "Apply Now",
    href: "/dashboard",
  },
];

export default function DummyProjectCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {steps.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {item.step}
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="mt-3 text-sm text-gray-500">{item.description}</p>
              <Button href={item.href} variant="outline" className="mt-6">
                {item.cta}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
