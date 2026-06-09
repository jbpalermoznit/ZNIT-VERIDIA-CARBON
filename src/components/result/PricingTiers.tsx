"use client";

import Link from "next/link";
import { PLANS, FREE_PLAN } from "@/lib/plans";
import type { PlanTier } from "@/lib/types";

export function PricingTiers({
  analysisId,
  currentPlan,
}: {
  analysisId: string;
  currentPlan?: PlanTier;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-ink-900">Como ir além do diagnóstico</h2>
      <p className="text-sm text-ink-500">
        Comece de graça. Avance quando fizer sentido pra você.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {/* Grátis */}
        <Card
          name={FREE_PLAN.name}
          price={FREE_PLAN.price}
          tagline={FREE_PLAN.tagline}
          features={FREE_PLAN.features}
        >
          <span className="mt-5 grid place-items-center rounded-xl bg-brand-100 py-2.5 text-sm font-semibold text-brand-600">
            Seu plano atual
          </span>
        </Card>

        {(["pro", "especialista"] as PlanTier[]).map((tier) => {
          const p = PLANS[tier];
          const owned = currentPlan === tier;
          return (
            <Card
              key={tier}
              name={p.name}
              price={p.price}
              priceNote={p.priceNote}
              tagline={p.tagline}
              features={p.features}
              featured={tier === "pro"}
            >
              {owned ? (
                <span className="mt-5 grid place-items-center rounded-xl bg-favoravel/15 py-2.5 text-sm font-semibold text-favoravel">
                  ✓ Plano ativo
                </span>
              ) : (
                <Link
                  href={`/analise/${analysisId}/contratar?plano=${tier}`}
                  className={
                    "mt-5 grid place-items-center rounded-xl py-2.5 text-sm font-semibold transition " +
                    (tier === "pro"
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "border-2 border-ink-300/60 text-ink-900 hover:border-brand-500")
                  }
                >
                  Quero o {p.name}
                </Link>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Card({
  name,
  price,
  priceNote,
  tagline,
  features,
  featured,
  children,
}: {
  name: string;
  price: string;
  priceNote?: string;
  tagline: string;
  features: string[];
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex flex-col rounded-2xl border-2 p-5 " +
        (featured ? "border-brand-500 shadow-card" : "border-ink-300/50")
      }
    >
      {featured && (
        <span className="mb-2 inline-block w-fit rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          Mais escolhido
        </span>
      )}
      <h3 className="font-bold text-ink-900">{name}</h3>
      <p className="text-2xl font-bold text-brand-600">{price}</p>
      <p className="mt-0.5 text-xs text-ink-500">{priceNote ?? tagline}</p>
      <ul className="mt-4 flex-1 space-y-1.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
            <span className="text-favoravel">✓</span> {f}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
