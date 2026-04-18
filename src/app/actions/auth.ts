"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Cierra la sesión del usuario y redirige a la landing. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
