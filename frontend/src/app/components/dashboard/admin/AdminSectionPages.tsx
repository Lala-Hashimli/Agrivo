import { BarChart3, ClipboardList, Package, Users } from "lucide-react";
import type { DashboardRoleConfig } from "./dashboardConfig";
import { PageHeader } from "../PageHeader";
import { StatusBadge } from "../StatusBadge";

export function AdminOverviewPage({ config }: { config: DashboardRoleConfig }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Overview" subtitle={config.subtitle} />

      <div className="agrivo-dashboard-stats">
        {config.summaryCards.map((card) => (
          <div key={card.label} className="agrivo-dashboard-stat-card">
            <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">{card.label}</p>
            <p className="agrivo-heading mt-2 text-2xl font-bold text-[#102018]">{card.value}</p>
            <p className="mt-1 text-xs text-[#5F6F64]">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="agrivo-dashboard-panel">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="agrivo-heading text-lg font-bold text-[#102018]">Recent platform activity</h3>
        </div>
        <div className="space-y-3">
          {config.mockListItems.map((item) => (
            <div key={item.title} className="agrivo-dashboard-list-item">
              <div className="min-w-0">
                <p className="font-semibold text-[#102018]">{item.title}</p>
                <p className="mt-0.5 text-sm text-[#5F6F64]">{item.meta}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ADMIN_SECTIONS: Record<
  string,
  { title: string; subtitle: string; icon: typeof Users; rows: Array<{ title: string; meta: string; status: string }> }
> = {
  users: {
    title: "Users",
    subtitle: "Manage buyer, farmer, logistics, and admin accounts across the platform.",
    icon: Users,
    rows: [
      { title: "Aysel Mammadova", meta: "Farmer · Quba · Registered 2 days ago", status: "Pending review" },
      { title: "Green Market Baku", meta: "Buyer · 12 orders · Active", status: "Verified" },
      { title: "Rashad Aliyev", meta: "Logistics · 6 active routes", status: "Active" },
    ],
  },
  farmers: {
    title: "Farmers",
    subtitle: "Review farmer profiles, verification status, and marketplace listings.",
    icon: Users,
    rows: [
      { title: "Hasanov Green Farm", meta: "Quba · 8 active products", status: "Verified" },
      { title: "Nar Garden", meta: "Mərkəzi Aran · 5 active products", status: "Verified" },
      { title: "South Garden Farm", meta: "Lənkəran · Profile incomplete", status: "Review" },
    ],
  },
  products: {
    title: "Products",
    subtitle: "Monitor marketplace listings, categories, and listing quality.",
    icon: Package,
    rows: [
      { title: "Tomatoes · Çerri Pomidor", meta: "Quba · 120 kg · AZN 2.50/kg", status: "Active" },
      { title: "Apples · Qızıl Əhmədi", meta: "Quba · 175 kg · AZN 1.70/kg", status: "Active" },
      { title: "Potatoes · Gədəbəy", meta: "Gəncə · Draft listing", status: "Draft" },
    ],
  },
  orders: {
    title: "Orders",
    subtitle: "Track buyer orders, fulfillment status, and delivery coordination.",
    icon: ClipboardList,
    rows: [
      { title: "ORD-1042 · Tomatoes 80 kg", meta: "Green Market Baku · Safarova Farm", status: "In transit" },
      { title: "ORD-1038 · Apples 60 kg", meta: "Restaurant Supply Co. · Quba Orchard", status: "Delivered" },
      { title: "ORD-1035 · Potatoes 120 kg", meta: "Local Produce Hub · Ganja Fields", status: "Confirmed" },
    ],
  },
  "farm-jobs": {
    title: "Farm Jobs",
    subtitle: "Oversee seasonal hiring posts, applications, and job status.",
    icon: ClipboardList,
    rows: [
      { title: "Cherry Harvest Workers", meta: "Quba · 12 workers needed", status: "Open" },
      { title: "Greenhouse Tomato Pickers", meta: "Bakı · 8 workers needed", status: "Open" },
      { title: "Potato Sorting Team", meta: "Gəncə · Closed", status: "Completed" },
    ],
  },
  reports: {
    title: "Reports",
    subtitle: "Platform performance, delivery metrics, and marketplace insights.",
    icon: BarChart3,
    rows: [
      { title: "Weekly marketplace volume", meta: "1,240 orders · +8% vs last week", status: "Ready" },
      { title: "On-time delivery rate", meta: "Logistics partners · 94.2%", status: "Ready" },
      { title: "Top regions by sales", meta: "Quba, Lənkəran, Gəncə", status: "Ready" },
    ],
  },
};

export function AdminSectionPage({ sectionId }: { sectionId: string }) {
  const section = ADMIN_SECTIONS[sectionId];
  if (!section) return null;

  const Icon = section.icon;

  return (
    <div className="space-y-6">
      <PageHeader title={section.title} subtitle={section.subtitle} />

      <div className="agrivo-dashboard-panel">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ecfdf5]">
            <Icon className="h-4 w-4 text-[#14532D]" />
          </div>
          <h3 className="agrivo-heading text-lg font-bold text-[#102018]">{section.title} directory</h3>
        </div>
        <div className="space-y-3">
          {section.rows.map((row) => (
            <div key={row.title} className="agrivo-dashboard-list-item">
              <div className="min-w-0">
                <p className="font-semibold text-[#102018]">{row.title}</p>
                <p className="mt-0.5 truncate text-sm text-[#5F6F64]">{row.meta}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
