export interface ProductVariant {
  id: string;
  name: string; // e.g. "4\" (90mm)"
  mrp: number;
  price: number;
  inStock: boolean;
}

export interface ProductOptionGroup {
  name: string; // e.g. "Depth"
  options: string[]; // e.g. ["16\" (400mm)", "18\" (450mm)", "20\" (500mm)"]
}

export interface StructuredProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  image?: string; // We'll use placeholders or real urls
  mrp: number;
  price: number;
  bulk_price: number | null;
  bulk_threshold?: number;
  discount_percentage?: number;
  unit: string;
  badges?: string[]; // e.g., "Assured 2% Cashback", "Free Delivery"
  
  // For multi-variant products
  optionGroups?: ProductOptionGroup[];
  variants?: Record<string, ProductVariant[]>; // keyed by primary option (e.g. "16\" (400mm)")
}

export const STRUCTURED_CATALOG: StructuredProduct[] = [
  // CEMENT
  {
    id: "cem-002",
    name: "Adani ACC Suraksha Power PPC Cement",
    brand: "ACC",
    category: "Cement",
    image: "/images/acc_cement.jpg",
    mrp: 420,
    price: 385,
    bulk_price: 375,
    bulk_threshold: 50000,
    discount_percentage: 8,
    unit: "bag",
    badges: ["Free Delivery", "Assured 2% Cashback"],
  },
  {
    id: "cem-001",
    name: "UltraTech PPC Cement",
    brand: "UltraTech",
    category: "Cement",
    image: "/images/ultratech_cement.jpg",
    mrp: 440,
    price: 410,
    bulk_price: 390,
    bulk_threshold: 50000,
    discount_percentage: 6,
    unit: "bag",
    badges: ["Free Delivery", "Assured 2% Cashback"],
  },
  {
    id: "cem-003",
    name: "Maha PPC Cement",
    brand: "Maha",
    category: "Cement",
    image: "/images/maha_cement.jpg",
    mrp: 380,
    price: 355,
    bulk_price: 340,
    bulk_threshold: 50000,
    discount_percentage: 4,
    unit: "bag",
    badges: ["Free Delivery", "Assured 2% Cashback"],
  },
  {
    id: "cem-004",
    name: "Ramco Supergrade PPC Cement",
    brand: "Ramco",
    category: "Cement",
    image: "/images/ramco_cement.jpg",
    mrp: 400,
    price: 385,
    bulk_price: 370,
    bulk_threshold: 50000,
    discount_percentage: 4,
    unit: "bag",
    badges: ["Free Delivery", "Assured 2% Cashback"],
  },

  // KITCHEN SYSTEMS
  {
    id: "kit-001",
    name: "Ebco Pro Motion Tandem Box, S3 Series, 50Kg, Full Set, Anthracite",
    brand: "Ebco",
    category: "Kitchen Systems & Accessories",
    image: "/images/ebco_tandem_box.jpg",
    mrp: 3638,
    price: 2447,
    bulk_price: 2250,
    bulk_threshold: 10,
    discount_percentage: 33,
    unit: "set",
    badges: ["Free Delivery", "Assured 2% Cashback"],
    optionGroups: [
      {
        name: "Depth",
        options: ["16\" (400mm)", "18\" (450mm)", "20\" (500mm)"],
      },
      {
        name: "Tandem Height",
        options: ["4\" (90mm)", "6\" (122mm)", "8\" (172mm)", "10\" (203mm)"],
      }
    ],
    variants: {
      "16\" (400mm)": [
        { id: "kit-001-16-4", name: "4\" (90mm)", mrp: 3638, price: 2447, inStock: true },
        { id: "kit-001-16-6", name: "6\" (122mm)", mrp: 3886, price: 2614, inStock: true },
        { id: "kit-001-16-8", name: "8\" (172mm)", mrp: 4476, price: 3011, inStock: true },
        { id: "kit-001-16-10", name: "10\" (203mm)", mrp: 4878, price: 2846, inStock: false },
      ],
      "18\" (450mm)": [
        { id: "kit-001-18-4", name: "4\" (90mm)", mrp: 3700, price: 2500, inStock: true },
        { id: "kit-001-18-6", name: "6\" (122mm)", mrp: 3950, price: 2680, inStock: true },
        { id: "kit-001-18-8", name: "8\" (172mm)", mrp: 4550, price: 3100, inStock: false },
        { id: "kit-001-18-10", name: "10\" (203mm)", mrp: 4950, price: 3300, inStock: true },
      ],
      "20\" (500mm)": [
        { id: "kit-001-20-4", name: "4\" (90mm)", mrp: 3800, price: 2550, inStock: true },
        { id: "kit-001-20-6", name: "6\" (122mm)", mrp: 4050, price: 2750, inStock: true },
        { id: "kit-001-20-8", name: "8\" (172mm)", mrp: 4650, price: 3200, inStock: true },
        { id: "kit-001-20-10", name: "10\" (203mm)", mrp: 5050, price: 3450, inStock: true },
      ],
    }
  },
  {
    id: "kit-002",
    name: "Hettich InnoTech Tandem Box, Silver, 470mm",
    brand: "Hettich",
    category: "Kitchen Systems & Accessories",
    image: "/images/hettich_drawer.jpg",
    mrp: 3800,
    price: 3065,
    bulk_price: 2850,
    bulk_threshold: 10,
    discount_percentage: 48,
    unit: "set",
    badges: ["Free Delivery", "Assured 2% Cashback"],
    optionGroups: [
      {
        name: "Depth",
        options: ["470mm"],
      },
      {
        name: "Tandem Height",
        options: ["70mm", "144mm", "176mm"],
      }
    ],
    variants: {
      "470mm": [
        { id: "kit-002-470-70", name: "70mm", mrp: 5904, price: 3065, inStock: true },
        { id: "kit-002-470-144", name: "144mm", mrp: 6200, price: 3250, inStock: true },
        { id: "kit-002-470-176", name: "176mm", mrp: 6800, price: 3550, inStock: true },
      ],
    }
  },
  {
    id: "kit-003",
    name: "Ebco SS Cutlery Tray for 600mm Cabinet",
    brand: "Ebco",
    category: "Kitchen Systems & Accessories",
    image: "/images/ebco_cutlery_tray.jpg",
    mrp: 1850,
    price: 1720,
    bulk_price: 1600,
    bulk_threshold: 20,
    discount_percentage: 7,
    unit: "piece",
    badges: ["Free Delivery", "Assured 2% Cashback"],
  },
  {
    id: "kit-004",
    name: "Godrej Swift Drawer System, Dark Grey",
    brand: "Godrej",
    category: "Kitchen Systems & Accessories",
    image: "/images/godrej_drawer.jpg",
    mrp: 2900,
    price: 2173,
    bulk_price: 2000,
    bulk_threshold: 10,
    discount_percentage: 47,
    unit: "set",
    badges: ["Free Delivery", "Assured 2% Cashback"],
  }
];
