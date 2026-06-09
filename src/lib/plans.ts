import type { PlanTier } from "./types";

export interface PlanDef {
  tier: PlanTier;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  features: string[];
  /** O que é liberado após a contratação. */
  unlocks: string[];
}

/**
 * Planos da VeridIA. Preços SUGERIDOS para a simulação do MVP — ajustar com o
 * time comercial antes de cobrança real.
 */
export const PLANS: Record<PlanTier, PlanDef> = {
  pro: {
    tier: "pro",
    name: "Pro",
    price: "R$ 149",
    priceNote: "pagamento único · valor sugerido",
    tagline: "Aprofunde a análise econômica",
    features: [
      "Tudo do Diagnóstico",
      "Relatório completo em PDF",
      "Estimativa econômica detalhada",
      "Checagem de elegibilidade aprofundada",
    ],
    unlocks: [
      "Relatório completo em PDF liberado",
      "Estimativa econômica detalhada da sua propriedade",
      "Acesso prioritário a um especialista",
    ],
  },
  especialista: {
    tier: "especialista",
    name: "Especialista",
    price: "R$ 1.490",
    priceNote: "a partir de · valor sugerido",
    tagline: "Estudo detalhado com gente da VeridIA",
    features: [
      "Tudo do Pro",
      "Estudo de viabilidade detalhado",
      "Acompanhamento de um especialista",
      "Estratégia de monetização e próximos passos",
    ],
    unlocks: [
      "Estudo de viabilidade detalhado",
      "Reunião com um especialista da VeridIA",
      "Plano de monetização e próximos passos",
    ],
  },
};

export const FREE_PLAN = {
  name: "Diagnóstico",
  price: "Grátis",
  tagline: "Veja o potencial da sua terra",
  features: [
    "Análise por satélite",
    "Score de Prontidão",
    "Rotas de crédito de carbono",
    "Prévia do potencial de receita",
  ],
};
