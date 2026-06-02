"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { EntregableTipo, EntregableEstado } from "@/types";

const BUCKET = "entregables";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

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

const BLOCKED_EXTENSIONS = new Set([
  'exe', 'sh', 'bat', 'cmd', 'msi', 'com', 'scr', 'pif',
  'vbs', 'vbe', 'js', 'jse', 'ws', 'wsf', 'wsc', 'wsh',
  'ps1', 'psm1', 'psd1', 'reg', 'inf', 'hta', 'cpl', 'msp',
]);

function validateFile(file: { base64: string; filename: string; mimeType: string }): string | null {
  const bytes = Buffer.from(file.base64, 'base64');
  if (bytes.length > MAX_FILE_SIZE) return 'Archivo muy pesado (máx. 500 MB)';
  const ext = file.filename.split('.').pop()?.toLowerCase() ?? '';
  if (BLOCKED_EXTENSIONS.has(ext)) return 'Por seguridad, no se permiten archivos ejecutables';
  if (BLOCKED_MIMES.has(file.mimeType)) return 'Por seguridad, no se permiten archivos ejecutables';
  return null;
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
  file?: { base64: string; filename: string; mimeType: string };
};

type EntregableResult = { ok: true } | { ok: false; error: string };

export async function createEntregableAction(
  payload: CreateEntregablePayload
): Promise<EntregableResult> {
  const supabase = createAdminClient();
  let storagePath: string | null = null;

  // Subir archivo si se proporcionó
  if (payload.file) {
    const validationError = validateFile(payload.file);
    if (validationError) return { ok: false, error: validationError };

    console.log('[Entregable:create] Subiendo archivo:', payload.file.filename, payload.file.mimeType);

    const bytes = Buffer.from(payload.file.base64, "base64");
    const path = `${payload.socioId}/fase-${payload.fase}/${Date.now()}-${payload.file.filename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: payload.file.mimeType,
        upsert: false,
      });

    if (uploadError) return { ok: false, error: uploadError.message };
    storagePath = path;
  }

  const { error } = await supabase.from("entregables").insert({
    socio_id: payload.socioId,
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
  file?: { base64: string; filename: string; mimeType: string };
  existingStoragePath?: string;
};

export async function updateEntregableAction(
  payload: UpdateEntregablePayload
): Promise<EntregableResult> {
  const supabase = createAdminClient();
  let storagePath = payload.existingStoragePath ?? null;

  if (payload.file) {
    const validationError = validateFile(payload.file);
    if (validationError) return { ok: false, error: validationError };

    console.log('[Entregable:update] Subiendo archivo:', payload.file.filename, payload.file.mimeType);

    const bytes = Buffer.from(payload.file.base64, "base64");
    const path = `${payload.socioId}/fase-${payload.fase}/${Date.now()}-${payload.file.filename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: payload.file.mimeType, upsert: false });

    if (uploadError) return { ok: false, error: uploadError.message };
    storagePath = path;
  }

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
