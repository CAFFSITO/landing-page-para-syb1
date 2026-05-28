"use client";

import { motion } from "framer-motion";
import type { GarantiaData } from "@/types";

type ProgressBarProps = {
  progressPct: number;
  faseActual: 1 | 2 | 3;
  nombreSocio: string;
  garantia?: GarantiaData;
};

const MILESTONES = [33, 66, 100] as const;

const RAINBOW_KEYFRAMES = `
@keyframes rainbow-slide {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
`;

export default function ProgressBar({
  progressPct,
  faseActual,
  garantia,
}: ProgressBarProps) {
  const opcion = garantia?.opcion_ejecutada ?? null;
  const esRetirada = opcion === "A";
  const esCompromiso = opcion === "B";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        backgroundColor: "var(--background-soft)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      {esCompromiso && <style>{RAINBOW_KEYFRAMES}</style>}

      {/* Fila superior: metadata editorial */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px 6px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--foreground-muted)",
          }}
        >
          {esRetirada
            ? "Retirada"
            : esCompromiso
            ? "Compromiso hasta el éxito"
            : `Fase ${faseActual} · Programa`}
        </span>
        {!esRetirada && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: esCompromiso ? "transparent" : "var(--foreground)",
              backgroundImage: esCompromiso
                ? "linear-gradient(90deg, #f00, #ff8800, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
                : "none",
              backgroundClip: esCompromiso ? "text" : "unset",
              WebkitBackgroundClip: esCompromiso ? "text" : "unset",
            }}
          >
            {progressPct}%
          </span>
        )}
      </div>

      {/* Track de progreso */}
      <div
        style={{
          position: "relative",
          height: esCompromiso ? 5 : 3,
          width: "100%",
          backgroundColor: "var(--hairline)",
          overflow: "hidden",
          transition: "height 400ms",
        }}
      >
        {esRetirada ? (
          /* Barra gris estática */
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progressPct}%`,
              backgroundColor: "rgba(150,150,150,0.5)",
            }}
          />
        ) : esCompromiso ? (
          /* Barra arcoíris animada */
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progressPct}%`,
              backgroundImage:
                "linear-gradient(90deg, #f00, #ff8800, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
              backgroundSize: "200% 100%",
              animation: "rainbow-slide 2s linear infinite",
            }}
          />
        ) : (
          /* Barra normal */
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 110, damping: 22 }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              backgroundColor: "var(--color-secondary)",
            }}
          />
        )}

        {!esCompromiso &&
          MILESTONES.map((pct) => (
            <div
              key={pct}
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor:
                  progressPct >= pct
                    ? "var(--color-secondary)"
                    : "var(--hairline-strong)",
                transition: "background-color 200ms ease",
              }}
            />
          ))}
      </div>
    </div>
  );
}
