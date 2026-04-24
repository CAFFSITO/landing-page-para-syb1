"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import logoSYB from "@/app/SYB RECUPERADO.png";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: token,
    });

    if (authError) {
      setError("Credenciales incorrectas. Intentá de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/lobby");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#0F0720",
    border: "1.5px solid rgba(157,92,192,0.4)",
    borderRadius: "6px",
    padding: "12px 16px",
    color: "#FFFFFF",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{ backgroundColor: "#0D0618", minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-4"
    >
      {/* Logo SYB */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image src={logoSYB} alt="Logo SYB" width={96} height={96} style={{ objectFit: "contain" }} />
        <span
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#FFFFFF",
            letterSpacing: "0.12em",
          }}
        >
          SYB
        </span>
      </div>

      {/* Card de login */}
      <div
        style={{
          backgroundColor: "#1C0D35",
          border: "1px solid rgba(157,92,192,0.25)",
          borderRadius: "12px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 2px 20px rgba(59,30,99,0.15)",
        }}
      >
        <h1
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#FFFFFF",
            marginBottom: "8px",
          }}
        >
          Iniciá sesión
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(157,92,192,0.6)",
            marginBottom: "28px",
          }}
        >
          Usá las credenciales que te enviamos
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Campo Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="email"
              style={{ fontSize: "0.875rem", color: "#c4b8d4", fontWeight: 500 }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#9D5CC0";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(157,92,192,0.4)";
              }}
            />
          </div>

          {/* Campo Token */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="token"
              style={{ fontSize: "0.875rem", color: "#c4b8d4", fontWeight: 500 }}
            >
              Token
            </label>
            <input
              id="token"
              type="password"
              autoComplete="off"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#9D5CC0";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(157,92,192,0.4)";
              }}
            />
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "rgba(157,92,192,0.5)"
                : "linear-gradient(135deg, #3B1E63, #9D5CC0)",
              color: "#FFFFFF",
              fontFamily: "Merriweather, Georgia, serif",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "6px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "filter 200ms ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.filter = "brightness(1.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>

          {/* Mensaje de error */}
          {error && (
            <p
              style={{
                color: "#EF4444",
                fontSize: "0.875rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
