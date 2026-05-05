"use client";

import { motion } from "framer-motion";
import { Target, Layers, Shield, Key } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Pillar {
  Icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    Icon: Target,
    number: "01",
    title: "Diagnóstico antes que solución",
    description:
      "Antes de construir algo, mapeamos cómo funciona tu negocio hoy. Sin diagnóstico no hay dirección.",
  },
  {
    Icon: Layers,
    number: "02",
    title: "Diseño sistémico antes que automatización",
    description:
      "Automatizar sin diseñar es acelerar el caos. Primero el sistema, después la tecnología.",
  },
  {
    Icon: Shield,
    number: "03",
    title: "Resistencia a las fallas",
    description:
      "Tu sistema debe resistir el error, no depender de condiciones ideales para funcionar.",
  },
  {
    Icon: Key,
    number: "04",
    title: "Soberanía total",
    description:
      "Al terminar, tu equipo opera el sistema sin depender de nosotros ni de ningún externo.",
  },
];

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function PillarsSection() {
  return (
    <section id="pilares" className="relative w-full py-24 md:py-32 bg-[#0A0515]">
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
            Cómo pensamos
          </p>
          <h2 className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] max-w-xl">
            Cuatro principios que no negociamos.
          </h2>
        </motion.div>

        {/* Editorial list */}
        <div className="flex flex-col">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...spring, delay: i * 0.1 }}
              className="group grid grid-cols-1 md:grid-cols-[56px_1fr] lg:grid-cols-[72px_260px_1fr] gap-4 md:gap-8 lg:gap-12 py-8 border-t border-[rgba(157,92,192,0.18)] items-start"
            >
              {/* Icon */}
              <div className="flex items-center gap-4 md:block">
                <div className="w-10 h-10 rounded-lg bg-[rgba(157,92,192,0.1)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(157,92,192,0.18)] transition-colors duration-200">
                  <pillar.Icon className="w-5 h-5 text-secondary" />
                </div>
                {/* Mobile: number inline */}
                <span className="text-xs font-bold text-secondary/35 tracking-[0.15em] md:hidden">
                  {pillar.number}
                </span>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1 md:pt-2">
                <span className="hidden md:block text-xs font-bold text-secondary/35 tracking-[0.14em] mb-1">
                  {pillar.number}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-contrast leading-snug group-hover:text-secondary transition-colors duration-200">
                  {pillar.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-base text-contrast/55 leading-relaxed md:pt-2 lg:max-w-lg">
                {pillar.description}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[rgba(157,92,192,0.18)]" />
        </div>
      </div>
    </section>
  );
}
