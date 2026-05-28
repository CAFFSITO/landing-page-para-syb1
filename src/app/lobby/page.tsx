import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/lobby/ProgressBar";
import LobbyShell from "@/app/lobby/LobbyShell";
import ProgramaRoadmap from "@/components/lobby/ProgramaRoadmap";
import PhaseTree from "@/components/lobby/PhaseTree";
import ReunionesSection from "@/components/lobby/ReunionesSection";
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

  // Para los datos, usamos el cliente Admin. 
  // Esto evita que RLS bloquee la lectura si el ID de Auth (generado dinámicamente) 
  // no coincide con el ID de la tabla socios (generado al insertar manualmente).
  // La seguridad está garantizada porque filtramos estrictamente por `user.email` (que es seguro y viene del token validado).
  const adminClient = createAdminClient();

  const { data: socio } = await adminClient
    .from("socios")
    .select(
      "id, nombre, empresa, fase_actual, fase_1_done, fase_2_done, fase_3_done, email, token, activo, created_at"
    )
    .eq("email", user.email)
    .single<Socio>();

  if (!socio) {
    redirect("/");
  }

  // Fetches paralelos: entregables, reuniones, reportes, lecturas (usando adminClient)
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
      .order("orden")
      .returns<Entregable[]>(),

    adminClient
      .from("reuniones")
      .select("*")
      .eq("socio_id", socio.id)
      .order("fase")
      .order("numero")
      .returns<Reunion[]>(),

    adminClient
      .from("reportes")
      .select("*")
      .eq("socio_id", socio.id)
      .eq("visible", true)
      .order("fase")
      .order("numero")
      .returns<Reporte[]>(),

    adminClient
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
        reunionesContent={<ReunionesSection reuniones={reuniones ?? []} />}
      />
    </>
  );
}
