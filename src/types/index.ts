/**
 * Tipos centrales del proyecto SYB.
 *
 * Todas las entidades del sistema están definidas aquí.
 * Reflejan la estructura de las tablas en Supabase.
 */

// ─── Socio ──────────────────────────────────────────────────────────────────

/** Representa a un socio (cliente) dentro del programa SYB. */
export type Socio = {
  id: string;
  nombre: string;
  email: string;
  /** Token único para acceso al portal del socio (login por link). */
  token: string;
  empresa?: string;
  /** Fase en la que se encuentra actualmente (1, 2 o 3). */
  fase_actual: 1 | 2 | 3;
  fase_1_done: boolean;
  fase_2_done: boolean;
  fase_3_done: boolean;
  /** Indica si el socio está activo en el programa. */
  activo: boolean;
  created_at: string;
  /** Notas internas del administrador sobre este socio. */
  notas_admin?: string;
};

// ─── Entregables ────────────────────────────────────────────────────────────

/** Tipos de entregable que puede recibir o enviar un socio. */
export type EntregableTipo =
  | "pdf"
  | "video"
  | "reporte"
  | "registro_reunion"
  | "agenda";

/** Estado de revisión de un entregable. */
export type EntregableEstado = "enviado" | "rechazado" | "pendiente";

/** Un entregable asociado a un socio dentro de una fase. */
export type Entregable = {
  id: string;
  socio_id: string;
  fase: 1 | 2 | 3;
  tipo: EntregableTipo;
  titulo: string;
  descripcion?: string;
  /** URL pública del entregable (si aplica). */
  url?: string;
  /** Ruta en Supabase Storage (si se subió un archivo). */
  storage_path?: string;
  estado: EntregableEstado;
  /** Orden de aparición dentro de la fase. */
  orden: number;
  created_at: string;
  updated_at: string;
};

// ─── Reuniones ──────────────────────────────────────────────────────────────

/** Una reunión programada o completada con un socio. */
export type Reunion = {
  id: string;
  socio_id: string;
  fase: 1 | 2 | 3;
  /** Número secuencial de la reunión dentro de la fase. */
  numero: number;
  nombre: string;
  fecha?: string;
  agenda_url?: string;
  grabacion_url?: string;
  notas?: string;
  completada: boolean;
  created_at: string;
};

// ─── Reportes ───────────────────────────────────────────────────────────────

/** Un reporte generado para el socio dentro de una fase. */
export type Reporte = {
  id: string;
  socio_id: string;
  fase: 1 | 2 | 3;
  /** Número secuencial del reporte dentro de la fase. */
  numero: number;
  titulo: string;
  /** Contenido del reporte (puede ser Markdown). */
  contenido: string;
  /** Indica si el reporte es visible para el socio. */
  visible: boolean;
  created_at: string;
};

// ─── Lecturas (tracking de visto) ───────────────────────────────────────────

/** Registro de que un socio leyó/vio un entregable, reunión o reporte. */
export type Lectura = {
  id: string;
  socio_id: string;
  entregable_id?: string;
  reunion_id?: string;
  reporte_id?: string;
  /** Fecha y hora en que el socio marcó como leído. */
  leido_at: string;
};
