import { ProductCatalogItem } from "./types";

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  // CEMENT & AGGREGATES
  {
    id: "cem-ultratech-ppc",
    name: "UltraTech PPC Cement (50kg)",
    category: "Cement",
    brand: "UltraTech",
    unit: "bag",
    price: 410,
    description: "Portland Pozzolana Cement engineered with micro-particles for superior strength and crack resistance. Ideal for plastering, brickwork, and general RCC work.",
    specifications: "IS 1489 certified, 50kg bag, tamper-proof packaging",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "cem-ultratech-opc53",
    name: "UltraTech OPC 53 Grade Cement (50kg)",
    category: "Cement",
    brand: "UltraTech",
    unit: "bag",
    price: 435,
    description: "High early strength Ordinary Portland Cement grade 53. Best suited for high-rise RCC slabs, columns, beams, and precast concrete work.",
    specifications: "IS 12269 certified, compressive strength 53 MPa at 28 days",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "cem-birla-a1-ppc",
    name: "Birla A1 Premium PPC Cement (50kg)",
    category: "Cement",
    brand: "Birla.A1",
    unit: "bag",
    price: 395,
    description: "Superior quality blended cement for moisture-resistant construction and smooth wall plaster finishes.",
    specifications: "IS 1489 Part 1, 50kg bag",
    in_stock: true,
    delivery_time_mins: 60,
  },

  // TILE ADHESIVES & GROUTS
  {
    id: "adh-roff-t01-20kg",
    name: "Pidilite Roff T01 Tile Adhesive (20kg)",
    category: "Adhesives & Grout",
    brand: "Pidilite Roff",
    unit: "bag",
    price: 470,
    description: "Polymer modified cementitious tile adhesive for fixing ceramic tiles on interior floors and walls. Prevents hollow sounds and debonding.",
    specifications: "IS 15477: 2019 Type 1 standard, coverage approx 30-35 sq.ft per 20kg at 3mm bed thickness",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "adh-roff-t02-plus",
    name: "Pidilite Roff T02 Star Tile Adhesive (20kg)",
    category: "Adhesives & Grout",
    brand: "Pidilite Roff",
    unit: "bag",
    price: 580,
    description: "High-performance polymer enriched adhesive for fixing vitrified tiles, granite, and marble on indoor floors and walls.",
    specifications: "IS 15477 Type 2 standard, zero vertical slip formula",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "adh-roff-rainbow-grout-1kg",
    name: "Roff Rainbow Tile Grout (1kg)",
    category: "Adhesives & Grout",
    brand: "Pidilite Roff",
    unit: "pack",
    price: 85,
    description: "Cementitious polymer modified tile joint filler for joint widths up to 3mm. Non-shrink and crack resistant.",
    specifications: "Water resistant, available in Ivory, White, Grey and Terracotta",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "adh-tile-spacers-3mm",
    name: "Cross Tile Spacers 3mm (Pack of 100)",
    category: "Adhesives & Grout",
    brand: "HomeRun Pro",
    unit: "pack",
    price: 90,
    description: "Precision engineered reusable cross spacers for uniform joint spacing during wall and floor tile installations.",
    specifications: "3mm thickness, heavy-duty polypropylene",
    in_stock: true,
    delivery_time_mins: 60,
  },

  // PAINTS & WALL CARE
  {
    id: "pnt-birla-white-putty-40kg",
    name: "Birla White WallSeal Waterproof Putty (40kg)",
    category: "Paints & Wall Care",
    brand: "Birla White",
    unit: "bag",
    price: 940,
    description: "White cement-based wall putty with hydrophobic active polymers that provide water resistance and smooth finish for interior and exterior walls.",
    specifications: "Coverage approx 14-16 sq.ft/kg for 2 coats, 40kg moisture-lock bag",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "pnt-asian-tractor-emulsion-20l",
    name: "Asian Paints Tractor Emulsion (20 Litre)",
    category: "Paints & Wall Care",
    brand: "Asian Paints",
    unit: "can",
    price: 2450,
    description: "Smooth matte finish interior wall paint offering 1.5x greater coverage than ordinary distempers with rich look.",
    specifications: "Interior emulsion, 20L drum, coverage 140-160 sq.ft/L for 1 coat",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "pnt-asian-royale-luxury-20l",
    name: "Asian Paints Royale Luxury Emulsion (20 Litre)",
    category: "Paints & Wall Care",
    brand: "Asian Paints",
    unit: "can",
    price: 8600,
    description: "Ultra-luxury interior emulsion with Teflon surface protector, soft sheen, and anti-bacterial washability.",
    specifications: "Luxury high-sheen, 20L drum, scrub resistant",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "pnt-asian-primer-decoprime-20l",
    name: "Asian Paints Decoprime WT Wall Primer (20 Litre)",
    category: "Paints & Wall Care",
    brand: "Asian Paints",
    unit: "can",
    price: 1850,
    description: "Water-based undercoat that prepares porous masonry surfaces for flawless emulsion topcoats.",
    specifications: "Coverage 100-120 sq.ft/L, 20L container",
    in_stock: true,
    delivery_time_mins: 60,
  },

  // ELECTRICALS
  {
    id: "elec-finolex-fr-1-5sqmm",
    name: "Finolex 1.5 sq mm Flame Retardant PVC Wire (90m)",
    category: "Electricals",
    brand: "Finolex",
    unit: "roll",
    price: 1780,
    description: "100% pure electrolytic copper conductor wire with fire-retardant grade PVC insulation. Ideal for lighting, fan points, and household circuits.",
    specifications: "IS 694, 1100V grade, 90 meter coil, available in Red, Yellow, Blue, Black",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "elec-finolex-fr-2-5sqmm",
    name: "Finolex 2.5 sq mm Flame Retardant PVC Wire (90m)",
    category: "Electricals",
    brand: "Finolex",
    unit: "roll",
    price: 2850,
    description: "Heavy-duty fire-safe copper wiring for power sockets, geysers, kitchen appliances, and microwave points.",
    specifications: "IS 694 certified, 90 meter roll",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "elec-finolex-fr-4-0sqmm",
    name: "Finolex 4.0 sq mm Flame Retardant PVC Wire (90m)",
    category: "Electricals",
    brand: "Finolex",
    unit: "roll",
    price: 4350,
    description: "High-capacity copper wire for air conditioners, main distribution boards, and heavy heating appliances.",
    specifications: "IS 694 certified, 90 meter roll",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "elec-vip-conduit-pipe-25mm",
    name: "VIP 25mm Heavy Duty PVC Electrical Conduit (Bundle of 10)",
    category: "Electricals",
    brand: "VIP",
    unit: "bundle",
    price: 720,
    description: "Rigid unplasticized PVC pipes for concealed internal wall and slab electrical wiring. Impact and fire resistant.",
    specifications: "Medium gauge, 3 meter length each, 10 pipes per bundle",
    in_stock: true,
    delivery_time_mins: 60,
  },

  // WATERPROOFING & PLUMBING
  {
    id: "wp-dr-fixit-lw-plus-5l",
    name: "Dr. Fixit Pidiproof LW+ Concrete Waterproofing (5 Litre)",
    category: "Plumbing & Sanitaries",
    brand: "Dr. Fixit",
    unit: "can",
    price: 640,
    description: "Integral liquid waterproofing compound for concrete and plastering mortar. Prevents dampness and efflorescence.",
    specifications: "Dosage: 200ml per 50kg bag of cement, 5 Litre pack",
    in_stock: true,
    delivery_time_mins: 60,
  },
  {
    id: "plumb-astral-cpvc-pipe-1inch",
    name: "Astral CPVC Pro SDR 11 Pipe 1 inch (Bundle of 5 pcs / 3m)",
    category: "Plumbing & Sanitaries",
    brand: "Astral",
    unit: "bundle",
    price: 1450,
    description: "Chlorinated polyvinyl chloride pipes for hot and cold domestic potable water supply. Certified lead-free and corrosion resistant.",
    specifications: "SDR 11, Class 1 pressure rating, 3m per piece",
    in_stock: true,
    delivery_time_mins: 60,
  }
];

export function getProductById(id: string): ProductCatalogItem | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}

export function searchProducts(query: string): ProductCatalogItem[] {
  const q = query.toLowerCase();
  return PRODUCT_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
