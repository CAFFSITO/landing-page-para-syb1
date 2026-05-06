"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function GuaranteeSection() {
  return (
    <section
      id="garantia"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1A0A2E 0%, #0D0618 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-primary/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring}
          className="text-xs font-bold uppercase tracking-[0.28em] text-secondary mb-8"
        >
          Sin riesgo
        </motion.p>

        {/* Divider top */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.05 }}
          className="w-full h-px bg-white/[0.08] mb-10"
        />

        {/* Main block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.1 }}
          className="relative rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl px-8 md:px-12 py-10 md:py-14 overflow-hidden"
          style={{
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.35)",
          }}
        >
          {/* Inner corner glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-[56px] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-secondary shrink-0 mt-1" />
              <p className="text-xl md:text-2xl font-bold text-contrast leading-[1.4]">
                Si el sistema no cumple lo acordado, te devolvemos el 100% de tu inversión o seguimos trabajando sin costo adicional hasta alcanzar los resultados prometidos.
              </p>
            </div>

            <div className="h-px w-full bg-white/[0.07]" />

            <p className="text-sm text-contrast/50 leading-relaxed max-w-2xl">
              Construimos para que funcione. Pero si después de 28 días de uso activo el sistema no alcanzó lo que acordamos, vos elegís cómo querés proceder.
            </p>
          </div>
        </motion.div>

        {/* Divider bottom */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.25 }}
          className="w-full h-px bg-white/[0.08] mt-10"
        />

      </div>
    </section>
  );
}
