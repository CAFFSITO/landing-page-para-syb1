"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, ExternalLink, Calendar } from "lucide-react";
import CalendarioReuniones from "@/components/lobby/CalendarioReuniones";
import type { Reunion } from "@/types";

type SubTab = "calendario" | "proximas";

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

function formatFechaCorta(fecha: string): string {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(fecha));
  } catch {
    return fecha;
  }
}

function diasHasta(fecha: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const target = new Date(fecha);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ReunionesSection({ reuniones }: { reuniones: Reunion[] }) {
  const [sub, setSub] = useState<SubTab>("calendario");

  const ahora = new Date();
  const proximas = reuniones
    .filter((r) => r.fecha && new Date(r.fecha) > ahora)
    .sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());

  return (
    <div>
      {/* Sub-tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(157,92,192,0.15)",
          marginBottom: "28px",
          gap: "0",
        }}
      >
        {(
          [
            { key: "calendario" as SubTab, label: "Calendario" },
            { key: "proximas" as SubTab, label: "Próximas reuniones" },
          ] as const
        ).map(({ key, label }) => {
          const activa = sub === key;
          return (
            <button
              key={key}
              onClick={() => setSub(key)}
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                borderBottom: activa ? "2px solid #9D5CC0" : "2px solid transparent",
                color: activa ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                fontFamily: "Merriweather, Georgia, serif",
                fontWeight: activa ? 700 : 400,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "color 200ms ease, border-color 200ms ease",
                position: "relative",
              }}
            >
              {label}
              {key === "proximas" && proximas.length > 0 && (
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "0.65rem",
                    backgroundColor: "#9D5CC0",
                    color: "#FFFFFF",
                    borderRadius: "999px",
                    padding: "1px 6px",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  {proximas.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
        >
          {sub === "calendario" && <CalendarioReuniones reuniones={reuniones} />}

          {sub === "proximas" && (
            <div>
              {proximas.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 0",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  <Calendar size={32} color="rgba(157,92,192,0.3)" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>
                    No hay reuniones próximas programadas.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {proximas.map((r) => {
                    const dias = diasHasta(r.fecha!);
                    return (
                      <ProximaCard key={r.id} reunion={r} diasHasta={dias} />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProximaCard({ reunion, diasHasta }: { reunion: Reunion; diasHasta: number }) {
  const etiquetaDias =
    diasHasta === 0
      ? "Hoy"
      : diasHasta === 1
      ? "Mañana"
      : `En ${diasHasta} días`;

  return (
    <div
      style={{
        backgroundColor: "rgba(157,92,192,0.05)",
        border: "1px solid rgba(157,92,192,0.18)",
        borderLeft: "3px solid #9D5CC0",
        borderRadius: "10px",
        padding: "18px 20px",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Video size={16} color="#9D5CC0" />
          <span
            style={{
              fontFamily: "Merriweather, Georgia, serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#FFFFFF",
            }}
          >
            {reunion.nombre}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              color: "rgba(157,92,192,0.6)",
              fontWeight: 600,
            }}
          >
            Fase {reunion.fase} · #{reunion.numero}
          </span>
        </div>

        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: diasHasta === 0 ? "#4ADE80" : "#9D5CC0",
            backgroundColor:
              diasHasta === 0 ? "rgba(74,222,128,0.1)" : "rgba(157,92,192,0.1)",
            border: `1px solid ${diasHasta === 0 ? "rgba(74,222,128,0.3)" : "rgba(157,92,192,0.25)"}`,
            borderRadius: "999px",
            padding: "3px 10px",
            flexShrink: 0,
          }}
        >
          {etiquetaDias}
        </span>
      </div>

      {/* Fecha larga */}
      {reunion.fecha && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 14px 26px",
            textTransform: "capitalize",
          }}
        >
          {formatFechaLarga(reunion.fecha)}
        </p>
      )}

      {/* Notas */}
      {reunion.notas && (
        <div
          style={{
            marginLeft: "26px",
            marginBottom: "14px",
            padding: "10px 14px",
            backgroundColor: "rgba(157,92,192,0.06)",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {reunion.notas}
        </div>
      )}

      {/* Links */}
      {(reunion.agenda_url || reunion.grabacion_url) && (
        <div style={{ display: "flex", gap: "10px", marginLeft: "26px", flexWrap: "wrap" }}>
          {reunion.agenda_url && (
            <a
              href={reunion.agenda_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.8rem",
                color: "#9D5CC0",
                textDecoration: "none",
                padding: "5px 12px",
                border: "1px solid rgba(157,92,192,0.3)",
                borderRadius: "6px",
                transition: "background 150ms",
              }}
            >
              <ExternalLink size={12} />
              Ver agenda
            </a>
          )}
          {reunion.grabacion_url && (
            <a
              href={reunion.grabacion_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                padding: "5px 12px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
              }}
            >
              <ExternalLink size={12} />
              Ver grabación
            </a>
          )}
        </div>
      )}
    </div>
  );
}
