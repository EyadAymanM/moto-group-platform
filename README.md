# Multi-Brand Motorcycle Group Platform

A full-stack multi-brand motorcycle digital platform operating across regional showrooms. Features a modern technical luxury public showroom and a role-based CMS management portal.

---

## Architecture & Technology Stack

- **Backend:** [Laravel 13](https://laravel.com/) (RESTful API, Sanctum SPA Authentication, Role-based Policies)
- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` configuration)
- **Database:** SQLite (default for zero-setup evaluation) with MySQL support in `.env.example`

### Architectural Notes
- **Authentication:** Uses Laravel Sanctum SPA cookie/session authentication with CSRF protection, chosen because the application operates as a unified web browser client. If native mobile apps (iOS/Android) or external third-party API clients are added in the future, Sanctum Personal Access (Bearer) tokens will be used to bypass cross-origin browser cookie constraints.
- **Role-Based Access Control (RBAC):**
  - **Group Admin:** Full control over global content, headers text, section visibility toggles, all brands, and all data records.
  - **Brand Moderator (Data Entry):** Scoped strictly to an assigned brand (`brand_id`) to manage motorcycle models and review incoming test-ride requests.
- **Asset Handling:** Initial dataset uses simulated S3/CDN image paths. Data entry forms accept image URL strings, with local/S3 storage file uploads scheduled for the final integration phase.

---

## Project Structure

```text
moto-group-platform/
├── backend/          # Laravel 13 API (Sanctum SPA, RBAC policies, migrations, seeders)
├── frontend/         # React 19 SPA (Public showroom & role-based CMS)
├── .agents/          # Antigravity skills & best practices
├── REQUIREMENTS.md   # Platform specs, architectural decisions & progress checklist
└── README.md         # Setup and execution guide
```

---

## Quick Start (Reviewer Setup)

### Prerequisites
- PHP 8.3+ (tested on PHP 8.4) with Composer
- Node.js 20+ (tested on Node 24) with npm

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
| **Ducati Moderator** | `ducati.mod@motogroup.ae` | `password` | Brand-scoped: Ducati catalog CRUD, Ducati test-ride leads |
| **BMW Moderator** | `bmw.mod@motogroup.ae` | `password` | Brand-scoped: BMW Motorrad catalog CRUD, BMW test-ride leads |
| **Vespa Moderator** | `vespa.mod@motogroup.ae` | `password` | Brand-scoped: Vespa catalog CRUD, Vespa test-ride leads |
| **Harley Moderator** | `harley.mod@motogroup.ae` | `password` | Brand-scoped: Harley-Davidson catalog CRUD, Harley test-ride leads |

---

## Implemented Platform Highlights

### Technical Luxury Public Showroom (`/`)
- **Brand Marquee Bar:** Authorized GCC distribution seals for Ducati, BMW Motorrad, Vespa, and Harley-Davidson with active model counters and filtering.
- **Hero Showcase:** Panigale V4 flagship spotlight with rim lighting, floating telemetry badges (215.5 BHP, 2.8s 0-100, 1,103 CC), and regional GCC showroom ribbon.
- **Editorial Segment Showcase:** 5-segment filter (`ALL`, `PERFORMANCE`, `ADVENTURE`, `URBAN EV`, `HERITAGE`) with subtle watermark branding and high-contrast typography.
- **Dyno Cockpit Cards:** Stitch MCP token-aligned cards (8px container, 4px buttons) featuring starting prices in AED, live telemetry HUD (BHP, Torque, 0-100 km/h), displacement badge, and dual CTAs.
- **Engineering Telemetry Modal:** 12px modal dialog with backdrop acrylic blur, multi-angle gallery, interactive factory colorway swatches, and 8-point engineering spec matrix.
- **VIP Test-Ride Concierge Wizard:** 3-stage guided reservation wizard + VIP Boarding Pass with dynamic hardware-accelerated height animation (`ResizeObserver` + Framer Motion) that completely prevents empty dead space or layout jumps. Integrated with `POST /api/test-rides` and WhatsApp Concierge handoff.
- **Regional Flagship Hubs (Dubai, Riyadh, Doha):** Interactive architectural boutique card with city switcher tabs, dual-mode media carousel slider (switching between architectural photo and embedded interactive Google Maps), confirmed addresses, operating hours, direct phone, VIP lounge reservations, and Google Maps directions.
- **Automotive Group Footer:** Bilingual legal marque footer with live language toggle (`EN | العربية`), localized Privacy Policy and Terms & Conditions floating popovers anchored directly above the trigger links with smooth tab switching, and administrative portal access.
- **Bilingual & Bidi Support:** Native English (LTR) and Gulf Arabic (RTL) with `Tajawal` typography and contextual bidi alignment.

---

## Documentation & Progress

For detailed architecture, design decisions, and block-by-block progress, see:
- [REQUIREMENTS.md](./REQUIREMENTS.md) — Architectural decisions, RBAC rules & full progress checklist.
- `docs/phases/` — Phase-by-phase implementation logs and technical specs.
