"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/components/lobby/Sidebar";
import LobbyTabs, { type TabActiva } from "@/components/lobby/LobbyTabs";
import type { Socio, GarantiaData } from "@/types";

type LobbyShellProps = {
  socio: Socio;
  programaContent: ReactNode;
  progresoContent: ReactNode;
  reunionesContent: ReactNode;
  consultoriaContent?: ReactNode;
  garantia?: GarantiaData;
};

const TABS_VALIDOS: TabActiva[] = ["programa", "progreso", "reuniones", "consultoria"];

export default function LobbyShell({
  socio,
  programaContent,
  progresoContent,
  reunionesContent,
  consultoriaContent,
  garantia,
}: LobbyShellProps) {
  const storageKey = `syb_lobby_tab_${socio.id}`;
  const [tabActiva, setTabActiva] = useState<TabActiva>("programa");

  const opcion = garantia?.opcion_ejecutada ?? null;
  const esRetirada = opcion === "A";

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as TabActiva | null;
    if (saved && TABS_VALIDOS.includes(saved)) {
      setTabActiva(saved);
    }
  }, [storageKey]);

  // Contenido de "Programa" para Opción A
  const programaContentFinal = esRetirada ? (
    <div
      style={{
        padding: "48px 0",
        maxWidth: 520,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "var(--foreground)",
          marginBottom: 20,
          lineHeight: 1.3,
        }}
      >
        Durante los próximos 10 días recibirás tu reembolso, y los sistemas se
        desconectarán y eliminarán.
      </p>
      <p
        style={{
          fontSize: "1rem",
          color: "var(--foreground-muted)",
          lineHeight: 1.7,
        }}
      >
        Gracias, {socio.nombre.split(" ")[0]}, por haber confiado en Scale Your Business.
      </p>
    </div>
  ) : (
    programaContent
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100dvh - 40px)",
        filter: esRetirada ? "grayscale(1)" : "none",
        transition: "filter 600ms ease",
      }}
    >
      <Sidebar socio={socio} tabActiva={tabActiva} />

      <main
        style={{
          flex: 1,
          padding: "48px 28px",
          maxWidth: "880px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <LobbyTabs
          socioId={socio.id}
          tabActiva={tabActiva}
          onTabChange={setTabActiva}
          programaContent={programaContentFinal}
          progresoContent={progresoContent}
          reunionesContent={reunionesContent}
          consultoriaContent={consultoriaContent}
        />
      </main>
    </div>
  );
}
