"use client";

import { whatsappLink } from "@/lib/contact";

interface Tier {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: { label: string; href?: string; current?: boolean };
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Diagnóstico",
    price: "Grátis",
    tagline: "Veja o potencial do seu pasto",
    features: [
      "Análise do pasto por satélite",
      "Score de Prontidão",
      "Oportunidades identificadas",
      "Estimativa de receita (com cadastro)",
    ],
    cta: { label: "Seu plano atual", current: true },
  },
  {
    name: "Pro",
    price: "Sob consulta",
    tagline: "Aprofunde a análise econômica",
    features: [
      "Tudo do Diagnóstico",
      "Relatório completo em PDF",
      "Estimativa econômica detalhada",
      "Checagem de elegibilidade aprofundada",
    ],
    cta: {
      label: "Quero o Pro",
      href: whatsappLink("Olá! Tenho interesse no plano Pro da VeridIA para a minha fazenda."),
    },
    featured: true,
  },
  {
    name: "Especialista",
    price: "Sob consulta",
    tagline: "Estudo detalhado com gente da VeridIA",
    features: [
      "Tudo do Pro",
      "Estudo de viabilidade detalhado",
      "Acompanhamento de um especialista",
      "Estratégia de monetização e próximos passos",
    ],
    cta: {
      label: "Falar com especialista",
      href: whatsappLink("Olá! Quero um estudo detalhado da VeridIA para a minha propriedade."),
    },
  },
];

export function PricingTiers() {
  return (
    <section>
      <h2 className="text-lg font-bold text-ink-900">Como ir além do diagnóstico</h2>
      <p className="text-sm text-ink-500">
        Comece de graça. Avance quando fizer sentido pra você.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={
              "flex flex-col rounded-2xl border-2 p-5 " +
              (t.featured ? "border-brand-500 shadow-card" : "border-ink-300/50")
            }
          >
            {t.featured && (
              <span className="mb-2 inline-block w-fit rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Mais escolhido
              </span>
            )}
            <h3 className="font-bold text-ink-900">{t.name}</h3>
            <p className="text-2xl font-bold text-brand-600">{t.price}</p>
            <p className="mt-1 text-sm text-ink-500">{t.tagline}</p>
            <ul className="mt-4 flex-1 space-y-1.5">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="text-favoravel">✓</span> {f}
                </li>
              ))}
            </ul>
            {t.cta.current ? (
              <span className="mt-5 grid place-items-center rounded-xl bg-brand-100 py-2.5 text-sm font-semibold text-brand-600">
                {t.cta.label}
              </span>
            ) : (
              <a
                href={t.cta.href}
                target="_blank"
                rel="noreferrer"
                className={
                  "mt-5 grid place-items-center rounded-xl py-2.5 text-sm font-semibold transition " +
                  (t.featured
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "border-2 border-ink-300/60 text-ink-900 hover:border-brand-500")
                }
              >
                {t.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
