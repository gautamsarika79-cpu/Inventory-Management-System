# 📦 Trackify — Inventory & Supplier Management System

A complete full-stack inventory and supplier management system with authentication,
role-based access, low-stock alerts, and a realistic luxury + local product catalog.

## Tech Stack
- **Backend:** Node.js, Express, JWT auth, bcryptjs password hashing
- **Database:** Self-contained JSON file store (no native drivers, no external DB to install)
- **Frontend:** Vanilla HTML/CSS/JS (no build step required)

## Quick Start

```bash
npm install
npm start
```

Then open **http://localhost:4000** in your browser.

That's it — the database auto-initializes with demo data the first time you run it.

## Demo Accounts

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@trackify.com  | admin123  |
| User  | user@trackify.com   | user1234  |

You can also register a brand-new account from the Register page — the very first
account ever created on a fresh install automatically becomes an admin.

## Features

- 🔐 Register / Login / Logout with JWT authentication
- 🔑 Passwords hashed with bcrypt — never stored in plain text
- 👤 Admin / User roles with protected routes (frontend + backend)
- 📊 Dashboard with live inventory statistics
- 📦 Full product management: add, edit, delete, search, filter by category, sort
- 🚨 Automatic low-stock alerts (configurable threshold per product)
- 🏭 Supplier management (CRUD)
- 🌍 47 realistic seeded products across luxury watches, jewellery, fashion,
  skincare, makeup, cars, electronics, gourmet food, home goods, sports —
  plus a "Local Heritage" category with authentic Nepali products
  (pashmina, Ilam tea, khukuri, thangka art, Dhaka topi, silver filigree jewellery)
- 🔎 Advanced search across name, SKU, and description
- 📋 Full stock movement history (stock in / stock out) per product and globally
- 👥 Admin-only user management (promote/demote, delete)
- 🧾 Dedicated product & supplier detail views
- 📱 Responsive layout for mobile and desktop
- ⚙️ Clean REST API under `/api/*`
- 🗄️ Database auto-initializes on first run — nothing to configure
- ❌ Centralized error handling with clear messages
- 🔒 `.env` based configuration (JWT secret, port)

## Project Structure

```
trackify/
├── backend/
│   ├── server.js          # Express app entrypoint
│   ├── db.js               # JSON file read/write helpers
│   ├── seed.js              # Auto-seeds demo data on first run
│   ├── data/                 # JSON "database" files (auto-created)
│   ├── middleware/auth.js     # JWT verification + admin guard
│   └── routes/
│       ├── auth.js             # register / login / me
│       ├── products.js          # product CRUD + search/filter
│       ├── suppliers.js          # supplier CRUD
│       ├── categories.js          # category list
│       ├── stockMovements.js       # stock in/out + history
│       ├── users.js                 # admin user management
│       └── stats.js                  # dashboard stats
├── frontend/
│   ├── index.html          # dashboard
│   ├── products.html        # product catalog (search/filter/CRUD)
│   ├── product.html          # product detail + stock movements
│   ├── suppliers.html         # supplier management
│   ├── movements.html          # global stock history
│   ├── users.html                # admin user management
│   ├── login.html / register.html
│   ├── css/style.css
│   └── js/ (api.js, shell.js)
├── package.json
└── .env
```

## Resetting the Data

Delete the `backend/data/` folder and restart the server — it will
regenerate fresh demo data automatically.

## Notes

- Change `JWT_SECRET` in `.env` before deploying anywhere public.
- The JSON file database is great for demos and small teams. For heavier
  production use, swap `backend/db.js` for a real database (e.g. Postgres) —
  the route files only talk to `readTable`/`writeTable`, so the change is isolated.
