"use client";

import { motion } from "framer-motion";

interface Phase {
  number: string;
  label: string;
  title: string;
  description: string;
  result: string;
  duration: string;
}

const phases: Phase[] = [
  {
    number: "01",
    label: "Fase uno",
    title: "Diagnosticamos tu negocio",
    description:
      "Antes de construir cualquier cosa, mapeamos cómo funciona tu negocio hoy. Auditoría, entrevistas, mapeo de procesos. Sin diagnóstico no hay dirección posible.",
    result: "Mapa real de tu operación y un plan de prioridades claro.",
    duration: "Semanas 1 — 2",
  },
  {
    number: "02",
    label: "Fase dos",
    title: "Diseñamos los sistemas y soluciones que tu negocio necesita ",
    description:
      "Diseñamos el sistema ideal para tu negocio y lo construimos de forma iterativa. Cada entrega se valida con vos antes de avanzar.",
    result: "Sistema diseñado para operar y escalar sin depender de vos.",
    duration: "Semanas 3 — 6",
  },
  {
    number: "03",
    label: "Fase tres",
    title: "Capacitamos a tu negocio",
    description:
      "Capacitamos a tu equipo progresivamente, hacemos un simulacro de autonomía y después te acompañamos 28 días más con reuniones semanales para asegurarnos de que todo funciona sin nosotros.",
    result: "Vos y tu equipo pueden manejar los sistemas sin necesidad de depender de nosotros.",
    duration: "Semanas 7 — 8 + 28 días",
  },
];

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function MethodologySection() {
  return (
    <section id="metodologia" className="relative w-full py-24 md:py-32 bg-[#0D0618]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="mb-16"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-4">
            La metodología
          </p>
          <h2 className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] max-w-xl">
            Un sistema en tres movimientos.
          </h2>
        </motion.div>

        {/* Phases — editorial rows */}
        <div className="flex flex-col">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...spring, delay: index * 0.12 }}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] gap-6 md:gap-14 py-10 border-t border-[rgba(157,92,192,0.18)]"
            >
              {/* Number column */}
              <div className="flex flex-col justify-between gap-3">
                <span className="text-[5rem] md:text-[6rem] font-bold leading-none text-primary/25 select-none">
                  {phase.number}
                </span>
                <span className="text-xs font-bold text-secondary/45 tracking-[0.14em] uppercase">
                  {phase.duration}
                </span>
              </div>

              {/* Content column */}
              <div className="flex flex-col gap-3 pt-1">
                <p className="text-xs font-bold text-secondary/55 uppercase tracking-[0.2em]">
                  {phase.label}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-contrast leading-tight">
                  {phase.title}
                </h3>
                <p className="text-base text-contrast/60 leading-relaxed max-w-2xl">
                  {phase.description}
                </p>
                <p className="mt-2 text-sm font-bold text-secondary/80">
                  Resultado: <span className="font-normal text-contrast/70">{phase.result}</span>
                </p>
              </div>
            </motion.div>
          ))}
          {/* closing border */}
          <div className="border-t border-[rgba(157,92,192,0.18)]" />
        </div>
      </div>
    </section>
  );
}
