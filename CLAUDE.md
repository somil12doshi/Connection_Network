# Connection Network – Claude Code Build Plan

> Personal networking dashboard. Pure HTML/CSS/JS. GitHub Pages compatible. No build step. No backend.

---

## Project Goal

A glassmorphism dark-theme personal networking site with:
- **Connections Dashboard** – cards per person with company, LinkedIn, email, phone, career page
- **Companies Page** – company cards with career link + hover hint if connection works there
- **Admin Panel** – `/admin` route with login (id: `admin`, pass: `admin`), full CRUD
- Sticky frosted-glass navbar, smooth animations, filter + sort, all data in `localStorage`

---

## File Structure

```
connection-network/
├── index.html              ← Connections Dashboard (default page)
├── companies.html          ← Companies page
├── admin.html              ← Admin panel (login + CRUD)
├── css/
│   ├── base.css            ← CSS variables, resets, typography
│   ├── navbar.css          ← Sticky frosted-glass nav
│   ├── glass.css           ← Glassmorphism card + UI components
│   ├── connections.css     ← Connection card layout + filters
│   ├── companies.css       ← Company card layout + hover effects
│   └── admin.css           ← Admin panel styles + modal
├── js/
│   ├── store.js            ← localStorage CRUD (connections + companies)
│   ├── connections.js      ← Render connections, filter, sort logic
│   ├── companies.js        ← Render company cards, connection badge logic
│   ├── admin.js            ← Auth guard, CRUD forms, modal handling
│   └── nav.js              ← Active nav highlight, page routing
├── assets/
│   └── logo.svg            ← Optional: site logo/icon
├── .gitignore
└── README.md
```

---

## .gitignore

```
.claude/
.DS_Store
Thumbs.db
*.log
node_modules/
```

---

## Data Schema (localStorage)

### `cnw_connections` — Array of Connection objects
```json
[
  {
    "id": "uuid-v4",
    "name": "Jane Doe",
    "company": "Halliburton",
    "title": "Data Scientist",
    "linkedin": "https://linkedin.com/in/janedoe",
    "email": "jane@halliburton.com",
    "phone": "+1-713-555-0101",
    "notes": "Met at UH career fair",
    "addedOn": "2026-05-01T00:00:00Z"
  }
]
```

### `cnw_companies` — Array of Company objects
```json
[
  {
    "id": "uuid-v4",
    "name": "Halliburton",
    "industry": "Energy / Oil & Gas",
    "careerPage": "https://halliburton.com/careers",
    "logo": "",
    "addedOn": "2026-05-01T00:00:00Z"
  }
]
```

### `cnw_admin_session` — Boolean (true if logged in)

---

## Pages & Features

### 1. `index.html` — Connections Dashboard

**Navbar (sticky, frosted glass):**
- Logo / Site name left
- Nav links: Connections | Companies
- "Admin" link hidden (no direct link — only via `/admin.html`)

**Filter Bar:**
- Dropdown: Filter by Company (populated from `cnw_companies`)
- Dropdown: Sort by — Name A→Z, Name Z→A, Company A→Z, Date Added
- Search input: real-time name search

**Connection Cards (glassmorphism):**
- Avatar initial circle (first letter of name, colored by hash)
- Name + Job Title
- Company badge (pill)
- Action buttons (icon + label):
  - 🔗 LinkedIn → opens in new tab
  - ✉ Email → mailto link
  - 📞 Phone → tel link (only if phone exists)
  - 🏢 Career Page → links to that company's career page (looked up from companies store)
- Hover: card lifts with glow border animation
- Empty state: friendly message if no connections

---

### 2. `companies.html` — Companies Page

**Company Cards (glassmorphism):**
- Company name + industry tag
- 🔗 Career Page button
- On **hover**: tooltip/badge shows "X connection(s) here" (pulled from connections store)
- Cards animate in on load (staggered fade-up)
- Filter/search by company name or industry

---

### 3. `admin.html` — Admin Panel

**Login Screen:**
- Centered glass card
- Username + Password fields
- Credentials: `admin` / `admin`
- On success: store session in `sessionStorage`, reveal dashboard
- On fail: shake animation + error message
- NOT linked from navbar (access only via direct URL)

**Admin Dashboard (after login):**

Tabs:
- **Connections** tab
  - Table of all connections with Edit / Delete per row
  - "+ Add Connection" button → opens modal form
  - Modal fields: Name*, Company* (dropdown from companies), Title, LinkedIn, Email, Phone, Notes
- **Companies** tab
  - Table of all companies with Edit / Delete
  - "+ Add Company" button → modal form
  - Modal fields: Name*, Industry, Career Page URL*, Logo URL (optional)

**All changes persist to localStorage immediately.**

---

## Design System

### Color Palette (CSS Variables)
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--glass-bg: rgba(255,255,255,0.05)
--glass-border: rgba(255,255,255,0.1)
--glass-blur: blur(16px)
--accent-blue: #3b82f6
--accent-cyan: #06b6d4
--accent-purple: #8b5cf6
--text-primary: #f1f5f9
--text-secondary: #94a3b8
--text-muted: #475569
--danger: #ef4444
--success: #22c55e
```

### Typography
- Display / Headings: `'Syne'` (Google Fonts) — geometric, futuristic
- Body: `'DM Sans'` — clean, readable
- Monospace accents: `'JetBrains Mono'`

### Glassmorphism Card Recipe
```css
background: var(--glass-bg);
border: 1px solid var(--glass-border);
backdrop-filter: var(--glass-blur);
-webkit-backdrop-filter: var(--glass-blur);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0,0,0,0.4);
```

### Animations
- Page load: staggered `fadeSlideUp` (cards appear one by one, 60ms delay each)
- Card hover: `transform: translateY(-4px)` + glow border via `box-shadow`
- Modal open/close: scale + opacity transition
- Admin login fail: `shake` keyframe
- Navbar: `backdrop-filter` + border-bottom appears on scroll

---

## Build Steps for Claude Code

### Phase 1 — Foundation
1. Create all files and folders per structure above
2. Write `.gitignore` (include `.claude/`)
3. Write `css/base.css` — variables, reset, fonts import
4. Write `css/glass.css` — glassmorphism component classes
5. Write `css/navbar.css` — sticky frosted nav

### Phase 2 — Data Layer
6. Write `js/store.js`:
   - `getConnections()`, `saveConnections(arr)`
   - `getCompanies()`, `saveCompanies(arr)`
   - `addConnection(obj)`, `updateConnection(id, obj)`, `deleteConnection(id)`
   - `addCompany(obj)`, `updateCompany(id, obj)`, `deleteCompany(id)`
   - `generateId()` — UUID v4 via `crypto.randomUUID()`
   - Seed with 3 sample connections + 3 companies on first load

### Phase 3 — Connections Page
7. Write `index.html` — shell + navbar + filter bar + cards grid
8. Write `css/connections.css`
9. Write `js/connections.js` — render, filter, sort, search logic

### Phase 4 — Companies Page
10. Write `companies.html`
11. Write `css/companies.css`
12. Write `js/companies.js` — render, hover badge, filter

### Phase 5 — Admin Panel
13. Write `admin.html` — login screen + full dashboard (hidden until auth)
14. Write `css/admin.css` — table, modal, tabs
15. Write `js/admin.js` — auth guard, CRUD operations, modal forms

### Phase 6 — Nav + Polish
16. Write `js/nav.js` — active page highlight
17. Add animated background mesh (CSS only, `radial-gradient` blobs)
18. Test all flows: add → edit → delete → filter → sort
19. Verify GitHub Pages compatibility (no server deps, relative paths only)

---

## GitHub Pages Deploy Notes

- All paths must be **relative** (no `/` absolute paths unless using custom domain)
- No `fetch()` to local files — all data via `localStorage`
- Works as static site — zero build step
- Recommended repo name: `connection-network` → publishes at `username.github.io/connection-network`
- Set Pages source to `main` branch, root `/`

---

## Constraints & Rules

| Rule | Detail |
|------|--------|
| No frameworks | Vanilla HTML/CSS/JS only |
| No build tools | No webpack, vite, npm |
| No backend | localStorage only |
| GitHub Pages safe | Relative paths, no server deps |
| Admin hidden | `/admin.html` not linked from navbar |
| `.claude/` gitignored | Always |
| Responsive | Mobile-friendly grid (1 col → 2 col → 3 col) |
| Accessible | `aria-label` on icon buttons, keyboard nav on modals |

---

## Seed Data (injected by store.js on first load)

> Source: `ref.xlsx` — real connections. Missing fields (title, LinkedIn, email, phone) left blank; fill via admin panel.

### Companies (unique from connections list + known career pages)

| Name | Industry | Career Page |
|------|----------|-------------|
| Halliburton | Energy / Oil & Gas | https://halliburton.com/careers |
| Apple | Technology | https://apple.com/careers |
| HP | Technology | https://hp.com/us-en/jobs |
| Equinor | Energy / Oil & Gas | https://equinor.com/careers |
| Publicis Sapient | Consulting / Tech | https://careers.publicissapient.com/ |
| CVS | Healthcare | https://jobs.cvshealth.com |
| AOI | — | — |
| Harris County | Government | https://hrrm.harriscountytx.gov/Pages/Employment.aspx |
| Gilbane Building Company | Construction | https://gilbaneco.com/careers |
| Baylor | Education / Healthcare | https://jobs.baylor.edu |
| NOV | Energy / Manufacturing | https://nov.com/careers |
| BenrockEngies | — | — |
| Alcon | Healthcare / Medical Devices | https://alcon.com/careers |
| Google | Technology | https://careers.google.com |
| Amazon | Technology / E-commerce | https://amazon.jobs |
| LinkedIn | Technology | https://careers.linkedin.com |
| Charles Schwab | FinTech / Finance | https://schwab.com/careers |
| TRC | Engineering / Consulting | https://trcsolutions.com/careers |
| Mc Query | — | — |
| EY | Consulting / Finance | https://ey.com/careers |
| Texas Children / Baylor | Healthcare | https://texaschildrens.org/careers |
| Duke Energy / Wells Fargo | Energy / Finance | — |
| Mansfield Energy Corp | Energy | https://mansfield.com/careers |
| Zepnil Systems | — | — |
| SAP | Technology / ERP | https://sap.com/careers |
| Qualcomm | Technology / Semiconductors | https://qualcomm.com/careers |
| Freightliner | Manufacturing / Automotive | https://jobs.daimler-truck.com |
| Phoenix Mecano | Manufacturing | https://phoenixmecano.com/careers |

### Connections (45 total)

| Name | Company | Notes |
|------|---------|-------|
| Jainish Shah | Halliburton | — |
| Vidhi Shah | Halliburton | — |
| Carol (HR) | Halliburton | HR contact |
| Comfort (Bridges) | Apple | — |
| Bhumik Shah | — | Company TBD |
| Parth Borecha | — | Company TBD |
| Jenit Parmar | Apple | — |
| Megha Rajal (HR) | — | HR contact |
| Nishchal | Apple | — |
| Parag Seth | — | Company TBD |
| Niti Patel | Phoenix Mecano | — |
| Prabhav | — | Company TBD |
| Prameet | HP | — |
| Prerit Shah | Equinor | — |
| Nupur | Publicis Sapient | — |
| Sethu (DE) | CVS | Data Engineer |
| Snehi | AOI | — |
| Nikita | Harris County | — |
| Suketu | Gilbane Building Company | — |
| Dhruvil | Baylor | — |
| Sydney | NOV | — |
| Tochukwu | BenrockEngies | — |
| Nupoor | Alcon | — |
| Arvind | — | Company TBD |
| Abhinav | Google | — |
| Neel | Amazon | — |
| Rajvi | LinkedIn | — |
| Utsav (Swami) | — | Company TBD |
| Ankit Shah | Charles Schwab | — |
| Karan Jain | — | Company TBD |
| Maunik | TRC | — |
| Tejas | Mc Query | — |
| Rupesh Reddy | NOV | — |
| Vimal | EY | — |
| Sachin | Texas Children / Baylor | — |
| Purvesh | Duke Energy / Wells Fargo | — |
| Denil | Mansfield Energy Corp | — |
| Jay | Zepnil Systems | — |
| Varun | SAP | — |
| Krishi | Apple | — |
| Venu | Amazon | — |
| Sahil | Qualcomm | — |
| Utsav | Freightliner | — |
| Geetha Nair | Halliburton | — |
| James Keeble | Halliburton | — |

> **Note for `store.js`:** On first load check `localStorage` key `cnw_seeded`. If absent, bulk-insert all above + set flag. This prevents re-seeding on refresh.

---

*Start with Phase 1. Complete each phase fully before moving to next. Run `open index.html` in browser to test locally.*
