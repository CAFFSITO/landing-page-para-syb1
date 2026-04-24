"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TabActiva = "programa" | "progreso" | "reuniones";

type LobbyTabsProps = {
  socioId: string;
  tabActiva: TabActiva;
  onTabChange: (tab: TabActiva) => void;
  programaContent: React.ReactNode;
  progresoContent: React.ReactNode;
  reunionesContent: React.ReactNode;
};

const TABS: { key: TabActiva; label: string }[] = [
  { key: "programa", label: "Mi programa" },
  { key: "progreso", label: "Mi progreso" },
  { key: "reuniones", label: "Reuniones" },
];

export default function LobbyTabs({
  socioId,
  tabActiva,
  onTabChange,
  programaContent,
  progresoContent,
  reunionesContent,
}: LobbyTabsProps) {
  const storageKey = `syb_lobby_tab_${socioId}`;

  // Persistir selección de tab en localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, tabActiva);
  }, [tabActiva, storageKey]);

  const content: Record<TabActiva, React.ReactNode> = {
    programa: programaContent,
    progreso: progresoContent,
    reuniones: reunionesContent,
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Barra de tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid rgba(157,92,192,0.2)",
          marginBottom: "32px",
        }}
      >
        {TABS.map(({ key, label }) => {
          const isActiva = tabActiva === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              style={{
                padding: "14px 24px",
                background: "none",
                border: "none",
                borderBottom: isActiva
                  ? "2px solid #9D5CC0"
                  : "2px solid transparent",
                color: isActiva ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                fontFamily: "Merriweather, Georgia, serif",
                fontWeight: isActiva ? 700 : 400,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "color 200ms ease, border-color 200ms ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Contenido con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabActiva}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          {content[tabActiva]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
