'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { updateSocioActivoAction, updateFasesAction } from '@/app/actions/socios';
import type { Socio } from '@/types';

interface Props {
  socio: Socio;
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: value ? '#9D5CC0' : 'rgba(157,92,192,0.2)',
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
          backgroundColor: '#FFFFFF',
          transition: 'left 200ms',
        }}
      />
    </button>
  );
}

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

  async function handleToggleFase(
    fase: 1 | 2 | 3,
    currentValue: boolean
  ) {
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

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1C0D35',
    border: '1px solid rgba(157,92,192,0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Merriweather, Georgia, serif',
    fontWeight: 700,
    fontSize: '1rem',
    color: '#FFFFFF',
    marginBottom: '16px',
    marginTop: 0,
  };

  const fases: { key: 1 | 2 | 3; label: string; value: boolean }[] = [
    { key: 1, label: 'Fase 1 completada', value: fase1 },
    { key: 2, label: 'Fase 2 completada', value: fase2 },
    { key: 3, label: 'Fase 3 completada', value: fase3 },
  ];

  return (
    <>
      <div style={cardStyle}>
        <p style={titleStyle}>Estado</p>
        <button
          onClick={handleToggleActivo}
          style={{
            backgroundColor: activo
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(239,68,68,0.1)',
            border: `1px solid ${
              activo ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'
            }`,
            color: activo ? '#22c55e' : '#ef4444',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            outline: 'none',
            transition: '150ms',
          }}
        >
          {activo
            ? 'Activo — clic para desactivar'
            : 'Inactivo — clic para activar'}
        </button>
      </div>

      <div style={cardStyle}>
        <p style={titleStyle}>Hitos de fase</p>
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.8rem',
            marginBottom: '16px',
            marginTop: 0,
          }}
        >
          Activar una fase marca el hito como completado en el lobby del socio.
        </p>

        {fases.map((f, idx) => (
          <div
            key={f.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 0',
              borderBottom:
                idx < fases.length - 1
                  ? '1px solid rgba(157,92,192,0.08)'
                  : 'none',
            }}
          >
            <Toggle
              value={f.value}
              onChange={() => handleToggleFase(f.key, f.value)}
            />
            <span
              style={{
                color: f.value ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                fontSize: '0.875rem',
              }}
            >
              {f.label}
            </span>
          </div>
        ))}

        {saving && (
          <p
            style={{
              color: 'rgba(157,92,192,0.5)',
              fontSize: '0.75rem',
              marginTop: '12px',
              marginBottom: 0,
            }}
          >
            Guardando...
          </p>
        )}

        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'rgba(157,92,192,0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(to right, #9D5CC0, #C084FC)',
                borderRadius: '3px',
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
