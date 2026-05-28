"use client";

import type { Reunion } from "@/types";

const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function diasEnMes(anio: number, mes: number) {
  return new Date(anio, mes + 1, 0).getDate();
}

function offsetPrimerDia(anio: number, mes: number) {
  return (new Date(anio, mes, 1).getDay() + 6) % 7;
}

function claveDia(anio: number, mes: number, dia: number) {
  return `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function claveDeISO(fecha?: string): string | null {
  if (!fecha) return null;
  try {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

type Props = {
  fase: 1 | 2 | 3;
  reuniones: Reunion[];
  onDiaClick: (isoFecha: string, reunionesEnDia: Reunion[]) => void;
};

export default function CalendarioFase({ fase, reuniones, onDiaClick }: Props) {
  const anio = new Date().getFullYear();

  const porDia = new Map<string, Reunion[]>();
  for (const r of reuniones) {
    const clave = claveDeISO(r.fecha);
    if (!clave) continue;
    if (!porDia.has(clave)) porDia.set(clave, []);
    porDia.get(clave)!.push(r);
  }

  const hoy = new Date();
  const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "20px",
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          fontWeight: 500,
          color: "var(--foreground-subtle)",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          margin: "0 0 16px 0",
        }}
      >
        Calendario {anio} · Fase 0{fase}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {Array.from({ length: 12 }, (_, mes) => {
          const dias = diasEnMes(anio, mes);
          const offset = offsetPrimerDia(anio, mes);
          const celdas: (number | null)[] = [
            ...Array(offset).fill(null),
            ...Array.from({ length: dias }, (_, i) => i + 1),
          ];
          const resto = celdas.length % 7;
          if (resto > 0) for (let i = 0; i < 7 - resto; i++) celdas.push(null);

          return (
            <div
              key={mes}
              style={{
                padding: "10px",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--surface-1)",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: "var(--foreground-subtle)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                {MESES[mes]}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "1px",
                }}
              >
                {DIAS.map((d) => (
                  <div
                    key={d}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.55rem",
                      color: "var(--foreground-subtle)",
                      textAlign: "center",
                      padding: "2px 0",
                      fontWeight: 500,
                    }}
                  >
                    {d}
                  </div>
                ))}

                {celdas.map((dia, idx) => {
                  if (dia === null) return <div key={`v-${idx}`} />;
                  const clave = claveDia(anio, mes, dia);
                  const rs = porDia.get(clave) ?? [];
                  const tieneReuniones = rs.length > 0;
                  const esHoy =
                    anio === hoy.getFullYear() &&
                    mes === hoy.getMonth() &&
                    dia === hoy.getDate();
                  const esPasado = !esHoy && clave < hoyISO;

                  return (
                    <button
                      key={clave}
                      onClick={() => {
                        const iso = new Date(anio, mes, dia, 9, 0, 0).toISOString();
                        onDiaClick(iso, rs);
                      }}
                      title={
                        tieneReuniones
                          ? rs.map((r) => r.nombre).join(" · ")
                          : `Agregar reunión el ${dia}/${mes + 1}`
                      }
                      style={{
                        position: "relative",
                        fontSize: "0.6rem",
                        color: esPasado
                          ? "var(--foreground-subtle)"
                          : tieneReuniones
                          ? "var(--foreground)"
                          : esHoy
                          ? "var(--foreground)"
                          : "var(--foreground-muted)",
                        textAlign: "center",
                        padding: "3px 1px",
                        opacity: esPasado ? 0.4 : 1,
                        background: esHoy ? "var(--surface-2)" : "none",
                        border: esHoy ? "1px solid var(--hairline-strong)" : "1px solid transparent",
                        borderRadius: "var(--radius-xs)",
                        cursor: "pointer",
                        fontWeight: (!esPasado && tieneReuniones) ? 600 : 400,
                        lineHeight: "1.6",
                      }}
                    >
                      {dia}
                      {tieneReuniones && !esPasado && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "1px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            backgroundColor: rs.some((r) => r.completada)
                              ? "var(--color-success)"
                              : "var(--color-secondary)",
                            display: "block",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
