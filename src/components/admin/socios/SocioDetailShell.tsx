'use client';

import { useState } from 'react';
import type { Socio, Entregable, Reunion, Reporte, Lectura } from '@/types';
import { TabProgreso } from '@/components/admin/socios/TabProgreso';
import { TabEntregables } from '@/components/admin/socios/TabEntregables';
import { TabReuniones } from '@/components/admin/socios/TabReuniones';
import { TabReportes } from '@/components/admin/socios/TabReportes';
import { TabActividad } from '@/components/admin/socios/TabActividad';

type Tab = 'progreso' | 'entregables' | 'reuniones' | 'reportes' | 'actividad';

const TABS: { key: Tab; label: string }[] = [
  { key: 'progreso', label: 'Progreso' },
  { key: 'entregables', label: 'Entregables' },
  { key: 'reuniones', label: 'Reuniones' },
  { key: 'reportes', label: 'Reportes' },
  { key: 'actividad', label: 'Actividad' },
];

interface Props {
  socio: Socio;
  entregables: Entregable[];
  reuniones: Reunion[];
  reportes: Reporte[];
  lecturas: Lectura[];
}

export function SocioDetailShell({
  socio,
  entregables,
  reuniones,
  reportes,
  lecturas,
}: Props) {
  const [tabActiva, setTabActiva] = useState<Tab>('progreso');

  return (
    <div>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(157,92,192,0.15)',
          marginBottom: '28px',
        }}
      >
        {TABS.map((tab) => {
          const isActive = tabActiva === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive
                  ? '2px solid #9D5CC0'
                  : '2px solid transparent',
                color: isActive ? '#9D5CC0' : 'rgba(255,255,255,0.5)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                padding: '10px 16px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'color 150ms, border-color 150ms',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabActiva === 'progreso' && <TabProgreso socio={socio} />}
      {tabActiva === 'entregables' && (
        <TabEntregables socioId={socio.id} entregables={entregables} />
      )}
      {tabActiva === 'reuniones' && (
        <TabReuniones socioId={socio.id} reuniones={reuniones} />
      )}
      {tabActiva === 'reportes' && (
        <TabReportes socioId={socio.id} reportes={reportes} />
      )}
      {tabActiva === 'actividad' && (
        <TabActividad
          socioId={socio.id}
          lecturas={lecturas}
          entregables={entregables}
          reuniones={reuniones}
          reportes={reportes}
        />
      )}
    </div>
  );
}
