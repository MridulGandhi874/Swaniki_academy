"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-blue-600 px-8 py-16 text-center"
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to train like a professional?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-blue-100">
          Enroll in a track, ship a hands-on project, and walk away with a certificate that
          actually means something.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/courses" variant="dark" size="lg" className="!bg-white !text-blue-600 hover:!bg-blue-50">
            Get Started
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
