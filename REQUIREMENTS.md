# Multi-Brand Motorcycle Group Platform — Specifications & Progress

**Project:** Multi-Brand Motorcycle Digital Platform  
**Design Baseline:** High-contrast technical luxury multi-brand showroom

---

## 1. Project Concept & Brand Identity
- **Concept:** Original concept representing an elite multi-brand motorcycle group operating across GCC flagship hubs (Dubai Sheikh Zayed Rd, Riyadh Al Malqa, Doha The Pearl).
- **Aesthetic Movement:** High-Contrast Technical Luxury (Glassmorphic Obsidian `#0D1117`, Desert Champagne Bronze `#D4AF37`, Telemetry Crimson `#FF334B`).
- **Typography:** Syne (Headlines), Plus Jakarta Sans (Body & UI), JetBrains Mono (Telemetry & Mechanical Specs).
- **Core Market Segments & Brands:**
  - **Performance:** Ducati (Panigale V4 S, Streetfighter V4)
  - **Adventure & Touring:** BMW Motorrad (R 1300 GS Adventure, S 1000 XR)
  - **Urban Mobility:** Vespa (GTS Super 300, Elettrica)
  - **Premium Heritage:** Harley-Davidson (Fat Boy 114, Pan America 1250)

---

## 2. Technical Architecture & Decisions

### Backend (PHP 8.3+ / Laravel 13)
- **Database:** SQLite by default with MySQL support in `.env.example`.
- **Authentication:** Laravel Sanctum SPA cookie/session with CSRF protection.
  > *Note on Auth Choice:* Sanctum SPA session/cookie auth is selected because the web platform is a unified browser application (public showroom + `/admin`). If native mobile apps or external API integrations are introduced, Sanctum Personal Access (Bearer) tokens will be used to bypass cross-origin browser cookie constraints.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Unrestricted access — manages global CMS settings (header text, active section visibility), brand entities, all motorcycles, and all test-ride leads.
  - **Moderator (Data Entry):** Scoped to an assigned brand (`brand_id`) — can create/edit/delete motorcycles and view test-ride requests exclusively for that brand.
- **Asset / Image Strategy:**
  - Seed data uses simulated CDN/S3 image URLs.
  - Initial data entry accepts image URL strings.
  - File upload to storage/assets is slated for the final polish phase.

### Frontend (React 19 + TypeScript + Vite + Tailwind CSS v4)
- **Design System ("Apex Oasis" Tokens):**
  - Aligned with Stitch MCP design system tokens: 8px container cards (`rounded-[8px]`), 4px buttons/tabs/badges (`rounded-[4px]`), 12px modal dialogs (`rounded-[12px]`).
  - Tailwind v4 CSS-first (`@theme` tokens for obsidian, bronze/gold, telemetry crimson, and typography).
- **Public Showroom (`/`):**
  - Sticky glassmorphic navigation with theme toggle, spring language pill, and test-ride CTA.
  - Authorized brand marquees selector (Ducati, BMW Motorrad, Vespa, Harley-Davidson) with dynamic filtering.
  - Responsive hero showcase with dynamic CMS headline, Panigale V4 spotlight, and GCC metrics ribbon.
  - Multi-brand editorial catalog with 5 segment filters (`ALL`, `PERFORMANCE`, `ADVENTURE`, `URBAN EV`, `HERITAGE`).
  - High-density dyno cockpit spec cards (BHP, Torque, 0-100 km/h, Dry Weight, CC, starting AED price).
  - Engineering Telemetry Modal (8-point dyno matrix, multi-angle gallery, interactive factory colorway swatches).
  - VIP Test-Ride Concierge Wizard (3-step flow + VIP Boarding Pass with dynamic animated height via `ResizeObserver`).
  - Regional Flagship Hubs & Dealership Locator (Dubai Sheikh Zayed Rd, Riyadh Al Malqa, Doha Lusail Marina) — *Block 6 Upcoming*.
- **Admin & CMS Portal (`/admin`):**
  - Sanctum login screen.
  - Role-aware dashboard (Admin sees all brands + section toggles; Moderator sees assigned brand).
  - Motorcycle CRUD with live preview.
  - Test-ride lead management (status updates: Pending, Confirmed, Completed).

---

## 3. Implementation Plan & Progress

- [x] **Phase 1: Backend Foundation (API & DB)**
  - [x] Migration: `brands` table
  - [x] Migration: `motorcycles` table (specs, telemetry, pricing, category, image URLs)
  - [x] Migration: `test_ride_requests` table
  - [x] Migration: `cms_settings` table (headers, section visibility toggles)
  - [x] Update `users` table (`role`: admin/moderator, `brand_id`: nullable FK)
  - [x] Database seeder with 4 brands, rich motorcycle catalog, test ride requests, admin & moderator accounts
  - [x] Sanctum SPA authentication configuration & routes
  - [x] Policies (`MotorcyclePolicy`, `TestRidePolicy`, `CmsSettingPolicy`)
  - [x] REST API Controllers & Form Requests
  - [x] Automated Test Suite: 8/8 tests passing with 108 assertions (`tests/Feature/ApiTest.php`)
- [ ] **Phase 2: Public Showroom Homepage (React + Tailwind v4 + Framer Motion)**
  - [x] Block 0: Design tokens, typography (Syne + Tajawal + JetBrains Mono), i18n (en/ar RTL), Theme/Locale/Auth contexts
  - [x] Block 1: Navigation bar with brand marque bar and booking CTA
  - [x] Block 2: Hero showcase section with Panigale V4 spotlight & GCC metrics ribbon
  - [x] Block 3: Segment filter & dynamic motorcycle catalog grid (`MotorcycleCard.tsx`, `CatalogSection.tsx`)
  - [x] Block 4: Telemetry & engineering specs modal with colorway swatches (`TelemetryModal.tsx`)
  - [x] Block 5: "Book a Test Ride" VIP concierge wizard with animated height & boarding pass (`TestRideModal.tsx`)
  - [ ] Block 6: Regional Flagship Hubs boutique directory & automotive group footer
- [ ] **Phase 3: Role-Aware CMS & Admin Portal**
  - [ ] Login screen with CSRF + Sanctum authentication
  - [ ] Admin dashboard view (global stats, brand overview, CMS settings toggles)
  - [ ] Moderator dashboard view (brand-scoped motorcycle CRUD & test ride lead table)
  - [ ] Motorcycle create/edit form
  - [ ] Test ride request status switcher
- [ ] **Phase 4: Polish & Integration**
  - [ ] Database ERD diagram & schema documentation
  - [ ] Image upload handling (local/storage to replace initial URL string inputs)
  - [ ] Micro-interactions & animations (spec telemetry, booking feedback)
