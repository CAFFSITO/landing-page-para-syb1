'use client';

import type { Lectura, Entregable, Reunion, Reporte } from '@/types';

interface Props {
  socioId: string;
  lecturas: Lectura[];
  entregables: Entregable[];
  reuniones: Reunion[];
  reportes: Reporte[];
}

function tiempoRelativo(fechaStr: string): string {
  const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });
  const diff = (Date.now() - new Date(fechaStr).getTime()) / 1000;

  if (diff < 60) {
    return rtf.format(-Math.round(diff), 'second');
  } else if (diff < 3600) {
    return rtf.format(-Math.round(diff / 60), 'minute');
  } else if (diff < 86400) {
    return rtf.format(-Math.round(diff / 3600), 'hour');
  } else if (diff < 2592000) {
    return rtf.format(-Math.round(diff / 86400), 'day');
  } else {
    return rtf.format(-Math.round(diff / 2592000), 'month');
  }
}

type TipoBadge = {
  bg: string;
  color: string;
  label: string;
};

function getBadge(tipo: string): TipoBadge {
  switch (tipo) {
    case 'pdf':
      return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'PDF' };
    case 'video':
      return { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: 'Video' };
    case 'reporte':
      return { bg: 'rgba(234,179,8,0.1)', color: '#eab308', label: 'Reporte' };
    case 'registro_reunion':
    case 'reunión':
      return {
        bg: 'rgba(34,197,94,0.1)',
        color: '#22c55e',
        label: 'Reunión',
      };
    case 'agenda':
      return {
        bg: 'rgba(249,115,22,0.1)',
        color: '#f97316',
        label: 'Agenda',
      };
    default:
      return {
        bg: 'rgba(157,92,192,0.1)',
        color: '#9D5CC0',
        label: tipo,
      };
  }
}

export function TabActividad({
  lecturas,
  entregables,
  reuniones,
  reportes,
}: Props) {
  const entregablesMap = new Map(
    entregables.map((e) => [e.id, { titulo: e.titulo, tipo: e.tipo }])
  );
  const reunionesMap = new Map(
    reuniones.map((r) => [r.id, { nombre: r.nombre }])
  );
  const reportesMap = new Map(
    reportes.map((r) => [r.id, { titulo: r.titulo }])
  );

  if (lecturas.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.875rem',
        }}
      >
        Sin actividad registrada aún.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#1C0D35',
        border: '1px solid rgba(157,92,192,0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Fecha', 'Tipo', 'Título'].map((col) => (
              <th
                key={col}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(157,92,192,0.15)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lecturas.map((lectura) => {
            let tipo = 'desconocido';
            let titulo = 'Item desconocido';

            if (lectura.entregable_id) {
              const e = entregablesMap.get(lectura.entregable_id);
              tipo = e?.tipo ?? 'desconocido';
              titulo = e?.titulo ?? 'Item desconocido';
            } else if (lectura.reunion_id) {
              const r = reunionesMap.get(lectura.reunion_id);
              tipo = 'reunión';
              titulo = r?.nombre ?? 'Item desconocido';
            } else if (lectura.reporte_id) {
              const r = reportesMap.get(lectura.reporte_id);
              tipo = 'reporte';
              titulo = r?.titulo ?? 'Item desconocido';
            }

            const badge = getBadge(tipo);

            return (
              <tr
                key={lectura.id}
                style={{
                  borderBottom: '1px solid rgba(157,92,192,0.08)',
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    'rgba(157,92,192,0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    'transparent';
                }}
              >
                <td
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.5)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tiempoRelativo(lectura.leido_at)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: badge.bg,
                      color: badge.color,
                    }}
                  >
                    {badge.label}
                  </span>
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    color: '#FFFFFF',
                  }}
                >
                  {titulo}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
