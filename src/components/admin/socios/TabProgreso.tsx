'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { ShieldCheck, ShieldX, AlertTriangle, Lock } from 'lucide-react';
import { updateSocioActivoAction } from '@/app/actions/socios';
import { updateHitosAction } from '@/app/actions/hitos-admin';
import { updateGarantiaAction } from '@/app/actions/garantia-admin';
import { HITOS, HITOS_POR_FASE, calcularPorcentaje } from '@/lib/hitos';
import type { HitoKey, HitosMap } from '@/lib/hitos';
import type { Socio, GarantiaData } from '@/types';

interface Props { socio: Socio }

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      aria-pressed={value}
      style={{
        width: 38,
        height: 21,
        borderRadius: 11,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled
          ? 'var(--hairline-strong)'
          : value
          ? 'var(--color-secondary)'
          : 'var(--hairline-strong)',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 200ms',
        outline: 'none',
        padding: 0,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 19 : 3,
          width: 15,
          height: 15,
          borderRadius: '50%',
          backgroundColor: 'white',
          transition: 'left 200ms',
        }}
      />
    </button>
  );
}

// ─── Estilos comunes ─────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface-1)',
  border: '1px solid var(--hairline)',
  borderRadius: 'var(--radius-md)',
  padding: '24px',
  marginBottom: '20px',
};

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: 'var(--foreground-subtle)',
  margin: '0 0 16px 0',
};

const faseHeader: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--foreground-muted)',
  padding: '10px 0 8px',
  borderBottom: '1px solid var(--hairline)',
  marginBottom: 4,
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function TabProgreso({ socio }: Props) {
  const [activo, setActivo] = useState(socio.activo);
  const [hitos, setHitos] = useState<HitosMap>(
    (socio.hitos as HitosMap | undefined) ?? {}
  );
  const [garantia, setGarantia] = useState<GarantiaData>(socio.garantia ?? {});
  const [saving, setSaving] = useState<string | null>(null);

  // State para razón de incumplimiento pendiente
  const [pendingBreach, setPendingBreach] = useState<{
    key: 'breach_reunion' | 'breach_uso' | 'breach_reporte';
    razonKey: 'breach_reunion_razon' | 'breach_uso_razon' | 'breach_reporte_razon';
    razon: string;
  } | null>(null);

  // State para confirmar cláusula
  const [confirmandoClausula, setConfirmandoClausula] = useState(false);
  const [confirmandoOpcion, setConfirmandoOpcion] = useState<'A' | 'B' | null>(null);

  const garantiaActiva = !!hitos['f3_r5'];
  const pct = calcularPorcentaje(hitos);
  const hayIncumplimiento =
    garantia.breach_reunion || garantia.breach_uso || garantia.breach_reporte;

  // ─── Handlers ───────────────────────────────────────────────────────────────

  async function handleToggleActivo() {
    const prev = activo;
    setActivo(!prev);
    const res = await updateSocioActivoAction(socio.id, !prev);
    if (!res.ok) { setActivo(prev); toast.error(res.error); }
    else toast.success('Estado actualizado');
  }

  async function handleToggleHito(key: HitoKey) {
    const prev = !!hitos[key];
    const next: HitosMap = { ...hitos, [key]: !prev };
    setHitos(next);
    setSaving(key);
    const res = await updateHitosAction(socio.id, next);
    setSaving(null);
    if (!res.ok) { setHitos({ ...hitos }); toast.error(res.error); }
    else toast.success('Hito actualizado');
  }

  async function saveGarantia(next: GarantiaData) {
    setGarantia(next);
    const res = await updateGarantiaAction(socio.id, next);
    if (!res.ok) { setGarantia(garantia); toast.error(res.error); }
    else toast.success('Garantía actualizada');
  }

  function handleBreachToggle(
    key: 'breach_reunion' | 'breach_uso' | 'breach_reporte',
    razonKey: 'breach_reunion_razon' | 'breach_uso_razon' | 'breach_reporte_razon'
  ) {
    if (garantia[key]) {
      // Apagar: limpiar incumplimiento + razón
      saveGarantia({ ...garantia, [key]: false, [razonKey]: '' });
    } else {
      // Encender: pedir razón antes de guardar
      setPendingBreach({ key, razonKey, razon: '' });
    }
  }

  async function confirmBreach() {
    if (!pendingBreach || !pendingBreach.razon.trim()) return;
    const next: GarantiaData = {
      ...garantia,
      [pendingBreach.key]: true,
      [pendingBreach.razonKey]: pendingBreach.razon.trim(),
    };
    setPendingBreach(null);
    await saveGarantia(next);
  }

  async function handleEjecutarOpcion(opcion: 'A' | 'B') {
    const next: GarantiaData = {
      ...garantia,
      clausula_activa: true,
      opcion_ejecutada: opcion,
      opcion_ejecutada_at: new Date().toISOString(),
    };
    setConfirmandoOpcion(null);
    setConfirmandoClausula(false);
    await saveGarantia(next);
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Estado activo ──────────────────────────────────────────────────── */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Estado</p>
        <button
          onClick={handleToggleActivo}
          className={activo ? 'syb-tag syb-tag-success' : 'syb-tag syb-tag-danger'}
          style={{ cursor: 'pointer', padding: '6px 14px', fontSize: '0.72rem' }}
        >
          {activo ? 'Activo · Click para desactivar' : 'Inactivo · Click para activar'}
        </button>
      </div>

      {/* ── Hitos de progreso ──────────────────────────────────────────────── */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Hitos de progreso</p>

        {([1, 2, 3] as const).map((fase) => {
          const hitosFase = HITOS_POR_FASE(fase);
          const ptsFase = hitosFase.reduce((s, h) => s + h.peso, 0);
          const ptsActivos = hitosFase.reduce(
            (s, h) => s + (hitos[h.key] ? h.peso : 0),
            0
          );

          return (
            <div key={fase} style={{ marginBottom: 24 }}>
              <div style={{ ...faseHeader, display: 'flex', justifyContent: 'space-between' }}>
                <span>Fase {fase.toString().padStart(2, '0')}</span>
                <span style={{ color: 'var(--foreground-subtle)', fontWeight: 400 }}>
                  {ptsActivos}/{ptsFase} pts
                </span>
              </div>

              {hitosFase.map((h, idx) => {
                const activo = !!hitos[h.key];
                const isSaving = saving === h.key;
                return (
                  <div
                    key={h.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 0',
                      borderTop: idx === 0 ? 'none' : '1px solid var(--hairline)',
                      opacity: isSaving ? 0.6 : 1,
                      transition: 'opacity 150ms',
                    }}
                  >
                    <Toggle
                      value={activo}
                      onChange={() => handleToggleHito(h.key)}
                      disabled={isSaving}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: '0.875rem',
                        color: activo ? 'var(--foreground)' : 'var(--foreground-muted)',
                        fontWeight: activo ? 600 : 400,
                        lineHeight: 1.4,
                      }}
                    >
                      {h.label}
                    </span>
                    {h.peso === 2 && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.58rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--color-secondary)',
                          border: '1px solid var(--color-secondary)',
                          borderRadius: 4,
                          padding: '2px 5px',
                          flexShrink: 0,
                          opacity: 0.7,
                        }}
                      >
                        ×2
                      </span>
                    )}
                    {h.activaGarantia && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.55rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#4ade80',
                          border: '1px solid rgba(74,222,128,0.4)',
                          borderRadius: 4,
                          padding: '2px 5px',
                          flexShrink: 0,
                          opacity: 0.75,
                        }}
                      >
                        Garantía
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Barra de progreso del admin */}
        {(() => {
          const garantiaEjecutada = !!garantia.opcion_ejecutada;
          const displayPct = garantiaEjecutada ? 100 : pct;
          const barColor = garantiaEjecutada ? '#4ade80' : 'var(--color-secondary)';
          return (
            <div
              style={{
                marginTop: 4,
                borderTop: '1px solid var(--hairline)',
                paddingTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: 'var(--hairline)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${displayPct}%`,
                    backgroundColor: barColor,
                    borderRadius: 2,
                    transition: 'width 600ms ease, background-color 600ms ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: garantiaEjecutada ? '#4ade80' : 'var(--foreground)',
                  flexShrink: 0,
                  minWidth: 36,
                  textAlign: 'right',
                }}
              >
                {garantiaEjecutada ? 'Garantía ejecutada' : `${displayPct}%`}
              </span>
            </div>
          );
        })()}
      </div>

      {/* ── Garantía ───────────────────────────────────────────────────────── */}
      <div
        style={{
          ...cardStyle,
          opacity: garantiaActiva ? 1 : 0.45,
          pointerEvents: garantiaActiva ? 'auto' : 'none',
          position: 'relative',
        }}
      >
        {!garantiaActiva && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: 'var(--foreground-subtle)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Lock size={12} />
            Activa con Reunión #5
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          {hayIncumplimiento ? (
            <ShieldX size={18} color="#ef4444" />
          ) : (
            <ShieldCheck size={18} color="#4ade80" />
          )}
          <p style={{ ...sectionTitle, margin: 0 }}>Garantía</p>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: hayIncumplimiento ? '#ef4444' : '#4ade80',
              backgroundColor: hayIncumplimiento
                ? 'rgba(239,68,68,0.08)'
                : 'rgba(74,222,128,0.08)',
              border: `1px solid ${hayIncumplimiento ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'}`,
              borderRadius: 999,
              padding: '3px 10px',
            }}
          >
            {hayIncumplimiento ? 'Suspendida' : 'Válida'}
          </span>
        </div>

        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--foreground-muted)',
            marginBottom: 16,
            marginTop: 0,
            lineHeight: 1.6,
          }}
        >
          Si algún incumplimiento es activado, la garantía pasa a rojo y el socio verá
          el motivo en su lobby.
        </p>

        {/* ── Incumplimientos ───────────────────────────────────────────────── */}
        {(
          [
            {
              key: 'breach_reunion' as const,
              razonKey: 'breach_reunion_razon' as const,
              label: 'Faltó a una reunión de los 28 días sin avisar 12hs antes',
            },
            {
              key: 'breach_uso' as const,
              razonKey: 'breach_uso_razon' as const,
              label: 'El sistema no registró uso durante 7 días',
            },
            {
              key: 'breach_reporte' as const,
              razonKey: 'breach_reporte_razon' as const,
              label: 'Se tardó más de 48hs en reportar un error',
            },
          ] as const
        ).map((item, idx) => {
          const isActive = !!garantia[item.key];
          const razon = garantia[item.razonKey] ?? '';
          const isPending =
            pendingBreach?.key === item.key;

          return (
            <div
              key={item.key}
              style={{
                borderTop: idx === 0 ? '1px solid var(--hairline)' : 'none',
                borderBottom: '1px solid var(--hairline)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                }}
              >
                <Toggle
                  value={isActive}
                  onChange={() => handleBreachToggle(item.key, item.razonKey)}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: isActive ? '#ef4444' : 'var(--foreground-muted)',
                    fontWeight: isActive ? 600 : 400,
                    lineHeight: 1.4,
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Razón guardada */}
              {isActive && razon && !isPending && (
                <div
                  style={{
                    marginBottom: 12,
                    marginLeft: 50,
                    fontSize: '0.78rem',
                    color: 'var(--foreground-muted)',
                    backgroundColor: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: '#ef4444' }}>Razón: </strong>{razon}
                </div>
              )}

              {/* Input de razón pendiente */}
              {isPending && (
                <div style={{ marginBottom: 12, marginLeft: 50 }}>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--foreground-muted)',
                      margin: '0 0 8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <AlertTriangle size={12} color="#f59e0b" />
                    Ingresá la razón del incumplimiento (obligatorio)
                  </p>
                  <textarea
                    autoFocus
                    value={pendingBreach.razon}
                    onChange={(e) =>
                      setPendingBreach({ ...pendingBreach, razon: e.target.value })
                    }
                    placeholder="Ej: No se conectó a la reunión del 15/06 sin previo aviso."
                    rows={3}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface-0)',
                      border: '1px solid var(--hairline-strong)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      color: 'var(--foreground)',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={confirmBreach}
                      disabled={!pendingBreach.razon.trim()}
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: pendingBreach.razon.trim() ? 'pointer' : 'not-allowed',
                        opacity: pendingBreach.razon.trim() ? 1 : 0.5,
                      }}
                    >
                      Confirmar incumplimiento
                    </button>
                    <button
                      onClick={() => setPendingBreach(null)}
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.78rem',
                        color: 'var(--foreground-muted)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--hairline)',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Cláusula de protección ────────────────────────────────────────── */}
        <div style={{ marginTop: 24, borderTop: '2px dashed var(--hairline)', paddingTop: 20 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--foreground-subtle)',
              margin: '0 0 12px 0',
            }}
          >
            Activación de la garantía
          </p>

          {garantia.opcion_ejecutada ? (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(157,92,192,0.06)',
                border: '1px solid rgba(157,92,192,0.2)',
                borderRadius: 8,
                fontSize: '0.82rem',
                color: 'var(--foreground-muted)',
              }}
            >
              Cláusula ejecutada:{' '}
              <strong style={{ color: 'var(--foreground)' }}>
                Opción {garantia.opcion_ejecutada}
              </strong>
              {garantia.opcion_ejecutada_at && (
                <span style={{ marginLeft: 8, opacity: 0.6, fontSize: '0.75rem' }}>
                  {new Date(garantia.opcion_ejecutada_at).toLocaleString('es-AR')}
                </span>
              )}
            </div>
          ) : !confirmandoClausula ? (
            <button
              disabled={hayIncumplimiento}
              onClick={() => setConfirmandoClausula(true)}
              style={{
                padding: '10px 20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: !hayIncumplimiento
                  ? 'rgba(157,92,192,0.1)'
                  : 'transparent',
                color: !hayIncumplimiento ? 'var(--color-secondary)' : 'var(--foreground-subtle)',
                border: `1px solid ${!hayIncumplimiento ? 'rgba(157,92,192,0.4)' : 'var(--hairline)'}`,
                borderRadius: 8,
                cursor: !hayIncumplimiento ? 'pointer' : 'not-allowed',
                opacity: !hayIncumplimiento ? 1 : 0.4,
              }}
            >
              Ejecutar cláusula de protección total
            </button>
          ) : confirmandoOpcion ? (
            // Confirmación final de opción
            <div
              style={{
                padding: '16px',
                backgroundColor:
                  confirmandoOpcion === 'A'
                    ? 'rgba(239,68,68,0.06)'
                    : 'rgba(157,92,192,0.06)',
                border: `1px solid ${confirmandoOpcion === 'A' ? 'rgba(239,68,68,0.2)' : 'rgba(157,92,192,0.2)'}`,
                borderRadius: 8,
              }}
            >
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  margin: '0 0 8px 0',
                }}
              >
                {confirmandoOpcion === 'A'
                  ? 'Opción A: Retirada — el lobby del socio se vuelve gris y se muestra el mensaje de reembolso.'
                  : 'Opción B: Compromiso — la barra se vuelve arcoíris y se desbloquea el Pack de Consultoría.'}
              </p>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--foreground-muted)',
                  margin: '0 0 14px 0',
                }}
              >
                Esta acción es irreversible. ¿Confirmar?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleEjecutarOpcion(confirmandoOpcion)}
                  style={{
                    padding: '8px 20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: confirmandoOpcion === 'A' ? '#ef4444' : 'var(--color-secondary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  Sí, ejecutar Opción {confirmandoOpcion}
                </button>
                <button
                  onClick={() => setConfirmandoOpcion(null)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    color: 'var(--foreground-muted)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--hairline)',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  Volver
                </button>
              </div>
            </div>
          ) : (
            // Selección de opción
            <div>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--foreground-muted)',
                  margin: '0 0 14px 0',
                  lineHeight: 1.6,
                }}
              >
                Seleccioná qué opción ejecutar. Esta acción es definitiva.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => setConfirmandoOpcion('A')}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    backgroundColor: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: '#ef4444',
                    }}
                  >
                    Opción A — Retirada
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.78rem',
                      color: 'var(--foreground-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    El lobby se vuelve blanco y negro. La barra muestra "Retirada". La pestaña
                    Programa muestra el mensaje de reembolso de 10 días.
                  </p>
                </button>

                <button
                  onClick={() => setConfirmandoOpcion('B')}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    backgroundColor: 'rgba(157,92,192,0.06)',
                    border: '1px solid rgba(157,92,192,0.2)',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    Opción B — Compromiso hasta el éxito
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.78rem',
                      color: 'var(--foreground-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    El lobby permanece normal. La barra de progreso se vuelve arcoíris y dice
                    "Compromiso hasta el éxito". Se desbloquea el Pack de Consultoría.
                  </p>
                </button>

                <button
                  onClick={() => setConfirmandoClausula(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    color: 'var(--foreground-subtle)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--hairline)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toaster richColors />
    </>
  );
}
