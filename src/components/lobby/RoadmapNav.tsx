"use client";

/**
 * Navegación por dots + botones prev/next para las fases del roadmap.
 * Indicador deslizante con Framer Motion layoutId.
 */

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

  function handlePrev() {
    if (!isFirst) onFaseChange((faseActiva - 1) as 1 | 2 | 3);
  }

  function handleNext() {
    if (!isLast) onFaseChange((faseActiva + 1) as 1 | 2 | 3);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {/* Dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        {FASES.map((fase) => (
          <button
            key={fase}
            onClick={() => onFaseChange(fase)}
            aria-label={`Ir a fase ${fase}`}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              padding: 0,
              position: "relative",
            }}
          >
            {/* Dot inactivo */}
            <span
              style={{
                display: "block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "rgba(157,92,192,0.25)",
              }}
            />
            {/* Indicador activo deslizante */}
            {faseActiva === fase && (
              <motion.span
                layoutId="roadmap-dot-active"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  backgroundColor: "#9D5CC0",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Botones prev/next */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Fase anterior"
          style={{
            background: "none",
            border: "none",
            cursor: isFirst ? "not-allowed" : "pointer",
            color: isFirst ? "rgba(157,92,192,0.25)" : "#9D5CC0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            transition: "color 200ms ease",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <span
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.5)",
            minWidth: "60px",
            textAlign: "center",
          }}
        >
          Fase {faseActiva}
        </span>

        <button
          onClick={handleNext}
          disabled={isLast}
          aria-label="Fase siguiente"
          style={{
            background: "none",
            border: "none",
            cursor: isLast ? "not-allowed" : "pointer",
            color: isLast ? "rgba(157,92,192,0.25)" : "#9D5CC0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            transition: "color 200ms ease",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
