// src/components/shop/FreeShippingBar.tsx
// Barra de progreso de envío gratis en el cart (HU-14).
// Reglas (ProductRequirements §4):
//   1. subtotal >= $1,900 → gratis
//   2. producto es suscripción → gratis
//   3. producto es pack → gratis
//   4. cliente Catador+ (rank 5+) → gratis
// Lee el perfil activo del mock session.

import { useStore } from '@nanostores/react';
import { $mockProfile } from '../../mocks/session';
import { RANKS, FREE_SHIPPING_THRESHOLD } from '../../mocks/ranks';
import type { CartItem } from './types';

interface Props {
  subtotal: number; // centavos
  items: CartItem[];
}

function formatPesos(cents: number): string {
  return `$${(cents / 100).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MXN`;
}

export default function FreeShippingBar({ subtotal, items }: Props) {
  const profile = useStore($mockProfile);

  // Regla 1: threshold de subtotal
  const hasSubscription = items.some((i) => i.productId === 'suscripcion');
  const hasPack = items.some((i) => i.productId.startsWith('pack-'));
  const rankLevel = profile?.rank ?? 1;
  const rank = RANKS.find((r) => r.level === rankLevel);
  const rankHasFreeShip = rank ? rank.freeShipping !== 'none' : false;

  const qualifiesBySubtotal = subtotal >= FREE_SHIPPING_THRESHOLD;
  const qualifiesBySub = hasSubscription;
  const qualifiesByPack = hasPack;
  const qualifiesByRank = rankHasFreeShip;
  const qualifies = qualifiesBySubtotal || qualifiesBySub || qualifiesByPack || qualifiesByRank;

  // Razón que aplica (en orden de prioridad)
  const reason = qualifiesBySub
    ? 'Suscripción · envío gratis siempre'
    : qualifiesByPack
    ? 'Pack · envío gratis'
    : qualifiesByRank
    ? `Rango ${rank?.name} · envío gratis`
    : qualifiesBySubtotal
    ? 'Envío gratis'
    : null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div class="mx-6 mt-4 p-4 rounded-xl bg-sand/20 border border-sand/30">
      {qualifies ? (
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F3829" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-navy">¡Envío gratis!</p>
            <p class="text-[0.6875rem] text-charcoal/60 mt-0.5">{reason}</p>
          </div>
        </div>
      ) : (
        <>
          <div class="flex items-center justify-between mb-2">
            <p class="text-[0.6875rem] text-charcoal/70">
              Te faltan <span class="font-semibold text-navy">{formatPesos(remaining)}</span> para envío gratis
            </p>
            <p class="text-[0.625rem] text-charcoal/40 tracking-wide">{formatPesos(FREE_SHIPPING_THRESHOLD)}</p>
          </div>
          <div class="h-1.5 rounded-full bg-sand/50 overflow-hidden">
            <div
              class="h-full bg-navy rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
