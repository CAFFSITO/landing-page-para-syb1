"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Film, Image as ImageIcon, File } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { obtenerSignedUrl } from "@/app/actions/storage";
import type { Entregable } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  entregable: Entregable;
};

type TipoArchivo = "pdf" | "video" | "imagen" | "otro";

function detectarTipo(path: string): TipoArchivo {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["mp4", "webm", "mov", "avi", "mkv", "ogg"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "imagen";
  return "otro";
}

function badgeLabel(tipoArchivo: TipoArchivo, ext: string): string {
  if (tipoArchivo === "pdf") return "PDF";
  if (tipoArchivo === "video") return "Video";
  if (tipoArchivo === "imagen") return "Imagen";
  return ext.toUpperCase() || "Archivo";
}

export default function ModalArchivo({ isOpen, onClose, entregable }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isOpen) {
      setSignedUrl(null);
      setError(null);
    }
  }, [isOpen]);

  const storagePath = entregable.storage_path ?? "";
  const ext = storagePath.split(".").pop()?.toLowerCase() ?? "";
  const tipoArchivo = storagePath ? detectarTipo(storagePath) : "otro";
  const badge = badgeLabel(tipoArchivo, ext);

  function renderContenido() {
    if (cargando) {
      return (
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px 0" }}>
          Cargando archivo...
        </p>
      );
    }
    if (error) {
      return (
        <p style={{ color: "#EF4444", textAlign: "center", padding: "60px 0" }}>{error}</p>
      );
    }
    if (!signedUrl) {
      return (
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px 0" }}>
          Este entregable no tiene archivo adjunto.
        </p>
      );
    }

    if (tipoArchivo === "pdf") {
      return (
        <iframe
          src={signedUrl}
          width="100%"
          height="520px"
          style={{ border: "none", borderRadius: "8px" }}
          title={entregable.titulo}
        />
      );
    }

    if (tipoArchivo === "video") {
      return (
        <video
          src={signedUrl}
          controls
          style={{
            width: "100%",
            borderRadius: "10px",
            backgroundColor: "#000",
            maxHeight: "520px",
          }}
        />
      );
    }

    if (tipoArchivo === "imagen") {
      return (
        <div style={{ textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={signedUrl}
            alt={entregable.titulo}
            style={{
              maxWidth: "100%",
              maxHeight: "520px",
              borderRadius: "10px",
              objectFit: "contain",
            }}
          />
        </div>
      );
    }

    // Tipo "otro" — sin vista previa, mostrar descripción + ícono
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "48px 0",
        }}
      >
        <File size={48} color="rgba(157,92,192,0.5)" />
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0, textAlign: "center" }}>
          Vista previa no disponible para <strong style={{ color: "#9D5CC0" }}>.{ext}</strong>
        </p>
        {entregable.descripcion && (
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", margin: 0, textAlign: "center", maxWidth: "480px" }}>
            {entregable.descripcion}
          </p>
        )}
      </div>
    );
  }

  const iconoDescarga: Record<TipoArchivo, React.ReactNode> = {
    pdf: <FileText size={16} />,
    video: <Film size={16} />,
    imagen: <ImageIcon size={16} />,
    otro: <Download size={16} />,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={entregable.titulo}
      tipoBadge={badge}
      footer={
        signedUrl ? (
          <a
            href={signedUrl}
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
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
            {iconoDescarga[tipoArchivo]}
            Descargar
          </a>
        ) : undefined
      }
    >
      {renderContenido()}
    </Modal>
  );
}
