/**
 * Card individual para un hito del roadmap.
 * Server Component — sin interactividad propia.
 *
 * El padre puede activar el hover con la clase CSS `group`.
 */

import type { ReactNode } from "react";

type RoadmapHitoProps = {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
};

export default function RoadmapHito({ icono, titulo, descripcion }: RoadmapHitoProps) {
  return (
    <div
      className="group"
      style={{
        background: "#1C0D35",
        border: "1px solid rgba(157,92,192,0.25)",
        borderLeft: "3px solid #9D5CC0",
        borderRadius: "10px",
        padding: "16px 20px",
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(157,92,192,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Ícono */}
      <div
        style={{
          flexShrink: 0,
          color: "#9D5CC0",
          width: "24px",
          height: "24px",
          marginTop: "2px",
        }}
      >
        {icono}
      </div>

      {/* Contenido */}
      <div>
        <h4
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#FFFFFF",
            margin: "0 0 4px 0",
            lineHeight: 1.3,
          }}
        >
          {titulo}
        </h4>
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.65)",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {descripcion}
        </p>
      </div>
    </div>
  );
}
