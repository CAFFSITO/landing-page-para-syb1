"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

// ─── Toggle activo (desde lista /admin/socios) ────────────────────────────────

export async function toggleSocioActivoAction(
  socioId: string,
  activo: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("socios")
    .update({ activo })
    .eq("id", socioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/socios");
  revalidatePath("/admin");
  return { ok: true };
}

// ─── Actualizar activo (desde perfil /admin/socios/[id]) ──────────────────────

export async function updateSocioActivoAction(
  socioId: string,
  activo: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("socios")
    .update({ activo })
    .eq("id", socioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  revalidatePath("/admin/socios");
  return { ok: true };
}

// ─── Actualizar fases completadas ─────────────────────────────────────────────

type FasesPayload = {
  fase_1_done: boolean;
  fase_2_done: boolean;
  fase_3_done: boolean;
};

export async function updateFasesAction(
  socioId: string,
  payload: FasesPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("socios")
    .update(payload)
    .eq("id", socioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  revalidatePath("/lobby");
  return { ok: true };
}

// ─── Crear socio (auth + DB) ──────────────────────────────────────────────────

type CreateSocioPayload = {
  nombre: string;
  email: string;
  empresa?: string;
  token: string;
  notas_admin?: string;
};

type CreateSocioResult =
  | { ok: true; socioId: string }
  | { ok: false; error: string };

export async function createSocioAction(
  payload: CreateSocioPayload
): Promise<CreateSocioResult> {
  const supabase = createAdminClient();

  // 1. Crear usuario en Supabase Auth usando el token como contraseña
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: payload.email,
      password: payload.token,
      email_confirm: true,
      user_metadata: { role: "socio" },
    });

  if (authError || !authData.user) {
    return { ok: false, error: authError?.message ?? "Error al crear usuario." };
  }

  const userId = authData.user.id;

  // 2. Insertar registro en tabla socios con el mismo UUID
  const { error: dbError } = await supabase.from("socios").insert({
    id: userId,
    nombre: payload.nombre,
    email: payload.email,
    empresa: payload.empresa ?? null,
    token: payload.token,
    notas_admin: payload.notas_admin ?? null,
    fase_actual: 1,
    fase_1_done: false,
    fase_2_done: false,
    fase_3_done: false,
    activo: true,
  });

  if (dbError) {
    // Rollback: eliminar el usuario Auth creado
    await supabase.auth.admin.deleteUser(userId);
    return { ok: false, error: dbError.message };
  }

  revalidatePath("/admin/socios");
  revalidatePath("/admin");
  return { ok: true, socioId: userId };
}
