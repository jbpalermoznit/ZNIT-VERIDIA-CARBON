"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { SCORE_CLASSIFICATION, CONFIDENCE_LABELS } from "@/lib/copy";
import { formatHa, formatBRLRange, formatNumberRange } from "@/lib/utils";
import type { VeridiaSubmission, PreFeasibilityResult } from "@/lib/types";

const BRAND = "#56B7A5";
const INK = "#1c1c1e";
const MUTED = "#6b7280";

const s = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, fontSize: 10, color: INK, fontFamily: "Helvetica", lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 2, borderBottomColor: BRAND, paddingBottom: 8, marginBottom: 16 },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", color: INK },
  brandIA: { color: BRAND },
  docType: { fontSize: 9, color: MUTED, textAlign: "right" },
  h1: { fontSize: 14, fontFamily: "Helvetica-Bold", color: INK, marginTop: 18, marginBottom: 6 },
  propLine: { fontSize: 10, color: MUTED, marginBottom: 2 },
  scoreBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#E6F3EE", borderRadius: 8, padding: 14, marginBottom: 8 },
  scoreNum: { fontSize: 34, fontFamily: "Helvetica-Bold", color: BRAND, marginRight: 14 },
  scoreLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: INK },
  p: { marginBottom: 4 },
  routeRow: { borderLeftWidth: 3, borderLeftColor: BRAND, paddingLeft: 8, marginBottom: 8 },
  routeName: { fontFamily: "Helvetica-Bold" },
  adher: { fontSize: 8, color: MUTED },
  bullet: { flexDirection: "row", marginBottom: 2 },
  bulletDot: { width: 10, color: BRAND },
  econGrid: { flexDirection: "row", gap: 8, marginBottom: 8 },
  econCard: { flex: 1, backgroundColor: "#E6F3EE", borderRadius: 6, padding: 8 },
  econLabel: { fontSize: 8, color: MUTED },
  econValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: BRAND },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, fontSize: 7.5, color: MUTED, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 6 },
});

function Bullets({ items, mark = "•" }: { items: string[]; mark?: string }) {
  return (
    <View>
      {items.map((it, i) => (
        <View key={i} style={s.bullet}>
          <Text style={s.bulletDot}>{mark}</Text>
          <Text style={{ flex: 1 }}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

export function ReportPdfDoc({
  submission,
  result,
}: {
  submission: VeridiaSubmission;
  result: PreFeasibilityResult;
}) {
  const prop = submission.property;
  const sc = result.readinessScore;
  const cls = SCORE_CLASSIFICATION[sc.classification];
  const best = result.candidateRoutes[0];
  const econ = result.economics;
  const showEcon = Boolean(econ && submission.lead);
  const date = new Date(result.report.generatedAt || submission.updatedAt).toLocaleDateString("pt-BR");

  return (
    <Document title={`VeridIA — ${prop.propertyName ?? "Relatório"}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          <Text style={s.brand}>Verid<Text style={s.brandIA}>IA</Text></Text>
          <Text style={s.docType}>Relatório de Pré-Viabilidade{"\n"}Pecuária a pasto · {date}</Text>
        </View>

        {/* Resumo executivo */}
        <Text style={s.h1}>1. Resumo</Text>
        <Text style={s.propLine}>{prop.propertyName ?? "Propriedade"}</Text>
        <Text style={s.propLine}>
          {prop.totalAreaHa ? formatHa(prop.totalAreaHa) : "—"}
          {prop.municipality ? ` · ${prop.municipality}/${prop.state}` : ""}
          {result.confidence ? ` · Confiança ${result.confidence.level}` : ""}
        </Text>
        <View style={s.scoreBox}>
          <Text style={s.scoreNum}>{sc.total}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.scoreLabel}>{cls.label}</Text>
            <Text>{cls.message}</Text>
          </View>
        </View>
        <Text style={s.p}>{result.report.executiveSummary}</Text>

        {/* Diagnóstico */}
        <Text style={s.h1}>2. Diagnóstico da propriedade</Text>
        <Text style={s.p}>{result.report.propertyDiagnosis}</Text>

        {/* Oportunidades */}
        <Text style={s.h1}>3. Oportunidades identificadas</Text>
        {result.candidateRoutes.map((r) => (
          <View key={r.routeId} style={s.routeRow}>
            <Text style={s.routeName}>{r.routeName} <Text style={s.adher}>· aderência {r.adherence}</Text></Text>
            <Text>{r.userFriendlyExplanation}</Text>
          </View>
        ))}

        {/* Econômico */}
        {showEcon && econ && (
          <>
            <Text style={s.h1}>4. Estimativa econômica preliminar</Text>
            <View style={s.econGrid}>
              <View style={s.econCard}>
                <Text style={s.econLabel}>Receita potencial / ano</Text>
                <Text style={s.econValue}>{formatBRLRange(econ.annualRevenueBRL.min, econ.annualRevenueBRL.max)}</Text>
              </View>
              <View style={s.econCard}>
                <Text style={s.econLabel}>Acumulado em {econ.horizonYears} anos</Text>
                <Text style={s.econValue}>{formatBRLRange(econ.grossRevenueHorizonBRL.min, econ.grossRevenueHorizonBRL.max)}</Text>
              </View>
              <View style={s.econCard}>
                <Text style={s.econLabel}>Créditos / ano</Text>
                <Text style={s.econValue}>{formatNumberRange(econ.annualCreditsTco2e.min, econ.annualCreditsTco2e.max, "tCO2e")}</Text>
              </View>
            </View>
            <Bullets items={econ.assumptions} />
            <Text style={{ fontSize: 8, color: MUTED, marginTop: 4 }}>{econ.disclaimer}</Text>
          </>
        )}

        {/* Riscos e próximos passos */}
        <Text style={s.h1}>{showEcon ? "5" : "4"}. Pontos de atenção e próximos passos</Text>
        {result.keyFindings.attentionPoints.length > 0 && (
          <>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 2 }}>O que precisa de atenção</Text>
            <Bullets items={result.keyFindings.attentionPoints} mark="!" />
          </>
        )}
        <Text style={{ fontFamily: "Helvetica-Bold", marginTop: 6, marginBottom: 2 }}>Próximos passos</Text>
        <Bullets items={result.recommendation.nextSteps} mark="→" />

        <Text style={s.footer} fixed>
          A VeridIA é uma ferramenta de triagem preliminar e não substitui análise técnica,
          validação por certificadora ou parecer jurídico. Relatório gerado pela VeridIA · uma plataforma ZNIT.
        </Text>
      </Page>
    </Document>
  );
}
