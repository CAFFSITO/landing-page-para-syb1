'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { reorderEntregablesAction, deleteEntregableAction, updateEstadoEntregableAction } from '@/app/actions/entregables-admin';
import AdminModal from '@/components/admin/socios/AdminModal';
import EntregableModal from '@/components/admin/socios/EntregableModal';
import type { Entregable, EntregableEstado } from '@/types';

interface Props {
  socioId: string;
  entregables: Entregable[];
}

const TIPO_COLORS: Record<string, { bg: string; color: string }> = {
  pdf: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  video: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  reporte: { bg: 'rgba(234,179,8,0.1)', color: '#eab308' },
  registro_reunion: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  agenda: { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
};

function SortableEntregableRow({
  entregable,
  onEdit,
  onDelete,
  onEstadoChange,
}: {
  entregable: Entregable;
  onEdit: (e: Entregable) => void;
  onDelete: (e: Entregable) => void;
  onEstadoChange: (id: string, estado: EntregableEstado) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entregable.id });
  const tipoColor = TIPO_COLORS[entregable.tipo] ?? { bg: 'rgba(157,92,192,0.1)', color: '#9D5CC0' };

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        backgroundColor: '#1C0D35',
        border: '1px solid rgba(157,92,192,0.1)',
        borderRadius: '8px',
        marginBottom: '6px',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <span
        {...attributes}
        {...listeners}
        style={{ cursor: 'grab', color: 'rgba(157,92,192,0.4)', flexShrink: 0, display: 'flex' }}
      >
        <GripVertical size={16} />
      </span>
      <span
        style={{
          backgroundColor: tipoColor.bg,
          color: tipoColor.color,
          fontSize: '0.7rem',
          padding: '2px 8px',
          borderRadius: '999px',
          flexShrink: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}
      >
        {entregable.tipo}
      </span>
      <span
        style={{
          color: '#FFFFFF',
          fontSize: '0.875rem',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entregable.titulo}
      </span>
      <select
        value={entregable.estado}
        onChange={e => onEstadoChange(entregable.id, e.target.value as EntregableEstado)}
        style={{
          backgroundColor: '#0D0618',
          color: '#FFFFFF',
          border: '1px solid rgba(157,92,192,0.25)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          outline: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <option value="pendiente">pendiente</option>
        <option value="enviado">enviado</option>
        <option value="rechazado">rechazado</option>
      </select>
      <button
        onClick={() => onEdit(entregable)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(157,92,192,0.6)', display: 'flex', padding: 4, flexShrink: 0 }}
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={() => onDelete(entregable)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.4)', display: 'flex', padding: 4, flexShrink: 0 }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function TabEntregables({ socioId, entregables }: Props) {
  const [items, setItems] = useState<Entregable[]>(entregables);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Entregable | null>(null);
  const [editFase, setEditFase] = useState<1 | 2 | 3>(1);
  const [deleteTarget, setDeleteTarget] = useState<Entregable | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  function openNew(fase: 1 | 2 | 3) {
    setEditFase(fase);
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(e: Entregable) {
    setEditFase(e.fase);
    setEditTarget(e);
    setModalOpen(true);
  }

  function handleSaved(saved: Entregable) {
    setItems(prev => {
      const idx = prev.findIndex(e => e.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  }

  async function handleEstadoChange(id: string, estado: EntregableEstado) {
    const prev = items.find(e => e.id === id);
    if (!prev) return;
    setItems(cur => cur.map(e => e.id === id ? { ...e, estado } : e));
    const res = await updateEstadoEntregableAction(id, socioId, estado);
    if (!res.ok) {
      setItems(cur => cur.map(e => e.id === id ? { ...e, estado: prev.estado } : e));
      toast.error(res.error);
    }
  }

  function handleDragEnd(fase: 1 | 2 | 3, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const faseItems = items.filter(e => e.fase === fase).sort((a, b) => a.orden - b.orden);
    const oldIndex = faseItems.findIndex(e => e.id === active.id);
    const newIndex = faseItems.findIndex(e => e.id === over.id);
    const reordered = arrayMove(faseItems, oldIndex, newIndex).map((e, i) => ({ ...e, orden: i + 1 }));

    const snapshot = [...items];
    setItems(prev => {
      const others = prev.filter(e => e.fase !== fase);
      return [...others, ...reordered];
    });

    reorderEntregablesAction(socioId, reordered.map(e => ({ id: e.id, orden: e.orden }))).then(res => {
      if (!res.ok) {
        setItems(snapshot);
        toast.error(res.error);
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const res = await deleteEntregableAction(deleteTarget.id, socioId, deleteTarget.storage_path ?? undefined);
    setDeleteLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setItems(prev => prev.filter(e => e.id !== deleteTarget.id));
    toast.success('Entregable eliminado');
    setDeleteTarget(null);
  }

  return (
    <div>
      {([1, 2, 3] as const).map(fase => {
        const faseItems = items.filter(e => e.fase === fase).sort((a, b) => a.orden - b.orden);

        return (
          <div key={fase} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.875rem', color: 'rgba(157,92,192,0.8)' }}>
                Fase {fase}
              </span>
              <button
                onClick={() => openNew(fase)}
                style={{ background: 'none', border: '1px solid rgba(157,92,192,0.3)', color: 'rgba(157,92,192,0.8)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                + Agregar
              </button>
            </div>
            {faseItems.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', padding: '8px 0', margin: 0 }}>
                Sin entregables en esta fase.
              </p>
            ) : (
              <DndContext sensors={sensors} onDragEnd={e => handleDragEnd(fase, e)}>
                <SortableContext items={faseItems.map(e => e.id)} strategy={verticalListSortingStrategy}>
                  {faseItems.map(e => (
                    <SortableEntregableRow
                      key={e.id}
                      entregable={e}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                      onEstadoChange={handleEstadoChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        );
      })}

      <EntregableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        socioId={socioId}
        fase={editFase}
        editTarget={editTarget}
        onSaved={handleSaved}
        defaultOrden={editTarget ? editTarget.orden : items.filter(e => e.fase === editFase).length + 1}
      />

      <AdminModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titulo="Eliminar entregable"
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
