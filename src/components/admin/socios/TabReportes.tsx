'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { deleteReporteAction, toggleVisibleReporteAction } from '@/app/actions/reportes-admin';
import AdminModal from '@/components/admin/socios/AdminModal';
import ReporteModal from '@/components/admin/socios/ReporteModal';
import type { Reporte } from '@/types';

interface Props {
  socioId: string;
  reportes: Reporte[];
}

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

export function TabReportes({ socioId, reportes }: Props) {
  const [items, setItems] = useState<Reporte[]>(reportes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reporte | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reporte | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openNew() { setEditTarget(null); setModalOpen(true); }
  function openEdit(r: Reporte) { setEditTarget(r); setModalOpen(true); }

  function handleSaved(saved: Reporte) {
    setItems(prev => {
      const idx = prev.findIndex(r => r.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  }

  async function handleToggleVisible(reporte: Reporte) {
    const nuevoVisible = !reporte.visible;
    setItems(prev => prev.map(r => r.id === reporte.id ? { ...r, visible: nuevoVisible } : r));
    const res = await toggleVisibleReporteAction(reporte.id, socioId, nuevoVisible);
    if (!res.ok) {
      setItems(prev => prev.map(r => r.id === reporte.id ? { ...r, visible: reporte.visible } : r));
      toast.error(res.error);
    } else {
      toast.success('Visibilidad actualizada');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const res = await deleteReporteAction(deleteTarget.id, socioId);
    setDeleteLoading(false);
    if (!res.ok) { toast.error(res.error); return; }
    setItems(prev => prev.filter(r => r.id !== deleteTarget.id));
    toast.success('Reporte eliminado');
    setDeleteTarget(null);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--foreground-subtle)',
          }}
        >
          Reportes
        </span>
        <button onClick={openNew} className="syb-btn-ghost" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
          <Plus size={13} strokeWidth={1.5} />
          Crear reporte
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.82rem', padding: '8px 0', margin: 0, fontStyle: 'italic' }}>
          Sin reportes aún.
        </p>
      ) : (
        items.map(r => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '8px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--foreground)',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {r.titulo}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--foreground-subtle)' }}>
                  Fase 0{r.fase}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className={r.visible ? 'syb-tag syb-tag-success' : 'syb-tag syb-tag-accent'}>
                  {r.visible ? 'Visible' : 'Oculto'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--foreground-subtle)' }}>
                  {new Date(r.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
            <Toggle value={r.visible} onChange={() => handleToggleVisible(r)} />
            <button
              onClick={() => openEdit(r)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)', display: 'flex', padding: 4, flexShrink: 0 }}
              aria-label="Editar"
            >
              <Pencil size={13} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setDeleteTarget(r)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-subtle)', display: 'flex', padding: 4, flexShrink: 0 }}
              aria-label="Eliminar"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          </div>
        ))
      )}

      <ReporteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        socioId={socioId}
        editTarget={editTarget}
        onSaved={handleSaved}
      />

      <AdminModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titulo="Eliminar reporte"
        maxWidth={420}
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="syb-btn-ghost">Cancelar</button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{
                backgroundColor: 'var(--color-danger)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 18px',
                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                opacity: deleteLoading ? 0.7 : 1,
              }}
            >
              {deleteLoading ? 'Eliminando…' : 'Eliminar'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--foreground)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
          ¿Eliminar «{deleteTarget?.titulo}»? Esta acción no se puede deshacer.
        </p>
      </AdminModal>

      <Toaster richColors />
    </div>
  );
}
