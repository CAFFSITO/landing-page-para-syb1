"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { obtenerSignedUrl } from "@/app/actions/storage";
import type { Entregable } from "@/types";

type ModalPDFProps = {
  isOpen: boolean;
  onClose: () => void;
  entregable: Entregable;
};

export default function ModalPDF({ isOpen, onClose, entregable }: ModalPDFProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener signedUrl cuando el modal se abre
  useEffect(() => {
    if (!isOpen || !entregable.storage_path) return;
    setCargando(true);
    setError(null);
    obtenerSignedUrl(entregable.storage_path).then((result) => {
      if (result.url) {
        setSignedUrl(result.url);
      } else {
        setError(result.error ?? "No se pudo cargar el archivo.");
      }
      setCargando(false);
    });
  }, [isOpen, entregable.storage_path]);

  // Limpiar URL al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSignedUrl(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={entregable.titulo}
      tipoBadge="PDF"
      footer={
        signedUrl ? (
          <a
            href={signedUrl}
            download
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
            Descargar PDF
          </a>
        ) : undefined
      }
    >
      {cargando && (
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>
          Cargando PDF...
        </p>
      )}
      {error && (
        <p style={{ color: "#EF4444", textAlign: "center", padding: "40px 0" }}>{error}</p>
      )}
      {signedUrl && !cargando && (
        <iframe
          src={signedUrl}
          width="100%"
          height="500px"
          style={{ border: "none", borderRadius: "8px" }}
          title={entregable.titulo}
        />
      )}
      {!entregable.storage_path && !cargando && (
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>
          Este entregable no tiene archivo adjunto.
        </p>
      )}
    </Modal>
  );
}
