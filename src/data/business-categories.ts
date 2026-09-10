export interface BusinessCategory {
  id: string;
  name: string;
  description: string;

  requiredCapital: {
    min: number;
    max: number;
  };

  resourceRequirements: string[];
  targetCustomers: string[];

  revenuePotential: "LOW" | "MEDIUM" | "HIGH";
  seasonalRisk: "LOW" | "MEDIUM" | "HIGH";
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: "food-processing",
    name: "Food Processing",
    description:
      "Small-scale processing and packaging of locally available food products.",

    requiredCapital: {
      min: 50000,
      max: 500000,
    },

    resourceRequirements: [
      "Local raw materials",
      "Basic processing equipment",
      "Packaging material",
    ],

    targetCustomers: [
      "Local households",
      "Retail shops",
      "Local markets",
    ],

    revenuePotential: "HIGH",
    seasonalRisk: "MEDIUM",
  },

  {
    id: "dairy",
    name: "Dairy Business",
    description:
      "Milk production and related dairy products for local consumers.",

    requiredCapital: {
      min: 75000,
      max: 500000,
    },

    resourceRequirements: [
      "Cattle or buffalo",
      "Animal feed",
      "Water",
      "Basic dairy equipment",
    ],

    targetCustomers: [
      "Households",
      "Tea shops",
      "Restaurants",
      "Local dairy collection centers",
    ],

    revenuePotential: "HIGH",
    seasonalRisk: "LOW",
  },

  {
    id: "tailoring",
    name: "Tailoring & Garment Services",
    description:
      "Clothing stitching, alteration and customized garment services.",

    requiredCapital: {
      min: 30000,
      max: 250000,
    },

    resourceRequirements: [
      "Sewing machine",
      "Electricity",
      "Fabric",
      "Workspace",
    ],

    targetCustomers: [
      "Local households",
      "Students",
      "Women",
      "Schools",
    ],

    revenuePotential: "MEDIUM",
    seasonalRisk: "LOW",
  },

  {
    id: "poultry",
    name: "Poultry Farming",
    description:
      "Small-scale poultry production for eggs or meat.",

    requiredCapital: {
      min: 75000,
      max: 500000,
    },

    resourceRequirements: [
      "Poultry shed",
      "Chicks",
      "Feed",
      "Water",
      "Vaccination",
    ],

    targetCustomers: [
      "Local households",
      "Hotels",
      "Restaurants",
      "Retailers",
    ],

    revenuePotential: "HIGH",
    seasonalRisk: "MEDIUM",
  },

  {
    id: "agri-inputs",
    name: "Agricultural Input Store",
    description:
      "Retail business supplying seeds, fertilizers and farming inputs.",

    requiredCapital: {
      min: 100000,
      max: 1000000,
    },

    resourceRequirements: [
      "Shop",
      "Storage",
      "Agricultural products",
      "Supplier network",
    ],

    targetCustomers: [
      "Farmers",
      "Agricultural workers",
      "Small landholders",
    ],

    revenuePotential: "HIGH",
    seasonalRisk: "HIGH",
  },

  {
    id: "mobile-repair",
    name: "Mobile Repair & Accessories",
    description:
      "Mobile phone repair and accessories retail service.",

    requiredCapital: {
      min: 50000,
      max: 300000,
    },

    resourceRequirements: [
      "Repair tools",
      "Small shop",
      "Spare parts",
      "Electricity",
    ],

    targetCustomers: [
      "Students",
      "Workers",
      "Households",
      "Local businesses",
    ],

    revenuePotential: "HIGH",
    seasonalRisk: "LOW",
  },

  {
    id: "kirana",
    name: "Kirana / General Store",
    description:
      "Small retail store selling daily household requirements.",

    requiredCapital: {
      min: 50000,
      max: 500000,
    },

    resourceRequirements: [
      "Shop",
      "Initial inventory",
      "Storage",
      "Supplier network",
    ],

    targetCustomers: [
      "Local households",
      "Workers",
      "Students",
      "Nearby villages",
    ],

    revenuePotential: "MEDIUM",
    seasonalRisk: "LOW",
  },

  {
    id: "beauty-salon",
    name: "Beauty & Salon Services",
    description:
      "Personal grooming, beauty and salon services.",

    requiredCapital: {
      min: 50000,
      max: 300000,
    },

    resourceRequirements: [
      "Shop",
      "Salon equipment",
      "Electricity",
      "Water",
    ],

    targetCustomers: [
      "Women",
      "Men",
      "Students",
      "Local households",
    ],

    revenuePotential: "MEDIUM",
    seasonalRisk: "LOW",
  },

  {
    id: "handicrafts",
    name: "Handicrafts",
    description:
      "Production and sale of locally made handicraft products.",

    requiredCapital: {
      min: 30000,
      max: 300000,
    },

    resourceRequirements: [
      "Local materials",
      "Craft skills",
      "Workspace",
      "Packaging",
    ],

    targetCustomers: [
      "Tourists",
      "Local consumers",
      "Online customers",
      "Retail shops",
    ],

    revenuePotential: "MEDIUM",
    seasonalRisk: "MEDIUM",
  },

  {
    id: "transport",
    name: "Local Transport Service",
    description:
      "Passenger or goods transportation within nearby rural areas.",

    requiredCapital: {
      min: 100000,
      max: 1500000,
    },

    resourceRequirements: [
      "Vehicle",
      "Fuel",
      "Maintenance",
      "Driving skills",
    ],

    targetCustomers: [
      "Farmers",
      "Households",
      "Local businesses",
      "Small traders",
    ],

    revenuePotential: "HIGH",
    seasonalRisk: "MEDIUM",
  },
];

export function getBusinessCategory(
  id: string
): BusinessCategory | undefined {
  return BUSINESS_CATEGORIES.find((business) => business.id === id);
}