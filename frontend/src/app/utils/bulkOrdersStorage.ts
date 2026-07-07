export type BulkOrderStatus =
  | "Open"
  | "Offers Received"
  | "Accepted"
  | "In Progress"
  | "Fulfilled"
  | "Cancelled";

export type BulkOrderCategory = "Vegetables" | "Fruits" | "Dairy Products";
export type BulkOrderUnit = "kg" | "liter" | "box" | "jar";

export interface BulkFarmerOffer {
  id: string;
  farmerName: string;
  farmerSlug: string;
  verified: boolean;
  pricePerUnit: string;
  availableQuantity: number;
  unit: BulkOrderUnit;
  deliveryAvailable: boolean;
  estimatedDelivery: string;
  accepted?: boolean;
}

export interface BulkOrder {
  id: string;
  productName: string;
  category: BulkOrderCategory;
  quantity: number;
  unit: BulkOrderUnit;
  preferredRegion: string;
  preferredDistrict: string;
  deliveryLocation: string;
  neededBy: string;
  maxPrice: string;
  deliveryRequired: boolean;
  notes: string;
  status: BulkOrderStatus;
  offersCount: number;
  createdAt: string;
  offers: BulkFarmerOffer[];
}

export interface BulkOrderFormInput {
  productName: string;
  category: BulkOrderCategory;
  quantity: number;
  unit: BulkOrderUnit;
  preferredRegion: string;
  preferredDistrict: string;
  deliveryLocation: string;
  neededBy: string;
  maxPrice: string;
  deliveryRequired: boolean;
  notes: string;
}

export interface BulkOrderSummary {
  activeRequests: number;
  offersReceived: number;
  acceptedDeals: number;
  completedOrders: number;
}

const STORAGE_KEY_PREFIX = "agrivo_bulk_orders_";

const MOCK_FARMERS = [
  { name: "Hasanov Green Farm", slug: "ali-hasanov", verified: true },
  { name: "Safarova Orchard Hills", slug: "nigar-safarova", verified: true },
  { name: "Ganja Root Fields", slug: "leyla-abbasova", verified: true },
  { name: "Lankaran Citrus Co-op", slug: "ali-hasanov", verified: false },
  { name: "Quba Orchard Farm", slug: "nigar-safarova", verified: true },
] as const;

function storageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function generateId(): string {
  return `bulk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseMaxPrice(value: string): number | null {
  const match = value.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : null;
}

function formatPrice(value: number, unit: BulkOrderUnit): string {
  return `${value.toFixed(2)} AZN / ${unit}`;
}

function addDays(base: Date, days: number): string {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateMockOffers(
  order: Pick<BulkOrder, "quantity" | "unit" | "maxPrice" | "deliveryRequired">,
  count = 3,
): BulkFarmerOffer[] {
  const max = parseMaxPrice(order.maxPrice);
  const shuffled = [...MOCK_FARMERS].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map((farmer, index) => {
    const basePrice = max ? max * (0.85 + index * 0.04) : 1.2 + index * 0.15;
    const available = order.quantity + Math.floor(Math.random() * 50);

    return {
      id: `offer-${generateId()}-${index}`,
      farmerName: farmer.name,
      farmerSlug: farmer.slug,
      verified: farmer.verified,
      pricePerUnit: formatPrice(basePrice, order.unit),
      availableQuantity: available,
      unit: order.unit,
      deliveryAvailable: order.deliveryRequired || index % 2 === 0,
      estimatedDelivery: addDays(new Date(), 2 + index),
    };
  });
}

function seedBulkOrders(): BulkOrder[] {
  const now = new Date();
  const weekAhead = new Date(now);
  weekAhead.setDate(weekAhead.getDate() + 14);

  const tomatoesOffers = generateMockOffers(
    { quantity: 300, unit: "kg", maxPrice: "1.50 AZN / kg", deliveryRequired: true },
    3,
  );
  const appleOffers = generateMockOffers(
    { quantity: 500, unit: "kg", maxPrice: "2.00 AZN / kg", deliveryRequired: true },
    2,
  );

  return [
    {
      id: "bulk-seed-1",
      productName: "Tomatoes",
      category: "Vegetables",
      quantity: 300,
      unit: "kg",
      preferredRegion: "Lənkəran-Astara",
      preferredDistrict: "Lənkəran rayonu",
      deliveryLocation: "Baku, Nizami district, market warehouse",
      neededBy: weekAhead.toISOString().slice(0, 10),
      maxPrice: "1.50 AZN / kg",
      deliveryRequired: true,
      notes: "Need firm tomatoes suitable for market resale. Delivery before 10 AM preferred.",
      status: "Offers Received",
      offersCount: tomatoesOffers.length,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      offers: tomatoesOffers,
    },
    {
      id: "bulk-seed-2",
      productName: "Apples",
      category: "Fruits",
      quantity: 500,
      unit: "kg",
      preferredRegion: "Quba-Xaçmaz",
      preferredDistrict: "Quba rayonu",
      deliveryLocation: "Ganja, central wholesale market",
      neededBy: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      maxPrice: "2.00 AZN / kg",
      deliveryRequired: true,
      notes: "Premium grade apples for supermarket display.",
      status: "Accepted",
      offersCount: appleOffers.length,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      offers: appleOffers.map((offer, i) => ({ ...offer, accepted: i === 0 })),
    },
    {
      id: "bulk-seed-3",
      productName: "Potatoes",
      category: "Vegetables",
      quantity: 800,
      unit: "kg",
      preferredRegion: "Gəncə-Daşkəsən",
      preferredDistrict: "Gəncə şəhəri",
      deliveryLocation: "Sumqayıt, bazaar storage",
      neededBy: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      maxPrice: "0.90 AZN / kg",
      deliveryRequired: false,
      notes: "",
      status: "Fulfilled",
      offersCount: 4,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      offers: generateMockOffers(
        { quantity: 800, unit: "kg", maxPrice: "0.90 AZN / kg", deliveryRequired: false },
        4,
      ),
    },
  ];
}

export function getBulkOrders(userId: string): BulkOrder[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      const seeded = seedBulkOrders();
      setBulkOrders(userId, seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BulkOrder[]) : [];
  } catch {
    return [];
  }
}

export function setBulkOrders(userId: string, orders: BulkOrder[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(orders));
}

export function getBulkOrderSummary(orders: BulkOrder[]): BulkOrderSummary {
  const activeStatuses: BulkOrderStatus[] = ["Open", "Offers Received", "In Progress"];
  return {
    activeRequests: orders.filter((order) => activeStatuses.includes(order.status)).length,
    offersReceived: orders.reduce((sum, order) => sum + order.offersCount, 0),
    acceptedDeals: orders.filter((order) => order.status === "Accepted").length,
    completedOrders: orders.filter((order) => order.status === "Fulfilled").length,
  };
}

export function createBulkOrder(userId: string, input: BulkOrderFormInput): BulkOrder {
  const orders = getBulkOrders(userId);
  const offers = generateMockOffers(
    {
      quantity: input.quantity,
      unit: input.unit,
      maxPrice: input.maxPrice,
      deliveryRequired: input.deliveryRequired,
    },
    2 + Math.floor(Math.random() * 2),
  );

  const order: BulkOrder = {
    id: generateId(),
    ...input,
    status: offers.length > 0 ? "Offers Received" : "Open",
    offersCount: offers.length,
    createdAt: new Date().toISOString(),
    offers,
  };

  setBulkOrders(userId, [order, ...orders]);
  return order;
}

export function updateBulkOrder(
  userId: string,
  orderId: string,
  input: BulkOrderFormInput,
): BulkOrder | undefined {
  const orders = getBulkOrders(userId);
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return undefined;

  const existing = orders[index];
  if (existing.status === "Cancelled" || existing.status === "Fulfilled") {
    return existing;
  }

  const updated: BulkOrder = {
    ...existing,
    ...input,
  };
  const next = [...orders];
  next[index] = updated;
  setBulkOrders(userId, next);
  return updated;
}

export function cancelBulkOrder(userId: string, orderId: string): void {
  updateStatus(userId, orderId, "Cancelled");
}

export function fulfillBulkOrder(userId: string, orderId: string): void {
  updateStatus(userId, orderId, "Fulfilled");
}

export function acceptBulkOffer(userId: string, orderId: string, offerId: string): BulkOrder | undefined {
  const orders = getBulkOrders(userId);
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return undefined;

  const order = orders[index];
  const offers = order.offers.map((offer) => ({
    ...offer,
    accepted: offer.id === offerId,
  }));

  const updated: BulkOrder = {
    ...order,
    offers,
    status: "Accepted",
  };

  const next = [...orders];
  next[index] = updated;
  setBulkOrders(userId, next);
  return updated;
}

function updateStatus(userId: string, orderId: string, status: BulkOrderStatus): void {
  const orders = getBulkOrders(userId);
  const next = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  setBulkOrders(userId, next);
}

export function getBestOffer(order: BulkOrder): BulkFarmerOffer | undefined {
  if (order.offers.length === 0) return undefined;
  return [...order.offers].sort((a, b) => {
    const priceA = parseMaxPrice(a.pricePerUnit) ?? Infinity;
    const priceB = parseMaxPrice(b.pricePerUnit) ?? Infinity;
    return priceA - priceB;
  })[0];
}

export function formatBulkDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
