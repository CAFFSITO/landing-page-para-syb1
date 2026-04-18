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
        color: "#9D5CC0",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontFamily: "inherit",
        padding: "6px 0",
        transition: "color 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#9D5CC0";
      }}
    >
      <LogOut size={16} />
      Cerrar sesión
    </button>
  );
}
