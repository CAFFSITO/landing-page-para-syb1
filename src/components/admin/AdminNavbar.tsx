"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import Image from "next/image";
import logoSYB from "@/app/SYB RECUPERADO.png";

export default function AdminNavbar() {
  const [isDark, setIsDark] = useState(true);

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
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "56px",
        backgroundColor: "var(--background-soft)",
        borderBottom: "1px solid var(--hairline)",
        display: "flex",
        alignItems: "center",
        paddingInline: "24px",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
        <Image
          src={logoSYB}
          alt="Scale Your Business"
          height={32}
          style={{ width: "auto", objectFit: "contain" }}
          priority
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 500,
            color: "var(--foreground-subtle)",
            paddingLeft: "12px",
            borderLeft: "1px solid var(--hairline)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Panel Admin
        </span>
      </div>

      <button
        onClick={toggleTheme}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "var(--foreground-muted)",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontFamily: "var(--font-sans)",
          padding: "6px 10px",
          borderRadius: "var(--radius-sm)",
          transition: "color 150ms ease, background 150ms ease",
        }}
      >
        {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
        <span className="hidden sm:inline">{isDark ? "Modo claro" : "Modo oscuro"}</span>
      </button>

      <form action={signOut}>
        <button type="submit" className="syb-btn-ghost" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
          Cerrar sesión
        </button>
      </form>
    </header>
  );
}
