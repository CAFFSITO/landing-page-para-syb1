'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { reorderEntregablesAction, deleteEntregableAction, updateEstadoEntregableAction } from '@/app/actions/entregables-admin';
import AdminModal from '@/components/admin/socios/AdminModal';
import EntregableModal from '@/components/admin/socios/EntregableModal';
import type { Entregable, EntregableEstado, Lectura } from '@/types';

interface Props {
  socioId: string;
  entregables: Entregable[];
  lecturas?: Lectura[];
}

const TIPO_LABEL: Record<string, string> = {
  pdf: 'PDF',
  video: 'Video',
  reporte: 'Reporte',
  registro_reunion: 'Registro',
  agenda: 'Agenda',
};

function RowInner({
  entregable,
  yaLeido,
  onEdit,
  onDelete,
  onEstadoChange,
  dragHandle,
}: {
  entregable: Entregable;
  yaLeido: boolean;
  onEdit: (e: Entregable) => void;
  onDelete: (e: Entregable) => void;
  onEstadoChange: (id: string, estado: EntregableEstado) => void;
  dragHandle?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {dragHandle}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--foreground-subtle)',
          flexShrink: 0,
          minWidth: '60px',
        }}
      >
        {TIPO_LABEL[entregable.tipo] ?? entregable.tipo}
      </span>
      <span
        style={{
          color: 'var(--foreground)',
          fontSize: '0.875rem',
          fontWeight: 500,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entregable.titulo}
      </span>
      {yaLeido && (
        <span
          style={{
            flexShrink: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#4ade80',
            border: '1px solid rgba(74,222,128,0.35)',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          Leído
        </span>
      )}
      <span
        title={entregable.version_estado === 'obsoleto' ? 'Rechazado' : 'Aceptado'}
        style={{
          flexShrink: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: entregable.version_estado === 'obsoleto' ? '#ef4444' : '#22c55e',
          boxShadow: entregable.version_estado === 'obsoleto'
            ? '0 0 4px rgba(239,68,68,0.5)'
            : '0 0 4px rgba(34,197,94,0.5)',
        }}
      />
      <select
        value={entregable.estado}
        onChange={e => onEstadoChange(entregable.id, e.target.value as EntregableEstado)}
        className="syb-input"
        style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem' }}
      >
        <option value="pendiente">pendiente</option>
        <option value="enviado">enviado</option>
        <option value="rechazado">rechazado</option>
      </select>
      <button
        onClick={() => onEdit(entregable)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)', display: 'flex', padding: 4, flexShrink: 0 }}
        aria-label="Editar"
      >
        <Pencil size={13} strokeWidth={1.5} />
      </button>
      <button
        onClick={() => onDelete(entregable)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-subtle)', display: 'flex', padding: 4, flexShrink: 0 }}
        aria-label="Eliminar"
      >
        <Trash2 size={13} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function SortableEntregableRow({
  entregable,
  yaLeido,
  onEdit,
  onDelete,
  onEstadoChange,
}: {
  entregable: Entregable;
  yaLeido: boolean;
  onEdit: (e: Entregable) => void;
  onDelete: (e: Entregable) => void;
  onEstadoChange: (id: string, estado: EntregableEstado) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entregable.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <RowInner
        entregable={entregable}
        yaLeido={yaLeido}
        onEdit={onEdit}
        onDelete={onDelete}
        onEstadoChange={onEstadoChange}
        dragHandle={
          <span
            {...attributes}
            {...listeners}
            style={{ cursor: 'grab', color: 'var(--foreground-subtle)', flexShrink: 0, display: 'flex' }}
          >
            <GripVertical size={14} strokeWidth={1.5} />
          </span>
        }
      />
    </div>
  );
}

function ChildEntregableRow({
  entregable,
  yaLeido,
  onEdit,
  onDelete,
  onEstadoChange,
}: {
  entregable: Entregable;
  yaLeido: boolean;
  onEdit: (e: Entregable) => void;
  onDelete: (e: Entregable) => void;
  onEstadoChange: (id: string, estado: EntregableEstado) => void;
}) {
  return (
    <div
      style={{
        marginLeft: 20,
        marginTop: 6,
        position: 'relative',
        paddingLeft: 14,
        borderLeft: '1.5px dashed var(--hairline-strong)',
      }}
    >
      {/* Conector horizontal */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: 14,
          height: 1,
          borderTop: '1.5px dashed var(--hairline-strong)',
        }}
      />
      <RowInner
        entregable={entregable}
        yaLeido={yaLeido}
        onEdit={onEdit}
        onDelete={onDelete}
        onEstadoChange={onEstadoChange}
      />
    </div>
  );
}

export function TabEntregables({ socioId, entregables, lecturas = [] }: Props) {
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
    // Only roots are draggable; children follow their parent
    const roots = faseItems.filter(e => !e.parent_id);
    const oldIndex = roots.findIndex(e => e.id === active.id);
    const newIndex = roots.findIndex(e => e.id === over.id);
    const reordered = arrayMove(roots, oldIndex, newIndex).map((e, i) => ({ ...e, orden: i + 1 }));

    const snapshot = [...items];
    setItems(prev => {
      const others = prev.filter(e => e.fase !== fase);
      const faseChildren = faseItems.filter(e => e.parent_id);
      return [...others, ...reordered, ...faseChildren];
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

        // Build hierarchy: items whose parent exists in this fase are children
        const childrenMap = new Map<string, Entregable[]>();
        const faseIds = new Set(faseItems.map(e => e.id));
        const childIds = new Set<string>();

        faseItems.forEach(e => {
          if (e.parent_id && faseIds.has(e.parent_id)) {
            childIds.add(e.id);
            const arr = childrenMap.get(e.parent_id) ?? [];
            arr.push(e);
            childrenMap.set(e.parent_id, arr);
          }
        });

        const roots = faseItems.filter(e => !childIds.has(e.id));

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
              <button
                onClick={() => openNew(fase)}
                className="syb-btn-ghost"
                style={{ padding: '5px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={13} strokeWidth={1.5} />
                Agregar
              </button>
            </div>
            {faseItems.length === 0 ? (
              <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.82rem', padding: '8px 0', margin: 0, fontStyle: 'italic' }}>
                Sin entregables en esta fase.
              </p>
            ) : (
              <DndContext sensors={sensors} onDragEnd={e => handleDragEnd(fase, e)}>
                <SortableContext items={roots.map(e => e.id)} strategy={verticalListSortingStrategy}>
                  {roots.map(root => {
                    const hijos = childrenMap.get(root.id) ?? [];
                    return (
                      <div key={root.id} style={{ marginBottom: '6px' }}>
                        <SortableEntregableRow
                          entregable={root}
                          yaLeido={lecturas.some(l => l.entregable_id === root.id)}
                          onEdit={openEdit}
                          onDelete={setDeleteTarget}
                          onEstadoChange={handleEstadoChange}
                        />
                        {hijos.map(hijo => (
                          <ChildEntregableRow
                            key={hijo.id}
                            entregable={hijo}
                            yaLeido={lecturas.some(l => l.entregable_id === hijo.id)}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                            onEstadoChange={handleEstadoChange}
                          />
                        ))}
                      </div>
                    );
                  })}
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
        allEntregables={items}
      />

      <AdminModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titulo="Eliminar entregable"
        maxWidth={420}
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="syb-btn-ghost">
              Cancelar
            </button>
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
