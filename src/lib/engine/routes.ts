import type {
  Adherence,
  CandidateRoute,
  IntentData,
  RouteId,
} from "@/lib/types";
import { ROUTE_LABELS } from "@/lib/copy";
import type { AnalysisContext } from "./context";

const METHODOLOGY_FAMILIES: Record<RouteId, string[]> = {
  arr_reforestation: [
    "Afforestation, Reforestation and Revegetation (ARR)",
    "Restauração de vegetação nativa",
    "Sistemas agroflorestais",
  ],
  redd_conservation: [
    "Redução de emissões por desmatamento evitado (REDD+)",
    "Conservação florestal",
    "Abordagens jurisdicionais ou de projeto",
  ],
  pasture_regeneration_ilpf: [
    "Carbono no solo / manejo de pastagem",
    "Sistemas integrados (ILPF)",
    "Agricultura regenerativa",
  ],
};

function adherenceFromScore(score: number): Adherence {
  if (score >= 70) return "alta";
  if (score >= 45) return "media";
  return "baixa";
}

function nextStep(score: number, ctx: AnalysisContext): CandidateRoute["nextStep"] {
  if (ctx.fullProtectedOverlap || ctx.activeCarbonProject) return "not_recommended";
  if (score >= 70) return "advance_to_detailed_assessment";
  if (score >= 45) return ctx.documentsCount === 0 ? "request_documents" : "human_review";
  return "not_recommended";
}

// ---------------------------------------------------------------------------
// Rota ARR / Restauração / Reflorestamento
// ---------------------------------------------------------------------------
function scoreARR(ctx: AnalysisContext, intent: IntentData) {
  let score = 35;
  const pos: string[] = [];
  const att: string[] = [];
  const crit: string[] = [];

  const wantsRestoration =
    intent.options.includes("plantar_floresta_nativa") ||
    intent.options.includes("sistema_agroflorestal") ||
    intent.options.includes("nao_sei");

  if (wantsRestoration) {
    score += 20;
    pos.push("A intenção informada combina com recuperar ou plantar floresta.");
  }
  if (ctx.hasOpenDegradedArea) {
    score += 20;
    pos.push("A VeridIA identificou áreas abertas ou degradadas com potencial de recuperação.");
  }
  if (ctx.degradedPasture) {
    score += 8;
    pos.push("Há pastagem degradada que pode ser convertida em floresta.");
  }
  if (ctx.historyConsolidated) {
    score += 8;
    pos.push("O uso da área é consolidado há mais de 10 anos.");
  }
  if (ctx.hasLegalObligation) {
    score -= 18;
    att.push("É preciso confirmar se a recuperação não é uma obrigação legal — isso afeta o caráter voluntário.");
  }
  if (ctx.recentDeforestation) {
    score -= 15;
    crit.push("Há indício de desmatamento recente no entorno, que precisa ser esclarecido.");
  }
  if (ctx.areaHa < 50) {
    score -= 10;
    att.push("A área é pequena, o que pode limitar a viabilidade econômica.");
  }
  if (!ctx.ownershipSecure) {
    att.push("Confirmar a titularidade da área fortalece a análise.");
  }
  return { score, pos, att, crit };
}

// ---------------------------------------------------------------------------
// Rota Conservação / REDD
// ---------------------------------------------------------------------------
function scoreREDD(ctx: AnalysisContext, intent: IntentData) {
  let score = 25;
  const pos: string[] = [];
  const att: string[] = [];
  const crit: string[] = [];

  const wantsPreserve = intent.options.includes("preservar_mata");

  if (ctx.hasRelevantNative) {
    score += 25;
    pos.push("A propriedade tem uma área relevante de mata nativa.");
  } else {
    att.push("A área de mata nativa é pequena para uma rota de preservação.");
    score -= 10;
  }
  if (wantsPreserve) {
    score += 18;
    pos.push("A intenção de preservar a mata combina com esta rota.");
  }
  if (ctx.recentDeforestation) {
    score += 12;
    pos.push("Há pressão de desmatamento na região, o que reforça o valor de proteger a mata.");
  } else {
    att.push("Será preciso mostrar que existe risco real de desmatamento para a área se qualificar.");
  }
  if (ctx.nativeShare > 0.5) {
    score += 8;
  }
  if (ctx.hasLegalObligation) {
    score -= 10;
    att.push("Áreas protegidas por obrigação legal têm valor limitado nesta rota.");
  }
  return { score, pos, att, crit };
}

// ---------------------------------------------------------------------------
// Rota Recuperação de pastagem / ILPF / Agricultura regenerativa
// ---------------------------------------------------------------------------
function scorePasture(ctx: AnalysisContext, intent: IntentData) {
  let score = 30;
  const pos: string[] = [];
  const att: string[] = [];
  const crit: string[] = [];

  const wantsPasture =
    intent.options.includes("melhorar_pasto") ||
    intent.options.includes("ilpf");

  if (ctx.pastureShare > 0.3) {
    score += 22;
    pos.push("A pastagem é predominante na propriedade.");
  }
  if (ctx.degradedPasture) {
    score += 18;
    pos.push("Há sinais de degradação na pastagem — exatamente onde há mais a recuperar.");
  }
  if (wantsPasture) {
    score += 18;
    pos.push("A intenção de melhorar o pasto ou integrar lavoura-pecuária-floresta combina com esta rota.");
  }
  if (ctx.areaHa > 500) {
    score += 6;
    pos.push("A escala da área favorece projetos de manejo.");
  }
  att.push("Esta rota costuma exigir dados de manejo, lotação animal e produtividade.");
  if (ctx.pastureShare < 0.15 && !wantsPasture) {
    score -= 15;
  }
  return { score, pos, att, crit };
}

export function buildCandidateRoutes(
  ctx: AnalysisContext,
  intent: IntentData,
): CandidateRoute[] {
  const defs: { id: RouteId; calc: ReturnType<typeof scoreARR> }[] = [
    { id: "arr_reforestation", calc: scoreARR(ctx, intent) },
    { id: "redd_conservation", calc: scoreREDD(ctx, intent) },
    { id: "pasture_regeneration_ilpf", calc: scorePasture(ctx, intent) },
  ];

  const routes: CandidateRoute[] = defs.map(({ id, calc }) => {
    const score = Math.max(0, Math.min(100, Math.round(calc.score)));
    const adherence = adherenceFromScore(score);
    const labels = ROUTE_LABELS[id];
    return {
      routeId: id,
      routeName: labels.public,
      adherence,
      score,
      positiveSignals: calc.pos,
      attentionPoints: calc.att,
      criticalRisks: calc.crit,
      methodologyFamilies: METHODOLOGY_FAMILIES[id],
      userFriendlyExplanation: explanationFor(id, adherence),
      technicalRationale: calc.pos.concat(calc.att),
      nextStep: nextStep(score, ctx),
    };
  });

  return routes.sort((a, b) => b.score - a.score);
}

function explanationFor(id: RouteId, adherence: Adherence): string {
  const base: Record<RouteId, string> = {
    arr_reforestation:
      "Recuperar ou plantar floresta nas áreas abertas pode virar uma fonte de valor pra propriedade.",
    redd_conservation:
      "A mata nativa que você já protege pode ser um ativo — e gerar retorno por mantê-la em pé.",
    pasture_regeneration_ilpf:
      "Melhorar o manejo da pastagem que você já tem pode aumentar a produção e abrir uma nova renda.",
  };
  const tail: Record<Adherence, string> = {
    alta: " Os sinais são fortes pra essa oportunidade.",
    media: " Há valor aqui, mas alguns pontos precisam ser confirmados.",
    baixa: " Por enquanto, essa oportunidade parece menos provável.",
  };
  return base[id] + tail[adherence];
}
