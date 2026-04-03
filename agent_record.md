# Agent Record - XLAB 3C E-commerce Website

## Overview

This document records all AI-assisted development changes made to the XLAB 3C e-commerce website project.

---

## Changes Made

### 1. i18n (Internationalization) - Chinese/English Language Toggle

**Goal:** Add a language toggle button on the frontend to switch between Chinese (zh) and English (en).

**New Files:**
- `src/lib/i18n.ts` — Translation dictionary containing all UI string translations (zh/en)
- `src/context/LanguageContext.tsx` — React context for managing language state, persisted to `localStorage`
- `src/components/frontend/LanguageToggle.tsx` — Globe icon toggle button (EN/中) in the navbar
- `src/components/frontend/HomeContent.tsx` — Client component wrapper for home page (translatable UI)
- `src/components/frontend/ProductsContent.tsx` — Client component wrapper for products list page
- `src/components/frontend/CategoriesContent.tsx` — Client component wrapper for categories page
- `src/components/frontend/CategoryDetailContent.tsx` — Client component wrapper for category detail page
- `src/components/frontend/ProductDetailContent.tsx` — Client component wrapper for product detail page

**Modified Files:**
- `src/app/(frontend)/layout.tsx` — Wrapped with `LanguageProvider`
- `src/components/frontend/Navbar.tsx` — Added `LanguageToggle`, translated nav items, localized category names
- `src/components/frontend/Footer.tsx` — All static text translated via `t()` function
- `src/components/frontend/HeroBanner.tsx` — All hero section text translated
- `src/components/frontend/CategoryGrid.tsx` — Category names and "Browse" label translated
- `src/components/frontend/ProductCard.tsx` — Product name, description, category name, tags, featured badge translated
- `src/app/(frontend)/page.tsx` — Refactored to pass data to `HomeContent` client component
- `src/app/(frontend)/products/page.tsx` — Refactored to use `ProductsContent`
- `src/app/(frontend)/categories/page.tsx` — Refactored to use `CategoriesContent`
- `src/app/(frontend)/categories/[slug]/page.tsx` — Refactored to use `CategoryDetailContent`
- `src/app/(frontend)/products/[slug]/page.tsx` — Refactored to use `ProductDetailContent`

**How it works:**
- The `LanguageProvider` wraps the entire frontend layout
- UI strings are translated via the `t("key")` function from `useLanguage()` hook
- Database content (product/category names, descriptions) uses `localized(obj, "field")` which returns `fieldEn` if locale is "en" and the English field exists, otherwise falls back to the Chinese field
- Language preference is saved to `localStorage` and persists across sessions

---

### 2. Bilingual Database Content Support

**Goal:** Allow products and categories to have English translations editable from the admin panel.

**Database Schema Changes (`prisma/schema.prisma`):**
- `Category` model: Added `nameEn`, `descriptionEn` fields
- `Product` model: Added `nameEn`, `descriptionEn`, `contentEn`, `tagsEn` fields

**API Route Updates:**
- `src/app/api/categories/route.ts` — POST handler accepts and saves English fields
- `src/app/api/categories/[id]/route.ts` — PUT handler accepts and saves English fields
- `src/app/api/products/route.ts` — POST handler accepts and saves English fields
- `src/app/api/products/[id]/route.ts` — PUT handler accepts and saves English fields

**Admin Panel Updates:**
- `src/app/(admin)/admin/products/page.tsx` — Added English input fields: Product Name (EN), Description (EN), Content/Specs (EN), Tags EN. Two-column layout for zh/en side by side.
- `src/app/(admin)/admin/categories/page.tsx` — Added English input fields: Category Name (EN), Description (EN). Two-column layout. Fixed `<SelectItem value="">` error by using `value="none"`.

---

### 3. English Seed Data (`prisma/seed-english.ts`)

**Goal:** Populate all existing products and categories with English translations.

- Translated all 5 categories (Charging Accessories, Protection Accessories, Audio Accessories, AV Accessories, Lifestyle Accessories)
- Translated all 10 products with full English names, descriptions, detailed content/specs, and tags
- Script uses try/catch to gracefully skip products not found in the database

---

### 4. Docker Build Fix & Image URL Encoding Fix

**Goal:** Fix Docker container startup failures and product image display errors.

**Issue 1 — Prisma OpenSSL engine mismatch in Docker:**
- The `node:20-slim` base image ships with OpenSSL 3.0.x, but the Dockerfile builder stage did not install `openssl`, causing Prisma to default to generating the `openssl-1.1.x` engine binary. At runtime, the container could not find the correct engine.

**Fix:**
- `Dockerfile` — Added `apt-get install openssl` to the builder stage so Prisma can detect the correct OpenSSL version during `prisma generate`
- `prisma/schema.prisma` — Added `binaryTargets = ["native", "linux-arm64-openssl-3.0.x"]` to the generator block

**Issue 2 — Persistent database missing new columns:**
- The Docker volume-mounted database (`data/db/dev.db`) was created before the bilingual fields and `showPrice` were added to the schema, so the container hit `P2022` errors ("column does not exist").

**Fix:**
- Manually ran `ALTER TABLE` via `sqlite3` to add `nameEn`, `descriptionEn`, `contentEn`, `tagsEn` to `Product`, `nameEn`, `descriptionEn` to `Category`, and `showPrice` to `Product`.

**Issue 3 — Product images with spaces/Chinese characters in filenames not loading:**
- Image paths like `/uploads/apple watch全覆蓋殼01.jpg` contain spaces and Chinese characters. The `getImageUrl()` helper returned the raw path without URL encoding, causing Next.js `Image` component to fail loading.

**Fix:**
- `src/lib/utils.ts` — Updated `getImageUrl()` to split the path by `/` and apply `encodeURIComponent()` to each segment before joining back.

**Modified Files:**
- `Dockerfile` — Added `openssl` install to builder stage
- `prisma/schema.prisma` — Added `binaryTargets`
- `src/lib/utils.ts` — `getImageUrl()` now URL-encodes path segments

---

---

## VPS Deployment Guide

### Infrastructure Info

| Item | Value |
|------|-------|
| **Domain** | `x-lab-store.com` (Cloudflare Registrar, expires 2027-04-03) |
| **VPS** | Linode Nanode 1GB, Singapore (ap-south) |
| **VPS IP** | `172.104.62.119` |
| **OS** | Ubuntu 24.04 LTS |
| **SSH** | `ssh root@172.104.62.119` |
| **LISH Console** | `ssh -t hcsu0568@lish-ap-south.linode.com xlab-web` |

### Step 1 — Install Docker & Dependencies

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin, Git, Nginx, Certbot
apt update && apt install -y docker-compose-plugin git nginx certbot python3-certbot-nginx
```

### Step 2 — Clone & Deploy

```bash
# Clone repo (private repo, need SSH key on GitHub)
cd /opt
git clone git@github.com:jheweilin/xlab.git
cd xlab

# Create data directories
mkdir -p data/uploads data/db

# Load seed data (database + product images)
cp seed-data/dev.db data/db/dev.db
tar xzf seed-data/uploads.tar.gz -C data/

# Build and start (first time takes a few minutes)
docker compose up -d --build
```

> **Note:** `seed-data/` folder contains the SQLite database and product images.
> The database (`prisma/dev.db`) and uploads (`public/uploads/`) are gitignored,
> so they must be loaded from `seed-data/` on first deploy. If products or images
> are updated, re-run the seed data commands above after `git pull`.

### Step 3 — Configure Nginx Reverse Proxy

```bash
cat > /etc/nginx/sites-available/xlab <<'NGINX'
server {
    listen 80;
    server_name x-lab-store.com www.x-lab-store.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:4567;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/xlab /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### Step 4 — Configure DNS (Cloudflare Dashboard)

Go to Cloudflare Dashboard → `x-lab-store.com` → DNS → Add records:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `172.104.62.119` | Proxied (orange cloud) |
| A | `www` | `172.104.62.119` | Proxied (orange cloud) |

### Step 5 — Enable SSL

**Option A — Cloudflare proxy is ON (recommended):**

Cloudflare auto-handles SSL. Go to SSL/TLS → set mode to **Full**.

**Option B — Cloudflare proxy is OFF (grey cloud):**

```bash
certbot --nginx -d x-lab-store.com -d www.x-lab-store.com
```

### Step 6 — Verify

```bash
# Check Docker is running
docker ps

# Check site locally
curl -s -o /dev/null -w "%{http_code}" http://localhost:4567

# Check from outside (after DNS propagates)
curl -s -o /dev/null -w "%{http_code}" https://x-lab-store.com
```

### Maintenance Commands

```bash
# View logs
docker logs xlab-web --tail 50

# Restart service
docker restart xlab-web

# Pull latest code and redeploy
cd /opt/xlab
git pull
docker compose up -d --build

# Restart Nginx
systemctl reload nginx
```

---

## Architecture Notes

- **Server Components** handle data fetching (Prisma queries)
- **Client Components** (Content wrappers) handle translation rendering via `useLanguage()` context
- The `localized(obj, "field")` helper in `LanguageContext` picks `fieldEn` when locale is "en" and falls back to `field` (Chinese) if English is not available
- No third-party i18n library is used — the implementation is lightweight and custom-built

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Prisma + SQLite
- NextAuth.js
- TypeScript
