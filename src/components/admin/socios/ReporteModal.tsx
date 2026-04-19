'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import AdminModal from '@/components/admin/socios/AdminModal';
import { createReporteAction, updateReporteAction } from '@/app/actions/reportes-admin';
import { toast } from 'sonner';
import type { Reporte } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  socioId: string;
  editTarget: Reporte | null;
  onSaved: (r: Reporte) => void;
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

export default function ReporteModal({ isOpen, onClose, socioId, editTarget, onSaved }: Props) {
  const [fase, setFase] = useState<1 | 2 | 3>(1);
  const [numero, setNumero] = useState(1);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setFase(editTarget.fase);
      setNumero(editTarget.numero);
      setTitulo(editTarget.titulo);
      setContenido(editTarget.contenido);
      setVisible(editTarget.visible);
    } else {
      setFase(1);
      setNumero(1);
      setTitulo('');
      setContenido('');
      setVisible(false);
    }
    setPreview(false);
  }, [editTarget, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { toast.error('El título es requerido'); return; }
    if (!contenido.trim()) { toast.error('El contenido es requerido'); return; }
    if (!numero || numero < 1) { toast.error('El número es requerido'); return; }
    setSubmitting(true);

    let res;
    if (editTarget) {
      res = await updateReporteAction({
        id: editTarget.id,
        socioId,
        fase,
        numero,
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        visible,
      });
    } else {
      res = await createReporteAction({
        socioId,
        fase,
        numero,
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        visible,
      });
    }

    setSubmitting(false);
    if (!res.ok) { toast.error(res.error); return; }

    const now = new Date().toISOString();
    const saved: Reporte = editTarget
      ? { ...editTarget, fase, numero, titulo: titulo.trim(), contenido: contenido.trim(), visible }
      : { id: crypto.randomUUID(), socio_id: socioId, fase, numero, titulo: titulo.trim(), contenido: contenido.trim(), visible, created_at: now };

    toast.success(editTarget ? 'Reporte actualizado' : 'Reporte creado');
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
        form="reporte-form"
        disabled={submitting}
        style={{ background: 'linear-gradient(135deg,#3B1E63,#9D5CC0)', border: 'none', color: '#FFFFFF', borderRadius: '8px', padding: '8px 20px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.875rem', opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
      </button>
    </>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} titulo={editTarget ? 'Editar reporte' : 'Crear reporte'} footer={footer} maxWidth={600}>
      <form id="reporte-form" onSubmit={handleSubmit}>
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
          <label style={labelStyle}>Título *</label>
          <input style={inputStyle} type="text" value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={labelStyle}>Contenido *</label>
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
              <ReactMarkdown>{contenido || '*Sin contenido*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              style={{
                ...inputStyle,
                resize: 'vertical',
                fontFamily: 'monospace',
              }}
              rows={8}
              value={contenido}
              onChange={e => setContenido(e.target.value)}
            />
          )}
        </div>
        <div style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <label style={labelStyle}>Visible</label>
          <Toggle value={visible} onChange={() => setVisible(v => !v)} />
        </div>
      </form>
    </AdminModal>
  );
}
