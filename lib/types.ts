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
  category: "Cement" | "Adhesives & Grout" | "Paints & Wall Care" | "Electricals" | "Plumbing & Sanitaries" | "Steel & Hardware";
  brand: string;
  unit: string;
  price: number;
  description: string;
  specifications: string;
  in_stock: boolean;
  delivery_time_mins: number;
}
