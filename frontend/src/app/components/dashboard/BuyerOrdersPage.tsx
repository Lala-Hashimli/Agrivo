import { MessageCircle, RotateCcw, Search, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { isApiMode } from "../../../config/dataMode";
import { getOrders, type ApiOrder } from "../../../api/ordersApi";
import {
  getAllBuyerOrders,
  buyerOrderTimelineLabels,
  getBuyerOrderDetailHash,
  isActiveBuyerOrder,
  showsOrderTimeline,
  type BuyerOrder,
  type BuyerOrderStatus,
} from "../../data/buyerDashboard";
import { BuyerOrderStatusBadge } from "./BuyerOrderStatusBadge";
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
import { cn } from "../ui/utils";

type OrderTab = "all" | "active" | "in-transit" | "delivered" | "cancelled";

const filterTriggerClass =
  "agrivo-filter-control h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

const tabs: Array<{ id: OrderTab; label: string }> = [
  { id: "all", label: "All Orders" },
  { id: "active", label: "Active" },
  { id: "in-transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

function getTabCount(tab: OrderTab, orders: BuyerOrder[]): number {
  switch (tab) {
    case "all":
      return orders.length;
    case "active":
      return orders.filter((o) => isActiveBuyerOrder(o.status)).length;
    case "in-transit":
      return orders.filter((o) => o.status === "In Transit").length;
    case "delivered":
      return orders.filter((o) => o.status === "Delivered").length;
    case "cancelled":
      return orders.filter((o) => o.status === "Cancelled").length;
    default:
      return 0;
  }
}

function matchesTab(order: BuyerOrder, tab: OrderTab): boolean {
  switch (tab) {
    case "all":
      return true;
    case "active":
      return isActiveBuyerOrder(order.status);
    case "in-transit":
      return order.status === "In Transit";
    case "delivered":
      return order.status === "Delivered";
    case "cancelled":
      return order.status === "Cancelled";
    default:
      return true;
  }
}

function OrderTimeline({ timelineIndex }: { timelineIndex: number }) {
  return (
    <div className="agrivo-buyer-order-timeline">
      {buyerOrderTimelineLabels.map((label, index) => {
        const isDone = index < timelineIndex;
        const isCurrent = index === timelineIndex;

        return (
          <div key={label} className="agrivo-buyer-order-timeline-step">
            <div className="agrivo-buyer-order-timeline-marker-wrap">
              <span
                className={cn(
                  "agrivo-buyer-order-timeline-marker",
                  isDone && "agrivo-buyer-order-timeline-marker--done",
                  isCurrent && "agrivo-buyer-order-timeline-marker--current",
                )}
              />
              {index < buyerOrderTimelineLabels.length - 1 ? (
                <span
                  className={cn(
                    "agrivo-buyer-order-timeline-line",
                    isDone && "agrivo-buyer-order-timeline-line--done",
                  )}
                />
              ) : null}
            </div>
            <p
              className={cn(
                "text-[10px] font-semibold sm:text-xs",
                isCurrent ? "text-[#14532D]" : isDone ? "text-[#166534]" : "text-[#9ca3af]",
              )}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: BuyerOrder }) {
  const isDelivered = order.status === "Delivered";
  const isCancelled = order.status === "Cancelled";
  const isActive = showsOrderTimeline(order.status);

  return (
    <article className="agrivo-buyer-order-full-card agrivo-card">
      <div className="agrivo-buyer-order-full-top">
        <div className="agrivo-buyer-order-thumb">
          <ProductImage
            name={order.product}
            src={order.image}
            alt={`${order.product} product image`}
            className="h-full w-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="agrivo-heading text-lg font-bold text-[#102018]">
                {order.product} · {order.quantity}
              </h3>
              <p className="mt-1 text-sm text-[#5F6F64]">Farmer: {order.farmer}</p>
            </div>
            <BuyerOrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="agrivo-buyer-order-full-meta">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Order ID</p>
          <p className="mt-0.5 text-sm font-semibold text-[#102018]">{order.orderId}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Ordered on</p>
          <p className="mt-0.5 text-sm font-semibold text-[#102018]">{order.orderDate}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Delivery to</p>
          <p className="mt-0.5 text-sm font-semibold text-[#102018]">{order.deliveryTo}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Route</p>
          <p className="mt-0.5 text-sm font-semibold text-[#102018]">{order.route}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Total</p>
          <p className="mt-0.5 text-sm font-bold text-[#14532D]">{order.total}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">
            {isDelivered ? "Delivered" : "Est. delivery"}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[#102018]">
            {isDelivered
              ? order.deliveredDate
                ? `Delivered on ${order.deliveredDate}`
                : "Delivered"
              : order.estimatedDelivery ?? "—"}
          </p>
        </div>
      </div>

      {isActive ? <OrderTimeline timelineIndex={order.timelineIndex} /> : null}

      {isDelivered && order.deliveredDate ? (
        <p className="rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] px-3 py-2 text-xs font-semibold text-[#166534]">
          Delivered on {order.deliveredDate}
        </p>
      ) : null}

      <div className="agrivo-buyer-order-actions">
        <Button
          className="agrivo-button-soft rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
          onClick={() => {
            window.location.hash = getBuyerOrderDetailHash(order.orderId);
          }}
        >
          View Details
        </Button>

        {isActive && order.status === "In Transit" ? (
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          >
            <Truck className="mr-2 h-4 w-4" />
            Track Order
          </Button>
        ) : null}

        {isActive ? (
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Logistics
          </Button>
        ) : null}

        {isDelivered ? (
          <>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reorder
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Farmer
            </Button>
          </>
        ) : null}

        {!isDelivered && !isCancelled && order.status !== "In Transit" ? (
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Farmer
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function BuyerOrdersPage() {
  const { user } = useAuth();
  const [apiOrders, setApiOrders] = useState<BuyerOrder[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const buyerAllOrders = useMemo(
    () => (isApiMode ? apiOrders : getAllBuyerOrders(user?.id)),
    [apiOrders, user?.id],
  );
  const [orderSuccessToast, setOrderSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiMode) return;
    getOrders()
      .then((orders) => setApiOrders(orders.map(mapApiOrderToBuyerOrder)))
      .catch((error) =>
        setApiError(error instanceof Error ? error.message : "Failed to load orders."),
      );
  }, []);

  useEffect(() => {
    const message = sessionStorage.getItem("agrivo_order_success");
    if (message) {
      sessionStorage.removeItem("agrivo_order_success");
      setOrderSuccessToast(message);
      window.setTimeout(() => setOrderSuccessToast(null), 3200);
    }
  }, []);
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const locations = useMemo(
    () => [...new Set(buyerAllOrders.map((o) => o.deliveryTo))].sort(),
    [],
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = buyerAllOrders.filter((order) => {
      if (!matchesTab(order, activeTab)) return false;

      if (statusFilter !== "all" && order.status !== statusFilter) return false;

      if (locationFilter !== "all" && order.deliveryTo !== locationFilter) return false;

      if (dateFilter === "july" && order.orderDateSort < 20260701) return false;
      if (dateFilter === "june" && (order.orderDateSort < 20260601 || order.orderDateSort >= 20260701)) {
        return false;
      }

      if (!query) return true;

      return (
        order.product.toLowerCase().includes(query) ||
        order.farmer.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query) ||
        order.deliveryTo.toLowerCase().includes(query)
      );
    });

    results = [...results].sort((a, b) =>
      sortOrder === "newest" ? b.orderDateSort - a.orderDateSort : a.orderDateSort - b.orderDateSort,
    );

    return results;
  }, [activeTab, search, statusFilter, dateFilter, locationFilter, sortOrder]);

  return (
    <div className="agrivo-buyer-orders space-y-6">
      {orderSuccessToast ? (
        <p className="rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] px-4 py-3 text-sm font-medium text-[#166534]">
          {orderSuccessToast}
        </p>
      ) : null}
      {apiError ? (
        <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#b91c1c]">
          {apiError}
        </p>
      ) : null}
      <section className="agrivo-dashboard-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#15803d]">My Orders</p>
        <h2 className="agrivo-heading mt-1 text-2xl font-bold text-[#102018] sm:text-3xl">My Orders</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
          Track your purchases, delivery progress, and marketplace activity.
        </p>

        <div className="agrivo-buyer-order-tabs mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "agrivo-buyer-order-tab",
                activeTab === tab.id && "agrivo-buyer-order-tab--active",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({getTabCount(tab.id, buyerAllOrders)})
            </button>
          ))}
        </div>
      </section>

      <section className="agrivo-dashboard-panel">
        <div className="agrivo-buyer-order-filters">
          <div className="relative min-w-0 flex-1 sm:min-w-[240px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
            <Input
              className={`${filterTriggerClass} pl-11`}
              placeholder="Search by product, farmer, or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={`${filterTriggerClass} w-full sm:w-[160px]`}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(
                [
                  "Pending",
                  "Confirmed",
                  "Preparing",
                  "Pickup Scheduled",
                  "In Transit",
                  "Delivered",
                  "Cancelled",
                ] as BuyerOrderStatus[]
              ).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className={`${filterTriggerClass} w-full sm:w-[150px]`}>
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="july">July 2026</SelectItem>
              <SelectItem value="june">June 2026</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className={`${filterTriggerClass} w-full sm:w-[200px]`}>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
            <SelectTrigger className={`${filterTriggerClass} w-full sm:w-[160px]`}>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : buyerAllOrders.length === 0 ? (
        <section className="agrivo-dashboard-panel">
          <div className="agrivo-dashboard-empty py-12">
            <h3 className="agrivo-heading text-xl font-bold text-[#102018]">
              You have not placed any orders yet.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5F6F64]">
              Browse the marketplace to order fresh products from verified farmers.
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
      ) : (
        <section className="agrivo-dashboard-panel">
          <div className="agrivo-dashboard-empty py-12">
            <h3 className="agrivo-heading text-xl font-bold text-[#102018]">No orders match your filters</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5F6F64]">
              Try adjusting your search, status, or date filters to find what you are looking for.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => {
                setActiveTab("all");
                setSearch("");
                setStatusFilter("all");
                setDateFilter("all");
                setLocationFilter("all");
                setSortOrder("newest");
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

function mapApiStatus(status: ApiOrder["status"]): BuyerOrderStatus {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "Pickup Scheduled";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function mapApiOrderToBuyerOrder(order: ApiOrder): BuyerOrder {
  const first = order.items[0];
  const date = new Date(order.createdAt);
  const dateSort = Number(
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`,
  );
  return {
    id: order.id,
    orderId: order.id.slice(-8).toUpperCase(),
    product: first?.productName ?? "Products",
    quantity: first ? `${first.quantity} ${first.unit}` : "—",
    farmer: "Farmer",
    total: `${order.totalAmount.toFixed(2)} AZN`,
    route: "Farm → Buyer",
    deliveryTo: order.deliveryAddress ?? "Buyer address",
    status: mapApiStatus(order.status),
    orderDate: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    orderDateSort: dateSort,
    estimatedDelivery: undefined,
    deliveredDate: order.status === "delivered" ? date.toLocaleDateString("en-US") : undefined,
    image: undefined,
    timelineIndex: 0,
  };
}
