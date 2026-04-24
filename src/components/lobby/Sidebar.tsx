"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { Socio } from "@/types";
import type { TabActiva } from "@/components/lobby/LobbyTabs";
import Image from "next/image";
import logoSYB from "@/app/SYB RECUPERADO.png";

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
        padding: "24px 20px",
        gap: "0",
      }}
    >
      {/* Logo SYB */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          marginBottom: "32px",
        }}
      >
        <Image src={logoSYB} alt="Logo SYB" width={160} height={160} style={{ objectFit: "contain" }} />
        <span
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#FFFFFF",
            letterSpacing: "0.12em",
          }}
        >
          SYB
        </span>
      </div>

      {/* Datos del socio */}
      <div style={{ marginBottom: "28px" }}>
        <h4
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "#FFFFFF",
            margin: "0 0 4px 0",
          }}
        >
          {socio.nombre}
        </h4>
        {socio.empresa && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(157,92,192,0.7)",
              margin: 0,
            }}
          >
            {socio.empresa}
          </p>
        )}
      </div>

      {/* Links de fase — solo visibles en tab "progreso" */}
      <AnimatePresence>
        {tabActiva === "progreso" && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", marginBottom: "28px" }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                color: "rgba(157,92,192,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "10px",
              }}
            >
              Fases
            </p>
            {([1, 2, 3] as const).map((fase) => (
              <a
                key={fase}
                href={`#fase-${fase}`}
                style={{
                  display: "block",
                  padding: "6px 0",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9D5CC0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                Fase {fase}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Toggle dark/light */}
      <button
        onClick={onToggleTheme}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontFamily: "inherit",
          padding: "8px 0",
          marginBottom: "12px",
          transition: "color 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#FFFFFF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        {isDark ? "Modo claro" : "Modo oscuro"}
      </button>

      {/* Logout */}
      <form action={signOut}>
        <button
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#9D5CC0",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontFamily: "inherit",
            padding: "8px 0",
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9D5CC0";
          }}
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export default function Sidebar({ socio, tabActiva }: SidebarProps) {
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Inicializar tema desde localStorage
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

  const sidebarBg = "#120825";

  return (
    <>
      {/* Sidebar desktop */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          backgroundColor: sidebarBg,
          borderRight: "1px solid rgba(157,92,192,0.15)",
          height: "calc(100vh - 56px)",
          position: "sticky",
          top: "56px",
          overflowY: "auto",
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

      {/* Hamburger — solo mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 40,
          backgroundColor: "#9D5CC0",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(157,92,192,0.5)",
        }}
        className="md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} color="#FFFFFF" />
      </button>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                zIndex: 45,
              }}
            />

            {/* Drawer */}
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
                backgroundColor: sidebarBg,
                zIndex: 50,
                borderRight: "1px solid rgba(157,92,192,0.15)",
              }}
            >
              {/* Cerrar drawer */}
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                }}
                aria-label="Cerrar menú"
              >
                <X size={20} />
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
