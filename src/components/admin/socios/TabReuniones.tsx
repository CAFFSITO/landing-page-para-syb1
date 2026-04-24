'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteReunionAction } from '@/app/actions/reuniones-admin';
import AdminModal from '@/components/admin/socios/AdminModal';
import ReunionModal from '@/components/admin/socios/ReunionModal';
import CalendarioFase from '@/components/admin/socios/CalendarioFase';
import type { Reunion } from '@/types';

interface Props {
  socioId: string;
  reuniones: Reunion[];
}

function formatFecha(fecha?: string): string {
  if (!fecha) return 'Sin fecha';
  try {
    return new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(fecha));
  } catch {
    return fecha;
  }
}

export function TabReuniones({ socioId, reuniones }: Props) {
  const [items, setItems] = useState<Reunion[]>(reuniones);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reunion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reunion | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [defaultFecha, setDefaultFecha] = useState<string | undefined>();
  const [defaultFase, setDefaultFase] = useState<1 | 2 | 3 | undefined>();
  const [calVisible, setCalVisible] = useState<Record<1 | 2 | 3, boolean>>({ 1: false, 2: false, 3: false });

  function openNew(fase?: 1 | 2 | 3) {
    setEditTarget(null);
    setDefaultFecha(undefined);
    setDefaultFase(fase);
    setModalOpen(true);
  }

  function openEdit(r: Reunion) {
    setEditTarget(r);
    setDefaultFecha(undefined);
    setDefaultFase(undefined);
    setModalOpen(true);
  }

  function openFromCalendario(isoFecha: string, rs: Reunion[], fase: 1 | 2 | 3) {
    if (rs.length > 0) {
      openEdit(rs[0]);
    } else {
      setEditTarget(null);
      setDefaultFecha(isoFecha);
      setDefaultFase(fase);
      setModalOpen(true);
    }
  }

  function toggleCalendario(fase: 1 | 2 | 3) {
    setCalVisible(prev => ({ ...prev, [fase]: !prev[fase] }));
  }

  function handleSaved(saved: Reunion) {
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

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const res = await deleteReunionAction(deleteTarget.id, socioId);
    setDeleteLoading(false);
    if (!res.ok) { toast.error(res.error); return; }
    setItems(prev => prev.filter(r => r.id !== deleteTarget.id));
    toast.success('Reunión eliminada');
    setDeleteTarget(null);
  }

  return (
    <div>
      {([1, 2, 3] as const).map(fase => {
        const faseItems = items.filter(r => r.fase === fase);

        return (
          <div key={fase} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.875rem', color: 'rgba(157,92,192,0.8)' }}>
                Fase {fase}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleCalendario(fase)}
                  style={{ background: calVisible[fase] ? 'rgba(157,92,192,0.15)' : 'none', border: '1px solid rgba(157,92,192,0.3)', color: 'rgba(157,92,192,0.8)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {calVisible[fase] ? 'Ocultar calendario' : 'Ver calendario'}
                </button>
                <button
                  onClick={() => openNew(fase)}
                  style={{ background: 'none', border: '1px solid rgba(157,92,192,0.3)', color: 'rgba(157,92,192,0.8)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  + Registrar reunión
                </button>
              </div>
            </div>
            {faseItems.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', padding: '8px 0', margin: 0 }}>
                Sin reuniones en esta fase.
              </p>
            ) : (
              faseItems.map(r => (
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
                      <span style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.875rem', color: '#FFFFFF' }}>
                        {r.nombre}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(157,92,192,0.6)' }}>
                        F{r.fase} · #{r.numero}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        {formatFecha(r.fecha)}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: r.completada ? 'rgba(34,197,94,0.1)' : 'rgba(157,92,192,0.1)',
                          color: r.completada ? '#22c55e' : '#9D5CC0',
                          fontWeight: 600,
                        }}
                      >
                        {r.completada ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
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

            {calVisible[fase] && (
              <CalendarioFase
                fase={fase}
                reuniones={faseItems}
                onDiaClick={(isoFecha, rs) => openFromCalendario(isoFecha, rs, fase)}
              />
            )}
          </div>
        );
      })}

      <ReunionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setDefaultFecha(undefined); setDefaultFase(undefined); }}
        socioId={socioId}
        editTarget={editTarget}
        onSaved={handleSaved}
        defaultFecha={defaultFecha}
        defaultFase={defaultFase}
      />

      <AdminModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titulo="Eliminar reunión"
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
          ¿Eliminar «{deleteTarget?.nombre}»? Esta acción no se puede deshacer.
        </p>
      </AdminModal>

      <Toaster richColors />
    </div>
  );
}
