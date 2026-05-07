import { createAdminClient } from "@/lib/supabase/server";
import SociosTable, { type SocioRow } from "@/components/admin/SociosTable";

type LecturaMin = {
  socio_id: string;
  leido_at: string;
};

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [{ data: socios }, { data: lecturas }] = await Promise.all([
    supabase
      .from("socios")
      .select(
        "id, nombre, empresa, fase_actual, fase_1_done, fase_2_done, fase_3_done, activo, created_at"
      )
      .eq("activo", true)
      .returns<SocioRow[]>(),

    supabase
      .from("lecturas")
      .select("socio_id, leido_at")
      .order("leido_at", { ascending: false })
      .returns<LecturaMin[]>(),
  ]);

  const sociosList = socios ?? [];
  const lecturasList = lecturas ?? [];

  const ultimaActividadMap = new Map<string, string>();
  for (const l of lecturasList) {
    if (!ultimaActividadMap.has(l.socio_id)) {
      ultimaActividadMap.set(l.socio_id, l.leido_at);
    }
  }

  const sociosOrdenados = [...sociosList].sort((a, b) => {
    const ua = ultimaActividadMap.get(a.id);
    const ub = ultimaActividadMap.get(b.id);
    if (!ua && !ub) return 0;
    if (!ua) return 1;
    if (!ub) return -1;
    return new Date(ub).getTime() - new Date(ua).getTime();
  });

  const ultimaActividad = Object.fromEntries(ultimaActividadMap);

  const totalActivos = sociosList.length;
  const enFase1 = sociosList.filter((s) => s.fase_actual === 1).length;
  const enFase3 = sociosList.filter((s) => s.fase_actual === 3).length;

  const statCard: React.CSSProperties = {
    backgroundColor: "var(--surface-1)",
    border: "1px solid var(--hairline)",
    borderRadius: "var(--radius-md)",
    padding: "28px 24px",
    flex: "1 1 0",
    minWidth: "180px",
  };

  const statLabel: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 500,
    color: "var(--foreground-subtle)",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    margin: "0 0 12px 0",
  };

  const statValue: React.CSSProperties = {
    fontFamily: "var(--font-serif)",
    fontWeight: 700,
    fontSize: "2.5rem",
    color: "var(--foreground)",
    margin: 0,
    letterSpacing: "-0.02em",
    lineHeight: 1,
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          color: "var(--foreground-subtle)",
          margin: "0 0 14px 0",
        }}
      >
        Panel Admin
      </p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 700,
          fontSize: "2rem",
          color: "var(--foreground)",
          margin: "0 0 36px 0",
          letterSpacing: "-0.015em",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "44px",
          flexWrap: "wrap",
        }}
      >
        <div style={statCard}>
          <p style={statLabel}>Socios activos</p>
          <p style={statValue}>{totalActivos}</p>
        </div>

        <div style={statCard}>
          <p style={statLabel}>En Fase 01</p>
          <p style={statValue}>{enFase1}</p>
        </div>

        <div style={statCard}>
          <p style={statLabel}>En Fase 03</p>
          <p style={statValue}>{enFase3}</p>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--foreground-subtle)",
            margin: "0 0 14px 0",
          }}
        >
          Socios
        </p>
      </div>

      <SociosTable socios={sociosOrdenados} ultimaActividad={ultimaActividad} />
    </div>
  );
}
