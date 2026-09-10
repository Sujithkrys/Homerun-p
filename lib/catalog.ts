import { Category, DeliveryInfo, ProductCatalogItem } from "./types";
import catalogData from "./catalog.json";

export const CATALOG = catalogData;

export const CATEGORIES: Category[] = catalogData.categories as Category[];

export const ESTIMATION_RULES = catalogData.estimation_rules;

export const DELIVERY_INFO: DeliveryInfo = catalogData.delivery_info;

// Flattened products list with attached category information
export const PRODUCT_CATALOG: ProductCatalogItem[] = CATEGORIES.flatMap(
  (cat) =>
    cat.products.map((p) => ({
      ...p,
      category: cat.name,
    }))
);

export function getProductById(id: string): ProductCatalogItem | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}

export function searchProducts(query: string): ProductCatalogItem[] {
  const q = query.toLowerCase();
  return PRODUCT_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(q)))
  );
}
