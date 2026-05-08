"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")           // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")         // bold
    .replace(/\*(.+?)\*/g, "$1")             // italic
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")      // code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")     // links
    .replace(/!\[.*?\]\(.+?\)/g, "")        // images
    .replace(/^[-*>]\s+/gm, "")             // bullets/blockquotes
    .replace(/\n+/g, " ")
    .trim();
}

import {
  FileText,
  Play,
  BarChart2,
  Video,
  Calendar,
  Check,
  X,
  Music,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { registrarLecturaAction } from "@/app/actions/lecturas";
import type { Entregable } from "@/types";

type EntregableCardProps = {
  entregable: Entregable;
  yaLeido: boolean;
  onOpen: (entregable: Entregable) => void;
};

const ICONOS: Record<Entregable["tipo"], React.ReactNode> = {
  pdf: <FileText size={16} strokeWidth={1.5} />,
  video: <Play size={16} strokeWidth={1.5} />,
  audio: <Music size={16} strokeWidth={1.5} />,
  imagen: <ImageIcon size={16} strokeWidth={1.5} />,
  documento: <FileSpreadsheet size={16} strokeWidth={1.5} />,
  archivo: <File size={16} strokeWidth={1.5} />,
  reporte: <BarChart2 size={16} strokeWidth={1.5} />,
  registro_reunion: <Video size={16} strokeWidth={1.5} />,
  agenda: <Calendar size={16} strokeWidth={1.5} />,
};

const TIPO_LABEL: Record<Entregable["tipo"], string> = {
  pdf: "PDF",
  video: "Video",
  audio: "Audio",
  imagen: "Imagen",
  documento: "Documento",
  archivo: "Archivo",
  reporte: "Reporte",
  registro_reunion: "Registro",
  agenda: "Agenda",
};

export default function EntregableCard({
  entregable,
  yaLeido,
  onOpen,
}: EntregableCardProps) {
  const [leido, setLeido] = useState(yaLeido);

  if (entregable.estado === "pendiente") return null;

  const esRechazado = entregable.estado === "rechazado";
  const esObsoleto = entregable.version_estado === 'obsoleto';
  const esVigente = entregable.version_estado === 'vigente';
  const tieneVersion = entregable.version_estado != null;

  // Estilos de color según versión
  const versionBorderColor = esObsoleto
    ? '#ef4444'
    : esVigente
    ? '#22c55e'
    : undefined;
  const versionBg = esObsoleto
    ? 'rgba(239,68,68,0.04)'
    : esVigente
    ? 'rgba(34,197,94,0.04)'
    : undefined;

  async function handleClick() {
    onOpen(entregable);
    if (!leido && !esRechazado) {
      setLeido(true);
      registrarLecturaAction({ entregable_id: entregable.id });
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      {/* Conector horizontal — hairline al árbol */}
      <div
        style={{
          position: "relative",
          width: "20px",
          flexShrink: 0,
          alignSelf: "center",
          height: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "var(--hairline-strong)",
          }}
        />
      </div>

      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.12 }}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 16px",
          backgroundColor: versionBg ?? "var(--surface-1)",
          border: "1px solid var(--hairline)",
          borderLeftWidth: tieneVersion ? 3 : 1,
          borderLeftColor: versionBorderColor ?? "var(--hairline)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          textAlign: "left",
          opacity: leido && !esRechazado ? 0.7 : 1,
          width: "100%",
          transition: "border-color 180ms ease, background-color 180ms ease",
        }}
        onMouseEnter={(e) => {
          if (!esRechazado) e.currentTarget.style.borderColor = versionBorderColor ?? "var(--hairline-strong)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--hairline)";
          if (versionBorderColor) e.currentTarget.style.borderLeftColor = versionBorderColor;
        }}
      >
        {/* Ícono tipo — pequeño, alineado a la izquierda */}
        <div
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--foreground-muted)",
          }}
        >
          {ICONOS[entregable.tipo]}
        </div>

        {/* Título y descripción */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: esRechazado ? "var(--foreground-subtle)" : "var(--foreground)",
                textDecoration: esRechazado ? "line-through" : "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "-0.005em",
              }}
            >
              {entregable.titulo}
            </p>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--foreground-subtle)",
                flexShrink: 0,
              }}
            >
              {TIPO_LABEL[entregable.tipo]}
            </span>
            {/* Badge de versión */}
            {tieneVersion && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: versionBorderColor,
                  flexShrink: 0,
                  padding: "2px 5px",
                  borderRadius: "4px",
                  border: `1px solid ${versionBorderColor}`,
                  backgroundColor: versionBg,
                }}
              >
                {esObsoleto ? "Rechazado" : "Aceptado"}
              </span>
            )}
          </div>
          {entregable.descripcion && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.78rem",
                color: "var(--foreground-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {stripMarkdown(entregable.descripcion)}
            </p>
          )}
        </div>

        {/* Estado: tag pastel desaturado */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {esRechazado && (
            <span className="syb-tag syb-tag-danger">
              <X size={11} strokeWidth={2} />
              Rechazado
            </span>
          )}
          {!esRechazado && (
            <AnimatePresence>
              {leido && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className="syb-tag syb-tag-success"
                >
                  <Check size={11} strokeWidth={2.5} />
                  Leído
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.button>
    </div>
  );
}
