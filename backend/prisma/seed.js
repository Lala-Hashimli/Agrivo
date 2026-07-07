import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USERS = [
  {
    name: "Demo Buyer",
    email: "buyer@agrivo.az",
    password: "buyer123",
    phone: "+994 50 000 00 01",
    role: "buyer",
  },
  {
    name: "Demo Farmer",
    email: "farmer@agrivo.az",
    password: "farmer123",
    phone: "+994 50 000 00 02",
    role: "farmer",
  },
  {
    name: "Demo Logistics Partner",
    email: "logistics@agrivo.az",
    password: "logistics123",
    phone: "+994 50 000 00 03",
    role: "logistics",
  },
  {
    name: "Demo Admin",
    email: "admin@agrivo.az",
    password: "admin123",
    phone: "+994 50 000 00 04",
    role: "admin",
  },
];

const SAMPLE_PRODUCTS = [
  {
    name: "Tomatoes",
    variety: "Çerri Pomidor",
    category: "Vegetables",
    price: 2.5,
    quantity: 120,
    unit: "kg",
    region: "Şəki-Zaqatala",
    district: "Quba",
    imageUrl: "https://images.unsplash.com/photo-1546094097-3c1b07688fd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cucumbers",
    variety: "Uzun Xiyar",
    category: "Vegetables",
    price: 1.8,
    quantity: 90,
    unit: "kg",
    region: "Lənkəran-Astara",
    district: "Lankaran",
    imageUrl: "https://images.unsplash.com/photo-1449307239951-6580b87be850?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Apples",
    variety: "Qızıl Əhmədi",
    category: "Fruits",
    price: 1.7,
    quantity: 200,
    unit: "kg",
    region: "Şəki-Zaqatala",
    district: "Quba",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Carrots",
    variety: "Yerli Kök",
    category: "Vegetables",
    price: 1.2,
    quantity: 150,
    unit: "kg",
    region: "Gəncə-Daşkəsən",
    district: "Ganja",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a594c0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cherries",
    variety: "Qara Gilas",
    category: "Fruits",
    price: 3.4,
    quantity: 80,
    unit: "kg",
    region: "Şəki-Zaqatala",
    district: "Quba",
    imageUrl: "https://images.unsplash.com/photo-1528821122594-5f7621e0b708?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Watermelon",
    variety: "Sabirabad Qarpızı",
    category: "Fruits",
    price: 0.6,
    quantity: 500,
    unit: "kg",
    region: "Aran",
    district: "Sabirabad",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a22242a09a5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Potato",
    variety: "Gədəbəy Kartofu",
    category: "Vegetables",
    price: 0.95,
    quantity: 300,
    unit: "kg",
    region: "Gəncə-Daşkəsən",
    district: "Gadabay",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pomegranate",
    variety: "Gülöyşə",
    category: "Fruits",
    price: 2.8,
    quantity: 110,
    unit: "kg",
    region: "Lənkəran-Astara",
    district: "Lankaran",
    imageUrl: "https://images.unsplash.com/photo-1615485925511-ef3f1ab2a1e2?auto=format&fit=crop&w=800&q=80",
  },
];

async function main() {
  console.log("Seeding Agrivo database...");

  let farmerUserId = null;

  for (const demoUser of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(demoUser.password, 12);

    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        name: demoUser.name,
        phone: demoUser.phone,
        role: demoUser.role,
        passwordHash,
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        role: demoUser.role,
        passwordHash,
      },
    });

    if (demoUser.role === "farmer") {
      farmerUserId = user.id;

      await prisma.farmerProfile.upsert({
        where: { userId: user.id },
        update: {
          farmName: "Safarova Orchard Hills",
          ownerName: demoUser.name,
          region: "Şəki-Zaqatala",
          district: "Quba",
          village: "Qəçrəş",
          description: "Family orchard specializing in apples, cherries, and seasonal vegetables.",
          mainProducts: "Tomatoes, Apples, Cherries",
          mainCategories: "Fruits, Vegetables",
          farmSize: "12 ha",
          minimumOrder: "20 kg",
          deliveryOptions: "Farmer delivery, Logistics partner",
          paymentMethods: "Cash, Bank transfer",
          workingDays: "Mon-Sat",
          openingTime: "08:00",
          closingTime: "18:00",
          rating: 4.8,
          verified: true,
        },
        create: {
          userId: user.id,
          farmName: "Safarova Orchard Hills",
          ownerName: demoUser.name,
          region: "Şəki-Zaqatala",
          district: "Quba",
          village: "Qəçrəş",
          description: "Family orchard specializing in apples, cherries, and seasonal vegetables.",
          mainProducts: "Tomatoes, Apples, Cherries",
          mainCategories: "Fruits, Vegetables",
          farmSize: "12 ha",
          minimumOrder: "20 kg",
          deliveryOptions: "Farmer delivery, Logistics partner",
          paymentMethods: "Cash, Bank transfer",
          workingDays: "Mon-Sat",
          openingTime: "08:00",
          closingTime: "18:00",
          rating: 4.8,
          verified: true,
        },
      });
    }

    if (demoUser.role === "logistics") {
      await prisma.logisticsProfile.upsert({
        where: { userId: user.id },
        update: {
          companyName: "Agrivo Logistics AZ",
          contactPerson: demoUser.name,
          registrationNumber: "AZ-LOG-2048",
          address: "Baku, Azerbaijan",
          serviceRegions: "Abşeron, Lənkəran, Gəncə, Şəki",
          mainRoutes: "Lankaran → Baku, Quba → Baku, Ganja → Baku",
          driversCount: 8,
          vehiclesCount: 6,
          vehicleTypes: "Refrigerated van, Box truck",
          maxDailyCapacity: "4,500 kg",
          supportedDeliveryTypes: "Farm pickup, Market delivery, Cold chain",
          coldChainSupport: true,
          sameDayDelivery: true,
          workingDays: "Mon-Sun",
          openingTime: "06:00",
          closingTime: "22:00",
          rating: 4.7,
          verified: true,
        },
        create: {
          userId: user.id,
          companyName: "Agrivo Logistics AZ",
          contactPerson: demoUser.name,
          registrationNumber: "AZ-LOG-2048",
          address: "Baku, Azerbaijan",
          serviceRegions: "Abşeron, Lənkəran, Gəncə, Şəki",
          mainRoutes: "Lankaran → Baku, Quba → Baku, Ganja → Baku",
          driversCount: 8,
          vehiclesCount: 6,
          vehicleTypes: "Refrigerated van, Box truck",
          maxDailyCapacity: "4,500 kg",
          supportedDeliveryTypes: "Farm pickup, Market delivery, Cold chain",
          coldChainSupport: true,
          sameDayDelivery: true,
          workingDays: "Mon-Sun",
          openingTime: "06:00",
          closingTime: "22:00",
          rating: 4.7,
          verified: true,
        },
      });
    }

    console.log(`Seeded ${demoUser.role}: ${demoUser.email}`);
  }

  if (farmerUserId) {
    const existingCount = await prisma.product.count({ where: { farmerId: farmerUserId } });

    if (existingCount === 0) {
      for (const product of SAMPLE_PRODUCTS) {
        await prisma.product.create({
          data: {
            farmerId: farmerUserId,
            name: product.name,
            variety: product.variety,
            category: product.category,
            description: `${product.name} (${product.variety}) from ${product.district}.`,
            price: product.price,
            quantity: product.quantity,
            unit: product.unit,
            region: product.region,
            district: product.district,
            harvestDate: "This week",
            imageUrl: product.imageUrl,
            status: "active",
            isOrganic: false,
            isFresh: true,
            availableNow: true,
          },
        });
      }

      console.log(`Seeded ${SAMPLE_PRODUCTS.length} sample products.`);
    } else {
      console.log(`Skipped product seeding (${existingCount} products already exist).`);
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
