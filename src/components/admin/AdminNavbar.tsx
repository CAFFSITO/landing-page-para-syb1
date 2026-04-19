"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { signOut } from "@/app/actions/auth";

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
        backgroundColor: "#120825",
        borderBottom: "1px solid rgba(157,92,192,0.2)",
        display: "flex",
        alignItems: "center",
        paddingInline: "24px",
        gap: "12px",
      }}
    >
      {/* Logo + título */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
        <svg
          width="28"
          height="25"
          viewBox="0 0 56 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon points="28,2 54,48 2,48" fill="#9D5CC0" />
          <polygon points="28,14 44,42 12,42" fill="#1C0D35" />
        </svg>
        <span
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#FFFFFF",
            letterSpacing: "0.06em",
          }}
        >
          SYB
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "rgba(157,92,192,0.7)",
            paddingLeft: "8px",
            borderLeft: "1px solid rgba(157,92,192,0.3)",
            marginLeft: "4px",
            fontFamily: "inherit",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Panel Admin
        </span>
      </div>

      {/* Toggle tema */}
      <button
        onClick={toggleTheme}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontFamily: "inherit",
          padding: "6px 8px",
          borderRadius: "6px",
          transition: "color 150ms ease, background 150ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#FFFFFF";
          e.currentTarget.style.background = "rgba(157,92,192,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          e.currentTarget.style.background = "none";
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        <span className="hidden sm:inline">{isDark ? "Modo claro" : "Modo oscuro"}</span>
      </button>

      {/* Logout */}
      <form action={signOut}>
        <button
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "1px solid rgba(157,92,192,0.3)",
            color: "#9D5CC0",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontFamily: "inherit",
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "color 150ms ease, border-color 150ms ease, background 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "#9D5CC0";
            e.currentTarget.style.background = "rgba(157,92,192,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9D5CC0";
            e.currentTarget.style.borderColor = "rgba(157,92,192,0.3)";
            e.currentTarget.style.background = "none";
          }}
        >
          Cerrar sesión
        </button>
      </form>
    </header>
  );
}
