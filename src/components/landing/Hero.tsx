"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50/70 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700"
        >
          A trainee program, not a video library
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
        >
          Train like a professional.
          <br />
          Build like an intern.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-500"
        >
          Structured daily modules, real hands-on projects, and a dashboard that actually tracks
          your progress — built for trainees who want to ship, not just watch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/dashboard" size="lg">
            Enrolled Trainee
          </Button>
          <Button href="/courses" variant="outline" size="lg">
            Get Started
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
