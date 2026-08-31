-- GENZILLA admin, publishing, catalog and no-code content controls.

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read" on public.admin_users
for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Existing catalog stays public-read but becomes admin-write.
alter table public.products add column if not exists sale_price numeric(10,2);
alter table public.products add column if not exists image_urls jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists sku text;
alter table public.products add column if not exists tags jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists published boolean not null default true;

update public.products set published = true where published is null;

alter table public.orders add column if not exists payment_status text not null default 'pending';
alter table public.orders add column if not exists shipping_status text not null default 'pending';

-- Tighten orders: storefront shoppers can create, admins can read/update.
drop policy if exists "anon_read_orders" on public.orders;
drop policy if exists "admin_read_orders" on public.orders;
drop policy if exists "anon_insert_orders" on public.orders;
drop policy if exists "public_insert_orders" on public.orders;
drop policy if exists "admin_update_orders" on public.orders;

create policy "admin_read_orders" on public.orders
for select to authenticated using (public.is_admin());

create policy "admin_update_orders" on public.orders
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_insert_orders" on public.orders
for insert to anon, authenticated with check (true);

-- Admin product write access.
drop policy if exists "admin_write_products" on public.products;
create policy "admin_write_products" on public.products
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public storefront only sees published products.
drop policy if exists "anon_read_products" on public.products;
create policy "public_read_published_products" on public.products
for select to anon, authenticated using (published = true or public.is_admin());

create table if not exists public.store_settings (
  id bigint primary key generated always as identity,
  store_name text not null default 'GENZILLA',
  logo_url text,
  favicon_url text,
  whatsapp text,
  support_email text,
  phone text,
  address text,
  social_links jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_content (
  id bigint primary key generated always as identity,
  section_key text unique not null,
  enabled boolean not null default true,
  content jsonb not null default '{}'::jsonb,
  draft_content jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.homepage_content add column if not exists draft_content jsonb not null default '{}'::jsonb;
alter table public.homepage_content add column if not exists published_at timestamptz;

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null default 'percentage',
  discount_value numeric(10,2) not null default 0,
  min_order_value numeric(10,2) not null default 0,
  max_uses int,
  used_count int not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;
alter table public.homepage_content enable row level security;
alter table public.coupons enable row level security;

drop policy if exists "public_read_store_settings" on public.store_settings;
create policy "public_read_store_settings" on public.store_settings
for select to anon, authenticated using (true);

drop policy if exists "admin_write_store_settings" on public.store_settings;
create policy "admin_write_store_settings" on public.store_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public_read_homepage_content" on public.homepage_content;
create policy "public_read_homepage_content" on public.homepage_content
for select to anon using (enabled = true);

drop policy if exists "admin_write_homepage_content" on public.homepage_content;
create policy "admin_write_homepage_content" on public.homepage_content
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public_read_active_coupons" on public.coupons;
create policy "public_read_active_coupons" on public.coupons
for select to anon, authenticated using (
  active = true and
  (starts_at is null or starts_at <= now()) and
  (expires_at is null or expires_at >= now())
);

drop policy if exists "admin_write_coupons" on public.coupons;
create policy "admin_write_coupons" on public.coupons
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.store_settings (store_name)
select 'GENZILLA'
where not exists (select 1 from public.store_settings);

-- Seed editable content so the admin editor works immediately.
insert into public.homepage_content (section_key, enabled, content, draft_content)
values
('hero', true, '{"kicker":"The Gen Z lighter collective","title1":"LIGHT","title2":"YOUR ERA","description":"Refillable lighters, torch flames, and collectible matchbooks built for the feed-first generation.","primaryCta":"Shop the drop","secondaryCta":"Our story","stats":[{"value":"50K+","label":"Lighters lit"},{"value":"4.9","label":"Avg rating"},{"value":"24H","label":"Dispatch"}]}'::jsonb, '{"kicker":"The Gen Z lighter collective","title1":"LIGHT","title2":"YOUR ERA","description":"Refillable lighters, torch flames, and collectible matchbooks built for the feed-first generation.","primaryCta":"Shop the drop","secondaryCta":"Our story","stats":[{"value":"50K+","label":"Lighters lit"},{"value":"4.9","label":"Avg rating"},{"value":"24H","label":"Dispatch"}]}'::jsonb),
('about', true, '{"kicker":"Our story","title":"Built for the feed-first generation","body1":"Genzilla started with one question — why do lighters all look the same? We design refillable lighters, torch flames and collectible pieces that feel like they belong on your shelf and your story.","body2":"Windproof, reusable and unapologetically loud.","chips":["Refillable","Windproof","Gen Z owned","Carbon-aware shipping"]}'::jsonb, '{"kicker":"Our story","title":"Built for the feed-first generation","body1":"Genzilla started with one question — why do lighters all look the same? We design refillable lighters, torch flames and collectible pieces that feel like they belong on your shelf and your story.","body2":"Windproof, reusable and unapologetically loud.","chips":["Refillable","Windproof","Gen Z owned","Carbon-aware shipping"]}'::jsonb),
('reviews', true, '[{"name":"Maya R.","handle":"@mayalights","text":"The Neon Ghost glows in the dark. I get asked about it every time I pull it out.","rating":5},{"name":"Devon K.","handle":"@devkeeps","text":"Inferno X1 cuts through wind like nothing.","rating":5},{"name":"Priya S.","handle":"@priyagram","text":"Refillable AND aesthetic? Finally.","rating":5},{"name":"Leo M.","handle":"@leomakes","text":"Forge Master is a game changer.","rating":5}]'::jsonb, '[{"name":"Maya R.","handle":"@mayalights","text":"The Neon Ghost glows in the dark. I get asked about it every time I pull it out.","rating":5},{"name":"Devon K.","handle":"@devkeeps","text":"Inferno X1 cuts through wind like nothing.","rating":5},{"name":"Priya S.","handle":"@priyagram","text":"Refillable AND aesthetic? Finally.","rating":5},{"name":"Leo M.","handle":"@leomakes","text":"Forge Master is a game changer.","rating":5}]'::jsonb)
on conflict (section_key) do nothing;


-- Product image uploads through Supabase Storage.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public_read_product_images" on storage.objects;
create policy "public_read_product_images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "admin_upload_product_images" on storage.objects;
create policy "admin_upload_product_images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin_update_product_images" on storage.objects;
create policy "admin_update_product_images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin_delete_product_images" on storage.objects;
create policy "admin_delete_product_images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());
