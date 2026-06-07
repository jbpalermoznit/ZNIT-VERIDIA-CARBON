"use client";

import dynamic from "next/dynamic";
import type { Geometry, Position } from "@/lib/types";

// Leaflet só funciona no cliente — sem SSR.
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center rounded-2xl bg-brand-100 text-sm text-ink-500">
      Carregando o mapa...
    </div>
  ),
});

export function MapLoader(props: {
  geometry?: Geometry;
  centroid: Position;
  drawing?: boolean;
  draftPoints?: Position[];
  onAddPoint?: (p: Position) => void;
}) {
  return <PropertyMap {...props} />;
}
