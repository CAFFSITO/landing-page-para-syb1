"use client";

import { motion, type Variants } from "framer-motion";

interface Phase {
  number: string;
  title: string;
  result: string;
}

const phases: Phase[] = [
  {
    number: "01",
    title: "Diagnóstico de Fricción (COM)",
    result: "Mapa real de cómo funciona tu negocio hoy",
  },
  {
    number: "02",
    title: "Arquitectura de Soberanía Sistémica",
    result: "Sistema diseñado para operar sin depender de vos",
  },
  {
    number: "03",
    title: "Protocolo de Blindaje",
    result: "Negocio validado, equipo autónomo, 28 días de seguimiento",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function MethodologySection() {
  return (
    <section id="metodologia" className="relative w-full py-24 md:py-32 bg-[#0D0618]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-4">
            La Metodología
          </p>
          <h2 className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] mb-16">
            Un sistema en tres movimientos.
          </h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-secondary/40" />

          {phases.map((phase, index) => (
            <motion.div
              key={phase.number}
              variants={cardVariants}
              className="relative pl-16 md:pl-20 mb-12 last:mb-0"
            >
              {/* Pulse dot on timeline */}
              <div className="absolute left-[17px] md:left-[23px] top-6 z-10">
                <span className="block w-4 h-4 rounded-full bg-secondary shadow-[0_0_12px_rgba(157,92,192,0.6)]" />
                <span className="absolute inset-0 w-4 h-4 rounded-full bg-secondary animate-ping opacity-50" />
              </div>

              {/* Card */}
              <div className="relative overflow-hidden rounded-xl border border-[rgba(157,92,192,0.25)] bg-[#1C0D35] p-6 md:p-8 shadow-[0_2px_20px_rgba(59,30,99,0.15)] transition-transform duration-200 hover:-translate-y-0.5">
                {/* Big phase number background */}
                <span className="absolute -right-2 -top-4 text-[6rem] md:text-[8rem] font-bold text-primary/30 leading-none select-none pointer-events-none">
                  {phase.number}
                </span>

                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary/80 mb-2">
                    Fase {phase.number}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-contrast mb-3 leading-tight">
                    {phase.title}
                  </h3>
                  <p className="text-contrast/70 leading-relaxed">
                    <span className="text-secondary font-bold">Resultado →</span>{" "}
                    {phase.result}
                  </p>
                </div>
              </div>

              {/* Connector line between cards (not on last) */}
              {index < phases.length - 1 && (
                <div className="absolute left-[23px] md:left-[29px] top-11 bottom-0 w-[2px]" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
