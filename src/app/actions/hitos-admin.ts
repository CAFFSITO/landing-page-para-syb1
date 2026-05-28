"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { HitosMap } from "@/lib/hitos";

type Result = { ok: true } | { ok: false; error: string };

export async function updateHitosAction(
  socioId: string,
  hitos: HitosMap
): Promise<Result> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("socios")
    .update({ hitos })
    .eq("id", socioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  revalidatePath("/lobby");
  return { ok: true };
}
