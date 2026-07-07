import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Package,
  PackagePlus,
  Pause,
  Pencil,
  Play,
  Search,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getProductDetailHash } from "../../data/harvestExplorer";
import { getFarmerSectionHash } from "../../data/farmerDashboard";
import {
  archiveFarmerProduct,
  computeProductsSummary,
  filterAndSortProducts,
  getDisplayStatus,
  getFarmerProductEditHash,
  getFarmerProducts,
  resolveFarmerProductsUserId,
  updateFarmerProduct,
  type FarmerListingProduct,
  type FarmerProductCategory,
  type FarmerProductDisplayStatus,
  type ProductSortOption,
} from "../../utils/farmerProductsStorage";
import { FarmerProductStatusBadge } from "./FarmerProductStatusBadge";
import { ProductVarietyBadge } from "../products/ProductVarietyBadge";
import { ProductImage } from "../products/ProductImage";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { cn } from "../ui/utils";
import { isApiMode } from "../../../config/dataMode";
import {
  deleteProduct as deleteApiProduct,
  getFarmerProducts as getFarmerProductsApi,
  updateProduct as updateApiProduct,
  type ApiProduct,
} from "../../../api/productsApi";

const filterClass =
  "agrivo-filter-control h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

const CATEGORIES: Array<FarmerProductCategory | "all"> = [
  "all",
  "Vegetables",
  "Fruits",
  "Dairy Products",
  "Grains",
  "Herbs",
  "Other",
];

const STATUS_FILTERS: Array<FarmerProductDisplayStatus | "all" | "Low stock"> = [
  "all",
  "Active",
  "Draft",
  "Inactive",
  "Low stock",
  "Out of Stock",
];

const SORT_OPTIONS: Array<{ value: ProductSortOption; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "name", label: "Name A-Z" },
  { value: "price-asc", label: "Price low to high" },
  { value: "stock-asc", label: "Stock low to high" },
];

function navigate(hash: string) {
  window.location.hash = hash;
}

function StockUpdateDialog({
  open,
  product,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  product: FarmerListingProduct | null;
  onOpenChange: (open: boolean) => void;
  onSave: (quantity: number, note: string) => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open && product) {
      setQuantity(String(product.availableQuantity));
      setNote("");
    }
  }, [open, product]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-profile-dialog sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            Update Stock
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            Update available quantity for {product.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div>
            <Label>Current quantity</Label>
            <p className="mt-1 text-sm font-semibold text-[#102018]">
              {product.availableQuantity} {product.unit}
            </p>
          </div>
          <div>
            <Label htmlFor="stock-qty">New quantity</Label>
            <Input
              id="stock-qty"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1.5 h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
            />
          </div>
          <div>
            <Label htmlFor="stock-unit">Unit</Label>
            <Input
              id="stock-unit"
              value={product.unit}
              disabled
              className="mt-1.5 h-11 rounded-xl border-[#DEECE0] bg-[#eef4ea]"
            />
          </div>
          <div>
            <Label htmlFor="stock-note">Note (optional)</Label>
            <Textarea
              id="stock-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Restocked after morning harvest"
              className="mt-1.5 min-h-[72px] rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() => {
              const next = Number(quantity);
              if (!Number.isFinite(next) || next < 0) return;
              onSave(next, note);
              onOpenChange(false);
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ArchiveConfirmDialog({
  open,
  productName,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  productName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-profile-dialog sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            Archive listing
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            Are you sure you want to remove this product listing? {productName} will be archived and
            hidden from the marketplace.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full bg-[#b91c1c] text-white hover:bg-[#991b1b]"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Archive Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductManagementCard({
  product,
  onQuickSave,
  onOpenStock,
  onToggleListing,
  onArchive,
  onEdit,
}: {
  product: FarmerListingProduct;
  onQuickSave: (id: string, price: number, quantity: number) => void;
  onOpenStock: (product: FarmerListingProduct) => void;
  onToggleListing: (product: FarmerListingProduct) => void;
  onArchive: (product: FarmerListingProduct) => void;
  onEdit: (product: FarmerListingProduct) => void;
}) {
  const [quickEdit, setQuickEdit] = useState(false);
  const [priceDraft, setPriceDraft] = useState(String(product.price));
  const [qtyDraft, setQtyDraft] = useState(String(product.availableQuantity));
  const displayStatus = getDisplayStatus(product);
  const isPaused = product.listingStatus === "inactive";

  useEffect(() => {
    setPriceDraft(String(product.price));
    setQtyDraft(String(product.availableQuantity));
  }, [product.price, product.availableQuantity]);

  const handleQuickSave = () => {
    const price = Number(priceDraft);
    const qty = Number(qtyDraft);
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(qty) || qty < 0) return;
    onQuickSave(product.id, price, qty);
    setQuickEdit(false);
  };

  return (
    <article className="agrivo-farmer-product-mgmt-card">
      <div className="agrivo-farmer-product-mgmt-main">
        <div className="agrivo-farmer-product-mgmt-thumb">
          <ProductImage
            name={product.name}
            src={product.image}
            category={product.category}
            alt={product.name}
            className="h-full w-full"
          />
        </div>

        <div className="agrivo-farmer-product-mgmt-info min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="agrivo-product-title-block !mt-0">
                <h3 className="agrivo-heading text-lg font-bold text-[#102018]">{product.name}</h3>
                <ProductVarietyBadge variety={product.variety} label="Variety" />
              </div>
              <p className="mt-1 text-sm text-[#5F6F64]">
                {product.category} · {product.locationDetail}
              </p>
              <p className="text-xs text-[#6b7a70]">{product.location}</p>
            </div>
            <FarmerProductStatusBadge status={displayStatus} />
          </div>

          {quickEdit ? (
            <div className="agrivo-farmer-quick-edit mt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Price (AZN / {product.unit})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    value={priceDraft}
                    onChange={(e) => setPriceDraft(e.target.value)}
                    className="mt-1 h-10 rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
                  />
                </div>
                <div>
                  <Label className="text-xs">Available ({product.unit})</Label>
                  <Input
                    type="number"
                    min={0}
                    value={qtyDraft}
                    onChange={(e) => setQtyDraft(e.target.value)}
                    className="mt-1 h-10 rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                  onClick={handleQuickSave}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                  onClick={() => {
                    setPriceDraft(String(product.price));
                    setQtyDraft(String(product.availableQuantity));
                    setQuickEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <dl className="agrivo-farmer-product-mgmt-meta mt-4">
              <div>
                <dt>Price</dt>
                <dd>
                  {product.price.toFixed(2)} AZN / {product.unit}
                </dd>
              </div>
              <div>
                <dt>Available</dt>
                <dd>
                  {product.availableQuantity} {product.unit}
                </dd>
              </div>
              <div>
                <dt>Minimum order</dt>
                <dd>
                  {product.minimumOrder} {product.unit}
                </dd>
              </div>
              <div>
                <dt>Harvested</dt>
                <dd>{product.harvestDate}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt>Delivery</dt>
                <dd>{product.deliveryAvailable ? "Available" : "Pickup only"}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="agrivo-farmer-product-mgmt-actions">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onEdit(product)}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => navigate(getProductDetailHash(product.slug))}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            View Product
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenStock(product)}
          >
            Update Stock
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => setQuickEdit((v) => !v)}
          >
            Quick Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onToggleListing(product)}
          >
            {isPaused ? (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Activate Listing
              </>
            ) : (
              <>
                <Pause className="mr-1.5 h-3.5 w-3.5" />
                Pause Listing
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
            onClick={() => onArchive(product)}
          >
            <Archive className="mr-1.5 h-3.5 w-3.5" />
            Archive
          </Button>
        </div>
      </div>

      {displayStatus === "Low Stock" || displayStatus === "Out of Stock" ? (
        <div
          className={cn(
            "agrivo-farmer-product-alert",
            displayStatus === "Out of Stock" && "agrivo-farmer-product-alert--danger",
          )}
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {displayStatus === "Out of Stock"
              ? "This product is out of stock. Update quantity or pause the listing."
              : "Low stock warning — consider restocking soon."}
          </span>
          <button
            type="button"
            className="ml-auto text-xs font-semibold text-[#14532D] hover:underline"
            onClick={() => onOpenStock(product)}
          >
            Update stock
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function FarmerProductsPage() {
  const { user } = useAuth();
  const userId = user ? resolveFarmerProductsUserId(user) : null;

  const [products, setProducts] = useState<FarmerListingProduct[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FarmerProductCategory | "all">("all");
  const [status, setStatus] = useState<FarmerProductDisplayStatus | "all" | "Low stock">("all");
  const [sort, setSort] = useState<ProductSortOption>("newest");
  const [toast, setToast] = useState<string | null>(null);
  const [stockProduct, setStockProduct] = useState<FarmerListingProduct | null>(null);
  const [archiveProduct, setArchiveProduct] = useState<FarmerListingProduct | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const mapApiProductToFarmerListing = useCallback((product: ApiProduct): FarmerListingProduct => {
    const listingStatus =
      product.status === "draft" ? "draft" : product.status === "inactive" ? "inactive" : "active";
    return {
      id: product.id,
      slug: `api-${product.id}`,
      name: product.name,
      variety: product.variety || undefined,
      category: (product.category === "Dairy" ? "Dairy Products" : product.category) as FarmerProductCategory,
      image: product.imageUrl || "",
      price: product.price,
      unit: product.unit,
      availableQuantity: product.quantity,
      minimumOrder: 1,
      harvestDate: product.harvestDate || "This week",
      listingStatus,
      deliveryAvailable: true,
      description: product.description || "",
      location: product.district || product.region || "Azerbaijan",
      locationDetail: product.region || "Farm",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
      lowStockThreshold: 20,
      region: product.region || undefined,
      district: product.district || undefined,
      productTags: [
        product.isFresh ? "Fresh" : "Available Now",
        product.isOrganic ? "Organic" : "Available Now",
      ].filter(Boolean) as ("Fresh" | "Organic" | "Available Now")[],
      deliveryOption: "Farmer delivery",
    };
  }, []);

  const refresh = useCallback(() => {
    if (!userId) return;
    if (isApiMode) {
      setApiError(null);
      getFarmerProductsApi(userId)
        .then((items) => setProducts(items.map(mapApiProductToFarmerListing)))
        .catch((error) =>
          setApiError(error instanceof Error ? error.message : "Failed to load products."),
        );
      return;
    }
    setProducts(getFarmerProducts(userId));
  }, [mapApiProductToFarmerListing, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const filtered = useMemo(
    () => filterAndSortProducts(products, { search, category, status, sort }),
    [products, search, category, status, sort],
  );

  const summary = useMemo(() => computeProductsSummary(products), [products]);

  const summaryCards = [
    {
      label: "Active Listings",
      value: String(summary.activeListings),
      hint: "Visible in marketplace",
      icon: Package,
    },
    {
      label: "Total Stock",
      value: `${summary.totalStockKg} kg`,
      hint: "Across all listings",
      icon: ClipboardList,
    },
    {
      label: "Low Stock",
      value: String(summary.lowStock),
      hint: "Needs restocking",
      icon: AlertTriangle,
    },
    {
      label: "Draft / Inactive",
      value: String(summary.draftInactive),
      hint: "Not fully live",
      icon: Pause,
    },
    {
      label: "This Week Sales",
      value: `${summary.weekSalesKg} kg`,
      hint: "Estimated volume",
      icon: TrendingUp,
    },
  ];

  const persistUpdate = (productId: string, updates: Partial<FarmerListingProduct>, message: string) => {
    if (!userId) return;
    if (isApiMode) {
      updateApiProduct(productId, {
        price: updates.price,
        quantity: updates.availableQuantity,
        status: updates.listingStatus,
      })
        .then(() => {
          refresh();
          showToast(message);
        })
        .catch((error) =>
          setApiError(error instanceof Error ? error.message : "Failed to update product."),
        );
      return;
    }
    const next = updateFarmerProduct(userId, productId, updates);
    setProducts(next);
    showToast(message);
  };

  const handleQuickSave = (id: string, price: number, quantity: number) => {
    persistUpdate(id, { price, availableQuantity: quantity }, "Product updated successfully.");
  };

  const handleStockSave = (quantity: number) => {
    if (!stockProduct) return;
    persistUpdate(stockProduct.id, { availableQuantity: quantity }, "Stock updated successfully.");
  };

  const handleToggleListing = (product: FarmerListingProduct) => {
    const nextStatus = product.listingStatus === "inactive" ? "active" : "inactive";
    persistUpdate(
      product.id,
      { listingStatus: nextStatus },
      nextStatus === "active" ? "Listing activated." : "Listing paused.",
    );
  };

  const handleArchive = () => {
    if (!userId || !archiveProduct) return;
    if (isApiMode) {
      deleteApiProduct(archiveProduct.id)
        .then(() => {
          refresh();
          showToast("Product archived successfully.");
        })
        .catch((error) =>
          setApiError(error instanceof Error ? error.message : "Failed to archive product."),
        );
      return;
    }
    const next = archiveFarmerProduct(userId, archiveProduct.id);
    setProducts(next);
    showToast("Product archived successfully.");
  };

  const handleEdit = (product: FarmerListingProduct) => {
    navigate(getFarmerProductEditHash(product.id));
  };

  if (!userId) return null;

  const hasAnyProducts = products.some((p) => !p.archived);

  return (
    <div className="agrivo-farmer-products space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}
      {apiError ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
          {apiError}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">My Products</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
            Manage your product listings, stock, prices, and marketplace visibility.
          </p>
        </div>
        <Button
          className="agrivo-button-soft shrink-0 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
          onClick={() => navigate(getFarmerSectionHash("add-product"))}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {hasAnyProducts ? (
        <>
          <section className="agrivo-farmer-product-stats">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="agrivo-farmer-product-stat-card agrivo-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfdf5]">
                      <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={1.75} />
                    </div>
                    <span className="agrivo-heading text-2xl font-bold text-[#102018]">{card.value}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#102018]">{card.label}</p>
                  <p className="mt-0.5 text-xs text-[#6b7a70]">{card.hint}</p>
                </div>
              );
            })}
          </section>

          <section className="agrivo-dashboard-panel">
            <div className="agrivo-farmer-product-filters">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] pl-10 text-sm"
                />
              </div>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as FarmerProductCategory | "all")}
              >
                <SelectTrigger className={cn(filterClass, "w-full sm:w-[180px]")}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "all" ? "All categories" : item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={status}
                onValueChange={(v) =>
                  setStatus(v as FarmerProductDisplayStatus | "all" | "Low stock")
                }
              >
                <SelectTrigger className={cn(filterClass, "w-full sm:w-[160px]")}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "all" ? "All statuses" : item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as ProductSortOption)}>
                <SelectTrigger className={cn(filterClass, "w-full sm:w-[180px]")}>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="mt-4 text-sm text-[#6b7a70]">
              Showing {filtered.length} of {products.filter((p) => !p.archived).length} listings
            </p>

            {filtered.length > 0 ? (
              <div className="mt-4 space-y-4">
                {filtered.map((product) => (
                  <ProductManagementCard
                    key={product.id}
                    product={product}
                    onQuickSave={handleQuickSave}
                    onOpenStock={setStockProduct}
                    onToggleListing={handleToggleListing}
                    onArchive={setArchiveProduct}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="agrivo-dashboard-empty mt-6 py-10">
                <p className="text-sm text-[#5F6F64]">No products match your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="agrivo-dashboard-panel agrivo-dashboard-empty py-16">
          <Package className="mx-auto h-10 w-10 text-[#43A047]" />
          <h3 className="agrivo-heading mt-4 text-xl font-bold text-[#102018]">No products listed yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5F6F64]">
            Add your first product to start selling through Agrivo marketplace.
          </p>
          <Button
            className="mt-6 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() => navigate(getFarmerSectionHash("add-product"))}
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      )}

      <StockUpdateDialog
        open={Boolean(stockProduct)}
        product={stockProduct}
        onOpenChange={(open) => {
          if (!open) setStockProduct(null);
        }}
        onSave={handleStockSave}
      />

      <ArchiveConfirmDialog
        open={Boolean(archiveProduct)}
        productName={archiveProduct?.name ?? ""}
        onOpenChange={(open) => {
          if (!open) setArchiveProduct(null);
        }}
        onConfirm={handleArchive}
      />
    </div>
  );
}
