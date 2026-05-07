"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/lobby/Sidebar";
import LobbyTabs, { type TabActiva } from "@/components/lobby/LobbyTabs";
import type { Socio } from "@/types";

type LobbyShellProps = {
  socio: Socio;
  programaContent: React.ReactNode;
  progresoContent: React.ReactNode;
  reunionesContent: React.ReactNode;
};

export default function LobbyShell({
  socio,
  programaContent,
  progresoContent,
  reunionesContent,
}: LobbyShellProps) {
  const storageKey = `syb_lobby_tab_${socio.id}`;

  const [tabActiva, setTabActiva] = useState<TabActiva>("programa");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as TabActiva | null;
    if (saved === "programa" || saved === "progreso" || saved === "reuniones") {
      setTabActiva(saved);
    }
  }, [storageKey]);

  return (
    <div style={{ display: "flex", minHeight: "calc(100dvh - 40px)" }}>
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
          programaContent={programaContent}
          progresoContent={progresoContent}
          reunionesContent={reunionesContent}
        />
      </main>
    </div>
  );
}
