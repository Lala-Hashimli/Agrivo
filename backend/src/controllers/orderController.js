import * as orderService from "../services/orderService.js";

export async function listOrders(req, res) {
  const orders = await orderService.listOrders(req.user);
  res.json({ success: true, count: orders.length, orders });
}

export async function getOrder(req, res) {
  const order = await orderService.getOrderById(req.params.id, req.user);
  res.json({ success: true, order });
}

export async function createOrder(req, res) {
  const order = await orderService.createOrder(req.user.id, req.body || {});
  res.status(201).json({ success: true, message: "Order created successfully.", order });
}

export async function updateOrderStatus(req, res) {
  const body = req.body || {};
  const order = await orderService.updateOrderStatus(req.params.id, req.user, body.status);
  res.json({ success: true, message: "Order status updated.", order });
}
