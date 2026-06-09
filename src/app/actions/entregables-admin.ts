"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { EntregableTipo, EntregableEstado } from "@/types";

const BUCKET = "entregables";

const BLOCKED_EXTENSIONS = new Set([
  'exe', 'sh', 'bat', 'cmd', 'msi', 'com', 'scr', 'pif',
  'vbs', 'vbe', 'js', 'jse', 'ws', 'wsf', 'wsc', 'wsh',
  'ps1', 'psm1', 'psd1', 'reg', 'inf', 'hta', 'cpl', 'msp',
]);

const BLOCKED_MIMES = new Set([
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-sharedlib',
  'application/x-shellscript',
  'application/x-bat',
  'application/x-msi',
  'application/x-dosexec',
]);

// ─── URL firmada para upload directo desde el cliente ─────────────────────────

type SignedUploadUrlResult =
  | { ok: true; signedUrl: string; token: string; path: string }
  | { ok: false; error: string };

/**
 * Genera una Signed Upload URL para que el cliente suba el archivo
 * directamente a Supabase Storage sin pasar por Next.js.
 * Solo se llama desde el servidor; el cliente recibe la URL y hace el PUT.
 */
export async function getSignedUploadUrlAction(
  socioId: string,
  fase: 1 | 2 | 3,
  filename: string,
  mimeType: string,
): Promise<SignedUploadUrlResult> {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { ok: false, error: 'Por seguridad, no se permiten archivos ejecutables' };
  }
  if (BLOCKED_MIMES.has(mimeType)) {
    return { ok: false, error: 'Por seguridad, no se permiten archivos ejecutables' };
  }

  const supabase = createAdminClient();
  const path = `${socioId}/fase-${fase}/${Date.now()}-${filename}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { ok: false, error: error?.message ?? 'No se pudo generar la URL de subida' };
  }

  return { ok: true, signedUrl: data.signedUrl, token: data.token, path };
}

// ─── Crear entregable ─────────────────────────────────────────────────────────

type CreateEntregablePayload = {
  socioId: string;
  fase: 1 | 2 | 3;
  tipo: EntregableTipo;
  titulo: string;
  descripcion?: string;
  url?: string;
  estado: EntregableEstado;
  version_estado: 'vigente' | 'obsoleto';
  parent_id?: string | null;
  orden: number;
  /** Path en Supabase Storage, si ya se subió el archivo con signed URL. */
  storagePath?: string | null;
};

type EntregableResult = { ok: true } | { ok: false; error: string };

export async function createEntregableAction(
  payload: CreateEntregablePayload
): Promise<EntregableResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("entregables").insert({
    socio_id: payload.socioId,
    fase: payload.fase,
    tipo: payload.tipo,
    titulo: payload.titulo,
    descripcion: payload.descripcion ?? null,
    url: payload.url ?? null,
    storage_path: payload.storagePath ?? null,
    estado: payload.estado,
    version_estado: payload.version_estado,
    parent_id: payload.parent_id ?? null,
    orden: payload.orden,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${payload.socioId}`);
  return { ok: true };
}

// ─── Actualizar entregable ────────────────────────────────────────────────────

type UpdateEntregablePayload = {
  id: string;
  socioId: string;
  fase: 1 | 2 | 3;
  tipo: EntregableTipo;
  titulo: string;
  descripcion?: string;
  url?: string;
  estado: EntregableEstado;
  version_estado: 'vigente' | 'obsoleto';
  parent_id?: string | null;
  orden: number;
  /** Path nuevo en Storage (si se reemplazó el archivo). Si es null, conserva el path existente. */
  newStoragePath?: string | null;
  existingStoragePath?: string | null;
};

export async function updateEntregableAction(
  payload: UpdateEntregablePayload
): Promise<EntregableResult> {
  const supabase = createAdminClient();

  // Si se subió un archivo nuevo, usar ese path; si no, conservar el existente.
  const storagePath =
    payload.newStoragePath !== undefined
      ? payload.newStoragePath
      : (payload.existingStoragePath ?? null);

  const { error } = await supabase
    .from("entregables")
    .update({
      fase: payload.fase,
      tipo: payload.tipo,
      titulo: payload.titulo,
      descripcion: payload.descripcion ?? null,
      url: payload.url ?? null,
      storage_path: storagePath,
      estado: payload.estado,
      version_estado: payload.version_estado,
      parent_id: payload.parent_id ?? null,
      orden: payload.orden,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${payload.socioId}`);
  return { ok: true };
}

// ─── Eliminar entregable ──────────────────────────────────────────────────────

export async function deleteEntregableAction(
  id: string,
  socioId: string,
  storagePath?: string
): Promise<EntregableResult> {
  const supabase = createAdminClient();

  if (storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("entregables").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  return { ok: true };
}

// ─── Cambio rápido de estado ──────────────────────────────────────────────────

export async function updateEstadoEntregableAction(
  id: string,
  socioId: string,
  estado: EntregableEstado
): Promise<EntregableResult> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("entregables")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  return { ok: true };
}

// ─── Reordenar entregables (drag & drop) ─────────────────────────────────────

export async function reorderEntregablesAction(
  socioId: string,
  updates: { id: string; orden: number }[]
): Promise<EntregableResult> {
  const supabase = createAdminClient();

  const promises = updates.map(({ id, orden }) =>
    supabase
      .from("entregables")
      .update({ orden, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  return { ok: true };
}
