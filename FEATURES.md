# Platform Feature Showcase & Interactive Control Matrix

This document provides a comprehensive walkthrough guide and feature inventory of all functional capabilities, interactive controls, buttons, and role-based actions across the **Multi-Brand Motorcycle Digital Platform**.

---

## 🧭 Walkthrough Guide & Admin Portal Access Flow

- **Public Showroom Experience (`/`):** By default, visitors land on the high-contrast technical luxury showroom, exploring multi-brand models, mechanical dyno telemetry, architectural dealerships, and booking VIP concierge test rides.
- **Hidden Admin Path (`/admin`):** All administration and data-entry pages are intentionally **hidden** from public storefront navigation. Reviewers and staff access the portal directly by navigating to the `/admin` URL (or by clicking the discrete "Administrative Portal" lock icon in the footer).
- **Dynamic Navbar Accessibility Upon Login:** Once authenticated as either **Group Admin** or **Marque Moderator**, an interactive **Dashboard** button (`Shield` icon + role seal) dynamically mounts into the primary sticky navigation bar (`Navbar.tsx`) and mobile drawer. This provides immediate, one-click accessibility between public storefront validation and the management cockpit.
- **Production Sub-Domain Convention:** In an enterprise production deployment, the operations console would conventionally be hosted on a dedicated sub-domain (e.g., `admin.motogroup.ae` or `cms.motogroup.ae`) separated by convention, SSL termination, and reverse-proxy routing. For simplicity, zero-setup reviewer evaluation, and unified cross-origin session cookies in the local development environment, it is structured as a dedicated `/admin` path URL within the SPA.

---

## Role & Permission Matrix

| Role | Showroom Browsing | Test-Ride Booking | Fleet Inventory Management | Lead Concierge Management | Storefront CMS & Live Staging |
|---|:---:|:---:|:---:|:---:|:---:|
| **Public Guest / VIP Client** | ✅ Full Access | ✅ Submit Request | ❌ No Access | ❌ No Access | ❌ No Access |
| **Marque Moderator (Data Entry)** | ✅ Full Access | ✅ Submit Request | ⚠️ Scoped to assigned Brand (`brand_id`) | ⚠️ Scoped to assigned Brand (`brand_id`) | ❌ View Only (Read-Protected) |
| **Group Admin** | ✅ Full Access | ✅ Submit Request | ✅ Global (All 4 Brands) | ✅ Global (All Leads & Brands) | ✅ Full Staging & Live Publishing |

---

## Block 0: Global Atmosphere & Accessibility Shell

The persistent application foundation governing visual ergonomics, localization, and hardware-accelerated ambient physics.

| UI Control / Element | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Living Canvas Backdrop** | Mouse pointer move & window scroll | All Visitors | 60 FPS HTML5 canvas physics (`InteractiveBackdrop.tsx`): tracks mouse with luxury exponential lerp (`0.075`), casts ambient radial aurora glow (`#D4AF37` / `#FF334B`), triggers velocity-scaled particle scattering shockwaves on cursor approach, and drives multi-plane 3D parallax scrolling with elastic vertical sway. | Soft luminous flare upon particle repulsion; zero click interference (`z-0 pointer-events-none`). |
| **Global Theme Toggle** | Click / Tap button (`Sun` / `Moon` icons) | All Visitors & Staff | Switches between luxury **Obsidian Dark** (`#0B0F17`) and **Desert Sand Light** mode; synchronizes `ThemeContext` and updates `html.dark` class and `localStorage`. | Rotating icon spring animation (`rotate: 0 -> 90`), fluid color transitions across borders and panels. |
| **Global Language Switcher** | Segmented Pill button (`EN` / `العربية`) | All Visitors & Staff | Switches between **English (LTR)** and **Gulf Arabic (RTL)**; triggers `LocaleContext`, switches typography to `Tajawal`, mirrors bidirectional CSS layouts, and loads localized i18n dictionaries. | Smooth Framer Motion spring pill sliding between active language badges. |
| **Toast Notification Hub** | Automatic event trigger | All Visitors & Staff | Displays transient non-blocking toast alerts for API actions (e.g., booking confirmed, inventory updated, settings published, network errors). | Floating acrylic toast pill with auto-dismiss timer and status icon. |

---

## Block 1: Sticky Navigation Bar (`Navbar.tsx`)

Primary orientation and routing header anchored with glassmorphic backdrop blur at `z-40`.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Brand Logo Mark** | Link (`/`) | All Visitors | Navigates to top of public homepage; re-centers interactive viewport. | Brand monogram emblem with subtle gold hover glow and brand text. |
| **"Marques" Nav Link** | Anchor link (`#marques`) | All Visitors | Smoothly scrolls viewport to Block 2 (Authorized Brand Marquees Bar). | Direction-aware background fill sweep (LTR in English, RTL in Arabic) + gold text transition. |
| **"Fleet" Nav Link** | Anchor link (`#catalog`) | All Visitors | Smoothly scrolls viewport to Block 4 (Multi-Brand Catalog Filter Grid). | Direction-aware background fill sweep (LTR in English, RTL in Arabic) + gold text transition. |
| **"Dealers" Nav Link** | Anchor link (`#dealers`) | All Visitors | Smoothly scrolls viewport to Block 8 (Regional Flagship Hubs & Dealership Locator). | Direction-aware background fill sweep (LTR in English, RTL in Arabic) + gold text transition. |
| **"Book Test Ride" Header CTA** | Primary action button (`Calendar` icon) | All Visitors | Opens the 3-stage VIP Test-Ride Concierge Wizard modal (`TestRideModal.tsx`) with default selection. | Tactile `.btn-luxury-gold` scale effect (`scale: 1.02`), calendar icon micro-bounce. |
| **Dashboard Quick Link** | Ghost action button (`Shield` icon) | Authenticated Admin / Moderator | Appears only when a session is active; routes directly to `/admin` dashboard. | Gold border shimmer, badge displaying current role (`ADMIN` or marque name). |
| **Mobile Hamburger Toggle** | Icon button (`Menu` / `X`) | Mobile & Tablet (`< 1024px`) | Toggles the expandable mobile navigation drawer; automatically closes on desktop viewport expansion. | Smooth 90-degree icon rotation between hamburger bars and close icon. |
| **Mobile Drawer Nav Links** | Navigation buttons | Mobile & Tablet (`< 1024px`) | Smoothly scrolls to target section and automatically closes the mobile dropdown drawer. | Full-width tactile touch highlight with directional fill lines. |

---

## Block 2: Authorized Brand Marquee Bar (`BrandMarqueeBar.tsx`)

Marque selector celebrating regional GCC distribution rights for world-tier motorcycle manufacturers.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **"All Brands" Chip** | Filter toggle button | All Visitors | Resets marque filtering across both the hero showcase and the catalog grid. | Active gold perimeter glow, highlighted model count pill. |
| **Marque Seal Chips** (Ducati, BMW, Vespa, Harley) | Filter toggle buttons | All Visitors | Filters storefront catalog exclusively to the selected brand; passes `selectedBrandId` downstream. | Gold border activation, brand logo emblem illumination, model count badge. |
| **Marque Counter Badges** | Informational pill | All Visitors | Displays live count of active models in inventory for each authorized manufacturer. | Monospace numeric badge styling (`JetBrains Mono`). |

---

## Block 3: Flagship Hero Showcase (`HeroSection.tsx`)

High-impact technical spotlight featuring the flagship Panigale V4 S with dyno metrics and GCC showroom ribbon.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **"Explore Fleet" CTA** | Primary button (`ChevronDown` / Arrow) | All Visitors | Triggers smooth programmatic scroll into Block 4 (Catalog Section). | Gold button glow, arrow down-shift animation on hover. |
| **"Book VIP Test Ride" Hero CTA** | Secondary button (`Calendar` icon) | All Visitors | Launches the Test-Ride Concierge Wizard pre-configured with the flagship Panigale V4 S. | `.btn-luxury-ghost` outline highlight with gold fill transition. |
| **Floating Telemetry Badges** | Interactive telemetry pills | All Visitors | Visualizes key mechanical metrics (215.5 BHP, 2.8s 0-100 km/h, 1,103 CC displacement). | Glassmorphic cards with floating micro-drift and high-contrast typography. |
| **Regional Showroom Ribbon** | Informational banner | All Visitors | Direct access anchor highlighting verified flagship hubs in Dubai, Riyadh, and Doha. | Obsidian glass badge with gold accent pins. |

---

## Block 4: Editorial Catalog Grid & Segment Filter (`CatalogSection.tsx`)

Multi-brand browsing grid with multi-tier segment filtering and model count telemetry.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Segment Tabs** (`ALL`, `PERFORMANCE`, `ADVENTURE`, `URBAN EV`, `HERITAGE`) | Segment selector buttons | All Visitors | Filters vehicle grid by riding philosophy; animates grid re-ordering. | Sliding layout indicator pill under active segment tab. |
| **Marque Quick Dropdown** | Dropdown select | All Visitors | Filters catalog by specific manufacturer within the selected segment. | Highlighted option, instant layout crossfade without page reload. |
| **"Reset Filters" Button** | Action button | All Visitors | Appears when filters return zero results; restores default full catalog view. | Soft pulse button restoring full grid. |

---

## Block 5: Dyno Cockpit Motorcycle Cards (`MotorcycleCard.tsx`)

Stitch MCP-aligned vehicle cockpit cards (8px border radius, 4px buttons) presenting dyno specs and dual CTAs.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Vehicle Studio Photo** | Hover interaction | All Visitors | Triggers subtle cinematic vehicle zoom and chassis shadow elevation. | Smooth `scale-105` image transform with dynamic rim light glare. |
| **"Engineering Specs" CTA** | Ghost action button (`Gauge` icon) | All Visitors | Opens the 12px Engineering Telemetry Modal (`TelemetryModal.tsx`) for deep technical inspection. | Border highlight, gauge icon rotation on hover. |
| **"Book Ride" CTA** | Primary action button (`Calendar` icon) | All Visitors | Launches VIP Test-Ride Concierge Wizard with this specific motorcycle pre-selected in Step 1. | Gold button fill with active tactile click response. |
| **Dyno Specs Telemetry HUD** | Informational grid | All Visitors | Displays real-time mechanical figures: Horsepower (BHP), Torque (Nm), 0-100 km/h sprint, Engine CC. | High-contrast monospace formatting (`JetBrains Mono`). |

---

## Block 6: Engineering Telemetry Modal (`TelemetryModal.tsx`)

Deep-dive modal dialog (`rounded-[12px]`) featuring factory colorway swatches and an 8-point engineering spec matrix.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Modal Close Button** | Icon button (`X`) | All Visitors | Dismisses the telemetry modal; restores background scroll locking. | Icon rotation and border fade on hover. |
| **Backdrop Blur Click** | Overlay click | All Visitors | Closes the modal when clicking outside the 12px acrylic container. | Smooth fade-out opacity transition. |
| **Factory Colorway Swatches** | Swatch selector buttons | All Visitors | Cycles through manufacturer factory paint finishes (e.g. Ducati Red, Arctic White, Stealth Black). | Selected swatch receives outer gold ring indicator; updates colorway name text. |
| **Gallery Thumbnail Selector** | Thumbnail buttons | All Visitors | Switches the primary studio hero display between multi-angle photography cuts. | Active thumbnail border highlights in gold; main image fades smoothly. |
| **"Reserve This Machine" Modal CTA** | Primary button | All Visitors | Closes the specs modal and instantly opens the VIP Test-Ride Wizard with this motorcycle locked. | Smooth modal crossfade transition into Concierge Wizard. |

---

## Block 7: VIP Test-Ride Concierge Wizard & Boarding Pass (`TestRideModal.tsx`)

Hardware-accelerated 3-stage reservation wizard with dynamic height transitions (`ResizeObserver`) preventing layout jumps.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Step 1: Marque & Model Picker** | Grid select cards | All Visitors | Selects the desired motorcycle model; displays thumbnail, starting price, and engine displacement. | Card perimeter illuminates gold with checkmark confirmation badge. |
| **Step 2: City Flagship Selector** | Segmented tabs (`Dubai`, `Riyadh`, `Doha`) | All Visitors | Assigns the test-ride to a specific regional flagship showroom. | Active city tab illuminates with gold underlay. |
| **Step 2: Preferred Date Picker** | Date input | All Visitors | Selects appointment date; validates against past dates. | Monospace calendar picker with native date styling. |
| **Step 2: Experience Level Selector** | 3-tier chips (`Beginner`, `Intermediate`, `Expert`) | All Visitors | Flags rider experience level for showroom staff safety briefing. | Selected tier chip receives solid gold fill. |
| **Step 3: Client Dossier Inputs** | Text inputs (Name, Email, Phone, Notes) | All Visitors | Captures VIP client credentials; validates phone format with international country code. | Real-time validation borders, error messaging on invalid formats. |
| **"Confirm VIP Booking" CTA** | Primary submit button | All Visitors | Sends `POST /api/test-rides` payload; transitions wizard to digital Boarding Pass stage. | Loading spinner state (`Submitting...`), disabling duplicate clicks. |
| **VIP Boarding Pass** | Visual dossier display | All Visitors | Displays confirmation reference code (`MOTO-XXXXX`), QR simulation, selected motorcycle, city, and date. | High-contrast luxury boarding pass layout with perforation cutouts. |
| **"WhatsApp Concierge" Handoff** | External link button (`MessageSquare` icon) | All Visitors | Opens direct WhatsApp chat with the flagship showroom concierge, pre-filled with the booking reference and vehicle details. | WhatsApp green button hover with external link trigger. |
| **"Book Another Ride" / Close** | Secondary button | All Visitors | Resets the wizard state and closes the modal. | Modal animates out smoothly. |

---

## Block 8: Regional Flagship Hubs & Dealership Locator (`DealershipsSection.tsx`)

Boutique directory showcasing premier architectural showrooms across Dubai, Riyadh, and Doha.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **City Selector Tabs** | Segment buttons (`Dubai`, `Riyadh`, `Doha`) | All Visitors | Switches active hub details, confirmed physical address, telephone, and map coordinates. | Active tab illuminates with gold highlight pill. |
| **Top Media Mode Switcher** | Segment buttons (`Showroom` / `Interactive Map`) | All Visitors | Toggles between high-resolution architectural photography and live embedded Google Maps iframe. | Smooth crossfade between photo and interactive map without side arrow clutter. |
| **Direct Phone Link** | Click-to-call link | All Visitors | Initiates phone call to the regional flagship hub concierge desk (`tel:...`). | Gold text underline hover with phone icon bounce. |
| **"Get Directions" Button** | External link (`MapPin` icon) | All Visitors | Opens Google Maps in a new browser tab with exact showroom coordinates. | External link opens with security rel attributes (`noopener,noreferrer`). |
| **"Reserve VIP Lounge" CTA** | Primary button | All Visitors | Opens the Test-Ride Concierge Wizard pre-configured with the selected city hub. | Smooth scroll and wizard opening with city pre-selected. |

---

## Block 9: Regional Automotive Group Footer (`Footer.tsx`)

Bilingual legal marque footer with localized Privacy Policy and Terms & Conditions popovers.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Brand Emblem Mark** | Logo link | All Visitors | Scrolls to top of showroom; displays group copyright and commercial registration details. | Smooth scroll to page origin. |
| **Marque Navigation Anchors** | Text links | All Visitors | Filters showroom to target manufacturer and scrolls to catalog. | Gold text transition on hover. |
| **"Privacy Policy" Trigger** | Popover button | All Visitors | Opens a floating acrylic popover anchored directly above the link; includes bilingual data policy and tab switcher. | Animated popover scale-in (`y: -8 -> 0, opacity: 1`); auto-dismisses on outside click. |
| **"Terms of Service" Trigger** | Popover button | All Visitors | Opens floating terms popover detailing VIP test-ride liability, age requirements, and booking rules. | Animated popover scale-in with tab switcher between Privacy and Terms. |
| **Footer Language Toggle** | Text button | All Visitors | Secondary language toggle (`EN | العربية`) mirroring the navbar language switcher. | Synchronous language update across all open components. |
| **"Administrative Portal" Link** | Discrete footer link | Staff / Reviewers | Routes directly to `/admin` login screen. | Subtle lock icon illuminating gold on hover. |

---

## Block 10: Role-Aware CMS Cockpit & Operations Topbar (`SidebarNav.tsx`, `AdminDashboardPage.tsx`)

Administrative management console accessed directly via path `/admin` (redirects to `/admin/login` when unauthenticated).

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Admin Login Gateway (`AdminLoginPage.tsx`)** | Form submission (`/admin/login`) | Unauthenticated Staff | Performs Sanctum CSRF handshake (`/sanctum/csrf-cookie`) and authenticates credentials (`POST /api/auth/login`); establishes secure session cookie and redirects to `/admin` dashboard. | High-contrast luxury glassmorphic login card, loading spinner, error feedback banner on invalid credentials. |
| **Demo Account Quick Reference** | Informational badges | Reviewers & Staff | Lists pre-seeded test accounts: `admin@motogroup.ae` (Group Admin) and `moderator.{brand}@motogroup.com` (password: `password`). | High-contrast monospace credentials cards with copy-ready formatting. |
| **Console Brand Mark** | Branding header | Admin & Moderator | Identifies the management cockpit; displays active environment status. | High-resolution transparent brand emblem. |
| **View Navigation Links** (`Overview`, `Inventory`, `Leads`, `Storefront CMS`) | Navigation buttons | Admin & Moderator | Switches active operational view; `Storefront CMS` is highlighted for Admins and read-protected for Moderators. | Active gold vertical pill indicator; icon illumination. |
| **Role Seal Badge** | Status badge | Admin & Moderator | Displays `GROUP ADMIN` (global privileges) or `MARQUE MODERATOR` (brand-scoped privileges). | High-contrast gold badge with role designation. |
| **Assigned Marque Indicator** | Status chip | Moderator | Displays the moderator's assigned manufacturer (e.g. `Ducati`, `BMW Motorrad`). | Shield badge showing locked brand scope. |
| **Operations Theme Toggle** | Icon button | Admin & Moderator | Toggles dark obsidian and desert sand light modes across all administrative tables, forms, and drawers. | Rotating sun/moon animation. |
| **Operations Language Toggle** | Segmented button | Admin & Moderator | Toggles English and Gulf Arabic (RTL) across the entire admin dashboard. | Flips entire dashboard layout direction (RTL) with `Tajawal` font. |
| **"Live Showroom" Quick Link** | External tab button | Admin & Moderator | Opens the public showroom (`/`) in a new browser tab for immediate verification. | External link icon. |
| **"Sign Out" Button** | Action button (`LogOut` icon) | Admin & Moderator | Calls `POST /api/auth/logout`, invalidates Sanctum session cookie, and redirects to `/admin/login`. | Loading state followed by clean redirect. |

---

## Block 11: CMS Operations Overview Matrix (`OverviewView.tsx`)

High-density KPI dashboard providing operational health metrics across fleet and lead pipelines.

| UI Control / Element | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Fleet Capacity Metric Card** | Informational card | Admin & Moderator | Displays total active motorcycle models in inventory (global for Admin, brand-scoped for Moderator). | Numeric stat card with vehicle icon and percentage growth. |
| **VIP Leads Metric Card** | Informational card | Admin & Moderator | Displays pending and active test-ride concierge requests awaiting showroom action. | Stat card with gold alert dot if pending leads exist. |
| **Average Dyno HP Card** | Informational card | Admin & Moderator | Computes real-time average horsepower across the fleet from `motorcycles.horsepower`. | High-contrast dyno badge with mechanical gauge icon. |
| **Regional Hubs Card** | Informational card | Admin & Moderator | Displays active flagship hubs (Dubai, Riyadh, Doha) and network operational status. | Flagship city count badge with map pin icon. |
| **"Manage Inventory" Quick Action**| Action link | Admin & Moderator | Direct navigation shortcut jumping straight into Block 12 (Inventory Management). | Hover button transition with right arrow bounce. |
| **"Review VIP Leads" Quick Action** | Action link | Admin & Moderator | Direct navigation shortcut jumping straight into Block 13 (VIP Concierge Pipeline). | Hover button transition with badge indicator. |

---

## Block 12: Fleet Inventory Management & CRUD Modal (`InventoryTableView.tsx`, `MotorcycleFormModal.tsx`)

Data entry and vehicle telemetry management module with strict RBAC enforcement.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Marque Filter Switcher** | Dropdown / tabs | Admin Only (Locked for Moderator) | Allows Admin to filter table by any marque; for Moderators, this is strictly locked to their assigned `brand_id`. | Disabled / read-only badge for Moderators; active selector for Admin. |
| **Search by Model** | Search input | Admin & Moderator | Real-time debounced text filter filtering vehicles by model name, category, or displacement. | Table dynamically filters rows as text is entered. |
| **"Add Motorcycle" Primary CTA** | Primary button (`Plus` icon) | Admin & Moderator | Launches the vehicle creation modal (`MotorcycleFormModal.tsx`) with empty fields (brand pre-locked for Moderator). | `.btn-luxury-gold` button with modal entrance animation. |
| **"Edit Vehicle" Row Action** | Icon button (`Edit` icon) | Admin & Moderator | Opens the vehicle modal pre-populated with existing model specifications, dyno specs, and images. | Modal loads with pre-filled inputs and telemetry matrix. |
| **"Delete Vehicle" Row Action** | Icon button (`Trash2` icon) | Admin & Moderator | Displays confirmation dialog; upon confirmation, sends `DELETE /api/motorcycles/{id}`. | Row fades with loading spinner; updates table instantly. |
| **Auto-Slug Generator** | Form automation | Admin & Moderator | Automatically converts model name into a URL-safe slug in real time (e.g., "Panigale V4 S" -> "panigale-v4-s"). | Slug field updates automatically as name is typed. |
| **Dyno Specs Matrix Inputs** | Form numeric inputs | Admin & Moderator | Captures mechanical telemetry: CC, Horsepower (BHP), Torque (Nm), Dry Weight (kg), Top Speed (km/h), 0-100 km/h (s). | High-density numeric fields with metric suffix labels. |
| **Featured Spotlight Switch** | Form toggle switch | Admin & Moderator | Sets `is_featured = true`; flags model for homepage hero spotlight consideration. | Gold toggle switch transition. |
| **Active Catalog Switch** | Form toggle switch | Admin & Moderator | Sets `is_active = true/false`; instantly hides or reveals vehicle in public catalog. | Switch state changes color (green active / gray inactive). |
| **"Save Changes" Form CTA** | Primary modal button | Admin & Moderator | Validates form fields via Laravel Form Request; sends `POST` (create) or `PUT` (update) request. | Button shows spinner; closes modal on success and shows toast. |
| **"Cancel" Form Button** | Secondary button | Admin & Moderator | Discards unsaved edits and closes modal. | Modal animates out without altering table state. |

---

## Block 13: VIP Concierge Pipeline & Lead Dossier (`LeadsTableView.tsx`)

Lead dossier tracking and WhatsApp concierge handoff module for regional showroom staff.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Status Filter Tabs** (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) | Filter buttons | Admin & Moderator | Filters lead dossier table by pipeline progression state. | Active status tab with count badge. |
| **Marque Filter Switcher** | Filter selector | Admin Only (Locked for Moderator) | Switches lead view across brands for Admin; locked to assigned brand for Moderator. | Real-time table refresh. |
| **Status Transition Dropdown** | Inline table dropdown | Admin & Moderator | Updates lead status (`pending` -> `confirmed` -> `completed` -> `cancelled`); sends `PATCH /api/test-rides/{id}/status`. | Status badge instantly changes color (amber pending, blue confirmed, green completed, red cancelled). |
| **"WhatsApp Concierge" 1-Click** | Table action button (`MessageSquare` icon) | Admin & Moderator | Generates pre-filled personalized WhatsApp greeting with customer name, requested motorcycle, and chosen showroom hub. | Launches WhatsApp Web / client in new window with ready-to-send text. |
| **Client Notes Viewer** | Expandable cell | Admin & Moderator | Reveals customer special requests, riding experience tier, and internal staff follow-up history. | Accordion expansion displaying formatted notes text. |
| **"Delete Lead" Action** | Icon button (`Trash2` icon) | Group Admin Only | Removes lead record from database with confirmation prompt. | Action icon hidden for Moderators; row fades out on deletion. |

---

## Block 14: Storefront CMS Visual Editor & Live Preview Slide-Over (`CmsSettingsView.tsx`, `LivePreviewDrawer.tsx`)

Visual editorial workspace with real-time staging and an interactive slide-over preview drawer.

| UI Control / Button | Type / Trigger | Target Scope / Role | Functional Logic & Action | Visual Feedback & State |
|---|---|---|---|---|
| **Role Access Guard** | System boundary | Admin Only | Restricts CMS editor to Group Admin; displays informative permission notice for Moderators. | Non-admins see locked banner explaining group privileges. |
| **Hero Headline Input** | Text input | Group Admin | Edits main homepage hero headline; updates staging state in real time. | Real-time text preview in slide-over drawer. |
| **Hero Subtitle Input** | Textarea | Group Admin | Edits homepage hero narrative description. | Real-time text preview in slide-over drawer. |
| **Announcement Pill Input** | Text input | Group Admin | Edits top announcement ribbon text (e.g. "Authorized GCC Marque Distribution"). | Dynamic update in preview header. |
| **Section Visibility Toggles** | Toggle switches | Group Admin | Independent ON/OFF toggles for: Brand Marquees Bar, Hero Showcase, Catalog Grid, Regional Showrooms Map, Test-Ride Concierge Drawer. | Switches reflect state; staging drawer instantly hides/reveals toggled sections. |
| **"Open Live Preview" Action CTA** | Primary button (`Eye` icon) | Group Admin | Slides out the interactive Framer Motion staging drawer rendering the live storefront with pending unsaved changes. | Smooth right-side drawer slide-in (`x: 100% -> 0%`) without database writes. |
| **"Publish Live Changes" CTA** | Primary action button (`Check` icon) | Group Admin | Commits staged settings to `cms_settings` table via `PUT /api/cms/settings`; updates production showroom. | Spinner state, success toast notification, updates live database. |
| **"Revert to Published" Button** | Secondary action button (`RotateCcw` icon) | Group Admin | Discards all pending draft changes and restores current database values. | Resets all input fields and preview drawer to published state. |
| **Live Preview Close Button** | Icon button (`X`) | Group Admin | Closes the slide-over staging drawer, returning full widescreen to the CMS editor. | Drawer slides out smoothly (`x: 0% -> 100%`). |
