import { districtShortName } from "../data/harvestExplorerUtils";

export function buildOriginLocationQuery(input: {
  farmer: string;
  village?: string;
  district: string;
}): string {
  const districtLabel = districtShortName(input.district);
  const villageLabel = input.village?.trim() || districtLabel;
  return `${input.farmer}, ${villageLabel}, ${districtLabel}, Azerbaijan`;
}

export function buildGoogleMapsSearchUrl(query: string): string {
  const params = new URLSearchParams({
    api: "1",
    query,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

/** Embed preview without API key — uses Google Maps query embed. */
export function buildGoogleMapsEmbedUrl(query: string): string {
  const params = new URLSearchParams({
    q: query,
    hl: "en",
    z: "13",
    output: "embed",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

export function openGoogleMapsSearch(query: string): void {
  window.open(buildGoogleMapsSearchUrl(query), "_blank", "noopener,noreferrer");
}
