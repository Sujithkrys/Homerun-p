import { ProductCategory } from "./types";

export const CATEGORIES: ProductCategory[] = [
  // Civil & Interiors
  { id: "cement", name: "Cement", icon: "🧱", productCount: 12, group: "Civil & Interiors" },
  { id: "tiling", name: "Tiling", icon: "🔲", productCount: 28, group: "Civil & Interiors" },
  { id: "painting", name: "Painting", icon: "🎨", productCount: 35, group: "Civil & Interiors" },
  { id: "waterproofing", name: "Waterproofing", icon: "💧", productCount: 18, group: "Civil & Interiors" },
  { id: "plywood", name: "Plywood & MDF", icon: "🪵", productCount: 22, group: "Civil & Interiors" },
  { id: "fevicol", name: "Fevicol & Adhesives", icon: "🧴", productCount: 8, group: "Civil & Interiors" },
  { id: "hardware", name: "General Hardware", icon: "🔩", productCount: 15, group: "Civil & Interiors" },
  { id: "fans", name: "Ceiling Fans", icon: "🌀", productCount: 6, group: "Civil & Interiors" },

  // Furniture & Architectural Hardware
  { id: "hinges", name: "Hinges & Channels", icon: "📐", productCount: 14, group: "Furniture & Architectural Hardware" },
  { id: "kitchen", name: "Kitchen Systems", icon: "🍳", productCount: 16, group: "Furniture & Architectural Hardware" },
  { id: "wardrobe", name: "Wardrobe Systems", icon: "🗄️", productCount: 12, group: "Furniture & Architectural Hardware" },
  { id: "locks", name: "Door Locks", icon: "🔒", productCount: 10, group: "Furniture & Architectural Hardware" },

  // Electrical
  { id: "wires", name: "Wires & MCB", icon: "⚡", productCount: 20, group: "Electrical" },
  { id: "switches", name: "Switches & Sockets", icon: "🔌", productCount: 18, group: "Electrical" },
  { id: "lighting", name: "Lighting", icon: "💡", productCount: 15, group: "Electrical" },

  // Plumbing & Sanitary
  { id: "plumbing", name: "Plumbing", icon: "🚰", productCount: 12, group: "Plumbing & Sanitary" },
  { id: "sanitary", name: "Sanitary", icon: "🚿", productCount: 10, group: "Plumbing & Sanitary" },
];

export const CATEGORY_GROUPS = [
  "Civil & Interiors",
  "Furniture & Architectural Hardware",
  "Electrical",
  "Plumbing & Sanitary",
] as const;
