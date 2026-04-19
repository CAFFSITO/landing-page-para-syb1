"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

type ReporteResult = { ok: true } | { ok: false; error: string };

// ─── Crear reporte ────────────────────────────────────────────────────────────

type CreateReportePayload = {
  socioId: string;
  fase: 1 | 2 | 3;
  numero: number;
  titulo: string;
  contenido: string;
  visible: boolean;
};

export async function createReporteAction(
  payload: CreateReportePayload
): Promise<ReporteResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("reportes").insert({
    socio_id: payload.socioId,
    fase: payload.fase,
    numero: payload.numero,
    titulo: payload.titulo,
    contenido: payload.contenido,
    visible: payload.visible,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${payload.socioId}`);
  return { ok: true };
}

// ─── Actualizar reporte ───────────────────────────────────────────────────────

type UpdateReportePayload = CreateReportePayload & { id: string };

export async function updateReporteAction(
  payload: UpdateReportePayload
): Promise<ReporteResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("reportes")
    .update({
      fase: payload.fase,
      numero: payload.numero,
      titulo: payload.titulo,
      contenido: payload.contenido,
      visible: payload.visible,
    })
    .eq("id", payload.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${payload.socioId}`);
  return { ok: true };
}

// ─── Eliminar reporte ─────────────────────────────────────────────────────────

export async function deleteReporteAction(
  id: string,
  socioId: string
): Promise<ReporteResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("reportes").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  return { ok: true };
}

// ─── Toggle visibilidad rápido ────────────────────────────────────────────────

export async function toggleVisibleReporteAction(
  id: string,
  socioId: string,
  visible: boolean
): Promise<ReporteResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("reportes")
    .update({ visible })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  return { ok: true };
}
