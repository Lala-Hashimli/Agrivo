import type { AuthUser } from "../auth/authStorage";
import { todayRouteData } from "../data/logisticsRoutes";

export type DeliveryTaskStatus =
  | "assigned"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "delayed";

export type DeliveryPriority = "low" | "normal" | "high";
export type DeliveryDateFilter = "all" | "today" | "week";
export type DeliveryStatusFilter = DeliveryTaskStatus | "all";
export type DeliveryPriorityFilter = DeliveryPriority | "all";

export interface DeliveryTask {
  id: string;
  taskId: string;
  pickupLocation: string;
  dropoffLocation: string;
  productName: string;
  quantity: number;
  unit: string;
  pickupTime: string;
  eta: string;
  driverName: string;
  vehicle: string;
  status: DeliveryTaskStatus;
  priority: DeliveryPriority;
  region: string;
  dateLabel: string;
}

export interface TodayRoute {
  id: string;
  routeLabel: string;
  pickupLocation: string;
  dropoffLocation: string;
  stops: number;
  driverName: string;
  vehicle: string;
  eta: string;
  distanceKm: number;
  progressPercent: number;
  stopLabels: string[];
}

export interface UrgentAlert {
  id: string;
  type: "delayed" | "route_changed" | "confirmation" | "deadline";
  title: string;
  description: string;
  urgency: "high" | "medium";
}

export interface LogisticsPerformance {
  onTimeRate: number;
  avgDeliveryTime: string;
  completedThisWeek: number;
  successRate: number;
}

export interface LogisticsOverviewSummary {
  assignedToday: number;
  pickupPending: number;
  inTransit: number;
  completedToday: number;
  delayed: number;
  totalStops: number;
}

const STORAGE_KEY_PREFIX = "agrivo_logistics_tasks_";

export const DELIVERY_STATUS_LABELS: Record<DeliveryTaskStatus, string> = {
  assigned: "Assigned",
  pickup_scheduled: "Pickup Scheduled",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  delayed: "Delayed",
};

export const DELIVERY_PRIORITY_LABELS: Record<DeliveryPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

const REGIONS = ["Lankaran", "Quba", "Ganja", "Baku", "Sheki"] as const;

function storageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function seedDeliveryTasks(): DeliveryTask[] {
  return [
    {
      id: "dt-1",
      taskId: "DLV-1024",
      pickupLocation: "Lankaran Farm",
      dropoffLocation: "Baku Market",
      productName: "Tomatoes",
      quantity: 120,
      unit: "kg",
      pickupTime: "09:30",
      eta: "14:30",
      driverName: "Kamran M.",
      vehicle: "10-TZ-321",
      status: "in_transit",
      priority: "high",
      region: "Lankaran",
      dateLabel: "Today",
    },
    {
      id: "dt-2",
      taskId: "DLV-1025",
      pickupLocation: "Quba Farm",
      dropoffLocation: "Baku Market",
      productName: "Apples",
      quantity: 200,
      unit: "kg",
      pickupTime: "08:00",
      eta: "13:45",
      driverName: "Kamran M.",
      vehicle: "10-TZ-321",
      status: "pickup_scheduled",
      priority: "high",
      region: "Quba",
      dateLabel: "Today",
    },
    {
      id: "dt-3",
      taskId: "DLV-1026",
      pickupLocation: "Ganja Fields",
      dropoffLocation: "Ganja Hub",
      productName: "Potatoes",
      quantity: 150,
      unit: "kg",
      pickupTime: "10:15",
      eta: "12:30",
      driverName: "Elvin R.",
      vehicle: "20-GN-118",
      status: "assigned",
      priority: "normal",
      region: "Ganja",
      dateLabel: "Today",
    },
    {
      id: "dt-4",
      taskId: "DLV-1027",
      pickupLocation: "Sheki Orchard",
      dropoffLocation: "Green Market Baku",
      productName: "Pears",
      quantity: 80,
      unit: "kg",
      pickupTime: "07:45",
      eta: "11:00",
      driverName: "Rauf H.",
      vehicle: "77-SK-904",
      status: "delayed",
      priority: "high",
      region: "Sheki",
      dateLabel: "Today",
    },
    {
      id: "dt-5",
      taskId: "DLV-1028",
      pickupLocation: "Lankaran Greenhouse",
      dropoffLocation: "Fresh Bazaar Sumqayıt",
      productName: "Cucumbers",
      quantity: 60,
      unit: "kg",
      pickupTime: "11:30",
      eta: "15:10",
      driverName: "Nigar A.",
      vehicle: "90-LN-552",
      status: "picked_up",
      priority: "normal",
      region: "Lankaran",
      dateLabel: "Today",
    },
    {
      id: "dt-6",
      taskId: "DLV-1029",
      pickupLocation: "Absheron Farm",
      dropoffLocation: "City Grocery Chain",
      productName: "Watermelon",
      quantity: 500,
      unit: "kg",
      pickupTime: "06:30",
      eta: "10:45",
      driverName: "Tural S.",
      vehicle: "10-AB-441",
      status: "delivered",
      priority: "low",
      region: "Baku",
      dateLabel: "Today",
    },
  ];
}

export function seedTodayRoute(): TodayRoute {
  return {
    id: todayRouteData.id,
    routeLabel: todayRouteData.title,
    pickupLocation: todayRouteData.stops[0]?.name ?? "Lankaran Farm",
    dropoffLocation: todayRouteData.stops.at(-1)?.name ?? "Baku Market",
    stops: todayRouteData.stopsCount,
    driverName: todayRouteData.driver,
    vehicle: todayRouteData.vehicle,
    eta: todayRouteData.eta,
    distanceKm: Number.parseInt(todayRouteData.distance, 10) || 324,
    progressPercent: todayRouteData.initialProgressPercent,
    stopLabels: todayRouteData.stopLabels,
  };
}

export function seedUrgentAlerts(): UrgentAlert[] {
  return [
    {
      id: "alert-1",
      type: "delayed",
      title: "Delayed pickup",
      description: "Quba Farm pickup is 20 minutes late.",
      urgency: "high",
    },
    {
      id: "alert-2",
      type: "route_changed",
      title: "Route changed",
      description: "Baku Market requested a new drop-off point.",
      urgency: "medium",
    },
    {
      id: "alert-3",
      type: "confirmation",
      title: "Buyer waiting confirmation",
      description: "Green Market Baku needs delivery window confirmation.",
      urgency: "medium",
    },
    {
      id: "alert-4",
      type: "deadline",
      title: "Delivery nearing deadline",
      description: "Sheki Orchard shipment must arrive before 11:00.",
      urgency: "high",
    },
  ];
}

export function seedLogisticsPerformance(): LogisticsPerformance {
  return {
    onTimeRate: 94,
    avgDeliveryTime: "2h 15m",
    completedThisWeek: 18,
    successRate: 97,
  };
}

export function resolveLogisticsUserId(user: AuthUser | null): string | null {
  if (!user) return null;
  return user.id || "demo_logistics";
}

export function getDeliveryTasks(userId: string): DeliveryTask[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      const seeded = seedDeliveryTasks();
      setDeliveryTasks(userId, seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as DeliveryTask[];
    return Array.isArray(parsed) ? parsed : seedDeliveryTasks();
  } catch {
    return seedDeliveryTasks();
  }
}

export function setDeliveryTasks(userId: string, tasks: DeliveryTask[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(tasks));
}

export function updateDeliveryTaskStatus(
  userId: string,
  taskId: string,
  status: DeliveryTaskStatus,
): DeliveryTask[] {
  const tasks = getDeliveryTasks(userId);
  const next = tasks.map((task) => (task.id === taskId ? { ...task, status } : task));
  setDeliveryTasks(userId, next);
  return next;
}

export function computeLogisticsSummary(tasks: DeliveryTask[]): LogisticsOverviewSummary {
  const active = tasks.filter((task) => task.status !== "delivered");
  return {
    assignedToday: tasks.filter((task) => task.dateLabel === "Today").length,
    pickupPending: tasks.filter(
      (task) => task.status === "assigned" || task.status === "pickup_scheduled",
    ).length,
    inTransit: tasks.filter(
      (task) => task.status === "in_transit" || task.status === "picked_up",
    ).length,
    completedToday: tasks.filter((task) => task.status === "delivered").length,
    delayed: tasks.filter((task) => task.status === "delayed").length,
    totalStops: active.length + 2,
  };
}

export function getDeliveryRegions(tasks: DeliveryTask[]): string[] {
  return [...new Set(tasks.map((task) => task.region))].sort();
}

export function filterDeliveryTasks(
  tasks: DeliveryTask[],
  options: {
    search: string;
    status: DeliveryStatusFilter;
    region: string;
    dateFilter: DeliveryDateFilter;
    priority: DeliveryPriorityFilter;
  },
): DeliveryTask[] {
  const query = options.search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      !query ||
      task.taskId.toLowerCase().includes(query) ||
      task.pickupLocation.toLowerCase().includes(query) ||
      task.dropoffLocation.toLowerCase().includes(query) ||
      task.productName.toLowerCase().includes(query) ||
      task.driverName.toLowerCase().includes(query);

    const matchesStatus = options.status === "all" || task.status === options.status;
    const matchesRegion = options.region === "all" || task.region === options.region;
    const matchesPriority = options.priority === "all" || task.priority === options.priority;
    const matchesDate =
      options.dateFilter === "all" ||
      (options.dateFilter === "today" && task.dateLabel === "Today") ||
      (options.dateFilter === "week" && task.dateLabel !== "Older");

    return (
      matchesSearch && matchesStatus && matchesRegion && matchesPriority && matchesDate
    );
  });
}

export function formatTaskQuantity(task: DeliveryTask): string {
  return `${task.quantity} ${task.unit}`;
}

export function getLogisticsSectionHash(sectionId: string): string {
  if (sectionId === "overview") return "dashboard/logistics";
  return `dashboard/logistics/${sectionId}`;
}

export const DELIVERY_REGION_OPTIONS = ["all", ...REGIONS];

export const NEXT_STATUS: Partial<Record<DeliveryTaskStatus, DeliveryTaskStatus>> = {
  assigned: "pickup_scheduled",
  pickup_scheduled: "picked_up",
  picked_up: "in_transit",
  in_transit: "delivered",
  delayed: "in_transit",
};
