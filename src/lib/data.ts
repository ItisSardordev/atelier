import { supabase } from '@/lib/supabase';
import type {
  ProductRow,
  OfferRow,
  OrderRow,
  OrderItemRow,
  PaymentSettingsRow,
  OrderWithItems,
} from '@/lib/types';

// ===== Products (storefront — public) =====

export async function fetchActiveProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as ProductRow[];
}

export async function fetchProduct(id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as ProductRow | null;
}

// ===== Offers (storefront — public) =====

export async function fetchActiveOffers(): Promise<OfferRow[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as OfferRow[];
}

// ===== Orders (storefront — create) =====

export interface CreateOrderInput {
  order_number: string;
  customer_email: string;
  customer_name: string;
  shipping_address: Record<string, string>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  items: {
    product_id: string;
    product_name: string;
    size: string;
    color: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<{ id: string; order_number: string }> {
  const { items, ...orderData } = input;

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert(orderData)
    .select('id, order_number')
    .single();

  if (orderErr) throw orderErr;

  const orderItems = items.map((item) => ({
    ...item,
    order_id: (order as { id: string }).id,
  }));

  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
  if (itemsErr) throw itemsErr;

  return { id: (order as { id: string }).id, order_number: (order as { order_number: string }).order_number };
}

// ===== Admin: Products =====

export async function adminFetchAllProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as ProductRow[];
}

export async function adminUpsertProduct(product: ProductRow): Promise<void> {
  const { error } = await supabase.from('products').upsert(product);
  if (error) throw error;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ===== Admin: Orders =====

export async function adminFetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as OrderRow[];
}

export async function adminFetchOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as OrderItemRow[];
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string
): Promise<void> {
  const update: Record<string, string> = { status };
  if (paymentStatus) update.payment_status = paymentStatus;
  const { error } = await supabase.from('orders').update(update).eq('id', orderId);
  if (error) throw error;
}

// ===== Admin: Offers =====

export async function adminFetchOffers(): Promise<OfferRow[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as OfferRow[];
}

export async function adminUpsertOffer(offer: Partial<OfferRow> & { code: string }): Promise<void> {
  const { error } = await supabase.from('offers').upsert(offer);
  if (error) throw error;
}

export async function adminDeleteOffer(id: string): Promise<void> {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw error;
}

// ===== Admin: Payment Settings =====

export async function adminFetchPaymentSettings(): Promise<PaymentSettingsRow | null> {
  const { data, error } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data as PaymentSettingsRow | null;
}

export async function adminUpdatePaymentSettings(
  settings: Partial<PaymentSettingsRow>
): Promise<void> {
  const { error } = await supabase
    .from('payment_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw error;
}
