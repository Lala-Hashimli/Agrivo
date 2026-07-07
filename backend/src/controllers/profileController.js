import * as profileService from "../services/profileService.js";

export async function getFarmerProfile(req, res) {
  const profile = await profileService.getFarmerProfile(req.user.id);
  res.json({ success: true, profile });
}

export async function updateFarmerProfile(req, res) {
  const profile = await profileService.upsertFarmerProfile(req.user.id, req.body || {});
  res.json({ success: true, message: "Farmer profile updated.", profile });
}

export async function getLogisticsProfile(req, res) {
  const profile = await profileService.getLogisticsProfile(req.user.id);
  res.json({ success: true, profile });
}

export async function updateLogisticsProfile(req, res) {
  const profile = await profileService.upsertLogisticsProfile(req.user.id, req.body || {});
  res.json({ success: true, message: "Logistics profile updated.", profile });
}

export async function getBuyerProfile(req, res) {
  const profile = await profileService.getBuyerProfile(req.user.id);
  res.json({ success: true, profile });
}

export async function updateBuyerProfile(req, res) {
  const profile = await profileService.updateBuyerProfile(req.user.id, req.body || {});
  res.json({ success: true, message: "Buyer profile updated.", profile });
}
