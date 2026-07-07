import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Handshake,
  MessageCircle,
  Package,
  Pencil,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { economicRegions, getDistrictsForRegion } from "../../data/azerbaijanRegions";
import {
  acceptBulkOffer,
  cancelBulkOrder,
  createBulkOrder,
  formatBulkDate,
  fulfillBulkOrder,
  getBestOffer,
  getBulkOrderSummary,
  getBulkOrders,
  updateBulkOrder,
  type BulkFarmerOffer,
  type BulkOrder,
  type BulkOrderCategory,
  type BulkOrderFormInput,
  type BulkOrderUnit,
} from "../../utils/bulkOrdersStorage";
import { BuyerBulkOrderStatusBadge } from "./BuyerBulkOrderStatusBadge";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { cn } from "../ui/utils";

const filterControlClass =
  "agrivo-filter-control h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

const BULK_CATEGORIES: BulkOrderCategory[] = ["Vegetables", "Fruits", "Dairy Products"];
const UNITS: BulkOrderUnit[] = ["kg", "liter", "box", "jar"];
const STATUS_FILTERS = [
  "all",
  "Open",
  "Offers Received",
  "Accepted",
  "In Progress",
  "Fulfilled",
  "Cancelled",
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];
type SortOption = "newest" | "oldest";

const EMPTY_FORM: BulkOrderFormInput = {
  productName: "",
  category: "Vegetables",
  quantity: 0,
  unit: "kg",
  preferredRegion: "all",
  preferredDistrict: "",
  deliveryLocation: "",
  neededBy: "",
  maxPrice: "",
  deliveryRequired: true,
  notes: "",
};

interface FormErrors {
  productName?: string;
  category?: string;
  quantity?: string;
  unit?: string;
  deliveryLocation?: string;
  neededBy?: string;
}

function validateForm(input: BulkOrderFormInput): FormErrors {
  const errors: FormErrors = {};
  if (!input.productName.trim()) errors.productName = "Product is required";
  if (!input.category) errors.category = "Category is required";
  if (!input.quantity || input.quantity <= 0) errors.quantity = "Quantity must be greater than 0";
  if (!input.unit) errors.unit = "Unit is required";
  if (!input.deliveryLocation.trim()) errors.deliveryLocation = "Delivery location is required";
  if (!input.neededBy) errors.neededBy = "Needed by date is required";
  return errors;
}

function BulkSummaryCards({ orders }: { orders: BulkOrder[] }) {
  const summary = useMemo(() => getBulkOrderSummary(orders), [orders]);

  const cards = [
    { label: "Active Requests", value: summary.activeRequests, icon: ClipboardList },
    { label: "Offers Received", value: summary.offersReceived, icon: Handshake },
    { label: "Accepted Deals", value: summary.acceptedDeals, icon: CheckCircle2 },
    { label: "Completed Bulk Orders", value: summary.completedOrders, icon: Package },
  ];

  return (
    <div className="agrivo-bulk-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="agrivo-bulk-summary-card agrivo-card">
            <div className="agrivo-bulk-summary-card-icon">
              <Icon className="h-5 w-5 text-[#14532D]" />
            </div>
            <p className="agrivo-bulk-summary-card-label">{card.label}</p>
            <p className="agrivo-bulk-summary-card-value">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function BulkOrderForm({
  initial,
  editingId,
  onSubmit,
  onCancel,
}: {
  initial?: BulkOrderFormInput;
  editingId?: string | null;
  onSubmit: (input: BulkOrderFormInput, editingId?: string | null) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<BulkOrderFormInput>(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(initial ?? EMPTY_FORM);
    setErrors({});
  }, [initial, editingId]);

  const districts = useMemo(() => {
    const region = form.preferredRegion === "all" ? "all" : form.preferredRegion;
    return getDistrictsForRegion(region as "all" | (typeof economicRegions)[number]);
  }, [form.preferredRegion]);

  const update = <K extends keyof BulkOrderFormInput>(key: K, value: BulkOrderFormInput[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "preferredRegion") {
        next.preferredDistrict = "";
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(form, editingId);
    if (!editingId) {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  };

  return (
    <form className="agrivo-bulk-form agrivo-dashboard-panel" onSubmit={handleSubmit} id="bulk-order-form">
      <h3 className="agrivo-bulk-form-title">
        {editingId ? "Edit Bulk Order Request" : "Create Bulk Order Request"}
      </h3>

      <div className="agrivo-bulk-form-grid">
        <div className="agrivo-bulk-form-field">
          <Label htmlFor="bulk-product">Product needed</Label>
          <Input
            id="bulk-product"
            value={form.productName}
            onChange={(e) => update("productName", e.target.value)}
            placeholder="e.g. Tomatoes, Apples, Potatoes"
            className="agrivo-bulk-input"
          />
          {errors.productName ? <p className="agrivo-bulk-field-error">{errors.productName}</p> : null}
        </div>

        <div className="agrivo-bulk-form-field">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v as BulkOrderCategory)}>
            <SelectTrigger className={filterControlClass}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {BULK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? <p className="agrivo-bulk-field-error">{errors.category}</p> : null}
        </div>

        <div className="agrivo-bulk-form-field">
          <Label htmlFor="bulk-quantity">Quantity</Label>
          <Input
            id="bulk-quantity"
            type="number"
            min={1}
            value={form.quantity || ""}
            onChange={(e) => update("quantity", Number.parseInt(e.target.value, 10) || 0)}
            placeholder="300"
            className="agrivo-bulk-input"
          />
          {errors.quantity ? <p className="agrivo-bulk-field-error">{errors.quantity}</p> : null}
        </div>

        <div className="agrivo-bulk-form-field">
          <Label>Unit</Label>
          <Select value={form.unit} onValueChange={(v) => update("unit", v as BulkOrderUnit)}>
            <SelectTrigger className={filterControlClass}>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit ? <p className="agrivo-bulk-field-error">{errors.unit}</p> : null}
        </div>

        <div className="agrivo-bulk-form-field">
          <Label>Preferred economic region</Label>
          <Select value={form.preferredRegion} onValueChange={(v) => update("preferredRegion", v)}>
            <SelectTrigger className={filterControlClass}>
              <SelectValue placeholder="Select region" />
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
        </div>

        <div className="agrivo-bulk-form-field">
          <Label>Preferred district / city</Label>
          <Select
            value={form.preferredDistrict || "none"}
            onValueChange={(v) => update("preferredDistrict", v === "none" ? "" : v)}
          >
            <SelectTrigger className={filterControlClass}>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Any district</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="agrivo-bulk-form-field agrivo-bulk-form-field--wide">
          <Label htmlFor="bulk-delivery">Delivery location</Label>
          <Input
            id="bulk-delivery"
            value={form.deliveryLocation}
            onChange={(e) => update("deliveryLocation", e.target.value)}
            placeholder="e.g. Baku, Nizami district, market warehouse"
            className="agrivo-bulk-input"
          />
          {errors.deliveryLocation ? (
            <p className="agrivo-bulk-field-error">{errors.deliveryLocation}</p>
          ) : null}
        </div>

        <div className="agrivo-bulk-form-field">
          <Label htmlFor="bulk-needed-by">Needed by date</Label>
          <Input
            id="bulk-needed-by"
            type="date"
            value={form.neededBy}
            onChange={(e) => update("neededBy", e.target.value)}
            className="agrivo-bulk-input"
          />
          {errors.neededBy ? <p className="agrivo-bulk-field-error">{errors.neededBy}</p> : null}
        </div>

        <div className="agrivo-bulk-form-field">
          <Label htmlFor="bulk-max-price">Maximum price per unit</Label>
          <Input
            id="bulk-max-price"
            value={form.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="e.g. 1.50 AZN / kg"
            className="agrivo-bulk-input"
          />
          <p className="agrivo-bulk-field-hint">Recommended for better farmer offers</p>
        </div>

        <div className="agrivo-bulk-form-field">
          <Label>Delivery required?</Label>
          <RadioGroup
            value={form.deliveryRequired ? "yes" : "no"}
            onValueChange={(v) => update("deliveryRequired", v === "yes")}
            className="agrivo-bulk-radio-group"
          >
            <label className="agrivo-bulk-radio-option">
              <RadioGroupItem value="yes" />
              <span>Yes</span>
            </label>
            <label className="agrivo-bulk-radio-option">
              <RadioGroupItem value="no" />
              <span>No</span>
            </label>
          </RadioGroup>
        </div>

        <div className="agrivo-bulk-form-field agrivo-bulk-form-field--full">
          <Label htmlFor="bulk-notes">Notes</Label>
          <Textarea
            id="bulk-notes"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="e.g. Need firm tomatoes suitable for market resale. Delivery before 10 AM preferred."
            className="agrivo-bulk-textarea"
          />
        </div>
      </div>

      <div className="agrivo-bulk-form-actions">
        {editingId && onCancel ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={onCancel}
          >
            Cancel edit
          </Button>
        ) : null}
        <Button type="submit" className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]">
          {editingId ? "Save Changes" : "Create Bulk Order"}
        </Button>
      </div>
    </form>
  );
}

function OfferCard({
  offer,
  order,
  onAccept,
}: {
  offer: BulkFarmerOffer;
  order: BulkOrder;
  onAccept: () => void;
}) {
  const isAccepted = offer.accepted;

  return (
    <article className={cn("agrivo-bulk-offer-card", isAccepted && "agrivo-bulk-offer-card--accepted")}>
      <div className="agrivo-bulk-offer-card-header">
        <div>
          <p className="agrivo-bulk-offer-farmer">{offer.farmerName}</p>
          {offer.verified ? (
            <p className="agrivo-bulk-offer-verified">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified Farmer
            </p>
          ) : null}
        </div>
        {isAccepted ? (
          <span className="agrivo-bulk-offer-accepted-badge">Accepted</span>
        ) : null}
      </div>

      <dl className="agrivo-bulk-offer-details">
        <div>
          <dt>Price</dt>
          <dd>{offer.pricePerUnit}</dd>
        </div>
        <div>
          <dt>Available</dt>
          <dd>
            {offer.availableQuantity} {offer.unit}
          </dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>{offer.deliveryAvailable ? "Available" : "Pickup only"}</dd>
        </div>
        <div>
          <dt>Est. delivery</dt>
          <dd>{offer.estimatedDelivery}</dd>
        </div>
      </dl>

      <div className="agrivo-bulk-offer-actions">
        {!isAccepted && order.status !== "Cancelled" && order.status !== "Fulfilled" ? (
          <Button
            size="sm"
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={onAccept}
          >
            Accept Offer
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={() => {
            window.location.hash = `farmers/${offer.farmerSlug}`;
          }}
        >
          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
          Contact Farmer
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={() => {
            window.location.hash = `farmers/${offer.farmerSlug}`;
          }}
        >
          View Farmer Profile
        </Button>
      </div>
    </article>
  );
}

function BulkOrderCard({
  order,
  onViewOffers,
  onEdit,
  onCancel,
  onFulfill,
}: {
  order: BulkOrder;
  onViewOffers: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onFulfill: () => void;
}) {
  const bestOffer = getBestOffer(order);
  const regionLabel =
    order.preferredRegion === "all"
      ? "All regions"
      : `${order.preferredRegion}${order.preferredDistrict ? ` · ${order.preferredDistrict}` : ""}`;

  return (
    <article className="agrivo-bulk-order-card agrivo-card">
      <div className="agrivo-bulk-order-card-header">
        <div>
          <h4 className="agrivo-bulk-order-card-title">
            {order.productName} · {order.quantity} {order.unit}
          </h4>
          <p className="agrivo-bulk-order-card-meta">Created {formatBulkDate(order.createdAt)}</p>
        </div>
        <BuyerBulkOrderStatusBadge status={order.status} />
      </div>

      <dl className="agrivo-bulk-order-card-details">
        <div>
          <dt>Category</dt>
          <dd>{order.category}</dd>
        </div>
        <div>
          <dt>Preferred region</dt>
          <dd>{regionLabel}</dd>
        </div>
        <div>
          <dt>Delivery to</dt>
          <dd>{order.deliveryLocation}</dd>
        </div>
        <div>
          <dt>Needed by</dt>
          <dd>{formatBulkDate(order.neededBy)}</dd>
        </div>
        {order.maxPrice ? (
          <div>
            <dt>Max price</dt>
            <dd>{order.maxPrice}</dd>
          </div>
        ) : null}
        <div>
          <dt>Offers</dt>
          <dd>{order.offersCount} farmer offer{order.offersCount === 1 ? "" : "s"}</dd>
        </div>
      </dl>

      {bestOffer && order.offersCount > 0 ? (
        <div className="agrivo-bulk-order-best-offer">
          <p className="agrivo-bulk-order-best-offer-label">Best offer</p>
          <p className="agrivo-bulk-order-best-offer-value">
            {bestOffer.farmerName} · {bestOffer.pricePerUnit}
          </p>
          <p className="agrivo-bulk-order-best-offer-meta">
            Available: {bestOffer.availableQuantity} {bestOffer.unit}
            {bestOffer.deliveryAvailable ? " · Delivery available" : " · Pickup only"}
          </p>
        </div>
      ) : null}

      <div className="agrivo-bulk-order-card-actions">
        <Button
          size="sm"
          className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
          onClick={onViewOffers}
          disabled={order.offersCount === 0}
        >
          View Offers
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={onEdit}
          disabled={order.status === "Cancelled" || order.status === "Fulfilled"}
        >
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit Request
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
          onClick={onCancel}
          disabled={order.status === "Cancelled" || order.status === "Fulfilled"}
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={onFulfill}
          disabled={order.status === "Cancelled" || order.status === "Fulfilled"}
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Mark as Fulfilled
        </Button>
      </div>
    </article>
  );
}

export function BuyerBulkOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [offersOrder, setOffersOrder] = useState<BulkOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<BulkOrder | null>(null);

  const refresh = useCallback(() => {
    if (!user?.id) {
      setOrders([]);
      return;
    }
    setOrders(getBulkOrders(user.id));
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const handleFormSubmit = (input: BulkOrderFormInput, editingId?: string | null) => {
    if (!user?.id) return;

    if (editingId) {
      updateBulkOrder(user.id, editingId, input);
      setEditingOrder(null);
      showToast("Bulk order request updated");
    } else {
      createBulkOrder(user.id, input);
      showToast("Bulk order request created");
    }
    refresh();
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (categoryFilter !== "all" && order.category !== categoryFilter) return false;
      if (!query) return true;
      return (
        order.productName.toLowerCase().includes(query) ||
        order.deliveryLocation.toLowerCase().includes(query) ||
        order.preferredRegion.toLowerCase().includes(query)
      );
    });

    results = [...results].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sort === "newest" ? bTime - aTime : aTime - bTime;
    });

    return results;
  }, [orders, search, statusFilter, categoryFilter, sort]);

  const editFormInitial = useMemo((): BulkOrderFormInput | undefined => {
    if (!editingOrder) return undefined;
    return {
      productName: editingOrder.productName,
      category: editingOrder.category,
      quantity: editingOrder.quantity,
      unit: editingOrder.unit,
      preferredRegion: editingOrder.preferredRegion,
      preferredDistrict: editingOrder.preferredDistrict,
      deliveryLocation: editingOrder.deliveryLocation,
      neededBy: editingOrder.neededBy,
      maxPrice: editingOrder.maxPrice,
      deliveryRequired: editingOrder.deliveryRequired,
      notes: editingOrder.notes,
    };
  }, [editingOrder]);

  const scrollToForm = () => {
    document.getElementById("bulk-order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="agrivo-buyer-bulk space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}

      <div className="agrivo-dashboard-page-header">
        <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">Bulk Orders</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
          Create large product requests and receive offers from verified farmers.
        </p>
      </div>

      <BulkSummaryCards orders={orders} />

      <BulkOrderForm
        key={editingOrder?.id ?? "create"}
        initial={editFormInitial}
        editingId={editingOrder?.id ?? null}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingOrder(null)}
      />

      <section className="agrivo-bulk-orders-section">
        <div className="agrivo-bulk-orders-section-header">
          <h3 className="agrivo-bulk-orders-section-title">My Bulk Orders</h3>
          {orders.length > 0 ? (
            <p className="agrivo-bulk-orders-section-meta">{filteredOrders.length} request{filteredOrders.length === 1 ? "" : "s"}</p>
          ) : null}
        </div>

        {orders.length > 0 ? (
          <div className="agrivo-bulk-filters agrivo-dashboard-panel">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product or location"
                className={cn(filterControlClass, "pl-10")}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className={cn(filterControlClass, "w-full sm:w-44")}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All statuses" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={cn(filterControlClass, "w-full sm:w-40")}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {BULK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className={cn(filterControlClass, "w-full sm:w-40")}>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {orders.length === 0 ? (
          <div className="agrivo-bulk-empty agrivo-dashboard-panel">
            <div className="agrivo-bulk-empty-icon">
              <Truck className="h-7 w-7 text-[#14532D]" />
            </div>
            <h4 className="agrivo-bulk-empty-title">No bulk orders yet</h4>
            <p className="agrivo-bulk-empty-text">
              Create your first bulk request and receive offers from verified farmers.
            </p>
            <Button
              className="mt-5 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={scrollToForm}
            >
              Create Bulk Order
            </Button>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="agrivo-bulk-orders-list">
            {filteredOrders.map((order) => (
              <BulkOrderCard
                key={order.id}
                order={order}
                onViewOffers={() => setOffersOrder(order)}
                onEdit={() => {
                  setEditingOrder(order);
                  scrollToForm();
                }}
                onCancel={() => {
                  if (!user?.id) return;
                  cancelBulkOrder(user.id, order.id);
                  refresh();
                  showToast("Bulk order cancelled");
                }}
                onFulfill={() => {
                  if (!user?.id) return;
                  fulfillBulkOrder(user.id, order.id);
                  refresh();
                  showToast("Bulk order marked as fulfilled");
                }}
              />
            ))}
          </div>
        ) : (
          <div className="agrivo-bulk-empty agrivo-dashboard-panel py-10">
            <h4 className="agrivo-bulk-empty-title">No matches found</h4>
            <p className="agrivo-bulk-empty-text">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      <Dialog open={!!offersOrder} onOpenChange={(open) => !open && setOffersOrder(null)}>
        <DialogContent className="agrivo-bulk-offers-dialog sm:max-w-2xl">
          {offersOrder ? (
            <>
              <DialogHeader>
                <DialogTitle className="agrivo-heading text-xl font-bold text-[#102018]">
                  Farmer Offers
                </DialogTitle>
                <DialogDescription className="text-sm text-[#5F6F64]">
                  {offersOrder.productName} · {offersOrder.quantity} {offersOrder.unit} —{" "}
                  {offersOrder.offersCount} offer{offersOrder.offersCount === 1 ? "" : "s"} received
                </DialogDescription>
              </DialogHeader>
              <div className="agrivo-bulk-offers-list">
                {offersOrder.offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    order={offersOrder}
                    onAccept={() => {
                      if (!user?.id) return;
                      acceptBulkOffer(user.id, offersOrder.id, offer.id);
                      refresh();
                      setOffersOrder((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: "Accepted",
                              offers: prev.offers.map((o) => ({
                                ...o,
                                accepted: o.id === offer.id,
                              })),
                            }
                          : null,
                      );
                      showToast("Offer accepted");
                    }}
                  />
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                  onClick={() => setOffersOrder(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
