"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { ClassBadge } from "@/components/ui/Badge";
import { listAllSubmissions } from "@/lib/store";
import { SCORE_CLASSIFICATION } from "@/lib/copy";
import { formatHa } from "@/lib/utils";
import type { ClassificationLevel, VeridiaSubmission } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  em_andamento: "Em andamento",
  preliminar_pronto: "Preliminar pronto",
  refinado_pronto: "Refinado",
};

function levelOf(score?: number): ClassificationLevel {
  if (score === undefined) return "atencao";
  if (score >= 61) return "favoravel";
  if (score >= 31) return "atencao";
  return "critico";
}

export default function BackofficePage() {
  const [subs, setSubs] = useState<VeridiaSubmission[] | null>(null);

  useEffect(() => {
    listAllSubmissions().then(setSubs);
  }, []);

  return (
    <div className="min-h-screen bg-ink-300/10">
      <header className="border-b border-ink-300/40 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Wordmark />
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-xs font-semibold text-white">
              Backoffice
            </span>
          </div>
          <Link href="/" className="text-sm text-ink-500 hover:text-ink-900">
            Sair
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-xl font-bold text-ink-900">Submissões</h1>
        <p className="text-sm text-ink-500">
          Visão técnica das análises geradas pela VeridIA.
        </p>

        {!subs ? (
          <p className="mt-8 text-ink-500">Carregando...</p>
        ) : subs.length === 0 ? (
          <div className="mt-8 card p-8 text-center text-ink-500">
            Nenhuma submissão ainda. As análises feitas no fluxo aparecem aqui.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-ink-300/40 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ink-300/20 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3">Propriedade</th>
                  <th className="px-4 py-3">Local</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => {
                  const score = s.result?.readinessScore.total;
                  return (
                    <tr key={s.id} className="border-t border-ink-300/30 hover:bg-brand-100/40">
                      <td className="px-4 py-3">
                        <Link href={`/backoffice/${s.id}`} className="font-medium text-brand-600 hover:underline">
                          {s.property.propertyName ?? s.id}
                        </Link>
                        <div className="text-xs text-ink-500">{s.property.carNumber ?? "sem CAR"}</div>
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        {s.property.municipality ? `${s.property.municipality}/${s.property.state}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        {s.property.totalAreaHa ? formatHa(s.property.totalAreaHa) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {score !== undefined ? (
                          <ClassBadge level={levelOf(score)}>{score}/100</ClassBadge>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-700">{STATUS_LABEL[s.status]}</td>
                      <td className="px-4 py-3 text-xs text-ink-500">
                        {new Date(s.updatedAt).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
