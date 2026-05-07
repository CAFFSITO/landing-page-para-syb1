"use client";

import { useActionState } from "react";
import { adminLoginWithToken } from "@/app/actions/admin-auth";
import Image from "next/image";
import logoSYB from "@/app/SYB RECUPERADO.png";

const initialState = { error: null };

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    adminLoginWithToken,
    initialState
  );

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100dvh",
      }}
      className="flex flex-col items-center justify-center px-4"
    >
      <div className="mb-10 flex flex-col items-center gap-4">
        <Image src={logoSYB} alt="Scale Your Business" height={56} style={{ width: "auto", objectFit: "contain" }} priority />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "0.7rem",
            color: "var(--foreground-subtle)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Panel Admin
        </span>
      </div>

      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-md)",
          padding: "36px 32px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--foreground)",
            margin: "0 0 6px 0",
            letterSpacing: "-0.01em",
          }}
        >
          Acceso administradores
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--foreground-muted)",
            margin: "0 0 28px 0",
            lineHeight: 1.6,
          }}
        >
          Ingresá con tu email y token de acceso para administrar la plataforma.
        </p>

        <form
          action={formAction}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "var(--foreground-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="syb-input"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="token"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "var(--foreground-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              Token de acceso
            </label>
            <input
              id="token"
              name="token"
              type="password"
              autoComplete="off"
              required
              className="syb-input"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="syb-btn-primary"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              opacity: isPending ? 0.7 : 1,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "Verificando…" : "Ingresar"}
          </button>

          {state?.error && (
            <p
              style={{
                color: "var(--color-danger)",
                fontSize: "0.85rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
