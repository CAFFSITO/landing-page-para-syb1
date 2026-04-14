"use client";

import { motion, type Variants } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

const conditions = [
  "Completaste las 3 fases del programa",
  "Tu equipo usó el sistema al menos 28 días",
  "Participaste de las reuniones de seguimiento",
  "Los procesos acordados no mejoraron métricas",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function GuaranteeSection() {
  return (
    <section
      id="garantia"
      className="relative w-full py-24 md:py-32"
      style={{
        background: "linear-gradient(180deg, #3B1E63 0%, #1A0A2E 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          {/* Shield icon */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <Shield className="w-14 h-14 text-secondary" />
          </motion.div>

          {/* Overline */}
          <motion.p
            variants={itemVariants}
            className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-4"
          >
            Sin Riesgo
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] mb-12"
          >
            No queremos tu dinero si no transformamos tu negocio.
          </motion.h2>

          {/* Options side by side */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {/* Option A */}
            <div className="rounded-xl border border-[rgba(157,92,192,0.25)] bg-[#1C0D35]/60 p-6 md:p-8 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary/80 mb-2">
                Opción A
              </p>
              <h3 className="text-xl font-bold text-contrast mb-3">Retirada</h3>
              <p className="text-contrast/70 text-sm leading-relaxed">
                Si después de 28 días el sistema no cumple lo acordado, te
                devolvemos el 100% de tu inversión. Sin preguntas, sin letras
                chicas.
              </p>
            </div>

            {/* Option B */}
            <div className="rounded-xl border border-[rgba(157,92,192,0.25)] bg-[#1C0D35]/60 p-6 md:p-8 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary/80 mb-2">
                Opción B
              </p>
              <h3 className="text-xl font-bold text-contrast mb-3">Compromiso</h3>
              <p className="text-contrast/70 text-sm leading-relaxed">
                Si no estás satisfecho pero confiás en el proceso, seguimos
                trabajando sin costo adicional hasta alcanzar los resultados
                prometidos.
              </p>
            </div>
          </motion.div>

          {/* Conditions */}
          <motion.ul
            variants={containerVariants}
            className="space-y-3 text-left max-w-lg mx-auto"
          >
            {conditions.map((condition) => (
              <motion.li
                key={condition}
                variants={itemVariants}
                className="flex items-start gap-3 text-contrast/80 text-sm md:text-base"
              >
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                {condition}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
