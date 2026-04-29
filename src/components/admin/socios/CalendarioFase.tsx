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
        padding: "16px",
        backgroundColor: "rgba(157,92,192,0.04)",
        border: "1px solid rgba(157,92,192,0.1)",
        borderRadius: "8px",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          color: "rgba(157,92,192,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "12px",
          margin: "0 0 12px 0",
        }}
      >
        Calendario {anio} — Fase {fase}
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
          if (resto > 0) {
            for (let i = 0; i < 7 - resto; i++) celdas.push(null);
          }

          return (
            <div key={mes}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "0.65rem",
                  color: "#9D5CC0",
                  fontFamily: "Merriweather, Georgia, serif",
                  fontWeight: 700,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
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
                      fontSize: "0.55rem",
                      color: "rgba(157,92,192,0.4)",
                      textAlign: "center",
                      padding: "2px 0",
                      fontWeight: 600,
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
                          ? "rgba(255,255,255,0.25)"
                          : tieneReuniones
                          ? "#FFFFFF"
                          : esHoy
                          ? "#9D5CC0"
                          : "rgba(255,255,255,0.45)",
                        textAlign: "center",
                        padding: "3px 1px",
                        opacity: esPasado ? 0.35 : 1,
                        background: esHoy ? "rgba(157,92,192,0.15)" : "none",
                        border: esHoy ? "1px solid rgba(157,92,192,0.3)" : "1px solid transparent",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontWeight: (!esPasado && tieneReuniones) ? 700 : 400,
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
                              ? "#22c55e"
                              : "#9D5CC0",
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
