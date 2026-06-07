import type { EnrichmentData, Geometry, Position } from "@/lib/types";

/**
 * Interface de provedores de dados geoespaciais externos.
 * O MVP usa `mockProvider`, mas qualquer implementação real (SICAR, MapBiomas
 * via Earth Engine, INPE) pode ser plugada aqui sem tocar na UI nem no motor.
 */
export interface CarLookupResult {
  found: boolean;
  property?: {
    carNumber: string;
    propertyName?: string;
    municipality: string;
    state: string;
    geometry: Geometry;
    centroid: Position;
    totalAreaHa: number;
  };
  sicar?: EnrichmentData["sicar"];
  /** quando SICAR está indisponível e usamos cache */
  fromCache?: boolean;
}

export interface GeoDataProvider {
  /** Etapa 1 — recupera geometria e cadastro a partir do CAR. */
  lookupCAR(carNumber: string): Promise<CarLookupResult>;
  /** Busca alternativa por CPF/CNPJ — lista de CARs vinculados. */
  lookupByDocument(doc: string): Promise<{ carNumber: string; municipality: string; areaHa: number }[]>;
  /** Etapa 3 (background) — cruza geometria com bases públicas. */
  enrich(geometry: Geometry, centroid: Position, state: string): Promise<EnrichmentData>;
}
