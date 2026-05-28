import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { SocioDetailShell } from '@/components/admin/socios/SocioDetailShell';
import type { Socio, Entregable, Reunion, Reporte, Lectura } from '@/types';

export default async function SocioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [
    { data: socio },
    { data: entregables },
    { data: reuniones },
    { data: reportes },
    { data: lecturas },
  ] = await Promise.all([
    supabase.from('socios').select('*').eq('id', id).single<Socio>(),
    supabase
      .from('entregables')
      .select('*')
      .eq('socio_id', id)
      .order('fase')
      .order('orden')
      .returns<Entregable[]>(),
    supabase
      .from('reuniones')
      .select('*')
      .eq('socio_id', id)
      .order('fase')
      .order('numero')
      .returns<Reunion[]>(),
    supabase
      .from('reportes')
      .select('*')
      .eq('socio_id', id)
      .order('fase')
      .order('numero')
      .returns<Reporte[]>(),
    supabase
      .from('lecturas')
      .select('*')
      .eq('socio_id', id)
      .order('leido_at', { ascending: false })
      .returns<Lectura[]>(),
  ]);

  if (!socio) {
    redirect('/admin/socios');
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <Link
        href="/admin/socios"
        style={{
          color: 'var(--foreground-muted)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        ← Socios
      </Link>

      <header
        style={{
          paddingBottom: '28px',
          borderBottom: '1px solid var(--hairline)',
          marginBottom: '36px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--foreground-subtle)',
                margin: '0 0 12px 0',
              }}
            >
              Socio
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '2rem',
                color: 'var(--foreground)',
                margin: '0 0 6px 0',
                letterSpacing: '-0.015em',
              }}
            >
              {socio.nombre}
            </h1>
            {socio.empresa && (
              <p
                style={{
                  color: 'var(--foreground-muted)',
                  margin: '0 0 10px 0',
                  fontSize: '0.95rem',
                }}
              >
                {socio.empresa}
              </p>
            )}
            <p
              style={{
                color: 'var(--foreground-muted)',
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
              }}
            >
              {socio.email}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}
          >
            <span className={socio.activo ? 'syb-tag syb-tag-success' : 'syb-tag syb-tag-danger'}>
              {socio.activo ? 'Activo' : 'Inactivo'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--foreground-subtle)',
              }}
            >
              {socio.token.slice(0, 24)}…
            </span>
          </div>
        </div>
      </header>

      <SocioDetailShell
        socio={socio}
        entregables={entregables ?? []}
        reuniones={reuniones ?? []}
        reportes={reportes ?? []}
        lecturas={lecturas ?? []}
      />
    </div>
  );
}
