"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { ClassBadge, Pill } from "@/components/ui/Badge";
import { ScoreDial } from "@/components/veridia/ScoreDial";
import { VeridiaSays } from "@/components/veridia/VeridiaSays";
import { SpecialistButton } from "@/components/flow/SpecialistButton";
import { EconomicsSection } from "@/components/result/EconomicsSection";
import { PricingTiers } from "@/components/result/PricingTiers";
import { DownloadPdfButton } from "@/components/result/DownloadPdfButton";
import { useSubmission } from "@/lib/useSubmission";
import { runPreFeasibility } from "@/lib/engine";
import {
  SCORE_CLASSIFICATION,
  CONFIDENCE_LABELS,
  CLASSIFICATION_META,
  ROUTE_LABELS,
} from "@/lib/copy";
import { documentsPath } from "@/lib/flow";
import { formatHa } from "@/lib/utils";
import type { Adherence, LeadData } from "@/lib/types";

const ADHERENCE_BADGE: Record<Adherence, "favoravel" | "atencao" | "critico"> = {
  alta: "favoravel",
  media: "atencao",
  baixa: "critico",
};

export default function ResultadoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { submission, loading, flush } = useSubmission(params.id);
  const [showTech, setShowTech] = useState(false);

  // Recalcula sempre a partir da submissão e persiste.
  const result = useMemo(
    () => (submission ? submission.result ?? runPreFeasibility(submission) : null),
    [submission],
  );

  useEffect(() => {
    if (submission && result && !submission.result) {
      flush({ ...submission, result });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission?.id]);

  if (loading || !submission || !result) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-500">
        A VeridIA está montando seu resultado...
      </div>
    );
  }

  const sc = result.readinessScore;
  const cls = SCORE_CLASSIFICATION[sc.classification];
  const prop = submission.property;
  const best = result.candidateRoutes[0];

  const handleUnlock = (lead: LeadData) => {
    if (submission) flush({ ...submission, lead });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="brand-mesh px-5 py-6 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/">
            <Wordmark tone="light" />
          </Link>
          <DownloadPdfButton submission={submission} result={result} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">
        <VeridiaSays>
          <p className="text-sm">
            Pronto! Analisei a sua terra e aqui está o potencial de receita com
            créditos de carbono.
          </p>
        </VeridiaSays>

        {/* Bloqueio */}
        {result.blocked && (
          <div className="rounded-2xl border-2 border-critico/30 bg-red-50 p-6">
            <h2 className="text-lg font-bold text-critico">
              A VeridIA encontrou uma restrição importante
            </h2>
            <p className="mt-2 text-sm text-ink-700">{result.blockReason}</p>
            <p className="mt-2 text-sm text-ink-700">
              Este caso precisa de avaliação especializada antes de qualquer
              recomendação.
            </p>
            <div className="mt-4">
              <SpecialistButton variant="inline" />
            </div>
          </div>
        )}

        {/* Score + resumo */}
        <section className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
          <ScoreDial total={sc.total} classification={sc.classification} />
          <div className="flex-1">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Score de Prontidão VeridIA
            </span>
            <p className="mt-1 text-lg font-semibold text-ink-900">{cls.label}</p>
            <p className="mt-2 text-sm text-ink-700">{cls.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>{prop.propertyName ?? "Sua propriedade"}</Pill>
              {prop.totalAreaHa && <Pill>{formatHa(prop.totalAreaHa)}</Pill>}
              {prop.municipality && <Pill>{prop.municipality}/{prop.state}</Pill>}
            </div>
          </div>
        </section>

        {/* Confiança */}
        <section className="rounded-2xl bg-brand-100 p-5">
          <p className="text-sm font-semibold text-ink-900">
            {CONFIDENCE_LABELS[result.confidence.level].label}
          </p>
          <p className="mt-1 text-sm text-ink-700">
            {CONFIDENCE_LABELS[result.confidence.level].message}
          </p>
        </section>

        {/* Rotas candidatas */}
        <section>
          <h2 className="text-lg font-bold text-ink-900">De onde vêm os créditos de carbono</h2>
          <p className="text-sm text-ink-500">
            As rotas que podem gerar créditos na sua terra — da mais provável à menos.
          </p>
          <div className="mt-4 space-y-3">
            {result.candidateRoutes.map((r) => (
              <div key={r.routeId} className="card p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink-900">{r.routeName}</h3>
                  <ClassBadge level={ADHERENCE_BADGE[r.adherence]}>
                    aderência {r.adherence}
                  </ClassBadge>
                </div>
                <p className="mt-2 text-sm text-ink-700">{r.userFriendlyExplanation}</p>
                {r.positiveSignals.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {r.positiveSignals.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                        <span className="text-favoravel">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Estimativa econômica (gated por lead) */}
        {result.economics && !result.blocked && (
          <EconomicsSection
            economics={result.economics}
            hasLead={Boolean(submission.lead)}
            onUnlock={handleUnlock}
          />
        )}

        {/* Favorece / atenção / riscos / faltantes */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FindingCard title="O que favorece" tone="favoravel" items={result.keyFindings.positiveSignals} />
          <FindingCard title="O que precisa de atenção" tone="atencao" items={result.keyFindings.attentionPoints} />
          {result.keyFindings.criticalRisks.length > 0 && (
            <FindingCard title="Riscos a avaliar" tone="critico" items={result.keyFindings.criticalRisks} />
          )}
          <FindingCard title="Dados que ajudam a refinar" tone="neutral" items={result.keyFindings.missingData} />
        </div>

        {/* Recomendação */}
        <section className="rounded-2xl border-2 border-brand-500 bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900">Próximo passo recomendado</h2>
          <p className="mt-2 text-sm text-ink-700">{result.recommendation.userMessage}</p>
          {result.recommendation.nextSteps.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {result.recommendation.nextSteps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-600">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {result.recommendation.cta === "upload_documents" && (
              <Button onClick={() => router.push(documentsPath(submission.id))}>
                Enviar documentos
              </Button>
            )}
            <SpecialistButton variant="inline" />
            {result.recommendation.cta !== "upload_documents" && (
              <Button variant="ghost" onClick={() => router.push(documentsPath(submission.id))}>
                Enviar documentos para refinar
              </Button>
            )}
          </div>
        </section>

        {/* Planos */}
        <PricingTiers analysisId={submission.id} currentPlan={submission.plan?.tier} />

        {/* Detalhes técnicos */}
        <section>
          <button
            onClick={() => setShowTech((v) => !v)}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            {showTech ? "Esconder" : "Ver"} detalhes técnicos
          </button>
          {showTech && (
            <div className="mt-4 space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-ink-900">Score por dimensão</h3>
                <div className="mt-3 space-y-3">
                  {sc.dimensions.map((d) => (
                    <div key={d.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-700">{d.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="font-medium text-ink-900">
                            {d.achievedPoints}/{d.maxPoints}
                          </span>
                          <ClassBadge level={d.classification}>
                            {CLASSIFICATION_META[d.classification].label}
                          </ClassBadge>
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                        <div
                          className="h-full bg-brand-500"
                          style={{ width: `${(d.achievedPoints / d.maxPoints) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-ink-900">Rotas metodológicas candidatas</h3>
                <p className="mt-1 text-xs text-ink-500">
                  Uso técnico — não representa validação metodológica.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  {result.candidateRoutes.map((r) => (
                    <li key={r.routeId}>
                      <span className="font-medium">{ROUTE_LABELS[r.routeId].technical}</span>:{" "}
                      {r.methodologyFamilies.join("; ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <p className="text-center text-xs text-ink-500">
          A VeridIA não substitui a análise técnica final. Ela antecipa a
          pergunta mais importante do início: vale a pena avançar?
        </p>
      </main>

      <SpecialistButton variant="fixed" />
    </div>
  );
}

function FindingCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "favoravel" | "atencao" | "critico" | "neutral";
  items: string[];
}) {
  if (!items.length) return null;
  const mark =
    tone === "favoravel" ? "✓" : tone === "critico" ? "!" : tone === "atencao" ? "!" : "•";
  const color =
    tone === "favoravel"
      ? "text-favoravel"
      : tone === "critico"
        ? "text-critico"
        : tone === "atencao"
          ? "text-atencao"
          : "text-ink-500";
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
            <span className={color}>{mark}</span> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
