import { getServerSupabase } from "@/lib/supabase";
import type { VeridiaSubmission } from "@/lib/types";

/**
 * Repositório server-side. Quando o Supabase está configurado, persiste em
 * Postgres; caso contrário sinaliza `configured: false` e o cliente mantém os
 * dados em localStorage.
 */

function toRow(s: VeridiaSubmission) {
  return {
    id: s.id,
    status: s.status,
    current_step: s.currentStep,
    car_number: s.property.carNumber ?? null,
    property_name: s.property.propertyName ?? null,
    municipality: s.property.municipality ?? null,
    state: s.property.state ?? null,
    total_area_ha: s.property.totalAreaHa ?? null,
    readiness_score: s.result?.readinessScore.total ?? null,
    result_status: s.result?.status ?? null,
    data: s,
    updated_at: new Date().toISOString(),
  };
}

export async function upsertSubmission(
  s: VeridiaSubmission,
): Promise<{ configured: boolean; error?: string }> {
  const supabase = getServerSupabase();
  if (!supabase) return { configured: false };

  const { error } = await supabase
    .from("submissions")
    .upsert(toRow(s), { onConflict: "id" });

  return { configured: true, error: error?.message };
}

export async function getSubmission(
  id: string,
): Promise<{ configured: boolean; submission: VeridiaSubmission | null }> {
  const supabase = getServerSupabase();
  if (!supabase) return { configured: false, submission: null };

  const { data } = await supabase
    .from("submissions")
    .select("data")
    .eq("id", id)
    .maybeSingle();

  return {
    configured: true,
    submission: (data?.data as VeridiaSubmission) ?? null,
  };
}

export async function listSubmissions(): Promise<{
  configured: boolean;
  submissions: VeridiaSubmission[];
}> {
  const supabase = getServerSupabase();
  if (!supabase) return { configured: false, submissions: [] };

  const { data } = await supabase
    .from("submissions")
    .select("data")
    .order("updated_at", { ascending: false })
    .limit(200);

  return {
    configured: true,
    submissions: (data ?? []).map((r) => r.data as VeridiaSubmission),
  };
}
