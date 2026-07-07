export const economicRegionDistricts = {
  "Abşeron-Xızı": ["Abşeron rayonu", "Xızı rayonu", "Sumqayıt şəhəri"],
  "Gəncə-Daşkəsən": [
    "Daşkəsən rayonu",
    "Goranboy rayonu",
    "Göygöl rayonu",
    "Samux rayonu",
    "Gəncə şəhəri",
    "Naftalan şəhəri",
  ],
  "Şəki-Zaqatala": [
    "Balakən rayonu",
    "Qax rayonu",
    "Qəbələ rayonu",
    "Oğuz rayonu",
    "Zaqatala rayonu",
    "Şəki rayonu",
  ],
  "Lənkəran-Astara": [
    "Astara rayonu",
    "Cəlilabad rayonu",
    "Lənkəran rayonu",
    "Lerik rayonu",
    "Masallı rayonu",
    "Yardımlı rayonu",
    "Lənkəran şəhəri",
  ],
  "Quba-Xaçmaz": ["Şabran rayonu", "Xaçmaz rayonu", "Quba rayonu", "Qusar rayonu", "Siyəzən rayonu"],
  "Mərkəzi Aran": [
    "Ağdaş rayonu",
    "Göyçay rayonu",
    "Kürdəmir rayonu",
    "Ucar rayonu",
    "Yevlax rayonu",
    "Zərdab rayonu",
    "Mingəçevir şəhəri",
  ],
  Qarabağ: [
    "Ağcabədi rayonu",
    "Ağdam rayonu",
    "Ağdərə rayonu",
    "Bərdə rayonu",
    "Füzuli rayonu",
    "Xocalı rayonu",
    "Xocavənd rayonu",
    "Şuşa rayonu",
    "Tərtər rayonu",
    "Xankəndi şəhəri",
  ],
  "Şərqi Zəngəzur": [
    "Kəlbəcər rayonu",
    "Qubadlı rayonu",
    "Zəngilan rayonu",
    "Laçın rayonu",
    "Cəbrayıl rayonu",
  ],
  "Dağlıq Şirvan": ["Ağsu rayonu", "İsmayıllı rayonu", "Qobustan rayonu", "Şamaxı rayonu"],
  Naxçıvan: [
    "Babək rayonu",
    "Culfa rayonu",
    "Kəngərli rayonu",
    "Ordubad rayonu",
    "Sədərək rayonu",
    "Şahbuz rayonu",
    "Şərur rayonu",
    "Naxçıvan şəhəri",
  ],
  Bakı: ["Bakı şəhəri"],
  "Qazax-Tovuz": ["Ağstafa rayonu", "Gədəbəy rayonu", "Qazax rayonu", "Şəmkir rayonu", "Tovuz rayonu"],
  "Mil-Muğan": ["Beyləqan rayonu", "İmişli rayonu", "Saatlı rayonu", "Sabirabad rayonu"],
  "Şirvan-Salyan": [
    "Biləsuvar rayonu",
    "Hacıqabul rayonu",
    "Neftçala rayonu",
    "Salyan rayonu",
    "Şirvan şəhəri",
  ],
} as const;

export type EconomicRegion = keyof typeof economicRegionDistricts;

export type DistrictCity = (typeof economicRegionDistricts)[EconomicRegion][number];

export const economicRegions = Object.keys(economicRegionDistricts) as EconomicRegion[];

export function getDistrictsForRegion(region: EconomicRegion | "all"): string[] {
  if (region === "all") {
    return Object.values(economicRegionDistricts).flat();
  }
  return [...economicRegionDistricts[region]];
}

export function getRegionForDistrict(districtCity: string): EconomicRegion | null {
  for (const [region, districts] of Object.entries(economicRegionDistricts)) {
    if ((districts as readonly string[]).includes(districtCity)) {
      return region as EconomicRegion;
    }
  }
  return null;
}
