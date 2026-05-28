"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import RoadmapIlustracion from "@/components/lobby/RoadmapIlustracion";
import RoadmapHito from "@/components/lobby/RoadmapHito";

type HitoData = {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
};

type RoadmapFaseCardProps = {
  fase: 1 | 2 | 3;
  titulo: string;
  duracion: string;
  hitos: HitoData[];
  empresaNombre: string;
};

export default function RoadmapFaseCard({
  fase,
  titulo,
  duracion,
  hitos,
  empresaNombre,
}: RoadmapFaseCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  function interpolarEmpresa(texto: string): string {
    return texto.replaceAll("[Empresa]", empresaNombre);
  }

  return (
    <div
      ref={ref}
      style={{
        minWidth: "320px",
        maxWidth: "400px",
        flex: "0 0 auto",
        scrollSnapAlign: "center",
        backgroundColor: "var(--surface-1)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Eyebrow + duración */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--foreground-subtle)",
          }}
        >
          Fase 0{fase}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--foreground-muted)",
          }}
        >
          {duracion}
        </span>
      </div>

      {/* Ilustración */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 0",
        }}
      >
        <RoadmapIlustracion fase={fase} />
      </motion.div>

      {/* Título serif editorial */}
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 700,
          fontSize: "1.4rem",
          color: "var(--foreground)",
          margin: 0,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
        }}
      >
        {titulo}
      </h3>

      {/* Hitos separados solo por hairline, sin cards */}
      <motion.div
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {hitos.map((hito, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { y: 12, opacity: 0 },
              show: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
              paddingTop: i === 0 ? 0 : "16px",
              paddingBottom: i === hitos.length - 1 ? 0 : "16px",
            }}
          >
            <RoadmapHito
              icono={hito.icono}
              titulo={hito.titulo}
              descripcion={interpolarEmpresa(hito.descripcion)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
