"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { Socio } from "@/types";
import type { TabActiva } from "@/components/lobby/LobbyTabs";
import Image from "next/image";
import logoSYB from "@/app/SYB_RECUPERADO.png";

type SidebarProps = {
  socio: Socio;
  tabActiva: TabActiva;
};

function SidebarContent({
  socio,
  tabActiva,
  isDark,
  onToggleTheme,
}: SidebarProps & { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "28px 22px",
      }}
    >
      {/* Logo SYB — alineado a la izquierda, sin texto duplicado */}
      <div style={{ marginBottom: "32px" }}>
        <Image
          src={logoSYB}
          alt="Scale Your Business"
          height={40}
          style={{ width: "auto", objectFit: "contain" }}
          priority
        />
      </div>

      {/* Bloque socio */}
      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--foreground-subtle)",
            margin: "0 0 6px 0",
          }}
        >
          Socio
        </p>
        <h4
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--foreground)",
            margin: "0 0 2px 0",
            letterSpacing: "-0.005em",
          }}
        >
          {socio.nombre}
        </h4>
        {socio.empresa && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--foreground-muted)",
              margin: 0,
            }}
          >
            {socio.empresa}
          </p>
        )}
      </div>

      {/* Divider 1px */}
      <div
        style={{
          height: 1,
          backgroundColor: "var(--hairline)",
          marginBottom: "22px",
        }}
      />

      {/* Links de fase */}
      <AnimatePresence>
        {tabActiva === "progreso" && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", marginBottom: "24px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--foreground-subtle)",
                margin: "0 0 10px 0",
              }}
            >
              Fases
            </p>
            {([1, 2, 3] as const).map((fase) => (
              <a
                key={fase}
                href={`#fase-${fase}`}
                className="syb-side-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 0",
                  color: "var(--foreground-muted)",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                <span
                  style={{
                    width: 18,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--foreground-subtle)",
                  }}
                >
                  0{fase}
                </span>
                Fase {fase}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div style={{ flex: 1 }} />

      {/* Toggle tema */}
      <button
        onClick={onToggleTheme}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "none",
          border: "none",
          color: "var(--foreground-muted)",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontFamily: "var(--font-sans)",
          padding: "8px 0",
          marginBottom: "8px",
          transition: "color 180ms ease",
        }}
      >
        {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
        {isDark ? "Modo claro" : "Modo oscuro"}
      </button>

      {/* Logout */}
      <form action={signOut}>
        <button
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "none",
            border: "none",
            color: "var(--foreground-muted)",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontFamily: "var(--font-sans)",
            padding: "8px 0",
            transition: "color 180ms ease",
          }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export default function Sidebar({ socio, tabActiva }: SidebarProps) {
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("syb_theme");
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("syb_theme", next ? "dark" : "light");
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          backgroundColor: "var(--background-soft)",
          borderRight: "1px solid var(--hairline)",
          minHeight: "calc(100dvh - 40px)",
          position: "sticky",
          top: "40px",
          alignSelf: "flex-start",
        }}
        className="hidden md:block"
      >
        <SidebarContent
          socio={socio}
          tabActiva={tabActiva}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </aside>

      {/* Hamburger mobile — botón cuadrado, sin píldora ni glow */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 40,
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--hairline-strong)",
          borderRadius: "var(--radius-sm)",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--foreground)",
          boxShadow: "var(--shadow-elevated)",
        }}
        className="md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={18} strokeWidth={1.5} />
      </button>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(13,6,24,0.55)",
                backdropFilter: "blur(4px)",
                zIndex: 45,
              }}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: "280px",
                backgroundColor: "var(--background-soft)",
                zIndex: 50,
                borderRight: "1px solid var(--hairline)",
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--foreground-muted)",
                  padding: 4,
                }}
                aria-label="Cerrar menú"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
              <SidebarContent
                socio={socio}
                tabActiva={tabActiva}
                isDark={isDark}
                onToggleTheme={toggleTheme}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
