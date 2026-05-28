"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
function claveFecha(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function claveDeISO(fecha?: string): string | null {
  if (!fecha) return null;
  try { return claveFecha(new Date(fecha)); } catch { return null; }
}
function getLunes(d: Date): Date {
  const r = new Date(d);
  const dow = r.getDay();
  r.setDate(r.getDate() + (dow === 0 ? -6 : 1 - dow));
  r.setHours(0, 0, 0, 0);
  return r;
}
function formatFechaLarga(fecha?: string): string {
  if (!fecha) return "Sin fecha";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long", day: "numeric", month: "long",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(fecha));
  } catch { return fecha; }
}

type Vista = "año" | "mes" | "semana";
type Props = { reuniones: Reunion[] };

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.65rem",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "var(--foreground-subtle)",
};

const navBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid var(--hairline-strong)",
  color: "var(--foreground)",
  borderRadius: "var(--radius-sm)",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "0.78rem",
  fontFamily: "var(--font-sans)",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: "background-color 150ms ease",
};

const tituloStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 700,
  fontSize: "1.15rem",
  color: "var(--foreground)",
  letterSpacing: "-0.005em",
};

export default function CalendarioReuniones({ reuniones }: Props) {
  const now = new Date();
  const hoyISO = claveFecha(now);

  const [vista, setVista] = useState<Vista>("mes");
  const [anio, setAnio] = useState(now.getFullYear());
  const [mesMes, setMesMes] = useState(now.getMonth());
  const [mesAnio, setMesAnio] = useState(now.getFullYear());
  const [lunes, setLunes] = useState<Date>(getLunes(now));
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  const porDia = new Map<string, Reunion[]>();
  for (const r of reuniones) {
    const clave = claveDeISO(r.fecha);
    if (!clave) continue;
    if (!porDia.has(clave)) porDia.set(clave, []);
    porDia.get(clave)!.push(r);
  }

  const reunionesSeleccionadas = diaSeleccionado ? (porDia.get(diaSeleccionado) ?? []) : [];

  function toggleDia(clave: string) {
    const esPasado = clave !== hoyISO && clave < hoyISO;
    if (esPasado) return;
    const rs = porDia.get(clave) ?? [];
    if (rs.length === 0) return;
    setDiaSeleccionado((p) => (p === clave ? null : clave));
  }

  function prevMes() {
    if (mesMes === 0) { setMesMes(11); setMesAnio((a) => a - 1); }
    else setMesMes((m) => m - 1);
    setDiaSeleccionado(null);
  }
  function nextMes() {
    if (mesMes === 11) { setMesMes(0); setMesAnio((a) => a + 1); }
    else setMesMes((m) => m + 1);
    setDiaSeleccionado(null);
  }
  function prevSemana() {
    setLunes((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
    setDiaSeleccionado(null);
  }
  function nextSemana() {
    setLunes((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
    setDiaSeleccionado(null);
  }

  function celdaBgColor(esSel: boolean, esHoy: boolean, tiene: boolean, esPasado: boolean): string {
    if (esSel) return "var(--color-accent-soft)";
    if (esHoy) return "var(--surface-2)";
    if (tiene && !esPasado) return "var(--surface-2)";
    return "transparent";
  }

  function celdaBorder(esSel: boolean, esHoy: boolean): string {
    if (esSel) return "1px solid var(--color-secondary)";
    if (esHoy) return "1px solid var(--hairline-strong)";
    return "1px solid transparent";
  }

  function CeldaAnio({ clave, diaNum }: { clave: string; diaNum: number }) {
    const rs = porDia.get(clave) ?? [];
    const tiene = rs.length > 0;
    const esHoy = clave === hoyISO;
    const esPasado = !esHoy && clave < hoyISO;
    const esSel = diaSeleccionado === clave;
    return (
      <button
        onClick={() => toggleDia(clave)}
        title={!esPasado && tiene ? rs.map((r) => r.nombre).join(" · ") : undefined}
        style={{
          position: "relative",
          fontSize: "0.6rem",
          color: esPasado ? "var(--foreground-subtle)" : "var(--foreground)",
          textAlign: "center",
          padding: "3px 1px",
          background: celdaBgColor(esSel, esHoy, tiene, esPasado),
          border: celdaBorder(esSel, esHoy),
          borderRadius: "var(--radius-xs)",
          cursor: !esPasado && tiene ? "pointer" : "default",
          fontWeight: !esPasado && tiene ? 600 : 400,
          lineHeight: "1.6",
        }}
      >
        {diaNum}
        {tiene && !esPasado && (
          <span
            style={{
              position: "absolute", bottom: "1px", left: "50%",
              transform: "translateX(-50%)", width: "3px", height: "3px",
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
  }

  function GridMes({ a, m, grande }: { a: number; m: number; grande?: boolean }) {
    const dias = diasEnMes(a, m);
    const offset = offsetPrimerDia(a, m);
    const celdas: (number | null)[] = [
      ...Array(offset).fill(null),
      ...Array.from({ length: dias }, (_, i) => i + 1),
    ];
    const resto = celdas.length % 7;
    if (resto > 0) for (let i = 0; i < 7 - resto; i++) celdas.push(null);

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: grande ? "4px" : "1px" }}>
        {DIAS.map((d) => (
          <div
            key={d}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: grande ? "0.65rem" : "0.55rem",
              color: "var(--foreground-subtle)",
              textAlign: "center",
              padding: grande ? "6px 0" : "2px 0",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {d}
          </div>
        ))}
        {celdas.map((dia, idx) => {
          if (dia === null) return <div key={`v-${idx}`} />;
          const clave = claveDia(a, m, dia);
          if (!grande) return <CeldaAnio key={clave} clave={clave} diaNum={dia} />;

          const rs = porDia.get(clave) ?? [];
          const tiene = rs.length > 0;
          const esHoy = clave === hoyISO;
          const esPasado = !esHoy && clave < hoyISO;
          const esSel = diaSeleccionado === clave;
          return (
            <button
              key={clave}
              onClick={() => toggleDia(clave)}
              title={!esPasado && tiene ? rs.map((r) => r.nombre).join(" · ") : undefined}
              style={{
                position: "relative",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: esPasado ? "var(--foreground-subtle)" : "var(--foreground)",
                textAlign: "center",
                padding: "10px 4px",
                background: celdaBgColor(esSel, esHoy, tiene, esPasado),
                border: celdaBorder(esSel, esHoy),
                borderRadius: "var(--radius-sm)",
                cursor: !esPasado && tiene ? "pointer" : "default",
                fontWeight: !esPasado && tiene ? 600 : 400,
              }}
            >
              {dia}
              {tiene && !esPasado && (
                <span
                  style={{
                    position: "absolute", bottom: "3px", left: "50%",
                    transform: "translateX(-50%)", width: "4px", height: "4px",
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
    );
  }

  function PanelDetalle() {
    if (reunionesSeleccionadas.length === 0) return null;
    return (
      <div
        style={{
          backgroundColor: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-md)",
          padding: "22px 24px",
        }}
      >
        <p style={{ ...eyebrowStyle, margin: "0 0 14px 0" }}>
          {reunionesSeleccionadas.length === 1 ? "Reunión" : `${reunionesSeleccionadas.length} reuniones`}
        </p>
        {reunionesSeleccionadas.map((r, idx) => (
          <div
            key={r.id}
            style={{
              padding: "16px 0",
              borderTop: idx === 0 ? "none" : "1px solid var(--hairline)",
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
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--foreground)",
                  letterSpacing: "-0.005em",
                }}
              >
                {r.nombre}
              </span>
              <span className={r.completada ? "syb-tag syb-tag-success" : "syb-tag syb-tag-accent"}>
                {r.completada ? "Completada" : "Pendiente"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--foreground-subtle)",
                }}
              >
                Fase 0{r.fase} · #{r.numero}
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", margin: "0 0 12px 0" }}>
              {formatFechaLarga(r.fecha)}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {r.agenda_url && (
                <a
                  href={r.agenda_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="syb-btn-ghost"
                  style={{ textDecoration: "none", padding: "6px 14px", fontSize: "0.78rem" }}
                >
                  Ver agenda
                </a>
              )}
              {r.grabacion_url && (
                <a
                  href={r.grabacion_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="syb-btn-ghost"
                  style={{ textDecoration: "none", padding: "6px 14px", fontSize: "0.78rem" }}
                >
                  Ver grabación
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Selector de vista — tabs hairline (sin píldoras) */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--hairline)" }}>
        {(["año", "mes", "semana"] as Vista[]).map((v) => {
          const activo = vista === v;
          return (
            <button
              key={v}
              onClick={() => { setVista(v); setDiaSeleccionado(null); }}
              style={{
                position: "relative",
                padding: "10px 16px",
                background: "none",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                fontWeight: activo ? 600 : 500,
                color: activo ? "var(--foreground)" : "var(--foreground-muted)",
                cursor: "pointer",
                transition: "color 180ms ease",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
              {activo && (
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: -1,
                    height: 1,
                    backgroundColor: "var(--foreground)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* VISTA AÑO */}
      {vista === "año" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => { setAnio((a) => a - 1); setDiaSeleccionado(null); }} style={navBtnStyle}>
              <ChevronLeft size={14} strokeWidth={1.5} /> {anio - 1}
            </button>
            <span style={tituloStyle}>{anio}</span>
            <button onClick={() => { setAnio((a) => a + 1); setDiaSeleccionado(null); }} style={navBtnStyle}>
              {anio + 1} <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {Array.from({ length: 12 }, (_, mes) => (
              <div
                key={mes}
                style={{
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-sm)",
                  padding: "14px 12px",
                  backgroundColor: "var(--surface-1)",
                }}
              >
                <div
                  style={{
                    ...eyebrowStyle,
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {MESES[mes]}
                </div>
                <GridMes a={anio} m={mes} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* VISTA MES */}
      {vista === "mes" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={prevMes} style={navBtnStyle}>
              <ChevronLeft size={14} strokeWidth={1.5} /> {MESES[(mesMes + 11) % 12]}
            </button>
            <span style={tituloStyle}>{MESES[mesMes]} {mesAnio}</span>
            <button onClick={nextMes} style={navBtnStyle}>
              {MESES[(mesMes + 1) % 12]} <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-md)",
              padding: "20px",
              backgroundColor: "var(--surface-1)",
            }}
          >
            <GridMes a={mesAnio} m={mesMes} grande />
          </div>
        </>
      )}

      {/* VISTA SEMANA */}
      {vista === "semana" && (() => {
        const dias7: Date[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(lunes);
          d.setDate(d.getDate() + i);
          return d;
        });
        const primerDia = dias7[0];
        const ultimoDia = dias7[6];
        const mismoMes = primerDia.getMonth() === ultimoDia.getMonth();
        const rangoLabel = mismoMes
          ? `${primerDia.getDate()} – ${ultimoDia.getDate()} de ${MESES[primerDia.getMonth()]} ${primerDia.getFullYear()}`
          : `${primerDia.getDate()} ${MESES[primerDia.getMonth()]} – ${ultimoDia.getDate()} ${MESES[ultimoDia.getMonth()]} ${ultimoDia.getFullYear()}`;

        return (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={prevSemana} style={navBtnStyle}>
                <ChevronLeft size={14} strokeWidth={1.5} /> Anterior
              </button>
              <span style={{ ...tituloStyle, fontSize: "1rem" }}>{rangoLabel}</span>
              <button onClick={nextSemana} style={navBtnStyle}>
                Siguiente <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
              {dias7.map((d, i) => {
                const clave = claveFecha(d);
                const rs = porDia.get(clave) ?? [];
                const tiene = rs.length > 0;
                const esHoy = clave === hoyISO;
                const esPasado = !esHoy && clave < hoyISO;
                const esSel = diaSeleccionado === clave;
                return (
                  <button
                    key={clave}
                    onClick={() => toggleDia(clave)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      padding: "14px 6px",
                      borderRadius: "var(--radius-sm)",
                      border: celdaBorder(esSel, esHoy),
                      background: celdaBgColor(esSel, esHoy, tiene, esPasado),
                      cursor: !esPasado && tiene ? "pointer" : "default",
                      transition: "background 180ms ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        color: esHoy ? "var(--foreground)" : "var(--foreground-subtle)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {DIAS[i]}
                    </span>
                    <span
                      style={{
                        fontSize: "1.15rem",
                        fontFamily: "var(--font-serif)",
                        fontWeight: 700,
                        color: esPasado ? "var(--foreground-subtle)" : "var(--foreground)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {d.getDate()}
                    </span>
                    {tiene && !esPasado && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          width: "100%",
                          paddingTop: "6px",
                          borderTop: "1px solid var(--hairline)",
                        }}
                      >
                        {rs.slice(0, 2).map((r) => (
                          <span
                            key={r.id}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.55rem",
                              color: r.completada ? "var(--color-success)" : "var(--foreground-muted)",
                              textAlign: "center",
                              lineHeight: 1.3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.nombre}
                          </span>
                        ))}
                        {rs.length > 2 && (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--foreground-subtle)", textAlign: "center" }}>
                            +{rs.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        );
      })()}

      <PanelDetalle />

      {reuniones.filter((r) => r.fecha).length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "var(--foreground-subtle)",
            fontSize: "0.875rem",
            fontStyle: "italic",
            marginTop: "8px",
          }}
        >
          No hay reuniones programadas aún.
        </p>
      )}
    </div>
  );
}
