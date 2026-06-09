"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { useSubmission } from "@/lib/useSubmission";
import { PLANS } from "@/lib/plans";
import { resultPath } from "@/lib/flow";
import type { PlanTier } from "@/lib/types";

export function Checkout({ id, plano }: { id: string; plano?: string }) {
  const router = useRouter();
  const { submission, loading, flush } = useSubmission(id);

  const tier = (plano === "pro" || plano === "especialista" ? plano : "pro") as PlanTier;
  const plan = PLANS[tier];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  // prefill a partir do lead já capturado
  const lead = submission?.lead;
  const nameVal = name || lead?.name || "";
  const emailVal = email || lead?.email || "";
  const valid = nameVal.trim().length > 1 && /.+@.+\..+/.test(emailVal);

  function confirm() {
    if (!submission || !valid) return;
    setBusy(true);
    const now = new Date().toISOString();
    flush({
      ...submission,
      lead: submission.lead ?? { name: nameVal.trim(), email: emailVal.trim(), createdAt: now },
      plan: { tier, status: "simulado", createdAt: now },
    });
    router.push(`/analise/${id}/contratado`);
  }

  if (loading || !submission) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Abrindo...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-100/40">
      <header className="brand-mesh px-5 py-5 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/"><Wordmark tone="light" /></Link>
          <Link href={resultPath(id)} className="text-sm text-white/90 underline-offset-4 hover:underline">
            Voltar ao resultado
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-3xl gap-6 px-5 py-8 md:grid-cols-[1fr_320px]">
        {/* Formulário simulado */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Contratar o plano {plan.name}</h1>
            <p className="mt-1 text-sm text-ink-700">
              Confirme seus dados para ativar o plano e desbloquear os próximos passos.
            </p>
          </div>

          <div className="card space-y-3 p-5">
            <h2 className="text-sm font-semibold text-ink-900">Seus dados</h2>
            <Field label="Nome" value={nameVal} onChange={setName} placeholder="Seu nome" />
            <Field label="E-mail" value={emailVal} onChange={setEmail} placeholder="seu@email.com" type="email" />
          </div>

          <div className="card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-900">Pagamento</h2>
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600">
                Simulação
              </span>
            </div>
            <Field label="Número do cartão" value="" onChange={() => {}} placeholder="0000 0000 0000 0000" disabled />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Validade" value="" onChange={() => {}} placeholder="MM/AA" disabled />
              <Field label="CVV" value="" onChange={() => {}} placeholder="123" disabled />
            </div>
            <p className="text-xs text-ink-500">
              Nenhuma cobrança é feita. Esta é uma simulação para demonstrar a
              experiência de contratação.
            </p>
          </div>

          <Button className="w-full" disabled={!valid || busy} onClick={confirm}>
            {busy ? "Ativando..." : `Confirmar contratação · ${plan.price}`}
          </Button>
        </div>

        {/* Resumo do plano */}
        <aside className="h-fit rounded-2xl border-2 border-brand-500 bg-white p-5">
          <h2 className="font-bold text-ink-900">Plano {plan.name}</h2>
          <p className="text-2xl font-bold text-brand-600">{plan.price}</p>
          <p className="text-xs text-ink-500">{plan.priceNote}</p>
          <ul className="mt-4 space-y-1.5">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                <span className="text-favoravel">✓</span> {f}
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-600">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500 disabled:bg-ink-300/10 disabled:text-ink-400"
      />
    </label>
  );
}
