/**
 * Central product image mapping for Agrivo marketplace and dashboards.
 * Uses high-quality Unsplash crops matched to product names.
 */

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=600&q=80`;

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  tomato: UNSPLASH("photo-1546470427-e5b6d7b1f210"),
  tomatoes: UNSPLASH("photo-1546470427-e5b6d7b1f210"),
  apple: UNSPLASH("photo-1560806887-1e4cd0b6cbd6"),
  apples: UNSPLASH("photo-1560806887-1e4cd0b6cbd6"),
  potato: UNSPLASH("photo-1518977676601-b53f82aba655"),
  potatoes: UNSPLASH("photo-1518977676601-b53f82aba655"),
  pomegranate: UNSPLASH("photo-1601000938215-0f99d5646a8c"),
  pomegranates: UNSPLASH("photo-1601000938215-0f99d5646a8c"),
  cucumber: UNSPLASH("photo-1604977042946-1eecc30f269e"),
  cucumbers: UNSPLASH("photo-1604977042946-1eecc30f269e"),
  grape: UNSPLASH("photo-1534485539238-6333012e12f5"),
  grapes: UNSPLASH("photo-1534485539238-6333012e12f5"),
  citrus: UNSPLASH("photo-1547514704-5ce1f8837929"),
  watermelon: UNSPLASH("photo-1587049352851-8d4e89133924"),
  watermelons: UNSPLASH("photo-1587049352851-8d4e89133924"),
  onion: UNSPLASH("photo-1518977956812-ed9e623bdb33"),
  onions: UNSPLASH("photo-1518977956812-ed9e623bdb33"),
  pepper: UNSPLASH("photo-1563565375-3a989d140095"),
  peppers: UNSPLASH("photo-1563565375-3a989d140095"),
  eggplant: UNSPLASH("photo-1615484477778-f29f8e8e23a9"),
  eggplants: UNSPLASH("photo-1615484477778-f29f8e8e23a9"),
  pear: UNSPLASH("photo-1631160299919-6e6b581baf6b"),
  pears: UNSPLASH("photo-1631160299919-6e6b581baf6b"),
  cherry: UNSPLASH("photo-1528821125874-a2a9c5a8b5d0"),
  cherries: UNSPLASH("photo-1528821125874-a2a9c5a8b5d0"),
  melon: UNSPLASH("photo-1571771894821-ce9b6bd11d08"),
  melons: UNSPLASH("photo-1571771894821-ce9b6bd11d08"),
  carrot: UNSPLASH("photo-1598170845058-32b9d6a543fa"),
  carrots: UNSPLASH("photo-1598170845058-32b9d6a543fa"),
  cabbage: UNSPLASH("photo-1594282298734-2fd14dc8a3ce"),
  spinach: UNSPLASH("photo-1576045057624-7c7696632670"),
  mango: UNSPLASH("photo-1605027990129-448c3aee9892"),
  rice: UNSPLASH("photo-1536304993881-ff6e9eefa2a6"),
  wheat: UNSPLASH("photo-1574323347407-f5e1ad6d020b"),
  grains: UNSPLASH("photo-1574323347407-f5e1ad6d020b"),
  honey: UNSPLASH("photo-1587049353244-05a5fe3770b2"),
  milk: UNSPLASH("photo-1563636619-e9143da0873f"),
  dairy: UNSPLASH("photo-1563636619-e9143da0873f"),
  vegetables: UNSPLASH("photo-1576045057624-7c7696632670"),
  fruits: UNSPLASH("photo-1619566636852-1565c4c4b4c4"),
  greenhouse: UNSPLASH("photo-1416879595882-3373a048048b"),
  produce: UNSPLASH("photo-1488459716781-31db52582fe9"),
};

export const DEFAULT_PRODUCT_IMAGE = PRODUCT_IMAGE_MAP.produce;

function normalizeProductKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function singularize(word: string): string {
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function lookupKey(key: string): string | undefined {
  if (!key) return undefined;
  if (PRODUCT_IMAGE_MAP[key]) return PRODUCT_IMAGE_MAP[key];
  const singular = singularize(key);
  if (PRODUCT_IMAGE_MAP[singular]) return PRODUCT_IMAGE_MAP[singular];
  return undefined;
}

function matchFromTokens(value: string): string | undefined {
  const key = normalizeProductKey(value);
  if (!key) return undefined;

  const direct = lookupKey(key);
  if (direct) return direct;

  for (const word of key.split(" ")) {
    const match = lookupKey(word);
    if (match) return match;
  }

  return undefined;
}

/** Category-based fallback when product name cannot be matched exactly. */
export function getCategoryFallbackImage(category?: string): string {
  const key = normalizeProductKey(category ?? "");
  if (!key) return DEFAULT_PRODUCT_IMAGE;

  const direct = lookupKey(key);
  if (direct) return direct;

  if (key.includes("fruit") || key.includes("orchard") || key.includes("berry")) {
    return PRODUCT_IMAGE_MAP.fruits;
  }
  if (
    key.includes("vegetable") ||
    key.includes("greenhouse") ||
    key.includes("herb") ||
    key.includes("leaf")
  ) {
    return PRODUCT_IMAGE_MAP.vegetables;
  }
  if (key.includes("dairy") || key.includes("milk")) {
    return PRODUCT_IMAGE_MAP.dairy;
  }
  if (key.includes("grain") || key.includes("wheat") || key.includes("rice")) {
    return PRODUCT_IMAGE_MAP.wheat;
  }

  return DEFAULT_PRODUCT_IMAGE;
}

function isUserUploadedImage(src?: string | null): boolean {
  const value = src?.trim();
  if (!value) return false;
  return value.startsWith("data:") || value.startsWith("blob:");
}

/** Resolve a product image URL from name and optional category. */
export function getProductImage(productName: string, category?: string): string {
  const fromName = matchFromTokens(productName);
  if (fromName) return fromName;

  if (category) {
    const fromCategory = matchFromTokens(category);
    if (fromCategory) return fromCategory;
    return getCategoryFallbackImage(category);
  }

  return DEFAULT_PRODUCT_IMAGE;
}

/** Resolve image: prefer user uploads, otherwise mapped product image. */
export function resolveProductImage(
  productName: string,
  src?: string | null,
  category?: string,
): string {
  if (isUserUploadedImage(src)) {
    return src!.trim();
  }
  return getProductImage(productName, category);
}

/** Build fallback chain for graceful image error handling. */
export function getProductImageFallbackChain(
  productName: string,
  category?: string,
  explicitFallback?: string,
): string[] {
  const chain = [
    explicitFallback,
    getProductImage(productName, category),
    getCategoryFallbackImage(category),
    DEFAULT_PRODUCT_IMAGE,
  ].filter((value): value is string => Boolean(value?.trim()));

  return [...new Set(chain)];
}
