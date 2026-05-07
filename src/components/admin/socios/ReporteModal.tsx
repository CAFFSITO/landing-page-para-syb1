'use client';

import { useState, useEffect } from 'react';
import AdminModal from '@/components/admin/socios/AdminModal';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
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
  backgroundColor: 'var(--surface-2)',
  border: '1px solid var(--hairline-strong)',
  color: 'var(--foreground)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '18px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  fontWeight: 500,
  color: 'var(--foreground-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
};

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '10px',
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
          left: value ? '19px' : '3px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-1)',
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
      <button type="button" onClick={onClose} className="syb-btn-ghost">
        Cancelar
      </button>
      <button
        type="submit"
        form="reporte-form"
        disabled={submitting}
        className="syb-btn-primary"
        style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
      >
        {submitting ? 'Guardando…' : editTarget ? 'Actualizar' : 'Crear'}
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
          <label style={labelStyle}>Contenido *</label>
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
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0 8px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(157,92,192,0.2)' }} />
            <span style={{ margin: '0 12px', fontSize: '0.75rem', color: 'rgba(157,92,192,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vista previa</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(157,92,192,0.2)' }} />
          </div>
          <div
            style={{
              minHeight: '120px',
              backgroundColor: '#1C0D35',
              border: '1px solid rgba(157,92,192,0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.875rem',
            }}
          >
            <MarkdownRenderer content={contenido || '*Sin contenido*'} />
          </div>
        </div>
        <div style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <label style={labelStyle}>Visible</label>
          <Toggle value={visible} onChange={() => setVisible(v => !v)} />
        </div>
      </form>
    </AdminModal>
  );
}
