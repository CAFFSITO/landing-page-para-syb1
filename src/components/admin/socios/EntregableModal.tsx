'use client';

import { useState, useEffect } from 'react';
import AdminModal from '@/components/admin/socios/AdminModal';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
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

const TIPOS: EntregableTipo[] = ['pdf', 'video', 'reporte', 'registro_reunion', 'agenda'];
const ESTADOS: EntregableEstado[] = ['pendiente', 'enviado', 'rechazado'];

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const BLOCKED_EXTENSIONS = new Set([
  'exe', 'sh', 'bat', 'cmd', 'msi', 'com', 'scr', 'pif',
  'vbs', 'vbe', 'js', 'jse', 'ws', 'wsf', 'wsc', 'wsh',
  'ps1', 'psm1', 'psd1', 'reg', 'inf', 'hta', 'cpl', 'msp',
]);

const BLOCKED_MIMES = new Set([
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-sharedlib',
  'application/x-shellscript',
  'application/x-bat',
  'application/x-msi',
]);

export default function EntregableModal({ isOpen, onClose, socioId, fase, editTarget, onSaved, defaultOrden }: Props) {
  const [faseVal, setFaseVal] = useState<1 | 2 | 3>(fase);
  const [tipo, setTipo] = useState<EntregableTipo>('pdf');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<EntregableEstado>('pendiente');
  const [versionEstado, setVersionEstado] = useState<'vigente' | 'obsoleto'>('vigente');
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
      setVersionEstado(editTarget.version_estado ?? 'vigente');
      setUrl(editTarget.url ?? '');
      setOrden(editTarget.orden);
    } else {
      setFaseVal(fase);
      setTipo('pdf');
      setTitulo('');
      setDescripcion('');
      setEstado('pendiente');
      setVersionEstado('vigente');
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

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Archivo muy pesado (máx. 500 MB)');
      e.target.value = '';
      return;
    }

    // Validar extensión
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (BLOCKED_EXTENSIONS.has(ext)) {
      toast.error('Por seguridad, no se permiten archivos ejecutables');
      e.target.value = '';
      return;
    }

    // Validar MIME
    if (BLOCKED_MIMES.has(file.type)) {
      toast.error('Por seguridad, no se permiten archivos ejecutables');
      e.target.value = '';
      return;
    }

    console.log('[Entregable] Archivo seleccionado:', file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)} MB`);

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
        version_estado: versionEstado,
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
        version_estado: versionEstado,
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
      ? { ...editTarget, fase: faseVal, tipo, titulo: titulo.trim(), descripcion: descripcion.trim() || undefined, url: url.trim() || undefined, estado, version_estado: versionEstado, orden, updated_at: now }
      : { id: crypto.randomUUID(), socio_id: socioId, fase: faseVal, tipo, titulo: titulo.trim(), descripcion: descripcion.trim() || undefined, url: url.trim() || undefined, estado, version_estado: versionEstado, orden, created_at: now, updated_at: now };

    toast.success(editTarget ? 'Entregable actualizado' : 'Entregable creado');
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
        form="entregable-form"
        disabled={submitting}
        className="syb-btn-primary"
        style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
      >
        {submitting ? 'Guardando…' : editTarget ? 'Actualizar' : 'Crear'}
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
          <textarea
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
            rows={4}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0 8px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(157,92,192,0.2)' }} />
            <span style={{ margin: '0 12px', fontSize: '0.75rem', color: 'rgba(157,92,192,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vista previa</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(157,92,192,0.2)' }} />
          </div>
          <div
            style={{
              minHeight: '80px',
              backgroundColor: '#1C0D35',
              border: '1px solid rgba(157,92,192,0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.875rem',
            }}
          >
            <MarkdownRenderer content={descripcion || '*Sin descripción*'} />
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Estado *</label>
          <select style={inputStyle} value={estado} onChange={e => setEstado(e.target.value as EntregableEstado)}>
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Versión</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['vigente', 'obsoleto'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setVersionEstado(v)}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'all 180ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  ...(versionEstado === v
                    ? v === 'vigente'
                      ? { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: '#22c55e', color: '#22c55e' }
                      : { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: '#ef4444', color: '#ef4444' }
                    : { backgroundColor: 'transparent', borderColor: 'var(--hairline-strong)', color: 'var(--foreground-subtle)' }
                  ),
                }}
              >
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: v === 'vigente' ? '#22c55e' : '#ef4444',
                  flexShrink: 0,
                }} />
                {v === 'vigente' ? 'Aceptado' : 'Rechazado'}
              </button>
            ))}
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>URL (Vimeo, Drive, etc.)</label>
          <input style={inputStyle} type="text" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Archivo {fileName ? `— ${fileName}` : editTarget?.storage_path ? `— ${editTarget.storage_path.split('/').pop()}` : ''}</label>
          <input
            style={{ ...inputStyle, padding: '8px 14px', cursor: 'pointer' }}
            type="file"
            accept="*/*"
            onChange={handleFile}
          />
          {editTarget?.storage_path && !fileName && (
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(157,92,192,0.6)' }}>
              Archivo actual guardado. Subí uno nuevo para reemplazarlo.
            </p>
          )}
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Orden *</label>
          <input style={inputStyle} type="number" min={1} value={orden} onChange={e => setOrden(Number(e.target.value))} />
        </div>
      </form>
    </AdminModal>
  );
}
