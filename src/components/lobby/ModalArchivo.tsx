"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Film, Image as ImageIcon, File, Music, FileSpreadsheet } from "lucide-react";
import Modal from "@/components/ui/Modal";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { obtenerSignedUrl } from "@/app/actions/storage";
import type { Entregable } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  entregable: Entregable;
};

type TipoArchivo = "pdf" | "video" | "audio" | "imagen" | "office" | "otro";

function detectarTipo(path: string): TipoArchivo {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["mp4", "webm", "mov", "avi", "mkv", "flv", "m4v", "ogg"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "flac", "wma"].includes(ext)) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) return "imagen";
  if (["docx", "xlsx", "pptx"].includes(ext)) return "office";
  return "otro";
}

function badgeLabel(tipoArchivo: TipoArchivo, ext: string): string {
  if (tipoArchivo === "pdf") return "PDF";
  if (tipoArchivo === "video") return "Video";
  if (tipoArchivo === "audio") return "Audio";
  if (tipoArchivo === "imagen") return "Imagen";
  if (tipoArchivo === "office") return ext.toUpperCase();
  return ext.toUpperCase() || "Archivo";
}

function mimeFromExt(ext: string): string {
  const map: Record<string, string> = {
    mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", aac: "audio/aac",
    ogg: "audio/ogg", flac: "audio/flac", wma: "audio/x-ms-wma",
    mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
    avi: "video/x-msvideo", mkv: "video/x-matroska", flv: "video/x-flv",
    m4v: "video/x-m4v",
  };
  return map[ext] ?? "";
}

const downloadBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "linear-gradient(135deg, #3B1E63, #9D5CC0)",
  color: "#FFFFFF",
  fontFamily: "Merriweather, Georgia, serif",
  fontWeight: 700,
  fontSize: "0.875rem",
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  transition: "opacity 180ms ease",
};

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
  const mime = mimeFromExt(ext);

  function renderContenido() {
    if (cargando) {
      return (
        <p style={{ color: "var(--foreground-muted)", textAlign: "center", padding: "60px 0" }}>
          Cargando archivo…
        </p>
      );
    }
    if (error) {
      return (
        <p style={{ color: "var(--color-danger)", textAlign: "center", padding: "60px 0" }}>{error}</p>
      );
    }
    if (!signedUrl) {
      return (
        <p style={{ color: "var(--foreground-muted)", textAlign: "center", padding: "60px 0" }}>
          Este entregable no tiene archivo adjunto.
        </p>
      );
    }

    // ── PDF ──
    if (tipoArchivo === "pdf") {
      return (
        <iframe
          src={signedUrl}
          width="100%"
          height="520px"
          style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)" }}
          title={entregable.titulo}
        />
      );
    }

    // ── VIDEO ──
    if (tipoArchivo === "video") {
      return (
        <video
          controls
          style={{
            width: "100%",
            maxWidth: "800px",
            maxHeight: "500px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "#000",
            display: "block",
            margin: "0 auto",
          }}
        >
          <source src={signedUrl} type={mime || "video/mp4"} />
          Tu navegador no soporta este formato de video.
        </video>
      );
    }

    // ── AUDIO ──
    if (tipoArchivo === "audio") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 0" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            padding: "20px",
            backgroundColor: "rgba(157,92,192,0.06)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(157,92,192,0.15)",
          }}>
            <Music size={28} strokeWidth={1.2} color="#9D5CC0" />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: "var(--foreground)", fontSize: "0.9rem" }}>
                {entregable.titulo}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--foreground-subtle)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {ext.toUpperCase()}
              </p>
            </div>
          </div>
          <audio controls style={{ width: "100%" }}>
            <source src={signedUrl} type={mime || "audio/mpeg"} />
            Tu navegador no soporta este formato de audio.
          </audio>
        </div>
      );
    }

    // ── IMAGEN ──
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
              borderRadius: "var(--radius-sm)",
              objectFit: "contain",
            }}
          />
        </div>
      );
    }

    // ── OFFICE (docx, xlsx, pptx) ──
    if (tipoArchivo === "office") {
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
          <FileSpreadsheet size={48} strokeWidth={1} color="#9D5CC0" />
          <p style={{ color: "var(--foreground)", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
            {storagePath.split("/").pop() ?? entregable.titulo}
          </p>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>
            Los archivos de Office no se pueden previsualizar en el navegador.
          </p>
          {entregable.descripcion && (
            <div style={{ color: "var(--foreground-muted)", fontSize: "0.875rem", maxWidth: "560px" }}>
              <MarkdownRenderer content={entregable.descripcion} />
            </div>
          )}
        </div>
      );
    }

    // ── OTROS (.txt, .zip, etc.) ──
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
        <File size={36} strokeWidth={1.2} color="var(--foreground-subtle)" />
        <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", margin: 0, textAlign: "center" }}>
          Vista previa no disponible para{" "}
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}>.{ext}</span>
        </p>
        {entregable.descripcion && (
          <div style={{ color: "var(--foreground-muted)", fontSize: "0.875rem", maxWidth: "560px" }}>
            <MarkdownRenderer content={entregable.descripcion} />
          </div>
        )}
      </div>
    );
  }

  const downloadLabel: Record<TipoArchivo, string> = {
    pdf: "Descargar PDF",
    video: "Descargar video",
    audio: "Descargar audio",
    imagen: "Descargar imagen",
    office: "Descargar documento",
    otro: "Descargar archivo",
  };

  const downloadIcon: Record<TipoArchivo, React.ReactNode> = {
    pdf: <FileText size={16} />,
    video: <Film size={16} />,
    audio: <Music size={16} />,
    imagen: <ImageIcon size={16} />,
    office: <FileSpreadsheet size={16} />,
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
            style={downloadBtnStyle}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            {downloadIcon[tipoArchivo]}
            {downloadLabel[tipoArchivo]}
          </a>
        ) : undefined
      }
    >
      {entregable.descripcion && tipoArchivo !== "otro" && tipoArchivo !== "office" && (
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--border-color)",
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.9rem",
          }}
        >
          <MarkdownRenderer content={entregable.descripcion} />
        </div>
      )}
      {renderContenido()}
    </Modal>
  );
}
