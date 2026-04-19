'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
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

export function TabReportes({ socioId, reportes }: Props) {
  const [items, setItems] = useState<Reporte[]>(reportes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reporte | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reporte | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openNew() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(r: Reporte) {
    setEditTarget(r);
    setModalOpen(true);
  }

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
        <span style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.875rem', color: 'rgba(157,92,192,0.8)' }}>
          Reportes
        </span>
        <button
          onClick={openNew}
          style={{ background: 'none', border: '1px solid rgba(157,92,192,0.3)', color: 'rgba(157,92,192,0.8)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          + Crear reporte
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', padding: '8px 0', margin: 0 }}>
          Sin reportes aún.
        </p>
      ) : (
        items.map(r => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'rgba(157,92,192,0.04)',
              border: '1px solid rgba(157,92,192,0.1)',
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.875rem', color: '#FFFFFF', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.titulo}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(157,92,192,0.6)', flexShrink: 0 }}>
                  Fase {r.fase}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: r.visible ? 'rgba(34,197,94,0.1)' : 'rgba(157,92,192,0.1)',
                    color: r.visible ? '#22c55e' : 'rgba(157,92,192,0.7)',
                    fontWeight: 600,
                  }}
                >
                  {r.visible ? 'Visible' : 'Oculto'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                  {new Date(r.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
            <Toggle value={r.visible} onChange={() => handleToggleVisible(r)} />
            <button
              onClick={() => openEdit(r)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(157,92,192,0.6)', display: 'flex', padding: 4, flexShrink: 0 }}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(r)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.4)', display: 'flex', padding: 4, flexShrink: 0 }}
            >
              <Trash2 size={14} />
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
            <button
              onClick={() => setDeleteTarget(null)}
              style={{ background: 'none', border: '1px solid rgba(157,92,192,0.3)', color: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{ backgroundColor: '#ef4444', border: 'none', color: '#FFFFFF', borderRadius: '8px', padding: '8px 20px', cursor: deleteLoading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', opacity: deleteLoading ? 0.7 : 1 }}
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </>
        }
      >
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
          ¿Eliminar «{deleteTarget?.titulo}»? Esta acción no se puede deshacer.
        </p>
      </AdminModal>

      <Toaster richColors />
    </div>
  );
}
