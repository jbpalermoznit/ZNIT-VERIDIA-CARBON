import type {
  CandidateRoute,
  EconomicEstimate,
  Range,
  RouteId,
} from "@/lib/types";
import type { AnalysisContext } from "./context";

/**
 * Parâmetros PRELIMINARES para a estimativa econômica.
 *
 * São defaults conservadores de literatura (Embrapa, IPCC, metodologias VCS),
 * usados apenas para dar ordem de grandeza ao produtor. NÃO são uma promessa de
 * crédito. Serão refinados pelo doc de pesquisa regulatória
 * (docs/research/regulatorio-pecuaria-carbono.md).
 *
 * seq = sequestro/redução tCO2e por hectare por ano.
 */
// Defaults calibrados pela pesquisa regulatória
// (docs/research/regulatorio-pecuaria-carbono.md). PRELIMINARES — calibrar
// antes de produção. seq = tCO2e/ha/ano; price = R$/tCO2e (mercado voluntário).
const ROUTE_PARAMS: Record<
  RouteId,
  { seq: Range; horizonYears: number; price: Range }
> = {
  // Recuperação de pastagem degradada / manejo → carbono no solo (SOC)
  pasture_regeneration_ilpf: {
    seq: { min: 1, max: 4.4 },
    horizonYears: 10,
    price: { min: 30, max: 80 },
  },
  // Restauração / reflorestamento de áreas abertas
  arr_reforestation: {
    seq: { min: 8, max: 20 },
    horizonYears: 20,
    price: { min: 30, max: 150 },
  },
  // Conservação de mata nativa com risco de conversão
  redd_conservation: {
    seq: { min: 1, max: 6 },
    horizonYears: 30,
    price: { min: 30, max: 90 },
  },
};

function r(range: Range, round = 1): Range {
  const f = (n: number) =>
    round >= 1 ? Math.round(n / round) * round : Math.round(n);
  return { min: f(range.min), max: f(range.max) };
}

/** Área elegível por rota, a partir da composição do uso do solo. */
function eligibleAreaFor(routeId: RouteId, ctx: AnalysisContext): number {
  switch (routeId) {
    case "pasture_regeneration_ilpf": {
      // Quando há sinal de degradação, considera a pastagem como recuperável;
      // senão, uma fração conservadora (manejo melhora parte da área).
      return ctx.degradedPasture ? ctx.pastureHa : ctx.pastureHa * 0.4;
    }
    case "arr_reforestation":
      return ctx.openOrMosaicHa + (ctx.degradedPasture ? ctx.pastureHa * 0.3 : 0);
    case "redd_conservation":
      return ctx.nativeHa;
  }
}

/**
 * Estima a ordem de grandeza econômica da rota principal (top route).
 * Retorna null quando não há área elegível suficiente para estimar.
 */
export function estimateEconomics(
  ctx: AnalysisContext,
  routes: CandidateRoute[],
): EconomicEstimate | null {
  const primary = routes[0];
  if (!primary) return null;

  const params = ROUTE_PARAMS[primary.routeId];
  const eligibleAreaHa = Math.round(eligibleAreaFor(primary.routeId, ctx));
  if (eligibleAreaHa <= 0) return null;

  const annualCreditsTco2e: Range = {
    min: eligibleAreaHa * params.seq.min,
    max: eligibleAreaHa * params.seq.max,
  };
  const annualRevenueBRL: Range = {
    min: annualCreditsTco2e.min * params.price.min,
    max: annualCreditsTco2e.max * params.price.max,
  };
  const grossRevenueHorizonBRL: Range = {
    min: annualRevenueBRL.min * params.horizonYears,
    max: annualRevenueBRL.max * params.horizonYears,
  };

  const assumptions = [
    `Área considerada: ${eligibleAreaHa.toLocaleString("pt-BR")} ha elegíveis para ${primary.routeName.toLowerCase()}.`,
    `Sequestro estimado: ${params.seq.min}–${params.seq.max} tCO₂e por hectare ao ano (faixa conservadora de referência).`,
    `Preço de referência: R$ ${params.price.min}–${params.price.max} por tCO₂e no mercado voluntário (preço volátil).`,
    `Horizonte creditável considerado: ${params.horizonYears} anos.`,
    "Valores brutos, sem descontar custos de projeto, validação, monitoramento e comissões.",
  ];

  return {
    primaryRouteId: primary.routeId,
    primaryRouteName: primary.routeName,
    eligibleAreaHa,
    annualCreditsTco2e: r(annualCreditsTco2e, 1),
    horizonYears: params.horizonYears,
    pricePerTco2eBRL: params.price,
    annualRevenueBRL: r(annualRevenueBRL, 100),
    grossRevenueHorizonBRL: r(grossRevenueHorizonBRL, 1000),
    assumptions,
    disclaimer:
      "Estimativa preliminar de ordem de grandeza, não é uma promessa de receita. " +
      "O número real depende de validação metodológica, custos, preço de mercado e avaliação técnica.",
  };
}
