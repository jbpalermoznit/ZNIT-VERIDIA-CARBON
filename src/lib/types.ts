/**
 * Modelo de dados da VeridIA.
 * Fonte: PRD 01 (§8 Modelo de dados de input) e PRD 02 (§17 Modelos de decisão).
 * Mantemos a nomenclatura dos PRDs para rastreabilidade produto ⇄ código.
 */

// ---------------------------------------------------------------------------
// Geometria (GeoJSON simplificado — não dependemos de @types/geojson)
// ---------------------------------------------------------------------------
export type Position = [number, number]; // [lng, lat]

export interface PolygonGeometry {
  type: "Polygon";
  coordinates: Position[][];
}

export type Geometry = PolygonGeometry;

export type GeometrySource = "car" | "drawn" | "uploaded" | "adjusted";

// ---------------------------------------------------------------------------
// Etapa 1 — Propriedade
// ---------------------------------------------------------------------------
export interface PropertyData {
  carNumber?: string;
  propertyName?: string;
  municipality?: string;
  state?: string;
  geometry?: Geometry;
  geometrySource?: GeometrySource;
  totalAreaHa?: number;
  centroid?: Position; // [lng, lat], usado para centralizar o mapa
}

// ---------------------------------------------------------------------------
// Enriquecimento automático (o que a VeridIA descobre sozinha)
// ---------------------------------------------------------------------------
export interface LandUseClass {
  class: string; // ex.: "Pastagem", "Formação Florestal", "Lavoura"
  areaHa: number;
}

export interface EnrichmentData {
  sicar?: {
    appHa: number;
    rlHa: number;
    consolidatedHa: number;
    status: string; // "Ativo", "Pendente", etc.
  };
  mapbiomas?: {
    year: number;
    classes: LandUseClass[];
    historySummary?: string;
  };
  biome: string[];
  overlaps: {
    ucIntegral: boolean; // Unidade de Conservação de proteção integral
    ucSustentavel: boolean;
    terraIndigena: boolean;
    quilombola: boolean;
  };
  deforestation?: {
    hasRecentAlerts: boolean;
    lastAlertYear?: number;
    note?: string;
  };
  confidence: ConfidenceLevel;
  sources: DataSource[]; // transparência da fonte (princípio de design 6)
}

export interface DataSource {
  name: string; // "SICAR", "MapBiomas Coleção 9", ...
  detail: string;
  retrievedAt: string; // ISO
  status: "ok" | "cache" | "indisponivel";
}

// ---------------------------------------------------------------------------
// Etapa 2 — Confirmação da geometria
// ---------------------------------------------------------------------------
export interface GeometryConfirmation {
  confirmed: boolean;
  adjustments?: "added" | "removed" | "both";
}

// ---------------------------------------------------------------------------
// Etapa 3 — Uso atual
// ---------------------------------------------------------------------------
export type PastureCondition =
  | "bem_manejada"
  | "degradacao_inicial"
  | "degradada"
  | "abandonada";

export interface CurrentUseEntry {
  class: string; // tipo de uso (pastagem, lavoura, mata nativa, área aberta)
  areaHa: number;
  condition?: string; // estado (depende do tipo)
  yearsInCondition?: string;
  extra?: Record<string, string | number | boolean>;
}

// ---------------------------------------------------------------------------
// Etapa 4 — Intenção
// ---------------------------------------------------------------------------
export type IntentOption =
  | "plantar_floresta_nativa"
  | "sistema_agroflorestal"
  | "ilpf"
  | "melhorar_pasto"
  | "preservar_mata"
  | "plantio_comercial"
  | "nao_sei";

export type Timeframe = "immediate" | "6m" | "1y" | "no_rush";

export interface IntentData {
  options: IntentOption[];
  timeframe?: Timeframe;
}

// ---------------------------------------------------------------------------
// Etapa 5 — Elegibilidade
// ---------------------------------------------------------------------------
export type OwnershipStatus =
  | "escritura_registrada"
  | "regularizacao"
  | "arrendamento"
  | "posse_documentos"
  | "inventario_sucessao"
  | "outros";

export type HistoricalUseDuration = "lt5" | "5_10" | "gt10" | "nao_sei";

export type EnvObligation =
  | "multa_ambiental"
  | "tac"
  | "exigencia_banco"
  | "compromisso_voluntario"
  | "nenhuma";

export interface EligibilityData {
  ownership?: OwnershipStatus;
  historicalUseDuration?: HistoricalUseDuration;
  environmentalObligations: EnvObligation[];
  activeProjects?: "sim" | "nao" | "nao_sei";
  activeProjectsDetail?: string;
  conditionalAnswers: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Etapa 6 — Documentos
// ---------------------------------------------------------------------------
export interface DocumentEntry {
  type: string;
  fileName: string;
  fileUrl?: string;
  extractedData?: Record<string, string>;
  confirmedByUser: boolean;
  uploadedAt: string;
}

// ---------------------------------------------------------------------------
// Submissão completa
// ---------------------------------------------------------------------------
export type SubmissionStatus =
  | "em_andamento"
  | "preliminar_pronto"
  | "refinado_pronto";

export interface VeridiaSubmission {
  id: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  currentStep: number; // 1..6
  property: PropertyData;
  enrichment?: EnrichmentData;
  geometryConfirmation?: GeometryConfirmation;
  currentUse: CurrentUseEntry[];
  intent: IntentData;
  eligibility: EligibilityData;
  documents: DocumentEntry[];
  result?: PreFeasibilityResult;
  /** Revisão do especialista (backoffice, PRD 02 §16). */
  expert?: {
    note?: string;
    decision?: "aprovado" | "ajustar" | "nao_recomendado" | "encaminhar_comercial";
    scoreOverride?: number;
    updatedAt?: string;
  };
}

export function emptySubmission(id: string): VeridiaSubmission {
  const now = new Date().toISOString();
  return {
    id,
    status: "em_andamento",
    createdAt: now,
    updatedAt: now,
    currentStep: 1,
    property: {},
    currentUse: [],
    intent: { options: [] },
    eligibility: { environmentalObligations: [], conditionalAnswers: {} },
    documents: [],
  };
}

// ===========================================================================
// PRD 02 — Resultado de pré-viabilidade
// ===========================================================================
export type ConfidenceLevel = "alta" | "media" | "baixa";

export type RouteId =
  | "arr_reforestation"
  | "redd_conservation"
  | "pasture_regeneration_ilpf";

export type Adherence = "alta" | "media" | "baixa";

export type ClassificationLevel = "favoravel" | "atencao" | "critico";

export type ScoreClassification =
  | "baixa_prontidao"
  | "prontidao_condicionada"
  | "bom_potencial_com_ajustes"
  | "alta_prontidao";

export type DimensionId =
  | "territorial_eligibility"
  | "route_fit"
  | "land_use_history"
  | "ownership_control"
  | "preliminary_additionality"
  | "data_quality"
  | "regulatory_reputational_risk"
  | "technical_potential";

export interface ReadinessScoreDimension {
  id: DimensionId;
  name: string;
  maxPoints: number;
  achievedPoints: number;
  classification: ClassificationLevel;
  rationale: string[];
}

export interface ReadinessScore {
  total: number;
  classification: ScoreClassification;
  dimensions: ReadinessScoreDimension[];
}

export interface CandidateRoute {
  routeId: RouteId;
  routeName: string;
  adherence: Adherence;
  score: number;
  positiveSignals: string[];
  attentionPoints: string[];
  criticalRisks: string[];
  methodologyFamilies: string[];
  userFriendlyExplanation: string;
  technicalRationale: string[];
  nextStep:
    | "advance_to_detailed_assessment"
    | "request_documents"
    | "human_review"
    | "not_recommended";
}

export type RecommendationDecision =
  | "advance_to_detailed_assessment"
  | "request_more_data"
  | "human_review_required"
  | "not_recommended";

export interface FinalRecommendation {
  decision: RecommendationDecision;
  userMessage: string;
  reason: string[];
  nextSteps: string[];
  cta: "upload_documents" | "talk_to_specialist" | "adjust_area" | "finish";
}

export type ResultStatus =
  | "draft"
  | "preliminary_ready"
  | "needs_human_review"
  | "not_recommended";

export interface PreFeasibilityResult {
  submissionId: string;
  status: ResultStatus;
  readinessScore: ReadinessScore;
  candidateRoutes: CandidateRoute[];
  keyFindings: {
    positiveSignals: string[];
    attentionPoints: string[];
    criticalRisks: string[];
    missingData: string[];
  };
  confidence: {
    level: ConfidenceLevel;
    rationale: string[];
  };
  recommendation: FinalRecommendation;
  report: {
    executiveSummary: string;
    propertyDiagnosis: string;
    candidateRoutesText: string;
    risksAndGaps: string;
    nextStepsText: string;
    technicalNotes?: string;
    generatedAt: string;
  };
  /** Sinaliza bloqueio automático (TI/UC integral, sem geometria, etc.) */
  blocked: boolean;
  blockReason?: string;
}
