"use client";

import Modal from "@/components/ui/Modal";
import ConfirmacionLectura from "@/components/lobby/ConfirmacionLectura";
import type { Reunion } from "@/types";

type ModalAgendaProps = {
  isOpen: boolean;
  onClose: () => void;
  reunion: Reunion;
  entregableId: string;
  yaLeido: boolean;
};

function formatearFecha(fechaStr: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(fechaStr));
}

export default function ModalAgenda({ isOpen, onClose, reunion, entregableId, yaLeido }: ModalAgendaProps) {
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
            className="syb-btn-primary"
            style={{ textDecoration: "none" }}
          >
            Ver en calendario
          </a>
        ) : undefined
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {reunion.fecha && (
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--foreground-subtle)",
              }}
            >
              Fecha
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "1.05rem",
                color: "var(--foreground)",
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                textTransform: "capitalize",
                letterSpacing: "-0.005em",
              }}
            >
              {formatearFecha(reunion.fecha)}
            </p>
          </div>
        )}

        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--foreground-subtle)",
            }}
          >
            Reunión
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--foreground)" }}>
            {reunion.nombre}
          </p>
        </div>

        {!reunion.fecha && !reunion.agenda_url && (
          <p
            style={{
              color: "var(--foreground-muted)",
              padding: "16px 0",
              fontStyle: "italic",
            }}
          >
            La fecha de esta reunión aún no está confirmada.
          </p>
        )}
      </div>
      <ConfirmacionLectura entregableId={entregableId} yaLeido={yaLeido} />
    </Modal>
  );
}
