import { prisma } from "../config/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";

const cartInclude = {
  product: {
    include: {
      farmer: { select: { id: true, name: true, email: true } },
    },
  },
};

export async function getCart(buyerId) {
  return prisma.cartItem.findMany({
    where: { buyerId },
    include: cartInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function addCartItem(buyerId, input) {
  const body = input || {};
  const { productId, quantity } = body;

  if (!productId || !quantity) {
    throw badRequest("productId and quantity are required.");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw notFound("Product not found.");
  }

  const qty = Number(quantity);
  if (Number.isNaN(qty) || qty <= 0) {
    throw badRequest("quantity must be a positive number.");
  }

  return prisma.cartItem.upsert({
    where: { buyerId_productId: { buyerId, productId } },
    update: { quantity: qty },
    create: { buyerId, productId, quantity: qty },
    include: cartInclude,
  });
}

export async function updateCartItem(buyerId, itemId, quantity) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, buyerId },
  });

  if (!item) {
    throw notFound("Cart item not found.");
  }

  const qty = Number(quantity);
  if (Number.isNaN(qty) || qty <= 0) {
    throw badRequest("quantity must be a positive number.");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: qty },
    include: cartInclude,
  });
}

export async function removeCartItem(buyerId, itemId) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, buyerId },
  });

  if (!item) {
    throw notFound("Cart item not found.");
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return { success: true };
}

export async function clearCart(buyerId) {
  await prisma.cartItem.deleteMany({ where: { buyerId } });
  return { success: true };
}
