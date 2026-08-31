# GENZILLA Admin OS

Separate Vite/React admin app for GENZILLA. It uses Supabase Auth and the shared Supabase database.

## Local setup
1. Copy `.env.example` to `.env` in this `admin/` folder.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or the Supabase publishable key value).
3. `npm install`
4. `npm run dev`

## Supabase setup
Run `supabase/migrations/20260831100000_admin_and_settings.sql` once in Supabase SQL Editor. Create a Supabase Auth user, then insert that email into `public.admin_users`.

## Features
- Dashboard / revenue / orders / low stock
- Full product CRUD with SKU, tags, sale price, multiple image URLs, draft/publish and preview
- Order management and status updates
- Inventory controls
- Customer directory derived from checkout orders
- Analytics
- Website Editor: Hero, About, Reviews, Branding & contact; Draft -> Publish
- Coupons
- Admin-gated write access with RLS

Keep `.env` out of git.
