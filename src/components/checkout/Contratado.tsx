"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { VeridiaSays } from "@/components/veridia/VeridiaSays";
import { DownloadPdfButton } from "@/components/result/DownloadPdfButton";
import { useSubmission } from "@/lib/useSubmission";
import { runPreFeasibility } from "@/lib/engine";
import { resultPath } from "@/lib/flow";
import { PLANS } from "@/lib/plans";
import { whatsappLink } from "@/lib/contact";

export function Contratado({ id }: { id: string }) {
  const router = useRouter();
  const { submission, loading } = useSubmission(id);

  const result = useMemo(
    () => (submission ? submission.result ?? runPreFeasibility(submission) : null),
    [submission],
  );

  // Sem plano contratado → volta ao resultado.
  useEffect(() => {
    if (!loading && submission && !submission.plan) router.replace(resultPath(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, submission?.plan]);

  if (loading || !submission || !submission.plan || !result) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Abrindo...</div>;
  }

  const plan = PLANS[submission.plan.tier];
  const isPro = submission.plan.tier === "pro";
  const firstName = submission.lead?.name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="brand-mesh px-5 py-6 text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/"><Wordmark tone="light" /></Link>
          <Link href={resultPath(id)} className="text-sm text-white/90 underline-offset-4 hover:underline">
            Voltar ao resultado
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-5 py-10">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-favoravel/15 text-3xl">
            ✓
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink-900">
            Plano {plan.name} ativado!
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Contratação simulada · nenhuma cobrança foi feita
          </p>
        </div>

        <VeridiaSays>
          <p className="text-sm">
            {firstName ? `Boa, ${firstName}! ` : "Pronto! "}
            A VeridIA liberou os próximos passos da sua análise. Aqui está o que
            você desbloqueou.
          </p>
        </VeridiaSays>

        <section className="card p-6">
          <h2 className="font-semibold text-ink-900">O que você desbloqueou</h2>
          <ul className="mt-3 space-y-2">
            {plan.unlocks.map((u, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                <span className="text-favoravel">✓</span> {u}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border-2 border-brand-500 bg-white p-6">
          <h2 className="font-semibold text-ink-900">Seu próximo passo</h2>
          <p className="mt-1 text-sm text-ink-700">
            {isPro
              ? "Baixe o relatório completo e, quando quiser, fale com um especialista para montar a estratégia."
              : "Vamos agendar a sua reunião com um especialista da VeridIA para o estudo detalhado."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {isPro && (
              <DownloadPdfButton
                submission={submission}
                result={result}
                className="btn-brand"
                label="Baixar relatório completo"
              />
            )}
            <a
              href={whatsappLink(
                `Olá! Acabei de contratar o plano ${plan.name} da VeridIA${
                  submission.property.propertyName ? ` para ${submission.property.propertyName}` : ""
                } e quero falar com um especialista.`,
              )}
              target="_blank"
              rel="noreferrer"
              className={isPro ? "btn-ghost" : "btn-brand"}
            >
              {isPro ? "Falar com especialista" : "Agendar minha reunião"}
            </a>
            {!isPro && (
              <DownloadPdfButton
                submission={submission}
                result={result}
                className="btn-ghost"
                label="Baixar relatório"
              />
            )}
          </div>
        </section>

        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push(resultPath(id))}>
            Voltar ao meu resultado
          </Button>
        </div>
      </main>
    </div>
  );
}
