"use client";

import { motion, type Variants } from "framer-motion";
import { Target, Layers, Shield, Key } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Pillar {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    Icon: Target,
    title: "Diagnóstico antes que solución",
    description:
      "Antes de construir nada, mapeamos cómo funciona tu negocio hoy. Sin diagnóstico no hay dirección.",
  },
  {
    Icon: Layers,
    title: "Diseño sistémico sobre automatización",
    description:
      "Automatizar sin diseñar es acelerar el caos. Primero el sistema, después la tecnología.",
  },
  {
    Icon: Shield,
    title: "Antifragilidad operativa",
    description:
      "Tu sistema debe resistir el error, no depender de condiciones ideales para funcionar.",
  },
  {
    Icon: Key,
    title: "Soberanía total",
    description:
      "Al terminar, tu equipo opera el sistema sin depender de nosotros ni de ningún externo.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function PillarsSection() {
  return (
    <section id="pilares" className="relative w-full py-24 md:py-32 bg-[#0A0515]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-4">
            Cómo Pensamos
          </p>
          <h2 className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] mb-14">
            Cuatro pilares que no negociamos.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={cardVariants}
              className="relative border-l-[3px] border-secondary bg-[#1C0D35]/50 rounded-xl p-6 md:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(59,30,99,0.25)]"
            >
              <pillar.Icon className="w-7 h-7 text-secondary mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-contrast mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm md:text-base text-contrast/65 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
