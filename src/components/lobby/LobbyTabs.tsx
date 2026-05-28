"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TabActiva = "programa" | "progreso" | "reuniones" | "consultoria";

type LobbyTabsProps = {
  socioId: string;
  tabActiva: TabActiva;
  onTabChange: (tab: TabActiva) => void;
  programaContent: ReactNode;
  progresoContent: ReactNode;
  reunionesContent: ReactNode;
  consultoriaContent?: ReactNode;
};

export default function LobbyTabs({
  socioId,
  tabActiva,
  onTabChange,
  programaContent,
  progresoContent,
  reunionesContent,
  consultoriaContent,
}: LobbyTabsProps) {
  const storageKey = `syb_lobby_tab_${socioId}`;

  useEffect(() => {
    localStorage.setItem(storageKey, tabActiva);
  }, [tabActiva, storageKey]);

  const tabs: { key: TabActiva; label: string }[] = [
    ...(consultoriaContent
      ? [{ key: "consultoria" as TabActiva, label: "Pack de Consultoría Estratégica" }]
      : []),
    { key: "programa", label: "Programa" },
    { key: "progreso", label: "Progreso" },
    { key: "reuniones", label: "Reuniones" },
  ];

  const content: Partial<Record<TabActiva, ReactNode>> = {
    programa: programaContent,
    progreso: progresoContent,
    reuniones: reunionesContent,
    ...(consultoriaContent ? { consultoria: consultoriaContent } : {}),
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--hairline)",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        {tabs.map(({ key, label }) => {
          const isActiva = tabActiva === key;
          const isConsultoria = key === "consultoria";
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              style={{
                position: "relative",
                padding: "12px 18px",
                background: "none",
                border: "none",
                color: isActiva
                  ? isConsultoria
                    ? "var(--color-secondary)"
                    : "var(--foreground)"
                  : "var(--foreground-muted)",
                fontFamily: "var(--font-sans)",
                fontWeight: isActiva ? 700 : 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "color 180ms ease",
              }}
            >
              {isConsultoria && (
                <span
                  style={{
                    marginRight: 6,
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "var(--color-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    verticalAlign: "middle",
                    border: "1px solid var(--color-secondary)",
                    borderRadius: 4,
                    padding: "1px 4px",
                    opacity: 0.7,
                  }}
                >
                  Nuevo
                </span>
              )}
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
                    backgroundColor: isConsultoria
                      ? "var(--color-secondary)"
                      : "var(--foreground)",
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
