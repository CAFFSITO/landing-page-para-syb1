"use client";

import { ShieldCheck, ShieldX } from "lucide-react";
import type { GarantiaData } from "@/types";

type Props = {
  garantia: GarantiaData;
  garantiaActiva: boolean;
  nombreSocio: string;
};

export default function GarantiaStatus({ garantia, garantiaActiva, nombreSocio }: Props) {
  if (!garantiaActiva) return null;

  const razones: string[] = [
    garantia.breach_reunion && garantia.breach_reunion_razon,
    garantia.breach_uso && garantia.breach_uso_razon,
    garantia.breach_reporte && garantia.breach_reporte_razon,
  ].filter((r): r is string => !!r);

  const suspendida = razones.length > 0;

  return (
    <div
      style={{
        marginTop: 40,
        padding: "20px 24px",
        backgroundColor: suspendida
          ? "rgba(239,68,68,0.05)"
          : "rgba(74,222,128,0.04)",
        border: `1px solid ${suspendida ? "rgba(239,68,68,0.2)" : "rgba(74,222,128,0.15)"}`,
        borderLeft: `3px solid ${suspendida ? "#ef4444" : "#4ade80"}`,
        borderRadius: 10,
      }}
    >
      {/* Encabezado semáforo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: suspendida ? "#ef4444" : "#4ade80",
            boxShadow: `0 0 8px ${suspendida ? "rgba(239,68,68,0.6)" : "rgba(74,222,128,0.5)"}`,
            flexShrink: 0,
          }}
        />
        {suspendida ? (
          <ShieldX size={16} color="#ef4444" />
        ) : (
          <ShieldCheck size={16} color="#4ade80" />
        )}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: suspendida ? "#ef4444" : "#4ade80",
          }}
        >
          {suspendida ? "Garantía Suspendida" : "Garantía Válida"}
        </span>
      </div>

      {/* Descripción */}
      {!suspendida && (
        <p
          style={{
            margin: 0,
            fontSize: "0.82rem",
            color: "var(--foreground-muted)",
            lineHeight: 1.6,
          }}
        >
          {nombreSocio}, estás cumpliendo con todas las condiciones del programa.
        </p>
      )}

      {suspendida && (
        <>
          <p
            style={{
              margin: "0 0 12px 0",
              fontSize: "0.82rem",
              color: "var(--foreground-muted)",
              lineHeight: 1.6,
            }}
          >
            {nombreSocio}, la garantía está suspendida por incumplimiento de las
            condiciones del programa.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {razones.map((razon, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  color: "var(--foreground)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "#ef4444", fontWeight: 700 }}>Motivo: </span>
                {razon}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
