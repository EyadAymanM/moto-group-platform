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

# Run migrations
php artisan migrate

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

# Start Vite dev server
npm run dev
```
Frontend application will be accessible at `http://localhost:5173`.

---

## Documentation & Progress

For planned architecture, design decisions, and progress tracking, see [REQUIREMENTS.md](./REQUIREMENTS.md).
