import { apiGet, apiPatch } from "./client";

export interface ApiDelivery {
  id: string;
  orderId: string;
  logisticsPartnerId: string | null;
  driverName: string | null;
  vehicle: string | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  pickupTime: string | null;
  eta: string | null;
  status: string;
  priority: string;
  currentLocation: string | null;
  distanceRemaining: string | null;
  progress: number;
  completedAt: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DeliveriesResponse {
  success: boolean;
  count: number;
  deliveries: ApiDelivery[];
}

interface DeliveryResponse {
  success: boolean;
  delivery: ApiDelivery;
}

interface OverviewResponse {
  success: boolean;
  overview: {
    total: number;
    assigned: number;
    pickupScheduled: number;
    inTransit: number;
    delivered: number;
    delayed: number;
  };
}

export async function getDeliveries(): Promise<ApiDelivery[]> {
  const res = await apiGet<DeliveriesResponse>("/deliveries");
  return res.deliveries;
}

export async function getDeliveryById(id: string): Promise<ApiDelivery> {
  const res = await apiGet<DeliveryResponse>(`/deliveries/${id}`);
  return res.delivery;
}

export async function updateDeliveryStatus(id: string, status: string): Promise<ApiDelivery> {
  const res = await apiPatch<DeliveryResponse>(`/deliveries/${id}/status`, { status });
  return res.delivery;
}

export async function updateDeliveryLocation(
  id: string,
  payload: { currentLocation?: string; distanceRemaining?: string; progress?: number },
): Promise<ApiDelivery> {
  const res = await apiPatch<DeliveryResponse>(`/deliveries/${id}/location`, payload);
  return res.delivery;
}

export async function getLogisticsOverview() {
  const res = await apiGet<OverviewResponse>("/logistics/overview");
  return res.overview;
}

export async function getAssignedDeliveries() {
  const res = await apiGet<DeliveriesResponse>("/logistics/assigned");
  return res.deliveries;
}

export async function getPickupDeliveries() {
  const res = await apiGet<DeliveriesResponse>("/logistics/pickup");
  return res.deliveries;
}

export async function getInTransitDeliveries() {
  const res = await apiGet<DeliveriesResponse>("/logistics/in-transit");
  return res.deliveries;
}

export async function getCompletedDeliveries() {
  const res = await apiGet<DeliveriesResponse>("/logistics/completed");
  return res.deliveries;
}
