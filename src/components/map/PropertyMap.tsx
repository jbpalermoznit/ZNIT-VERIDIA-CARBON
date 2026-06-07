"use client";

import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import {
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Geometry, Position } from "@/lib/types";
import { polygonAreaHa } from "@/data/geo";
import { formatHa } from "@/lib/utils";

function toLatLng(ring: Position[]): LatLngExpression[] {
  return ring.map(([lng, lat]) => [lat, lng] as LatLngExpression);
}

/** Recentraliza o mapa quando o centro muda. */
function Recenter({ center, zoom }: { center: Position; zoom: number }) {
  const map = useMap();
  useMemo(() => {
    map.setView([center[1], center[0]], zoom);
  }, [center, zoom, map]);
  return null;
}

/** Captura cliques no modo de desenho. */
function DrawCapture({
  active,
  onAddPoint,
}: {
  active: boolean;
  onAddPoint: (p: Position) => void;
}) {
  useMapEvents({
    click(e) {
      if (active) onAddPoint([e.latlng.lng, e.latlng.lat]);
    },
  });
  return null;
}

export default function PropertyMap({
  geometry,
  centroid,
  drawing = false,
  draftPoints = [],
  onAddPoint,
}: {
  geometry?: Geometry;
  centroid: Position;
  drawing?: boolean;
  draftPoints?: Position[];
  onAddPoint?: (p: Position) => void;
}) {
  const [ready, setReady] = useState(false);
  const ring = geometry?.coordinates?.[0];
  const area = geometry ? polygonAreaHa(geometry) : 0;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={[centroid[1], centroid[0]]}
        zoom={13}
        scrollWheelZoom
        whenReady={() => setReady(true)}
        className="h-full w-full"
      >
        <TileLayer
          attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Recenter center={centroid} zoom={13} />
        <DrawCapture active={drawing} onAddPoint={(p) => onAddPoint?.(p)} />

        {ring && ring.length > 2 && (
          <Polygon
            positions={toLatLng(ring)}
            pathOptions={{
              color: "#56B7A5",
              weight: 3,
              fillColor: "#56B7A5",
              fillOpacity: 0.22,
            }}
          />
        )}

        {drawing && draftPoints.length > 1 && (
          <Polygon
            positions={toLatLng(draftPoints)}
            pathOptions={{
              color: "#C98A2B",
              weight: 2,
              dashArray: "6 6",
              fillColor: "#C98A2B",
              fillOpacity: 0.15,
            }}
          />
        )}
      </MapContainer>

      {/* Card flutuante com totais (PRD 01 Etapa 2) */}
      {geometry && !drawing && (
        <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-xl bg-white/95 px-3 py-2 text-sm shadow-card backdrop-blur">
          <span className="font-semibold text-ink-900">{formatHa(area)}</span>
          <span className="ml-2 text-xs text-ink-500">área identificada</span>
        </div>
      )}
      {drawing && (
        <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-xl bg-atencao/95 px-3 py-2 text-sm text-white shadow-card">
          Toque no mapa para marcar os limites · {draftPoints.length} ponto(s)
        </div>
      )}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-brand-100 text-sm text-ink-500">
          Carregando o mapa...
        </div>
      )}
    </div>
  );
}
