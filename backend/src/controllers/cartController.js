import * as cartService from "../services/cartService.js";

export async function getCart(req, res) {
  const items = await cartService.getCart(req.user.id);
  res.json({ success: true, count: items.length, items });
}

export async function addCartItem(req, res) {
  const item = await cartService.addCartItem(req.user.id, req.body || {});
  res.status(201).json({ success: true, message: "Cart item saved.", item });
}

export async function updateCartItem(req, res) {
  const body = req.body || {};
  const item = await cartService.updateCartItem(req.user.id, req.params.id, body.quantity);
  res.json({ success: true, message: "Cart item updated.", item });
}

export async function removeCartItem(req, res) {
  await cartService.removeCartItem(req.user.id, req.params.id);
  res.json({ success: true, message: "Cart item removed." });
}

export async function clearCart(req, res) {
  await cartService.clearCart(req.user.id);
  res.json({ success: true, message: "Cart cleared." });
}
