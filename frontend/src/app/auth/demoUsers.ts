import type { UserRole } from "./authStorage";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export const DEMO_USERS: StoredUser[] = [
  {
    id: "user_buyer_demo",
    name: "Demo Buyer",
    email: "buyer@agrivo.az",
    password: "buyer123",
    role: "buyer",
    phone: "+994 50 000 00 01",
  },
  {
    id: "user_farmer_demo",
    name: "Demo Farmer",
    email: "farmer@agrivo.az",
    password: "farmer123",
    role: "farmer",
    phone: "+994 50 000 00 02",
  },
  {
    id: "user_logistics_demo",
    name: "Demo Logistics Partner",
    email: "logistics@agrivo.az",
    password: "logistics123",
    role: "logistics",
    phone: "+994 50 000 00 03",
  },
  {
    id: "user_admin_demo",
    name: "Demo Admin",
    email: "admin@agrivo.az",
    password: "admin123",
    role: "admin",
    phone: "+994 50 000 00 04",
  },
];

export const DEMO_LOGIN_HINTS = DEMO_USERS.filter((user) => user.role !== "admin").map((user) => ({
  role: user.role,
  email: user.email,
  password: user.password,
}));
