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
        height: "56px",
        backgroundColor: "#1A0A2E",
        display: "flex",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Fill animado */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progressPct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          background: "linear-gradient(90deg, #9D5CC0, #C084FC, #E879F9)",
          boxShadow: "0 0 24px rgba(192,132,252,0.7)",
        }}
      />

      {/* Milestone dots */}
      {MILESTONES.map((pct) => (
        <div
          key={pct}
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            opacity: progressPct >= pct ? 1 : 0.3,
            transition: "opacity 0.3s ease",
            zIndex: 1,
          }}
        />
      ))}

      {/* Texto centrado */}
      <span
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          textAlign: "center",
          fontFamily: "Merriweather, Georgia, serif",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#FFFFFF",
          letterSpacing: "0.05em",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
        }}
      >
        Fase {faseActual} · {progressPct}% del programa
      </span>
    </div>
  );
}
