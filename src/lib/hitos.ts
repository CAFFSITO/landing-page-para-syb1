export type HitoKey =
  | "f1_contrato"
  | "f1_r1_kickoff"
  | "f1_moa"
  | "f1_r2_moa"
  | "f1_roadmap"
  | "f1_r3_roadmap"
  | "f2_automatizacion"
  | "f2_diseno"
  | "f2_moo"
  | "f2_r4_moo"
  | "f3_entregas"
  | "f3_28dias"
  | "f3_r5"
  | "f3_r6"
  | "f3_r7"
  | "f3_r8"
  | "f3_moa_moo"
  | "f3_r9";

export type HitosMap = Partial<Record<HitoKey, boolean>>;

export type HitoConfig = {
  key: HitoKey;
  label: string;
  fase: 1 | 2 | 3;
  peso: 1 | 2;
  activaGarantia?: true;
};

export const HITOS: HitoConfig[] = [
  // ─── FASE 1 ───────────────────────────────── 6 pts
  { key: "f1_contrato",    label: "Firma del contrato",                               fase: 1, peso: 1 },
  { key: "f1_r1_kickoff",  label: "Reunión #1 Kick off + Diagnóstico realizada",      fase: 1, peso: 1 },
  { key: "f1_moa",         label: "MOA Construido",                                   fase: 1, peso: 1 },
  { key: "f1_r2_moa",      label: "Reunión #2 MOA Realizada",                         fase: 1, peso: 1 },
  { key: "f1_roadmap",     label: "Roadmap construido",                               fase: 1, peso: 1 },
  { key: "f1_r3_roadmap",  label: "Reunión #3 Roadmap realizada",                     fase: 1, peso: 1 },

  // ─── FASE 2 ───────────────────────────────── 5 pts (1 peso doble)
  { key: "f2_automatizacion", label: "Mínimo una Automatización atómica entregada",            fase: 2, peso: 1 },
  { key: "f2_diseno",         label: "Soluciones en proceso de DISEÑO por el equipo de SYB",  fase: 2, peso: 2 },
  { key: "f2_moo",            label: "MOO Construido",                                         fase: 2, peso: 1 },
  { key: "f2_r4_moo",         label: "Reunión #4 MOO realizada",                               fase: 2, peso: 1 },

  // ─── FASE 3 ───────────────────────────────── 9 pts (1 peso doble)
  { key: "f3_entregas",   label: "Comienzan las entregas + capacitaciones progresivas",  fase: 3, peso: 2 },
  { key: "f3_28dias",     label: "Comienzan los 28 días (reuniones ya agendadas)",       fase: 3, peso: 1 },
  { key: "f3_r5",         label: "Reunión #5 (La primera de los 28 días)",               fase: 3, peso: 1, activaGarantia: true },
  { key: "f3_r6",         label: "Reunión #6 (La 2da de los 28 días)",                   fase: 3, peso: 1 },
  { key: "f3_r7",         label: "Reunión #7 (La 3era de los 28 días)",                  fase: 3, peso: 1 },
  { key: "f3_r8",         label: "Reunión #8 (La última de los 28 días)",                fase: 3, peso: 1 },
  { key: "f3_moa_moo",    label: "Comparación MOA vs MOO construida",                   fase: 3, peso: 1 },
  { key: "f3_r9",         label: "Reunión #9 realizada (reunión final)",                 fase: 3, peso: 1 },
];

export const PUNTOS_TOTALES = 20; // 6 + 5 + 9

export function calcularPorcentaje(hitos: HitosMap): number {
  const pts = HITOS.reduce((acc, h) => acc + (hitos[h.key] ? h.peso : 0), 0);
  return Math.round((pts / PUNTOS_TOTALES) * 100);
}

export const HITOS_POR_FASE = (fase: 1 | 2 | 3) =>
  HITOS.filter((h) => h.fase === fase);
