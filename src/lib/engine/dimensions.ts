import type {
  CandidateRoute,
  ClassificationLevel,
  ReadinessScoreDimension,
} from "@/lib/types";
import type { AnalysisContext } from "./context";

/**
 * Cada dimensão recebe pontos de 0 ao seu peso máximo (PRD 02 §8) e uma
 * classificação favorável/atenção/crítico (matriz de elegibilidade §7).
 */

function clamp(v: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(v)));
}

function classify(ratio: number): ClassificationLevel {
  if (ratio >= 0.7) return "favoravel";
  if (ratio >= 0.4) return "atencao";
  return "critico";
}

function dim(
  id: ReadinessScoreDimension["id"],
  name: string,
  maxPoints: number,
  achieved: number,
  rationale: string[],
): ReadinessScoreDimension {
  const pts = clamp(achieved, maxPoints);
  return {
    id,
    name,
    maxPoints,
    achievedPoints: pts,
    classification: classify(pts / maxPoints),
    rationale,
  };
}

export function buildDimensions(
  ctx: AnalysisContext,
  bestRoute: CandidateRoute | undefined,
): ReadinessScoreDimension[] {
  const dims: ReadinessScoreDimension[] = [];

  // 1. Elegibilidade territorial (15)
  {
    let p = 15;
    const r: string[] = [];
    if (ctx.fullProtectedOverlap) {
      p = 2;
      r.push("Sobreposição integral com área protegida (Terra Indígena ou UC de proteção integral).");
    } else if (ctx.partialSensitiveOverlap) {
      p = 9;
      r.push("Há sobreposição parcial com área sensível — precisa de validação técnica.");
    } else {
      r.push("Sem sobreposição com áreas críticas.");
    }
    if (ctx.areaHa < 50) {
      p = Math.min(p, 8);
      r.push("Área pequena para viabilidade econômica.");
    } else {
      r.push("Área suficiente para justificar a análise.");
    }
    dims.push(dim("territorial_eligibility", "Elegibilidade territorial", 15, p, r));
  }

  // 2. Aderência da rota (15)
  {
    const score = bestRoute?.score ?? 0;
    const p = (score / 100) * 15;
    const r = bestRoute
      ? [`Melhor rota identificada: ${bestRoute.routeName} (aderência ${bestRoute.adherence}).`]
      : ["Ainda não foi possível identificar uma rota aderente."];
    dims.push(dim("route_fit", "Aderência da rota", 15, p, r));
  }

  // 3. Histórico de uso (15)
  {
    let p = 9;
    const r: string[] = [];
    if (ctx.historyConsolidated) {
      p = 14;
      r.push("Uso consolidado há mais de 10 anos.");
    } else {
      r.push("Histórico de uso ainda precisa ser confirmado.");
    }
    if (ctx.recentDeforestation) {
      p = 4;
      r.push("Indício de desmatamento recente — ponto crítico.");
    }
    dims.push(dim("land_use_history", "Histórico de uso", 15, p, r));
  }

  // 4. Titularidade e controle (10)
  {
    let p = 6;
    const r: string[] = [];
    if (ctx.ownershipSecure) {
      p = 10;
      r.push("Propriedade com escritura registrada.");
    } else if (ctx.ownershipComplex) {
      p = 5;
      r.push("Situação de posse exige análise (arrendamento, sucessão ou regularização).");
    } else {
      r.push("Titularidade ainda não informada.");
    }
    dims.push(dim("ownership_control", "Titularidade e controle", 10, p, r));
  }

  // 5. Adicionalidade preliminar (15)
  {
    let p = 12;
    const r: string[] = [];
    if (ctx.hasLegalObligation) {
      p = 4;
      r.push("Possível obrigação legal de recuperação — afeta o caráter voluntário da ação.");
    } else {
      r.push("Ação aparentemente voluntária, sem obrigação legal identificada.");
    }
    if (ctx.activeCarbonProject) {
      p = 1;
      r.push("Já existe projeto de carbono ativo na área — risco de dupla contagem.");
    }
    dims.push(dim("preliminary_additionality", "Caráter voluntário", 15, p, r));
  }

  // 6. Qualidade dos dados (10)
  {
    let p = 5;
    const r: string[] = [];
    if (ctx.carFound) {
      p += 2;
      r.push("CAR encontrado.");
    }
    if (ctx.geometryConfirmed) {
      p += 2;
      r.push("Geometria confirmada pelo proprietário.");
    } else {
      r.push("Geometria ainda não confirmada.");
    }
    if (ctx.documentsCount > 0) {
      p += 1;
      r.push(`${ctx.documentsCount} documento(s) enviado(s).`);
    } else {
      r.push("Nenhum documento enviado ainda.");
    }
    dims.push(dim("data_quality", "Qualidade dos dados", 10, p, r));
  }

  // 7. Risco regulatório e reputacional (10)
  {
    let p = 9;
    const r: string[] = [];
    if (ctx.fullProtectedOverlap) {
      p = 1;
      r.push("Sobreposição com área protegida eleva o risco legal e reputacional.");
    } else if (ctx.partialSensitiveOverlap) {
      p = 5;
      r.push("Proximidade de área sensível pede atenção.");
    } else {
      r.push("Sem restrições territoriais relevantes identificadas.");
    }
    if (ctx.ownershipComplex) p = Math.min(p, 6);
    dims.push(dim("regulatory_reputational_risk", "Risco regulatório", 10, p, r));
  }

  // 8. Potencial técnico preliminar (10)
  {
    const score = bestRoute?.score ?? 0;
    let p = (score / 100) * 8;
    const r: string[] = [];
    if (ctx.areaHa > 200) {
      p += 2;
      r.push("Escala favorável ao potencial técnico.");
    }
    r.push(
      bestRoute
        ? `Potencial preliminar concentrado em ${bestRoute.routeName.toLowerCase()}.`
        : "Potencial técnico ainda indefinido.",
    );
    dims.push(dim("technical_potential", "Potencial técnico", 10, p, r));
  }

  return dims;
}
