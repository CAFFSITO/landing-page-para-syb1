"use client";

import Modal from "@/components/ui/Modal";
import type { Reunion } from "@/types";

type ModalAgendaProps = {
  isOpen: boolean;
  onClose: () => void;
  reunion: Reunion;
};

function formatearFecha(fechaStr: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(fechaStr));
}

export default function ModalAgenda({ isOpen, onClose, reunion }: ModalAgendaProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={reunion.nombre}
      tipoBadge="Agenda"
      footer={
        reunion.agenda_url ? (
          <a
            href={reunion.agenda_url}
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
            Ver en calendario →
          </a>
        ) : undefined
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reunion.fecha && (
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "0.75rem",
                color: "rgba(157,92,192,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Fecha
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "#FFFFFF",
                fontFamily: "Merriweather, Georgia, serif",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {formatearFecha(reunion.fecha)}
            </p>
          </div>
        )}

        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "0.75rem",
              color: "rgba(157,92,192,0.7)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Reunión
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
            {reunion.nombre}
          </p>
        </div>

        {!reunion.fecha && !reunion.agenda_url && (
          <p style={{ color: "rgba(255,255,255,0.4)", padding: "16px 0" }}>
            La fecha de esta reunión aún no está confirmada.
          </p>
        )}
      </div>
    </Modal>
  );
}
