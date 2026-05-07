"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RoadmapNavProps = {
  faseActiva: 1 | 2 | 3;
  onFaseChange: (fase: 1 | 2 | 3) => void;
};

const FASES: (1 | 2 | 3)[] = [1, 2, 3];

export default function RoadmapNav({ faseActiva, onFaseChange }: RoadmapNavProps) {
  const isFirst = faseActiva === 1;
  const isLast = faseActiva === 3;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        paddingBottom: "12px",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <button
        onClick={() => !isFirst && onFaseChange((faseActiva - 1) as 1 | 2 | 3)}
        disabled={isFirst}
        aria-label="Fase anterior"
        style={{
          background: "none",
          border: "none",
          cursor: isFirst ? "not-allowed" : "pointer",
          color: isFirst ? "var(--foreground-subtle)" : "var(--foreground)",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          transition: "color 180ms ease",
        }}
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>

      {/* Tabs de fase con indicador deslizante */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {FASES.map((fase) => {
          const activo = faseActiva === fase;
          return (
            <button
              key={fase}
              onClick={() => onFaseChange(fase)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: activo ? "var(--foreground)" : "var(--foreground-subtle)",
                transition: "color 180ms ease",
              }}
            >
              Fase 0{fase}
              {activo && (
                <motion.span
                  layoutId="roadmap-tab-indicator"
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: -13,
                    height: 1,
                    backgroundColor: "var(--foreground)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => !isLast && onFaseChange((faseActiva + 1) as 1 | 2 | 3)}
        disabled={isLast}
        aria-label="Fase siguiente"
        style={{
          background: "none",
          border: "none",
          cursor: isLast ? "not-allowed" : "pointer",
          color: isLast ? "var(--foreground-subtle)" : "var(--foreground)",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          transition: "color 180ms ease",
        }}
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
