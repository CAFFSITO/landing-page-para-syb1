"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? "#";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function CtaFinal() {
  return (
    <section id="agenda" className="relative w-full py-28 md:py-40 bg-[#0D0618] overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-6 right-6 max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-[rgba(157,92,192,0.4)] to-transparent" />

      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-end">

        {/* Left: headline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="flex flex-col items-start"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-5">
            Empezá ahora
          </p>
          <h2 className="text-3xl md:text-[2.5rem] lg:text-[3rem] font-bold text-contrast leading-[1.1] tracking-tight">
            El primer paso es una conversación.{" "}
            <span className="text-secondary">Sin compromiso.</span>
          </h2>
        </motion.div>

        {/* Right: CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...spring, delay: 0.18 }}
          className="flex flex-col items-start lg:items-end gap-6"
        >
          <p className="text-base text-contrast/50 leading-relaxed max-w-sm lg:text-right">
            Agendá una llamada para que nos podamos conocer
          </p>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-contrast rounded-md bg-gradient-to-r from-primary to-secondary hover:brightness-110 shadow-[0_4px_24px_rgba(157,92,192,0.45)] transition-all duration-200"
            >
              Agendá la llamada →
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
