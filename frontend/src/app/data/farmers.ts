export interface FarmerProduct {
  name: string;
  category: string;
  price: string;
  unit: string;
  available: string;
  description: string;
}

export interface FarmerReview {
  author: string;
  rating: number;
  text: string;
}

export interface FarmerProfile {
  slug: string;
  name: string;
  location: string;
  districtCity: string;
  economicRegion: string;
  village?: string;
  experience: string;
  category: string;
  specialties: string[];
  rating: number;
  completedOrders: number;
  image: string;
  whatsapp: string;
  about: string;
  farmDetails: {
    farmName: string;
    location: string;
    farmSize: string;
    experience: string;
    mainProducts: string;
    minimumOrder: string;
    deliverySupport: string;
    harvestSeason: string;
  };
  products: FarmerProduct[];
  reviews: FarmerReview[];
}

export const farmerCategories = ["Vegetables", "Fruits", "Dairy Products"] as const;

export const allFarmers: FarmerProfile[] = [
  {
    slug: "ali-hasanov",
    name: "Ali Hasanov",
    location: "Lankaran",
    districtCity: "Lənkəran şəhəri",
    economicRegion: "Lənkəran-Astara",
    village: "Seyidəkəran",
    experience: "12 years",
    category: "Vegetables",
    specialties: ["Tomatoes", "Cucumbers"],
    rating: 4.8,
    completedOrders: 24,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    whatsapp: "994501234567",
    about:
      "Ali Hasanov runs a family vegetable farm in Lankaran, focused on greenhouse tomatoes and open-field cucumbers. His produce is harvested at peak ripeness and prepared for direct farm-to-market delivery through Agrivo.",
    farmDetails: {
      farmName: "Hasanov Green Farm",
      location: "Lankaran, Azerbaijan",
      farmSize: "4.2 hectares",
      experience: "12 years",
      mainProducts: "Tomatoes, Cucumbers",
      minimumOrder: "20 kg",
      deliverySupport: "Yes — regional handoff",
      harvestSeason: "March – November",
    },
    products: [
      {
        name: "Tomatoes",
        category: "Vegetables",
        price: "2.50",
        unit: "AZN/kg",
        available: "120 kg",
        description: "Vine-ripened Lankaran tomatoes with firm texture and rich flavor.",
      },
      {
        name: "Cucumbers",
        category: "Vegetables",
        price: "1.80",
        unit: "AZN/kg",
        available: "90 kg",
        description: "Crisp cucumbers packed fresh for restaurants and local buyers.",
      },
    ],
    reviews: [
      {
        author: "Nigar Aliyeva",
        rating: 5,
        text: "Tomatoes arrived fresh and well packed. Communication was quick and professional.",
      },
      {
        author: "Restaurant Baku Greens",
        rating: 4.5,
        text: "Reliable weekly supply with consistent quality from Ali's farm.",
      },
    ],
  },
  {
    slug: "aysel-mammadova",
    name: "Aysel Mammadova",
    location: "Quba",
    districtCity: "Quba rayonu",
    economicRegion: "Quba-Xaçmaz",
    village: "Alpan",
    experience: "9 years",
    category: "Fruits",
    specialties: ["Apples", "Pears"],
    rating: 4.9,
    completedOrders: 31,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    whatsapp: "994502345678",
    about:
      "Aysel Mammadova manages orchard blocks in Quba known for crisp apples and aromatic pears. She works with Agrivo to connect seasonal fruit harvests directly to buyers who value traceability and freshness.",
    farmDetails: {
      farmName: "Quba Orchard Grove",
      location: "Quba, Azerbaijan",
      farmSize: "6.5 hectares",
      experience: "9 years",
      mainProducts: "Apples, Pears",
      minimumOrder: "25 kg",
      deliverySupport: "Yes — cold-chain ready",
      harvestSeason: "August – November",
    },
    products: [
      {
        name: "Apples",
        category: "Fruits",
        price: "1.60",
        unit: "AZN/kg",
        available: "200 kg",
        description: "Hand-picked orchard apples sorted for retail and food service.",
      },
      {
        name: "Pears",
        category: "Fruits",
        price: "2.00",
        unit: "AZN/kg",
        available: "150 kg",
        description: "Sweet Quba pears with careful grading and farm-direct pricing.",
      },
    ],
    reviews: [
      {
        author: "Samir Huseynov",
        rating: 5,
        text: "Excellent fruit quality and transparent availability updates every week.",
      },
      {
        author: "Fresh Basket Market",
        rating: 4.8,
        text: "Aysel's pears are a customer favorite. Smooth ordering through Agrivo.",
      },
    ],
  },
  {
    slug: "murad-karimov",
    name: "Murad Karimov",
    location: "Shaki",
    districtCity: "Şəki rayonu",
    economicRegion: "Şəki-Zaqatala",
    village: "Aydınbulaq",
    experience: "15 years",
    category: "Dairy Products",
    specialties: ["Milk", "Cheese"],
    rating: 4.7,
    completedOrders: 18,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    whatsapp: "994503456789",
    about:
      "Murad Karimov operates a small dairy farm in Shaki, producing fresh milk and artisan cheese for local markets. His farm follows strict hygiene standards and supports scheduled Agrivo delivery handoffs.",
    farmDetails: {
      farmName: "Shaki Valley Dairy",
      location: "Shaki, Azerbaijan",
      farmSize: "18 hectares",
      experience: "15 years",
      mainProducts: "Milk, Cheese",
      minimumOrder: "10 liters / 5 kg",
      deliverySupport: "Yes — chilled transport",
      harvestSeason: "Year-round production",
    },
    products: [
      {
        name: "Milk",
        category: "Dairy Products",
        price: "1.40",
        unit: "AZN/liter",
        available: "80 liters",
        description: "Fresh farm milk collected daily and prepared for market delivery.",
      },
      {
        name: "Cheese",
        category: "Dairy Products",
        price: "6.50",
        unit: "AZN/kg",
        available: "35 kg",
        description: "Locally crafted cheese with a smooth texture and rich dairy flavor.",
      },
    ],
    reviews: [
      {
        author: "Leyla Karimli",
        rating: 4.8,
        text: "Milk and cheese quality is consistently high. Murad is responsive on WhatsApp.",
      },
      {
        author: "Cafe Sheki Corner",
        rating: 4.6,
        text: "Great partner for dairy supply with clear batch availability on Agrivo.",
      },
    ],
  },
  {
    slug: "leyla-abbasova",
    name: "Leyla Abbasova",
    location: "Ganja",
    districtCity: "Gəncə şəhəri",
    economicRegion: "Gəncə-Daşkəsən",
    experience: "7 years",
    category: "Vegetables",
    specialties: ["Potatoes", "Carrots"],
    rating: 4.6,
    completedOrders: 16,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
    whatsapp: "994504567890",
    about:
      "Leyla Abbasova grows root vegetables on irrigated fields near Ganja, supplying restaurants and wholesale buyers with dependable seasonal harvests through Agrivo.",
    farmDetails: {
      farmName: "Ganja Root Fields",
      location: "Ganja, Azerbaijan",
      farmSize: "3.8 hectares",
      experience: "7 years",
      mainProducts: "Potatoes, Carrots",
      minimumOrder: "30 kg",
      deliverySupport: "Yes — regional routes",
      harvestSeason: "June – October",
    },
    products: [
      {
        name: "Potatoes",
        category: "Vegetables",
        price: "0.95",
        unit: "AZN/kg",
        available: "240 kg",
        description: "Clean, firm potatoes sorted for market and kitchen supply.",
      },
      {
        name: "Carrots",
        category: "Vegetables",
        price: "1.20",
        unit: "AZN/kg",
        available: "110 kg",
        description: "Sweet carrots harvested fresh for direct buyer delivery.",
      },
    ],
    reviews: [
      {
        author: "Catering Ganja Plus",
        rating: 4.7,
        text: "Consistent potato quality and clear order communication every week.",
      },
      {
        author: "Samad Mammadov",
        rating: 4.5,
        text: "Carrots arrived fresh and well graded. Easy to reorder on Agrivo.",
      },
    ],
  },
  {
    slug: "rashad-aliyev",
    name: "Rashad Aliyev",
    location: "Baku",
    districtCity: "Bakı şəhəri",
    economicRegion: "Bakı",
    experience: "10 years",
    category: "Dairy Products",
    specialties: ["Yogurt", "Fresh Milk"],
    rating: 4.8,
    completedOrders: 22,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    whatsapp: "994505678901",
    about:
      "Rashad Aliyev runs a peri-urban dairy operation serving Baku buyers with daily milk collection and small-batch yogurt production, coordinated through Agrivo delivery handoffs.",
    farmDetails: {
      farmName: "Baku Fresh Dairy",
      location: "Baku, Azerbaijan",
      farmSize: "12 hectares",
      experience: "10 years",
      mainProducts: "Yogurt, Fresh Milk",
      minimumOrder: "15 liters",
      deliverySupport: "Yes — daily city routes",
      harvestSeason: "Year-round production",
    },
    products: [
      {
        name: "Fresh Milk",
        category: "Dairy Products",
        price: "1.35",
        unit: "AZN/liter",
        available: "120 liters",
        description: "Daily collected milk prepared for chilled urban delivery.",
      },
      {
        name: "Yogurt",
        category: "Dairy Products",
        price: "3.20",
        unit: "AZN/kg",
        available: "60 kg",
        description: "Creamy yogurt produced in small batches for retail partners.",
      },
    ],
    reviews: [
      {
        author: "Baku Morning Market",
        rating: 4.9,
        text: "Reliable dairy supply with excellent freshness and punctual delivery.",
      },
      {
        author: "Aynur Hasanova",
        rating: 4.7,
        text: "Yogurt quality is excellent. Rashad is very responsive on WhatsApp.",
      },
    ],
  },
  {
    slug: "nigar-safarova",
    name: "Nigar Safarova",
    location: "Quba",
    districtCity: "Quba rayonu",
    economicRegion: "Quba-Xaçmaz",
    village: "Adur",
    experience: "8 years",
    category: "Fruits",
    specialties: ["Cherries", "Apples"],
    rating: 4.7,
    completedOrders: 19,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    whatsapp: "994506789012",
    about:
      "Nigar Safarova manages hillside orchards in Quba, known for bright cherries and crisp apples sold directly to buyers who want traceable seasonal fruit through Agrivo.",
    farmDetails: {
      farmName: "Safarova Orchard Hills",
      location: "Quba, Azerbaijan",
      farmSize: "5.1 hectares",
      experience: "8 years",
      mainProducts: "Cherries, Apples",
      minimumOrder: "20 kg",
      deliverySupport: "Yes — orchard pickup routes",
      harvestSeason: "May – November",
    },
    products: [
      {
        name: "Cherries",
        category: "Fruits",
        price: "3.40",
        unit: "AZN/kg",
        available: "85 kg",
        description: "Hand-picked cherries with careful sorting for premium buyers.",
      },
      {
        name: "Apples",
        category: "Fruits",
        price: "1.70",
        unit: "AZN/kg",
        available: "175 kg",
        description: "Crisp orchard apples packed for farm-to-market orders.",
      },
    ],
    reviews: [
      {
        author: "Hotel Quba Ridge",
        rating: 4.8,
        text: "Cherries were outstanding during peak season. Great communication.",
      },
      {
        author: "Elvin Karimov",
        rating: 4.6,
        text: "Apples arrived in excellent condition. Will order again through Agrivo.",
      },
    ],
  },
];

export const featuredFarmers = allFarmers.slice(0, 3);

export function getFarmerBySlug(slug: string) {
  return allFarmers.find((farmer) => farmer.slug === slug);
}

export function getFarmerByName(name: string) {
  return allFarmers.find((farmer) => farmer.name.toLowerCase() === name.toLowerCase());
}
