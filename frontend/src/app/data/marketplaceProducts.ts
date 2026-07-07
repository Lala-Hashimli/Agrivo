import { allFarmers, getFarmerBySlug, type FarmerProfile } from "./farmers";
import type { HarvestListing } from "./harvestExplorer";
import { districtShortName } from "./harvestExplorerUtils";

export interface MarketplaceProductDetail extends HarvestListing {
  locationPath: string;
  badge: string;
  priceDisplay: string;
  batchId: string;
  freshnessStatus: string;
  storageNote: string;
  estimatedDelivery: string;
  pickupAvailable: boolean;
  logisticsSupport: string;
  farmerProfile: FarmerProfile | null;
  farmerRating: number;
  farmerCompletedOrders: number;
  farmerSpecialization: string;
  farmerWhatsapp: string | null;
  farmerDisplayName: string;
}

function resolveFarmerProfile(listing: HarvestListing): FarmerProfile | null {
  if (listing.farmerSlug) {
    return getFarmerBySlug(listing.farmerSlug) ?? null;
  }
  return (
    allFarmers.find(
      (farmer) =>
        farmer.farmDetails.farmName === listing.farmer || farmer.name === listing.farmer,
    ) ?? null
  );
}

export function buildMarketplaceProductDetail(listing: HarvestListing): MarketplaceProductDetail {
  const farmerProfile = resolveFarmerProfile(listing);
  const locationPath = `${listing.economicRegion} > ${districtShortName(listing.district)}${
    listing.village ? ` > ${listing.village}` : ""
  }`;

  const badge =
    listing.tags.find((tag) => tag !== "Verified farmer" && tag !== "Delivery available") ??
    (listing.farmerVerified ? "Verified farmer" : listing.tags[0] ?? "Fresh");

  const priceDisplay = listing.pricePerKg.includes("AZN")
    ? listing.pricePerKg.replace("/", " / ")
    : `${listing.pricePerKg} AZN / kg`;

  const batchSuffix = listing.id.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();

  return {
    ...listing,
    locationPath,
    badge,
    priceDisplay,
    batchId: `AGR-PROD-${batchSuffix || "2048"}`,
    freshnessStatus: listing.harvestDate === "Today" ? "Harvested today" : "Recently harvested",
    storageNote:
      listing.productType === "Tomato" || listing.productType === "Cucumber"
        ? "Keep cool and dry"
        : listing.category === "Fruits"
          ? "Store in a cool place"
          : "Keep cool and dry",
    estimatedDelivery: listing.deliveryAvailable ? "1–2 days" : "Pickup only",
    pickupAvailable: true,
    logisticsSupport: listing.deliveryAvailable
      ? "Available through Agrivo"
      : "Pickup coordination only",
    farmerProfile,
    farmerRating: farmerProfile?.rating ?? 4.7,
    farmerCompletedOrders: farmerProfile?.completedOrders ?? 18,
    farmerSpecialization: farmerProfile?.specialties.join(", ") ?? listing.productType,
    farmerWhatsapp: farmerProfile?.whatsapp ?? null,
    farmerDisplayName: farmerProfile?.name ?? listing.farmer,
    category: listing.category ?? "Produce",
    minimumOrder: listing.minimumOrder ?? farmerProfile?.farmDetails.minimumOrder ?? "20 kg",
    unit: listing.unit ?? "kg",
  };
}
