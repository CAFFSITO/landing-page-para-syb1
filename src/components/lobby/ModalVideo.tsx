"use client";

import Modal from "@/components/ui/Modal";
import type { Entregable } from "@/types";

type ModalVideoProps = {
  isOpen: boolean;
  onClose: () => void;
  entregable: Entregable;
};

/** Convierte una URL de Vimeo a URL de embed. */
function toVimeoEmbed(url: string): string {
  // Formatos: https://vimeo.com/123456789 o https://vimeo.com/123456789?h=abc
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
  }
  // Si ya es un embed u otro formato, devolver tal cual
  return url;
}

export default function ModalVideo({ isOpen, onClose, entregable }: ModalVideoProps) {
  const embedUrl = entregable.url ? toVimeoEmbed(entregable.url) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={entregable.titulo}
      tipoBadge="Video"
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="460px"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ border: "none", borderRadius: "8px" }}
          title={entregable.titulo}
        />
      ) : (
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>
          Este entregable no tiene video disponible.
        </p>
      )}
    </Modal>
  );
}
