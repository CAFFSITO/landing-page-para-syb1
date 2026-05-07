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

  if (diff < 60) return rtf.format(-Math.round(diff), 'second');
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute');
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
  if (diff < 2592000) return rtf.format(-Math.round(diff / 86400), 'day');
  return rtf.format(-Math.round(diff / 2592000), 'month');
}

function tagClassPara(tipo: string): string {
  switch (tipo) {
    case 'pdf': return 'syb-tag syb-tag-danger';
    case 'video': return 'syb-tag syb-tag-info';
    case 'reporte': return 'syb-tag syb-tag-warning';
    case 'registro_reunion':
    case 'reunión': return 'syb-tag syb-tag-success';
    case 'agenda': return 'syb-tag syb-tag-warning';
    default: return 'syb-tag syb-tag-accent';
  }
}

function labelPara(tipo: string): string {
  switch (tipo) {
    case 'pdf': return 'PDF';
    case 'video': return 'Video';
    case 'reporte': return 'Reporte';
    case 'registro_reunion':
    case 'reunión': return 'Reunión';
    case 'agenda': return 'Agenda';
    default: return tipo;
  }
}

const headStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 16px',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  color: 'var(--foreground-subtle)',
  fontWeight: 500,
  borderBottom: '1px solid var(--hairline)',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

export function TabActividad({ lecturas, entregables, reuniones, reportes }: Props) {
  const entregablesMap = new Map(entregables.map((e) => [e.id, { titulo: e.titulo, tipo: e.tipo }]));
  const reunionesMap = new Map(reuniones.map((r) => [r.id, { nombre: r.nombre }]));
  const reportesMap = new Map(reportes.map((r) => [r.id, { titulo: r.titulo }]));

  if (lecturas.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 40px',
          color: 'var(--foreground-subtle)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        Sin actividad registrada aún.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Fecha', 'Tipo', 'Título'].map((col) => (
              <th key={col} style={headStyle}>{col}</th>
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

            return (
              <tr
                key={lectura.id}
                style={{
                  borderBottom: '1px solid var(--hairline)',
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                }}
              >
                <td
                  style={{
                    padding: '14px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--foreground-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tiempoRelativo(lectura.leido_at)}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={tagClassPara(tipo)}>{labelPara(tipo)}</span>
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--foreground)',
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
