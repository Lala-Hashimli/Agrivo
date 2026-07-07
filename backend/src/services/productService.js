import { prisma } from "../config/prisma.js";
import { badRequest, forbidden, notFound } from "../utils/ApiError.js";

const productInclude = {
  farmer: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

function buildProductFilters(query) {
  const { category, region, district, name, variety, minPrice, maxPrice } = query;
  const where = {
    status: "active",
  };

  if (category) {
    where.category = { contains: category, mode: "insensitive" };
  }

  if (region) {
    where.region = { contains: region, mode: "insensitive" };
  }

  if (district) {
    where.district = { contains: district, mode: "insensitive" };
  }

  if (name) {
    where.name = { contains: name, mode: "insensitive" };
  }

  if (variety) {
    where.variety = { contains: variety, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  return where;
}

export async function listProducts(query = {}) {
  return prisma.product.findMany({
    where: buildProductFilters(query),
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw notFound("Product not found.");
  }

  return product;
}

export async function listProductsByFarmer(farmerId, query = {}) {
  const where = {
    farmerId,
    ...buildProductFilters(query),
  };

  return prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

function validateProductInput(input, { partial = false } = {}) {
  const requiredFields = ["name", "category", "price", "quantity", "unit"];

  if (!partial) {
    for (const field of requiredFields) {
      if (input[field] === undefined || input[field] === null || input[field] === "") {
        throw badRequest(`${field} is required.`);
      }
    }
  }

  if (input.price !== undefined && Number.isNaN(Number(input.price))) {
    throw badRequest("price must be a valid number.");
  }

  if (input.quantity !== undefined && Number.isNaN(Number(input.quantity))) {
    throw badRequest("quantity must be a valid number.");
  }
}

export async function createProduct(farmerId, input) {
  validateProductInput(input);

  return prisma.product.create({
    data: {
      farmerId,
      name: input.name.trim(),
      category: input.category.trim(),
      variety: input.variety?.trim() || null,
      description: input.description?.trim() || null,
      price: Number(input.price),
      quantity: Number(input.quantity),
      unit: input.unit?.trim() || "kg",
      region: input.region?.trim() || null,
      district: input.district?.trim() || null,
      village: input.village?.trim() || null,
      harvestDate: input.harvestDate?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      status: input.status || "active",
      isOrganic: Boolean(input.isOrganic),
      isFresh: input.isFresh !== undefined ? Boolean(input.isFresh) : true,
      availableNow: input.availableNow !== undefined ? Boolean(input.availableNow) : true,
    },
    include: productInclude,
  });
}

async function assertCanModifyProduct(product, user) {
  if (!product) {
    throw notFound("Product not found.");
  }

  if (user.role === "admin") {
    return product;
  }

  if (user.role === "farmer" && product.farmerId === user.id) {
    return product;
  }

  throw forbidden("You do not have permission to modify this product.");
}

export async function updateProduct(productId, user, input) {
  validateProductInput(input, { partial: true });

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  await assertCanModifyProduct(existing, user);

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.category !== undefined ? { category: input.category.trim() } : {}),
      ...(input.variety !== undefined ? { variety: input.variety?.trim() || null } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.price !== undefined ? { price: Number(input.price) } : {}),
      ...(input.quantity !== undefined ? { quantity: Number(input.quantity) } : {}),
      ...(input.unit !== undefined ? { unit: input.unit.trim() } : {}),
      ...(input.region !== undefined ? { region: input.region?.trim() || null } : {}),
      ...(input.district !== undefined ? { district: input.district?.trim() || null } : {}),
      ...(input.village !== undefined ? { village: input.village?.trim() || null } : {}),
      ...(input.harvestDate !== undefined ? { harvestDate: input.harvestDate?.trim() || null } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl?.trim() || null } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.isOrganic !== undefined ? { isOrganic: Boolean(input.isOrganic) } : {}),
      ...(input.isFresh !== undefined ? { isFresh: Boolean(input.isFresh) } : {}),
      ...(input.availableNow !== undefined ? { availableNow: Boolean(input.availableNow) } : {}),
    },
    include: productInclude,
  });
}

export async function deleteProduct(productId, user) {
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  await assertCanModifyProduct(existing, user);

  await prisma.product.delete({ where: { id: productId } });
  return { success: true };
}
