"use client";

import { useMemo } from "react";
import { Wordmark, ByZnit } from "@/components/ui/Wordmark";
import { useSubmission } from "@/lib/useSubmission";
import { runPreFeasibility } from "@/lib/engine";
import { SCORE_CLASSIFICATION, CONFIDENCE_LABELS } from "@/lib/copy";
import { formatHa } from "@/lib/utils";

export default function RelatorioPage({ params }: { params: { id: string } }) {
  const { submission, loading } = useSubmission(params.id);
  const result = useMemo(
    () => (submission ? submission.result ?? runPreFeasibility(submission) : null),
    [submission],
  );

  if (loading || !submission || !result) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Gerando relatório...</div>;
  }

  const prop = submission.property;
  const sc = result.readinessScore;
  const r = result.report;

  return (
    <div className="min-h-screen bg-ink-300/20 py-8 print:bg-white print:py-0">
      {/* Barra de ações (some na impressão) */}
      <div className="mx-auto mb-6 flex max-w-[800px] items-center justify-between px-6 print:hidden">
        <a href={`/analise/${submission.id}/resultado`} className="text-sm font-medium text-brand-600 hover:underline">
          ← Voltar ao resultado
        </a>
        <button onClick={() => window.print()} className="btn-primary">
          Salvar como PDF / Imprimir
        </button>
      </div>

      <article className="mx-auto max-w-[800px] bg-white p-12 shadow-card print:max-w-none print:p-0 print:shadow-none">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-ink-300/40 pb-6">
          <div className="text-2xl">
            <Wordmark withTagline />
          </div>
          <div className="text-right text-xs text-ink-500">
            <ByZnit />
            <p className="mt-1">Relatório preliminar</p>
            <p>{new Date(r.generatedAt).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        {/* Página 1 — Resumo executivo */}
        <Section title="Resumo executivo">
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Fact label="Propriedade" value={prop.propertyName ?? "—"} />
            <Fact label="Localização" value={prop.municipality ? `${prop.municipality}/${prop.state}` : "—"} />
            <Fact label="Área analisada" value={formatHa(prop.totalAreaHa ?? 0)} />
            <Fact label="Score de Prontidão" value={`${sc.total}/100`} />
          </div>
          <p className="text-sm leading-relaxed text-ink-700">{r.executiveSummary}</p>
          <p className="mt-3 rounded-lg bg-brand-100 px-4 py-3 text-sm font-medium text-ink-900">
            {SCORE_CLASSIFICATION[sc.classification].message}
          </p>
        </Section>

        {/* Página 2 — Diagnóstico */}
        <Section title="Diagnóstico da propriedade">
          <p className="text-sm leading-relaxed text-ink-700">{r.propertyDiagnosis}</p>
          <p className="mt-3 text-sm text-ink-500">
            Nível de confiança: <strong className="text-ink-900">{CONFIDENCE_LABELS[result.confidence.level].label}</strong>.{" "}
            {CONFIDENCE_LABELS[result.confidence.level].message}
          </p>
        </Section>

        {/* Página 3 — Rotas candidatas */}
        <Section title="Oportunidades identificadas">
          <div className="space-y-3">
            {result.candidateRoutes.map((route) => (
              <div key={route.routeId} className="rounded-lg border border-ink-300/40 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-ink-900">{route.routeName}</h4>
                  <span className="text-sm text-ink-500">aderência {route.adherence}</span>
                </div>
                <p className="mt-1 text-sm text-ink-700">{route.userFriendlyExplanation}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Página 4 — Riscos e lacunas */}
        <Section title="Riscos e o que precisa de atenção">
          <Bullets title="Pontos de atenção" items={result.keyFindings.attentionPoints} />
          {result.keyFindings.criticalRisks.length > 0 && (
            <Bullets title="Riscos a avaliar" items={result.keyFindings.criticalRisks} />
          )}
          <Bullets title="Dados que ajudam a refinar" items={result.keyFindings.missingData} />
        </Section>

        {/* Página 5 — Próximos passos */}
        <Section title="Próximos passos">
          <p className="text-sm leading-relaxed text-ink-700">{r.nextStepsText}</p>
          {r.technicalNotes && (
            <p className="mt-4 text-xs leading-relaxed text-ink-500">{r.technicalNotes}</p>
          )}
          <div className="mt-6 rounded-lg bg-ink-900 px-5 py-4 text-sm text-white">
            Quer avançar com segurança? Fale com um especialista da VeridIA:
            veridia@znit.com.br
          </div>
        </Section>

        <p className="mt-8 border-t border-ink-300/40 pt-4 text-[11px] leading-relaxed text-ink-500">
          Este relatório é uma leitura preliminar gerada pela VeridIA a partir de
          dados públicos, imagens de satélite e das respostas informadas. Não
          representa validação metodológica, certificação, registro em standard,
          garantia de elegibilidade ou emissão de créditos. A análise técnica
          final cabe a um especialista.
        </p>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-brand-600">{title}</h3>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-500">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function Bullets({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-ink-700">
        {items.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
