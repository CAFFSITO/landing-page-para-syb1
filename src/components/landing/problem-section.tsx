"use client";

import { motion } from "framer-motion";

const symptoms = [
  { n: "01", text: "Todo pasa por vos antes de resolverse" },
  { n: "02", text: "Tu equipo tiene voluntad pero depende de tus decisiones" },
  { n: "03", text: "Trabajás más horas pero seguís sin escalar" },
  { n: "04", text: " Optimizaste y automatizaste algunas cosas pero el negocio sigue igual" },
];

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function ProblemSection() {
  return (
    <section id="problema" className="relative w-full py-24 md:py-32 bg-[#0F0820]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[38%_62%] gap-16 lg:gap-24 items-start">

        {/* Left: heading block — sticky on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={spring}
          className="lg:sticky lg:top-28"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-secondary mb-4">
            El diagnóstico
          </p>
          <h2 className="text-3xl md:text-[2.25rem] font-bold text-contrast leading-[1.2] mb-6">
            Tu negocio no escala porque no está diseñado para escalar.
          </h2>
          <p className="text-base text-contrast/55 leading-relaxed mb-4 max-w-sm">
            No es falta de esfuerzo ni de herramientas. Es que el sistema que sostiene tu negocio se construyó sobre la marcha, decisión por decisión, sin un diseño de fondo.
          </p>
        </motion.div>

        {/* Right: symptoms as editorial list */}
        <div className="flex flex-col">
          {symptoms.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...spring, delay: i * 0.1 }}
              className="group py-7 border-t border-[rgba(157,92,192,0.18)] last:border-b last:border-[rgba(157,92,192,0.18)] flex items-baseline gap-6"
            >
              <span className="text-xs font-bold text-secondary/35 tracking-[0.15em] shrink-0 w-8 tabular-nums">
                {s.n}
              </span>
              <p className="text-lg md:text-xl text-contrast/75 group-hover:text-contrast leading-relaxed transition-colors duration-200">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
