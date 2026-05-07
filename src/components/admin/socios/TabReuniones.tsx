'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
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
          <div key={fase} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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
                Fase 0{fase}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleCalendario(fase)}
                  className="syb-btn-ghost"
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    backgroundColor: calVisible[fase] ? 'var(--surface-2)' : 'transparent',
                  }}
                >
                  {calVisible[fase] ? 'Ocultar calendario' : 'Ver calendario'}
                </button>
                <button onClick={() => openNew(fase)} className="syb-btn-ghost" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
                  <Plus size={13} strokeWidth={1.5} />
                  Registrar
                </button>
              </div>
            </div>
            {faseItems.length === 0 ? (
              <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.82rem', padding: '8px 0', margin: 0, fontStyle: 'italic' }}>
                Sin reuniones en esta fase.
              </p>
            ) : (
              faseItems.map(r => (
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
                        {r.nombre}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--foreground-subtle)' }}>
                        F{r.fase} · #{r.numero}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)' }}>
                        {formatFecha(r.fecha)}
                      </span>
                      <span className={r.completada ? 'syb-tag syb-tag-success' : 'syb-tag syb-tag-accent'}>
                        {r.completada ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
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
          ¿Eliminar «{deleteTarget?.nombre}»? Esta acción no se puede deshacer.
        </p>
      </AdminModal>

      <Toaster richColors />
    </div>
  );
}
