# Backend Plan — Icónico Ecommerce

> Version: 1.1 · Date: Jun 19, 2026 · Status: Proposal (refined)

---

## 1. Executive Summary

- **Context:** Specialty coffee brand (Icónico) building an online store with a dual loyalty system (rank points + redeemable cashback), subscriptions, guest checkout, and national shipping.
- **Goal:** Enable user accounts, points/ranks, subscriptions, and a complete checkout flow while preserving the current Astro 6 + React Islands + Tailwind v4 frontend.
- **Key decision:** Astro monolith (server) + Supabase (DB / Auth / Storage) + Stripe (payments / subscriptions) + Resend (emails) + Vercel (hosting).
- **Currency:** MXN only.
- **Market:** Mexico (national coverage, SPEI, OXXO, MSI) + international cards.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend + Backend | **Astro 6** (`output: 'server'`) | SSR pages, Actions, middleware, cookies. |
| Interactivity | **React 19** (islands) | Cart, filters, modals, mode toggle. |
| Client state | **Nanostores** | Cart, filters, shop mode. |
| Styling | **Tailwind v4** | Design system tokens. |
| Validation | **Zod** (via Astro Actions) | Type-safe input validation. |
| Sessions | **Astro cookies** (native) | HttpOnly session cookies. |
| Database | **Supabase Postgres** | Users, products, orders, points, subscriptions, shipping, redeemable catalog. |
| Auth | **Supabase Auth** | Magic link, Google OAuth. |
| File storage | **Supabase Storage** | Product images. |
| Payments | **Stripe** | Cards, Apple Pay, Google Pay, SPEI, OXXO, MSI, Subscriptions. |
| Email | **Resend** | Transactional emails (React Email templates). |
| Hosting | **Vercel** (Hobby) | Deploy, cron jobs, previews. |
| Package manager | **Bun** | Already in use. |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────┐
│  FRONTEND + BACKEND (single deploy)             │
│  Astro 6 (output: 'server')                     │
│   • Astro Actions (typed backend functions)     │
│   • Astro Middleware (route protection)         │
│   • Astro Cookies (sessions)                    │
│   • React 19 islands (interactive UI)           │
└─────────────────────────────────────────────────┘
              │                       │
              ▼                       ▼
   ┌──────────────────┐     ┌──────────────────┐
   │    Supabase      │     │     Stripe        │
   │  • Postgres DB   │     │  • Subscriptions  │
   │  • Auth          │     │  • Payment Intents│
   │  • Storage       │     │  • Webhooks       │
   │  • RLS           │     │  • Customer Portal│
   └──────────────────┘     └──────────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │     Resend        │
                              │  Transactional    │
                              │  emails           │
                              └──────────────────┘
```

### Key Patterns

- **Astro Actions** (`src/actions/index.ts`): type-safe server functions with automatic Zod validation.
- **Astro Cookies** + **Middleware**: session management without third-party libraries.
- **Supabase client** (`src/lib/supabase.ts`): one server-side client (service role for admin) + one per-request client (user JWT for RLS).
- **Stripe Webhooks** at `/api/stripe/webhook`: single endpoint for all payment events.
- **Vercel Cron** (daily): runs inactivity check (downgrade rank, expire points) and shipping notifications.

---

## 4. File Structure

```
src/
├── actions/
│   ├── index.ts            # registers all actions
│   ├── auth.ts             # register, login, magicLink, logout
│   ├── cart.ts             # addToCart, updateCart
│   ├── checkout.ts         # createCheckoutSession, calculateShipping
│   ├── products.ts         # listProducts, getProduct
│   ├── user.ts             # getMyProfile, getMyPoints, getMyOrders, getMyRedeemable
│   ├── subscription.ts     # cancel, pause, resume
│   ├── redeem.ts           # redeemPoints(productId), getRedeemCatalog
│   └── admin.ts            # CRUD products, ranks, redeemable catalog
├── lib/
│   ├── supabase.ts         # Supabase clients (server + admin)
│   ├── stripe.ts           # Stripe SDK client
│   ├── auth.ts             # session helpers (getSession, requireAuth)
│   ├── points.ts           # dual points + rank calculation + inactivity logic
│   ├── shipping.ts         # shipping cost calculator + free-shipping rules
│   ├── email.ts            # Resend client + templates
│   └── env.ts              # typed env vars (Astro.env)
├── pages/
│   ├── api/
│   │   ├── stripe/
│   │   │   └── webhook.ts  # Stripe webhook handler
│   ├── auth/
│   │   ├── login.astro
│   │   ├── register.astro
│   │   └── callback.astro
│   ├── cuenta/
│   │   ├── index.astro     # profile + rank + dual points + shipping addr
│   │   ├── pedidos.astro   # order history
│   │   ├── perfil.astro    # edit profile + addresses
│   │   └── canjear.astro   # redeemable catalog
│   ├── admin/
│   │   ├── index.astro
│   │   ├── productos.astro
│   │   ├── rangos.astro
│   │   ├── canjeables.astro # CRUD redeemable catalog
│   │   └── pedidos.astro
│   └── tienda.astro
├── middleware.ts
└── content.config.ts
```

---

## 5. Database Schema (Postgres / Supabase)

```sql
-- ============== USERS ==============
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  address JSONB, -- { street, city, state, zip, country }
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  -- DUAL POINTS SYSTEM
  rank_points INT DEFAULT 0,           -- vitalicio, no expira, solo suma
  redeemable_points INT DEFAULT 0,     -- cashback 10% × multiplier, expira 12 meses
  current_rank TEXT,
  -- INACTIVITY
  last_purchase_at TIMESTAMPTZ,        -- para calcular inactividad
  rank_downgrade_count INT DEFAULT 0,  -- cuántos downgrades ha tenido
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============== RANKS ==============
CREATE TABLE ranks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                  -- 'Grano', 'Tueste', ..., 'Icónico'
  slug TEXT UNIQUE NOT NULL,
  min_points INT NOT NULL,
  multiplier DECIMAL(3,2) NOT NULL,    -- ej 1.30 = 1.30x puntos
  cashback_pct DECIMAL(4,2) NOT NULL,  -- ej 13.00 = 13% cashback
  free_shipping BOOLEAN DEFAULT false, -- rango Catador+ tiene envío gratis
  perks TEXT,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============== PRODUCTS ==============
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('best-seller', 'pack', 'subscription')),
  type TEXT NOT NULL CHECK (type IN ('blend', 'single-origin', 'decaf', 'microlot', 'special')),
  price NUMERIC(10,2) NOT NULL,
  subscription_price NUMERIC(10,2),
  unit TEXT NOT NULL,
  description TEXT,
  specs JSONB NOT NULL,
  tags TEXT[],
  image_url TEXT,
  badge TEXT,
  stock INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  base_points INT,                     -- puntos base antes del multiplicador (opcional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============== REDEEMABLE CATALOG (productos exclusivos por puntos) ==============
CREATE TABLE redeemable_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  points_cost INT NOT NULL,             -- ej 1000 = 1000 pts
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  min_rank_required TEXT,               -- opcional: rango mínimo para canjearlo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============== ORDERS ==============
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  guest_email TEXT,
  guest_info JSONB,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  shipping_address JSONB,               -- { street, city, state, zip, country }
  shipping_method TEXT,                 -- 'standard' | 'express' | 'free'
  currency TEXT DEFAULT 'MXN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  payment_method TEXT,
  rank_points_earned INT DEFAULT 0,
  redeemable_points_earned INT DEFAULT 0,
  rank_at_purchase TEXT,                -- rango al momento de comprar (snapshot)
  multiplier_applied DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- ============== POINTS TRANSACTIONS (audit log) ==============
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  type TEXT NOT NULL CHECK (type IN (
    'rank_earned',          -- puntos de rango sumados
    'redeemable_earned',    -- cashback ganado
    'redeemed',             -- cliente canjeó puntos por un producto
    'expired',              -- puntos canjeables expiraron
    'rank_downgrade',       -- perdió puntos/rango por inactividad
    'adjustment'            -- ajuste manual del admin
  )),
  amount INT NOT NULL,                  -- positivo o negativo
  balance_after INT,                    -- saldo resultante
  description TEXT,
  expires_at TIMESTAMPTZ,               -- solo para redeemable_earned
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_points_tx_expires ON points_transactions(expires_at) WHERE expires_at IS NOT NULL;

-- ============== SUBSCRIPTIONS ==============
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============== SHIPPING ZONES ==============
CREATE TABLE shipping_zones (
  id SERIAL PRIMARY KEY,
  country TEXT DEFAULT 'MX',
  cp_range_start TEXT,
  cp_range_end TEXT,
  standard_cost NUMERIC(10,2) DEFAULT 99.00,
  express_cost NUMERIC(10,2) DEFAULT 149.00,
  free_shipping_min NUMERIC(10,2) DEFAULT 1900.00,
  estimated_days TEXT
);

-- ============== INDEXES ==============
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_points_tx_user_id ON points_transactions(user_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_users_last_purchase ON users(last_purchase_at);
```

### Row Level Security (RLS)

- `users`: users SELECT/UPDATE own row.
- `orders`: users SELECT own; admin SELECT all.
- `points_transactions`: users SELECT own; service role INSERT.
- `subscriptions`: users SELECT own; service role manage.
- `products`: public SELECT where `is_active = true`; admin manage.
- `redeemable_products`: public SELECT where `is_active = true`; admin manage.
- `ranks`: public SELECT; admin manage.
- `shipping_zones`: public SELECT; admin manage.

---

## 6. User Flows

### Flow A — Guest Checkout

1. User adds products to cart (localStorage + Nanostores).
2. Clicks "Finalizar compra" → modal collects email + name + address + CP.
3. Action `calculateShipping(cp)` → returns standard/express cost + ETA.
4. UI shows opción estándar vs express. Si subtotal ≥ $1,900 → envío gratis.
5. Action `createCheckoutSession`:
   - Creates `orders` row + `order_items`.
   - Creates Stripe Checkout Session (MXN).
6. Redirects to Stripe Checkout (Card / Apple Pay / Google Pay / SPEI / OXXO / MSI).
7. Webhook `checkout.session.completed`:
   - Marks order `paid`.
   - Calculates dual points using `users.current_rank` at moment of purchase.
   - If `guest_email` matches existing user → assigns points.
   - If not → creates user, holds points until first login.
   - Sends confirmation email with **post-purchase upsell**: "Si te hubieras registrado, habrías ganado X puntos."
8. Success page: "Compra confirmada. Revisa tu email. [Crea cuenta para no perder tus puntos]."

### Flow B — Registration

1. User clicks "Crear cuenta" → `/auth/register` or magic link from post-purchase email.
2. Action `register(email)` → Supabase Auth magic link.
3. Click email → `/auth/callback?token=...` → session cookie + redirect to `/cuenta`.
4. If first login, attach pending points to the user.

### Flow C — Dual Points Update (after payment)

```
function calculateOrderPoints(order):
  user = getUser(order.user_id)
  rank = getRank(user.current_rank)
  multiplier = rank.multiplier
  cashback_pct = rank.cashback_pct

  rank_points_earned    = floor(order.subtotal × multiplier)
  redeemable_earned     = floor(order.subtotal × 0.10 × multiplier)
  cash_value            = redeemable_earned × $0.10

  return { rank_points_earned, redeemable_earned, cash_value }

function applyPoints(user, points):
  new_rank_points = user.rank_points + points.rank_points_earned
  new_redeemable = user.redeemable_points + points.redeemable_earned
  new_rank = recalculateRank(new_rank_points)

  if new_rank != user.current_rank:
    sendRankUpEmail(user, new_rank)
  else:
    sendPointsEarnedEmail(user, points)

  INSERT points_transactions (rank_earned, expires_at = now + 12 months)
  UPDATE users SET rank_points, redeemable_points, current_rank, last_purchase_at
```

### Flow D — Redeeming Points

1. User visits `/cuenta/canjear`.
2. Sees `redeemable_products` catalog with their `redeemable_points` balance.
3. Selects a product → action `redeemPoints(productId)`:
   - Check user has enough `redeemable_points` AND meets `min_rank_required`.
   - Decrement `redeemable_points`.
   - INSERT `points_transactions` with type='redeemed'.
   - Create redeem order (no payment, just a record).
4. Admin fulfills manually (sends product, marks shipped).

### Flow E — Subscription Lifecycle

1. `createSubscription` action → Stripe Subscriptions API.
2. Webhooks: `customer.subscription.created/updated/deleted` → sync `subscriptions` table.
3. `invoice.paid` (renewal) → create order, apply dual points.
4. User manages via Stripe Customer Portal.

### Flow F — Inactivity Downgrade (Vercel Cron, daily)

```
1. Find users WHERE last_purchase_at < now() - 6 months AND has active subscription = false
2. For each:
   a. Downgrade rank by 1 position
   b. If already at rank 1 (Grano), reset rank_points to 0
   c. INSERT points_transactions (rank_downgrade, amount = -X)
   d. Send "Te extrañamos" email
3. Find users WHERE last_purchase_at < now() - 12 months:
   a. Reset redeemable_points to 0
   b. Mark all unexpired points_transactions as expired
   c. If rank > 1, downgrade to Grano
4. Find users WHERE redeemable_points_transactions.expires_at < now():
   a. Decrement redeemable_points by expired amount
   b. Mark transactions as expired
   c. Send "Puntos por expirar" email 30 days before (separate cron)
```

**Exception:** If user has an active subscription (`subscriptions.status = 'active'`), skip downgrade — their rank is "frozen" while subscribed.

---

## 7. Payments (Stripe)

### Methods Accepted (Mexico)

| Method | Type | Notes |
|---|---|---|
| Card (Visa, MC, Amex) | Card | International friendly. |
| Apple Pay | Wallet | One-tap. |
| Google Pay | Wallet | One-tap. |
| **SPEI** | Bank transfer | 10% discount applied as Stripe coupon. |
| OXXO | Voucher | Cash at OXXO stores. |
| Meses sin intereses (MSI) | Installments | 3, 6, 12 months. |

### Stripe Configuration

- Currency: `MXN`.
- Tax: 0% (IVA in v2).
- Subscriptions: monthly, cancel anytime via Customer Portal.
- Coupons: `SPEI10` = 10% off for SPEI payments.

### Webhook Events

- `checkout.session.completed` → mark paid, calculate dual points.
- `customer.subscription.created/updated/deleted` → sync subscriptions.
- `invoice.paid` (renewal) → create order, add points.
- `invoice.payment_failed` → mark `past_due`, notify.

---

## 8. Dual Points & Ranks System

### Two Balances

1. **Puntos de Rango (vitalicio)**
   - Source: `order.subtotal × rank.multiplier`.
   - Used for: rank progression.
   - Never expires.
   - Lost only by inactivity (12 months no purchase) — downgrades 1 level at 6 months.

2. **Puntos Canjeables (cashback)**
   - Source: `floor(order.subtotal × 0.10) × rank.multiplier` (10% base × multiplier).
   - Used for: redeem products in exclusive catalog.
   - 1 point = $0.10 MXN.
   - Expires 12 months after earning.
   - Display: "Ganaste 130 puntos canjeables = $13 MXN en tu próxima redención".

### 10 Ranks (Icónico ladder)

| # | Rank | Min rank_points | Multiplier | Cashback | Free shipping | Perk |
|---|---|---|---|---|---|---|
| 1 | Grano | 0 | 1.00x | 10% | — | Base accumulation |
| 2 | Tueste | 200 | 1.05x | 10.5% | — | Monthly cuppings |
| 3 | Cata | 500 | 1.10x | 11% | — | 5% off packs |
| 4 | Barista | 1,000 | 1.15x | 11.5% | — | Free shipping over $500 |
| 5 | Catador | 1,800 | 1.20x | 12% | ✅ Standard | 10% off subs |
| 6 | Maestro | 3,000 | 1.30x | 13% | ✅ Standard | 1 free cupping/year |
| 7 | Embajador | 5,000 | 1.40x | 14% | ✅ Standard | Early microlot access |
| 8 | Sommelier | 8,000 | 1.50x | 15% | ✅ Standard | Birthday gift |
| 9 | Leyenda | 12,000 | 1.75x | 17.5% | ✅ Both | Free annual limited edition |
| 10 | Icónico | 20,000 | 2.00x | 20% | ✅ Both | Name on yearly bag + all perks |

### Inactivity Rules

- **< 6 months** without purchase: all good.
- **≥ 6 months** without purchase (no active sub): **downgrade 1 rank**.
- **≥ 12 months** without purchase (no active sub): **reset to Grano**, **expire all redeemable points**.
- **Active subscriber**: rank frozen, no downgrade.

### Points Formula

```
rank_points_earned    = floor(order.subtotal × rank.multiplier)
redeemable_earned     = floor(order.subtotal × 0.10 × rank.multiplier)
cash_value            = redeemable_earned × $0.10
```

### Example

```
Order: $1,000 MXN, user is Catador (1.20x, 12% cashback)
- rank_points_earned:    1,000 × 1.20 = 1,200 pts (added to lifetime)
- redeemable_earned:     floor(1,000 × 0.10 × 1.20) = 120 pts ($12 MXN)
- Free shipping:         YES (Catador+)
```

---

## 9. Shipping System

### Zones & Costs (Mexico national)

| Method | Cost | ETA |
|---|---|---|
| Standard | $99 MXN | 3-5 days |
| Express | $149 MXN | 1-2 days |
| **Free** | $0 | Same as selected method |

### Free Shipping Conditions (any of these)

1. **Order subtotal ≥ $1,900 MXN.**
2. **Product is a subscription** (monthly coffee).
3. **Product is a pack** (multi-item bundle).
4. **Customer is rank Catador or higher** (1.20x+) → always free standard.
5. **Customer redeems redeemable points** to pay for shipping (1 point = $0.10 MXN).

### UI Behavior

- **Cart page:** progress bar "Te faltan $X para envío gratis" (or "¡Envío gratis!" if qualified).
- **Checkout:** CP input → live calculation of standard/express cost and ETA via `calculateShipping` action.
- **Order summary:** clear breakdown of subtotal, shipping, total.

### Shipping Zones (DB)

Single national zone for v1. Future: per-state zones with different costs.

---

## 10. Admin Panel

Routes: `/admin/*` (role='admin').

- `/admin/productos` — CRUD products + image upload to Storage.
- `/admin/rangos` — CRUD ranks (name, min_points, multiplier, cashback_pct, free_shipping, perks).
- `/admin/canjeables` — CRUD redeemable catalog (name, description, image, points_cost, stock, min_rank).
- `/admin/pedidos` — view orders (filter by date/status/user), refund action.
- `/admin/subscriptions` — view active subs.
- `/admin/envios` — view shipping zones (v1: single national).

---

## 11. Transactional Emails (Resend)

| Trigger | Template |
|---|---|
| Sign up | `welcome` |
| Order paid (guest) | `order-confirmation-guest` + "create account" upsell |
| Order paid (user) | `order-confirmation` with points earned |
| Rank up | `rank-up` |
| Subscription renewed | `subscription-renewed` |
| Subscription cancelled | `subscription-cancelled` |
| Redeem order placed | `redeem-confirmation` |
| **Inactivity warning (30d before)** | `inactivity-warning` |
| **Inactivity downgrade** | `we-miss-you` |
| **Points expiring (30d before)** | `points-expiring` |
| **Free shipping unlocked** | `free-shipping-unlocked` (cart trigger) |

---

## 12. Cron Jobs (Vercel Cron)

| Schedule | Job | Purpose |
|---|---|---|
| Daily 02:00 | `inactivity-check` | Downgrade inactive users, expire points. |
| Daily 08:00 | `points-expiring-warning` | Email 30d before points expire. |
| Daily 09:00 | `subscription-renewals` | Notify upcoming renewals (3 days before). |
| Hourly | `stripe-webhook-retry` | Check Stripe for missed webhooks. |

---

## 13. Costs

| Service | Plan | Cost |
|---|---|---|
| Vercel | Hobby | $0/month |
| Supabase | Free | $0/month (500MB DB, 1GB Storage, 50k users) |
| Stripe | Standard | 2.9% + $3 MXN per successful charge |
| Resend | Free | $0 (3,000 emails/month, 100/day) |
| Domain | — | ~$12 USD/year |
| **Total initial** | | **$0/month + per-sale commission** |

When scaling: Vercel Pro $20/month + Supabase Pro $25/month = ~$50/month.

---

## 14. Implementation Roadmap

1. **Setup base** — `output: 'server'`, Vercel adapter, Supabase, Stripe, Resend, env vars.
2. **DB schema** — all tables, RLS, seed 10 ranks + initial redeemable products.
3. **Auth** — magic link + Google OAuth, cookies, middleware.
4. **Migrate products** — JSON → Supabase, admin CRUD.
5. **Shipping calculator** — `calculateShipping` action, free-shipping rules engine.
6. **Checkout** — `createCheckoutSession` with shipping + dual points preview.
7. **Webhook handler** — payment success, dual points calculation, emails.
8. **Rank engine** — `recalculateRank`, downgrade logic.
9. **Redeemable catalog** — `/cuenta/canjear`, `redeemPoints` action.
10. **Inactivity cron** — Vercel cron + downgrade/expire logic.
11. **Admin panel** — CRUD products, ranks, redeemable, orders.
12. **Emails** — Resend + React Email templates (all 11 triggers).
13. **Polish** — cart free-shipping progress bar, CP-based shipping calc.
14. **Deploy** — Vercel, env vars, custom domain.

---

## 15. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| SPEI confirmations delayed | Order stays `pending` until webhook; user notified. |
| Webhooks dropped | Stripe auto-retry; idempotency keys on handlers. |
| RLS misconfiguration | E2E permission tests + staging env. |
| Stock overselling | Decrement in DB transaction before Stripe call; rollback on failure. |
| Points expire without notice | Email 30 days before + dashboard banner. |
| Inactivity downgrade feels punitive | Soft messaging ("te extrañamos"), easy to recover with one purchase. |
| Dual point system confuses users | Clear UI separation: "Tu rango" vs "Tus puntos canjeables" with icons. |
| Redeemable catalog stock | Stock field in `redeemable_products`, decrement on redeem. |
| Magic link spam | Supabase rate limiting (3/hour). |

---

## 16. Out of Scope (v1)

- Native mobile app.
- Multi-currency / multi-country.
- Marketplace / multi-vendor.
- Referral program.
- Wishlist / favorites.
- Product reviews.
- CI/CD pipeline (Vercel auto-deploy).
- Per-state shipping zones (single national zone in v1).
- Tax calculation (IVA).
- Multi-language (ES only in v1).
