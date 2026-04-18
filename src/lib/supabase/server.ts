/**
 * Clientes de Supabase para el servidor.
 *
 * Se usan en Server Components, Server Actions y Route Handlers.
 * La sesión del usuario se mantiene mediante cookies de next/headers.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea un cliente de Supabase autenticado con la sesión del usuario.
 *
 * Lee y escribe cookies para mantener la sesión activa.
 * Respeta las políticas de RLS — solo puede acceder a los datos
 * que el usuario autenticado tiene permitido ver.
 *
 * Debe llamarse con `await` porque `cookies()` es asíncrono en Next.js 15+.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll puede fallar si se llama desde un Server Component
            // (son read-only). En ese caso el middleware se encarga de
            // refrescar la sesión.
          }
        },
      },
    }
  );
}

/**
 * ⚠️ ADVERTENCIA: Este cliente bypasea TODAS las políticas de RLS.
 * NUNCA debe usarse desde el navegador ni exponerse al cliente.
 *
 * Crea un cliente de Supabase con la Service Role Key para operaciones
 * de administración (crear usuarios, modificar datos sin restricciones, etc.).
 *
 * No usa cookies porque no depende de la sesión de ningún usuario.
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op: el cliente admin no necesita gestionar cookies de sesión.
        },
      },
    }
  );
}
