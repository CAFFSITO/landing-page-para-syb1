"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Cierra la sesión del usuario y redirige a la landing. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Autentica a un socio buscando su email y token en la tabla `socios`.
 * Esto permite que cualquier socio insertado manualmente en la base de datos
 * pueda iniciar sesión sin necesidad de haberle creado una cuenta en Auth previamente.
 */
export async function loginSocioWithToken(email: string, token: string): Promise<{ error: string | null }> {
  email = email.trim().toLowerCase();
  token = token.trim();

  if (!email || !token) {
    return { error: "Por favor completá todos los campos." };
  }

  // 1. Buscamos al socio directamente en la tabla usando el adminClient
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminClient = createAdminClient();

  const { data: socio, error: dbError } = await adminClient
    .from("socios")
    .select("id, activo")
    .eq("email", email)
    .eq("token", token)
    .single();

  if (dbError || !socio) {
    return { error: "Credenciales incorrectas. Intentá de nuevo." };
  }

  if (!socio.activo) {
    return { error: "Tu cuenta de socio está desactivada." };
  }

  // 2. Si existe en la tabla `socios`, generamos un OTP (Magic Link) como admin.
  // Esto crea automáticamente el usuario en Auth si no existía.
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email: email,
  });

  if (linkError || !linkData?.properties?.email_otp) {
    console.error("[socio-auth] Error al generar link:", linkError?.message);
    return { error: "No se pudo generar la sesión. Contactá al soporte." };
  }

  // 3. Verificamos el OTP con el cliente regular para establecer las cookies de sesión
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
    email: email,
    token: linkData.properties.email_otp,
    type: "magiclink",
  });

  if (sessionError || !sessionData?.session) {
    console.error("[socio-auth] Error al verificar OTP:", sessionError?.message);
    return { error: "No se pudo iniciar sesión." };
  }

  // 4. Todo ok, redirigimos al lobby
  return { error: null };
}
