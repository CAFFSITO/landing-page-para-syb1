import type { ReactNode } from "react";

type RoadmapHitoProps = {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
};

export default function RoadmapHito({ icono, titulo, descripcion }: RoadmapHitoProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          color: "var(--foreground-muted)",
          width: "20px",
          height: "20px",
          marginTop: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icono}
      </div>

      <div>
        <h4
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "var(--foreground)",
            margin: "0 0 4px 0",
            lineHeight: 1.3,
            letterSpacing: "-0.005em",
          }}
        >
          {titulo}
        </h4>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--foreground-muted)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {descripcion}
        </p>
      </div>
    </div>
  );
}
