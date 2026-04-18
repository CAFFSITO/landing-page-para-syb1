"use client";

/**
 * Card de una fase completa del roadmap.
 * Renderiza la ilustración SVG, título, duración y lista de hitos.
 */

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

  /** Reemplaza [Empresa] en las descripciones con el nombre real */
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
        background: "#1C0D35",
        border: "1px solid rgba(157,92,192,0.25)",
        borderRadius: "16px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Ilustración animada */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RoadmapIlustracion fase={fase} />
      </motion.div>

      {/* Encabezado de fase */}
      <div>
        <h3
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#FFFFFF",
            margin: "0 0 4px 0",
          }}
        >
          Fase {fase}: {titulo}
        </h3>
        <span
          style={{
            fontSize: "0.8rem",
            color: "#C084FC",
            fontWeight: 600,
          }}
        >
          {duracion}
        </span>
      </div>

      {/* Lista de hitos con stagger */}
      <motion.div
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        }}
        style={{ display: "flex", flexDirection: "column", gap: "0" }}
      >
        {hitos.map((hito, i) => (
          <div key={i}>
            {/* Conector vertical entre hitos */}
            {i > 0 && (
              <div
                style={{
                  width: "2px",
                  height: "20px",
                  backgroundColor: "rgba(157,92,192,0.25)",
                  margin: "0 auto",
                }}
              />
            )}
            <motion.div
              variants={{
                hidden: { y: 16, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <RoadmapHito
                icono={hito.icono}
                titulo={hito.titulo}
                descripcion={interpolarEmpresa(hito.descripcion)}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
