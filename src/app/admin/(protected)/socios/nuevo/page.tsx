'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { createSocioAction } from '@/app/actions/socios'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://syb.vercel.app'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  fontWeight: 500,
  color: 'var(--foreground-subtle)',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  display: 'block',
  marginBottom: '8px',
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <span
      style={{
        color: 'var(--color-danger)',
        fontSize: '0.78rem',
        marginTop: '6px',
        display: 'block',
      }}
    >
      {msg}
    </span>
  )
}

type ModalData = {
  socioId: string
  token: string
  email: string
}

export default function NuevoSocioPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [token, setToken] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const tokenManuallyEdited = useRef(false)
  const randomSuffix = useRef<number | null>(null)

  useEffect(() => {
    if (tokenManuallyEdited.current) return
    if (!nombre) {
      setToken('')
      randomSuffix.current = null
      return
    }
    if (randomSuffix.current === null) {
      randomSuffix.current = Math.floor(100 + Math.random() * 900)
    }
    setToken(`login-${slugify(nombre)}-${randomSuffix.current}`)
  }, [nombre])

  function handleTokenChange(val: string) {
    tokenManuallyEdited.current = true
    setToken(val)
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!nombre.trim()) errs.nombre = 'El nombre es requerido.'
    if (!email.trim()) {
      errs.email = 'El email es requerido.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'El email no es válido.'
    }
    if (!token.trim()) errs.token = 'El token es requerido.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await createSocioAction({
      nombre,
      email,
      empresa: empresa || undefined,
      token,
      notas_admin: notas || undefined,
    })
    if (!result.ok) {
      toast.error(result.error)
      setLoading(false)
      return
    }
    setModalData({ socioId: result.socioId, token, email })
    setLoading(false)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copiado')
  }

  function copyAll() {
    if (!modalData) return
    const text = [
      `Link de acceso: ${SITE_URL}/login`,
      `Email: ${modalData.email}`,
      `Token: ${modalData.token}`,
    ].join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Copiado')
  }

  return (
    <>
      <div style={{ maxWidth: '560px' }}>
        <Link
          href="/admin/socios"
          style={{
            color: 'var(--foreground-muted)',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
          }}
        >
          ← Socios
        </Link>

        <header style={{ marginBottom: '36px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--foreground-subtle)',
              margin: '0 0 12px 0',
            }}
          >
            Panel Admin
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              color: 'var(--foreground)',
              fontSize: '2rem',
              margin: 0,
              letterSpacing: '-0.015em',
            }}
          >
            Nuevo socio
          </h1>
        </header>

        <div
          style={{
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-md)',
            padding: '36px 32px',
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="syb-input"
                />
                <FieldError msg={errors.nombre} />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="syb-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <FieldError msg={errors.email} />
              </div>

              <div>
                <label style={labelStyle}>Empresa</label>
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="syb-input"
                />
              </div>

              <div>
                <label style={labelStyle}>Token *</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  className="syb-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <FieldError msg={errors.token} />
              </div>

              <div>
                <label style={labelStyle}>Notas internas</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={4}
                  className="syb-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="syb-btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '8px',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Creando…' : 'Crear socio'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {modalData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13,6,24,0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface-1)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--foreground-subtle)',
                margin: '0 0 10px 0',
              }}
            >
              Listo
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                color: 'var(--foreground)',
                fontSize: '1.35rem',
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em',
              }}
            >
              Socio creado
            </h2>
            <p
              style={{
                color: 'var(--foreground-muted)',
                fontSize: '0.875rem',
                margin: '0 0 24px 0',
                lineHeight: 1.6,
              }}
            >
              Guardá estos datos. La contraseña no se puede recuperar.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Link de acceso', value: `${SITE_URL}/login` },
                { label: 'Email', value: modalData.email },
                { label: 'Token', value: modalData.token },
              ].map(({ label, value }, idx, arr) => (
                <div
                  key={label}
                  style={{
                    padding: '14px 0',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--hairline)',
                    borderBottom: idx === arr.length - 1 ? '1px solid var(--hairline)' : 'none',
                  }}
                >
                  <div style={labelStyle}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        color: 'var(--foreground)',
                        wordBreak: 'break-all',
                        flex: 1,
                      }}
                    >
                      {value}
                    </span>
                    <button
                      onClick={() => copyToClipboard(value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--foreground-muted)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                      aria-label="Copiar"
                    >
                      <Copy size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={copyAll} className="syb-btn-ghost" style={{ flex: 1 }}>
                Copiar todo
              </button>
              <button
                onClick={() => router.push('/admin/socios/' + modalData.socioId)}
                className="syb-btn-primary"
                style={{ flex: 1 }}
              >
                Ir al perfil
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster richColors />
    </>
  )
}
