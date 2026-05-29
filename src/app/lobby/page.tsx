import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/lobby/ProgressBar";
import LobbyShell from "@/app/lobby/LobbyShell";
import ProgramaRoadmap from "@/components/lobby/ProgramaRoadmap";
import PhaseTree from "@/components/lobby/PhaseTree";
import GarantiaStatus from "@/components/lobby/GarantiaStatus";
import ReunionesSection from "@/components/lobby/ReunionesSection";
import { calcularPorcentaje } from "@/lib/hitos";
import type { Socio, GarantiaData } from "@/types";
import type { HitosMap } from "@/lib/hitos";

export default async function LobbyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const adminClient = createAdminClient();

  const { data: socio } = await adminClient
    .from("socios")
    .select("*")
    .eq("email", user.email)
    .single<Socio>();

  if (!socio) redirect("/");

  const hitos: HitosMap = (socio.hitos as HitosMap | undefined) ?? {};
  const garantia: GarantiaData = socio.garantia ?? {};
  const progressPct = calcularPorcentaje(hitos);
  const garantiaActiva = !!hitos["f3_r5"];
  const opcion = garantia.opcion_ejecutada ?? null;

  const [
    { data: entregables },
    { data: reuniones },
    { data: reportes },
    { data: lecturas },
  ] = await Promise.all([
    adminClient
      .from("entregables")
      .select("*")
      .eq("socio_id", socio.id)
      .neq("estado", "pendiente")
      .order("fase")
      .order("orden"),

    adminClient
      .from("reuniones")
      .select("*")
      .eq("socio_id", socio.id)
      .order("fase")
      .order("numero"),

    adminClient
      .from("reportes")
      .select("*")
      .eq("socio_id", socio.id)
      .eq("visible", true)
      .order("fase")
      .order("numero"),

    adminClient
      .from("lecturas")
      .select("*")
      .eq("socio_id", socio.id),
  ]);

  // Stub para el Pack de Consultoría (Opción B) — contenido real se construye luego
  const consultoriaContent =
    opcion === "B" ? (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: 12,
          }}
        >
          Pack de Consultoría Estratégica en IA
        </p>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--foreground-muted)",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Tu acceso a los recursos y la consultoría está siendo preparado. Pronto encontrarás
          aquí los PDFs, videos de la Masterclass y el calendario para los 60 días de consultoría.
        </p>
      </div>
    ) : undefined;

  return (
    <>
      <ProgressBar
        progressPct={progressPct}
        faseActual={socio.fase_actual}
        nombreSocio={socio.nombre}
        garantia={garantia}
      />

      <LobbyShell
        socio={socio}
        garantia={garantia}
        consultoriaContent={consultoriaContent}
        programaContent={
          <ProgramaRoadmap
            nombreSocio={socio.nombre}
            empresaNombre={socio.empresa ?? "tu empresa"}
          />
        }
        progresoContent={
          <>
            <PhaseTree
              socio={socio}
              entregables={entregables ?? []}
              reuniones={reuniones ?? []}
              reportes={reportes ?? []}
              lecturas={lecturas ?? []}
            />
            <GarantiaStatus
              garantia={garantia}
              garantiaActiva={garantiaActiva}
              nombreSocio={socio.nombre}
            />
          </>
        }
        reunionesContent={<ReunionesSection reuniones={reuniones ?? []} />}
      />
    </>
  );
}
