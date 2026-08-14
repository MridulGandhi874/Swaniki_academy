"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Aditi Rao",
    role: "Full Stack Trainee",
    quote:
      "The daily modules kept me accountable in a way self-paced videos never did. I actually shipped a project by the end.",
  },
  {
    name: "Marcus Webb",
    role: "Data Science Trainee",
    quote:
      "Feels like an internship, not a course. The dashboard tracking my real progress kept me honest.",
  },
  {
    name: "Priya Nair",
    role: "Frontend Trainee",
    quote:
      "Hands-on projects over passive lectures made all the difference. I'd recommend this to anyone starting out.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trainees who built, not just watched
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <StarRating rating={5} />
              <p className="mt-4 text-sm text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} size={36} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
