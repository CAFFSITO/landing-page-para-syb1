'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { updateSocioActivoAction, updateFasesAction } from '@/app/actions/socios';
import type { Socio } from '@/types';

interface Props {
  socio: Socio;
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: value ? 'var(--color-secondary)' : 'var(--hairline-strong)',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 200ms',
        outline: 'none',
        padding: 0,
      }}
      aria-pressed={value}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: value ? '21px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-1)',
          transition: 'left 200ms',
        }}
      />
    </button>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface-1)',
  border: '1px solid var(--hairline)',
  borderRadius: 'var(--radius-md)',
  padding: '24px',
  marginBottom: '20px',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: 'var(--foreground-subtle)',
  marginBottom: '16px',
  marginTop: 0,
};

export function TabProgreso({ socio }: Props) {
  const [activo, setActivo] = useState(socio.activo);
  const [fase1, setFase1] = useState(socio.fase_1_done);
  const [fase2, setFase2] = useState(socio.fase_2_done);
  const [fase3, setFase3] = useState(socio.fase_3_done);
  const [saving, setSaving] = useState(false);

  async function handleToggleActivo() {
    const prev = activo;
    setActivo(!prev);
    const res = await updateSocioActivoAction(socio.id, !prev);
    if (!res.ok) {
      setActivo(prev);
      toast.error(res.error);
    } else {
      toast.success('Estado actualizado');
    }
  }

  async function handleToggleFase(fase: 1 | 2 | 3, currentValue: boolean) {
    const newValue = !currentValue;
    const newFase1 = fase === 1 ? newValue : fase1;
    const newFase2 = fase === 2 ? newValue : fase2;
    const newFase3 = fase === 3 ? newValue : fase3;

    if (fase === 1) setFase1(newValue);
    if (fase === 2) setFase2(newValue);
    if (fase === 3) setFase3(newValue);

    setSaving(true);
    const res = await updateFasesAction(socio.id, {
      fase_1_done: newFase1,
      fase_2_done: newFase2,
      fase_3_done: newFase3,
    });
    setSaving(false);

    if (!res.ok) {
      if (fase === 1) setFase1(currentValue);
      if (fase === 2) setFase2(currentValue);
      if (fase === 3) setFase3(currentValue);
      toast.error(res.error);
    } else {
      toast.success('Hito actualizado');
    }
  }

  const progress = ([fase1, fase2, fase3].filter(Boolean).length / 3) * 100;

  const fases: { key: 1 | 2 | 3; label: string; value: boolean }[] = [
    { key: 1, label: 'Fase 01 — Diagnóstico', value: fase1 },
    { key: 2, label: 'Fase 02 — Diseño y Ejecución', value: fase2 },
    { key: 3, label: 'Fase 03 — Validación', value: fase3 },
  ];

  return (
    <>
      <div style={cardStyle}>
        <p style={titleStyle}>Estado</p>
        <button
          onClick={handleToggleActivo}
          className={activo ? 'syb-tag syb-tag-success' : 'syb-tag syb-tag-danger'}
          style={{ cursor: 'pointer', padding: '6px 14px', fontSize: '0.72rem' }}
        >
          {activo ? 'Activo · Click para desactivar' : 'Inactivo · Click para activar'}
        </button>
      </div>

      <div style={cardStyle}>
        <p style={titleStyle}>Hitos de fase</p>
        <p
          style={{
            color: 'var(--foreground-muted)',
            fontSize: '0.82rem',
            marginBottom: '20px',
            marginTop: 0,
            lineHeight: 1.6,
          }}
        >
          Activar una fase la marca como completada en el lobby del socio.
        </p>

        {fases.map((f, idx) => (
          <div
            key={f.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 0',
              borderTop: idx === 0 ? 'none' : '1px solid var(--hairline)',
            }}
          >
            <Toggle value={f.value} onChange={() => handleToggleFase(f.key, f.value)} />
            <span
              style={{
                color: f.value ? 'var(--foreground)' : 'var(--foreground-muted)',
                fontSize: '0.9rem',
                fontWeight: f.value ? 600 : 500,
              }}
            >
              {f.label}
            </span>
          </div>
        ))}

        {saving && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--foreground-subtle)',
              fontSize: '0.7rem',
              marginTop: '14px',
              marginBottom: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Guardando…
          </p>
        )}

        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              height: '3px',
              borderRadius: '2px',
              backgroundColor: 'var(--hairline)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: 'var(--color-secondary)',
                borderRadius: '2px',
                transition: 'width 300ms',
              }}
            />
          </div>
        </div>
      </div>

      <Toaster richColors />
    </>
  );
}
