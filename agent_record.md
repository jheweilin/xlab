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
