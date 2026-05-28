import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import SociosTable from "@/components/admin/socios/SociosTable";

export default async function SociosPage() {
  const supabase = createAdminClient();
  const { data: socios } = await supabase
    .from("socios")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "var(--foreground-subtle)",
              margin: "0 0 12px 0",
            }}
          >
            Panel Admin
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              color: "var(--foreground)",
              fontSize: "2rem",
              margin: 0,
              letterSpacing: "-0.015em",
            }}
          >
            Socios
          </h1>
        </div>
        <Link href="/admin/socios/nuevo" className="syb-btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={14} strokeWidth={2} />
          Nuevo socio
        </Link>
      </div>
      <SociosTable socios={socios ?? []} />
    </div>
  );
}
