export interface CartItem {
  product_id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  reason: string;
}

export interface EstimationSummary {
  project_type: string;
  area_sqft: number | null;
  total_cost: number;
}

export interface ChatResponse {
  message: string;
  cart_items: CartItem[];
  estimation_summary: EstimationSummary | null;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cart_items?: CartItem[];
  estimation_summary?: EstimationSummary | null;
  timestamp?: string;
  isQuickReplyAction?: boolean;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  brand: string;
  pack_size: string;
  mrp: number;
  price: number;
  bulk_price: number | null;
  unit: string;
  coverage?: string;
  tags?: string[];
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  products: ProductCatalogItem[];
}

export interface DeliveryInfo {
  promise: string;
  min_order: number;
  free_delivery_above: number;
  cashback: string;
  hours: string;
  area: string;
  payment: string;
}
