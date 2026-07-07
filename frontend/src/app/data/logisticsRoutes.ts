export type RouteStopType = "pickup" | "dropoff";

export interface RouteStop {
  type: RouteStopType;
  name: string;
  lat: number;
  lng: number;
  product?: string;
  quantity?: string;
  time?: string;
  eta?: string;
}

export interface LogisticsRouteData {
  id: string;
  title: string;
  eta: string;
  distance: string;
  driver: string;
  vehicle: string;
  status: "in_transit" | "scheduled" | "completed";
  stops: RouteStop[];
  vehiclePosition: {
    lat: number;
    lng: number;
  };
  stopLabels: string[];
  stopsCount: number;
  initialProgressPercent: number;
}

export const todayRouteData: LogisticsRouteData = {
  id: "ROUTE-001",
  title: "Lankaran Farm → Baku Market",
  eta: "14:30",
  distance: "324 km",
  driver: "Kamran M.",
  vehicle: "10-TZ-321",
  status: "in_transit",
  stopsCount: 3,
  stopLabels: ["Pickup 1", "Pickup 2", "Drop-off"],
  initialProgressPercent: 60,
  stops: [
    {
      type: "pickup",
      name: "Lankaran Farm",
      lat: 38.7543,
      lng: 48.8506,
      product: "Tomatoes",
      quantity: "120 kg",
      time: "09:30",
    },
    {
      type: "pickup",
      name: "Masalli Pickup Point",
      lat: 39.0341,
      lng: 48.665,
      product: "Apples",
      quantity: "200 kg",
      time: "11:00",
    },
    {
      type: "dropoff",
      name: "Baku Market",
      lat: 40.4093,
      lng: 49.8671,
      eta: "14:30",
    },
  ],
  vehiclePosition: {
    lat: 39.7,
    lng: 49.25,
  },
};

export function getRoutePathCoordinates(route: LogisticsRouteData): [number, number][] {
  return route.stops.map((stop) => [stop.lat, stop.lng]);
}
