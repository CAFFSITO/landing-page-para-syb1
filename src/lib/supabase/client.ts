/**
 * Cliente de Supabase para el navegador (Client Components).
 *
 * Se usa en cualquier componente marcado con 'use client'.
 * Las cookies de sesión se manejan automáticamente por el navegador.
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Crea y devuelve una instancia del cliente de Supabase
 * configurada para ejecutarse en el navegador.
 *
 * Usa las variables de entorno públicas (NEXT_PUBLIC_*).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
