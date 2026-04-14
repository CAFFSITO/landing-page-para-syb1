"use client";

import { motion, type Variants } from "framer-motion";

const symptoms = [
  "Todo pasa por vos antes de resolverse",
  "Tu equipo tiene voluntad pero depende de tus decisiones",
  "Trabajás más horas pero el techo no sube",
  "Automatizaste cosas sueltas pero el caos sigue",
];

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

export default function ProblemSection() {
  return (
    <section id="problema" className="relative w-full py-24 md:py-32 bg-[#110820]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Overline */}
          <motion.p
            variants={itemVariants}
            className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-4"
          >
            El Diagnóstico
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] mb-6"
          >
            Tu negocio no escala porque no fue diseñado para escalar.
          </motion.h2>

          {/* Body */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-contrast/70 leading-relaxed mb-10 max-w-3xl"
          >
            Lo que llamamos <em className="text-secondary">Arquitectura de Fricción</em> es
            la acumulación de decisiones operativas que te mantienen atrapado
            en el día a día. No es falta de esfuerzo — es un diseño que nunca
            fue pensado para crecer.
          </motion.p>

          {/* Symptoms list */}
          <motion.ul className="space-y-4">
            {symptoms.map((symptom) => (
              <motion.li
                key={symptom}
                variants={itemVariants}
                className="flex items-start gap-3 text-contrast/85 text-base md:text-lg leading-relaxed"
              >
                <span className="mt-1.5 block w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
                {symptom}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
