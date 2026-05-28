'use client'

import { useState, useTransition } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Copy } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { toggleSocioActivoAction } from '@/app/actions/socios'
import type { Socio } from '@/types'

type FiltroFase = 'todos' | 1 | 2 | 3
type FiltroActivo = 'todos' | 'activo' | 'inactivo'

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 'var(--radius-xs)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.78rem',
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: active ? 'var(--foreground)' : 'var(--hairline)',
        backgroundColor: active ? 'var(--foreground)' : 'transparent',
        color: active ? 'var(--background)' : 'var(--foreground-muted)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

const headCellStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  color: 'var(--foreground-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  padding: '14px 16px',
  textAlign: 'left',
  fontWeight: 500,
}

const cellStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem',
  color: 'var(--foreground)',
}

const filterLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: 'var(--foreground-subtle)',
  marginRight: '6px',
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
      <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={filterLabelStyle}>Fase</span>
          {(['todos', 1, 2, 3] as FiltroFase[]).map((f) => (
            <FilterChip key={String(f)} active={filtroFase === f} onClick={() => setFiltroFase(f)}>
              {f === 'todos' ? 'Todas' : `0${f}`}
            </FilterChip>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={filterLabelStyle}>Estado</span>
          {(['todos', 'activo', 'inactivo'] as FiltroActivo[]).map((f) => (
            <FilterChip key={f} active={filtroActivo === f} onClick={() => setFiltroActivo(f)}>
              {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
            </FilterChip>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              {['Nombre', 'Email', 'Empresa', 'Token', 'Fase', 'Progreso', 'Estado', 'Acciones'].map(
                (col) => (
                  <th key={col} style={headCellStyle}>
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
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: 'var(--foreground-subtle)',
                    fontStyle: 'italic',
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
                    borderBottom: '1px solid var(--hairline)',
                    backgroundColor:
                      hoveredRow === socio.id ? 'var(--surface-2)' : 'transparent',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{socio.nombre}</td>
                  <td style={{ ...cellStyle, color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {socio.email}
                  </td>
                  <td style={{ ...cellStyle, color: 'var(--foreground-muted)' }}>
                    {socio.empresa ?? '—'}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--foreground-muted)',
                        }}
                      >
                        {socio.token.slice(0, 16)}…
                      </span>
                      <button
                        onClick={() => handleCopyToken(socio.token)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--foreground-subtle)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Copiar token"
                      >
                        <Copy size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                  <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', color: 'var(--foreground-muted)' }}>
                    0{socio.fase_actual}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '3px',
                          backgroundColor: 'var(--hairline)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progreso}%`,
                            height: '100%',
                            backgroundColor: 'var(--foreground)',
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--foreground-subtle)',
                        }}
                      >
                        {Math.round(progreso)}%
                      </span>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span className={isActivo ? 'syb-tag syb-tag-success' : 'syb-tag syb-tag-danger'}>
                      {isActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <a
                        href="/lobby"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="syb-btn-ghost"
                        style={{ textDecoration: 'none', padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Ver lobby
                      </a>
                      <Link
                        href={`/admin/socios/${socio.id}`}
                        className="syb-btn-ghost"
                        style={{ textDecoration: 'none', padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleToggle(socio)}
                        className="syb-btn-ghost"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', color: isActivo ? 'var(--color-danger)' : 'var(--color-success)' }}
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
