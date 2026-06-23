# Icónico — Tienda online de café de especialidad

> Specialty Coffee, Made Simple.

Icónico es una tienda online para una marca de café de especialidad mexicana. Vende café, gestiona suscripciones mensuales, y tiene un programa de lealtad de 10 niveles llamado **"El programa Icónico"** con sistema dual de puntos (rango + cashback canjeable).

Esta versión del proyecto está en **modo mockup completo**: todas las pantallas de las 17 historias de usuario están implementadas en frontend puro, con datos simulados en `localStorage`. No hay backend, no hay Supabase, no hay Stripe. Sirve para validar UX antes de invertir en implementación real.

---

## Tabla de contenidos

1. [Stack y versiones](#stack-y-versiones)
2. [Setup](#setup)
3. [Comandos](#comandos)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Páginas disponibles](#páginas-disponibles)
6. [Cómo funciona el modo mock](#cómo-funciona-el-modo-mock)
7. [Design system](#design-system)
8. [Sistema dual de puntos](#sistema-dual-de-puntos)
9. [Patrones de arquitectura](#patrones-de-arquitectura)
10. [Cómo leer el código](#cómo-leer-el-código)
11. [Documentación adicional](#documentación-adicional)
12. [Roadmap hacia backend real](#roadmap-hacia-backend-real)

---

## Stack y versiones

### Runtime y package manager

| Tool | Versión | Notas |
|---|---|---|
| **Bun** | 1.3.13 | Reemplaza npm/node. Usar `bun` para TODO (instalar, correr, build, test). |
| **Node** | 26.3.0 | Solo referencia; no se usa directamente. |

### Framework y dependencias principales

| Dep | Versión | Para qué se usa |
|---|---|---|
| `astro` | 6.4.8 | Framework principal. Genera páginas estáticas + soporta React islands. |
| `@astrojs/react` | 5.0.7 | Integración de React en Astro. |
| `react` | 19.2.7 | Runtime de los React islands interactivos. |
| `react-dom` | 19.2.7 | DOM renderer. |
| `tailwindcss` | 4.3.1 | Utility-first CSS. v4 cambia el approach: `@theme` en CSS, no más `tailwind.config.js`. |
| `@tailwindcss/vite` | 4.3.1 | Plugin de Vite que procesa Tailwind. |
| `nanostores` | 1.3.0 | State management atómico (286 bytes, tree-shakable). |
| `@nanostores/react` | 1.1.0 | Hook `useStore()` para React. |
| `@types/react` | 19.2.17 | Types de React. |
| `@types/react-dom` | 19.2.3 | Types de ReactDOM. |

### Por qué este stack

- **Astro + React islands**: páginas estáticas por default (cero JS), React solo donde hay interactividad. Mejor performance que SPA pura.
- **nanostores** en vez de Redux/Zustand: 286 bytes, no necesita Provider, tree-shakeable, compartido entre islands via `localStorage`.
- **Tailwind v4**: setup más simple que v3, sin `tailwind.config.js`, todo via `@theme` en CSS.
- **Bun** en vez de npm/node: 3-5x más rápido en install + scripts, drop-in replacement.

---

## Setup

```bash
# 1. Clonar / descargar el proyecto
cd IconicoCafe2

# 2. Instalar dependencias (usa bun, NO npm)
bun install

# 3. Levantar el dev server
bun run dev
# → abre http://localhost:4321
```

**Importante:** todo se corre con `bun`, nunca con `npm` ni `node`. El proyecto está configurado para Bun.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `bun run dev` | Inicia el dev server en `http://localhost:4321` con HMR. |
| `bun run build` | Compila el sitio a `./dist/` (12 páginas estáticas). |
| `bun run preview` | Sirve el build de producción localmente para verificar. |
| `bunx astro check` | Type-check de todo el proyecto. |

---

## Estructura del proyecto

```
IconicoCafe2/
├── docs/                          ← Documentación del proyecto
│   ├── ARCHITECTURE.md            ← Patrones de componentes Astro + React
│   └── PATTERNS.md                ← Patrones de datos con nanostores
│
├── public/                        ← Assets estáticos servidos tal cual
│
├── design-system/
│   └── MASTER.md                  ← Brand identity, colores, tipografía, anti-patterns
│
├── src/
│   ├── assets/                    ← Assets importados en el código
│   │
│   ├── components/                ← Componentes (Astro .astro + React .tsx)
│   │   ├── admin/                 ← /admin/* (mock CRUD)
│   │   │   ├── AccessGate.tsx     ← Bloquea si no sos admin
│   │   │   ├── ProductsAdmin.tsx  ← HU-5
│   │   │   ├── RanksAdmin.tsx     ← HU-6
│   │   │   └── RedeemablesAdmin.tsx ← HU-17
│   │   │
│   │   ├── cuenta/                ← /cuenta/* (área de usuario)
│   │   │   ├── AccountLayout.tsx  ← Sidebar compartido
│   │   │   ├── DashboardApp.tsx   ← HU-3, HU-4, HU-7
│   │   │   ├── OrdersApp.tsx      ← HU-8
│   │   │   ├── ProfileApp.tsx     ← HU-10
│   │   │   └── RedeemApp.tsx      ← HU-13
│   │   │
│   │   ├── dev/                   ← /dev/* (herramientas de preview)
│   │   │   └── EmailGallery.tsx   ← 11 emails transaccionales
│   │   │
│   │   ├── shop/                  ← Tienda principal
│   │   │   ├── ShopApp.tsx        ← Island principal (modo explorador/experto)
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductRow.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── CartIcon.tsx
│   │   │   ├── CartDrawer.tsx     ← Carrito lateral
│   │   │   ├── FreeShippingBar.tsx ← HU-14
│   │   │   ├── FilterBar.tsx
│   │   │   ├── ShopHeader.tsx
│   │   │   ├── ShopNav.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── types.ts
│   │   │   └── store/
│   │   │       ├── cart.ts        ← Store del carrito + localStorage
│   │   │       └── filters.ts     ← Store de filtros
│   │   │
│   │   ├── CheckoutApp.tsx        ← HU-1, HU-16 (checkout guest)
│   │   ├── LoginApp.tsx           ← HU-2, HU-9 (magic link)
│   │   ├── ProfileSwitcher.tsx    ← Dropdown flotante (3 perfiles mock)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Products.astro
│   │   ├── Testimonials.astro
│   │   └── ContactForm.astro
│   │
│   ├── data/
│   │   └── products/              ← Content Collection (5 productos .json)
│   │
│   ├── layouts/
│   │   └── Layout.astro           ← HTML base, fonts, ProfileSwitcher
│   │
│   ├── mocks/                     ← Datos mockeados
│   │   ├── types.ts               ← Tipos del dominio mock
│   │   ├── profiles.ts            ← 3 perfiles precargados
│   │   ├── ranks.ts               ← 10 rangos del programa
│   │   ├── redeemables.ts         ← 5 productos canjeables
│   │   └── session.ts             ← Nanostore del perfil activo
│   │
│   ├── pages/                     ← Rutas = archivos
│   │   ├── index.astro            ← Landing
│   │   ├── tienda.astro           ← /tienda
│   │   ├── checkout.astro         ← /checkout (HU-1, HU-16)
│   │   ├── auth/
│   │   │   └── login.astro        ← /auth/login (HU-2, HU-9)
│   │   ├── cuenta/
│   │   │   ├── index.astro        ← /cuenta (HU-3, HU-4, HU-7)
│   │   │   ├── pedidos.astro      ← /cuenta/pedidos (HU-8)
│   │   │   ├── perfil.astro       ← /cuenta/perfil (HU-10)
│   │   │   └── canjear.astro      ← /cuenta/canjear (HU-13)
│   │   ├── admin/
│   │   │   ├── productos.astro    ← /admin/productos (HU-5)
│   │   │   ├── rangos.astro       ← /admin/rangos (HU-6)
│   │   │   └── canjeables.astro   ← /admin/canjeables (HU-17)
│   │   ├── dev/
│   │   │   └── emails.astro       ← /dev/emails (HU-11, HU-12, HU-15)
│   │   └── api/
│   │       └── contact.ts         ← POST /api/contact (handler)
│   │
│   ├── content.config.ts          ← Content Collections (products)
│   └── styles/
│       └── global.css             ← @theme + modo experto inversion
│
├── astro.config.mjs               ← Config de Astro + Tailwind v4
├── tsconfig.json                  ← Extends astro/tsconfigs/strict
├── package.json                   ← Deps + scripts
├── AGENTS.md                      ← Instrucciones del proyecto
├── README.md                      ← Este archivo
└── docs/
    ├── ARCHITECTURE.md            ← Patrones de componentes
    └── PATTERNS.md                ← Patrones de datos
```

---

## Páginas disponibles

### Públicas

| URL | Qué ves | HUs |
|---|---|---|
| `/` | Landing con hero, productos, testimonios, contacto. | — |
| `/tienda` | Tienda con modo Explorador (cards) / Experto (lista). | — |
| `/checkout` | Checkout guest con cálculo de envío por CP. | HU-1, HU-16 |
| `/auth/login` | Login con magic link + Google OAuth. | HU-2, HU-9 |

### Área de cuenta (requiere perfil logueado)

| URL | Qué ves | HUs |
|---|---|---|
| `/cuenta` | Dashboard con rango, puntos, suscripción. | HU-3, HU-4, HU-7 |
| `/cuenta/pedidos` | Historial con filtros. | HU-8 |
| `/cuenta/perfil` | Editar datos + dirección. | HU-10 |
| `/cuenta/canjear` | Catálogo canjeable + modal. | HU-13 |

### Admin (requiere perfil admin)

| URL | Qué ves | HUs |
|---|---|---|
| `/admin/productos` | CRUD del catálogo normal. | HU-5 |
| `/admin/rangos` | Editor de los 10 rangos. | HU-6 |
| `/admin/canjeables` | CRUD de productos canjeables. | HU-17 |

### Dev (herramientas de preview)

| URL | Qué ves | HUs |
|---|---|---|
| `/dev/emails` | Galería de los 11 emails transaccionales. | HU-11, HU-12, HU-15 + 8 más |

---

## Cómo funciona el modo mock

Todas las páginas autenticadas (cuenta, admin) y la tienda tienen un **switcher flotante** en la esquina superior derecha que te deja alternar entre 3 perfiles precargados:

| Perfil | Datos |
|---|---|
| **Visitante** | Sin cuenta, sin puntos. Para probar flujos de guest. |
| **María (Catador)** | 1,200 pts rango, 850 pts canjeables, suscripción activa, 3 pedidos. |
| **Diego (Icónico · admin)** | 25,000 pts rango, 2,400 pts canjeables, 12 pedidos, **es admin** (puede entrar a /admin). |

El switcher persiste el perfil elegido en `localStorage` con la key `iconico-mock-profile`.

### Qué se persiste vs qué no

| Dato | Persiste | Dónde |
|---|---|---|
| Perfil activo mock | Sí (localStorage) | `src/mocks/session.ts` |
| Carrito de compras | Sí (localStorage) | `src/components/shop/store/cart.ts` |
| Cambios en el perfil mock (canjes, suscripción pausada) | No (vive solo en memoria) | Al recargar vuelve al estado original del mock |
| Filtros de la tienda | No (al volver a entrar) | `src/components/shop/store/filters.ts` |

### Cómo navegar la app

1. Abrí `/` (landing).
2. Hacé click en "Tienda" → `/tienda`. Probá modo Explorador / Experto.
3. Agregá productos al carrito. Abrí el carrito con el ícono de bolsa.
4. Andá a "Finalizar compra" → `/checkout`. Probá meter un CP de 5 dígitos para ver el cálculo de envío en vivo (HU-16).
5. Volvé a `/auth/login` para ver el flow de magic link.
6. Cambiá a "María (Catador)" con el switcher arriba a la derecha.
7. Andá a `/cuenta` → ves el dashboard con su rango, puntos, suscripción.
8. Probá `/cuenta/canjear` y canjeá un producto.
9. Cambiá a "Diego (Icónico · admin)" con el switcher.
10. Andá a `/admin/productos` → ves el CRUD completo.
11. Andá a `/admin/rangos` → ves los 10 rangos editables.
12. Andá a `/dev/emails` → ves los 11 emails transaccionales con datos de Diego.

---

## Design system

El design system completo está en `design-system/MASTER.md`. Lo esencial:

### Colores

| Token | Hex | Uso |
|---|---|---|
| `--color-cream` | `#F3EEE6` | Background principal (80%) |
| `--color-sand` | `#E4D8C8` | Backgrounds secundarios |
| `--color-charcoal` | `#1F1F1D` | Texto principal |
| `--color-navy` | `#1F2B38` | Acentos premium (10%) |
| `--color-coffee` | `#4A3525` | Iconografía sensorial (5%) |
| `--color-sage` | `#6B5E4A` | Detalles naturales (5%) |

Definidos en `src/styles/global.css` con `@theme` (Tailwind v4 syntax).

### Tipografía

- **Headings:** Playfair Display (serif, editorial)
- **Body:** Inter (sans, clean)

Cargadas via Google Fonts en `Layout.astro`.

### Anti-patterns (NO hacer)

- Emojis como iconos (usar Lucide SVG inline)
- `cursor:pointer` faltante
- Hovers que cambian layout
- Contraste < 4.5:1
- Cambios instantáneos (siempre transition 150-300ms)
- Dark mode global (el proyecto es light-only, excepto "Modo Experto" en /tienda)
- Gradientes AI purple/pink
- Colores neón

### Modo Experto (dark mode invertido en /tienda)

Cuando activás "Modo Experto" en la tienda, el root del shop se pone dark navy (`#1F3829`) y todos los colores se invierten via CSS overrides. La implementación vive en `src/styles/global.css` líneas 33-342. Usa el attribute selector `.shop-root[data-mode="experto"]` con `!important` para ganarle a Tailwind.

---

## Sistema dual de puntos

El proyecto implementa exactamente el sistema descrito en `ProductRequirements.md §3`. Lo resumo:

### Dos saldos independientes

| Saldo | Para qué | Reglas |
|---|---|---|
| **Puntos de rango** | Subir de nivel (10 rangos, vitalicio) | Suma con cada compra × multiplicador. Nunca expira. Se pierde por inactividad. |
| **Puntos canjeables** | Cashback para canjear productos exclusivos | 10% base × multiplicador. 1 punto = $0.10 MXN. Expiran 12 meses después. |

### Fórmula por compra

```
rank_points_earned    = floor(subtotal × multiplier)
redeemable_earned     = floor(subtotal × 0.10 × multiplier)
cash_value            = redeemable_earned × $0.10
```

### 10 rangos

| # | Rango | Pts | Mult | Cash | Envío |
|---|---|---|---|---|---|
| 1 | Grano | 0 | 1.00x | 10% | — |
| 2 | Tueste | 200 | 1.05x | 10.5% | — |
| 3 | Cata | 500 | 1.10x | 11% | — |
| 4 | Barista | 1,000 | 1.15x | 11.5% | — |
| 5 | **Catador** | 1,800 | 1.20x | 12% | Std |
| 6 | Maestro | 3,000 | 1.30x | 13% | Std |
| 7 | Embajador | 5,000 | 1.40x | 14% | Std |
| 8 | Sommelier | 8,000 | 1.50x | 15% | Std |
| 9 | Leyenda | 12,000 | 1.75x | 17.5% | Ambos |
| 10 | **Icónico** | 20,000 | 2.00x | 20% | Ambos |

### Inactividad

| Tiempo sin comprar | Efecto |
|---|---|
| < 6 meses | Todo igual. |
| ≥ 6 meses (sin suscripción) | Baja 1 nivel. |
| ≥ 12 meses (sin suscripción) | Baja a Grano + expiran canjeables. |
| **Suscripción activa** | **Rango congelado.** |

Pre-aviso 30 días antes de cualquier downgrade.

### Catálogo canjeable (5 productos seed)

| Producto | Costo | Valor | Rango mín |
|---|---|---|---|
| Catación virtual | 500 pts | $50 | Grano |
| Microlote especial 100g | 1,000 pts | $100 | Tueste |
| Pack regalo premium | 800 pts | $80 | Tueste |
| Catación presencial | 2,000 pts | $200 | Cata |
| Edición Icónico anual 250g | 5,000 pts | $500 | Icónico |

---

## Patrones de arquitectura

Documentados en detalle en `docs/ARCHITECTURE.md` y `docs/PATTERNS.md`. Resumen ultra-corto:

### Astro components vs React islands

| Necesidad | Usar |
|---|---|
| Contenido estático, sin handlers | `.astro` puro (cero JS) |
| Interactividad inmediata visible al cargar | React con `client:load` |
| Interactividad bajo el fold | React con `client:visible` |
| Interactividad que depende de `localStorage` / `window` | React con `client:only="react"` |
| State compartido entre "componentes" | **1 island grande** que los envuelva a todos, NO múltiples islands |

### Cliente directives

```astro
<CartDrawer client:load />            <!-- inmediato, prioriza TTI -->
<Newsletter client:idle />            <!-- espera requestIdleCallback -->
<ProductCard client:visible />        <!-- cuando entra al viewport -->
<MobileMenu client:media="(max-width: 768px)" />  <!-- solo en mobile -->
<CheckoutApp client:only="react" />   <!-- sin SSR, fallback para loading -->
```

### nanostores patterns

- **Naming:** `$nombre` para stores, `camelCase` para archivos.
- **SSR-safe:** `loadInitial()` con `typeof window === 'undefined'`.
- **Persistencia:** `if (typeof window !== 'undefined') $store.subscribe(...)`.
- **Leer en React:** `useStore($store)`, NUNCA `$store.get()` en JSX.
- **Lógica en stores:** `addToCart`, `redeemPoints` van en el store, no en el componente.
- **Derivados:** `computed($a, $b, (a, b) => ...)`, no recalcular en cada render.

---

## Cómo leer el código

Si querés entender el proyecto de punta a punta, este es el orden recomendado:

### Día 1: lo básico

1. **`package.json`** — qué dependencias hay y para qué.
2. **`astro.config.mjs`** — config de Astro + Tailwind v4.
3. **`tsconfig.json`** — strict mode + React JSX.
4. **`src/styles/global.css`** — design tokens + modo experto.
5. **`src/layouts/Layout.astro`** — HTML base, fonts, dónde se monta el cart/profile switcher.

### Día 2: la tienda

6. **`src/pages/tienda.astro`** — cómo se monta el shop.
7. **`src/components/shop/ShopApp.tsx`** — el island principal de la tienda.
8. **`src/components/shop/store/cart.ts`** — patrón de store + localStorage (el más completo del proyecto).
9. **`src/components/shop/store/filters.ts`** — store simple (atom).
10. **`src/components/shop/CartDrawer.tsx`** — cómo se lee el store con `useStore()`.
11. **`src/components/shop/FreeShippingBar.tsx`** — componente que cruza 2 stores (cart + profile).

### Día 3: el sistema de puntos

12. **`src/mocks/ranks.ts`** — los 10 rangos como data.
13. **`src/mocks/profiles.ts`** — los 3 perfiles precargados.
14. **`src/mocks/session.ts`** — nanostore del perfil activo.
15. **`src/mocks/redeemables.ts`** — catálogo canjeable.

### Día 4: las pantallas de cuenta

16. **`src/components/cuenta/AccountLayout.tsx`** — sidebar compartido.
17. **`src/components/cuenta/DashboardApp.tsx`** — la pantalla más completa (rango, puntos, suscripción, modals).
18. **`src/components/cuenta/RedeemApp.tsx`** — flujo de canje con modal.
19. **`src/components/cuenta/OrdersApp.tsx`** y **`ProfileApp.tsx`**.

### Día 5: admin y emails

20. **`src/components/admin/AccessGate.tsx`** — patrón de control de acceso.
21. **`src/components/admin/ProductsAdmin.tsx`** — CRUD con modal de edición.
22. **`src/components/admin/RanksAdmin.tsx`** — editor inline.
23. **`src/components/dev/EmailGallery.tsx`** — switch entre 11 emails renderizados con datos del perfil.

### Día 6: checkout y auth

24. **`src/components/CheckoutApp.tsx`** — formulario completo con cálculo de envío en vivo.
25. **`src/components/LoginApp.tsx`** — flow de magic link en 3 pasos.

### Y al final:

26. **`docs/ARCHITECTURE.md`** — patrones oficiales documentados.
27. **`docs/PATTERNS.md`** — patrones de datos oficiales documentados.

---

## Documentación adicional

| Doc | Para qué |
|---|---|
| `AGENTS.md` | Instrucciones operativas del proyecto (comandos, identidad de marca). |
| `design-system/MASTER.md` | Brand identity, colores, tipografía, anti-patterns. |
| `docs/ARCHITECTURE.md` | 20 patrones de componentes Astro + React, con fuentes a docs oficiales. |
| `docs/PATTERNS.md` | 20 patrones de datos con nanostores, con fuentes a docs oficiales. |
| `ProductRequirements.md` | PRD completo bilingüe (ES/EN) con las 17 HUs y acceptance criteria. |
| `BackendPlan.md` | Plan técnico para implementar el backend real (Supabase + Stripe + Vercel). |
| `PropuestaFuncionalIconicoCafe.md` | Propuesta de negocio no-técnica (para stakeholders). |

---

## Roadmap hacia backend real

Actualmente todo es frontend con mocks. Para hacerlo real:

1. **Auth:** Supabase Auth (magic link nativo, Google OAuth, sessions).
2. **DB:** Supabase Postgres con schema de `users`, `orders`, `points_transactions`, `ranks`, `redeemable_products`, `shipping_zones`.
3. **Pagos:** Stripe (Cards, Apple/Google Pay, SPEI, OXXO, MSI 3/6/12).
4. **Suscripciones:** Stripe Subscriptions + Customer Portal.
5. **Storage:** Supabase Storage para imágenes de productos.
6. **Emails:** Resend (11 templates documentados en `/dev/emails`).
7. **Cron jobs:** Vercel Cron (rank-downgrade, points-expiry, inactivity warnings).

El plan técnico completo está en `BackendPlan.md` (14 pasos secuenciales, 4-6 semanas de desarrollo).

Los docs `docs/ARCHITECTURE.md` y `docs/PATTERNS.md` ya están escritos para que la transición sea limpia: los patrones documentados aplican igual con o sin backend.

---

## Resumen técnico en 1 minuto

- **12 páginas Astro estáticas** (4 originales + 8 nuevas de mockups).
- **0 endpoints activos** (solo el stub `/api/contact`).
- **3 React islands** que comparten state via `nanostores` + `localStorage`.
- **3 perfiles mockeados** que se switchean en vivo sin refresh.
- **17 HUs mockupeadas** con datos realistas (precios en centavos, MXN, CP mexicano, fechas).
- **2 archivos de docs** con 40 patrones oficiales de Astro 6 + React 19 + nanostores 1.3 + Tailwind v4.
- **1 design system** minimalista (cream/navy/charcoal, Playfair + Inter).
- **0 dependencias de runtime adicionales** vs la base Astro + React.

Stack: Astro 6.4 + React 19 + Tailwind v4 + nanostores 1.3 + Bun 1.3. Build: ~1.5s, 12 páginas, 0 errores.
