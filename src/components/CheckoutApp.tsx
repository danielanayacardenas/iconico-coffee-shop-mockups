// src/components/CheckoutApp.tsx
// HU-1: Compra como invitado
// HU-16: Calcular envío por CP en checkout
// Una sola React island que envuelve todo el formulario de checkout.

import { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $cartList, $cartTotal, $cartCount, clearCart, openCart } from './shop/store/cart';
import { $mockProfile } from '../mocks/session';
import { RANKS, FREE_SHIPPING_THRESHOLD } from '../mocks/ranks';

type ShippingMethod = 'standard' | 'express';
type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'spei' | 'oxxo' | 'msi';

const SHIPPING_COSTS = { standard: 9900, express: 14900 }; // centavos

function formatPesos(cents: number) {
  return `$${(cents / 100).toLocaleString('es-MX', { minimumFractionDigits: 0 })} MXN`;
}

function Field({ label, type = 'text', value, onChange, placeholder, required, autoComplete, hint, maxLength }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  maxLength?: number;
}) {
  const id = label.toLowerCase().replace(/\s/g, '-');
  return (
    <div>
      <label htmlFor={id} class="block text-xs font-medium text-charcoal/70 mb-1.5">
        {label} {required && <span class="text-coffee">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal placeholder:text-charcoal/30 focus:border-navy focus:outline-none transition-colors duration-200"
      />
      {hint && <p class="text-[0.6875rem] text-charcoal/40 mt-1">{hint}</p>}
    </div>
  );
}

export default function CheckoutApp() {
  const items = useStore($cartList);
  const total = useStore($cartTotal);
  const count = useStore($cartCount);
  const profile = useStore($mockProfile);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateAddr, setStateAddr] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [confirmed, setConfirmed] = useState<string | null>(null);

  // Cálculo de envío (HU-16): depende de CP, subtotal, items, rango
  const shippingCalc = useMemo(() => {
    if (items.length === 0) return { cost: 0, free: false, reason: 'Sin productos' };

    const hasSub = items.some((i) => i.productId === 'suscripcion');
    const hasPack = items.some((i) => i.productId.startsWith('pack-'));
    const rank = RANKS.find((r) => r.level === (profile?.rank ?? 1));
    const rankHasFreeShip = rank ? rank.freeShipping !== 'none' : false;
    const subFree = total >= FREE_SHIPPING_THRESHOLD;

    const free = hasSub || hasPack || rankHasFreeShip || subFree;
    const reason = hasSub
      ? 'Suscripción · envío gratis'
      : hasPack
      ? 'Pack · envío gratis'
      : rankHasFreeShip
      ? `Rango ${rank?.name} · envío gratis`
      : subFree
      ? 'Envío gratis por subtotal'
      : null;

    return {
      cost: free ? 0 : SHIPPING_COSTS[shippingMethod],
      free,
      reason,
      eta: shippingMethod === 'standard' ? '3-5 días' : '1-2 días',
    };
  }, [items, total, shippingMethod, profile?.rank]);

  const finalTotal = total + shippingCalc.cost;
  const speiDiscount = paymentMethod === 'spei' ? Math.round(finalTotal * 0.10) : 0;
  const finalWithDiscount = finalTotal - speiDiscount;

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name || !street || !postalCode) return;
    const orderId = `ICN-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    setConfirmed(orderId);
    clearCart();
  }

  if (confirmed) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center px-6">
        <div class="max-w-md w-full text-center">
          <div class="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F3829" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Gracias por tu compra!</h1>
          <p class="text-sm text-charcoal/60 mb-1">Tu pedido fue confirmado.</p>
          <p class="text-xs tracking-[0.2em] uppercase text-coffee/70 mb-8">Orden {confirmed}</p>
          <div class="p-5 rounded-2xl bg-sand/20 border border-sand/30 text-left mb-6">
            <p class="text-sm text-charcoal/80 mb-2">Te enviamos un email con el resumen y el seguimiento.</p>
            {!profile.hasAccount && (
              <>
                <p class="text-sm text-charcoal/80 mt-4 mb-3">
                  Si te hubieras registrado, habrías ganado:
                </p>
                <div class="flex items-center gap-4">
                  <div>
                    <p class="font-serif text-2xl font-bold text-navy">
                      {Math.floor((total / 100) * (profile.rank === 1 ? 1.0 : 1.2))}
                    </p>
                    <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 mt-1">pts rango</p>
                  </div>
                  <div>
                    <p class="font-serif text-2xl font-bold text-coffee">
                      {Math.floor((total / 100) * 0.10 * (profile.rank === 1 ? 1.0 : 1.2))}
                    </p>
                    <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 mt-1">pts canjeables</p>
                  </div>
                </div>
                <button class="mt-5 w-full px-4 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200 cursor-pointer">
                  Crear cuenta y guardar mis puntos
                </button>
              </>
            )}
          </div>
          <a href="/tienda" class="text-xs text-charcoal/50 hover:text-navy underline underline-offset-2">
            Volver a la tienda
          </a>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center px-6">
        <div class="text-center max-w-sm">
          <p class="font-serif text-2xl text-charcoal mb-3">Tu carrito está vacío</p>
          <p class="text-sm text-charcoal/50 mb-6">Agrega productos antes de finalizar la compra.</p>
          <a href="/tienda" class="inline-block px-6 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200">
            Ir a la tienda
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleConfirm} class="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <div class="flex items-baseline justify-between mb-8">
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-charcoal tracking-[-0.02em]">Checkout</h1>
        <button type="button" onClick={openCart} class="text-xs text-charcoal/50 hover:text-navy underline underline-offset-2 cursor-pointer">
          Ver carrito ({count})
        </button>
      </div>

      <div class="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
        <div class="space-y-10">
          {/* Contacto */}
          <section>
            <h2 class="font-serif text-xl font-bold text-charcoal mb-1">Contacto</h2>
            <p class="text-xs text-charcoal/50 mb-5">Te enviamos la confirmación de tu pedido aquí.</p>
            <div class="space-y-4">
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" required autoComplete="email" />
              <div class="grid sm:grid-cols-2 gap-4">
                <Field label="Nombre completo" value={name} onChange={setName} placeholder="María García" required autoComplete="name" />
                <Field label="Teléfono" type="tel" value={phone} onChange={setPhone} placeholder="+52 55 1234 5678" autoComplete="tel" />
              </div>
            </div>
          </section>

          {/* Envío */}
          <section>
            <h2 class="font-serif text-xl font-bold text-charcoal mb-1">Dirección de envío</h2>
            <p class="text-xs text-charcoal/50 mb-5">A todo México. Calculamos el envío al ingresar tu CP.</p>
            <div class="space-y-4">
              <div class="grid sm:grid-cols-[140px_1fr] gap-4">
                <Field label="Código postal" value={postalCode} onChange={setPostalCode} placeholder="03100" required autoComplete="postal-code" maxLength={5} hint="5 dígitos" />
                <Field label="Calle y número" value={street} onChange={setStreet} placeholder="Av. Insurgentes Sur 1234, Int. 502" required autoComplete="street-address" />
              </div>
              <div class="grid sm:grid-cols-2 gap-4">
                <Field label="Ciudad" value={city} onChange={setCity} placeholder="Ciudad de México" required autoComplete="address-level2" />
                <Field label="Estado" value={stateAddr} onChange={setStateAddr} placeholder="CDMX" required autoComplete="address-level1" />
              </div>

              {/* HU-16: cálculo en vivo de envío por CP */}
              {postalCode.length === 5 && (
                <div class="mt-4 p-5 rounded-2xl bg-sand/20 border border-sand/30 space-y-3">
                  <p class="text-[0.6875rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium">Método de envío</p>
                  {shippingCalc.free && shippingCalc.reason && (
                    <div class="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3829" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <p class="text-xs text-navy font-medium">{shippingCalc.reason}</p>
                    </div>
                  )}
                  {([
                    { id: 'standard' as const, label: 'Estándar', eta: '3-5 días', price: shippingCalc.free ? 0 : SHIPPING_COSTS.standard },
                    { id: 'express' as const, label: 'Express', eta: '1-2 días', price: shippingCalc.free && RANKS.find((r) => r.level === (profile?.rank ?? 1))?.freeShipping === 'both' ? 0 : SHIPPING_COSTS.express },
                  ]).map((opt) => {
                    const selected = shippingMethod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setShippingMethod(opt.id)}
                        class={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          selected ? 'border-navy bg-navy/5' : 'border-sand/40 hover:border-navy/30'
                        }`}
                      >
                        <div class="text-left">
                          <p class="text-sm font-semibold text-charcoal">{opt.label}</p>
                          <p class="text-[0.6875rem] text-charcoal/50 mt-0.5">{opt.eta}</p>
                        </div>
                        <p class="text-sm font-bold text-charcoal">{opt.price === 0 ? 'Gratis' : formatPesos(opt.price)}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Pago */}
          <section>
            <h2 class="font-serif text-xl font-bold text-charcoal mb-5">Método de pago</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {([
                { id: 'card' as const, label: 'Tarjeta', sub: 'crédito / débito' },
                { id: 'apple_pay' as const, label: 'Apple Pay', sub: '1 toque' },
                { id: 'google_pay' as const, label: 'Google Pay', sub: '1 toque' },
                { id: 'spei' as const, label: 'SPEI', sub: '10% descuento' },
                { id: 'oxxo' as const, label: 'OXXO', sub: 'voucher' },
                { id: 'msi' as const, label: 'MSI', sub: '3 / 6 / 12 meses' },
              ]).map((opt) => {
                const selected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    class={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      selected ? 'border-navy bg-navy/5' : 'border-sand/40 hover:border-navy/30'
                    }`}
                  >
                    <p class="text-sm font-semibold text-charcoal">{opt.label}</p>
                    <p class="text-[0.6875rem] text-charcoal/50 mt-0.5">{opt.sub}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Resumen */}
        <aside class="lg:sticky lg:top-24 self-start">
          <div class="p-6 rounded-2xl border border-sand/40 bg-sand/10">
            <h3 class="font-serif text-lg font-bold text-charcoal mb-4">Resumen</h3>
            <div class="space-y-3 pb-4 border-b border-sand/30">
              {items.map((item) => (
                <div key={item.productId} class="flex items-center justify-between text-sm">
                  <div class="flex-1 min-w-0">
                    <p class="text-charcoal truncate">{item.name} <span class="text-charcoal/40">×{item.quantity}</span></p>
                    <p class="text-[0.6875rem] text-charcoal/40 mt-0.5">{item.unit}</p>
                  </div>
                  <p class="text-charcoal/80 ml-3">{formatPesos(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div class="space-y-2 py-4 text-sm">
              <div class="flex items-center justify-between">
                <p class="text-charcoal/60">Subtotal</p>
                <p class="text-charcoal">{formatPesos(total)}</p>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-charcoal/60">Envío</p>
                <p class="text-charcoal">
                  {shippingCalc.cost === 0 ? <span class="text-navy font-medium">Gratis</span> : formatPesos(shippingCalc.cost)}
                </p>
              </div>
              {speiDiscount > 0 && (
                <div class="flex items-center justify-between">
                  <p class="text-coffee/70">Descuento SPEI (10%)</p>
                  <p class="text-coffee">−{formatPesos(speiDiscount)}</p>
                </div>
              )}
            </div>
            <div class="pt-4 border-t border-sand/30 flex items-center justify-between">
              <p class="text-sm font-semibold text-charcoal">Total</p>
              <p class="font-serif text-2xl font-bold text-charcoal">{formatPesos(finalWithDiscount)}</p>
            </div>
            <button
              type="submit"
              class="mt-6 w-full px-4 py-3.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              Confirmar pedido
            </button>
            <p class="mt-3 text-[0.625rem] text-center text-charcoal/40">
              Al confirmar aceptas los términos. No se procesará ningún pago (es un mockup).
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
