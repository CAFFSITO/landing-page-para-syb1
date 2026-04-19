'use client'

import { useState, useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { Copy } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { toggleSocioActivoAction } from '@/app/actions/socios'
import type { Socio } from '@/types'

type FiltroFase = 'todos' | 1 | 2 | 3
type FiltroActivo = 'todos' | 'activo' | 'inactivo'

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 14px',
        borderRadius: '999px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        border: active ? '1px solid #9D5CC0' : '1px solid rgba(157,92,192,0.2)',
        backgroundColor: active ? 'rgba(157,92,192,0.2)' : 'transparent',
        color: active ? '#9D5CC0' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export default function SociosTable({ socios }: { socios: Socio[] }) {
  const [filtroFase, setFiltroFase] = useState<FiltroFase>('todos')
  const [filtroActivo, setFiltroActivo] = useState<FiltroActivo>('todos')
  const [activoOverrides, setActivoOverrides] = useState<Map<string, boolean>>(new Map())
  const [, startTransition] = useTransition()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const sociosFiltrados = socios.filter((s) => {
    if (filtroFase !== 'todos' && s.fase_actual !== filtroFase) return false
    const isActivo = activoOverrides.has(s.id) ? activoOverrides.get(s.id)! : s.activo
    if (filtroActivo === 'activo' && !isActivo) return false
    if (filtroActivo === 'inactivo' && isActivo) return false
    return true
  })

  function handleCopyToken(token: string) {
    navigator.clipboard.writeText(token)
    toast.success('Token copiado')
  }

  function handleToggle(socio: Socio) {
    const currentActivo = activoOverrides.has(socio.id)
      ? activoOverrides.get(socio.id)!
      : socio.activo
    const action = currentActivo ? 'Desactivar' : 'Activar'
    const confirmed = window.confirm(`¿${action} a ${socio.nombre}?`)
    if (!confirmed) return

    setActivoOverrides((prev) => {
      const next = new Map(prev)
      next.set(socio.id, !currentActivo)
      return next
    })

    startTransition(async () => {
      const result = await toggleSocioActivoAction(socio.id, !currentActivo)
      if (!result.ok) {
        toast.error(result.error)
        setActivoOverrides((prev) => {
          const next = new Map(prev)
          next.set(socio.id, currentActivo)
          return next
        })
      } else {
        toast.success(
          !currentActivo ? `${socio.nombre} activado` : `${socio.nombre} desactivado`
        )
      }
    })
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginRight: '4px' }}>Fase:</span>
          {(['todos', 1, 2, 3] as FiltroFase[]).map((f) => (
            <PillButton key={String(f)} active={filtroFase === f} onClick={() => setFiltroFase(f)}>
              {f === 'todos' ? 'Todos' : `Fase ${f}`}
            </PillButton>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginRight: '4px' }}>Estado:</span>
          {(['todos', 'activo', 'inactivo'] as FiltroActivo[]).map((f) => (
            <PillButton key={f} active={filtroActivo === f} onClick={() => setFiltroActivo(f)}>
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
            </PillButton>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#1C0D35',
          border: '1px solid rgba(157,92,192,0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(157,92,192,0.2)' }}>
              {['Nombre', 'Email', 'Empresa', 'Token', 'Fase', 'Progreso', 'Estado', 'Acciones'].map(
                (col) => (
                  <th
                    key={col}
                    style={{
                      fontSize: '0.7rem',
                      color: 'rgba(157,92,192,0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sociosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: '32px 16px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  No hay socios que coincidan con los filtros.
                </td>
              </tr>
            )}
            {sociosFiltrados.map((socio) => {
              const isActivo = activoOverrides.has(socio.id)
                ? activoOverrides.get(socio.id)!
                : socio.activo
              const progreso =
                ([socio.fase_1_done, socio.fase_2_done, socio.fase_3_done].filter(Boolean).length /
                  3) *
                100

              return (
                <tr
                  key={socio.id}
                  onMouseEnter={() => setHoveredRow(socio.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid rgba(157,92,192,0.08)',
                    backgroundColor:
                      hoveredRow === socio.id ? 'rgba(157,92,192,0.04)' : 'transparent',
                    transition: 'background-color 0.1s',
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 500 }}>
                    {socio.nombre}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                    {socio.email}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)' }}>
                    {socio.empresa ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {socio.token.slice(0, 20)}…
                      </span>
                      <button
                        onClick={() => handleCopyToken(socio.token)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(157,92,192,0.6)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Copiar token"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>
                    {socio.fase_actual}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '6px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${progreso}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #9D5CC0, #C084FC)',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor: isActivo
                          ? 'rgba(34,197,94,0.15)'
                          : 'rgba(239,68,68,0.1)',
                        color: isActivo ? '#22c55e' : '#ef4444',
                        border: isActivo
                          ? '1px solid rgba(34,197,94,0.3)'
                          : '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      {isActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <a
                        href="/lobby"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#9D5CC0',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(157,92,192,0.3)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          textDecoration: 'none',
                        }}
                      >
                        Ver lobby
                      </a>
                      <Link
                        href={`/admin/socios/${socio.id}`}
                        style={{
                          color: 'rgba(255,255,255,0.5)',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          textDecoration: 'none',
                        }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleToggle(socio)}
                        style={{
                          color: isActivo ? '#ef4444' : '#22c55e',
                          backgroundColor: 'transparent',
                          border: isActivo
                            ? '1px solid rgba(239,68,68,0.2)'
                            : '1px solid rgba(34,197,94,0.3)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {isActivo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Toaster richColors />
    </>
  )
}
