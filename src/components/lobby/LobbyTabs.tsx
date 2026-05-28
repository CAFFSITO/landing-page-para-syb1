"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TabActiva = "programa" | "progreso" | "reuniones";

type LobbyTabsProps = {
  socioId: string;
  tabActiva: TabActiva;
  onTabChange: (tab: TabActiva) => void;
  programaContent: ReactNode;
  progresoContent: ReactNode;
  reunionesContent: ReactNode;
};

const TABS: { key: TabActiva; label: string }[] = [
  { key: "programa", label: "Programa" },
  { key: "progreso", label: "Progreso" },
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

  useEffect(() => {
    localStorage.setItem(storageKey, tabActiva);
  }, [tabActiva, storageKey]);

  const content: Record<TabActiva, ReactNode> = {
    programa: programaContent,
    progreso: progresoContent,
    reuniones: reunionesContent,
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Tabs editoriales — separación por hairline 1px, sin borde grueso */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--hairline)",
          marginBottom: "40px",
        }}
      >
        {TABS.map(({ key, label }) => {
          const isActiva = tabActiva === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              style={{
                position: "relative",
                padding: "12px 18px",
                background: "none",
                border: "none",
                color: isActiva ? "var(--foreground)" : "var(--foreground-muted)",
                fontFamily: "var(--font-sans)",
                fontWeight: isActiva ? 600 : 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "color 180ms ease",
              }}
            >
              {label}
              {isActiva && (
                <motion.span
                  layoutId="lobby-tab-indicator"
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: -1,
                    height: 1,
                    backgroundColor: "var(--foreground)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tabActiva}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
        >
          {content[tabActiva]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
