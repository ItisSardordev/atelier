export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImages {
  full: string;
  front: string;
  back: string;
  detail: string;
  material: string;
  editorial: string;
}

export interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: string;
  is_new: boolean;
  description: string;
  material: string;
  origin: string;
  fit: string;
  sizes: string[];
  colors: ProductColor[];
  images: ProductImages;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  shipping_address: Record<string, string>;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface OfferRow {
  id: string;
  title: string;
  description: string;
  offer_type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  code: string;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  applicable_category: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentSettingsRow {
  id: number;
  provider_name: string;
  is_live_mode: boolean;
  publishable_key: string;
  secret_key: string;
  currency: string;
  webhook_url: string;
  is_enabled: boolean;
  updated_at: string;
}

export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}
