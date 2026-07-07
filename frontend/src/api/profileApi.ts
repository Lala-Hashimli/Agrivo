import { apiGet, apiPut } from "./client";

interface ProfileResponse<T> {
  success: boolean;
  profile: T;
}

export async function getFarmerProfileApi<T>() {
  const res = await apiGet<ProfileResponse<T>>("/farmer/profile");
  return res.profile;
}

export async function updateFarmerProfileApi<T>(payload: Record<string, unknown>) {
  const res = await apiPut<ProfileResponse<T>>("/farmer/profile", payload);
  return res.profile;
}

export async function getLogisticsProfileApi<T>() {
  const res = await apiGet<ProfileResponse<T>>("/logistics/profile");
  return res.profile;
}

export async function updateLogisticsProfileApi<T>(payload: Record<string, unknown>) {
  const res = await apiPut<ProfileResponse<T>>("/logistics/profile", payload);
  return res.profile;
}

export async function getBuyerProfileApi<T>() {
  const res = await apiGet<ProfileResponse<T>>("/buyer/profile");
  return res.profile;
}

export async function updateBuyerProfileApi<T>(payload: Record<string, unknown>) {
  const res = await apiPut<ProfileResponse<T>>("/buyer/profile", payload);
  return res.profile;
}
