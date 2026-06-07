import type { Geometry, Position } from "@/lib/types";

/** Hash determinístico simples (FNV-1a) — mesma entrada, mesma saída. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Gerador pseudoaleatório determinístico a partir de uma seed. */
export function seededRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

/** Centro aproximado por UF (lng, lat) — para posicionar o mapa. */
export const STATE_CENTERS: Record<string, { center: Position; biome: string[]; municipios: string[] }> = {
  MT: { center: [-55.9, -12.6], biome: ["Cerrado", "Amazônia"], municipios: ["Sorriso", "Sinop", "Querência", "Nova Ubiratã"] },
  MS: { center: [-54.5, -20.5], biome: ["Cerrado", "Pantanal"], municipios: ["Campo Grande", "Ribas do Rio Pardo", "Três Lagoas"] },
  GO: { center: [-49.6, -16.0], biome: ["Cerrado"], municipios: ["Rio Verde", "Jataí", "Cristalina"] },
  PA: { center: [-52.0, -5.5], biome: ["Amazônia"], municipios: ["Paragominas", "Novo Repartimento", "São Félix do Xingu"] },
  BA: { center: [-41.7, -12.5], biome: ["Caatinga", "Cerrado", "Mata Atlântica"], municipios: ["Barreiras", "Luís Eduardo Magalhães", "Correntina"] },
  MG: { center: [-44.5, -18.5], biome: ["Cerrado", "Mata Atlântica"], municipios: ["Uberlândia", "Patrocínio", "Unaí"] },
  SP: { center: [-48.5, -22.0], biome: ["Mata Atlântica", "Cerrado"], municipios: ["Ribeirão Preto", "Presidente Prudente", "Bauru"] },
  PR: { center: [-51.5, -24.5], biome: ["Mata Atlântica"], municipios: ["Cascavel", "Ponta Grossa", "Guarapuava"] },
  RS: { center: [-53.0, -29.5], biome: ["Pampa", "Mata Atlântica"], municipios: ["Bagé", "Uruguaiana", "Santa Maria"] },
  TO: { center: [-48.3, -10.2], biome: ["Cerrado", "Amazônia"], municipios: ["Gurupi", "Araguaína", "Pedro Afonso"] },
  RO: { center: [-63.0, -10.9], biome: ["Amazônia"], municipios: ["Ji-Paraná", "Vilhena", "Ariquemes"] },
  MA: { center: [-45.3, -5.4], biome: ["Cerrado", "Amazônia", "Caatinga"], municipios: ["Balsas", "Imperatriz", "Açailândia"] },
};

export const FALLBACK_STATE = "MT";

/** Constrói um polígono fechado e irregular ao redor de um centro, com área-alvo (ha). */
export function buildPolygon(
  center: Position,
  areaHa: number,
  rand: () => number,
): Geometry {
  // 1 ha ≈ 0.01 km². Raio aproximado do círculo equivalente, convertido p/ graus.
  const areaKm2 = areaHa / 100;
  const radiusKm = Math.sqrt(areaKm2 / Math.PI);
  const [lng, lat] = center;
  const degLat = radiusKm / 111;
  const degLng = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const points: Position[] = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const jitter = 0.7 + rand() * 0.7; // contorno irregular, mais realista
    points.push([
      lng + Math.cos(angle) * degLng * jitter,
      lat + Math.sin(angle) * degLat * jitter,
    ]);
  }
  points.push(points[0]);
  return { type: "Polygon", coordinates: [points] };
}

/** Área (ha) de um polígono via fórmula do shoelace em projeção local. */
export function polygonAreaHa(geometry: Geometry): number {
  const ring = geometry.coordinates[0];
  if (!ring || ring.length < 4) return 0;
  const lat0 = ring[0][1];
  const mPerDegLat = 111_320;
  const mPerDegLng = 111_320 * Math.cos((lat0 * Math.PI) / 180);
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += x1 * mPerDegLng * (y2 * mPerDegLat) - x2 * mPerDegLng * (y1 * mPerDegLat);
  }
  return Math.abs(area / 2) / 10_000; // m² → ha
}

/** Centroide simples de um polígono. */
export function centroidOf(geometry: Geometry): Position {
  const ring = geometry.coordinates[0];
  let x = 0;
  let y = 0;
  const n = ring.length - 1;
  for (let i = 0; i < n; i++) {
    x += ring[i][0];
    y += ring[i][1];
  }
  return [x / n, y / n];
}
