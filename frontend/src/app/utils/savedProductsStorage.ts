import type { HarvestListing } from "../data/harvestExplorer";
import { districtShortName } from "../data/harvestExplorerUtils";

export interface SavedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  badge: string;
  farmer: string;
  farmerSlug: string | null;
  location: string;
  price: string;
  unit: string;
  quantity: string;
  deliveryAvailable: boolean;
  savedAt: string;
  economicRegion?: string;
  district?: string;
  variety?: string;
}

function storageKey(userId: string): string {
  return `agrivo_saved_products_${userId}`;
}

export function getSavedProducts(userId: string): SavedProduct[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedProduct[]) : [];
  } catch {
    return [];
  }
}

export function setSavedProducts(userId: string, products: SavedProduct[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(products));
}

export function isProductSaved(userId: string, slug: string): boolean {
  return getSavedProducts(userId).some((item) => item.slug === slug);
}

export function saveProduct(userId: string, product: SavedProduct): SavedProduct[] {
  const existing = getSavedProducts(userId);
  if (existing.some((item) => item.slug === product.slug)) {
    return existing;
  }
  const next = [{ ...product, savedAt: new Date().toISOString() }, ...existing];
  setSavedProducts(userId, next);
  return next;
}

export function removeSavedProduct(userId: string, slug: string): SavedProduct[] {
  const next = getSavedProducts(userId).filter((item) => item.slug !== slug);
  setSavedProducts(userId, next);
  return next;
}

export function clearSavedProducts(userId: string): void {
  localStorage.removeItem(storageKey(userId));
}

export function savedProductFromListing(listing: HarvestListing): SavedProduct {
  const location = `${listing.economicRegion} > ${districtShortName(listing.district)}${
    listing.village ? ` > ${listing.village}` : ""
  }`;
  const badge =
    listing.tags.find((tag) => tag !== "Verified farmer" && tag !== "Delivery available") ??
    (listing.farmerVerified ? "Verified farmer" : listing.tags[0] ?? "Fresh");

  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    category: listing.category ?? "Produce",
    image: listing.image,
    badge,
    farmer: listing.farmer,
    farmerSlug: listing.farmerSlug,
    location,
    price: listing.pricePerKg,
    unit: listing.unit ?? "kg",
    quantity: listing.quantity,
    deliveryAvailable: listing.deliveryAvailable,
    savedAt: new Date().toISOString(),
    economicRegion: listing.economicRegion,
    district: listing.district,
    variety: listing.variety,
  };
}

export function parsePriceValue(price: string): number {
  const match = price.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : 0;
}

export const SAVED_PRODUCTS_CHANGED_EVENT = "agrivo-saved-products-changed";

export function notifySavedProductsChanged(): void {
  window.dispatchEvent(new Event(SAVED_PRODUCTS_CHANGED_EVENT));
}
