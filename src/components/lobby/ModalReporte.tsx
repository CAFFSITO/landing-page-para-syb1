"use client";

import ReactMarkdown from "react-markdown";
import Modal from "@/components/ui/Modal";
import type { Reporte, Reunion } from "@/types";

type ModalReporteProps = {
  isOpen: boolean;
  onClose: () => void;
  item: Reporte | Reunion;
};

function esReporte(item: Reporte | Reunion): item is Reporte {
  return "contenido" in item;
}

export default function ModalReporte({ isOpen, onClose, item }: ModalReporteProps) {
  const titulo = esReporte(item) ? item.titulo : item.nombre;
  const contenido = esReporte(item) ? item.contenido : (item.notas ?? "");
  const grabacion = esReporte(item) ? null : item.grabacion_url;
  const badge = esReporte(item) ? "Reporte" : "Reunión";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={titulo}
      tipoBadge={badge}
      footer={
        grabacion ? (
          <a
            href={grabacion}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #3B1E63, #9D5CC0)",
              color: "#FFFFFF",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontFamily: "Merriweather, Georgia, serif",
              fontWeight: 700,
            }}
          >
            Ver grabación →
          </a>
        ) : undefined
      }
    >
      {contenido ? (
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
          }}
        >
          <ReactMarkdown>{contenido}</ReactMarkdown>
        </div>
      ) : (
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "32px 0" }}>
          No hay contenido disponible aún.
        </p>
      )}
    </Modal>
  );
}
