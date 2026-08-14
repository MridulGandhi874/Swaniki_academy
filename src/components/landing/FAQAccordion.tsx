"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const faqs = [
  {
    id: "faq-1",
    title: "Is this program self-paced?",
    content:
      "You can move at your own speed, but every track is structured into daily modules so it never feels aimless.",
  },
  {
    id: "faq-2",
    title: "Do I need prior experience?",
    content:
      "No — tracks start from fundamentals and build up to the hands-on project, so beginners and career switchers both fit.",
  },
  {
    id: "faq-3",
    title: "How do I get my certificate?",
    content:
      "Complete every module and the hands-on project for a track, then apply for your certificate from your dashboard.",
  },
  {
    id: "faq-4",
    title: "Is there mentor or reviewer feedback?",
    content:
      "Yes — submitted projects are reviewed the way a manager would review real work: specific and actionable.",
  },
];

export default function FAQAccordion() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="mt-10 rounded-2xl border border-gray-100 bg-white px-6 shadow-sm"
      >
        <Accordion items={faqs} />
      </motion.div>
    </section>
  );
}
