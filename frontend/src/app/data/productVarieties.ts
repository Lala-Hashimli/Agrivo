import type { ProductFormCategory } from "../utils/farmerProductsStorage";

export const productVarieties = {
  fruits: {
    apple: [
      "Qızıl Əhmədi",
      "Ağ Alma",
      "Qırmızı Alma",
      "Simirenko",
      "Golden Delicious",
      "Starking",
      "Fuji",
      "Granny Smith",
      "Gala",
    ],
    pear: ["Abasbəyi", "Nar Armudu", "Meşə Gözəli", "Williams", "Conference", "Santa Maria"],
    pomegranate: [
      "Gülöyşə",
      "Vələs",
      "Şirin Nar",
      "Turş Nar",
      "Bala Mürsəl",
      "Azərbaycan Gülöyşəsi",
    ],
    grape: [
      "Ağ Şanı",
      "Qara Şanı",
      "Mədrəsə",
      "Bayan Şirə",
      "Saperavi",
      "Rkasiteli",
      "Təbrizi",
      "Ağadayı",
    ],
    persimmon: ["Xaçia", "Xiakume", "Sharon", "Korolyok"],
    peach: ["Ağ Şaftalı", "Sarı Şaftalı", "Nektarin", "Elberta", "Redhaven"],
    apricot: ["Şalax", "Ordubad Əriyi", "Badamı Ərik", "Ağ Ərik", "Qırmızı Ərik"],
    plum: ["Alça", "Göyəm", "Stanley", "Anna Shpet", "Sarı Gavalı", "Qara Gavalı"],
    cherry: ["Napoleon", "Ziraat 0900", "Qara Gilas", "Ağ Gilas", "Sarı Gilas"],
    "sour cherry": ["Morello", "Yerli Albalı", "Turş Albalı"],
    fig: ["Sarı Əncir", "Qara Əncir", "Abşeron Ənciri", "Buzovna Ənciri"],
    quince: ["Ordubad Heyvası", "Sarı Heyva", "Armudu Heyva"],
    watermelon: [
      "Sabirabad Qarpızı",
      "Zirə Qarpızı",
      "Crimson Sweet",
      "Charleston Gray",
      "Sugar Baby",
    ],
    melon: ["Azərbaycan Yemişi", "Kolxozçu", "Torpedo", "Ananas Yemişi", "Sarı Yemiş"],
  },
  vegetables: {
    tomato: [
      "Zirə Pomidoru",
      "Çerri Pomidor",
      "Çəhrayı Pomidor",
      "Qırmızı Pomidor",
      "Bizon",
      "Slivka",
      "Roma",
      "Beefsteak",
    ],
    cucumber: ["Xiyar", "Kornişon", "Uzun Xiyar", "İstixana Xiyarı", "Yerli Xiyar"],
    potato: ["Nevski", "Sante", "Arizona", "Gala", "Yerli Kartof", "Gədəbəy Kartofu", "Tovuz Kartofu"],
    onion: ["Ağ Soğan", "Qırmızı Soğan", "Sarı Soğan", "Şirin Soğan"],
    pepper: [
      "Şirin Bibər",
      "Acı Bibər",
      "Dolmalıq Bibər",
      "Kapya Bibər",
      "Yaşıl Bibər",
      "Qırmızı Bibər",
    ],
    eggplant: ["Uzun Badımcan", "Yumru Badımcan", "Qara Badımcan", "Yerli Badımcan"],
    carrot: ["Nantes", "Kuroda", "Şantenay", "Yerli Kök"],
    cabbage: ["Ağ Kələm", "Qırmızı Kələm", "Pekin Kələmi", "Gül Kələmi", "Brokoli"],
    garlic: ["Ağ Sarımsaq", "Qırmızı Sarımsaq", "Yerli Sarımsaq"],
    beans: ["Yaşıl Lobya", "Ağ Lobya", "Qırmızı Lobya", "Maş Lobya"],
  },
} as const;

export const productDisplayNames: Record<string, string> = {
  apple: "Apple",
  pear: "Pear",
  pomegranate: "Pomegranate",
  grape: "Grape",
  grapes: "Grape",
  persimmon: "Persimmon",
  peach: "Peach",
  apricot: "Apricot",
  plum: "Plum",
  cherry: "Cherry",
  "sour cherry": "Sour Cherry",
  fig: "Fig",
  quince: "Quince",
  watermelon: "Watermelon",
  melon: "Melon",
  tomato: "Tomato",
  cucumber: "Cucumber",
  potato: "Potato",
  onion: "Onion",
  pepper: "Pepper",
  eggplant: "Eggplant",
  carrot: "Carrot",
  cabbage: "Cabbage",
  garlic: "Garlic",
  beans: "Beans",
};

const PRODUCT_NAME_ALIASES: Record<string, string> = {
  apple: "apple",
  apples: "apple",
  pear: "pear",
  pears: "pear",
  pomegranate: "pomegranate",
  pomegranates: "pomegranate",
  nar: "pomegranate",
  grape: "grape",
  grapes: "grape",
  persimmon: "persimmon",
  peach: "peach",
  peaches: "peach",
  apricot: "apricot",
  apricots: "apricot",
  erik: "apricot",
  plum: "plum",
  plums: "plum",
  cherry: "cherry",
  cherries: "cherry",
  gilas: "cherry",
  "sour cherry": "sour cherry",
  albalı: "sour cherry",
  fig: "fig",
  figs: "fig",
  encir: "fig",
  quince: "quince",
  heyva: "quince",
  watermelon: "watermelon",
  watermelons: "watermelon",
  qarpız: "watermelon",
  melon: "melon",
  melons: "melon",
  yemiş: "melon",
  tomato: "tomato",
  tomatoes: "tomato",
  pomidor: "tomato",
  cucumber: "cucumber",
  cucumbers: "cucumber",
  xiyar: "cucumber",
  potato: "potato",
  potatoes: "potato",
  kartof: "potato",
  onion: "onion",
  onions: "onion",
  soğan: "onion",
  pepper: "pepper",
  peppers: "pepper",
  bibər: "pepper",
  eggplant: "eggplant",
  eggplants: "eggplant",
  badımcan: "eggplant",
  carrot: "carrot",
  carrots: "carrot",
  kök: "carrot",
  cabbage: "cabbage",
  kələm: "cabbage",
  garlic: "garlic",
  sarımsaq: "garlic",
  beans: "beans",
  lobya: "beans",
};

const HARVEST_TYPE_TO_KEY: Record<string, string> = {
  Tomato: "tomato",
  Apple: "apple",
  Potato: "potato",
  Pomegranate: "pomegranate",
  Cucumber: "cucumber",
  Grapes: "grape",
  Citrus: "pomegranate",
  Watermelon: "watermelon",
  Onion: "onion",
  Pepper: "pepper",
  Eggplant: "eggplant",
  Pear: "pear",
  Cherry: "cherry",
  Melon: "melon",
  Vegetables: "tomato",
  Fruits: "apple",
  Greenhouse: "tomato",
};

type VarietyGroup = keyof typeof productVarieties;

export function normalizeProductName(productName: string): string {
  return productName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g");
}

export function getProductKey(productName: string): string | null {
  const normalized = normalizeProductName(productName);
  if (!normalized) return null;
  if (PRODUCT_NAME_ALIASES[normalized]) {
    return PRODUCT_NAME_ALIASES[normalized];
  }
  if (normalized.includes("sour") && normalized.includes("cherry")) {
    return "sour cherry";
  }
  return PRODUCT_NAME_ALIASES[normalized.replace(/s$/, "")] ?? null;
}

export function getProductDisplayName(productKey: string): string {
  return productDisplayNames[productKey] ?? productKey.charAt(0).toUpperCase() + productKey.slice(1);
}

function categoryToGroup(category: string): VarietyGroup | null {
  const normalized = category.toLowerCase();
  if (normalized === "fruits" || normalized === "fruit") return "fruits";
  if (normalized === "vegetables" || normalized === "vegetable") return "vegetables";
  return null;
}

export function getProductNamesForCategory(category: ProductFormCategory | string): string[] {
  const group = categoryToGroup(category);
  if (!group) return [];
  const keys = Object.keys(productVarieties[group]) as Array<keyof (typeof productVarieties)[typeof group]>;
  return keys.map((key) => getProductDisplayName(String(key)));
}

export function getVarietiesByProduct(
  category: ProductFormCategory | string,
  productName: string,
): string[] {
  const group = categoryToGroup(category);
  if (!group || !productName.trim()) return [];

  const key = getProductKey(productName);
  if (!key) return [];

  const groupData = productVarieties[group] as Record<string, readonly string[]>;
  return [...(groupData[key] ?? [])];
}

export function supportsProductVarieties(category: ProductFormCategory | string): boolean {
  return categoryToGroup(category) !== null;
}

export function pickVarietyForProduct(
  category: string,
  productNameOrType: string,
  seed = 0,
): string | undefined {
  const varieties = getVarietiesByProduct(category, productNameOrType);
  if (varieties.length === 0) {
    const harvestKey = HARVEST_TYPE_TO_KEY[productNameOrType];
    if (harvestKey) {
      const group =
        ["Tomato", "Potato", "Cucumber", "Vegetables", "Onion", "Pepper", "Eggplant", "Greenhouse"].includes(
          productNameOrType,
        )
          ? "vegetables"
          : "fruits";
      const groupData = productVarieties[group] as Record<string, readonly string[]>;
      const list = groupData[harvestKey];
      if (list?.length) return list[seed % list.length];
    }
    return undefined;
  }
  return varieties[seed % varieties.length];
}

export const DEFAULT_VARIETY_BY_PRODUCT: Record<string, string> = {
  Tomatoes: "Zirə Pomidoru",
  Tomato: "Zirə Pomidoru",
  Cucumbers: "Kornişon",
  Cucumber: "Kornişon",
  Apples: "Qızıl Əhmədi",
  Apple: "Qızıl Əhmədi",
  Cherries: "Napoleon",
  Cherry: "Napoleon",
  Pears: "Nar Armudu",
  Pear: "Nar Armudu",
  Potatoes: "Gədəbəy Kartofu",
  Potato: "Gədəbəy Kartofu",
  Watermelon: "Sabirabad Qarpızı",
  Pomegranate: "Gülöyşə",
  Grapes: "Ağ Şanı",
  Grape: "Ağ Şanı",
};

export function resolveListingVariety(
  category: string,
  name: string,
  productType: string,
  seed = 0,
): string | undefined {
  const fromName = pickVarietyForProduct(category, name, seed);
  if (fromName) return fromName;
  const fromType = pickVarietyForProduct(
    productCategoryLabelFromType(productType),
    productType,
    seed,
  );
  if (fromType) return fromType;
  return DEFAULT_VARIETY_BY_PRODUCT[name] ?? DEFAULT_VARIETY_BY_PRODUCT[productType];
}

function productCategoryLabelFromType(productType: string): string {
  if (
    ["Tomato", "Potato", "Cucumber", "Vegetables", "Onion", "Pepper", "Eggplant", "Greenhouse"].includes(
      productType,
    )
  ) {
    return "Vegetables";
  }
  if (
    ["Apple", "Pomegranate", "Grapes", "Citrus", "Fruits", "Pear", "Cherry", "Melon", "Watermelon"].includes(
      productType,
    )
  ) {
    return "Fruits";
  }
  return "Fruits";
}
