'use client';

import { useState, useEffect } from 'react';
import AdminModal from '@/components/admin/socios/AdminModal';
import { createEntregableAction, updateEntregableAction } from '@/app/actions/entregables-admin';
import { toast } from 'sonner';
import type { Entregable, EntregableTipo, EntregableEstado } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  socioId: string;
  fase: 1 | 2 | 3;
  editTarget: Entregable | null;
  onSaved: (e: Entregable) => void;
  defaultOrden: number;
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

const TIPOS: EntregableTipo[] = ['pdf', 'video', 'reporte', 'registro_reunion', 'agenda'];
const ESTADOS: EntregableEstado[] = ['pendiente', 'enviado', 'rechazado'];

export default function EntregableModal({ isOpen, onClose, socioId, fase, editTarget, onSaved, defaultOrden }: Props) {
  const [faseVal, setFaseVal] = useState<1 | 2 | 3>(fase);
  const [tipo, setTipo] = useState<EntregableTipo>('pdf');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<EntregableEstado>('pendiente');
  const [url, setUrl] = useState('');
  const [orden, setOrden] = useState(defaultOrden);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setFaseVal(editTarget.fase);
      setTipo(editTarget.tipo);
      setTitulo(editTarget.titulo);
      setDescripcion(editTarget.descripcion ?? '');
      setEstado(editTarget.estado);
      setUrl(editTarget.url ?? '');
      setOrden(editTarget.orden);
    } else {
      setFaseVal(fase);
      setTipo('pdf');
      setTitulo('');
      setDescripcion('');
      setEstado('pendiente');
      setUrl('');
      setOrden(defaultOrden);
    }
    setFileBase64(null);
    setFileName(null);
    setFileMime(null);
  }, [editTarget, fase, defaultOrden, isOpen]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFileBase64(base64);
      setFileName(file.name);
      setFileMime(file.type);
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { toast.error('El título es requerido'); return; }
    setSubmitting(true);

    const filePayload = fileBase64 && fileName && fileMime
      ? { base64: fileBase64, filename: fileName, mimeType: fileMime }
      : undefined;

    let res;
    if (editTarget) {
      res = await updateEntregableAction({
        id: editTarget.id,
        socioId,
        fase: faseVal,
        tipo,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        url: url.trim() || undefined,
        estado,
        orden,
        file: filePayload,
        existingStoragePath: editTarget.storage_path ?? undefined,
      });
    } else {
      res = await createEntregableAction({
        socioId,
        fase: faseVal,
        tipo,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        url: url.trim() || undefined,
        estado,
        orden,
        file: filePayload,
      });
    }

    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    const now = new Date().toISOString();
    const saved: Entregable = editTarget
      ? { ...editTarget, fase: faseVal, tipo, titulo: titulo.trim(), descripcion: descripcion.trim() || undefined, url: url.trim() || undefined, estado, orden, updated_at: now }
      : { id: crypto.randomUUID(), socio_id: socioId, fase: faseVal, tipo, titulo: titulo.trim(), descripcion: descripcion.trim() || undefined, url: url.trim() || undefined, estado, orden, created_at: now, updated_at: now };

    toast.success(editTarget ? 'Entregable actualizado' : 'Entregable creado');
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
        form="entregable-form"
        disabled={submitting}
        style={{ background: 'linear-gradient(135deg,#3B1E63,#9D5CC0)', border: 'none', color: '#FFFFFF', borderRadius: '8px', padding: '8px 20px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.875rem', opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
      </button>
    </>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} titulo={editTarget ? 'Editar entregable' : 'Nuevo entregable'} footer={footer}>
      <form id="entregable-form" onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Fase *</label>
          <select style={inputStyle} value={faseVal} onChange={e => setFaseVal(Number(e.target.value) as 1|2|3)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Tipo *</label>
          <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value as EntregableTipo)}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Título *</label>
          <input style={inputStyle} type="text" value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Descripción</label>
          <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Estado *</label>
          <select style={inputStyle} value={estado} onChange={e => setEstado(e.target.value as EntregableEstado)}>
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} type="text" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
        </div>
        {tipo === 'pdf' && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Archivo PDF</label>
            <input
              style={{ ...inputStyle, padding: '8px 14px' }}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile}
            />
          </div>
        )}
        <div style={fieldStyle}>
          <label style={labelStyle}>Orden *</label>
          <input style={inputStyle} type="number" min={1} value={orden} onChange={e => setOrden(Number(e.target.value))} />
        </div>
      </form>
    </AdminModal>
  );
}
