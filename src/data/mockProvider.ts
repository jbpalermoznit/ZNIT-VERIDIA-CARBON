import type { EnrichmentData, Geometry, LandUseClass, Position } from "@/lib/types";
import type { CarLookupResult, GeoDataProvider } from "./provider";
import {
  buildPolygon,
  centroidOf,
  FALLBACK_STATE,
  hashString,
  polygonAreaHa,
  seededRandom,
  STATE_CENTERS,
} from "./geo";

const VALID_UF = Object.keys(STATE_CENTERS);

function ufFromCar(car: string): string {
  const uf = car.trim().slice(0, 2).toUpperCase();
  return VALID_UF.includes(uf) ? uf : FALLBACK_STATE;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Distribui a área total em classes de uso do solo (MapBiomas) de forma
 * plausível para o bioma, usando o gerador determinístico.
 */
function buildLandUse(
  areaHa: number,
  biome: string[],
  rand: () => number,
): LandUseClass[] {
  const isAmazon = biome.includes("Amazônia");
  const isPantanal = biome.includes("Pantanal");

  // Pesos por classe (variam por bioma). Soma normalizada depois.
  const weights: Record<string, number> = {
    Pastagem: isAmazon ? 0.35 : 0.45,
    "Formação Florestal": isAmazon ? 0.3 : 0.12,
    "Formação Savânica": isPantanal ? 0.25 : 0.14,
    "Lavoura Temporária": isAmazon ? 0.08 : 0.18,
    "Formação Campestre": 0.06,
    "Mosaico de Usos": 0.05,
  };

  // Perturba os pesos para variar entre propriedades
  const entries = Object.entries(weights).map(([cls, w]) => [
    cls,
    Math.max(0, w * (0.5 + rand())),
  ] as [string, number]);
  const sum = entries.reduce((s, [, w]) => s + w, 0);

  let acc = 0;
  const classes: LandUseClass[] = entries
    .map(([cls, w], i) => {
      const isLast = i === entries.length - 1;
      const ha = isLast
        ? Math.max(0, areaHa - acc)
        : Math.round((w / sum) * areaHa);
      acc += ha;
      return { class: cls, areaHa: ha };
    })
    .filter((c) => c.areaHa >= 1)
    .sort((a, b) => b.areaHa - a.areaHa);

  return classes;
}

export const mockProvider: GeoDataProvider = {
  async lookupCAR(carNumber: string): Promise<CarLookupResult> {
    await delay(900); // simula a chamada ao SICAR

    const clean = carNumber.replace(/\s/g, "");
    // Heurística de "não encontrado": CARs terminando em "0000" não existem.
    if (/0000$/.test(clean)) {
      return { found: false };
    }

    const seed = hashString(clean);
    const rand = seededRandom(seed);
    const uf = ufFromCar(clean);
    const meta = STATE_CENTERS[uf];

    // Área entre ~60 e ~3.200 ha (faixa da persona)
    const areaHa = Math.round(60 + rand() * 3140);
    const muni = meta.municipios[Math.floor(rand() * meta.municipios.length)];

    // Espalha o centro dentro do estado
    const center: Position = [
      meta.center[0] + (rand() - 0.5) * 2.2,
      meta.center[1] + (rand() - 0.5) * 2.2,
    ];

    const geometry = buildPolygon(center, areaHa, rand);
    const realArea = Math.round(polygonAreaHa(geometry));

    // SICAR: APP + RL coerentes com a área
    const rlHa = Math.round(realArea * (0.2 + rand() * 0.15));
    const appHa = Math.round(realArea * (0.03 + rand() * 0.07));
    const consolidatedHa = Math.max(0, realArea - rlHa - appHa);

    return {
      found: true,
      property: {
        carNumber: clean,
        propertyName: `Imóvel rural ${muni}`,
        municipality: muni,
        state: uf,
        geometry,
        centroid: centroidOf(geometry),
        totalAreaHa: realArea,
      },
      sicar: {
        appHa,
        rlHa,
        consolidatedHa,
        status: rand() > 0.15 ? "Ativo" : "Pendente",
      },
    };
  },

  async lookupByDocument(doc: string) {
    await delay(700);
    const seed = hashString(doc.replace(/\D/g, "") || "000");
    const rand = seededRandom(seed);
    const count = 1 + Math.floor(rand() * 3);
    const uf = VALID_UF[Math.floor(rand() * VALID_UF.length)];
    const meta = STATE_CENTERS[uf];
    return Array.from({ length: count }).map((_, i) => {
      const muni = meta.municipios[Math.floor(rand() * meta.municipios.length)];
      const seq = String(5100000 + Math.floor(rand() * 99999));
      const tail = Math.random().toString(36).slice(2, 10).toUpperCase();
      return {
        carNumber: `${uf}-${seq}-${tail}${i}`,
        municipality: muni,
        areaHa: Math.round(60 + rand() * 3000),
      };
    });
  },

  async enrich(
    geometry: Geometry,
    centroid: Position,
    state: string,
  ): Promise<EnrichmentData> {
    await delay(1100); // simula MapBiomas + INPE + camadas

    const meta = STATE_CENTERS[state] ?? STATE_CENTERS[FALLBACK_STATE];
    const areaHa = Math.round(polygonAreaHa(geometry));
    const seed = hashString(`${centroid[0].toFixed(3)},${centroid[1].toFixed(3)}`);
    const rand = seededRandom(seed);

    const biome = meta.biome.slice(0, 1 + (rand() > 0.6 ? 1 : 0));
    const classes = buildLandUse(areaHa, biome, rand);

    const year = 2023;
    const hasDeforestationRisk = rand() > 0.78;

    const now = new Date().toISOString();
    const sicarOk = rand() > 0.12;

    // Sobreposições — raras, para gerar casos de bloqueio ocasionais
    const overlaps = {
      ucIntegral: rand() > 0.95,
      ucSustentavel: rand() > 0.9,
      terraIndigena: rand() > 0.96,
      quilombola: rand() > 0.97,
    };

    return {
      mapbiomas: {
        year,
        classes,
        historySummary:
          "Uso consolidado nos últimos 10 anos, sem conversão recente relevante de vegetação nativa.",
      },
      biome,
      overlaps,
      deforestation: {
        hasRecentAlerts: hasDeforestationRisk,
        lastAlertYear: hasDeforestationRisk ? 2022 : undefined,
        note: hasDeforestationRisk
          ? "Há alertas recentes de desmatamento no entorno da propriedade."
          : "Sem alertas recentes de desmatamento detectados pela VeridIA.",
      },
      confidence: sicarOk ? "alta" : "media",
      sources: [
        {
          name: "SICAR",
          detail: sicarOk
            ? "Geometria e situação cadastral"
            : "Indisponível — usando cache recente",
          retrievedAt: now,
          status: sicarOk ? "ok" : "cache",
        },
        {
          name: `MapBiomas Coleção 9 (${year})`,
          detail: "Uso e cobertura do solo",
          retrievedAt: now,
          status: "ok",
        },
        {
          name: "INPE PRODES/DETER",
          detail: "Alertas de desmatamento",
          retrievedAt: now,
          status: "ok",
        },
        {
          name: "ICMBio / FUNAI",
          detail: "Sobreposição com áreas protegidas",
          retrievedAt: now,
          status: "ok",
        },
      ],
    };
  },
};

/** Provedor ativo. Trocar aqui para conectar APIs reais no futuro. */
export const geoProvider: GeoDataProvider = mockProvider;
