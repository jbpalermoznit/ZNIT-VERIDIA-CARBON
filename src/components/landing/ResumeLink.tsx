"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listAllSubmissions } from "@/lib/store";
import { analysisPath } from "@/lib/flow";

/**
 * Link discreto para retomar uma análise em andamento (princípio 5 do PRD —
 * salvamento contínuo). Só aparece se existir uma análise não concluída.
 */
export function ResumeLink({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    listAllSubmissions().then((all) => {
      const pending = all
        .filter((s) => s.status === "em_andamento" && s.property.geometrySource)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
      if (pending) setId(pending.id);
    });
  }, []);

  if (!id) return null;

  return (
    <Link
      href={analysisPath(id)}
      className={
        "text-sm font-medium underline-offset-4 hover:underline " +
        (tone === "light" ? "text-white/80" : "text-brand-600")
      }
    >
      Continuar de onde parei →
    </Link>
  );
}
