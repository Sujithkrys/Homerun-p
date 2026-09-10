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

export interface ProjectRoom {
  room_name: string;          // "Master Bathroom", "Bedroom 1", etc.
  task_type: string;          // "tiling", "painting", "electrical", "plumbing"
  area_sqft: number | null;
  cart_items: CartItem[];
  room_total: number;
}

export interface ProjectEstimate {
  project_name: string;       // "2BHK Full Renovation"
  rooms: ProjectRoom[];
  grand_total: number;
  savings_on_bulk: number;    // How much they save from bulk pricing
}

export interface Suggestion {
  product_id: string;
  name: string;
  reason: string;
  estimated_qty: number;
  unit: string;
  unit_price: number;
}

export interface ChatResponse {
  message: string;
  cart_items: CartItem[];
  estimation_summary: EstimationSummary | null;
  project_estimate: ProjectEstimate | null;
  suggestions: Suggestion[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cart_items?: CartItem[];
  estimation_summary?: EstimationSummary | null;
  project_estimate?: ProjectEstimate | null;
  suggestions?: Suggestion[];
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

export type AppScreen = "home" | "ai-estimator" | "categories" | "orders" | "account";

export interface ProductCategory {
  id: string;
  name: string;
  icon: string; // emoji
  productCount: number;
  group?: string;
}

export interface BillDetails {
  subtotal: number; // sum of cart items (incl GST)
  discount: number; // coupon/bulk discount
  walletApplied: number; // HomeRun Cash applied
  deliveryCharge: number; // 0 if subtotal > 500, else 49
  handlingCharge: number; // 0 for now
  total: number;
}

export interface DemoOrder {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "arriving" | "delivered";
}
