"use server";

import { createClient } from "@/lib/supabase/server";

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

  // Exactamente uno de los tres IDs debe estar presente
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

  const { error } = await supabase.from("lecturas").insert({
    socio_id: user.id,
    entregable_id: entregable_id ?? null,
    reunion_id: reunion_id ?? null,
    reporte_id: reporte_id ?? null,
  });

  if (error) {
    // Ignorar silenciosamente si la lectura ya existe (unique constraint)
    if (error.code === "23505") {
      return { ok: true };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
