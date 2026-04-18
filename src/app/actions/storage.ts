"use server";

import { createAdminClient } from "@/lib/supabase/server";

const BUCKET = "entregables";
const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hora

type SignedUrlResult = { url: string; error?: never } | { url?: never; error: string };

/** Genera una URL firmada temporal para un archivo en Supabase Storage. */
export async function obtenerSignedUrl(storagePath: string): Promise<SignedUrlResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data?.signedUrl) {
    return { error: error?.message ?? "No se pudo generar la URL del archivo." };
  }

  return { url: data.signedUrl };
}
