import * as deliveryService from "../services/deliveryService.js";

export async function listDeliveries(req, res) {
  const deliveries = await deliveryService.listDeliveries(req.user, req.query);
  res.json({ success: true, count: deliveries.length, deliveries });
}

export async function getDelivery(req, res) {
  const delivery = await deliveryService.getDeliveryById(req.params.id, req.user);
  res.json({ success: true, delivery });
}

export async function createDelivery(req, res) {
  const delivery = await deliveryService.createDelivery(req.user, req.body || {});
  res.status(201).json({ success: true, message: "Delivery created.", delivery });
}

export async function updateDeliveryStatus(req, res) {
  const body = req.body || {};
  const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.user, body.status);
  res.json({ success: true, message: "Delivery status updated.", delivery });
}

export async function updateDeliveryLocation(req, res) {
  const delivery = await deliveryService.updateDeliveryLocation(req.params.id, req.user, req.body || {});
  res.json({ success: true, message: "Delivery location updated.", delivery });
}

export async function getOverview(req, res) {
  const overview = await deliveryService.getLogisticsOverview(req.user);
  res.json({ success: true, overview });
}

export async function getAssigned(req, res) {
  const deliveries = await deliveryService.listDeliveriesByStatus(req.user, ["assigned", "driver_assigned"]);
  res.json({ success: true, count: deliveries.length, deliveries });
}

export async function getPickup(req, res) {
  const deliveries = await deliveryService.listDeliveriesByStatus(req.user, [
    "pickup_scheduled",
    "ready_for_pickup",
    "pickup_started",
    "collected",
  ]);
  res.json({ success: true, count: deliveries.length, deliveries });
}

export async function getInTransit(req, res) {
  const deliveries = await deliveryService.listDeliveriesByStatus(req.user, ["in_transit", "near_destination"]);
  res.json({ success: true, count: deliveries.length, deliveries });
}

export async function getCompleted(req, res) {
  const deliveries = await deliveryService.listDeliveriesByStatus(req.user, ["delivered"]);
  res.json({ success: true, count: deliveries.length, deliveries });
}
