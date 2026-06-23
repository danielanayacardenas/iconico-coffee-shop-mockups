# Requisitos de Producto — Icónico Ecommerce (v1)
# Product Requirements — Icónico Ecommerce (v1)

> Versión / Version: 1.1 · Fecha / Date: 19 Jun 2026 · Estado / Status: Borrador para revisión / Draft for review

> Este documento está en español e inglés. Las dos versiones son equivalentes.
> This document is in Spanish and English. Both versions are equivalent.

---

## ES — Versión en Español

### 1. Visión

Convertir Icónico en una tienda online que recompense la lealtad con un sistema dual de puntos (rango + cashback canjeable), suscripciones y envíos nacionales, empezando por compras simples y terminando en un programa de 10 niveles llamado **"El programa Icónico"**.

### 2. Usuarios objetivo

- **Coffee lover mexicano** que compra online ocasionalmente.
- **Coffee lover recurrente** (suscripción mensual).
- **Cliente nuevo** que descubre la marca (guest checkout).

### 3. Sistema de puntos dual

#### 3.1 Dos saldos independientes

**Saldo 1 — Puntos de Rango (vitalicio)**
- Suma con cada compra según el multiplicador del rango.
- Solo sirve para subir de rango.
- Nunca expira, nunca se gasta.
- Se pierde solo por inactividad (ver 3.4).

**Saldo 2 — Puntos Canjeables (cashback)**
- 10% base del subtotal × multiplicador del rango.
- Cada punto vale $0.10 MXN fijo.
- Se canjean en un catálogo exclusivo de productos (ver 3.5).
- Expiran 12 meses después de haberse ganado.

#### 3.2 Cálculo por compra

```
Puntos de rango ganados    = floor(subtotal × multiplicador)
Puntos canjeables ganados  = floor(subtotal × 0.10 × multiplicador)
Valor en cash              = puntos_canjeables × $0.10
```

**Ejemplo:** compra de $1,000 MXN siendo Catador (1.20x):
- Puntos de rango: 1,200
- Puntos canjeables: 120 ($12 MXN de cashback)
- Envío gratis (Catador+).

#### 3.3 Tabla de rangos (10 niveles)

| # | Rango | Puntos vitalicios | Multiplicador | Cashback | Envío gratis | Beneficio |
|---|---|---|---|---|---|---|
| 1 | Grano | 0 | 1.00x | 10% | — | Acumulación base. |
| 2 | Tueste | 200 | 1.05x | 10.5% | — | Acceso a catas mensuales. |
| 3 | Cata | 500 | 1.10x | 11% | — | 5% descuento en packs. |
| 4 | Barista | 1,000 | 1.15x | 11.5% | — | Envío gratis desde $500. |
| 5 | Catador | 1,800 | 1.20x | 12% | ✅ Estándar | 10% descuento en suscripciones. |
| 6 | Maestro | 3,000 | 1.30x | 13% | ✅ Estándar | 1 cata gratis al año. |
| 7 | Embajador | 5,000 | 1.40x | 14% | ✅ Estándar | Acceso anticipado a microlotes. |
| 8 | Sommelier | 8,000 | 1.50x | 15% | ✅ Estándar | Regalo de cumpleaños. |
| 9 | Leyenda | 12,000 | 1.75x | 17.5% | ✅ Ambos | Edición limitada anual gratis. |
| 10 | Icónico | 20,000 | 2.00x | 20% | ✅ Ambos | Nombre en bolsa del año + todos los anteriores. |

#### 3.4 Inactividad y pérdida de rango

| Tiempo sin comprar | Efecto |
|---|---|
| < 6 meses | Todo igual. |
| ≥ 6 meses sin comprar (sin suscripción activa) | **Baja 1 nivel** de rango. |
| ≥ 12 meses sin comprar (sin suscripción activa) | **Baja a Grano**. **Expiran todos los puntos canjeables**. |
| **Suscripción activa** | **Rango congelado**. No aplica downgrade mientras esté activa. |

**Pre-aviso:** 30 días antes de cualquier downgrade o expiración, se envía un email recordatorio ("te extrañamos", "tus puntos están por expirar").

#### 3.5 Catálogo canjeable (productos exclusivos por puntos)

Productos que **solo** se obtienen con puntos canjeables. No se compran con dinero.

**Seed inicial:**
| Producto | Costo (pts) | Valor ($) | Rango mínimo |
|---|---|---|---|
| Catación privada virtual | 500 | $50 | Grano |
| Microlote especial 100g | 1,000 | $100 | Tueste |
| Pack regalo premium | 800 | $80 | Tueste |
| Catación presencial | 2,000 | $200 | Cata |
| Edición Icónico anual 250g | 5,000 | $500 | Icónico |

El admin puede agregar/editar productos canjeables desde `/admin/canjeables`.

### 4. Envíos

Cobertura nacional (todo México).

| Método | Costo | ETA |
|---|---|---|
| Estándar | $99 MXN | 3-5 días |
| Express | $149 MXN | 1-2 días |
| **Gratis** | $0 | mismo método elegido |

**Envío gratis en cualquiera de estos casos:**
1. Compra con subtotal ≥ $1,900 MXN.
2. Producto es una suscripción.
3. Producto es un pack.
4. Cliente es rango Catador o superior (1.20x+).
5. Cliente canjea puntos canjeables para pagar el envío (1 punto = $0.10 MXN).

**UI:**
- Carrito: barra de progreso "Te faltan $X para envío gratis".
- Checkout: input de código postal → cálculo en vivo del costo y ETA.

### 5. Historias de usuario (MVP v1)

#### HU-1: Compra como invitado
**Como** visitante sin cuenta
**Quiero** comprar café sin registrarme
**Para** no perder tiempo en formularios largos.

**Criterios de aceptación:**
- Puede agregar productos al carrito y finalizar compra.
- Solo email + nombre + dirección + CP.
- Calcula envío por CP.
- Puede pagar con tarjeta, Apple Pay, Google Pay, SPEI (10% desc), OXXO, MSI.
- Al confirmar pago, recibe email con resumen + cuadro informativo: "Si te hubieras registrado, habrías ganado X puntos" + botón para crear cuenta con un click.
- Si ya tenía cuenta con ese email, los puntos se suman automáticamente.

#### HU-2: Registro con magic link / Google OAuth
**Como** usuario nuevo o invitado
**Quiero** registrarme con mi email
**Para** acumular puntos en futuras compras.

**Criterios:**
- Ingreso email → link por email → click → cuenta creada y logueado.
- Google OAuth (1 click).
- Si vengo de compra guest, puntos ya asignados al crear cuenta.

#### HU-3: Ver mis puntos y rango
**Como** usuario logueado
**Quiero** ver mis puntos, mi rango, mi cashback acumulado y mi progreso
**Para** saber cómo voy.

**Criterios:**
- En `/cuenta`: dos secciones claras:
  - **Tu rango**: nombre, multiplicador, cashback efectivo, barra de progreso al siguiente nivel.
  - **Tus puntos canjeables**: saldo, valor en $MXN, link al catálogo canjeable, fecha de expiración del más próximo a expirar.
- Historial de transacciones de puntos (compras, redenciones, expiraciones, downgrades).

#### HU-4: Suscripción mensual
**Como** usuario recurrente
**Quiero** suscribirme al café del mes
**Para** recibirlo automáticamente y ahorrar.

**Criterios:**
- Producto "Suscripción mensual" → flujo de suscripción Stripe.
- Cobro mensual automático.
- Envío gratis siempre.
- Puede pausar/cancelar desde Stripe Customer Portal.
- Cada renovación genera puntos según rango.

#### HU-5: Panel admin — CRUD productos
**Como** administrador
**Quiero** agregar, editar, desactivar productos del catálogo normal
**Para** mantener la tienda al día.

**Criterios:**
- `/admin/productos` protegido (solo `role = 'admin'`).
- Formulario: nombre, descripción, precio, gramaje, imagen (upload), stock, badges, tipo, specs.
- Subir imagen → Supabase Storage.
- Soft delete (activar/desactivar).

#### HU-6: Configurar rangos
**Como** administrador
**Quiero** editar los 10 rangos, umbrales, multiplicadores y cashback
**Para** ajustar el programa sin redeployar.

**Criterios:**
- `/admin/rangos`: 10 rangos editables: nombre, puntos mínimos, multiplicador, cashback_pct, free_shipping, beneficios.
- Cambios aplican inmediatamente.
- Drag para reordenar.

#### HU-7: Cancelar / pausar suscripción
**Como** suscriptor
**Quiero** pausar o cancelar mi suscripción
**Para** tener control sobre mis cobros.

**Criterios:**
- Link en `/cuenta` a Stripe Customer Portal.
- Puede: pausar 1-3 meses, cancelar inmediatamente, o al final del período.
- Email de confirmación al cambiar estado.

#### HU-8: Ver historial de pedidos
**Como** usuario logueado
**Quiero** ver mi historial de compras
**Para** consultar órdenes pasadas.

**Criterios:**
- `/cuenta/pedidos`: lista con fecha, productos, total, estado, método de pago, puntos ganados.
- Filtros por fecha y estado.

#### HU-9: Recuperar acceso (magic link)
**Como** usuario que perdió acceso
**Quiero** recibir un nuevo magic link
**Para** recuperar mi cuenta.

**Criterios:**
- Link "¿No puedes entrar?" en `/auth/login`.
- Max 3 magic links/hora por email.

#### HU-10: Editar perfil y direcciones
**Como** usuario
**Quiero** actualizar mi info personal y de envío
**Para** tener mis datos correctos.

**Criterios:**
- `/cuenta/perfil`: editar nombre, teléfono, dirección de envío.
- Dirección se precarga en checkout.

#### HU-11: Notificación de puntos ganados
**Como** usuario
**Quiero** recibir email tras cada compra confirmando puntos
**Para** tener claridad sobre mi progreso.

**Criterios:**
- Email automático tras orden pagada.
- Incluye: orden, productos, total, puntos de rango, puntos canjeables (con valor $), rango actual.
- Si cambió de rango, se reemplaza por `rank-up` (HU-12).

#### HU-12: Notificación de cambio de rango
**Como** usuario
**Quiero** recibir email al subir de rango
**Para** sentirme motivado.

**Criterios:**
- Email automático cuando `current_rank` cambia.
- Incluye nuevo rango, beneficios, multiplicador y cashback nuevos.

#### HU-13: Canjear puntos por productos exclusivos
**Como** usuario
**Quiero** ver el catálogo de productos canjeables y canjear mis puntos
**Para** aprovechar mi cashback.

**Criterios:**
- `/cuenta/canjear`: catálogo de `redeemable_products` con imagen, descripción, costo en pts, valor en $MXN.
- El cliente solo ve productos que puede pagar con su saldo actual y que cumplen el `min_rank_required`.
- Click en producto → modal de confirmación → canje.
- Al canjear: descuenta puntos, crea redeem order, email de confirmación.
- El admin cumple manualmente (envío del producto).

#### HU-14: Ver progreso de envío gratis en el carrito
**Como** usuario con productos en el carrito
**Quiero** ver cuánto me falta para envío gratis
**Para** saber si agrego algo más.

**Criterios:**
- Barra de progreso: "Te faltan $X para envío gratis" o "¡Envío gratis!" si ya calificó.
- Actualiza en tiempo real al cambiar cantidades.
- Si es rango Catador+, siempre muestra "Envío gratis".

#### HU-15: Recibir email de advertencia de inactividad
**Como** usuario que no ha comprado en 5 meses
**Quiero** recibir un email recordatorio
**Para** no perder mi rango.

**Criterios:**
- Email 30 días antes del downgrade (5 meses sin comprar).
- Email 30 días antes de expiración de puntos canjeables.
- Mensaje amable con CTA "vuelve a comprar".

#### HU-16: Calcular envío por código postal en checkout
**Como** usuario en checkout
**Quiero** ver el costo de envío calculado por mi CP
**Para** saber cuánto pagaré.

**Criterios:**
- Input de CP en checkout.
- Live: muestra estándar $99, express $149, o "gratis" según reglas.
- ETA mostrada.

#### HU-17: Como admin, gestionar catálogo canjeable
**Como** administrador
**Quiero** agregar, editar, desactivar productos del catálogo canjeable
**Para** ofrecer canjes atractivos.

**Criterios:**
- `/admin/canjeables`: CRUD completo.
- Campos: nombre, descripción, imagen, costo en puntos, stock, rango mínimo requerido.
- Activar/desactivar.

---

### 6. Pagos

- **Moneda:** MXN.
- **Métodos:** tarjeta, Apple Pay, Google Pay, SPEI (10% desc), OXXO, MSI 3/6/12.
- **Suscripciones:** Stripe Subscriptions + Customer Portal.

### 7. Emails transaccionales (11 disparadores)

`welcome`, `order-confirmation-guest` (con upsell), `order-confirmation`, `rank-up`, `subscription-renewed`, `subscription-cancelled`, `redeem-confirmation`, `inactivity-warning`, `we-miss-you`, `points-expiring`, `free-shipping-unlocked`.

### 8. Métricas de éxito (v1)

| Métrica | Definición | Objetivo (3 meses) |
|---|---|---|
| Tasa de conversión checkout | Compras ÷ carritos | ≥ 8% |
| Ticket promedio (AOV) | Ingreso total ÷ órdenes | ≥ $450 MXN |
| Suscripciones activas al mes | count `subscriptions` activas | 50 |
| Tasa de recompra (60 días) | usuarios con ≥ 2 órdenes / 1ra orden | ≥ 25% |
| Tasa de canje de puntos | usuarios que canjean al menos 1 vez / usuarios activos | ≥ 20% |
| Adopción post-compra | guests que se registran / total de guests | ≥ 30% |
| Ticket de envío gratis | órdenes con envío gratis / total | ≥ 40% |

### 9. Fuera de alcance (v1)

App móvil, multi-moneda, marketplace, referidos, wishlist, reviews, IVA, multi-idioma, zonas de envío por estado.

---

## EN — English Version

### 1. Vision

Turn Icónico into an online store that rewards loyalty with a dual points system (rank + redeemable cashback), subscriptions, and national shipping, starting with simple purchases and ending in a 10-level program called **"The Icónico Program"**.

### 2. Target users

- Mexican coffee lover (occasional online purchase).
- Recurring coffee lover (monthly subscription).
- New customer discovering the brand (guest checkout).

### 3. Dual Points System

#### 3.1 Two independent balances

**Balance 1 — Rank Points (lifetime)**
- Earned per purchase via rank multiplier.
- Used for rank progression only.
- Never expires, never spent.
- Lost only by inactivity (see 3.4).

**Balance 2 — Redeemable Points (cashback)**
- 10% base × rank multiplier.
- 1 point = $0.10 MXN fixed.
- Redeemed in exclusive catalog (see 3.5).
- Expire 12 months after earning.

#### 3.2 Calculation per purchase

```
rank_points_earned    = floor(subtotal × multiplier)
redeemable_earned     = floor(subtotal × 0.10 × multiplier)
cash_value            = redeemable_earned × $0.10
```

**Example:** $1,000 MXN order, user is Catador (1.20x):
- Rank points: 1,200
- Redeemable points: 120 ($12 MXN)
- Free shipping (Catador+).

#### 3.3 Rank table (10 levels)

| # | Rank | Lifetime pts | Multiplier | Cashback | Free shipping | Perk |
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

#### 3.4 Inactivity and rank loss

| Time without purchase | Effect |
|---|---|
| < 6 months | All good. |
| ≥ 6 months (no active sub) | **Downgrade 1 rank**. |
| ≥ 12 months (no active sub) | **Reset to Grano**. **All redeemable points expire**. |
| **Active subscription** | **Rank frozen**. No downgrade. |

**Pre-warning:** Email 30 days before any downgrade or expiration.

#### 3.5 Redeemable catalog (points-only products)

Products that **only** can be obtained with redeemable points. No cash purchase.

**Seed:**
| Product | Cost (pts) | Value ($) | Min rank |
|---|---|---|---|
| Virtual private cupping | 500 | $50 | Grano |
| Special microlote 100g | 1,000 | $100 | Tueste |
| Premium gift pack | 800 | $80 | Tueste |
| In-person cupping | 2,000 | $200 | Cata |
| Annual Icónico edition 250g | 5,000 | $500 | Icónico |

### 4. Shipping

National coverage (all Mexico).

| Method | Cost | ETA |
|---|---|---|
| Standard | $99 MXN | 3-5 days |
| Express | $149 MXN | 1-2 days |
| **Free** | $0 | same as chosen method |

**Free shipping triggers (any of):**
1. Order subtotal ≥ $1,900 MXN.
2. Product is a subscription.
3. Product is a pack.
4. Customer rank Catador or higher (1.20x+).
5. Customer redeems redeemable points to pay shipping (1 point = $0.10 MXN).

**UI:**
- Cart: progress bar "You need $X more for free shipping".
- Checkout: postal code input → live cost and ETA.

### 5. User Stories (MVP v1)

(Same as Spanish section above: US-1 through US-17, all dual-points + shipping + catalog + inactivity aware.)

#### US-1: Guest checkout
- Add to cart, pay with email + name + address + CP.
- Shipping calculated by CP.
- Post-purchase email shows "If you had registered, you'd have earned X points" + 1-click signup.
- If account exists with that email, points auto-assigned.

#### US-2: Sign up (magic link / Google OAuth)
- Email → link → 1 click → logged in.
- Google OAuth alternative.
- Guest purchase points attach upon signup.

#### US-3: View my points and rank
- Two clear sections in `/cuenta`:
  - **Your rank**: name, multiplier, cashback, progress bar to next.
  - **Your redeemable points**: balance, $MXN value, link to catalog, next expiration.
- Full transaction history.

#### US-4: Monthly subscription
- "Suscripción mensual" → Stripe subscription flow.
- Monthly billing, free shipping, cancellable from portal.
- Each renewal earns points.

#### US-5: Admin — product CRUD
- `/admin/productos` (admin only).
- Form: name, description, price, weight, image, stock, badges, type, specs.
- Image upload to Supabase Storage.
- Soft delete.

#### US-6: Configure ranks
- `/admin/rangos`: 10 ranks editable: name, min_points, multiplier, cashback_pct, free_shipping, perks.
- Live changes.

#### US-7: Cancel / pause subscription
- Link in `/cuenta` to Stripe Customer Portal.
- Pause 1-3 months, cancel immediately, or end of period.

#### US-8: Order history
- `/cuenta/pedidos`: list with date, products, total, status, payment method, points earned.

#### US-9: Recover access (magic link)
- Link on `/auth/login`.
- Max 3 magic links/hour per email.

#### US-10: Edit profile and addresses
- `/cuenta/perfil`: name, phone, shipping address.

#### US-11: Points earned notification
- Email after each paid order.
- Includes rank points, redeemable points ($ value), current rank.

#### US-12: Rank up notification
- Email on rank change with new benefits.

#### US-13: Redeem points for exclusive products
- `/cuenta/canjear`: catalog filtered by `min_rank_required` and user's balance.
- Modal confirmation → redeem.
- Points deducted, redeem order created, email sent.
- Admin fulfills manually.

#### US-14: Free-shipping progress in cart
- Real-time progress bar: "You need $X more for free shipping" or "Free shipping unlocked!".
- Catador+ always shows free.

#### US-15: Inactivity warning email
- Email 30 days before downgrade.
- Email 30 days before points expire.
- Friendly message + CTA to buy.

#### US-16: Calculate shipping by postal code at checkout
- Live cost and ETA based on CP.
- Shows standard $99, express $149, or free.

#### US-17: Admin — manage redeemable catalog
- `/admin/canjeables`: full CRUD.
- Fields: name, description, image, points cost, stock, min rank required.

---

### 6. Payments

Currency: MXN. Methods: card, Apple Pay, Google Pay, SPEI (10% off), OXXO, MSI 3/6/12. Subscriptions via Stripe Subscriptions + Customer Portal.

### 7. Transactional emails (11 triggers)

`welcome`, `order-confirmation-guest` (with upsell), `order-confirmation`, `rank-up`, `subscription-renewed`, `subscription-cancelled`, `redeem-confirmation`, `inactivity-warning`, `we-miss-you`, `points-expiring`, `free-shipping-unlocked`.

### 8. Success metrics (v1)

| Metric | Target (3 months) |
|---|---|
| Checkout conversion rate | ≥ 8% |
| Average order value (AOV) | ≥ $450 MXN |
| Active subscriptions at month end | 50 |
| Repeat purchase rate (60 days) | ≥ 25% |
| Redemption rate | ≥ 20% |
| Post-purchase signup rate | ≥ 30% |
| Free-shipping order share | ≥ 40% |

### 9. Out of scope (v1)

Native mobile app, multi-currency, marketplace, referrals, wishlist, reviews, IVA, multi-language, per-state shipping zones.
