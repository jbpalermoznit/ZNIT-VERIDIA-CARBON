/**
 * Identidade verbal da VeridIA aplicada à interface (PRD 01 §5).
 * A VeridIA fala em primeira pessoa do produto ("A VeridIA encontrou...").
 * Zero jargão técnico na camada principal.
 */
import type {
  IntentOption,
  RouteId,
  ScoreClassification,
  ClassificationLevel,
  ConfidenceLevel,
  Timeframe,
  OwnershipStatus,
  EnvObligation,
} from "./types";

export const INTENT_LABELS: Record<
  IntentOption,
  { title: string; description: string; emoji: string }
> = {
  plantar_floresta_nativa: {
    title: "Plantar floresta nativa",
    description: "Recuperar áreas com espécies da região",
    emoji: "🌳",
  },
  sistema_agroflorestal: {
    title: "Sistema agroflorestal",
    description: "Plantar árvores junto com cultura ou criação",
    emoji: "🌿",
  },
  ilpf: {
    title: "Integrar lavoura, pecuária e floresta",
    description: "Combinar as três atividades na mesma área",
    emoji: "🐂",
  },
  melhorar_pasto: {
    title: "Melhorar o pasto",
    description: "Recuperar pastagem degradada e melhorar o manejo",
    emoji: "🌾",
  },
  preservar_mata: {
    title: "Preservar mata existente",
    description: "Proteger a área de mata que já tenho",
    emoji: "🌲",
  },
  plantio_comercial: {
    title: "Plantio comercial de árvores",
    description: "Eucalipto, teca e outras para venda futura",
    emoji: "🪵",
  },
  nao_sei: {
    title: "Ainda não sei",
    description: "Quero ver quais são as minhas opções",
    emoji: "💡",
  },
};

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  immediate: "Quero começar agora",
  "6m": "Nos próximos 6 meses",
  "1y": "Dentro de 1 ano",
  no_rush: "Sem pressa",
};

export const OWNERSHIP_LABELS: Record<OwnershipStatus, string> = {
  escritura_registrada: "Sim, com escritura registrada",
  regularizacao: "Sim, em processo de regularização",
  arrendamento: "É arrendada",
  posse_documentos: "Posse com documentos",
  inventario_sucessao: "Está em inventário ou sucessão",
  outros: "Outra situação",
};

export const ENV_OBLIGATION_LABELS: Record<EnvObligation, string> = {
  multa_ambiental: "Multa ambiental",
  tac: "TAC (acordo de ajuste de conduta)",
  exigencia_banco: "Exigência de banco para financiamento",
  compromisso_voluntario: "Compromisso voluntário já firmado",
  nenhuma: "Nenhuma dessas",
};

// Nome público das rotas — sem jargão (REDD/ARR ficam só na camada técnica)
export const ROUTE_LABELS: Record<
  RouteId,
  { public: string; technical: string }
> = {
  arr_reforestation: {
    public: "Restauração e reflorestamento",
    technical: "Restauração / Reflorestamento (ARR)",
  },
  redd_conservation: {
    public: "Preservação de mata",
    technical: "Conservação (REDD / REDD+)",
  },
  pasture_regeneration_ilpf: {
    public: "Recuperação de pastagem e manejo",
    technical: "Recuperação de pastagem / ILPF / Agricultura regenerativa",
  },
};

// Mensagens por faixa de score (PRD 02 §8)
export const SCORE_CLASSIFICATION: Record<
  ScoreClassification,
  { label: string; message: string; range: string }
> = {
  baixa_prontidao: {
    label: "Baixa prontidão",
    range: "0–30",
    message:
      "A VeridIA ainda não vê segurança para recomendar avanço neste momento.",
  },
  prontidao_condicionada: {
    label: "Prontidão condicionada",
    range: "31–60",
    message:
      "A propriedade pode ter potencial, mas a VeridIA precisa confirmar pontos importantes antes de recomendar avanço.",
  },
  bom_potencial_com_ajustes: {
    label: "Bom potencial, com ajustes",
    range: "61–80",
    message:
      "A VeridIA encontrou sinais positivos. O projeto pode avançar para uma análise mais detalhada, desde que alguns dados sejam confirmados.",
  },
  alta_prontidao: {
    label: "Alta prontidão",
    range: "81–100",
    message:
      "A VeridIA encontrou uma oportunidade promissora. O próximo passo recomendado é uma avaliação detalhada com um especialista.",
  },
};

export const CONFIDENCE_LABELS: Record<
  ConfidenceLevel,
  { label: string; message: string }
> = {
  alta: {
    label: "Alta confiança",
    message: "A VeridIA tem boa confiança nesta leitura preliminar.",
  },
  media: {
    label: "Confiança média",
    message:
      "A VeridIA encontrou sinais importantes, mas ainda precisa confirmar algumas informações.",
  },
  baixa: {
    label: "Confiança baixa",
    message:
      "A VeridIA ainda não tem segurança suficiente. Use o resultado apenas como orientação inicial.",
  },
};

export const CLASSIFICATION_META: Record<
  ClassificationLevel,
  { label: string; color: string }
> = {
  favoravel: { label: "Favorável", color: "favoravel" },
  atencao: { label: "Atenção", color: "atencao" },
  critico: { label: "Crítico", color: "critico" },
};

export function scoreClassification(total: number): ScoreClassification {
  if (total <= 30) return "baixa_prontidao";
  if (total <= 60) return "prontidao_condicionada";
  if (total <= 80) return "bom_potencial_com_ajustes";
  return "alta_prontidao";
}
