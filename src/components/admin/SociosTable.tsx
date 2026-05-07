"use client";

import Link from "next/link";

import type { Socio } from "@/types";

export type SocioRow = Pick<
  Socio,
  | "id"
  | "nombre"
  | "empresa"
  | "fase_actual"
  | "fase_1_done"
  | "fase_2_done"
  | "fase_3_done"
  | "activo"
  | "created_at"
>;

type Props = {
  socios: SocioRow[];
  ultimaActividad: Record<string, string>;
};

function tiempoRelativo(fechaStr: string | undefined): string {
  if (!fechaStr) return "Nunca";
  const diff = Date.now() - new Date(fechaStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Hace un momento";
  if (mins < 60) return `Hace ${mins} min`;
  const hs = Math.floor(mins / 60);
  if (hs < 24) return `Hace ${hs} h`;
  const dias = Math.floor(hs / 24);
  if (dias === 1) return "Hace 1 día";
  if (dias < 30) return `Hace ${dias} días`;
  const meses = Math.floor(dias / 30);
  if (meses === 1) return "Hace 1 mes";
  return `Hace ${meses} meses`;
}

function calcularProgreso(socio: SocioRow): number {
  const done = [socio.fase_1_done, socio.fase_2_done, socio.fase_3_done].filter(Boolean).length;
  return Math.round((done / 3) * 100);
}

const headStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  color: "var(--foreground-subtle)",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const cellBase: React.CSSProperties = {
  padding: "14px 16px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
};

export default function SociosTable({ socios, ultimaActividad }: Props) {
  return (
    <div
      style={{
        overflowX: "auto",
        backgroundColor: "var(--surface-1)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
            {["Nombre", "Empresa", "Fase", "Progreso", "Última actividad", "Acciones"].map((col) => (
              <th key={col} style={headStyle}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {socios.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: "var(--foreground-subtle)",
                  fontStyle: "italic",
                }}
              >
                No hay socios activos.
              </td>
            </tr>
          ) : (
            socios.map((socio, idx) => {
              const progreso = calcularProgreso(socio);
              const ultimaAct = ultimaActividad[socio.id];

              return (
                <tr
                  key={socio.id}
                  style={{
                    borderBottom: idx < socios.length - 1 ? "1px solid var(--hairline)" : "none",
                    transition: "background 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td
                    style={{
                      ...cellBase,
                      color: "var(--foreground)",
                      fontWeight: 600,
                    }}
                  >
                    {socio.nombre}
                  </td>

                  <td style={{ ...cellBase, color: "var(--foreground-muted)" }}>
                    {socio.empresa ?? "—"}
                  </td>

                  <td style={cellBase}>
                    <span className="syb-tag syb-tag-accent">Fase 0{socio.fase_actual}</span>
                  </td>

                  <td style={{ ...cellBase, minWidth: "140px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "3px",
                          backgroundColor: "var(--hairline)",
                          borderRadius: "2px",
                          overflow: "hidden",
                          minWidth: "60px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${progreso}%`,
                            backgroundColor: "var(--foreground)",
                            borderRadius: "2px",
                            transition: "width 600ms ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                          color: "var(--foreground-subtle)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {progreso}%
                      </span>
                    </div>
                  </td>

                  <td
                    style={{
                      ...cellBase,
                      color: "var(--foreground-muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {tiempoRelativo(ultimaAct)}
                  </td>

                  <td style={cellBase}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href="/lobby"
                        className="syb-btn-ghost"
                        style={{ textDecoration: "none", padding: "5px 12px", fontSize: "0.75rem" }}
                      >
                        Ver lobby
                      </Link>
                      <Link
                        href={`/admin/socios/${socio.id}`}
                        className="syb-btn-ghost"
                        style={{ textDecoration: "none", padding: "5px 12px", fontSize: "0.75rem" }}
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
