"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

type ReunionResult = { ok: true } | { ok: false; error: string };

// ─── Crear reunión ────────────────────────────────────────────────────────────

type CreateReunionPayload = {
  socioId: string;
  fase: 1 | 2 | 3;
  numero: number;
  nombre: string;
  fecha?: string;
  agenda_url?: string;
  grabacion_url?: string;
  notas?: string;
  completada: boolean;
};

export async function createReunionAction(
  payload: CreateReunionPayload
): Promise<ReunionResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("reuniones").insert({
    socio_id: payload.socioId,
    fase: payload.fase,
    numero: payload.numero,
    nombre: payload.nombre,
    fecha: payload.fecha ?? null,
    agenda_url: payload.agenda_url ?? null,
    grabacion_url: payload.grabacion_url ?? null,
    notas: payload.notas ?? null,
    completada: payload.completada,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${payload.socioId}`);
  return { ok: true };
}

// ─── Actualizar reunión ───────────────────────────────────────────────────────

type UpdateReunionPayload = CreateReunionPayload & { id: string };

export async function updateReunionAction(
  payload: UpdateReunionPayload
): Promise<ReunionResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("reuniones")
    .update({
      fase: payload.fase,
      numero: payload.numero,
      nombre: payload.nombre,
      fecha: payload.fecha ?? null,
      agenda_url: payload.agenda_url ?? null,
      grabacion_url: payload.grabacion_url ?? null,
      notas: payload.notas ?? null,
      completada: payload.completada,
    })
    .eq("id", payload.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${payload.socioId}`);
  return { ok: true };
}

// ─── Eliminar reunión ─────────────────────────────────────────────────────────

export async function deleteReunionAction(
  id: string,
  socioId: string
): Promise<ReunionResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("reuniones").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  return { ok: true };
}
