"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Play,
  BarChart2,
  Video,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { registrarLecturaAction } from "@/app/actions/lecturas";
import type { Entregable } from "@/types";

type EntregableCardProps = {
  entregable: Entregable;
  yaLeido: boolean;
  onOpen: (entregable: Entregable) => void;
};

const ICONOS: Record<Entregable["tipo"], ReactNode> = {
  pdf: <FileText size={18} color="#9D5CC0" />,
  video: <Play size={18} color="#9D5CC0" />,
  reporte: <BarChart2 size={18} color="#9D5CC0" />,
  registro_reunion: <Video size={18} color="#9D5CC0" />,
  agenda: <Calendar size={18} color="#9D5CC0" />,
};

const TIPO_LABELS: Record<Entregable["tipo"], string> = {
  pdf: "PDF",
  video: "VIDEO",
  reporte: "REPORTE",
  registro_reunion: "REUNIÓN",
  agenda: "AGENDA",
};

export default function EntregableCard({
  entregable,
  yaLeido,
  onOpen,
}: EntregableCardProps) {
  const [leido, setLeido] = useState(yaLeido);

  if (entregable.estado === "pendiente") return null;

  const esRechazado = entregable.estado === "rechazado";
  const esAceptado = entregable.estado === "enviado" || entregable.estado === "aprobado";

  async function handleClick() {
    onOpen(entregable);
    if (!leido && !esRechazado) {
      setLeido(true);
      registrarLecturaAction({ entregable_id: entregable.id });
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Conector horizontal ─────● */}
      <div style={{ position: "relative", width: "24px", flexShrink: 0, height: "2px" }}>
        <div style={{ width: "100%", height: "2px", backgroundColor: "#9D5CC0" }} />
        <div
          style={{
            position: "absolute",
            right: "-3px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#9D5CC0",
          }}
        />
      </div>

      {/* Card */}
      <motion.button
        onClick={handleClick}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          backgroundColor: "var(--card-bg)",
          border: `1px solid ${
            esRechazado
              ? "rgba(239,68,68,0.4)"
              : leido
              ? "rgba(74,222,128,0.3)"
              : "rgba(157,92,192,0.4)"
          }`,
          borderRadius: "12px",
          cursor: "pointer",
          textAlign: "left",
          opacity: leido && !esRechazado ? 0.8 : 1,
          width: "100%",
          boxShadow: "0 2px 20px rgba(59,30,99,0.1)",
        }}
      >
        {/* Ícono de tipo */}
        <div style={{ flexShrink: 0 }}>{ICONOS[entregable.tipo]}</div>

        {/* Título, tipo-label y descripción */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                fontWeight: 700,
                color: esRechazado ? "rgba(255,255,255,0.4)" : "#FFFFFF",
                textDecoration: esRechazado ? "line-through" : "none",
                fontFamily: "Merriweather, Georgia, serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "160px",
              }}
            >
              {entregable.titulo}
            </p>
            <span
              style={{
                fontSize: "0.6rem",
                color: "rgba(157,92,192,0.6)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                flexShrink: 0,
              }}
            >
              {TIPO_LABELS[entregable.tipo]}
            </span>
          </div>

          {entregable.descripcion && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {entregable.descripcion}
            </p>
          )}
        </div>

        {/* Estado: badge + leido check */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}>
          {esRechazado && (
            <>
              <XCircle size={14} color="#EF4444" />
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#EF4444",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                RECHAZADO
              </span>
            </>
          )}

          {esAceptado && (
            <>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#4ADE80",
                  backgroundColor: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.3)",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                ACEPTADO
              </span>

              <AnimatePresence>
                {leido && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle2 size={14} color="#4ADE80" />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.button>
    </div>
  );
}
