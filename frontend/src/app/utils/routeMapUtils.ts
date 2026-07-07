export type LatLngTuple = [number, number];

function segmentLength(a: LatLngTuple, b: LatLngTuple): number {
  const dLat = b[0] - a[0];
  const dLng = b[1] - a[1];
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

export function getPathSegmentLengths(path: LatLngTuple[]): number[] {
  const lengths: number[] = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    lengths.push(segmentLength(path[i], path[i + 1]));
  }
  return lengths;
}

export function getTotalPathLength(path: LatLngTuple[]): number {
  return getPathSegmentLengths(path).reduce((sum, length) => sum + length, 0);
}

export function getPositionOnPath(path: LatLngTuple[], progress: number): LatLngTuple {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return path[0];

  const clamped = Math.min(1, Math.max(0, progress));
  const segmentLengths = getPathSegmentLengths(path);
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);

  if (totalLength === 0) return path[0];

  let remaining = clamped * totalLength;

  for (let i = 0; i < segmentLengths.length; i += 1) {
    const length = segmentLengths[i];
    if (remaining <= length) {
      const ratio = length === 0 ? 0 : remaining / length;
      return [
        path[i][0] + (path[i + 1][0] - path[i][0]) * ratio,
        path[i][1] + (path[i + 1][1] - path[i][1]) * ratio,
      ];
    }
    remaining -= length;
  }

  return path[path.length - 1];
}

export function getProgressFromPosition(path: LatLngTuple[], position: LatLngTuple): number {
  if (path.length < 2) return 0;

  const segmentLengths = getPathSegmentLengths(path);
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);
  if (totalLength === 0) return 0;

  let bestDistance = Number.POSITIVE_INFINITY;
  let bestProgress = 0;
  let traversed = 0;

  for (let i = 0; i < segmentLengths.length; i += 1) {
    const start = path[i];
    const end = path[i + 1];
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const length = segmentLengths[i];

    const t =
      length === 0
        ? 0
        : Math.min(1, Math.max(0, ((position[0] - start[0]) * dx + (position[1] - start[1]) * dy) / (dx * dx + dy * dy)));

    const projected: LatLngTuple = [start[0] + t * dx, start[1] + t * dy];
    const distance = segmentLength(position, projected);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestProgress = (traversed + length * t) / totalLength;
    }

    traversed += length;
  }

  return Math.min(0.98, Math.max(0, bestProgress));
}

export function progressToPercent(progress: number): number {
  return Math.round(Math.min(100, Math.max(0, progress * 100)));
}
