"use client";

import { useState } from "react";
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

function formatFechaLarga(fecha?: string): string {
  if (!fecha) return "Sin fecha";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(fecha));
  } catch {
    return fecha;
  }
}

type Props = { reuniones: Reunion[] };

export default function CalendarioReuniones({ reuniones }: Props) {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  const porDia = new Map<string, Reunion[]>();
  for (const r of reuniones) {
    const clave = claveDeISO(r.fecha);
    if (!clave) continue;
    if (!porDia.has(clave)) porDia.set(clave, []);
    porDia.get(clave)!.push(r);
  }

  const hoy = new Date();
  const reunionesSeleccionadas = diaSeleccionado ? (porDia.get(diaSeleccionado) ?? []) : [];

  return (
    <div>
      {/* Navegación de año */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => { setAnio((a) => a - 1); setDiaSeleccionado(null); }}
          style={{
            background: "none",
            border: "1px solid rgba(157,92,192,0.3)",
            color: "rgba(157,92,192,0.7)",
            borderRadius: "6px",
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          ← {anio - 1}
        </button>

        <span
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#FFFFFF",
          }}
        >
          {anio}
        </span>

        <button
          onClick={() => { setAnio((a) => a + 1); setDiaSeleccionado(null); }}
          style={{
            background: "none",
            border: "1px solid rgba(157,92,192,0.3)",
            color: "rgba(157,92,192,0.7)",
            borderRadius: "6px",
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {anio + 1} →
        </button>
      </div>

      {/* Grilla de meses */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "24px",
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
            <div
              key={mes}
              style={{
                backgroundColor: "rgba(157,92,192,0.04)",
                border: "1px solid rgba(157,92,192,0.1)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "0.7rem",
                  color: "#9D5CC0",
                  fontFamily: "Merriweather, Georgia, serif",
                  fontWeight: 700,
                  marginBottom: "8px",
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
                  const esSel = diaSeleccionado === clave;

                  return (
                    <button
                      key={clave}
                      onClick={() =>
                        tieneReuniones
                          ? setDiaSeleccionado(esSel ? null : clave)
                          : undefined
                      }
                      title={tieneReuniones ? rs.map((r) => r.nombre).join(" · ") : undefined}
                      style={{
                        position: "relative",
                        fontSize: "0.6rem",
                        color: tieneReuniones
                          ? "#FFFFFF"
                          : esHoy
                          ? "#9D5CC0"
                          : "rgba(255,255,255,0.4)",
                        textAlign: "center",
                        padding: "3px 1px",
                        background: esSel
                          ? "rgba(157,92,192,0.25)"
                          : esHoy
                          ? "rgba(157,92,192,0.12)"
                          : "none",
                        border: esSel
                          ? "1px solid #9D5CC0"
                          : esHoy
                          ? "1px solid rgba(157,92,192,0.3)"
                          : "1px solid transparent",
                        borderRadius: "3px",
                        cursor: tieneReuniones ? "pointer" : "default",
                        fontWeight: tieneReuniones ? 700 : 400,
                        lineHeight: "1.6",
                      }}
                    >
                      {dia}
                      {tieneReuniones && (
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

      {/* Detalle del día seleccionado */}
      {reunionesSeleccionadas.length > 0 && (
        <div
          style={{
            backgroundColor: "rgba(157,92,192,0.06)",
            border: "1px solid rgba(157,92,192,0.2)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              color: "rgba(157,92,192,0.6)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 12px 0",
            }}
          >
            {reunionesSeleccionadas.length === 1 ? "Reunión" : "Reuniones"}
          </p>

          {reunionesSeleccionadas.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid rgba(157,92,192,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "Merriweather, Georgia, serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#FFFFFF",
                  }}
                >
                  {r.nombre}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: r.completada
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(157,92,192,0.1)",
                    color: r.completada ? "#22c55e" : "#9D5CC0",
                    fontWeight: 600,
                  }}
                >
                  {r.completada ? "Completada" : "Pendiente"}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(157,92,192,0.5)",
                  }}
                >
                  Fase {r.fase} · #{r.numero}
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.45)",
                  margin: "0 0 10px 0",
                }}
              >
                {formatFechaLarga(r.fecha)}
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {r.agenda_url && (
                  <a
                    href={r.agenda_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.8rem",
                      color: "#9D5CC0",
                      textDecoration: "none",
                      padding: "4px 12px",
                      border: "1px solid rgba(157,92,192,0.3)",
                      borderRadius: "6px",
                    }}
                  >
                    Ver agenda →
                  </a>
                )}
                {r.grabacion_url && (
                  <a
                    href={r.grabacion_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      padding: "4px 12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                    }}
                  >
                    Ver grabación →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reuniones.filter((r) => r.fecha).length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.875rem",
            marginTop: "16px",
          }}
        >
          No hay reuniones programadas aún.
        </p>
      )}
    </div>
  );
}
