import type { EconomicRegion } from "./azerbaijanRegions";

export const MAP_BOUNDS = {
  minLon: 44.75,
  maxLon: 50.65,
  minLat: 38.38,
  maxLat: 41.95,
} as const;

export const MAP_SIZE = { width: 900, height: 620 } as const;

/** Label anchor points in geographic coordinates [lon, lat]. */
export const regionLabelCentroids: Record<EconomicRegion, [number, number]> = {
  "Abşeron-Xızı": [49.3863, 40.5406],
  "Gəncə-Daşkəsən": [46.4472, 40.6659],
  "Şəki-Zaqatala": [47.1545, 41.2368],
  "Lənkəran-Astara": [48.6364, 38.9368],
  "Quba-Xaçmaz": [48.6659, 41.2573],
  "Mərkəzi Aran": [47.5218, 40.5174],
  Qarabağ: [47.0266, 39.9225],
  "Şərqi Zəngəzur": [46.4833, 39.6498],
  "Dağlıq Şirvan": [48.5379, 40.6305],
  Naxçıvan: [45.4065, 39.3596],
  Bakı: [49.8247, 40.2866],
  "Qazax-Tovuz": [45.6627, 40.9268],
  "Mil-Muğan": [48.2556, 39.8655],
  "Şirvan-Salyan": [48.8937, 39.6696],
};

export const regionPalette: Record<
  EconomicRegion,
  { fill: string; fillHover: string; fillSelected: string }
> = {
  "Qazax-Tovuz": { fill: "#D8E4B8", fillHover: "#E4EDCC", fillSelected: "#C8D8A4" },
  "Şəki-Zaqatala": { fill: "#E2D4F0", fillHover: "#ECE2F6", fillSelected: "#D4C4E8" },
  "Quba-Xaçmaz": { fill: "#F2E8B8", fillHover: "#F8F0CC", fillSelected: "#E8DEA4" },
  "Abşeron-Xızı": { fill: "#D0E4C4", fillHover: "#DCEEDA", fillSelected: "#C0D8B4" },
  Bakı: { fill: "#E0D0F0", fillHover: "#ECE4F8", fillSelected: "#D4C0E8" },
  "Gəncə-Daşkəsən": { fill: "#F2D4C8", fillHover: "#F8E2DA", fillSelected: "#E8C4B8" },
  "Dağlıq Şirvan": { fill: "#DCE8C8", fillHover: "#E8F2DA", fillSelected: "#D0E0B8" },
  "Mərkəzi Aran": { fill: "#D4E8B8", fillHover: "#E0F0CC", fillSelected: "#C4DCA8" },
  Qarabağ: { fill: "#DDD0EC", fillHover: "#EAE0F4", fillSelected: "#D0C0E0" },
  "Şərqi Zəngəzur": { fill: "#C8E0BE", fillHover: "#D8ECD0", fillSelected: "#B8D4AE" },
  "Mil-Muğan": { fill: "#F0E4B0", fillHover: "#F8F0C8", fillSelected: "#E6D8A0" },
  "Şirvan-Salyan": { fill: "#F0D0C4", fillHover: "#F8E0D8", fillSelected: "#E4C0B4" },
  "Lənkəran-Astara": { fill: "#C8E0C0", fillHover: "#D8ECD4", fillSelected: "#B8D4B0" },
  Naxçıvan: { fill: "#F0E6B8", fillHover: "#F5EDCA", fillSelected: "#EDE0A8" },
};

export const regionLabelLines: Record<EconomicRegion, string[]> = {
  "Qazax-Tovuz": ["Qazax-", "Tovuz"],
  "Şəki-Zaqatala": ["Şəki-", "Zaqatala"],
  "Quba-Xaçmaz": ["Quba-", "Xaçmaz"],
  "Abşeron-Xızı": ["Abşeron-", "Xızı"],
  Bakı: ["Bakı"],
  "Gəncə-Daşkəsən": ["Gəncə-", "Daşkəsən"],
  "Dağlıq Şirvan": ["Dağlıq", "Şirvan"],
  "Mərkəzi Aran": ["Mərkəzi", "Aran"],
  Qarabağ: ["Qarabağ"],
  "Şərqi Zəngəzur": ["Şərqi", "Zəngəzur"],
  "Mil-Muğan": ["Mil-Muğan"],
  "Şirvan-Salyan": ["Şirvan-", "Salyan"],
  "Lənkəran-Astara": ["Lənkəran-", "Astara"],
  Naxçıvan: ["Naxçıvan"],
};

export type MapLabelScale = "compact" | "default" | "prominent";

const LABEL_SCALE_MULTIPLIER: Record<MapLabelScale, number> = {
  compact: 0.88,
  default: 1.05,
  prominent: 1.28,
};

function getBaseLabelFontSize(regionId: EconomicRegion, lineCount: number): number {
  if (regionId === "Bakı") return 12;
  if (lineCount >= 3) return 11.5;
  if (lineCount === 2) return 12.5;
  return 14;
}

export function getRegionLabelFontSize(regionId: EconomicRegion, scale: MapLabelScale): number {
  const lineCount = regionLabelLines[regionId].length;
  const base = getBaseLabelFontSize(regionId, lineCount);
  return Math.round(base * LABEL_SCALE_MULTIPLIER[scale] * 10) / 10;
}

export function getRegionLabelLineHeight(fontSize: number): number {
  return Math.round(fontSize * 1.18 * 10) / 10;
}

export function getRegionLabelCountOffset(lineCount: number, fontSize: number): number {
  const blockHeight = lineCount > 1 ? (lineCount - 1) * getRegionLabelLineHeight(fontSize) : 0;
  return fontSize * 0.55 + blockHeight * 0.5 + 10;
}
