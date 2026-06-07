"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { ClassBadge } from "@/components/ui/Badge";
import { useSubmission } from "@/lib/useSubmission";
import { runPreFeasibility } from "@/lib/engine";
import { CLASSIFICATION_META, SCORE_CLASSIFICATION, ROUTE_LABELS } from "@/lib/copy";
import { formatHa } from "@/lib/utils";

const DECISIONS = [
  { v: "aprovado", label: "Aprovar preliminar" },
  { v: "ajustar", label: "Ajustar score" },
  { v: "encaminhar_comercial", label: "Encaminhar p/ comercial" },
  { v: "nao_recomendado", label: "Não recomendado" },
] as const;

export default function BackofficeDetail({ params }: { params: { id: string } }) {
  const { submission, loading, saveState, flush, update } = useSubmission(params.id);
  const [note, setNote] = useState("");
  const [override, setOverride] = useState("");

  const result = useMemo(
    () => (submission ? submission.result ?? runPreFeasibility(submission) : null),
    [submission],
  );

  if (loading || !submission || !result) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Carregando...</div>;
  }

  const prop = submission.property;
  const enr = submission.enrichment;
  const sc = result.readinessScore;

  function saveReview(decision: (typeof DECISIONS)[number]["v"]) {
    flush({
      ...submission!,
      expert: {
        note: note || submission!.expert?.note,
        decision,
        scoreOverride: override ? Number(override) : submission!.expert?.scoreOverride,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  return (
    <div className="min-h-screen bg-ink-300/10">
      <header className="border-b border-ink-300/40 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Wordmark />
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-xs font-semibold text-white">Backoffice</span>
          </div>
          <Link href="/backoffice" className="text-sm text-ink-500 hover:text-ink-900">← Todas</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        {/* Coluna principal */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-ink-900">
              {prop.propertyName ?? submission.id}
            </h1>
            <p className="text-sm text-ink-500">
              {prop.carNumber} · {prop.municipality}/{prop.state} ·{" "}
              {prop.totalAreaHa ? formatHa(prop.totalAreaHa) : "—"} · origem da geometria:{" "}
              {prop.geometrySource ?? "—"}
            </p>
          </div>

          {/* Dados enriquecidos */}
          <Card title="Dados enriquecidos">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <KV k="Bioma" v={enr?.biome.join(", ") || "—"} />
              <KV k="Confiança" v={enr?.confidence ?? "—"} />
              <KV k="APP" v={enr?.sicar ? formatHa(enr.sicar.appHa) : "—"} />
              <KV k="Reserva Legal" v={enr?.sicar ? formatHa(enr.sicar.rlHa) : "—"} />
              <KV k="Desmatamento recente" v={enr?.deforestation?.hasRecentAlerts ? "Sim" : "Não"} />
              <KV k="Sobreposição TI/UC" v={enr?.overlaps.terraIndigena || enr?.overlaps.ucIntegral ? "Sim" : "Não"} />
            </div>
            <div className="mt-3 text-xs text-ink-500">
              Fontes: {enr?.sources.map((s) => `${s.name} (${s.status})`).join(" · ")}
            </div>
          </Card>

          {/* Respostas */}
          <Card title="Respostas do usuário">
            <div className="space-y-2 text-sm">
              <KV k="Intenção" v={submission.intent.options.join(", ") || "—"} />
              <KV k="Posse" v={submission.eligibility.ownership ?? "—"} />
              <KV k="Histórico de uso" v={submission.eligibility.historicalUseDuration ?? "—"} />
              <KV k="Obrigações" v={submission.eligibility.environmentalObligations.join(", ") || "—"} />
              <KV k="Projeto ativo" v={submission.eligibility.activeProjects ?? "—"} />
              <KV k="Uso atual" v={submission.currentUse.map((u) => `${u.class} ${u.condition ? `(${u.condition})` : ""}`).join("; ") || "—"} />
            </div>
          </Card>

          {/* Score por dimensão */}
          <Card title={`Score: ${sc.total}/100 — ${SCORE_CLASSIFICATION[sc.classification].label}`}>
            <div className="space-y-2">
              {sc.dimensions.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex-1 text-ink-700">{d.name}</span>
                  <span className="font-medium text-ink-900">{d.achievedPoints}/{d.maxPoints}</span>
                  <ClassBadge level={d.classification}>{CLASSIFICATION_META[d.classification].label}</ClassBadge>
                </div>
              ))}
            </div>
          </Card>

          {/* Rotas */}
          <Card title="Rotas candidatas">
            <div className="space-y-2 text-sm">
              {result.candidateRoutes.map((r) => (
                <div key={r.routeId} className="flex items-center justify-between">
                  <span className="text-ink-700">{ROUTE_LABELS[r.routeId].technical}</span>
                  <span className="font-medium text-ink-900">{r.score} · {r.adherence}</span>
                </div>
              ))}
            </div>
          </Card>

          {result.blocked && (
            <div className="rounded-xl border border-critico/30 bg-red-50 p-4 text-sm text-critico">
              <strong>Bloqueio automático:</strong> {result.blockReason}
            </div>
          )}
        </div>

        {/* Painel do especialista */}
        <aside className="space-y-4">
          <div className="card sticky top-6 space-y-4 p-5">
            <h2 className="font-semibold text-ink-900">Revisão do especialista</h2>
            {submission.expert?.decision && (
              <p className="rounded-lg bg-brand-100 px-3 py-2 text-xs text-ink-700">
                Última: <strong>{submission.expert.decision}</strong> em{" "}
                {submission.expert.updatedAt && new Date(submission.expert.updatedAt).toLocaleString("pt-BR")}
              </p>
            )}
            <div>
              <label className="text-sm font-medium text-ink-700">Observação técnica</label>
              <textarea
                rows={4}
                defaultValue={submission.expert?.note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder="Notas para o caso..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Ajustar score (opcional)</label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={submission.expert?.scoreOverride}
                onChange={(e) => setOverride(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500"
                placeholder={`${sc.total}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              {DECISIONS.map((d) => (
                <Button
                  key={d.v}
                  variant={d.v === "aprovado" ? "brand" : "ghost"}
                  onClick={() => saveReview(d.v)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
            <p className="text-center text-xs text-ink-500">
              {saveState === "saved" ? "Anotado." : saveState === "saving" ? "Salvando..." : " "}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 font-semibold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <span className="text-xs text-ink-500">{k}</span>
      <p className="text-ink-900">{v}</p>
    </div>
  );
}
