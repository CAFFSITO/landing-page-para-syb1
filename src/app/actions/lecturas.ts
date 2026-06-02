"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

type LecturaPayload = {
  entregable_id?: string;
  reunion_id?: string;
  reporte_id?: string;
};

type LecturaResult = { ok: true } | { ok: false; error: string };

export async function registrarLecturaAction(
  payload: LecturaPayload
): Promise<LecturaResult> {
  const { entregable_id, reunion_id, reporte_id } = payload;

  const ids = [entregable_id, reunion_id, reporte_id].filter(Boolean);
  if (ids.length !== 1) {
    throw new Error("Exactamente un ID debe estar presente en el payload de lectura.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "No hay sesión activa." };
  }

  // Resolver el socio_id real desde la tabla socios por email,
  // ya que el auth user.id puede no coincidir con el id en la tabla socios
  // (socios insertados manualmente tienen IDs distintos).
  const adminClient = createAdminClient();
  const { data: socio } = await adminClient
    .from("socios")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!socio) {
    return { ok: false, error: "Socio no encontrado." };
  }

  const { error } = await adminClient.from("lecturas").insert({
    socio_id: socio.id,
    entregable_id: entregable_id ?? null,
    reunion_id: reunion_id ?? null,
    reporte_id: reporte_id ?? null,
  });

  if (error) {
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: error.message };
  }

  revalidatePath("/lobby");
  return { ok: true };
}
