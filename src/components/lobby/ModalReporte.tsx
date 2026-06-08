"use client";

import Modal from "@/components/ui/Modal";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import ConfirmacionLectura from "@/components/lobby/ConfirmacionLectura";
import type { Reporte, Reunion } from "@/types";

type ModalReporteProps = {
  isOpen: boolean;
  onClose: () => void;
  item: Reporte | Reunion;
  entregableId: string;
  yaLeido: boolean;
};

function esReporte(item: Reporte | Reunion): item is Reporte {
  return "contenido" in item;
}

export default function ModalReporte({ isOpen, onClose, item, entregableId, yaLeido }: ModalReporteProps) {
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
            className="syb-btn-primary"
            style={{ textDecoration: "none" }}
          >
            Ver grabación
          </a>
        ) : undefined
      }
    >
      {contenido ? (
        <div style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>
          <MarkdownRenderer content={contenido} />
        </div>
      ) : (
        <p style={{ color: "var(--foreground-muted)", textAlign: "center", padding: "32px 0", fontStyle: "italic" }}>
          No hay contenido disponible aún.
        </p>
      )}
      <ConfirmacionLectura entregableId={entregableId} yaLeido={yaLeido} />
    </Modal>
  );
}
