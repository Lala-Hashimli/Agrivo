import { apiDelete, apiGet, apiPatch, apiPost } from "./client";

export interface ApiCartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
    variety: string | null;
    price: number;
    unit: string;
    quantity: number;
    region: string | null;
    district: string | null;
    village: string | null;
    farmerId: string;
    farmer?: { id: string; name: string; email: string };
  };
}

interface CartResponse {
  success: boolean;
  count: number;
  items: ApiCartItem[];
}

interface CartItemResponse {
  success: boolean;
  item: ApiCartItem;
}

export async function getCartItemsApi(): Promise<ApiCartItem[]> {
  const res = await apiGet<CartResponse>("/cart");
  return res.items;
}

export async function addCartItemApi(productId: string, quantity: number): Promise<ApiCartItem> {
  const res = await apiPost<CartItemResponse>("/cart/items", { productId, quantity });
  return res.item;
}

export async function updateCartItemApi(id: string, quantity: number): Promise<ApiCartItem> {
  const res = await apiPatch<CartItemResponse>(`/cart/items/${id}`, { quantity });
  return res.item;
}

export async function removeCartItemApi(id: string): Promise<void> {
  await apiDelete(`/cart/items/${id}`);
}

export async function clearCartApi(): Promise<void> {
  await apiDelete("/cart");
}
