export const ECONOMIC_REGION_DISTRICTS = {
  "Abşeron-Xızı": ["Abşeron", "Xızı", "Sumqayıt"],
  "Gəncə-Daşkəsən": ["Daşkəsən", "Goranboy", "Göygöl", "Samux", "Gəncə", "Naftalan"],
  "Şəki-Zaqatala": ["Balakən", "Qax", "Qəbələ", "Oğuz", "Zaqatala", "Şəki"],
  "Lənkəran-Astara": ["Astara", "Cəlilabad", "Lənkəran", "Lerik", "Masallı", "Yardımlı"],
  "Quba-Xaçmaz": ["Şabran", "Xaçmaz", "Quba", "Qusar", "Siyəzən"],
  "Mərkəzi Aran": ["Ağdaş", "Göyçay", "Kürdəmir", "Ucar", "Yevlax", "Zərdab", "Mingəçevir"],
  Qarabağ: ["Ağcabədi", "Ağdam", "Ağdərə", "Bərdə", "Füzuli", "Xocalı", "Xocavənd", "Şuşa", "Tərtər", "Xankəndi"],
  "Şərqi Zəngəzur": ["Kəlbəcər", "Qubadlı", "Zəngilan", "Laçın", "Cəbrayıl"],
  "Dağlıq Şirvan": ["Ağsu", "İsmayıllı", "Qobustan", "Şamaxı"],
  Naxçıvan: ["Babək", "Culfa", "Kəngərli", "Ordubad", "Sədərək", "Şahbuz", "Şərur", "Naxçıvan şəhəri"],
  Bakı: ["Bakı"],
  "Qazax-Tovuz": ["Ağstafa", "Gədəbəy", "Qazax", "Şəmkir", "Tovuz"],
  "Mil-Muğan": ["Beyləqan", "İmişli", "Saatlı", "Sabirabad"],
  "Şirvan-Salyan": ["Biləsuvar", "Hacıqabul", "Neftçala", "Salyan", "Şirvan"],
} as const;

export type EconomicRegionDistrict = keyof typeof ECONOMIC_REGION_DISTRICTS;

export type DistrictCity = (typeof ECONOMIC_REGION_DISTRICTS)[EconomicRegionDistrict][number];

const collator = new Intl.Collator("az", { sensitivity: "base" });

export function normalizeDistrictName(name: string): string {
  return name
    .replace(/\s+rayonu$/i, "")
    .replace(/\s+şəhəri$/i, "")
    .trim();
}

export function districtsMatch(a: string, b: string): boolean {
  const left = normalizeDistrictName(a).toLocaleLowerCase("az");
  const right = normalizeDistrictName(b).toLocaleLowerCase("az");
  return left === right || left.includes(right) || right.includes(left);
}

export function getAllDistrictsSorted(): string[] {
  const all = Object.values(ECONOMIC_REGION_DISTRICTS).flat();
  return [...new Set(all)].sort((a, b) => collator.compare(a, b));
}

export function getDistrictsForJobRegion(region: EconomicRegionDistrict | "all"): string[] {
  if (region === "all") {
    return getAllDistrictsSorted();
  }
  return [...ECONOMIC_REGION_DISTRICTS[region]].sort((a, b) => collator.compare(a, b));
}

export function getEconomicRegionForDistrict(district: string): EconomicRegionDistrict | null {
  const normalized = normalizeDistrictName(district);

  for (const [region, districts] of Object.entries(ECONOMIC_REGION_DISTRICTS)) {
    const match = districts.some(
      (item) =>
        item === district ||
        normalizeDistrictName(item).toLocaleLowerCase("az") === normalized.toLocaleLowerCase("az"),
    );
    if (match) {
      return region as EconomicRegionDistrict;
    }
  }

  return null;
}

export const economicRegionDistrictKeys = Object.keys(
  ECONOMIC_REGION_DISTRICTS,
) as EconomicRegionDistrict[];
