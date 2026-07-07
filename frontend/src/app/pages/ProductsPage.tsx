import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Filter, Map, Search, SlidersHorizontal, Sprout, Truck, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AgrivoNavbar } from "../components/AgrivoNavbar";
import { HarvestListingCard } from "../components/harvest/HarvestListingCard";
import { HarvestMap } from "../components/harvest/HarvestMap";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { EconomicRegion } from "../data/azerbaijanRegions";
import { economicRegions, getDistrictsForRegion } from "../data/azerbaijanRegions";
import {
  PRODUCT_CHIPS,
  getDistrictRecords,
  getProductDetailHash,
  getRegionInsight,
  harvestListings,
  matchesProductChip,
  type HarvestListing,
} from "../data/harvestExplorer";
import { getFarmerBySlug } from "../data/farmers";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { districtShortName, districtsMatchGeo, formatProductTypeLabel } from "../data/harvestExplorerUtils";
import { isApiMode } from "../../config/dataMode";
import { getProducts, type ApiProduct } from "../../api/productsApi";

const PREVIEW_COUNT = 4;
const REMAINING_PAGE_SIZE = 12;
const MOBILE_PAGE_SIZE = 8;
const filterControlClass =
  "agrivo-marketplace-control h-11 w-full rounded-full border-[#D8E8D4] bg-[#F8FBF6] text-sm shadow-none transition-[border-color,box-shadow,background-color] duration-200 focus-visible:border-[#43A047] focus-visible:ring-[3px] focus-visible:ring-[#43A047]/15";

const heroStats = [
  { label: "1,250+ active produce listings" },
  { label: "320+ verified farmers" },
  { label: "14 economic regions" },
  { label: "Fresh products updated daily" },
];

function HarvestListingSkeleton() {
  return (
    <div className="agrivo-harvest-skeleton agrivo-product-card max-w-[340px] min-h-[540px] w-full overflow-hidden rounded-[30px] border border-[#e5efe1] bg-white p-3">
      <div className="agrivo-harvest-skeleton-block h-[232px] rounded-[22px]" />
      <div className="mt-4 space-y-3 px-2">
        <div className="agrivo-harvest-skeleton-block h-3 w-2/3 rounded-full" />
        <div className="agrivo-harvest-skeleton-block h-5 w-4/5 rounded-full" />
        <div className="agrivo-harvest-skeleton-block h-4 w-1/2 rounded-full" />
        <div className="mt-6 grid grid-cols-2 gap-2.5 pt-4">
          <div className="agrivo-harvest-skeleton-block h-11 rounded-full" />
          <div className="agrivo-harvest-skeleton-block h-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function sortListingsWithSelectedFirst(listings: HarvestListing[], selectedId: string | null) {
  if (!selectedId) return listings;
  const selected = listings.find((listing) => listing.id === selectedId);
  if (!selected) return listings;
  return [selected, ...listings.filter((listing) => listing.id !== selectedId)];
}

function mapCategoryToProductType(category: string): string {
  if (category.toLowerCase().includes("fruit")) return "Fruits";
  if (category.toLowerCase().includes("vegetable")) return "Vegetables";
  return category;
}

function mapApiProductToHarvestListing(product: ApiProduct): HarvestListing {
  const productType = mapCategoryToProductType(product.category);
  return {
    id: product.id,
    slug: product.id,
    name: product.name,
    productType,
    economicRegion: (product.region || "Bakı") as EconomicRegion,
    district: product.district || "Baku",
    village: product.village || "",
    farmer: product.farmer?.name || "Farmer",
    farmerSlug: null,
    farmerVerified: true,
    quantity: `${product.quantity} ${product.unit}`,
    pricePerKg: `${product.price} AZN/${product.unit}`,
    harvestDate: product.harvestDate || "This week",
    tags: [
      product.variety ? `Variety: ${product.variety}` : "Fresh",
      product.isOrganic ? "Organic" : "Verified farmer",
      product.availableNow ? "Available now" : "Pre-order",
    ],
    image: product.imageUrl || "",
    deliveryAvailable: true,
    description: product.description || undefined,
    unit: product.unit,
    minimumOrder: `1 ${product.unit}`,
    category: product.category,
    variety: product.variety || undefined,
  };
}

function HarvestListingGrid({
  listings,
  compact = false,
  selectedListingId = null,
  className = "agrivo-harvest-results-grid",
}: {
  listings: HarvestListing[];
  compact?: boolean;
  selectedListingId?: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      {listings.map((listing) => (
        <div key={listing.id} className="agrivo-harvest-grid-item h-full">
          <HarvestListingCard
            listing={listing}
            compact={compact}
            selected={selectedListingId === listing.id}
            onViewDetails={() => {
              window.location.hash = getProductDetailHash(listing.slug);
            }}
            onContactSeller={() => {
              if (listing.farmerSlug) {
                const farmer = getFarmerBySlug(listing.farmerSlug);
                if (farmer) {
                  window.open(buildWhatsAppUrl(farmer.whatsapp, farmer.name), "_blank", "noopener,noreferrer");
                  return;
                }
              }
              window.location.hash = "login";
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [apiListings, setApiListings] = useState<HarvestListing[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productChip, setProductChip] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState<EconomicRegion | "all">("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [villageFilter, setVillageFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REMAINING_PAGE_SIZE);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [panelHoveredDistrict, setPanelHoveredDistrict] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const sourceListings = isApiMode ? apiListings : harvestListings;

  const districtOptions = useMemo(
    () => (regionFilter === "all" ? [] : getDistrictsForRegion(regionFilter)),
    [regionFilter],
  );

  const regionStats = useMemo(() => {
    const stats: Partial<
      Record<
        EconomicRegion,
        { listingCount: number; farmerCount: number; topProducts: string[] }
      >
    > = {};
    for (const region of economicRegions) {
      const insight = getRegionInsight(region, sourceListings);
      stats[region] = {
        listingCount: insight.listingCount,
        farmerCount: insight.farmerCount,
        topProducts: insight.topProducts,
      };
    }
    return stats;
  }, [sourceListings]);

  const filteredListings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return sourceListings.filter((listing) => {
      const matchesQuery =
        !query ||
        listing.name.toLowerCase().includes(query) ||
        (listing.variety?.toLowerCase().includes(query) ?? false) ||
        listing.productType.toLowerCase().includes(query) ||
        listing.farmer.toLowerCase().includes(query) ||
        listing.district.toLowerCase().includes(query) ||
        listing.economicRegion.toLowerCase().includes(query);

      const matchesChip = matchesProductChip(listing, productChip);
      const matchesCategory =
        categoryFilter === "all" ||
        listing.productType.toLowerCase() === categoryFilter.toLowerCase() ||
        (categoryFilter === "Fruits" &&
          ["Apple", "Pomegranate", "Grapes", "Citrus", "Fruits", "Pear", "Cherry", "Melon"].includes(
            listing.productType,
          )) ||
        (categoryFilter === "Vegetables" &&
          ["Tomato", "Potato", "Cucumber", "Vegetables", "Onion", "Pepper", "Eggplant", "Greenhouse"].includes(
            listing.productType,
          ));

      const matchesRegion = regionFilter === "all" || listing.economicRegion === regionFilter;
      const matchesDistrict =
        districtFilter === "all" ||
        listing.district === districtFilter ||
        districtShortName(listing.district) === districtShortName(districtFilter) ||
        districtsMatchGeo(districtFilter, listing.district);

      const matchesVillage =
        !villageFilter.trim() || listing.village.toLowerCase().includes(villageFilter.toLowerCase());

      const matchesVerified = !verifiedOnly || listing.farmerVerified;
      const matchesDelivery = !deliveryOnly || listing.deliveryAvailable;

      return (
        matchesQuery &&
        matchesChip &&
        matchesCategory &&
        matchesRegion &&
        matchesDistrict &&
        matchesVillage &&
        matchesVerified &&
        matchesDelivery
      );
    });
  }, [
    categoryFilter,
    deliveryOnly,
    districtFilter,
    productChip,
    regionFilter,
    searchTerm,
    verifiedOnly,
    villageFilter,
    sourceListings,
  ]);

  const sortedFilteredListings = useMemo(
    () => sortListingsWithSelectedFirst(filteredListings, selectedProductId),
    [filteredListings, selectedProductId],
  );

  const previewListings = sortedFilteredListings.slice(0, PREVIEW_COUNT);
  const remainingListings = sortedFilteredListings.slice(PREVIEW_COUNT);
  const visibleRemaining = remainingListings.slice(0, visibleCount);
  const hasMoreRemaining = visibleCount < remainingListings.length;
  const mobileListings = sortedFilteredListings.slice(0, mobileVisibleCount);
  const hasMoreMobile = mobileVisibleCount < sortedFilteredListings.length;

  const quickStats = useMemo(() => {
    const farmers = new Set(filteredListings.map((listing) => listing.farmer)).size;
    const deliveryCount = filteredListings.filter((listing) => listing.deliveryAvailable).length;
    return {
      listings: filteredListings.length,
      farmers,
      deliveryCount,
    };
  }, [filteredListings]);

  const regionScopedListings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return sourceListings.filter((listing) => {
      if (regionFilter !== "all" && listing.economicRegion !== regionFilter) return false;

      const matchesQuery =
        !query ||
        listing.name.toLowerCase().includes(query) ||
        (listing.variety?.toLowerCase().includes(query) ?? false) ||
        listing.productType.toLowerCase().includes(query) ||
        listing.farmer.toLowerCase().includes(query) ||
        listing.district.toLowerCase().includes(query) ||
        listing.economicRegion.toLowerCase().includes(query);

      const matchesChip = matchesProductChip(listing, productChip);
      const matchesCategory =
        categoryFilter === "all" ||
        listing.productType.toLowerCase() === categoryFilter.toLowerCase() ||
        (categoryFilter === "Fruits" &&
          ["Apple", "Pomegranate", "Grapes", "Citrus", "Fruits", "Pear", "Cherry", "Melon"].includes(
            listing.productType,
          )) ||
        (categoryFilter === "Vegetables" &&
          ["Tomato", "Potato", "Cucumber", "Vegetables", "Onion", "Pepper", "Eggplant", "Greenhouse"].includes(
            listing.productType,
          ));

      const matchesVillage =
        !villageFilter.trim() || listing.village.toLowerCase().includes(villageFilter.toLowerCase());

      const matchesVerified = !verifiedOnly || listing.farmerVerified;
      const matchesDelivery = !deliveryOnly || listing.deliveryAvailable;

      return (
        matchesQuery && matchesChip && matchesCategory && matchesVillage && matchesVerified && matchesDelivery
      );
    });
  }, [
    categoryFilter,
    deliveryOnly,
    productChip,
    regionFilter,
    searchTerm,
    verifiedOnly,
    villageFilter,
    sourceListings,
  ]);

  const availableDistricts = useMemo(() => {
    if (regionFilter === "all") return [];

    const grouped = regionScopedListings.reduce<
      Record<
        string,
        {
          districtFull: string;
          shortName: string;
          count: number;
          productCounts: Record<string, number>;
        }
      >
    >((acc, listing) => {
      const key = listing.district;
      if (!acc[key]) {
        acc[key] = {
          districtFull: listing.district,
          shortName: districtShortName(listing.district),
          count: 0,
          productCounts: {},
        };
      }
      acc[key].count += 1;
      acc[key].productCounts[listing.productType] = (acc[key].productCounts[listing.productType] ?? 0) + 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .map((entry) => {
        const topProducts = Object.entries(entry.productCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([product]) => formatProductTypeLabel(product));
        return {
          ...entry,
          topProducts,
        };
      })
      .sort((a, b) => b.count - a.count || a.shortName.localeCompare(b.shortName));
  }, [regionFilter, regionScopedListings]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setProductChip(null);
    setCategoryFilter("all");
    setRegionFilter("all");
    setDistrictFilter("all");
    setVillageFilter("");
    setVerifiedOnly(false);
    setDeliveryOnly(false);
    setVisibleCount(REMAINING_PAGE_SIZE);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
    setSelectedProductId(null);
    setPanelHoveredDistrict(null);
  };

  const resetVisibleCount = () => {
    setVisibleCount(REMAINING_PAGE_SIZE);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  };

  const selectedInsight =
    regionFilter !== "all" ? getRegionInsight(regionFilter, filteredListings) : null;

  const districtRecords =
    regionFilter !== "all" ? getDistrictRecords(regionFilter) : [];

  useEffect(() => {
    if (!isApiMode) return;

    let mounted = true;
    setIsFetchingProducts(true);
    setApiError(null);

    getProducts()
      .then((products) => {
        if (!mounted) return;
        const mapped = products.map(mapApiProductToHarvestListing);
        if (import.meta.env.DEV) {
          console.info("[Products] API fetch success:", mapped.length);
        }
        setApiListings(mapped);
      })
      .catch((error) => {
        if (!mounted) return;
        if (import.meta.env.DEV) {
          console.error("[Products] API fetch failed:", error);
        }
        setApiError(error instanceof Error ? error.message : "Failed to load products.");
      })
      .finally(() => {
        if (mounted) {
          setIsFetchingProducts(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPanelHoveredDistrict(null);
    setSelectedProductId(null);
  }, [regionFilter]);

  useEffect(() => {
    setSelectedProductId(null);
  }, [districtFilter]);

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 380);
    return () => window.clearTimeout(timer);
  }, [
    searchTerm,
    productChip,
    categoryFilter,
    regionFilter,
    districtFilter,
    villageFilter,
    verifiedOnly,
    deliveryOnly,
  ]);

  const handleRegionSelect = (region: EconomicRegion | "all") => {
    setRegionFilter(region);
    setDistrictFilter("all");
    setSelectedProductId(null);
    setPanelHoveredDistrict(null);
    resetVisibleCount();
  };

  const handleDistrictSelect = (district: string | "all") => {
    if (district === "all") {
      setDistrictFilter("all");
      setPanelHoveredDistrict(null);
      setSelectedProductId(null);
      return;
    }
    const record = districtRecords.find((entry) => districtsMatchGeo(district, entry.district));
    setDistrictFilter(record?.district ?? district);
    setSelectedProductId(null);
    resetVisibleCount();
  };

  const handleProductSelect = useCallback((listing: HarvestListing | null) => {
    setSelectedProductId(listing?.id ?? null);
  }, []);

  const handleMapDistrictHover = (geoDistrict: string | null) => {
    if (!geoDistrict || regionFilter === "all") {
      setPanelHoveredDistrict(null);
      return;
    }
    const record = districtRecords.find((entry) => districtsMatchGeo(geoDistrict, entry.district));
    setPanelHoveredDistrict(record?.district ?? geoDistrict);
  };

  const selectionLabel =
    districtFilter !== "all"
      ? `${regionFilter} · ${districtShortName(districtFilter)}`
      : regionFilter !== "all"
        ? regionFilter
        : "All Azerbaijan";

  const resultsTitle =
    regionFilter === "all"
      ? "Fresh listings near you"
      : districtFilter !== "all"
        ? `Fresh produce available in ${districtShortName(districtFilter)}`
        : `Fresh produce available in ${regionFilter}`;

  const resultsSubtitle =
    regionFilter === "all"
      ? "Choose a region on the map or use filters to narrow fruit and vegetable results."
      : `${quickStats.listings} listings · ${quickStats.farmers} verified farmers · ${quickStats.deliveryCount} with delivery`;

  const allListingsTitle =
    regionFilter === "all"
      ? "Browse all available products"
      : districtFilter !== "all"
        ? `All listings in ${districtShortName(districtFilter)}`
        : `All listings in ${regionFilter}`;

  return (
    <div className="agrivo-shell agrivo-harvest-explorer min-h-screen">
      <AgrivoNavbar activeItem="marketplace" />
      <div className="agrivo-header-spacer" aria-hidden="true" />

      <div className="agrivo-container py-8 sm:py-10 lg:py-12">
        <section className="agrivo-harvest-hero">
          <div className="agrivo-harvest-hero-copy">
            <p className="agrivo-marketplace-eyebrow">Marketplace</p>
            <h1 className="agrivo-heading agrivo-harvest-hero-title">
              Discover Fresh Produce Across Azerbaijan
            </h1>
            <p className="agrivo-harvest-hero-subtitle">
              Search fruits and vegetables by region, district, village, category, or verified farmer.
            </p>

            <div className="agrivo-harvest-hero-search">
              <Search className="agrivo-harvest-hero-search-icon" strokeWidth={2} />
              <Input
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(REMAINING_PAGE_SIZE);
                  setMobileVisibleCount(MOBILE_PAGE_SIZE);
                }}
                placeholder="Search tomatoes, apples, potatoes, pomegranates…"
                className={filterControlClass}
              />
            </div>

            <div className="agrivo-harvest-chips">
              {PRODUCT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setProductChip(productChip === chip ? null : chip);
                    setCategoryFilter("all");
                    setVisibleCount(REMAINING_PAGE_SIZE);
                    setMobileVisibleCount(MOBILE_PAGE_SIZE);
                  }}
                  className={`agrivo-harvest-chip ${productChip === chip ? "agrivo-harvest-chip--active" : ""}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="agrivo-harvest-stats-card">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#15803d]">Harvest Explorer</p>
            <p className="mt-2 text-lg font-bold text-[#102018]">Marketplace snapshot</p>
            <ul className="mt-4 space-y-3">
              {heroStats.map((stat) => (
                <li key={stat.label} className="flex items-center gap-2 text-sm text-[#3f5247]">
                  <span className="h-2 w-2 rounded-full bg-[#43A047]" />
                  {stat.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="agrivo-harvest-filters" aria-label="Harvest Explorer filters">
          <div className="agrivo-harvest-filters-head">
            <div className="flex items-center gap-2 text-[#14532D]">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-semibold">Filter fresh produce</span>
            </div>
            <Button
              variant="ghost"
              className="hidden rounded-full text-sm text-[#14532D] hover:bg-[#EAF7EC] md:inline-flex"
              onClick={() => setShowMoreFilters((value) => !value)}
            >
              More filters
              <ChevronDown className={`ml-1 h-4 w-4 transition ${showMoreFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          <div className="agrivo-harvest-filters-grid">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={filterControlClass}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                {PRODUCT_CHIPS.map((chip) => (
                  <SelectItem key={chip} value={chip}>
                    {chip}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={regionFilter}
              onValueChange={(value) => handleRegionSelect(value as EconomicRegion | "all")}
            >
              <SelectTrigger className={filterControlClass}>
                <SelectValue placeholder="Economic Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {economicRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={districtFilter}
              onValueChange={handleDistrictSelect}
              disabled={regionFilter === "all"}
            >
              <SelectTrigger className={filterControlClass} disabled={regionFilter === "all"}>
                <SelectValue placeholder="District / City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All districts</SelectItem>
                {districtOptions.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="agrivo-harvest-more-filters-btn md:hidden"
              onClick={() => setShowMobileFilters((value) => !value)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <AnimatePresence>
            {(showMoreFilters || showMobileFilters) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="agrivo-harvest-more-filters overflow-hidden"
              >
                <div className="grid gap-3 pt-4 md:grid-cols-3">
                  <Input
                    placeholder="Village"
                    value={villageFilter}
                    onChange={(e) => setVillageFilter(e.target.value)}
                    className={filterControlClass}
                  />
                  <label className="flex items-center gap-2 rounded-full border border-[#e3ece0] bg-[#f8fbf6] px-4 py-2 text-sm text-[#3f5247]">
                    <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(Boolean(v))} />
                    Verified farmer only
                  </label>
                  <label className="flex items-center gap-2 rounded-full border border-[#e3ece0] bg-[#f8fbf6] px-4 py-2 text-sm text-[#3f5247]">
                    <Checkbox checked={deliveryOnly} onCheckedChange={(v) => setDeliveryOnly(Boolean(v))} />
                    Delivery available
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="agrivo-harvest-explorer-layout">
          <div className="agrivo-harvest-explorer-top">
            <aside
              className={`agrivo-harvest-explorer-pane ${showMobileMap ? "agrivo-harvest-explorer-pane--open" : ""}`}
            >
              <HarvestMap
                selectedRegion={regionFilter}
                selectedDistrict={districtFilter}
                selectedProductId={selectedProductId}
                productChip={productChip}
                listings={sourceListings}
                regionStats={regionStats}
                onRegionSelect={handleRegionSelect}
                onDistrictSelect={handleDistrictSelect}
                onProductSelect={handleProductSelect}
                panelHoveredDistrict={panelHoveredDistrict}
                onDistrictHover={handleMapDistrictHover}
              />

              <div className="agrivo-harvest-selection-card">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#15803d]">Current selection</p>
                <p className="mt-2 text-base font-bold text-[#102018]">{selectionLabel}</p>
                <div className="agrivo-harvest-quick-stats mt-3">
                  <div className="agrivo-harvest-quick-stat">
                    <Sprout className="h-4 w-4 text-[#43A047]" />
                    <span>
                      <strong>{quickStats.listings}</strong> listings
                    </span>
                  </div>
                  <div className="agrivo-harvest-quick-stat">
                    <Users className="h-4 w-4 text-[#43A047]" />
                    <span>
                      <strong>{quickStats.farmers}</strong> farmers
                    </span>
                  </div>
                  <div className="agrivo-harvest-quick-stat">
                    <Truck className="h-4 w-4 text-[#43A047]" />
                    <span>
                      <strong>{quickStats.deliveryCount}</strong> delivery
                    </span>
                  </div>
                </div>
                {(regionFilter !== "all" || districtFilter !== "all" || productChip) && (
                  <Button
                    variant="outline"
                    className="agrivo-harvest-reset-btn mt-4 w-full"
                    onClick={clearAllFilters}
                  >
                    Reset selection
                  </Button>
                )}
              </div>

              {selectedInsight && regionFilter !== "all" ? (
                <div className="agrivo-harvest-insight-card">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#15803d]">What grows here?</p>
                  <p className="mt-2 text-sm leading-6 text-[#3f5247]">{selectedInsight.summary}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#5F6F64]">
                    Top local products
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {selectedInsight.highlights.map((item) => (
                      <li key={item} className="text-sm text-[#102018]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {availableDistricts.length > 0 ? (
                <div className="agrivo-harvest-district-panel">
                  <div className="agrivo-harvest-district-panel-head">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#15803d]">
                      Available Districts
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#5F6F64]">
                      Quick filter — click a district to browse listings
                    </p>
                  </div>

                  {districtFilter !== "all" ? (
                    <button
                      type="button"
                      className="agrivo-harvest-district-clear"
                      onClick={() => handleDistrictSelect("all")}
                    >
                      View all districts in {regionFilter}
                    </button>
                  ) : null}

                  <ul className="agrivo-harvest-district-list">
                    {availableDistricts.map((item) => {
                      const isSelected =
                        districtFilter !== "all" && districtsMatchGeo(item.districtFull, districtFilter);
                      const isHovered =
                        panelHoveredDistrict !== null &&
                        districtsMatchGeo(item.districtFull, panelHoveredDistrict);

                      return (
                        <li key={item.districtFull}>
                          <button
                            type="button"
                            className={`agrivo-harvest-district-row ${isSelected ? "agrivo-harvest-district-row--selected" : ""} ${isHovered && !isSelected ? "agrivo-harvest-district-row--hovered" : ""}`}
                            onClick={() => handleDistrictSelect(item.districtFull)}
                            onMouseEnter={() => setPanelHoveredDistrict(item.districtFull)}
                            onMouseLeave={() => setPanelHoveredDistrict(null)}
                            onFocus={() => setPanelHoveredDistrict(item.districtFull)}
                            onBlur={() => setPanelHoveredDistrict(null)}
                          >
                            <span className="agrivo-harvest-district-row-main">
                              <span className="agrivo-harvest-district-name">{item.shortName}</span>
                              <span className="agrivo-harvest-district-meta">
                                {item.count} {item.count === 1 ? "listing" : "listings"}
                                {item.topProducts.length > 0 ? ` · ${item.topProducts.join(", ")}` : ""}
                              </span>
                            </span>
                            <ChevronRight className="agrivo-harvest-district-arrow h-4 w-4 shrink-0" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </aside>

            <div className="agrivo-harvest-preview">
              <div className="agrivo-harvest-results-head">
                <div>
                  <h2 className="text-xl font-bold text-[#102018] sm:text-2xl">{resultsTitle}</h2>
                  <p className="mt-1 text-sm text-[#5F6F64]">{resultsSubtitle}</p>
                </div>
              </div>

              {apiError ? (
                <div className="agrivo-marketplace-empty">
                  <h3 className="text-xl font-semibold text-[#102018]">Unable to load products</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#5F6F64]">
                    {apiError}
                  </p>
                </div>
              ) : isLoading || isFetchingProducts ? (
                <div className="agrivo-harvest-preview-grid">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <HarvestListingSkeleton key={index} />
                  ))}
                </div>
              ) : filteredListings.length > 0 ? (
                <>
                  <HarvestListingGrid
                    listings={previewListings}
                    compact
                    selectedListingId={selectedProductId}
                    className="agrivo-harvest-preview-grid"
                  />
                </>
              ) : (
                <div className="agrivo-marketplace-empty">
                  <h3 className="text-xl font-semibold text-[#102018]">No fresh produce found</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#5F6F64]">
                    No fresh produce found in this area. Try another region or remove filters.
                  </p>
                  <Button variant="outline" className="agrivo-marketplace-load-more-btn mt-6" onClick={clearAllFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="agrivo-harvest-mobile-listings lg:hidden">
            {apiError ? (
              <div className="agrivo-marketplace-empty">
                <h3 className="text-xl font-semibold text-[#102018]">Unable to load products</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#5F6F64]">
                  {apiError}
                </p>
              </div>
            ) : isLoading || isFetchingProducts ? (
              <div className="agrivo-harvest-all-grid">
                {Array.from({ length: 4 }).map((_, index) => (
                  <HarvestListingSkeleton key={index} />
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <>
                <div className="agrivo-harvest-all-listings-head">
                  <h2 className="text-xl font-bold text-[#102018]">{allListingsTitle}</h2>
                  <p className="mt-1 text-sm text-[#5F6F64]">
                    Showing {mobileListings.length} of {filteredListings.length}
                  </p>
                </div>
                <HarvestListingGrid
                  listings={mobileListings}
                  selectedListingId={selectedProductId}
                  className="agrivo-harvest-all-grid"
                />
                {hasMoreMobile ? (
                  <div className="agrivo-marketplace-load-more">
                    <Button
                      variant="outline"
                      className="agrivo-marketplace-load-more-btn"
                      onClick={() => setMobileVisibleCount((count) => count + MOBILE_PAGE_SIZE)}
                    >
                      Load More Products
                    </Button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          {remainingListings.length > 0 ? (
            <section id="harvest-all-listings" className="agrivo-harvest-all-listings agrivo-scroll-anchor hidden lg:block">
              <div className="agrivo-harvest-all-listings-head">
                <div>
                  <h2 className="text-xl font-bold text-[#102018] sm:text-2xl">{allListingsTitle}</h2>
                  <p className="mt-1 text-sm text-[#5F6F64]">
                    {remainingListings.length} more listings across the selected area
                  </p>
                </div>
                <p className="agrivo-harvest-all-listings-count text-sm text-[#5F6F64]">
                  Showing <span className="font-semibold text-[#102018]">{visibleRemaining.length}</span> of{" "}
                  <span className="font-semibold text-[#102018]">{remainingListings.length}</span>
                </p>
              </div>

              {isLoading || isFetchingProducts ? (
                <div className="agrivo-harvest-all-grid">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <HarvestListingSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <>
                  <HarvestListingGrid
                    listings={visibleRemaining}
                    selectedListingId={selectedProductId}
                    className="agrivo-harvest-all-grid"
                  />
                  {hasMoreRemaining ? (
                    <div className="agrivo-marketplace-load-more agrivo-marketplace-load-more--all-listings">
                      <Button
                        variant="outline"
                        className="agrivo-marketplace-load-more-btn"
                        onClick={() => setVisibleCount((count) => count + REMAINING_PAGE_SIZE)}
                      >
                        Load More Products
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          ) : null}
        </section>
      </div>

      <div className="agrivo-harvest-mobile-bar">
        <Button
          variant="outline"
          className="agrivo-harvest-mobile-bar-btn"
          onClick={() => {
            setShowMobileFilters((value) => !value);
            setShowMobileMap(false);
          }}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="outline"
          className="agrivo-harvest-mobile-bar-btn"
          onClick={() => {
            setShowMobileMap((value) => !value);
            setShowMobileFilters(false);
          }}
        >
          <Map className="mr-2 h-4 w-4" />
          Map
        </Button>
      </div>
    </div>
  );
}
