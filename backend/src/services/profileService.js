import { prisma } from "../config/prisma.js";
import { forbidden, notFound } from "../utils/ApiError.js";

export async function getFarmerProfile(userId) {
  const profile = await prisma.farmerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  });

  if (!profile) {
    throw notFound("Farmer profile not found.");
  }

  return profile;
}

export async function upsertFarmerProfile(userId, input) {
  const body = input || {};

  return prisma.farmerProfile.upsert({
    where: { userId },
    update: {
      farmName: body.farmName,
      ownerName: body.ownerName,
      region: body.region,
      district: body.district,
      village: body.village,
      address: body.address,
      description: body.description,
      mainProducts: body.mainProducts,
      mainCategories: body.mainCategories,
      farmSize: body.farmSize,
      minimumOrder: body.minimumOrder,
      deliveryOptions: body.deliveryOptions,
      paymentMethods: body.paymentMethods,
      workingDays: body.workingDays,
      openingTime: body.openingTime,
      closingTime: body.closingTime,
      rating: body.rating,
      verified: body.verified,
    },
    create: {
      userId,
      farmName: body.farmName,
      ownerName: body.ownerName,
      region: body.region,
      district: body.district,
      village: body.village,
      address: body.address,
      description: body.description,
      mainProducts: body.mainProducts,
      mainCategories: body.mainCategories,
      farmSize: body.farmSize,
      minimumOrder: body.minimumOrder,
      deliveryOptions: body.deliveryOptions,
      paymentMethods: body.paymentMethods,
      workingDays: body.workingDays,
      openingTime: body.openingTime,
      closingTime: body.closingTime,
      rating: body.rating ?? 0,
      verified: body.verified ?? false,
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  });
}

export async function getLogisticsProfile(userId) {
  const profile = await prisma.logisticsProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  });

  if (!profile) {
    throw notFound("Logistics profile not found.");
  }

  return profile;
}

export async function upsertLogisticsProfile(userId, input) {
  const body = input || {};

  return prisma.logisticsProfile.upsert({
    where: { userId },
    update: {
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      registrationNumber: body.registrationNumber,
      address: body.address,
      serviceRegions: body.serviceRegions,
      mainRoutes: body.mainRoutes,
      driversCount: body.driversCount,
      vehiclesCount: body.vehiclesCount,
      vehicleTypes: body.vehicleTypes,
      maxDailyCapacity: body.maxDailyCapacity,
      supportedDeliveryTypes: body.supportedDeliveryTypes,
      coldChainSupport: body.coldChainSupport,
      sameDayDelivery: body.sameDayDelivery,
      workingDays: body.workingDays,
      openingTime: body.openingTime,
      closingTime: body.closingTime,
      rating: body.rating,
      verified: body.verified,
    },
    create: {
      userId,
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      registrationNumber: body.registrationNumber,
      address: body.address,
      serviceRegions: body.serviceRegions,
      mainRoutes: body.mainRoutes,
      driversCount: body.driversCount,
      vehiclesCount: body.vehiclesCount,
      vehicleTypes: body.vehicleTypes,
      maxDailyCapacity: body.maxDailyCapacity,
      supportedDeliveryTypes: body.supportedDeliveryTypes,
      coldChainSupport: body.coldChainSupport ?? false,
      sameDayDelivery: body.sameDayDelivery ?? false,
      workingDays: body.workingDays,
      openingTime: body.openingTime,
      closingTime: body.closingTime,
      rating: body.rating ?? 0,
      verified: body.verified ?? false,
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  });
}

export async function getBuyerProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    throw notFound("Buyer profile not found.");
  }

  if (user.role !== "buyer" && user.role !== "admin") {
    throw forbidden("Only buyers can access buyer profile.");
  }

  return user;
}

export async function updateBuyerProfile(userId, input) {
  const body = input || {};

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.name !== undefined ? { name: body.name.trim() } : {}),
      ...(body.phone !== undefined ? { phone: body.phone?.trim() || null } : {}),
    },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, updatedAt: true },
  });
}
