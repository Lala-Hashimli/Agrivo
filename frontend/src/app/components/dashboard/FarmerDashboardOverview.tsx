import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckSquare,
  ClipboardList,
  ExternalLink,
  MapPin,
  MessageCircle,
  PackagePlus,
  Pencil,
  RefreshCw,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  farmerActiveJobs,
  farmerProductPerformance,
  farmerRecentOrders,
  farmerStockAlerts,
  farmerSummaryStats,
  farmerTodaysTasks,
  FARMER_DASHBOARD_JOBS_NEW_HASH,
  getFarmerJobEditHash,
  getFarmerPublicProfileHash,
  getFarmerSectionHash,
  type FarmerOrderStatus,
  type ProductListingStatus,
  type StockAlertType,
  type TaskPriority,
} from "../../data/farmerDashboard";
import { FARMER_DASHBOARD_JOBS_HASH } from "./dashboardConfig";
import { FarmerOrderStatusBadge } from "./FarmerOrderStatusBadge";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

function navigate(hash: string) {
  window.location.hash = hash;
}

function TaskPriorityBadge({ priority }: { priority?: TaskPriority }) {
  if (!priority) return null;

  const tone =
    priority === "high"
      ? "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]"
      : priority === "medium"
        ? "bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
        : "bg-[#f0f7ee] text-[#14532D] border-[#dbe7d4]";

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", tone)}>
      {priority}
    </span>
  );
}

function ProductStatusBadge({ status }: { status: ProductListingStatus }) {
  const tone =
    status === "Low stock"
      ? "bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
      : status === "Fresh listing"
        ? "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]"
        : "bg-[#ecfdf5] text-[#166534] border-[#bbf7d0]";

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", tone)}>
      {status}
    </span>
  );
}

function StockAlertBadge({ type }: { type: StockAlertType }) {
  const tone =
    type === "Low stock"
      ? "bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
      : type === "Needs update"
        ? "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]"
        : type === "Expiring soon"
          ? "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]"
          : "bg-[#ecfdf5] text-[#166534] border-[#bbf7d0]";

  return (
    <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold", tone)}>
      {type}
    </span>
  );
}

const NEXT_STATUS: Partial<Record<FarmerOrderStatus, FarmerOrderStatus>> = {
  New: "Confirmed",
  Confirmed: "Pickup scheduled",
  "Pickup scheduled": "In transit",
  "In transit": "Delivered",
};

export function FarmerDashboardOverview() {
  const { user } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const firstName = user?.name?.split(" ")[0] ?? "Farmer";
  const publicProfileHash = getFarmerPublicProfileHash(user);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleStatClick = (stat: (typeof farmerSummaryStats)[number]) => {
    if (stat.externalHash) {
      navigate(stat.externalHash);
      return;
    }
    if (stat.sectionId) {
      navigate(getFarmerSectionHash(stat.sectionId));
    }
  };

  const handleUpdateStatus = (orderId: string, currentStatus: FarmerOrderStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (next) {
      showToast(`Order ${orderId} status updated to ${next}.`);
    } else {
      showToast(`Order ${orderId} is already ${currentStatus}.`);
    }
  };

  return (
    <div className="agrivo-farmer-overview space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckSquare className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Welcome + quick actions */}
      <section className="agrivo-dashboard-panel agrivo-farmer-welcome">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#15803d]">Overview</p>
            <h2 className="agrivo-heading mt-1 text-2xl font-bold text-[#102018] sm:text-3xl">
              Welcome back, {firstName}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5F6F64] sm:text-base">
              Manage your products, buyer orders, seasonal jobs, and farm profile.
            </p>
          </div>
          <div className="agrivo-farmer-quick-actions">
            <Button
              className="agrivo-button-soft rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={() => navigate(getFarmerSectionHash("add-product"))}
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => navigate(FARMER_DASHBOARD_JOBS_NEW_HASH)}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Create Job Post
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => navigate(getFarmerSectionHash("orders"))}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              View Orders
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => navigate(publicProfileHash)}
            >
              <UserRound className="mr-2 h-4 w-4" />
              View Public Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Summary stats */}
      <section className="agrivo-farmer-stats">
        {farmerSummaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.id}
              type="button"
              className="agrivo-farmer-stat-card agrivo-card text-left"
              onClick={() => handleStatClick(stat)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfdf5]">
                  <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={1.75} />
                </div>
                <span className="agrivo-heading text-2xl font-bold text-[#102018]">{stat.value}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#102018]">{stat.label}</p>
              <p className="mt-0.5 text-xs text-[#6b7a70]">{stat.hint}</p>
            </button>
          );
        })}
      </section>

      {/* Main grid */}
      <div className="agrivo-farmer-main-grid">
        <div className="agrivo-farmer-main-left space-y-6">
          {/* Recent buyer orders */}
          <section className="agrivo-dashboard-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">
                  Buyer activity
                </p>
                <h3 className="agrivo-heading mt-1 text-lg font-bold text-[#102018]">
                  Recent Buyer Orders
                </h3>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#14532D] hover:text-[#1D6A3B]"
                onClick={() => navigate(getFarmerSectionHash("orders"))}
              >
                View all
              </button>
            </div>

            {farmerRecentOrders.length > 0 ? (
              <div className="space-y-3">
                {farmerRecentOrders.map((order) => (
                  <article key={order.id} className="agrivo-farmer-order-card">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#102018]">
                          {order.product} · {order.quantity}
                        </p>
                        <p className="mt-1 text-sm text-[#5F6F64]">Buyer: {order.buyer}</p>
                      </div>
                      <FarmerOrderStatusBadge status={order.status} />
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-[#5F6F64] sm:grid-cols-2">
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
                        {order.route}
                      </p>
                      <p>
                        <span className="font-medium text-[#102018]">Total:</span> {order.total}
                      </p>
                      <p className="flex items-center gap-1 sm:col-span-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
                        {order.orderDate} · {order.orderId}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                        onClick={() => navigate(getFarmerSectionHash("orders"))}
                      >
                        View Order
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                        onClick={() =>
                          showToast(`Opening WhatsApp chat with ${order.buyer}…`)
                        }
                      >
                        <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                        Contact Buyer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                        onClick={() => handleUpdateStatus(order.orderId, order.status)}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Update Status
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="agrivo-dashboard-empty py-8">
                <p className="text-sm text-[#5F6F64]">No buyer orders yet.</p>
                <Button
                  className="mt-4 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                  onClick={() => navigate("products")}
                >
                  View Marketplace
                </Button>
              </div>
            )}
          </section>

          {/* Product performance */}
          <section className="agrivo-dashboard-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">
                  Sales insights
                </p>
                <h3 className="agrivo-heading mt-1 text-lg font-bold text-[#102018]">
                  Product Performance
                </h3>
              </div>
              <TrendingUp className="h-5 w-5 text-[#43A047]" />
            </div>

            {farmerProductPerformance.length > 0 ? (
              <div className="space-y-3">
                {farmerProductPerformance.map((product) => (
                  <div key={product.id} className="agrivo-farmer-product-row">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#102018]">{product.name}</p>
                        <p className="mt-0.5 text-sm text-[#5F6F64]">{product.soldLabel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.price ? (
                          <span className="text-xs font-semibold text-[#14532D]">{product.price}</span>
                        ) : null}
                        <ProductStatusBadge status={product.status} />
                      </div>
                    </div>
                    <div className="agrivo-farmer-progress-track mt-3">
                      <div
                        className="agrivo-farmer-progress-fill"
                        style={{ width: `${product.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="agrivo-dashboard-empty py-8">
                <p className="text-sm text-[#5F6F64]">You have not listed any products yet.</p>
                <Button
                  className="mt-4 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                  onClick={() => navigate(getFarmerSectionHash("add-product"))}
                >
                  Add Product
                </Button>
              </div>
            )}
          </section>
        </div>

        <div className="agrivo-farmer-main-right space-y-6">
          {/* Today's tasks */}
          <section className="agrivo-dashboard-panel agrivo-farmer-tasks-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">
                  Daily operations
                </p>
                <h3 className="agrivo-heading mt-1 text-lg font-bold text-[#102018]">
                  Today&apos;s Tasks
                </h3>
              </div>
            </div>

            <ul className="space-y-2">
              {farmerTodaysTasks.map((task) => (
                <li key={task.id} className="agrivo-farmer-task-row">
                  <span className="agrivo-farmer-task-check" aria-hidden>
                    <CheckSquare className="h-4 w-4 text-[#43A047]" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-[#102018]">
                    {task.text}
                  </span>
                  <TaskPriorityBadge priority={task.priority} />
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="mt-4 w-full rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => navigate(getFarmerSectionHash("orders"))}
            >
              View all tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </section>

          {/* Active farm jobs */}
          <section className="agrivo-dashboard-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">
                  Seasonal hiring
                </p>
                <h3 className="agrivo-heading mt-1 text-lg font-bold text-[#102018]">
                  Active Farm Jobs
                </h3>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#14532D] hover:text-[#1D6A3B]"
                onClick={() => navigate(FARMER_DASHBOARD_JOBS_HASH)}
              >
                View all
              </button>
            </div>

            {farmerActiveJobs.length > 0 ? (
              <div className="space-y-3">
                {farmerActiveJobs.map((job) => (
                  <article key={job.id} className="agrivo-farmer-job-card">
                    <h4 className="font-semibold text-[#102018]">{job.title}</h4>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#5F6F64]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
                      {job.location}
                    </p>
                    <p className="mt-2 text-sm text-[#102018]">
                      {job.workersNeeded} workers needed · {job.dailyPay} AZN/day
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#14532D]">
                      {job.applications} applications
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                        onClick={() => navigate(FARMER_DASHBOARD_JOBS_HASH)}
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View Job
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                        onClick={() => navigate(getFarmerJobEditHash(job.id))}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="agrivo-dashboard-empty py-6">
                <p className="text-sm text-[#5F6F64]">No active job posts.</p>
                <Button
                  className="mt-4 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                  onClick={() => navigate(FARMER_DASHBOARD_JOBS_NEW_HASH)}
                >
                  Create Job Post
                </Button>
              </div>
            )}
          </section>

          {/* Stock alerts */}
          <section className="agrivo-dashboard-panel agrivo-farmer-alerts-panel">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#b45309]" />
              <h3 className="agrivo-heading text-lg font-bold text-[#102018]">Stock Alerts</h3>
            </div>

            <ul className="space-y-2">
              {farmerStockAlerts.map((alert) => (
                <li key={alert.id} className="agrivo-farmer-alert-row">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#102018]">{alert.product}</p>
                    <p className="text-sm text-[#5F6F64]">{alert.message}</p>
                  </div>
                  <StockAlertBadge type={alert.type} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
