import type { VeridiaSubmission } from "@/lib/types";

/**
 * Resumo analítico derivado da submissão — calculado uma vez e reutilizado por
 * todas as dimensões do score e pela lógica de rotas.
 */
export interface AnalysisContext {
  areaHa: number;
  biome: string[];
  // Composição do uso do solo (ha)
  nativeHa: number;
  pastureHa: number;
  cropHa: number;
  openOrMosaicHa: number;
  nativeShare: number; // 0..1
  pastureShare: number;
  // Sinais qualitativos
  degradedPasture: boolean;
  hasOpenDegradedArea: boolean;
  hasRelevantNative: boolean;
  // Elegibilidade
  hasLegalObligation: boolean; // TAC / multa / exigência de banco
  ownershipSecure: boolean;
  ownershipComplex: boolean; // arrendamento / inventário / regularização
  historyConsolidated: boolean;
  recentDeforestation: boolean;
  activeCarbonProject: boolean;
  // Sobreposições
  fullProtectedOverlap: boolean; // TI ou UC integral → bloqueio
  partialSensitiveOverlap: boolean;
  // Dados
  carFound: boolean;
  geometryConfirmed: boolean;
  documentsCount: number;
}

const NATIVE_CLASSES = [
  "Formação Florestal",
  "Formação Savânica",
  "Formação Campestre",
];

export function buildContext(sub: VeridiaSubmission): AnalysisContext {
  const enr = sub.enrichment;
  const areaHa = sub.property.totalAreaHa ?? 0;
  const classes = enr?.mapbiomas?.classes ?? [];

  const sumBy = (pred: (c: string) => boolean) =>
    classes.filter((c) => pred(c.class)).reduce((s, c) => s + c.areaHa, 0);

  const nativeHa = sumBy((c) => NATIVE_CLASSES.includes(c));
  const pastureHa = sumBy((c) => c === "Pastagem");
  const cropHa = sumBy((c) => c === "Lavoura Temporária" || c === "Lavoura Perene");
  const openOrMosaicHa = sumBy((c) => c === "Mosaico de Usos" || c === "Área sem uso");

  const denom = areaHa || 1;

  // Sinais de degradação de pastagem vindos da conversa (Etapa 3)
  const degradedPasture = sub.currentUse.some(
    (u) =>
      u.class.toLowerCase().includes("pasto") &&
      ["degradada", "abandonada", "degradacao_inicial"].includes(
        String(u.condition),
      ),
  );

  const obligations = sub.eligibility.environmentalObligations;
  const hasLegalObligation = obligations.some((o) =>
    ["tac", "multa_ambiental", "exigencia_banco"].includes(o),
  );

  const ownership = sub.eligibility.ownership;
  const ownershipSecure = ownership === "escritura_registrada";
  const ownershipComplex =
    ownership === "arrendamento" ||
    ownership === "inventario_sucessao" ||
    ownership === "regularizacao" ||
    ownership === "posse_documentos";

  const historyConsolidated = sub.eligibility.historicalUseDuration === "gt10";

  const overlaps = enr?.overlaps;
  const fullProtectedOverlap = Boolean(
    overlaps?.terraIndigena || overlaps?.ucIntegral,
  );
  const partialSensitiveOverlap = Boolean(
    overlaps?.ucSustentavel || overlaps?.quilombola,
  );

  return {
    areaHa,
    biome: enr?.biome ?? [],
    nativeHa,
    pastureHa,
    cropHa,
    openOrMosaicHa,
    nativeShare: nativeHa / denom,
    pastureShare: pastureHa / denom,
    degradedPasture,
    hasOpenDegradedArea: degradedPasture || openOrMosaicHa > areaHa * 0.05,
    hasRelevantNative: nativeHa >= Math.max(20, areaHa * 0.2),
    hasLegalObligation,
    ownershipSecure,
    ownershipComplex,
    historyConsolidated,
    recentDeforestation: Boolean(enr?.deforestation?.hasRecentAlerts),
    activeCarbonProject: sub.eligibility.activeProjects === "sim",
    fullProtectedOverlap,
    partialSensitiveOverlap,
    carFound: Boolean(sub.property.carNumber),
    geometryConfirmed: Boolean(sub.geometryConfirmation?.confirmed),
    documentsCount: sub.documents.length,
  };
}
