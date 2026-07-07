import villagesData from "@/data/azerbaijanVillages.json";

export interface VillageRecord {
  district?: string;
  village?: string;
  inzibatiVahid?: string;
  kendAdi?: string;
  "İnzibati vahid"?: string;
  "Kənd adı"?: string;
}

export const villages = villagesData as VillageRecord[];

if (!Array.isArray(villages)) {
  throw new Error("azerbaijanVillages.json must be a flat array");
}

export function normalizePlaceName(value?: string): string {
  if (!value) return "";

  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ rayonu$/g, "")
    .replace(/ rayon$/g, "")
    .replace(/ şəhəri$/g, "")
    .replace(/ şəhər$/g, "");
}

function getDistrictName(row: VillageRecord): string {
  return row.district || row.inzibatiVahid || row["İnzibati vahid"] || "";
}

function getVillageName(row: VillageRecord): string {
  return row.village || row.kendAdi || row["Kənd adı"] || "";
}

export function getVillagesForDistrict(selectedDistrictCity: string): string[] {
  if (!selectedDistrictCity || selectedDistrictCity === "all") return [];

  const normalizedSelected = normalizePlaceName(selectedDistrictCity);

  const result = villages
    .filter((row) => normalizePlaceName(getDistrictName(row)) === normalizedSelected)
    .map((row) => getVillageName(row))
    .filter(Boolean);

  return Array.from(new Set(result)).sort((a, b) => a.localeCompare(b, "az"));
}

export function villagesMatch(a: string, b: string): boolean {
  return normalizePlaceName(a) === normalizePlaceName(b);
}

console.log("villagesData length:", villages.length);
console.log("villagesData sample:", villages.slice(0, 10));
console.log("Zəngilan villages:", getVillagesForDistrict("Zəngilan rayonu"));
console.log("Lənkəran villages:", getVillagesForDistrict("Lənkəran şəhəri"));
console.log("Şəki villages:", getVillagesForDistrict("Şəki rayonu"));
