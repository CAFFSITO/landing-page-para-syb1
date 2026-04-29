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
function claveFecha(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function claveDeISO(fecha?: string): string | null {
  if (!fecha) return null;
  try {
    const d = new Date(fecha);
    return claveFecha(d);
  } catch { return null; }
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

const btnNav: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(157,92,192,0.3)",
  color: "rgba(157,92,192,0.7)",
  borderRadius: "6px",
  padding: "6px 14px",
  cursor: "pointer",
  fontSize: "0.8rem",
};
const titulo: React.CSSProperties = {
  fontFamily: "Merriweather, Georgia, serif",
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#FFFFFF",
};

export default function CalendarioReuniones({ reuniones }: Props) {
  const now = new Date();
  const hoyISO = claveFecha(now);

  const [vista, setVista] = useState<Vista>("año");
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

  // ── Celda pequeña (vista año) ──────────────────────────────────
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
          color: esPasado ? "rgba(255,255,255,0.3)" : "#FFFFFF",
          textAlign: "center",
          padding: "3px 1px",
          opacity: 1,
          background: esSel ? "rgba(157,92,192,0.3)" : esHoy ? "rgba(157,92,192,0.2)" : "none",
          border: esSel ? "1px solid #9D5CC0" : esHoy ? "1px solid rgba(157,92,192,0.55)" : "1px solid transparent",
          borderRadius: "3px",
          cursor: !esPasado && tiene ? "pointer" : "default",
          fontWeight: !esPasado && tiene ? 700 : 400,
          lineHeight: "1.6",
        }}
      >
        {diaNum}
        {tiene && !esPasado && (
          <span style={{
            position: "absolute", bottom: "1px", left: "50%",
            transform: "translateX(-50%)", width: "3px", height: "3px",
            borderRadius: "50%",
            backgroundColor: rs.some((r) => r.completada) ? "#22c55e" : "#9D5CC0",
            display: "block",
          }} />
        )}
      </button>
    );
  }

  // ── Grid de un mes (reutilizado en año y mes) ──────────────────
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
          <div key={d} style={{
            fontSize: grande ? "0.7rem" : "0.55rem",
            color: "rgba(157,92,192,0.45)",
            textAlign: "center",
            padding: grande ? "4px 0" : "2px 0",
            fontWeight: 600,
          }}>{d}</div>
        ))}
        {celdas.map((dia, idx) => {
          if (dia === null) return <div key={`v-${idx}`} />;
          const clave = claveDia(a, m, dia);
          if (!grande) return <CeldaAnio key={clave} clave={clave} diaNum={dia} />;

          // Celda grande (vista mes)
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
                fontSize: "0.8rem",
                color: esPasado ? "rgba(255,255,255,0.3)" : "#FFFFFF",
                textAlign: "center",
                padding: "8px 4px",
                opacity: 1,
                background: esSel ? "rgba(157,92,192,0.3)" : esHoy ? "rgba(157,92,192,0.2)" : tiene && !esPasado ? "rgba(157,92,192,0.08)" : "none",
                border: esSel ? "1px solid #9D5CC0" : esHoy ? "1px solid rgba(157,92,192,0.55)" : "1px solid transparent",
                borderRadius: "6px",
                cursor: !esPasado && tiene ? "pointer" : "default",
                fontWeight: !esPasado && tiene ? 700 : 400,
                lineHeight: "1.4",
              }}
            >
              {dia}
              {tiene && !esPasado && (
                <span style={{
                  position: "absolute", bottom: "2px", left: "50%",
                  transform: "translateX(-50%)", width: "4px", height: "4px",
                  borderRadius: "50%",
                  backgroundColor: rs.some((r) => r.completada) ? "#22c55e" : "#9D5CC0",
                  display: "block",
                }} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Panel de detalle (compartido) ─────────────────────────────
  function PanelDetalle() {
    if (reunionesSeleccionadas.length === 0) return null;
    return (
      <div style={{ backgroundColor: "rgba(157,92,192,0.06)", border: "1px solid rgba(157,92,192,0.2)", borderRadius: "10px", padding: "20px" }}>
        <p style={{ fontSize: "0.7rem", color: "rgba(157,92,192,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px 0" }}>
          {reunionesSeleccionadas.length === 1 ? "Reunión" : "Reuniones"}
        </p>
        {reunionesSeleccionadas.map((r) => (
          <div key={r.id} style={{ padding: "14px 0", borderBottom: "1px solid rgba(157,92,192,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Merriweather, Georgia, serif", fontWeight: 700, fontSize: "0.95rem", color: "#FFFFFF" }}>{r.nombre}</span>
              <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "999px", backgroundColor: r.completada ? "rgba(34,197,94,0.1)" : "rgba(157,92,192,0.1)", color: r.completada ? "#22c55e" : "#9D5CC0", fontWeight: 600 }}>
                {r.completada ? "Completada" : "Pendiente"}
              </span>
              <span style={{ fontSize: "0.72rem", color: "rgba(157,92,192,0.5)" }}>Fase {r.fase} · #{r.numero}</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", margin: "0 0 10px 0" }}>{formatFechaLarga(r.fecha)}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {r.agenda_url && (
                <a href={r.agenda_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#9D5CC0", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(157,92,192,0.3)", borderRadius: "6px" }}>
                  Ver agenda →
                </a>
              )}
              {r.grabacion_url && (
                <a href={r.grabacion_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }}>
                  Ver grabación →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>

      {/* ── Selector de vista ─────────────────────────────────── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {(["año", "mes", "semana"] as Vista[]).map((v) => (
          <button
            key={v}
            onClick={() => { setVista(v); setDiaSeleccionado(null); }}
            style={{
              padding: "6px 20px",
              borderRadius: "20px",
              border: vista === v ? "1px solid #9D5CC0" : "1px solid rgba(157,92,192,0.25)",
              background: vista === v ? "rgba(157,92,192,0.2)" : "none",
              color: vista === v ? "#C084FC" : "rgba(157,92,192,0.5)",
              fontSize: "0.8rem",
              fontWeight: vista === v ? 700 : 400,
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "all 0.15s ease",
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* ── VISTA AÑO ─────────────────────────────────────────── */}
      {vista === "año" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <button onClick={() => { setAnio((a) => a - 1); setDiaSeleccionado(null); }} style={btnNav}>← {anio - 1}</button>
            <span style={titulo}>{anio}</span>
            <button onClick={() => { setAnio((a) => a + 1); setDiaSeleccionado(null); }} style={btnNav}>{anio + 1} →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "24px" }}>
            {Array.from({ length: 12 }, (_, mes) => (
              <div key={mes} style={{ backgroundColor: "rgba(157,92,192,0.04)", border: "1px solid rgba(157,92,192,0.1)", borderRadius: "8px", padding: "12px" }}>
                <div style={{ textAlign: "center", fontSize: "0.7rem", color: "#9D5CC0", fontFamily: "Merriweather, Georgia, serif", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {MESES[mes]}
                </div>
                <GridMes a={anio} m={mes} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── VISTA MES ─────────────────────────────────────────── */}
      {vista === "mes" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <button onClick={prevMes} style={btnNav}>← {MESES[(mesMes + 11) % 12]}</button>
            <span style={titulo}>{MESES[mesMes]} {mesAnio}</span>
            <button onClick={nextMes} style={btnNav}>{MESES[(mesMes + 1) % 12]} →</button>
          </div>
          <div style={{ backgroundColor: "rgba(157,92,192,0.04)", border: "1px solid rgba(157,92,192,0.1)", borderRadius: "10px", padding: "16px", marginBottom: "24px" }}>
            <GridMes a={mesAnio} m={mesMes} grande />
          </div>
        </>
      )}

      {/* ── VISTA SEMANA ──────────────────────────────────────── */}
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <button onClick={prevSemana} style={btnNav}>← Anterior</button>
              <span style={{ ...titulo, fontSize: "0.95rem" }}>{rangoLabel}</span>
              <button onClick={nextSemana} style={btnNav}>Siguiente →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "24px" }}>
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
                      padding: "12px 4px",
                      borderRadius: "8px",
                      border: esSel ? "1px solid #9D5CC0" : esHoy ? "1px solid rgba(157,92,192,0.55)" : "1px solid rgba(157,92,192,0.1)",
                      background: esSel ? "rgba(157,92,192,0.25)" : esHoy ? "rgba(157,92,192,0.15)" : tiene && !esPasado ? "rgba(157,92,192,0.06)" : "none",
                      opacity: 1,
                      cursor: !esPasado && tiene ? "pointer" : "default",
                      transition: "background 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "0.6rem", fontWeight: 600, color: esHoy ? "#9D5CC0" : "rgba(157,92,192,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {DIAS[i]}
                    </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: esPasado ? "rgba(255,255,255,0.3)" : "#FFFFFF" }}>
                      {d.getDate()}
                    </span>
                    {tiene && !esPasado && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "100%", paddingTop: "4px", borderTop: "1px solid rgba(157,92,192,0.15)" }}>
                        {rs.slice(0, 2).map((r) => (
                          <span key={r.id} style={{ fontSize: "0.5rem", color: r.completada ? "#22c55e" : "#C084FC", textAlign: "center", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.nombre}
                          </span>
                        ))}
                        {rs.length > 2 && (
                          <span style={{ fontSize: "0.5rem", color: "rgba(157,92,192,0.5)", textAlign: "center" }}>+{rs.length - 2}</span>
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

      {/* ── Panel detalle ─────────────────────────────────────── */}
      <PanelDetalle />

      {reuniones.filter((r) => r.fecha).length === 0 && (
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.875rem", marginTop: "16px" }}>
          No hay reuniones programadas aún.
        </p>
      )}
    </div>
  );
}
