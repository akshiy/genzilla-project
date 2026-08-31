/*
# Create products and orders tables (single-tenant, no auth)

1. New Tables
- `products`: catalog of lighters and Gen Z accessories
  - id (uuid PK), name, tagline, description, price (numeric), image_url, category, badge, featured (bool), stock (int), created_at
- `orders`: customer orders placed through checkout
  - id (uuid PK), customer_name, email, phone, address, city, pincode, items (jsonb array of {id,name,price,qty}), total (numeric), status (text default 'pending'), created_at

2. Security
- Enable RLS on both tables.
- products: public read (anon + authenticated SELECT true), no public write.
- orders: public insert (anon + authenticated can place orders), public read (for demo / order tracking), update/delete restricted (no policies = blocked for anon).

3. Notes
- Single-tenant storefront: no user accounts, no user_id columns.
- products are managed via SQL/seed; the storefront only reads them.
- orders are created by anonymous shoppers; status updates would be done server-side (no anon update policy by design).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  category text NOT NULL DEFAULT 'lighters',
  badge text,
  featured boolean NOT NULL DEFAULT false,
  stock int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text NOT NULL,
  city text,
  pincode text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
