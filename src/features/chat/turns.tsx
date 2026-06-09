"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MapLoader } from "@/components/map/MapLoader";
import { geoProvider } from "@/data/mockProvider";
import {
  buildPolygon,
  centroidOf,
  polygonAreaHa,
  seededRandom,
  STATE_CENTERS,
} from "@/data/geo";
import {
  INTENT_LABELS,
  TIMEFRAME_LABELS,
  OWNERSHIP_LABELS,
  ENV_OBLIGATION_LABELS,
} from "@/lib/copy";
import { formatHa } from "@/lib/utils";
import type {
  CurrentUseEntry,
  EnvObligation,
  Geometry,
  IntentOption,
  OwnershipStatus,
  Position,
  VeridiaSubmission,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Tipo de turno da conversa
// ---------------------------------------------------------------------------
export interface TurnInputProps {
  sub: VeridiaSubmission;
  commit: (next: VeridiaSubmission) => void;
}

export interface Turn {
  id: string;
  answered: (s: VeridiaSubmission) => boolean;
  veridia: (s: VeridiaSubmission) => React.ReactNode;
  summary: (s: VeridiaSubmission) => string;
  Input: React.FC<TurnInputProps>;
}

// upsert de uma entrada de uso atual por classe
function upsertUse(
  sub: VeridiaSubmission,
  entry: CurrentUseEntry,
): VeridiaSubmission {
  const rest = sub.currentUse.filter((u) => u.class !== entry.class);
  return { ...sub, currentUse: [...rest, entry] };
}

// mescla campos em `extra` da entrada de Pastagem, preservando condição/área
function setPastureExtra(
  sub: VeridiaSubmission,
  pastureHa: number,
  extra: Record<string, string | number | boolean>,
): VeridiaSubmission {
  const cur = sub.currentUse.find((u) => u.class === "Pastagem");
  return upsertUse(sub, {
    class: "Pastagem",
    areaHa: cur?.areaHa ?? pastureHa,
    condition: cur?.condition,
    yearsInCondition: cur?.yearsInCondition,
    extra: { ...(cur?.extra ?? {}), ...extra },
  });
}

// =====================================================================
// Widgets de resposta reutilizáveis
// =====================================================================
function Chips<T extends string>({
  options,
  onPick,
}: {
  options: { value: T; label: string }[];
  onPick: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onPick(o.value)}
          className="rounded-full border-2 border-ink-300/60 px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-500 hover:bg-brand-100 hover:text-brand-600"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Cards<T extends string>({
  options,
  multi,
  onConfirm,
}: {
  options: { value: T; label: string; desc?: string; emoji?: string }[];
  multi?: boolean;
  onConfirm: (v: T[]) => void;
}) {
  const [sel, setSel] = useState<T[]>([]);
  function toggle(v: T) {
    if (!multi) {
      onConfirm([v]);
      return;
    }
    setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const active = sel.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => toggle(o.value)}
              className={
                "flex items-start gap-3 rounded-2xl border-2 p-3 text-left transition " +
                (active
                  ? "border-brand-500 bg-brand-100"
                  : "border-ink-300/50 hover:border-brand-400")
              }
            >
              {o.emoji && <span className="text-xl">{o.emoji}</span>}
              <span className="flex-1">
                <span className="block text-sm font-semibold text-ink-900">{o.label}</span>
                {o.desc && <span className="block text-xs text-ink-500">{o.desc}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {multi && (
        <Button onClick={() => onConfirm(sel)} disabled={sel.length === 0}>
          Pronto
        </Button>
      )}
    </div>
  );
}

function TextAnswer({
  placeholder,
  onConfirm,
  allowSkip,
  multiline,
}: {
  placeholder: string;
  onConfirm: (v: string) => void;
  allowSkip?: boolean;
  multiline?: boolean;
}) {
  const [v, setV] = useState("");
  return (
    <div className="space-y-2">
      {multiline ? (
        <textarea
          rows={2}
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      ) : (
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && v.trim() && onConfirm(v.trim())}
          className="w-full rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      )}
      <div className="flex gap-2">
        <Button onClick={() => onConfirm(v.trim())} disabled={!v.trim()}>
          Continuar
        </Button>
        {allowSkip && (
          <button
            onClick={() => onConfirm("")}
            className="text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            Não sei / pular
          </button>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// CAR — busca da propriedade
// =====================================================================
function CarInput({ sub, commit }: TurnInputProps) {
  const [car, setCar] = useState("");
  const [phase, setPhase] = useState<"input" | "busy" | "notfound">("input");
  const [showAlt, setShowAlt] = useState(false);
  const [doc, setDoc] = useState("");
  const [docResults, setDocResults] = useState<
    { carNumber: string; municipality: string; areaHa: number }[] | null
  >(null);

  const CAR_RE = /^[A-Z]{2}-?\d{7}-?[0-9A-F.]{4,}$/i;
  const valid = CAR_RE.test(car.trim());

  async function search(carNumber: string) {
    setPhase("busy");
    const res = await geoProvider.lookupCAR(carNumber);
    if (!res.found || !res.property) {
      setPhase("notfound");
      return;
    }
    const p = res.property;
    const enrichment = await geoProvider.enrich(p.geometry, p.centroid, p.state);
    if (res.sicar) enrichment.sicar = res.sicar;
    commit({
      ...sub,
      currentStep: 2,
      property: {
        carNumber: p.carNumber,
        propertyName: p.propertyName,
        municipality: p.municipality,
        state: p.state,
        geometry: p.geometry,
        geometrySource: "car",
        totalAreaHa: p.totalAreaHa,
        centroid: p.centroid,
      },
      enrichment,
    });
  }

  function startDraw() {
    commit({
      ...sub,
      currentStep: 2,
      property: {
        ...sub.property,
        geometrySource: "drawn",
        state: "MT",
        municipality: "A confirmar",
        centroid: STATE_CENTERS.MT.center,
      },
    });
  }

  async function acceptUpload(file: File) {
    setPhase("busy");
    const rand = seededRandom(file.size || 1);
    const center: Position = [
      STATE_CENTERS.MT.center[0] + (rand() - 0.5) * 2,
      STATE_CENTERS.MT.center[1] + (rand() - 0.5) * 2,
    ];
    const geometry = buildPolygon(center, 300 + rand() * 600, rand);
    const centroid = centroidOf(geometry);
    const enrichment = await geoProvider.enrich(geometry, centroid, "MT");
    commit({
      ...sub,
      currentStep: 2,
      property: {
        ...sub.property,
        geometry,
        geometrySource: "uploaded",
        state: "MT",
        municipality: "A confirmar",
        centroid,
        totalAreaHa: Math.round(polygonAreaHa(geometry)),
      },
      enrichment,
    });
  }

  if (phase === "busy") {
    return (
      <div className="flex items-center gap-2 text-sm text-brand-600">
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-500" />
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-500" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-500" style={{ animationDelay: "300ms" }} />
        </span>
        A VeridIA está buscando os dados da sua propriedade...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        value={car}
        onChange={(e) => setCar(e.target.value.toUpperCase())}
        placeholder="Ex.: MT-5103403-A1B2C3D4"
        className="w-full rounded-xl border-2 border-ink-300/60 px-4 py-3 font-mono text-sm outline-none focus:border-brand-500"
      />
      {phase === "notfound" && (
        <p className="text-sm text-atencao">
          A VeridIA não encontrou esse CAR. Vamos tentar de outro jeito?
        </p>
      )}
      <p className="text-xs text-ink-500">
        Dica: use <code className="rounded bg-brand-100 px-1">MT-5103403-A1B2C3D4</code> para ver a VeridIA em ação.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!valid} onClick={() => search(car.trim())}>
          Buscar minha propriedade
        </Button>
        <button
          onClick={() => setShowAlt((v) => !v)}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          Não sei meu número do CAR
        </button>
      </div>

      {showAlt && (
        <div className="card space-y-4 p-4">
          <div>
            <p className="text-sm font-semibold text-ink-900">Buscar por CPF ou CNPJ</p>
            <div className="mt-2 flex gap-2">
              <input
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                placeholder="CPF ou CNPJ"
                className="flex-1 rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <Button
                variant="subtle"
                onClick={async () => setDocResults(await geoProvider.lookupByDocument(doc))}
                disabled={!doc}
              >
                Buscar
              </Button>
            </div>
            {docResults?.map((r) => (
              <button
                key={r.carNumber}
                onClick={() => search(r.carNumber)}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-ink-300/50 px-3 py-2 text-left text-sm hover:border-brand-500"
              >
                <span className="font-mono">{r.carNumber}</span>
                <span className="text-ink-500">{r.municipality} · {formatHa(r.areaHa)}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-ink-300/40 pt-3">
            <Button variant="ghost" onClick={startDraw}>Desenhar no mapa</Button>
            <label className="btn-ghost cursor-pointer">
              Enviar KML/Shapefile
              <input
                type="file"
                accept=".kml,.kmz,.zip,.shp,.geojson"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) acceptUpload(f);
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Mapa — confirmação / desenho
// =====================================================================
function MapInput({ sub, commit }: TurnInputProps) {
  const prop = sub.property;
  const hasGeometry = Boolean(prop.geometry);
  const [drawing, setDrawing] = useState(!hasGeometry);
  const [draft, setDraft] = useState<Position[]>([]);
  const [working, setWorking] = useState(false);
  const centroid: Position = prop.centroid ?? STATE_CENTERS.MT.center;

  async function finishDraw() {
    if (draft.length < 3) return;
    setWorking(true);
    const ring = [...draft, draft[0]];
    const geometry: Geometry = { type: "Polygon", coordinates: [ring] };
    const center = centroidOf(geometry);
    const enrichment =
      sub.enrichment ?? (await geoProvider.enrich(geometry, center, prop.state ?? "MT"));
    setWorking(false);
    setDrawing(false);
    commit({
      ...sub,
      property: {
        ...prop,
        geometry,
        geometrySource: hasGeometry ? "adjusted" : "drawn",
        totalAreaHa: Math.round(polygonAreaHa(geometry)),
        centroid: center,
      },
      enrichment,
    });
    setDraft([]);
  }

  async function confirm(adjusted: boolean) {
    let enrichment = sub.enrichment;
    if (!enrichment && prop.geometry) {
      setWorking(true);
      enrichment = await geoProvider.enrich(prop.geometry, centroid, prop.state ?? "MT");
      setWorking(false);
    }
    commit({
      ...sub,
      currentStep: 3,
      enrichment,
      geometryConfirmation: { confirmed: true, adjustments: adjusted ? "both" : undefined },
    });
  }

  const sicar = sub.enrichment?.sicar;

  return (
    <div className="space-y-3">
      <div className="h-[48vh] min-h-[320px] w-full">
        <MapLoader
          geometry={prop.geometry}
          centroid={centroid}
          drawing={drawing}
          draftPoints={draft}
          onAddPoint={(p) => setDraft((d) => [...d, p])}
        />
      </div>

      {sicar && !drawing && (
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-brand-100 p-3 text-sm sm:grid-cols-4">
          <Metric label="Área total" v={formatHa(prop.totalAreaHa ?? 0)} />
          <Metric label="Uso consolidado" v={formatHa(sicar.consolidatedHa)} />
          <Metric label="Reserva Legal" v={formatHa(sicar.rlHa)} />
          <Metric label="Preservação (APP)" v={formatHa(sicar.appHa)} />
          <p className="col-span-full text-xs text-ink-500">Fonte: SICAR ({sicar.status})</p>
        </div>
      )}

      {drawing ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={finishDraw} disabled={draft.length < 3 || working}>
            {working ? "Calculando..." : `Concluir desenho (${draft.length})`}
          </Button>
          {draft.length > 0 && (
            <button onClick={() => setDraft((d) => d.slice(0, -1))} className="text-sm text-ink-500 hover:text-ink-900">
              Desfazer ponto
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => confirm(false)} disabled={working}>
            {working ? "Confirmando..." : "Sim, é essa área"}
          </Button>
          <Button variant="ghost" onClick={() => { setDrawing(true); setDraft([]); }}>
            Preciso ajustar
          </Button>
        </div>
      )}
    </div>
  );
}

function Metric({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <span className="block text-xs text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{v}</span>
    </div>
  );
}

// =====================================================================
// Construção da lista de turnos (dinâmica, derivada da submissão)
// =====================================================================
const PASTURE_OPTS = [
  { value: "bem_manejada", label: "Bem manejada" },
  { value: "degradacao_inicial", label: "Começando a degradar" },
  { value: "degradada", label: "Degradada" },
  { value: "abandonada", label: "Abandonada / sem uso" },
] as const;

export function buildTurns(sub: VeridiaSubmission): Turn[] {
  const turns: Turn[] = [];

  // --- CAR ---
  turns.push({
    id: "car",
    answered: (s) => Boolean(s.property.geometrySource),
    veridia: () => (
      <>
        <p className="font-semibold">Oi! Eu sou a VeridIA.</p>
        <p className="mt-1 text-sm">
          Vou olhar a sua terra e te mostrar onde o que você já faz hoje pode
          virar valor. Pra começar, qual é o número do seu CAR?
        </p>
      </>
    ),
    summary: (s) =>
      s.property.carNumber
        ? `Meu CAR é ${s.property.carNumber}`
        : "Vou indicar a área de outro jeito",
    Input: CarInput,
  });

  // --- Mapa ---
  if (sub.property.geometrySource) {
    turns.push({
      id: "mapa",
      answered: (s) => Boolean(s.geometryConfirmation?.confirmed),
      veridia: (s) =>
        s.property.geometry ? (
          <p className="text-sm">
            Achei sua propriedade
            {s.property.municipality && s.property.municipality !== "A confirmar"
              ? ` em ${s.property.municipality}/${s.property.state}`
              : ""}
            . Dá uma olhada no mapa e confirma se é essa mesmo.
          </p>
        ) : (
          <p className="text-sm">
            Marque os cantos da sua área tocando no mapa. Quando fechar, eu
            calculo o tamanho.
          </p>
        ),
      summary: (s) =>
        `Confirmei a área de ${formatHa(s.property.totalAreaHa ?? 0)}`,
      Input: MapInput,
    });
  }

  // --- Uso atual (dinâmico por categoria) ---
  if (sub.enrichment?.mapbiomas?.classes?.length) {
    const classes = sub.enrichment.mapbiomas.classes;
    const sum = (pred: (c: string) => boolean) =>
      classes.filter((c) => pred(c.class.toLowerCase())).reduce((a, c) => a + c.areaHa, 0);
    const pastureHa = sum((c) => c.includes("pastagem"));
    const cropHa = sum((c) => c.includes("lavoura"));
    const nativeHa = sum((c) => c.includes("formação") || c.includes("floresta"));

    if (pastureHa > 0) {
      turns.push({
        id: "uso_pasto",
        answered: (s) => s.currentUse.some((u) => u.class === "Pastagem" && !!u.condition),
        veridia: () => (
          <p className="text-sm">
            Vi <strong>{formatHa(pastureHa)} de pastagem</strong> na sua área.
            Como ela está hoje?
          </p>
        ),
        summary: (s) =>
          PASTURE_OPTS.find((o) => o.value === s.currentUse.find((u) => u.class === "Pastagem")?.condition)?.label ?? "—",
        Input: ({ sub: s, commit }) => (
          <Cards
            options={PASTURE_OPTS.map((o) => ({ value: o.value, label: o.label }))}
            onConfirm={(v) =>
              commit(upsertUse(s, { class: "Pastagem", areaHa: pastureHa, condition: v[0] }))
            }
          />
        ),
      });

      // Pecuária — rebanho
      turns.push({
        id: "uso_gado",
        answered: (s) =>
          "herd" in (s.currentUse.find((u) => u.class === "Pastagem")?.extra ?? {}),
        veridia: () => (
          <p className="text-sm">
            Tem gado nessa área hoje? Mais ou menos quantas cabeças?
          </p>
        ),
        summary: (s) => {
          const h = s.currentUse.find((u) => u.class === "Pastagem")?.extra?.herd;
          return !h || h === "—" ? "Não sei dizer" : `Cerca de ${h} cabeças`;
        },
        Input: ({ sub: s, commit }) => (
          <TextAnswer
            placeholder="Ex.: 800"
            allowSkip
            onConfirm={(v) => commit(setPastureExtra(s, pastureHa, { herd: v || "—" }))}
          />
        ),
      });

      // Pecuária — tipo de pastejo
      turns.push({
        id: "uso_pastejo",
        answered: (s) =>
          "grazing" in (s.currentUse.find((u) => u.class === "Pastagem")?.extra ?? {}),
        veridia: () => <p className="text-sm">E como é o manejo do pasto?</p>,
        summary: (s) => {
          const g = s.currentUse.find((u) => u.class === "Pastagem")?.extra?.grazing;
          return g === "rotacionado"
            ? "Pastejo rotacionado"
            : g === "continuo"
              ? "Pastejo contínuo"
              : "Não sei";
        },
        Input: ({ sub: s, commit }) => (
          <Cards
            options={[
              { value: "rotacionado", label: "Rotacionado", desc: "Divido em piquetes / faço rodízio" },
              { value: "continuo", label: "Contínuo", desc: "O gado fica solto na mesma área" },
              { value: "nao_sei", label: "Não sei" },
            ]}
            onConfirm={(v) => commit(setPastureExtra(s, pastureHa, { grazing: v[0] }))}
          />
        ),
      });
    }

    if (nativeHa > 0) {
      turns.push({
        id: "uso_mata",
        answered: (s) => s.currentUse.some((u) => u.class === "Mata nativa" && !!u.condition),
        veridia: () => (
          <p className="text-sm">
            Você tem <strong>{formatHa(nativeHa)} de mata nativa</strong>. Como
            ela está?
          </p>
        ),
        summary: (s) => {
          const c = s.currentUse.find((u) => u.class === "Mata nativa")?.condition;
          return c === "conservada" ? "Está conservada" : c === "ameacada" ? "Tem ameaças no entorno" : "Não sei dizer";
        },
        Input: ({ sub: s, commit }) => (
          <Cards
            options={[
              { value: "conservada", label: "Conservada" },
              { value: "ameacada", label: "Com ameaças no entorno" },
              { value: "nao_sei", label: "Não sei" },
            ]}
            onConfirm={(v) =>
              commit(upsertUse(s, { class: "Mata nativa", areaHa: nativeHa, condition: v[0] }))
            }
          />
        ),
      });
    }

    if (cropHa > 0) {
      turns.push({
        id: "uso_lavoura",
        answered: (s) => s.currentUse.some((u) => u.class === "Lavoura"),
        veridia: () => (
          <p className="text-sm">
            Na lavoura ({formatHa(cropHa)}), você já usa plantio direto ou
            práticas de conservação do solo?
          </p>
        ),
        summary: (s) => {
          const e = s.currentUse.find((u) => u.class === "Lavoura")?.extra?.plantioDireto;
          return e === "sim" ? "Uso plantio direto" : e === "nao" ? "Sistema convencional" : "Não sei";
        },
        Input: ({ sub: s, commit }) => (
          <Cards
            options={[
              { value: "sim", label: "Sim, plantio direto" },
              { value: "nao", label: "Convencional" },
              { value: "nao_sei", label: "Não sei" },
            ]}
            onConfirm={(v) =>
              commit(upsertUse(s, { class: "Lavoura", areaHa: cropHa, extra: { plantioDireto: v[0] } }))
            }
          />
        ),
      });
    }
  }

  // --- Intenção ---
  turns.push({
    id: "intencao",
    answered: (s) => s.intent.options.length > 0,
    veridia: () => (
      <p className="text-sm">
        Pensando no futuro da propriedade, o que mais te interessa? Pode marcar
        mais de uma.
      </p>
    ),
    summary: (s) => s.intent.options.map((o) => INTENT_LABELS[o].title).join(", "),
    Input: ({ sub: s, commit }) => (
      <Cards
        multi
        options={(Object.keys(INTENT_LABELS) as IntentOption[]).map((o) => ({
          value: o,
          label: INTENT_LABELS[o].title,
          desc: INTENT_LABELS[o].description,
          emoji: INTENT_LABELS[o].emoji,
        }))}
        onConfirm={(v) => commit({ ...s, currentStep: 4, intent: { ...s.intent, options: v } })}
      />
    ),
  });

  // --- Prazo ---
  turns.push({
    id: "prazo",
    answered: (s) => Boolean(s.intent.timeframe),
    veridia: () => <p className="text-sm">E pra quando você pensa nisso?</p>,
    summary: (s) => (s.intent.timeframe ? TIMEFRAME_LABELS[s.intent.timeframe] : "—"),
    Input: ({ sub: s, commit }) => (
      <Chips
        options={(Object.keys(TIMEFRAME_LABELS) as (keyof typeof TIMEFRAME_LABELS)[]).map((t) => ({
          value: t,
          label: TIMEFRAME_LABELS[t],
        }))}
        onPick={(v) => commit({ ...s, intent: { ...s.intent, timeframe: v } })}
      />
    ),
  });

  // --- Posse ---
  turns.push({
    id: "posse",
    answered: (s) => Boolean(s.eligibility.ownership),
    veridia: () => (
      <p className="text-sm">
        Agora algumas perguntas rápidas. A propriedade está no seu nome?
      </p>
    ),
    summary: (s) => (s.eligibility.ownership ? OWNERSHIP_LABELS[s.eligibility.ownership] : "—"),
    Input: ({ sub: s, commit }) => (
      <Cards
        options={(Object.keys(OWNERSHIP_LABELS) as OwnershipStatus[]).map((o) => ({
          value: o,
          label: OWNERSHIP_LABELS[o],
        }))}
        onConfirm={(v) =>
          commit({ ...s, currentStep: 5, eligibility: { ...s.eligibility, ownership: v[0] } })
        }
      />
    ),
  });

  // --- Histórico ---
  turns.push({
    id: "historico",
    answered: (s) => Boolean(s.eligibility.historicalUseDuration),
    veridia: () => <p className="text-sm">Há quanto tempo essa área é usada assim?</p>,
    summary: (s) => {
      const m: Record<string, string> = { lt5: "Menos de 5 anos", "5_10": "Entre 5 e 10 anos", gt10: "Mais de 10 anos", nao_sei: "Não sei" };
      return s.eligibility.historicalUseDuration ? m[s.eligibility.historicalUseDuration] : "—";
    },
    Input: ({ sub: s, commit }) => (
      <Chips
        options={[
          { value: "lt5", label: "Menos de 5 anos" },
          { value: "5_10", label: "Entre 5 e 10 anos" },
          { value: "gt10", label: "Mais de 10 anos" },
          { value: "nao_sei", label: "Não sei" },
        ]}
        onPick={(v) =>
          commit({ ...s, eligibility: { ...s.eligibility, historicalUseDuration: v as any } })
        }
      />
    ),
  });

  // --- Obrigações ---
  turns.push({
    id: "obrigacoes",
    answered: (s) => s.eligibility.environmentalObligations.length > 0,
    veridia: () => (
      <p className="text-sm">
        Existe alguma obrigação de recuperar essa área (multa, TAC, exigência de
        banco)? Isso muda a análise, então é bom saber.
      </p>
    ),
    summary: (s) => s.eligibility.environmentalObligations.map((o) => ENV_OBLIGATION_LABELS[o]).join(", "),
    Input: ({ sub: s, commit }) => (
      <Cards
        multi
        options={(Object.keys(ENV_OBLIGATION_LABELS) as EnvObligation[]).map((o) => ({
          value: o,
          label: ENV_OBLIGATION_LABELS[o],
        }))}
        onConfirm={(v) => {
          const cleaned = v.includes("nenhuma") ? (["nenhuma"] as EnvObligation[]) : v;
          commit({ ...s, eligibility: { ...s.eligibility, environmentalObligations: cleaned.length ? cleaned : (["nenhuma"] as EnvObligation[]) } });
        }}
      />
    ),
  });

  // --- Projeto ativo ---
  turns.push({
    id: "projeto_ativo",
    answered: (s) => Boolean(s.eligibility.activeProjects),
    veridia: () => (
      <p className="text-sm">
        Já existe algum projeto ambiental ou de carbono rolando nessa área?
      </p>
    ),
    summary: (s) =>
      s.eligibility.activeProjects === "sim" ? "Sim" : s.eligibility.activeProjects === "nao" ? "Não" : "Não sei",
    Input: ({ sub: s, commit }) => (
      <Chips
        options={[
          { value: "nao", label: "Não" },
          { value: "sim", label: "Sim" },
          { value: "nao_sei", label: "Não sei" },
        ]}
        onPick={(v) =>
          commit({ ...s, eligibility: { ...s.eligibility, activeProjects: v as any } })
        }
      />
    ),
  });

  // --- Condicionais ---
  const intent = sub.intent.options;
  if (
    intent.includes("plantar_floresta_nativa") ||
    intent.includes("sistema_agroflorestal") ||
    intent.includes("ilpf")
  ) {
    turns.push({
      id: "cond_manutencao",
      answered: (s) => "maintenance" in s.eligibility.conditionalAnswers,
      veridia: () => (
        <p className="text-sm">Quem cuidaria da manutenção nos primeiros anos?</p>
      ),
      summary: (s) => s.eligibility.conditionalAnswers.maintenance || "Não sei ainda",
      Input: ({ sub: s, commit }) => (
        <TextAnswer
          placeholder="Ex.: eu mesmo, equipe da fazenda, um parceiro"
          allowSkip
          onConfirm={(v) =>
            commit({
              ...s,
              eligibility: {
                ...s.eligibility,
                conditionalAnswers: { ...s.eligibility.conditionalAnswers, maintenance: v || "—" },
              },
            })
          }
        />
      ),
    });
  }

  return turns;
}
