# Multi-Brand Motorcycle Group Platform

A full-stack multi-brand motorcycle digital platform operating across regional showrooms. Features a modern technical luxury public showroom and a role-based CMS management portal.

> 🌐 **Live Deployed Demonstration:** `[Deployment Pending / In Progress — Live URL will be added here upon final cloud provisioning]`  

---

## Architecture & Technology Stack

### Core Frameworks & Runtime
- **Backend:** [Laravel 13](https://laravel.com/) (RESTful API, Sanctum SPA Authentication, Form Requests, RBAC Policies, Eloquent Relationships, Composite Database Indexing)
- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- **Animation & Physics:** [Framer Motion](https://motion.dev/) (hardware-accelerated page transitions, dynamic `ResizeObserver` height adaptation, layout spring pills) + **HTML5 60 FPS Canvas Physics Engine** (delayed lerp cursor glow, velocity-scaled particle scattering shockwaves, multi-plane 3D parallax scrolling)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` configuration, obsidian & desert sand palettes, luxury glassmorphic panels)
- **Internationalization (i18n):** [i18next](https://www.i18next.com/) with native English (LTR) and Gulf Arabic (RTL) typography (`Tajawal` font)
- **Database:** SQLite (default for zero-setup evaluation) with seamless MySQL/MariaDB/PostgreSQL support via `.env`

### Design, Tooling & AI-Assisted Engineering
- **Google Stitch UI Tool (Stitch MCP):** Generated the initial high-contrast technical luxury layout system, component wireframes, and design token hierarchies (8px cards, 4px buttons/tabs/badges, 12px modal dialogs).
- **Frontend Design Skill (`frontend-design`):** Applied to refine aesthetic direction, crafting the Obsidian (`#0B0F17`) & Desert Sand luxury color palette, fluid directional hover fills (LTR/RTL), tactile button physics, and the non-obstructive background canvas layering (`z-0` beneath `z-10`).
- **Gemini Flash Vision & Asset Generation:** Used to analyze and generate the custom geometric monogram brand mark (`M` + `G` emblem in gold and crimson), creating transparent dark/light variants and centered browser favicon.

### Architectural Notes
- **Authentication:** Uses Laravel Sanctum SPA cookie/session authentication with CSRF protection, chosen because the application operates as a unified web browser client. If native mobile apps (iOS/Android) or external third-party API clients are added in the future, Sanctum Personal Access (Bearer) tokens will be used to bypass cross-origin browser cookie constraints.
- **Admin & CMS Portal Access Flow:**
  - Administrative and editorial pages are intentionally hidden from public storefront browsing and accessed directly via the `/admin` path (or via the discrete footer link).
  - **Dynamic Accessibility for Authenticated Staff:** As soon as an administrator or moderator logs in, an interactive Dashboard access button (`Shield` icon + role badge) dynamically mounts into the primary sticky navigation bar and mobile drawer, providing seamless one-click return to the management cockpit.
  - **Production Sub-Domain Strategy:** In an enterprise production deployment, the operations console would conventionally be hosted on a dedicated sub-domain (e.g., `admin.motogroup.ae` or `cms.motogroup.ae`) separated by convention and reverse-proxy routing. For simplicity, zero-setup reviewer evaluation, and unified cross-origin cookie sharing on local development environments, it is routed as a dedicated `/admin` path within the SPA.
- **Role-Based Access Control (RBAC):**
  - **Group Admin:** Full control over global content, headers text, section visibility toggles, all brands, and all data records.
  - **Brand Moderator (Data Entry):** Scoped strictly to an assigned brand (`brand_id`) to manage motorcycle models and review incoming test-ride requests.
- **Asset Handling:** Initial dataset uses simulated S3/CDN image paths. Data entry forms accept image URL strings, with local/S3 storage file uploads scheduled for post-evaluation deployment.

---

## Project Structure

```text
moto-group-platform/
├── backend/          # Laravel 13 API (Sanctum SPA, RBAC policies, migrations, seeders)
├── frontend/         # React 19 SPA (Public showroom & role-based CMS)
├── .agents/          # Antigravity skills & best practices
├── ERD.md            # Mermaid Entity Relationship Diagram & database schema dictionary
├── FEATURES.md       # Block table view showcasing all features, buttons & permissions
├── REQUIREMENTS.md   # Platform specs, architectural decisions & progress checklist
└── README.md         # Setup and execution guide
```

---

## Quick Start (Reviewer Setup)

### Prerequisites
- PHP 8.3+ (tested on PHP 8.4) with Composer
- Node.js 20+ (tested on Node 24) with npm
- Git

---

### 0. Clone the Repository

```bash
git clone https://github.com/EyadAymanM/moto-group-platform.git
cd moto-group-platform
```

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Environment setup (SQLite is preconfigured)
cp .env.example .env
php artisan key:generate

# Run migrations and seed multi-brand catalog & test accounts
php artisan migrate --seed

# Run automated backend test suite (8/8 tests, 108 assertions)
php artisan test tests/Feature/ApiTest.php

# Start Laravel backend server
php artisan serve
```
Backend API will be running at `http://localhost:8000`.

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (Tailwind v4 pre-configured)
npm install

# Verify production build & TypeScript types
npm run build

# Start Vite dev server
npm run dev
```
Frontend application will be accessible at `http://localhost:5173`.

---

### 3. Pre-Seeded Test Credentials

| Role | Email | Password | Scope & Permissions |
|------|-------|----------|---------------------|
| **Group Admin** | `admin@motogroup.ae` | `password` | Global access: CMS settings, all 4 brands, full catalog CRUD, all test rides |
| **Ducati Moderator** | `moderator.ducati@motogroup.com` | `password` | Brand-scoped: Ducati catalog CRUD, Ducati test-ride leads |
| **BMW Moderator** | `moderator.bmw@motogroup.com` | `password` | Brand-scoped: BMW Motorrad catalog CRUD, BMW test-ride leads |
| **Vespa Moderator** | `moderator.vespa@motogroup.com` | `password` | Brand-scoped: Vespa catalog CRUD, Vespa test-ride leads |
| **Harley Moderator** | `moderator.harley@motogroup.com` | `password` | Brand-scoped: Harley-Davidson catalog CRUD, Harley test-ride leads |

---

### 4. Optional: Production Optimization & Diagnostics Commands

For production deployment preparation, high-throughput caching, or diagnosing server behavior with detailed debug logs, you may optionally execute the following commands:

#### A. Laravel Production Optimization
```bash
cd backend

# 1. Compile all caches simultaneously (config, routes, events)
php artisan optimize

# 2. Or compile individual components selectively:
php artisan config:cache    # Compiles .env and config files into a single cached file
php artisan route:cache     # Compiles all API and web routes into a cached mapping
```

#### B. Laravel Debugging & Diagnostic Flags
```bash
cd backend

# Flush all compiled caches if diagnosing unexpected changes or stale config:
php artisan optimize:clear

# In backend/.env, toggle debug verbosity:
# APP_DEBUG=true            # Set to true for detailed JSON error stack traces (disable in production)
# LOG_LEVEL=debug           # Captures granular query and framework logs in storage/logs/laravel.log

# Run local PHP server with verbose real-time request/response logging:
php artisan serve --verbose
```

#### C. Frontend Production Build & Diagnostics
```bash
cd frontend

# 1. Compile optimized production distribution bundle (outputs to dist/):
npm run build

# 2. Preview the production build locally (simulates production HTTP server on port 4173):
npm run preview

# 3. Start Vite dev server with verbose HMR and plugin transform debug output:
npm run dev -- --debug
```

#### D. Production Environment Considerations (CORS & Domains)
> In an enterprise production deployment:
> - Set `APP_ENV=production` and `APP_DEBUG=false` in `backend/.env`.
> - Update `FRONTEND_URL` in `backend/.env` to the production domain (e.g., `https://motogroup.ae`).
> - Set `SANCTUM_STATEFUL_DOMAINS` to the production frontend domain (e.g., `motogroup.ae,admin.motogroup.ae`).

---

## Implemented Platform Highlights

### Technical Luxury Public Showroom (`/`)
- **Living Atmospheric Canvas Backdrop (`InteractiveBackdrop.tsx`):**
  - **Hardware-Accelerated HTML5 Canvas:** Renders at 60 FPS behind all UI layers (`fixed inset-0 pointer-events-none z-0`) with retina DPR scaling.
  - **Delayed Mouse Cursor Glow:** Smooth exponential lerping (`lerpFactor = 0.075`) creates a soft radial aurora glow (`#D4AF37` gold and `#FF334B` crimson) trailing naturally behind the pointer.
  - **Kinetic Particle Scattering:** Particles within 150px of the delayed cursor repel radially outward with velocity-scaled impulse shockwaves, interaction luminescence flares, and friction damping (`0.92`).
  - **Multi-Plane 3D Parallax Scroll Depth:** Particles carry depth factors (`0.25` to `1.0`); scrolling dynamically shifts layers vertically at varying speeds and imparts fluid kinetic momentum.
  - **Elastic Aurora Sway & Viewport Wrapping:** Radial glow cushions vertically on scroll acceleration, and particles seamlessly wrap across viewport edges for continuous density.
  - **Strict Background Layering:** Zero click interference (`pointer-events-none`) with all cards, buttons, text, and modals elevated to `relative z-10` and above.
- **Brand Identity & Custom Emblem (`BrandLogo.tsx`):**
  - Custom geometric monogram mark (`M` and `G` in luxury gold and crimson) with transparent dark/light theme switching.
  - Integrated across the sticky navigation bar, footer, admin sidebar, and live preview slide-over.
  - Centered high-resolution transparent browser favicon (`favicon.ico` / `favicon.png`).
- **Directional Fill Navbar & Unified Breakpoints (`Navbar.tsx`):**
  - Direction-aware navigation link hover fills sweeping left-to-right (LTR) in English and right-to-left (RTL) in Arabic.
  - Unified responsive breakpoint at `lg: 1024px` eliminating overlap between desktop navigation links and mobile hamburger controls, with automatic drawer collapse on window resize.
  - Tactile luxury button animations (`.btn-luxury-gold`, `.btn-luxury-ghost`, `.pill-interactive`) across all page sections and modals.
- **Brand Marquee Bar:** Authorized GCC distribution seals for Ducati, BMW Motorrad, Vespa, and Harley-Davidson with active model counters and filtering.
- **Hero Showcase:** Panigale V4 flagship spotlight with rim lighting, floating telemetry badges (215.5 BHP, 2.8s 0-100, 1,103 CC), and regional GCC showroom ribbon.
- **Editorial Segment Showcase:** 5-segment filter (`ALL`, `PERFORMANCE`, `ADVENTURE`, `URBAN EV`, `HERITAGE`) with subtle watermark branding and high-contrast typography.
- **Dyno Cockpit Cards:** Stitch MCP token-aligned cards (8px container, 4px buttons) featuring starting prices in AED, live telemetry HUD (BHP, Torque, 0-100 km/h), displacement badge, and dual CTAs.
- **Engineering Telemetry Modal:** 12px modal dialog with backdrop acrylic blur, multi-angle gallery, interactive factory colorway swatches, and 8-point engineering spec matrix.
- **VIP Test-Ride Concierge Wizard:** 3-stage guided reservation wizard + VIP Boarding Pass with dynamic hardware-accelerated height animation (`ResizeObserver` + Framer Motion) that completely prevents empty dead space or layout jumps. Integrated with `POST /api/test-rides` and WhatsApp Concierge handoff.
- **Regional Flagship Hubs (Dubai, Riyadh, Doha):** Interactive architectural boutique card with city switcher tabs, clean dual-mode media slider (switching between architectural photo and embedded interactive Google Maps), confirmed addresses, operating hours, direct phone, VIP lounge reservations, and Google Maps directions.
- **Automotive Group Footer:** Bilingual legal marque footer with live language toggle (`EN | العربية`), localized Privacy Policy and Terms & Conditions floating popovers anchored directly above the trigger links with smooth tab switching, and administrative portal access.
- **Bilingual & Bidi Support:** Native English (LTR) and Gulf Arabic (RTL) with `Tajawal` typography and contextual bidi alignment.

### Role-Aware CMS & Operations Cockpit (`/admin`)
- **Luxury Dark/Light Technical Sidebar & Operations Bar (`SidebarNav.tsx`, `AdminDashboardPage.tsx`):** Stitch-aligned console with gold indicator pips, role seals (`GROUP ADMIN` vs `MARQUE MODERATOR`), dual light/dark theme switching, native language toggle (`EN | العربية`), custom brand logo mark, and direct showroom link.
- **Dual-Mode Theme Switching & Full Arabic RTL Support:** Seamless switching between luxury obsidian dark (`#0B0F17` / `#1C2433`) and warm desert sand light modes, with full right-to-left (RTL) layout adaptation and `Tajawal` font across all administrative views.
- **Operations Overview (`OverviewView.tsx`):** Real-time KPI matrix tracking fleet capacity, pending VIP leads, average horsepower dyno telemetry, and regional hub distribution (Dubai, Riyadh, Doha).
- **Fleet Inventory Management (`InventoryTableView.tsx` & `MotorcycleFormModal.tsx`):** High-density sortable data table with brand filtering (all marques for Admin; strictly locked to assigned marque for Moderator), full motorcycle CRUD, and dyno specification editor.
- **VIP Concierge Pipeline (`LeadsTableView.tsx`):** Live lead dossier tracking with inline status transitions (`Pending` → `Confirmed` → `Completed` / `Cancelled`) and direct one-click WhatsApp Concierge client handoff.
- **Storefront CMS & Live Preview Slide-Over (`CmsSettingsView.tsx` & `LivePreviewDrawer.tsx`):** Real-time staging environment for hero copy and section visibility toggles with an interactive Framer Motion slide-over preview that updates instantly without unsaved database writes and requires explicit publishing. Smoothly recedes to full widescreen when managing data tables.

---

## Documentation & Progress

For detailed architecture, design decisions, feature breakdown, and database relationships, see:
- [ERD.md](./ERD.md) — Mermaid Entity Relationship Diagram, schema dictionary, foreign keys & indexes.
- [FEATURES.md](./FEATURES.md) — Comprehensive block-by-block feature matrix and interactive button catalog.
- [REQUIREMENTS.md](./REQUIREMENTS.md) — Architectural decisions, RBAC specifications & full progress checklist.
- `docs/phases/` — Phase-by-phase implementation logs and technical specs.

