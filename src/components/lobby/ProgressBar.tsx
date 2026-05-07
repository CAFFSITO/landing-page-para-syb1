"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  progressPct: 0 | 33 | 66 | 100;
  faseActual: 1 | 2 | 3;
  nombreSocio: string;
};

const MILESTONES = [33, 66, 100] as const;

export default function ProgressBar({
  progressPct,
  faseActual,
  nombreSocio: _nombreSocio,
}: ProgressBarProps) {
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
          Fase {faseActual} · Programa
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "var(--foreground)",
          }}
        >
          {progressPct}%
        </span>
      </div>

      {/* Track de progreso */}
      <div
        style={{
          position: "relative",
          height: "3px",
          width: "100%",
          backgroundColor: "var(--hairline)",
          overflow: "hidden",
        }}
      >
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

        {MILESTONES.map((pct) => (
          <div
            key={pct}
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor:
                progressPct >= pct ? "var(--color-secondary)" : "var(--hairline-strong)",
              transition: "background-color 200ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
