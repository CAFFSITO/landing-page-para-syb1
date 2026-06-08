'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Socio, Entregable, Reunion, Lectura } from '@/types';
import { TabProgreso } from '@/components/admin/socios/TabProgreso';
import { TabEntregables } from '@/components/admin/socios/TabEntregables';
import { TabReuniones } from '@/components/admin/socios/TabReuniones';
type Tab = 'progreso' | 'entregables' | 'reuniones';

const TABS: { key: Tab; label: string }[] = [
  { key: 'progreso', label: 'Progreso' },
  { key: 'entregables', label: 'Entregables' },
  { key: 'reuniones', label: 'Reuniones' },
];

interface Props {
  socio: Socio;
  entregables: Entregable[];
  reuniones: Reunion[];
  lecturas: Lectura[];
}

export function SocioDetailShell({
  socio,
  entregables,
  reuniones,
  lecturas,
}: Props) {
  const [tabActiva, setTabActiva] = useState<Tab>('progreso');

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid var(--hairline)',
          marginBottom: '32px',
        }}
      >
        {TABS.map((tab) => {
          const isActive = tabActiva === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                padding: '12px 18px',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                color: isActive ? 'var(--foreground)' : 'var(--foreground-muted)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'color 180ms ease',
              }}
            >
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId="admin-detail-tab-indicator"
                  style={{
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    bottom: -1,
                    height: 1,
                    backgroundColor: 'var(--foreground)',
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {tabActiva === 'progreso' && <TabProgreso socio={socio} />}
      {tabActiva === 'entregables' && (
        <TabEntregables socioId={socio.id} entregables={entregables} lecturas={lecturas} />
      )}
      {tabActiva === 'reuniones' && (
        <TabReuniones socioId={socio.id} reuniones={reuniones} />
      )}
    </div>
  );
}
