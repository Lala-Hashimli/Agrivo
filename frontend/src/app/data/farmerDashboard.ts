import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Coins,
  Package,
  TrendingUp,
} from "lucide-react";
import type { AuthUser } from "../auth/authStorage";
import { getFarmerByName } from "./farmers";
import {
  FARMER_DASHBOARD_JOBS_HASH,
  FARMER_DASHBOARD_JOBS_NEW_HASH,
  getDashboardSectionHash,
} from "../components/dashboard/dashboardConfig";

export const FARMER_BASE_HASH = "dashboard/farmer";

export type FarmerOrderStatus =
  | "New"
  | "Confirmed"
  | "Pickup scheduled"
  | "In transit"
  | "Delivered"
  | "Cancelled";

export type TaskPriority = "high" | "medium" | "low";

export type ProductListingStatus = "Active" | "Low stock" | "Fresh listing";

export type StockAlertType = "Low stock" | "Needs update" | "Active" | "Expiring soon";

export interface FarmerSummaryStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  sectionId?: string;
  externalHash?: string;
}

export interface FarmerOrder {
  id: string;
  orderId: string;
  product: string;
  quantity: string;
  buyer: string;
  route: string;
  total: string;
  status: FarmerOrderStatus;
  orderDate: string;
}

export interface FarmerTask {
  id: string;
  text: string;
  priority?: TaskPriority;
}

export interface FarmerProductPerformance {
  id: string;
  name: string;
  soldLabel: string;
  progress: number;
  price?: string;
  status: ProductListingStatus;
}

export interface FarmerJobPreview {
  id: string;
  slug: string;
  title: string;
  location: string;
  workersNeeded: number;
  dailyPay: number;
  applications: number;
  status: "active" | "closed";
}

export interface StockAlert {
  id: string;
  product: string;
  message: string;
  type: StockAlertType;
}

export const farmerSummaryStats: FarmerSummaryStat[] = [
  {
    id: "products",
    label: "Active Products",
    value: "8",
    hint: "Listed in marketplace",
    icon: Package,
    sectionId: "products",
  },
  {
    id: "orders",
    label: "Open Orders",
    value: "4",
    hint: "From buyers",
    icon: ClipboardList,
    sectionId: "orders",
  },
  {
    id: "jobs",
    label: "Active Job Posts",
    value: "2",
    hint: "Seasonal roles",
    icon: Briefcase,
    externalHash: FARMER_DASHBOARD_JOBS_HASH,
  },
  {
    id: "sales",
    label: "Completed Sales",
    value: "46",
    hint: "This season",
    icon: CheckCircle2,
    sectionId: "orders",
  },
  {
    id: "revenue",
    label: "Revenue This Season",
    value: "4,860 AZN",
    hint: "Gross marketplace sales",
    icon: Coins,
  },
  {
    id: "low-stock",
    label: "Low Stock Items",
    value: "3",
    hint: "Needs attention",
    icon: AlertTriangle,
    sectionId: "products",
  },
];

export const farmerRecentOrders: FarmerOrder[] = [
  {
    id: "fo-1",
    orderId: "AGR-F-3012",
    product: "Cherries",
    quantity: "45 kg",
    buyer: "Green Market Baku",
    route: "Quba → Baku",
    total: "90 AZN",
    status: "Pickup scheduled",
    orderDate: "July 5, 2026",
  },
  {
    id: "fo-2",
    orderId: "AGR-F-3008",
    product: "Tomatoes",
    quantity: "120 kg",
    buyer: "Local Produce Hub",
    route: "Lənkaran → Bakı",
    total: "168 AZN",
    status: "Confirmed",
    orderDate: "July 4, 2026",
  },
  {
    id: "fo-3",
    orderId: "AGR-F-2995",
    product: "Apples",
    quantity: "80 kg",
    buyer: "Restaurant Supply Co.",
    route: "Quba → Bakı",
    total: "136 AZN",
    status: "New",
    orderDate: "July 4, 2026",
  },
  {
    id: "fo-4",
    orderId: "AGR-F-2981",
    product: "Cucumbers",
    quantity: "60 kg",
    buyer: "Fresh Bazaar Sumqayıt",
    route: "Şəki → Sumqayıt",
    total: "72 AZN",
    status: "In transit",
    orderDate: "July 3, 2026",
  },
];

export const farmerTodaysTasks: FarmerTask[] = [
  { id: "t1", text: "Confirm 2 new buyer orders", priority: "high" },
  { id: "t2", text: "Prepare 45 kg cherries for pickup", priority: "high" },
  { id: "t3", text: "Update stock for tomatoes", priority: "medium" },
  { id: "t4", text: "Review 1 farm job application", priority: "medium" },
];

export const farmerProductPerformance: FarmerProductPerformance[] = [
  {
    id: "pp-1",
    name: "Apples",
    soldLabel: "175 kg sold",
    progress: 88,
    price: "1.70 AZN/kg",
    status: "Active",
  },
  {
    id: "pp-2",
    name: "Cherries",
    soldLabel: "85 kg sold",
    progress: 72,
    price: "2.00 AZN/kg",
    status: "Active",
  },
  {
    id: "pp-3",
    name: "Tomatoes",
    soldLabel: "120 kg listed",
    progress: 45,
    price: "1.40 AZN/kg",
    status: "Low stock",
  },
  {
    id: "pp-4",
    name: "Cucumbers",
    soldLabel: "90 kg available",
    progress: 60,
    price: "1.20 AZN/kg",
    status: "Fresh listing",
  },
];

export const farmerActiveJobs: FarmerJobPreview[] = [
  {
    id: "job-cherry-harvest",
    slug: "cherry-harvest-workers-quba",
    title: "Cherry Harvest Workers Needed",
    location: "Quba, Alpan village",
    workersNeeded: 5,
    dailyPay: 20,
    applications: 3,
    status: "active",
  },
  {
    id: "job-apple-picking",
    slug: "apple-picking-season-quba",
    title: "Apple Picking Season Helpers",
    location: "Quba, Alpan village",
    workersNeeded: 4,
    dailyPay: 18,
    applications: 2,
    status: "active",
  },
];

export const farmerStockAlerts: StockAlert[] = [
  { id: "sa-1", product: "Tomatoes", message: "Only 20 kg left", type: "Low stock" },
  { id: "sa-2", product: "Apples", message: "Harvest date needs update", type: "Needs update" },
  { id: "sa-3", product: "Cucumbers", message: "90 kg available", type: "Active" },
  { id: "sa-4", product: "Potatoes", message: "Listing expires soon", type: "Expiring soon" },
];

const DEMO_FARMER_PUBLIC_SLUG = "aysel-mammadova";

export function getFarmerSectionHash(sectionId: string): string {
  return getDashboardSectionHash(FARMER_BASE_HASH, sectionId);
}

export function getFarmerPublicProfileHash(user: AuthUser | null): string {
  if (!user) return `farmers/${DEMO_FARMER_PUBLIC_SLUG}`;
  const farmer = getFarmerByName(user.name);
  if (farmer) return `farmers/${farmer.slug}`;
  if (user.email === "farmer@agrivo.az") return `farmers/${DEMO_FARMER_PUBLIC_SLUG}`;
  return `farmers/${DEMO_FARMER_PUBLIC_SLUG}`;
}

export function getFarmerJobEditHash(jobId: string): string {
  return `dashboard/jobs/edit/${jobId}`;
}

export { FARMER_DASHBOARD_JOBS_HASH, FARMER_DASHBOARD_JOBS_NEW_HASH };
