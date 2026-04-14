"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? "#";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function CtaFinal() {
  return (
    <section id="agenda" className="relative w-full py-24 md:py-32 bg-[#0D0618]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] mb-6"
          >
            ¿Listo para dejar de ser el operador y convertirte en el arquitecto?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-contrast/70 leading-relaxed mb-10"
          >
            El programa arranca con un diagnóstico. Sin compromiso. Sin humo.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-contrast transition-all duration-200 rounded-md bg-gradient-to-r from-primary to-secondary hover:brightness-115 shadow-[0_4px_24px_rgba(157,92,192,0.45)]"
            >
              Agendá la llamada <span className="ml-2">&rarr;</span>
            </Link>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-sm text-contrast/45"
          >
            8 semanas. Garantía total. Sin dependencias.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
