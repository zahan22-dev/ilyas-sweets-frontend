# Frontend — Ilyas Sweets Storefront

This frontend provides the public store, checkout flow, and admin dashboard for the bakery e-commerce platform.

## Overview

Key frontend features:

- Storefront with categories, product listing, and product detail pages
- Cart functionality with server-side cart persistence
- Checkout with coupon application and payment type selection
- Admin dashboard for products, categories, orders, branches, coupons, and hero banners
- Dynamic hero banner carousel on homepage
- Image uploads for admin media
- TanStack Query for data fetching and mutations
- Next.js 16 App Router with client and server components

## Tech stack

- Framework: Next.js 16
- UI: React 19
- Styling: Tailwind CSS v4
- Data fetching: TanStack Query v5
- HTTP: Axios + native fetch
- State: LocalStorage + provider-based cart state
- Maps: Leaflet for branch location picker

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend API base URL, for example:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Run

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

- `npm run dev` — start frontend in development mode
- `npm run build` — build production assets
- `npm run start` — run production build
- `npm run lint` — lint source files

## Frontend structure

- `app/` — public and admin route pages
- `components/` — shared UI components and admin guard
- `constants/` — static UI and product data
- `hooks/` — reusable data hooks for API operations
- `lib/` — API services and HTTP client logic
- `providers/` — TanStack Query and cart providers
- `sections/` — homepage content sections
- `public/` — static assets

## Admin pages

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/categories`
- `/admin/orders`
- `/admin/branches`
- `/admin/coupons`
- `/admin/hero-banners`

## Notes

- Admin access is handled with `admin_token` stored in localStorage.
- The cart is managed through server-side APIs; the frontend persists only the cart ID and coupon state.
- Banner data is fetched from `GET /hero-banners` and rendered in the homepage slider.

## Documentation links

- `frontend/ENV_SETUP.md` — frontend environment setup
- `frontend/QUICK_REFERENCE.md` — commonly used commands and workflows
- `frontend/TANSTACK_QUERY_IMPLEMENTATION.md` — query implementation patterns
