// src/components/cuenta/OrdersApp.tsx
// HU-8: Ver historial de pedidos

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $mockProfile } from '../../mocks/session';
import AccountLayout from './AccountLayout';

function IconDashboard() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function IconOrders() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>; }
function IconUser() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconGift() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>; }

const navItems = [
  { href: '/cuenta', label: 'Mi cuenta', icon: <IconDashboard /> },
  { href: '/cuenta/pedidos', label: 'Mis pedidos', icon: <IconOrders />, active: true },
  { href: '/cuenta/canjear', label: 'Canjear puntos', icon: <IconGift /> },
  { href: '/cuenta/perfil', label: 'Perfil y direcciones', icon: <IconUser /> },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  delivered: { label: 'Entregado', color: 'text-sage bg-sage/10' },
  in_transit: { label: 'En camino', color: 'text-navy bg-navy/10' },
  processing: { label: 'Preparando', color: 'text-coffee bg-coffee/10' },
  cancelled: { label: 'Cancelado', color: 'text-charcoal/50 bg-charcoal/5' },
};

const PM_LABELS: Record<string, string> = {
  card: 'Tarjeta',
  spei: 'SPEI',
  oxxo: 'OXXO',
  apple_pay: 'Apple Pay',
};

function formatPesos(cents: number) {
  return `$${(cents / 100).toLocaleString('es-MX')} MXN`;
}

export default function OrdersApp() {
  const profile = useStore($mockProfile);
  const [filter, setFilter] = useState<'all' | 'delivered' | 'in_transit' | 'processing'>('all');

  if (!profile.hasAccount) {
    return (
      <AccountLayout variant="cuenta" title="Mis pedidos" navItems={navItems}>
        <p class="text-sm text-charcoal/50 text-center py-12">Inicia sesión para ver tus pedidos.</p>
      </AccountLayout>
    );
  }

  const filtered = filter === 'all' ? profile.orders : profile.orders.filter((o) => o.status === filter);

  return (
    <AccountLayout variant="cuenta" title="Mis pedidos" subtitle={`${profile.orders.length} pedidos en total`} navItems={navItems}>
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        {([
          { id: 'all' as const, label: 'Todos' },
          { id: 'delivered' as const, label: 'Entregados' },
          { id: 'in_transit' as const, label: 'En camino' },
          { id: 'processing' as const, label: 'Preparando' },
        ]).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            class={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer ${
              filter === f.id ? 'bg-navy text-cream' : 'border border-sand/40 text-charcoal/60 hover:border-navy/30'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div class="p-12 rounded-2xl border border-sand/40 text-center">
          <p class="font-serif text-xl text-charcoal mb-2">Sin pedidos en este estado</p>
          <p class="text-sm text-charcoal/50">Probá otro filtro o hacé tu primer pedido.</p>
        </div>
      ) : (
        <div class="space-y-3">
          {filtered.map((order) => {
            const st = STATUS_LABELS[order.status];
            return (
              <article key={order.id} class="p-5 rounded-2xl border border-sand/40 bg-cream/50">
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p class="text-xs tracking-[0.15em] uppercase text-charcoal/40 font-medium">{order.id}</p>
                    <p class="text-xs text-charcoal/50 mt-1">{order.date}</p>
                  </div>
                  <span class={`shrink-0 px-3 py-1 rounded-full text-[0.6875rem] font-medium ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                <div class="space-y-1.5 mb-4">
                  {order.items.map((it, i) => (
                    <div key={i} class="flex items-center justify-between text-sm">
                      <p class="text-charcoal/80">{it.name} <span class="text-charcoal/40">×{it.quantity}</span> <span class="text-[0.6875rem] text-charcoal/40">· {it.unit}</span></p>
                      <p class="text-charcoal/60">{formatPesos(it.price * it.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div class="pt-3 border-t border-sand/30 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-4 text-charcoal/50">
                    <span>{PM_LABELS[order.paymentMethod]}</span>
                    <span>·</span>
                    <span class="text-navy">+{order.pointsEarned.rank} rango · +{order.pointsEarned.redeemable} canje</span>
                  </div>
                  <p class="font-bold text-charcoal">{formatPesos(order.total)}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
}
