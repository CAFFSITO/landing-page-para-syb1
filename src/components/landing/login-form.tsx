"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginSocioWithToken } from "@/app/actions/auth";
import Image from "next/image";
import logoSYB from "@/app/SYB RECUPERADO.png";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

function SkeletonBar({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-3 rounded-full bg-[rgba(157,92,192,0.15)] animate-pulse"
      style={{ width }}
    />
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginSocioWithToken(email, token);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    router.push("/lobby");
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 bg-[#0D0618]">

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image
          src={logoSYB}
          alt="Logo Scale Your Business"
          width={88}
          height={88}
          style={{ objectFit: "contain" }}
        />
        <div className="flex flex-col items-center leading-none mt-1">
          <span className="text-lg font-bold text-contrast tracking-[0.1em]">SYB</span>
          <span className="text-[10px] text-contrast/30 tracking-[0.18em] uppercase mt-0.5">
            Scale Your Business
          </span>
        </div>
      </div>

      {/* Card */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -5, 5, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] rounded-2xl border border-[rgba(157,92,192,0.2)] bg-[#1C0D35] p-8"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
      >
        <h1 className="text-xl font-bold text-contrast mb-1">Iniciá sesión</h1>
        <p className="text-sm text-secondary/50 mb-7">
          Usá las credenciales que te enviamos
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-contrast/60">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-[1.5px] border-[rgba(157,92,192,0.35)] bg-[#0F0720] px-4 py-3 text-sm text-contrast placeholder:text-contrast/25 outline-none focus:border-secondary transition-colors duration-200"
              placeholder="tu@email.com"
            />
          </div>

          {/* Token */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="token" className="text-sm font-medium text-contrast/60">
              Token de acceso
            </label>
            <input
              id="token"
              type="password"
              autoComplete="off"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-md border-[1.5px] border-[rgba(157,92,192,0.35)] bg-[#0F0720] px-4 py-3 text-sm text-contrast placeholder:text-contrast/25 outline-none focus:border-secondary transition-colors duration-200"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring}
                className="text-sm text-danger text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-md font-bold text-sm text-contrast transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "rgba(157,92,192,0.4)"
                : "linear-gradient(135deg, #3B1E63, #9D5CC0)",
            }}
          >
            {loading ? (
              <div className="flex flex-col gap-2 items-center py-0.5">
                <SkeletonBar width="60%" />
                <SkeletonBar width="40%" />
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
