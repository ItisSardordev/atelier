/*
# Atelier — Initial Schema for Admin-Managed Storefront

Creates the full data layer for an admin-managed fashion e-commerce site:
products, orders, order items, promotional offers, and payment settings.
Admin access uses Supabase Auth (email/password) scoped to authenticated users.

## 1. New Tables

### products
- Mirrors the existing hardcoded product data structure.
- Fields: id (text slug PK), name, price (int cents), category, is_new,
  description, material, origin, fit, sizes (text[]), colors (jsonb), images (jsonb),
  is_active (bool, soft-delete/publish toggle), created_at, updated_at.

### orders
- Customer orders placed through the storefront checkout.
- Fields: id (uuid PK), order_number (unique text), customer_email, customer_name,
  shipping_address (jsonb), status (enum: pending/paid/shipped/delivered/cancelled),
  subtotal, shipping_cost, total, payment_method, payment_status, notes,
  created_at, updated_at.

### order_items
- Line items belonging to an order.
- Fields: id (uuid PK), order_id (FK → orders), product_id (text), product_name,
  size, color, quantity, unit_price, line_total.

### offers
- Promotional offers / discounts manageable from the admin dashboard.
- Fields: id (uuid PK), title, description, offer_type (enum: percentage/fixed_amount/free_shipping),
  value (numeric), code (unique text coupon code), is_active (bool),
  starts_at, ends_at, applicable_category (text, nullable for all),
  created_at, updated_at.

### payment_settings
- Single-row table storing payment gateway configuration (Stripe-style).
- Fields: id (int PK, always 1), provider_name, is_live_mode (bool),
  publishable_key, secret_key (stored server-side only — but kept here for demo),
  currency, webhook_url, is_enabled (bool), updated_at.

## 2. Security (RLS)

- products: readable by anon+authenticated (public storefront). Write by authenticated only (admin).
- orders: read/write by authenticated only (admin views/manages orders). 
  Insert by anon+authenticated (storefront creates orders without login).
- order_items: same pattern as orders — anon can insert (with order), authenticated can read all.
- offers: readable by anon+authenticated (storefront displays active offers). Write by authenticated only.
- payment_settings: read by authenticated only (admin only — contains sensitive config).

## 3. Important Notes
1. Orders can be created by unauthenticated shoppers (anon role), but only admin
   (authenticated) can view/manage all orders. This supports a guest-checkout flow.
2. payment_settings is locked to a single row (CHECK id = 1) to act as a singleton config.
3. All timestamps default to now().
*/

-- ===== PRODUCTS =====
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  category text NOT NULL DEFAULT 'OUTERWEAR',
  is_new boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  material text NOT NULL DEFAULT '',
  origin text NOT NULL DEFAULT '',
  fit text NOT NULL DEFAULT '',
  sizes text[] NOT NULL DEFAULT '{}',
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  images jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
ON products FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
ON products FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
ON products FOR DELETE
TO authenticated
USING (true);

-- ===== ORDERS =====
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_email text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  subtotal integer NOT NULL DEFAULT 0,
  shipping_cost integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'card',
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Storefront (anon) can create orders (guest checkout)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admin (authenticated) can view all orders
DROP POLICY IF EXISTS "admin_read_orders" ON orders;
CREATE POLICY "admin_read_orders"
ON orders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders"
ON orders FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders"
ON orders FOR DELETE
TO authenticated
USING (true);

-- ===== ORDER ITEMS =====
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  size text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price integer NOT NULL DEFAULT 0,
  line_total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items"
ON order_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_order_items" ON order_items;
CREATE POLICY "admin_read_order_items"
ON order_items FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "admin_update_order_items" ON order_items;
CREATE POLICY "admin_update_order_items"
ON order_items FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "admin_delete_order_items"
ON order_items FOR DELETE
TO authenticated
USING (true);

-- ===== OFFERS =====
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  offer_type text NOT NULL DEFAULT 'percentage' CHECK (offer_type IN ('percentage','fixed_amount','free_shipping')),
  value numeric NOT NULL DEFAULT 0,
  code text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  applicable_category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_offers" ON offers;
CREATE POLICY "public_read_offers"
ON offers FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "admin_insert_offers" ON offers;
CREATE POLICY "admin_insert_offers"
ON offers FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_offers" ON offers;
CREATE POLICY "admin_update_offers"
ON offers FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_offers" ON offers;
CREATE POLICY "admin_delete_offers"
ON offers FOR DELETE
TO authenticated
USING (true);

-- ===== PAYMENT SETTINGS (singleton) =====
CREATE TABLE IF NOT EXISTS payment_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  provider_name text NOT NULL DEFAULT 'stripe',
  is_live_mode boolean NOT NULL DEFAULT false,
  publishable_key text NOT NULL DEFAULT '',
  secret_key text NOT NULL DEFAULT '',
  currency text NOT NULL DEFAULT 'EUR',
  webhook_url text NOT NULL DEFAULT '',
  is_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_payment_settings" ON payment_settings;
CREATE POLICY "admin_read_payment_settings"
ON payment_settings FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "admin_update_payment_settings" ON payment_settings;
CREATE POLICY "admin_update_payment_settings"
ON payment_settings FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_payment_settings" ON payment_settings;
CREATE POLICY "admin_insert_payment_settings"
ON payment_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active);

-- Insert default payment settings row
INSERT INTO payment_settings (id, provider_name, is_live_mode, is_enabled, currency)
VALUES (1, 'stripe', false, false, 'EUR')
ON CONFLICT (id) DO NOTHING;
