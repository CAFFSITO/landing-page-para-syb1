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

export default function ProgressBar({
  progressPct,
  faseActual,
  garantia,
}: ProgressBarProps) {
  const opcion = garantia?.opcion_ejecutada ?? null;
  const esGarantiaEjecutada = !!opcion;

  const displayPct = esGarantiaEjecutada ? 100 : progressPct;

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
      {/* Fila superior */}
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
            color: esGarantiaEjecutada ? "#4ade80" : "var(--foreground-muted)",
          }}
        >
          {esGarantiaEjecutada ? "Garantía ejecutada" : `Fase ${faseActual} · Programa`}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: esGarantiaEjecutada ? "#4ade80" : "var(--foreground)",
          }}
        >
          {displayPct}%
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          position: "relative",
          height: 3,
          width: "100%",
          backgroundColor: "var(--hairline)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayPct}%` }}
          transition={{ type: "spring", stiffness: 110, damping: 22 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            backgroundColor: esGarantiaEjecutada ? "#4ade80" : "var(--color-secondary)",
            transition: "background-color 600ms ease",
          }}
        />

        {MILESTONES.map((pct) => (
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
                displayPct >= pct
                  ? esGarantiaEjecutada
                    ? "#4ade80"
                    : "var(--color-secondary)"
                  : "var(--hairline-strong)",
              transition: "background-color 200ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
