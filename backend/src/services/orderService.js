import { prisma } from "../config/prisma.js";
import { badRequest, forbidden, notFound } from "../utils/ApiError.js";

const orderInclude = {
  items: true,
  buyer: { select: { id: true, name: true, email: true, role: true } },
  farmer: { select: { id: true, name: true, email: true, role: true } },
  delivery: true,
};

export async function listOrders(user) {
  const where =
    user.role === "admin"
      ? {}
      : user.role === "farmer"
        ? { farmerId: user.id }
        : user.role === "buyer"
          ? { buyerId: user.id }
          : null;

  if (!where) {
    throw forbidden("You do not have permission to view orders.");
  }

  return prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId, user) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) {
    throw notFound("Order not found.");
  }

  const canView =
    user.role === "admin" ||
    order.buyerId === user.id ||
    order.farmerId === user.id;

  if (!canView) {
    throw forbidden("You do not have permission to view this order.");
  }

  return order;
}

export async function createOrder(buyerId, input) {
  const body = input || {};

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw badRequest("Order items are required.");
  }

  const farmerId = body.farmerId;
  if (!farmerId) {
    throw badRequest("farmerId is required.");
  }

  const itemsData = [];
  let totalAmount = 0;

  for (const item of body.items) {
    if (!item.productId || !item.quantity) {
      throw badRequest("Each order item requires productId and quantity.");
    }

    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      throw badRequest(`Product not found: ${item.productId}`);
    }

    if (product.farmerId !== farmerId) {
      throw badRequest("All products must belong to the same farmer.");
    }

    const quantity = Number(item.quantity);
    const totalPrice = product.price * quantity;
    totalAmount += totalPrice;

    itemsData.push({
      productId: product.id,
      productName: product.name,
      variety: product.variety,
      quantity,
      unit: product.unit,
      pricePerUnit: product.price,
      totalPrice,
    });
  }

  return prisma.order.create({
    data: {
      buyerId,
      farmerId,
      totalAmount,
      deliveryMethod: body.deliveryMethod || null,
      deliveryAddress: body.deliveryAddress || null,
      items: { create: itemsData },
    },
    include: orderInclude,
  });
}

export async function updateOrderStatus(orderId, user, status) {
  if (!status) {
    throw badRequest("status is required.");
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw notFound("Order not found.");
  }

  const canUpdate =
    user.role === "admin" ||
    (user.role === "farmer" && order.farmerId === user.id) ||
    (user.role === "buyer" && order.buyerId === user.id && status === "cancelled");

  if (!canUpdate) {
    throw forbidden("You do not have permission to update this order.");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: orderInclude,
  });
}
