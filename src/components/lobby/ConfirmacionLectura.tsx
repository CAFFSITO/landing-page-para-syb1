"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { registrarLecturaAction } from "@/app/actions/lecturas";

type Props = {
  entregableId: string;
  yaLeido: boolean;
  onConfirmado?: () => void;
};

export default function ConfirmacionLectura({ entregableId, yaLeido, onConfirmado }: Props) {
  const [leido, setLeido] = useState(yaLeido);
  const [cargando, setCargando] = useState(false);

  async function handleConfirmar() {
    setCargando(true);
    await registrarLecturaAction({ entregable_id: entregableId });
    setLeido(true);
    onConfirmado?.();
    setCargando(false);
  }

  return (
    <div
      style={{
        marginTop: "28px",
        padding: "18px 20px",
        borderRadius: "var(--radius-sm)",
        border: leido
          ? "1px solid rgba(34,197,94,0.3)"
          : "1px solid var(--hairline)",
        backgroundColor: leido
          ? "rgba(34,197,94,0.05)"
          : "var(--surface-2)",
        transition: "border-color 300ms ease, background-color 300ms ease",
      }}
    >
      {leido ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CheckCircle2
            size={16}
            strokeWidth={1.5}
            style={{ flexShrink: 0, color: "#22c55e" }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: "rgba(34,197,94,0.85)",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            Lectura certificada
          </p>
        </div>
      ) : (
        <>
          <p
            style={{
              margin: "0 0 14px 0",
              fontSize: "0.875rem",
              color: "var(--foreground-muted)",
              lineHeight: 1.65,
              fontStyle: "italic",
            }}
          >
            &ldquo;Afirmo y certifico que he leído atentamente este entregable.
            Soy consciente de los conceptos fundamentales del contenido.&rdquo;
          </p>
          <button
            onClick={handleConfirmar}
            disabled={cargando}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: cargando
                ? "var(--surface-1)"
                : "linear-gradient(135deg, #3B1E63, #9D5CC0)",
              color: cargando ? "var(--foreground-muted)" : "#fff",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: cargando ? "not-allowed" : "pointer",
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={(e) => {
              if (!cargando)
                (e.currentTarget as HTMLElement).style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            <ShieldCheck size={15} strokeWidth={1.8} />
            {cargando ? "Guardando…" : "Certificar lectura"}
          </button>
        </>
      )}
    </div>
  );
}
