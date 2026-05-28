"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        color: "var(--foreground-muted)",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontFamily: "var(--font-sans)",
        padding: "6px 0",
        transition: "color 180ms ease",
      }}
    >
      <LogOut size={15} strokeWidth={1.5} />
      Cerrar sesión
    </button>
  );
}
