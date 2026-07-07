import { MAP_BOUNDS, MAP_SIZE } from "../data/azerbaijanMapStyles";
import type { GeoJsonGeometry, GeoJsonMultiPolygon, GeoJsonPolygon } from "../data/geoJsonTypes";

export function projectCoordinate([lon, lat]: [number, number]): [number, number] {
  const x =
    ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * MAP_SIZE.width;
  const y =
    MAP_SIZE.height -
    ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * MAP_SIZE.height;
  return [x, y];
}

function ringToPath(ring: [number, number][]): string {
  if (ring.length === 0) return "";
  const [firstX, firstY] = projectCoordinate(ring[0]);
  const segments = ring.slice(1).map(([lon, lat]) => {
    const [x, y] = projectCoordinate([lon, lat]);
    return `L ${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `M ${firstX.toFixed(2)} ${firstY.toFixed(2)} ${segments.join(" ")} Z`;
}

function polygonToPath(polygon: GeoJsonPolygon): string {
  return polygon.coordinates.map((ring) => ringToPath(ring as [number, number][])).join(" ");
}

function multiPolygonToPath(multi: GeoJsonMultiPolygon): string {
  return multi.coordinates
    .map((polygon) => polygonToPath({ type: "Polygon", coordinates: polygon }))
    .join(" ");
}

export function geometryToSvgPath(geometry: GeoJsonGeometry): string {
  if (geometry.type === "Polygon") {
    return polygonToPath(geometry);
  }
  if (geometry.type === "MultiPolygon") {
    return multiPolygonToPath(geometry);
  }
  return "";
}

export function projectPoint(lonLat: [number, number]): [number, number] {
  return projectCoordinate(lonLat);
}
