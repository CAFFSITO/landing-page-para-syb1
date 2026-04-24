'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import AdminModal from '@/components/admin/socios/AdminModal';
import { createReunionAction, updateReunionAction } from '@/app/actions/reuniones-admin';
import { toast } from 'sonner';
import type { Reunion } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  socioId: string;
  editTarget: Reunion | null;
  onSaved: (r: Reunion) => void;
  defaultFecha?: string;
  defaultFase?: 1 | 2 | 3;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0D0618',
  border: '1px solid rgba(157,92,192,0.25)',
  color: '#FFFFFF',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginBottom: '16px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'rgba(157,92,192,0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
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

function toDatetimeLocal(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

export default function ReunionModal({ isOpen, onClose, socioId, editTarget, onSaved, defaultFecha, defaultFase }: Props) {
  const [fase, setFase] = useState<1 | 2 | 3>(1);
  const [numero, setNumero] = useState(1);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [completada, setCompletada] = useState(false);
  const [agendaUrl, setAgendaUrl] = useState('');
  const [grabacionUrl, setGrabacionUrl] = useState('');
  const [notas, setNotas] = useState('');
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setFase(editTarget.fase);
      setNumero(editTarget.numero);
      setNombre(editTarget.nombre);
      setFecha(toDatetimeLocal(editTarget.fecha));
      setCompletada(editTarget.completada);
      setAgendaUrl(editTarget.agenda_url ?? '');
      setGrabacionUrl(editTarget.grabacion_url ?? '');
      setNotas(editTarget.notas ?? '');
    } else {
      setFase(defaultFase ?? 1);
      setNumero(1);
      setNombre('');
      setFecha(defaultFecha ? toDatetimeLocal(defaultFecha) : '');
      setCompletada(false);
      setAgendaUrl('');
      setGrabacionUrl('');
      setNotas('');
    }
    setPreview(false);
  }, [editTarget, isOpen, defaultFecha, defaultFase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { toast.error('El nombre es requerido'); return; }
    if (!numero || numero < 1) { toast.error('El número es requerido'); return; }
    setSubmitting(true);

    const fechaIso = fecha ? new Date(fecha).toISOString() : undefined;

    let res;
    if (editTarget) {
      res = await updateReunionAction({
        id: editTarget.id,
        socioId,
        fase,
        numero,
        nombre: nombre.trim(),
        fecha: fechaIso,
        completada,
        agenda_url: agendaUrl.trim() || undefined,
        grabacion_url: grabacionUrl.trim() || undefined,
        notas: notas.trim() || undefined,
      });
    } else {
      res = await createReunionAction({
        socioId,
        fase,
        numero,
        nombre: nombre.trim(),
        fecha: fechaIso,
        completada,
        agenda_url: agendaUrl.trim() || undefined,
        grabacion_url: grabacionUrl.trim() || undefined,
        notas: notas.trim() || undefined,
      });
    }

    setSubmitting(false);
    if (!res.ok) { toast.error(res.error); return; }

    const now = new Date().toISOString();
    const saved: Reunion = editTarget
      ? { ...editTarget, fase, numero, nombre: nombre.trim(), fecha: fechaIso, completada, agenda_url: agendaUrl.trim() || undefined, grabacion_url: grabacionUrl.trim() || undefined, notas: notas.trim() || undefined }
      : { id: crypto.randomUUID(), socio_id: socioId, fase, numero, nombre: nombre.trim(), fecha: fechaIso, completada, agenda_url: agendaUrl.trim() || undefined, grabacion_url: grabacionUrl.trim() || undefined, notas: notas.trim() || undefined, created_at: now };

    toast.success(editTarget ? 'Reunión actualizada' : 'Reunión registrada');
    onSaved(saved);
    onClose();
  }

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        style={{ background: 'none', border: '1px solid rgba(157,92,192,0.3)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.875rem' }}
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="reunion-form"
        disabled={submitting}
        style={{ background: 'linear-gradient(135deg,#3B1E63,#9D5CC0)', border: 'none', color: '#FFFFFF', borderRadius: '8px', padding: '8px 20px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.875rem', opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Guardando...' : editTarget ? 'Actualizar' : 'Registrar'}
      </button>
    </>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} titulo={editTarget ? 'Editar reunión' : 'Registrar reunión'} footer={footer}>
      <form id="reunion-form" onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Fase *</label>
          <select style={inputStyle} value={fase} onChange={e => setFase(Number(e.target.value) as 1|2|3)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Número *</label>
          <input style={inputStyle} type="number" min={1} value={numero} onChange={e => setNumero(Number(e.target.value))} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Nombre *</label>
          <input style={inputStyle} type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Fecha y hora</label>
          <input style={inputStyle} type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <label style={labelStyle}>Completada</label>
          <Toggle value={completada} onChange={() => setCompletada(v => !v)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>URL de agenda</label>
          <input style={inputStyle} type="text" placeholder="https://..." value={agendaUrl} onChange={e => setAgendaUrl(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>URL de grabación</label>
          <input style={inputStyle} type="text" placeholder="https://..." value={grabacionUrl} onChange={e => setGrabacionUrl(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={labelStyle}>Notas / Registro</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['Editar', 'Preview'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreview(mode === 'Preview')}
                  style={{
                    background: (preview ? mode === 'Preview' : mode === 'Editar') ? 'rgba(157,92,192,0.15)' : 'transparent',
                    color: (preview ? mode === 'Preview' : mode === 'Editar') ? '#9D5CC0' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          {preview ? (
            <div
              style={{
                minHeight: '160px',
                backgroundColor: '#0D0618',
                border: '1px solid rgba(157,92,192,0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            >
              <ReactMarkdown>{notas || '*Sin contenido*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              style={{
                ...inputStyle,
                resize: 'vertical',
                fontFamily: 'monospace',
              }}
              rows={8}
              value={notas}
              onChange={e => setNotas(e.target.value)}
            />
          )}
        </div>
      </form>
    </AdminModal>
  );
}
