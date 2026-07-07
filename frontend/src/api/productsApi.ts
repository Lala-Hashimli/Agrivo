import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export interface ApiProduct {
  id: string;
  farmerId: string;
  name: string;
  category: string;
  variety: string | null;
  description: string | null;
  price: number;
  quantity: number;
  unit: string;
  region: string | null;
  district: string | null;
  village: string | null;
  harvestDate: string | null;
  imageUrl: string | null;
  status: string;
  isOrganic: boolean;
  isFresh: boolean;
  availableNow: boolean;
  farmer?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ProductFilters {
  category?: string;
  region?: string;
  district?: string;
  name?: string;
  variety?: string;
}

interface ProductsResponse {
  success: boolean;
  count: number;
  products: ApiProduct[];
}

interface ProductResponse {
  success: boolean;
  product: ApiProduct;
  data?: ApiProduct;
}

function toQuery(filters?: ProductFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getProducts(filters?: ProductFilters): Promise<ApiProduct[]> {
  const response = await apiGet<ProductsResponse>(`/products${toQuery(filters)}`, {
    auth: false,
  });
  return response.products;
}

export async function getProductById(id: string): Promise<ApiProduct> {
  const response = await apiGet<ProductResponse>(`/products/${id}`, {
    auth: false,
  });
  return response.product ?? response.data!;
}

export async function getFarmerProducts(farmerId: string): Promise<ApiProduct[]> {
  const response = await apiGet<ProductsResponse>(`/farmers/${farmerId}/products`, {
    auth: false,
  });
  return response.products;
}

export async function createProduct(data: Record<string, unknown>): Promise<ApiProduct> {
  const response = await apiPost<ProductResponse>("/products", data);
  return response.product;
}

export async function updateProduct(id: string, data: Record<string, unknown>): Promise<ApiProduct> {
  const response = await apiPut<ProductResponse>(`/products/${id}`, data);
  return response.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiDelete(`/products/${id}`);
}
