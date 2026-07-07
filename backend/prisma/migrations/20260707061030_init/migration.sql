-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('buyer', 'farmer', 'logistics', 'admin');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'draft', 'inactive', 'out_of_stock');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('assigned', 'pickup_scheduled', 'ready_for_pickup', 'driver_assigned', 'pickup_started', 'collected', 'in_transit', 'near_destination', 'delivered', 'delayed', 'cancelled', 'issue_reported');

-- CreateEnum
CREATE TYPE "DeliveryPriority" AS ENUM ('low', 'normal', 'high');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "farmName" TEXT,
    "ownerName" TEXT,
    "region" TEXT,
    "district" TEXT,
    "village" TEXT,
    "address" TEXT,
    "description" TEXT,
    "mainProducts" TEXT,
    "mainCategories" TEXT,
    "farmSize" TEXT,
    "minimumOrder" TEXT,
    "deliveryOptions" TEXT,
    "paymentMethods" TEXT,
    "workingDays" TEXT,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "contactPerson" TEXT,
    "registrationNumber" TEXT,
    "address" TEXT,
    "serviceRegions" TEXT,
    "mainRoutes" TEXT,
    "driversCount" INTEGER,
    "vehiclesCount" INTEGER,
    "vehicleTypes" TEXT,
    "maxDailyCapacity" TEXT,
    "supportedDeliveryTypes" TEXT,
    "coldChainSupport" BOOLEAN NOT NULL DEFAULT false,
    "sameDayDelivery" BOOLEAN NOT NULL DEFAULT false,
    "workingDays" TEXT,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogisticsProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "variety" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "region" TEXT,
    "district" TEXT,
    "village" TEXT,
    "harvestDate" TEXT,
    "imageUrl" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'active',
    "isOrganic" BOOLEAN NOT NULL DEFAULT false,
    "isFresh" BOOLEAN NOT NULL DEFAULT true,
    "availableNow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "deliveryMethod" TEXT,
    "deliveryAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "variety" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "logisticsPartnerId" TEXT,
    "driverName" TEXT,
    "vehicle" TEXT,
    "pickupLocation" TEXT,
    "dropoffLocation" TEXT,
    "pickupTime" TIMESTAMP(3),
    "eta" TIMESTAMP(3),
    "status" "DeliveryStatus" NOT NULL DEFAULT 'assigned',
    "priority" "DeliveryPriority" NOT NULL DEFAULT 'normal',
    "currentLocation" TEXT,
    "distanceRemaining" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "proofStatus" TEXT,
    "rating" DOUBLE PRECISION,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerProfile_userId_key" ON "FarmerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsProfile_userId_key" ON "LogisticsProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_buyerId_productId_key" ON "CartItem"("buyerId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- AddForeignKey
ALTER TABLE "FarmerProfile" ADD CONSTRAINT "FarmerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsProfile" ADD CONSTRAINT "LogisticsProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_logisticsPartnerId_fkey" FOREIGN KEY ("logisticsPartnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
