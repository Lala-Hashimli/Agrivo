import { Heart, MapPin, Search, Trash2, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { getProductDetailHash } from "../../data/harvestExplorer";
import { useSavedProducts } from "../../context/SavedProductsContext";
import { ProductSaveButton } from "../products/ProductSaveButton";
import { ProductVarietyBadge } from "../products/ProductVarietyBadge";
import { ProductAddToCartButton } from "../products/ProductAddToCartButton";
import { ProductImage } from "../products/ProductImage";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { parsePriceValue, type SavedProduct } from "../../utils/savedProductsStorage";
import { cn } from "../ui/utils";

const filterControlClass =
  "agrivo-filter-control h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

type SortOption = "recent" | "price-asc" | "price-desc" | "name";

function formatSavedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function SavedProductCard({
  product,
  onRemove,
}: {
  product: SavedProduct;
  onRemove: (slug: string) => void;
}) {
  return (
    <article className="agrivo-saved-product-card agrivo-card">
      <div className="relative p-3 pb-0">
        <div className="agrivo-saved-product-image">
          <ProductImage
            name={product.name}
            src={product.image}
            category={product.category}
            alt={`${product.name} product image`}
            className="h-full w-full"
          />
        </div>
        <span className="agrivo-product-badge agrivo-product-badge--overlay">{product.badge}</span>
        <ProductSaveButton product={product} slug={product.slug} className="agrivo-product-save-btn--overlay" />
        <span className="agrivo-saved-product-saved-badge">
          <Heart className="h-3 w-3 fill-current" />
          Saved
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="flex items-center gap-1.5 text-sm text-[#6b7a70]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
          <span className="line-clamp-2">{product.location}</span>
        </p>

        <div className="agrivo-product-title-block">
          <h3 className="agrivo-heading line-clamp-2 min-h-[2.75rem] text-lg font-bold text-[#102018]">
            {product.name}
          </h3>
          <ProductVarietyBadge variety={product.variety} />
        </div>
        <p className="mt-1 text-sm text-[#5F6F64]">Farmer: {product.farmer}</p>

        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Price</p>
            <p className="mt-0.5 font-bold text-[#14532D]">{product.price}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Available</p>
            <p className="mt-0.5 font-semibold text-[#102018]">{product.quantity}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {product.deliveryAvailable ? (
            <span className="agrivo-saved-product-tag agrivo-saved-product-tag--delivery">
              <Truck className="h-3 w-3" />
              Delivery available
            </span>
          ) : (
            <span className="agrivo-saved-product-tag">Pickup only</span>
          )}
          <span className="text-xs text-[#6b7a70]">Saved {formatSavedDate(product.savedAt)}</span>
        </div>

        <div className="agrivo-saved-product-actions mt-auto pt-4">
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() => {
              window.location.hash = getProductDetailHash(product.slug);
            }}
          >
            View Details
          </Button>
          <ProductAddToCartButton
            product={product}
            className="rounded-full border border-[#dbe7d4] bg-white px-4 text-sm font-semibold text-[#14532D] hover:bg-[#EAF7EC]"
            label="Add to Cart"
          />
          <Button
            variant="outline"
            className="rounded-full border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
            onClick={() => onRemove(product.slug)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}

export function BuyerSavedProductsPage() {
  const { savedProducts, removeSaved } = useSavedProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState<SortOption>("recent");

  const regions = useMemo(() => {
    const set = new Set<string>();
    savedProducts.forEach((item) => {
      if (item.economicRegion) set.add(item.economicRegion);
      if (item.district) set.add(item.district);
    });
    return [...set].sort();
  }, [savedProducts]);

  const categories = useMemo(() => {
    const set = new Set(savedProducts.map((item) => item.category));
    return [...set].sort();
  }, [savedProducts]);

  const summary = useMemo(() => {
    const deliveryCount = savedProducts.filter((item) => item.deliveryAvailable).length;
    const verifiedFarmers = new Set(
      savedProducts.filter((item) => item.farmerSlug).map((item) => item.farmerSlug),
    ).size;
    return {
      total: savedProducts.length,
      deliveryCount,
      verifiedFarmers,
    };
  }, [savedProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = savedProducts.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (
        region !== "all" &&
        item.economicRegion !== region &&
        item.district !== region
      ) {
        return false;
      }
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        (item.variety?.toLowerCase().includes(query) ?? false) ||
        item.farmer.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });

    results = [...results].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return parsePriceValue(a.price) - parsePriceValue(b.price);
        case "price-desc":
          return parsePriceValue(b.price) - parsePriceValue(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
        default:
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
    });

    return results;
  }, [savedProducts, search, category, region, sort]);

  return (
    <div className="agrivo-buyer-saved space-y-6">
      <section className="agrivo-dashboard-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#15803d]">Saved Products</p>
        <h2 className="agrivo-heading mt-1 text-2xl font-bold text-[#102018] sm:text-3xl">Saved Products</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
          Products you saved from verified farmers for later ordering.
        </p>

        {savedProducts.length > 0 ? (
          <div className="agrivo-buyer-saved-summary mt-6">
            <div className="agrivo-buyer-saved-summary-card">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Saved Products</p>
              <p className="agrivo-heading mt-1 text-2xl font-bold text-[#102018]">{summary.total}</p>
            </div>
            <div className="agrivo-buyer-saved-summary-card">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Delivery Available</p>
              <p className="agrivo-heading mt-1 text-2xl font-bold text-[#102018]">{summary.deliveryCount}</p>
            </div>
            <div className="agrivo-buyer-saved-summary-card">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Verified Farmers</p>
              <p className="agrivo-heading mt-1 text-2xl font-bold text-[#102018]">{summary.verifiedFarmers}</p>
            </div>
          </div>
        ) : null}
      </section>

      {savedProducts.length > 0 ? (
        <section className="agrivo-dashboard-panel">
          <div className="agrivo-buyer-saved-filters">
            <div className="relative min-w-0 flex-1 sm:min-w-[240px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
              <Input
                className={`${filterControlClass} pl-11`}
                placeholder="Search saved products, farmers, or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={`${filterControlClass} w-full sm:w-[170px]`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className={`${filterControlClass} w-full sm:w-[180px]`}>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {regions.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className={`${filterControlClass} w-full sm:w-[170px]`}>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently saved</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      ) : null}

      {savedProducts.length === 0 ? (
        <section className="agrivo-dashboard-panel">
          <div className="agrivo-dashboard-empty py-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf5]">
              <Heart className="h-6 w-6 text-[#14532D]" />
            </div>
            <h3 className="agrivo-heading mt-4 text-xl font-bold text-[#102018]">No saved products yet</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5F6F64]">
              Save products from the marketplace to quickly find them later.
            </p>
            <Button
              className="mt-6 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={() => {
                window.location.hash = "products";
              }}
            >
              Browse Marketplace
            </Button>
          </div>
        </section>
      ) : filteredProducts.length > 0 ? (
        <div className={cn("agrivo-buyer-saved-grid")}>
          {filteredProducts.map((product) => (
            <SavedProductCard
              key={product.slug}
              product={product}
              onRemove={removeSaved}
            />
          ))}
        </div>
      ) : (
        <section className="agrivo-dashboard-panel">
          <div className="agrivo-dashboard-empty py-10">
            <h3 className="agrivo-heading text-lg font-bold text-[#102018]">No matches found</h3>
            <p className="mt-2 text-sm text-[#5F6F64]">Try adjusting your search or filters.</p>
            <Button
              variant="outline"
              className="mt-4 rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setRegion("all");
                setSort("recent");
              }}
            >
              Clear filters
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
