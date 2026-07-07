import { getProductImage } from "../utils/productImages";
import rawData from "./harvestExplorerData.json";
import type { EconomicRegion } from "./azerbaijanRegions";
import { allFarmers } from "./farmers";
import { resolveListingVariety } from "./productVarieties";

export type FreshProductType =
  | "Tomato"
  | "Apple"
  | "Potato"
  | "Pomegranate"
  | "Cucumber"
  | "Grapes"
  | "Citrus"
  | "Watermelon"
  | "Vegetables"
  | "Fruits"
  | "Onion"
  | "Pepper"
  | "Eggplant"
  | "Pear"
  | "Cherry"
  | "Melon"
  | "Greenhouse";

export interface HarvestDistrictRecord {
  economicRegion: string;
  district: string;
  directionRaw: string;
  groupRaw: string;
  rationale: string;
  reliability: string;
  freshProducts: string[];
  hasFreshProduce: boolean;
}

export interface HarvestRegionRecord {
  name: string;
  districtCount: number;
  freshDistrictCount: number;
  topProducts: string[];
  productCounts: Record<string, number>;
}

export interface HarvestListing {
  id: string;
  slug: string;
  name: string;
  productType: string;
  economicRegion: EconomicRegion;
  district: string;
  village: string;
  farmer: string;
  farmerSlug: string | null;
  farmerVerified: boolean;
  quantity: string;
  pricePerKg: string;
  harvestDate: string;
  tags: string[];
  image: string;
  deliveryAvailable: boolean;
  description?: string;
  unit?: string;
  minimumOrder?: string;
  category?: string;
  variety?: string;
}

export const harvestData = rawData as {
  districts: HarvestDistrictRecord[];
  regions: HarvestRegionRecord[];
};

export const PRODUCT_CHIPS = [
  "Tomato",
  "Apple",
  "Potato",
  "Pomegranate",
  "Cucumber",
  "Grapes",
  "Citrus",
  "Watermelon",
] as const;

function productImageForType(productType: string): string {
  return getProductImage(productType);
}

const REGION_SUMMARIES: Partial<Record<EconomicRegion, string>> = {
  "Quba-Xaçmaz": "Known for apples, mountain fruits, and seasonal vegetables.",
  "Mərkəzi Aran": "Known for pomegranates and seasonal fruits.",
  "Lənkəran-Astara": "Known for citrus fruits, subtropical fruits, and early vegetables.",
  "Qazax-Tovuz": "Known for vegetables, potatoes, tomatoes, and greenhouse produce.",
  "Gəncə-Daşkəsən": "Known for vegetables, potatoes, and open-field produce.",
  "Şəki-Zaqatala": "Known for mountain fruits and seasonal vegetables.",
  Bakı: "Known for greenhouse vegetables and peri-urban fresh supply.",
  "Mil-Muğan": "Known for vegetables, melons, and seasonal field crops.",
};

const FARMER_NAMES = [
  "Green Valley Farm",
  "Mountain Apple Farm",
  "Nar Garden",
  "South Garden Farm",
  "Şirvan Produce Co.",
  "Caspian Harvest",
  "Alpine Orchard",
  "Sunfield Growers",
];

const VILLAGE_SUFFIXES = ["kənd", "məhəllə", "qəsəbə"];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function districtShortName(district: string) {
  return district
    .replace(/\s*rayonu$/i, "")
    .replace(/\s*şəhəri$/i, "")
    .replace(/\s*\/şəhəri$/i, "")
    .trim();
}

function makeVillage(district: string, index: number) {
  const base = districtShortName(district);
  return `${base} ${VILLAGE_SUFFIXES[index % VILLAGE_SUFFIXES.length]}`;
}

function makeQuantity(productType: string, seed: number) {
  const buckets = [180, 320, 500, 650, 800, 1200];
  const kg = buckets[seed % buckets.length];
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
  return `${kg} kg`;
}

function makePrice(productType: string, seed: number) {
  const base: Record<string, number> = {
    Tomato: 1.2,
    Apple: 0.9,
    Potato: 0.7,
    Pomegranate: 1.5,
    Cucumber: 1.1,
    Grapes: 1.4,
    Citrus: 1.3,
    Watermelon: 0.8,
    Vegetables: 1.0,
    Fruits: 1.1,
  };
  const value = (base[productType] ?? 1) + (seed % 5) * 0.05;
  return `${value.toFixed(2)} AZN/kg`;
}

function makeHarvestDate(seed: number) {
  const labels = ["Today", "Yesterday", "2 days ago", "This week", "3 days ago"];
  return labels[seed % labels.length];
}

function makeTags(productType: string, seed: number) {
  const tags = new Set<string>();
  if (seed % 2 === 0) tags.add("Verified farmer");
  if (productType === "Tomato" || productType === "Cucumber" || seed % 3 === 0) tags.add("Greenhouse");
  if (seed % 4 === 0) tags.add("Open field");
  if (seed % 5 === 0) tags.add("Organic");
  if (seed % 3 !== 0) tags.add("Delivery available");
  if (["Pomegranate", "Citrus", "Watermelon", "Apple"].includes(productType)) tags.add("Seasonal");
  return Array.from(tags).slice(0, 3);
}

function listingName(productType: string) {
  const names: Record<string, string> = {
    Tomato: "Fresh Tomatoes",
    Apple: "Red Apples",
    Potato: "Table Potatoes",
    Pomegranate: "Pomegranate",
    Cucumber: "Green Cucumbers",
    Grapes: "Table Grapes",
    Citrus: "Citrus Fruits",
    Watermelon: "Watermelon",
    Vegetables: "Mixed Vegetables",
    Fruits: "Seasonal Fruits",
    Onion: "Yellow Onions",
    Pepper: "Bell Peppers",
    Eggplant: "Eggplants",
    Pear: "Summer Pears",
    Cherry: "Sweet Cherries",
    Melon: "Melon",
    Greenhouse: "Greenhouse Produce",
  };
  return names[productType] ?? `Fresh ${productType}`;
}

function slugifyValue(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CANONICAL_PRODUCT_SLUGS: Record<string, string> = {
  "ali-hasanov:Tomatoes": "tomatoes-lankaran-green-farm",
  "ali-hasanov:Cucumbers": "cucumbers-hasanov-green-farm",
  "aysel-mammadova:Apples": "apples-aysel-mammadova",
  "leyla-abbasova:Potatoes": "potatoes-ganja-root-fields",
};

function makeProductSlug(
  productName: string,
  farmOrFarmerName: string,
  farmerSlug: string | null,
  usedSlugs: Set<string>,
): string {
  const overrideKey = farmerSlug ? `${farmerSlug}:${productName}` : null;
  if (overrideKey && CANONICAL_PRODUCT_SLUGS[overrideKey]) {
    return CANONICAL_PRODUCT_SLUGS[overrideKey];
  }

  const productPart = slugifyValue(productName);
  const suffix =
    farmerSlug && ["aysel-mammadova", "murad-karimov"].includes(farmerSlug)
      ? farmerSlug
      : slugifyValue(farmOrFarmerName);

  let slug = `${productPart}-${suffix}`;
  let attempt = 2;
  while (usedSlugs.has(slug)) {
    slug = `${productPart}-${suffix}-${attempt}`;
    attempt += 1;
  }
  usedSlugs.add(slug);
  return slug;
}

function productCategoryLabel(productType: string): string {
  if (["Tomato", "Potato", "Cucumber", "Vegetables", "Onion", "Pepper", "Eggplant", "Greenhouse"].includes(productType)) {
    return "Vegetables";
  }
  if (["Apple", "Pomegranate", "Grapes", "Citrus", "Fruits", "Pear", "Cherry", "Melon", "Watermelon"].includes(productType)) {
    return "Fruits";
  }
  return "Produce";
}

export function generateHarvestListings(): HarvestListing[] {
  const listings: HarvestListing[] = [];
  const usedSlugs = new Set<string>();
  let counter = 0;

  for (const farmer of allFarmers) {
    for (const product of farmer.products) {
      if (farmer.category === "Dairy Products") continue;
      const productType =
        product.category === "Fruits"
          ? product.name.toLowerCase().includes("apple")
            ? "Apple"
            : product.name.toLowerCase().includes("pomegranate") || product.name.toLowerCase().includes("nar")
              ? "Pomegranate"
              : "Fruits"
          : product.name.toLowerCase().includes("tomato")
            ? "Tomato"
            : product.name.toLowerCase().includes("potato")
              ? "Potato"
              : product.name.toLowerCase().includes("cucumber")
                ? "Cucumber"
                : "Vegetables";

      const farmName = farmer.farmDetails.farmName || farmer.name;

      listings.push({
        id: `farmer-${farmer.slug}-${counter++}`,
        slug: makeProductSlug(product.name, farmName, farmer.slug, usedSlugs),
        name: product.name,
        variety: resolveListingVariety(
          product.category,
          product.name,
          productType,
          counter,
        ),
        productType,
        economicRegion: farmer.economicRegion as EconomicRegion,
        district: farmer.districtCity,
        village: farmer.village ?? makeVillage(farmer.districtCity, counter),
        farmer: farmName,
        farmerSlug: farmer.slug,
        farmerVerified: true,
        quantity: product.available,
        pricePerKg: `${product.price} ${product.unit}`,
        harvestDate: "This week",
        tags: makeTags(productType, counter),
        image: productImageForType(productType),
        deliveryAvailable: true,
        description: product.description,
        unit: product.unit.replace("AZN/", ""),
        minimumOrder: farmer.farmDetails.minimumOrder,
        category: product.category,
      });
    }
  }

  for (const record of harvestData.districts) {
    if (!record.hasFreshProduce) continue;
    for (const productType of record.freshProducts) {
      const seed = hashString(`${record.district}-${productType}`);
      const farmerName = FARMER_NAMES[seed % FARMER_NAMES.length];
      const displayName = listingName(productType);

      listings.push({
        id: `excel-${record.district}-${productType}-${counter++}`,
        slug: makeProductSlug(displayName, farmerName, null, usedSlugs),
        name: displayName,
        variety: resolveListingVariety(
          productCategoryLabel(productType),
          displayName,
          productType,
          seed,
        ),
        productType,
        economicRegion: record.economicRegion as EconomicRegion,
        district: record.district,
        village: makeVillage(record.district, seed),
        farmer: farmerName,
        farmerSlug: null,
        farmerVerified: seed % 3 !== 0,
        quantity: makeQuantity(productType, seed),
        pricePerKg: makePrice(productType, seed),
        harvestDate: makeHarvestDate(seed),
        tags: makeTags(productType, seed),
        image: productImageForType(productType),
        deliveryAvailable: seed % 4 !== 0,
        description: `Fresh ${productType.toLowerCase()} from ${districtShortName(record.district)}, listed on Agrivo with regional traceability.`,
        unit: "kg",
        minimumOrder: "20 kg",
        category: productCategoryLabel(productType),
      });
    }
  }

  return listings;
}

export const harvestListings = generateHarvestListings();

export function getRegionRecord(region: EconomicRegion) {
  return harvestData.regions.find((entry) => entry.name === region);
}

export function getDistrictRecords(region: EconomicRegion) {
  return harvestData.districts.filter(
    (entry) => entry.economicRegion === region && entry.hasFreshProduce,
  );
}

export function getRegionInsight(region: EconomicRegion, listings: HarvestListing[]) {
  const regionListings = listings.filter((item) => item.economicRegion === region);
  const farmers = new Set(regionListings.map((item) => item.farmer)).size;
  const productCounts = regionListings.reduce<Record<string, number>>((acc, item) => {
    acc[item.productType] = (acc[item.productType] ?? 0) + 1;
    return acc;
  }, {});
  const topEntries = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const record = getRegionRecord(region);
  const summary =
    REGION_SUMMARIES[region] ??
    record?.topProducts.length
      ? `Known for ${record.topProducts.slice(0, 3).join(", ").toLowerCase()}.`
      : "Fresh fruit and vegetable supply for professional buyers.";

  return {
    summary,
    highlights: topEntries.map(([product, count]) => `${count} ${product.toLowerCase()} listings`),
    listingCount: regionListings.length,
    farmerCount: farmers,
    topProducts: topEntries.map(([product]) => product),
  };
}

export function getHeatmapIntensity(
  region: EconomicRegion,
  listings: HarvestListing[],
  productFilter: string | null,
) {
  const regionListings = listings.filter((item) => item.economicRegion === region);
  if (!productFilter) {
    return Math.min(1, regionListings.length / 40);
  }
  const matches = regionListings.filter(
    (item) => item.productType.toLowerCase() === productFilter.toLowerCase(),
  ).length;
  return Math.min(1, matches / 12);
}

export function matchesProductChip(listing: HarvestListing, chip: string | null) {
  if (!chip) return true;
  return listing.productType.toLowerCase() === chip.toLowerCase();
}

export function getProductBySlug(slug: string): HarvestListing | undefined {
  const normalized = decodeURIComponent(slug).toLowerCase();
  return harvestListings.find((listing) => listing.slug.toLowerCase() === normalized);
}

export function getProductDetailHash(slug: string): string {
  return `products/${slug}`;
}

export function getSimilarProducts(listing: HarvestListing, limit = 4): HarvestListing[] {
  const scored = harvestListings
    .filter((item) => item.id !== listing.id)
    .map((item) => {
      let score = 0;
      if (item.productType === listing.productType) score += 3;
      if (item.economicRegion === listing.economicRegion) score += 2;
      if (item.farmerSlug && item.farmerSlug === listing.farmerSlug) score += 4;
      if (item.category === listing.category) score += 1;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ item }) => item);
}

export function normalizeDistrictQuery(value: string) {
  return value
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/\s*rayonu|\s*şəhəri/g, "")
    .trim();
}
