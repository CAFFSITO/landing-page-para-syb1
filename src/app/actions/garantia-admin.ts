"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { GarantiaData } from "@/types";

type Result = { ok: true } | { ok: false; error: string };

export async function updateGarantiaAction(
  socioId: string,
  garantia: GarantiaData
): Promise<Result> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("socios")
    .update({ garantia })
    .eq("id", socioId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/socios/${socioId}`);
  revalidatePath("/lobby");
  return { ok: true };
}
