import type {
  ConfidenceLevel,
  FinalRecommendation,
  PreFeasibilityResult,
  ReadinessScore,
  VeridiaSubmission,
} from "@/lib/types";
import { formatHa } from "@/lib/utils";
import { scoreClassification, SCORE_CLASSIFICATION } from "@/lib/copy";
import { buildContext, type AnalysisContext } from "./context";
import { buildCandidateRoutes } from "./routes";
import { buildDimensions } from "./dimensions";
import { estimateEconomics } from "./economics";

export { buildContext } from "./context";

// ---------------------------------------------------------------------------
// Bloqueio automático (PRD 02 §13)
// ---------------------------------------------------------------------------
function checkBlock(ctx: AnalysisContext): string | null {
  if (ctx.fullProtectedOverlap)
    return "A área se sobrepõe integralmente a uma Terra Indígena ou Unidade de Conservação de proteção integral.";
  if (!ctx.areaHa) return "Não há geometria válida para a propriedade.";
  if (!ctx.geometryConfirmed)
    return "A área da propriedade ainda não foi confirmada.";
  if (ctx.activeCarbonProject)
    return "Já existe um projeto de carbono ativo nesta área.";
  return null;
}

// ---------------------------------------------------------------------------
// Encaminhamento humano (PRD 02 §13)
// ---------------------------------------------------------------------------
function needsHumanReview(ctx: AnalysisContext, total: number): boolean {
  return (
    ctx.areaHa > 50_000 ||
    ctx.ownershipComplex ||
    ctx.partialSensitiveOverlap ||
    (total >= 31 && total <= 60)
  );
}

// ---------------------------------------------------------------------------
// Confiança (PRD 02 §12)
// ---------------------------------------------------------------------------
function assessConfidence(
  ctx: AnalysisContext,
  sub: VeridiaSubmission,
): { level: ConfidenceLevel; rationale: string[] } {
  const rationale: string[] = [];
  let strikes = 0;

  if (!ctx.carFound) {
    strikes += 2;
    rationale.push("CAR não foi encontrado.");
  } else rationale.push("CAR encontrado nas bases públicas.");

  if (!ctx.geometryConfirmed) {
    strikes += 1;
    rationale.push("Área ainda não confirmada pelo proprietário.");
  } else rationale.push("Área confirmada visualmente.");

  if (sub.property.geometrySource === "drawn" || sub.property.geometrySource === "adjusted") {
    strikes += 1;
    rationale.push("Geometria desenhada ou ajustada manualmente.");
  }
  if (ctx.documentsCount === 0) {
    strikes += 1;
    rationale.push("Nenhum documento foi enviado ainda.");
  }
  const naoSei = Object.values(sub.eligibility.conditionalAnswers).filter(
    (v) => v === "nao_sei",
  ).length;
  if (sub.eligibility.historicalUseDuration === "nao_sei" || naoSei > 0) {
    strikes += 1;
    rationale.push("Há respostas em aberto em pontos importantes.");
  }

  const level: ConfidenceLevel =
    strikes >= 3 ? "baixa" : strikes >= 1 ? "media" : "alta";
  return { level, rationale };
}

// ---------------------------------------------------------------------------
// Recomendação final (PRD 02 §17.5)
// ---------------------------------------------------------------------------
function buildRecommendation(
  ctx: AnalysisContext,
  total: number,
  blockReason: string | null,
  human: boolean,
): FinalRecommendation {
  if (blockReason) {
    return {
      decision: "human_review_required",
      userMessage:
        "A VeridIA encontrou uma restrição importante. Este caso precisa de avaliação especializada antes de qualquer recomendação.",
      reason: [blockReason],
      nextSteps: ["Falar com um especialista da VeridIA"],
      cta: "talk_to_specialist",
    };
  }
  if (human) {
    return {
      decision: "human_review_required",
      userMessage:
        "A VeridIA encontrou um caso que merece análise humana. Isso não significa que o projeto não tem potencial, mas que a decisão exige cuidado técnico.",
      reason: [
        ctx.ownershipComplex
          ? "A situação de posse da terra precisa ser avaliada."
          : "Alguns pontos precisam de validação técnica.",
      ],
      nextSteps: [
        "Falar com um especialista da VeridIA",
        "Separar os documentos da propriedade",
      ],
      cta: "talk_to_specialist",
    };
  }
  if (total >= 81) {
    return {
      decision: "advance_to_detailed_assessment",
      userMessage:
        "A VeridIA encontrou uma oportunidade real de gerar valor com a sua terra. O melhor próximo passo é montar a estratégia com um especialista da VeridIA.",
      reason: ["Os principais sinais são positivos."],
      nextSteps: [
        "Falar com um especialista da VeridIA pra desenhar a estratégia",
        "Enviar os documentos da propriedade para refinar a análise",
      ],
      cta: "talk_to_specialist",
    };
  }
  if (total >= 61) {
    return {
      decision: "request_more_data",
      userMessage:
        "Tem valor aqui pra ser destravado. Confirmando alguns dados, a VeridIA fecha a leitura e mostra como transformar isso em oportunidade.",
      reason: ["Há sinais positivos, mas alguns dados precisam ser confirmados."],
      nextSteps: [
        "Enviar a matrícula atualizada do imóvel",
        "Confirmar se existe alguma obrigação de recuperar a área",
      ],
      cta: "upload_documents",
    };
  }
  if (total >= 31) {
    return {
      decision: "request_more_data",
      userMessage:
        "A propriedade pode ter potencial, mas a VeridIA precisa confirmar pontos importantes antes de recomendar avanço.",
      reason: ["Faltam informações para fechar a leitura com segurança."],
      nextSteps: [
        "Enviar os documentos da propriedade",
        "Revisar as respostas em aberto",
      ],
      cta: "upload_documents",
    };
  }
  return {
    decision: "not_recommended",
    userMessage:
      "A VeridIA ainda não vê segurança para recomendar avanço neste momento.",
    reason: ["Os dados disponíveis não sustentam uma recomendação positiva agora."],
    nextSteps: ["Rever os dados informados", "Falar com um especialista se quiser entender melhor"],
    cta: "talk_to_specialist",
  };
}

// ---------------------------------------------------------------------------
// Relatório preliminar — 5 seções na voz da VeridIA (PRD 02 §11, §14)
// ---------------------------------------------------------------------------
function buildReport(
  sub: VeridiaSubmission,
  ctx: AnalysisContext,
  score: ReadinessScore,
  routes: PreFeasibilityResult["candidateRoutes"],
  findings: PreFeasibilityResult["keyFindings"],
  rec: FinalRecommendation,
) {
  const best = routes[0];
  const prop = sub.property;
  const local = [prop.municipality, prop.state].filter(Boolean).join(" / ");

  const executiveSummary =
    `A VeridIA analisou ${prop.propertyName ?? "sua propriedade"}` +
    (local ? ` em ${local}` : "") +
    `, com ${formatHa(ctx.areaHa)} a partir do CAR, dados públicos, imagens de satélite e das suas respostas. ` +
    `A leitura aponta ${SCORE_CLASSIFICATION[score.classification].label.toLowerCase()} ` +
    `para transformar o que a propriedade já tem em valor` +
    (best ? `, principalmente através de ${best.routeName.toLowerCase()}.` : ".");

  const propertyDiagnosis =
    `Bioma: ${ctx.biome.join(", ") || "não identificado"}. ` +
    `Uso predominante: ${
      (sub.enrichment?.mapbiomas?.classes ?? [])
        .slice(0, 3)
        .map((c) => `${c.class} (${formatHa(c.areaHa)})`)
        .join(", ") || "não identificado"
    }. ` +
    (ctx.hasRelevantNative
      ? "A propriedade mantém área relevante de vegetação nativa. "
      : "") +
    (sub.enrichment?.mapbiomas?.historySummary ?? "");

  const candidateRoutesText = routes
    .map(
      (r) =>
        `${r.routeName} — aderência ${r.adherence}. ${r.userFriendlyExplanation}`,
    )
    .join("\n");

  const risksAndGaps =
    `O que precisa de atenção: ${
      findings.attentionPoints.join("; ") || "nada crítico identificado"
    }. ` +
    `Dados que ajudariam a refinar: ${
      findings.missingData.join("; ") || "documentos da propriedade"
    }.`;

  const nextStepsText = `${rec.userMessage} Próximos passos: ${rec.nextSteps.join("; ")}.`;

  return {
    executiveSummary,
    propertyDiagnosis,
    candidateRoutesText,
    risksAndGaps,
    nextStepsText,
    technicalNotes: best
      ? `Rotas metodológicas candidatas (uso técnico, não é validação): ${best.methodologyFamilies.join("; ")}. Esta análise não representa validação metodológica.`
      : undefined,
    generatedAt: new Date().toISOString(),
  };
}

// ===========================================================================
// Orquestrador principal
// ===========================================================================
export function runPreFeasibility(sub: VeridiaSubmission): PreFeasibilityResult {
  const ctx = buildContext(sub);
  const routes = buildCandidateRoutes(ctx, sub.intent);
  const best = routes[0];
  const dimensions = buildDimensions(ctx, best);

  const total = dimensions.reduce((s, d) => s + d.achievedPoints, 0);
  const readinessScore: ReadinessScore = {
    total,
    classification: scoreClassification(total),
    dimensions,
  };

  const blockReason = checkBlock(ctx);
  const human = needsHumanReview(ctx, total);
  const confidence = assessConfidence(ctx, sub);
  const recommendation = buildRecommendation(ctx, total, blockReason, human);

  // Consolidação de findings (PRD §11 itens 4–7)
  const positiveSignals = dedupe(routes.flatMap((r) => r.positiveSignals)).slice(0, 6);
  const attentionPoints = dedupe([
    ...routes.flatMap((r) => r.attentionPoints),
    ...(ctx.ownershipSecure ? [] : ["Confirmar a titularidade da área."]),
  ]).slice(0, 6);
  const criticalRisks = dedupe([
    ...(blockReason ? [blockReason] : []),
    ...routes.flatMap((r) => r.criticalRisks),
  ]).slice(0, 5);
  const missingData = dedupe([
    ctx.documentsCount === 0 ? "Matrícula atualizada do imóvel" : "",
    ctx.documentsCount === 0 ? "CCIR e comprovante de ITR" : "",
    !ctx.ownershipSecure ? "Comprovante de titularidade" : "",
    "Fotos da área (opcional, mas valorizadas)",
  ].filter(Boolean)).slice(0, 5);

  const keyFindings = { positiveSignals, attentionPoints, criticalRisks, missingData };

  const status: PreFeasibilityResult["status"] = blockReason
    ? "needs_human_review"
    : recommendation.decision === "not_recommended"
      ? "not_recommended"
      : recommendation.decision === "human_review_required"
        ? "needs_human_review"
        : "preliminary_ready";

  const report = buildReport(sub, ctx, readinessScore, routes, keyFindings, recommendation);
  const economics = blockReason ? null : estimateEconomics(ctx, routes);

  return {
    submissionId: sub.id,
    status,
    readinessScore,
    candidateRoutes: routes,
    keyFindings,
    confidence,
    recommendation,
    report,
    economics: economics ?? undefined,
    blocked: Boolean(blockReason),
    blockReason: blockReason ?? undefined,
  };
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}
