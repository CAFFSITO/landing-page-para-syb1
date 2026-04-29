# SKILL: Contexto del Proyecto SYB


Stack: Next.js 14 App Router · TypeScript · Tailwind CSS (darkMode: 'class') · 
Supabase · Framer Motion · Lucide React · Merriweather (Google Fonts)

Reglas:
- Todos los componentes son Server Components por defecto
- 'use client' solo para interactividad/animaciones
- Dark mode por defecto, clase 'dark' en <html>
- Mobile-first: breakpoints sm/md/lg
- Tipos en types/index.ts, sin 'any'
- Nombres: PascalCase componentes, kebab-case archivos, camelCase variables

Estructura de carpetas:
/app /components/landing /components/ui /lib /types

Ya instalado: @supabase/supabase-js y @supabase/ssr

Variables de entorno ya configuradas en .env.local:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY