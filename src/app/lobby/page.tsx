import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/lobby/ProgressBar";
import LobbyShell from "@/app/lobby/LobbyShell";
import ProgramaRoadmap from "@/components/lobby/ProgramaRoadmap";
import PhaseTree from "@/components/lobby/PhaseTree";
import CalendarioReuniones from "@/components/lobby/CalendarioReuniones";
import type { Socio, Entregable, Reunion, Reporte, Lectura } from "@/types";

export default async function LobbyPage() {
  const supabase = await createClient();

  // Validar sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Obtener datos del socio vinculado al usuario autenticado
  const { data: socio } = await supabase
    .from("socios")
    .select(
      "id, nombre, empresa, fase_actual, fase_1_done, fase_2_done, fase_3_done, email, token, activo, created_at"
    )
    .eq("id", user.id)
    .single<Socio>();

  if (!socio) {
    redirect("/");
  }

  // Fetches paralelos: entregables, reuniones, reportes, lecturas
  const [
    { data: entregables },
    { data: reuniones },
    { data: reportes },
    { data: lecturas },
  ] = await Promise.all([
    supabase
      .from("entregables")
      .select("*")
      .eq("socio_id", socio.id)
      .neq("estado", "pendiente")
      .order("fase")
      .order("orden")
      .returns<Entregable[]>(),

    supabase
      .from("reuniones")
      .select("*")
      .eq("socio_id", socio.id)
      .order("fase")
      .order("numero")
      .returns<Reunion[]>(),

    supabase
      .from("reportes")
      .select("*")
      .eq("socio_id", socio.id)
      .eq("visible", true)
      .order("fase")
      .order("numero")
      .returns<Reporte[]>(),

    supabase
      .from("lecturas")
      .select("*")
      .eq("socio_id", socio.id)
      .returns<Lectura[]>(),
  ]);

  // Calcular porcentaje de progreso según fases completadas
  const fasesCompletas = [socio.fase_1_done, socio.fase_2_done, socio.fase_3_done].filter(
    Boolean
  ).length;
  const progressPct = (fasesCompletas === 3 ? 100 : fasesCompletas * 33) as
    | 0
    | 33
    | 66
    | 100;

  return (
    <>
      <ProgressBar
        progressPct={progressPct}
        faseActual={socio.fase_actual}
        nombreSocio={socio.nombre}
      />

      <LobbyShell
        socio={socio}
        programaContent={
          <ProgramaRoadmap
            nombreSocio={socio.nombre}
            empresaNombre={socio.empresa ?? "tu empresa"}
          />
        }
        progresoContent={
          <PhaseTree
            socio={socio}
            entregables={entregables ?? []}
            reuniones={reuniones ?? []}
            reportes={reportes ?? []}
            lecturas={lecturas ?? []}
          />
        }
        reunionesContent={<CalendarioReuniones reuniones={reuniones ?? []} />}
      />
    </>
  );
}
