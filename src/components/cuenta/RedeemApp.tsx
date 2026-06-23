// src/components/cuenta/RedeemApp.tsx
// HU-13: Canjear puntos por productos exclusivos

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $mockProfile, MOCK_PROFILES, $mockProfileId, deductRedeemablePoints } from '../../mocks/session';
import { REDEEMABLES, type RedeemableProduct } from '../../mocks/redeemables';
import { RANKS } from '../../mocks/ranks';
import AccountLayout from './AccountLayout';

function IconDashboard() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function IconOrders() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>; }
function IconUser() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconGift() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>; }

const navItems = [
  { href: '/cuenta', label: 'Mi cuenta', icon: <IconDashboard /> },
  { href: '/cuenta/pedidos', label: 'Mis pedidos', icon: <IconOrders /> },
  { href: '/cuenta/canjear', label: 'Canjear puntos', icon: <IconGift />, active: true },
  { href: '/cuenta/perfil', label: 'Perfil y direcciones', icon: <IconUser /> },
];

function formatPesos(value: number) {
  return `$${value.toLocaleString('es-MX')} MXN`;
}

export default function RedeemApp() {
  const profile = useStore($mockProfile);
  const profileId = useStore($mockProfileId);
  const [confirm, setConfirm] = useState<RedeemableProduct | null>(null);
  const [redeemed, setRedeemed] = useState<RedeemableProduct | null>(null);

  if (!profile.hasAccount) {
    return (
      <AccountLayout variant="cuenta" title="Canjear puntos" navItems={navItems}>
        <p class="text-sm text-charcoal/50 text-center py-12">Inicia sesión para ver el catálogo canjeable.</p>
      </AccountLayout>
    );
  }

  function handleRedeem(p: RedeemableProduct) {
    if (profile.redeemablePoints < p.cost) return;
    if (profile.rank < p.minRank) return;
    // Mutamos la ref del perfil activo y forzamos reactividad
    MOCK_PROFILES[profileId].redeemablePoints -= p.cost;
    MOCK_PROFILES[profileId].redeems.unshift({
      id: `r-${Date.now()}`,
      productName: p.name,
      cost: p.cost,
      redeemedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
    });
    MOCK_PROFILES[profileId].pointsHistory.unshift({
      id: `t-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'redeem',
      rankDelta: 0,
      redeemableDelta: -p.cost,
      description: `Canje: ${p.name}`,
    });
    $mockProfileId.set(profileId); // trigger
    setConfirm(null);
    setRedeemed(p);
  }

  return (
    <AccountLayout variant="cuenta" title="Canjear puntos" subtitle={`Tenés ${profile.redeemablePoints.toLocaleString('es-MX')} pts canjeables`} navItems={navItems}>
      <div class="grid sm:grid-cols-2 gap-4">
        {REDEEMABLES.map((p) => {
          const canAfford = profile.redeemablePoints >= p.cost;
          const meetsRank = profile.rank >= p.minRank;
          const minRank = RANKS.find((r) => r.level === p.minRank);
          const unavailable = !canAfford || !meetsRank || !p.inStock;

          return (
            <article key={p.id} class={`p-5 rounded-2xl border-2 transition-colors duration-200 ${unavailable ? 'border-sand/30 opacity-60' : 'border-sand/40 hover:border-navy/30'}`}>
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="w-12 h-12 rounded-xl bg-sand/30 flex items-center justify-center">
                  <IconGift />
                </div>
                <div class="text-right">
                  <p class="font-serif text-2xl font-bold text-navy">{p.cost.toLocaleString('es-MX')}</p>
                  <p class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40">pts</p>
                </div>
              </div>
              <h3 class="font-serif text-lg font-bold text-charcoal mb-2">{p.name}</h3>
              <p class="text-xs text-charcoal/60 leading-relaxed mb-4">{p.description}</p>
              <div class="pt-3 border-t border-sand/30 flex items-center justify-between text-xs">
                <span class="text-charcoal/50">Valor: {formatPesos(p.valuePesos)}</span>
                <span class="text-charcoal/50">Mín: {minRank?.name}</span>
              </div>
              {unavailable && (
                <p class="mt-3 text-[0.6875rem] text-coffee/70">
                  {!p.inStock ? 'Agotado' : !meetsRank ? `Necesitás rango ${minRank?.name}` : `Te faltan ${(p.cost - profile.redeemablePoints).toLocaleString('es-MX')} pts`}
                </p>
              )}
              {!unavailable && (
                <button
                  onClick={() => setConfirm(p)}
                  class="mt-3 w-full px-4 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200 cursor-pointer"
                >
                  Canjear
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* Modal confirmación */}
      {confirm && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div class="relative w-full max-w-md p-6 rounded-2xl bg-cream border border-sand/40">
            <h3 class="font-serif text-2xl font-bold text-charcoal mb-2">Confirmar canje</h3>
            <p class="text-sm text-charcoal/60 mb-5">Estás a punto de canjear:</p>
            <div class="p-4 rounded-xl bg-sand/20 mb-5">
              <p class="font-semibold text-charcoal">{confirm.name}</p>
              <p class="text-xs text-charcoal/60 mt-1">{confirm.description}</p>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-xs text-charcoal/50">Costo</span>
                <span class="font-serif text-xl font-bold text-navy">{confirm.cost.toLocaleString('es-MX')} pts</span>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-charcoal/50">Saldo restante</span>
                <span class="text-sm font-medium text-charcoal">{(profile.redeemablePoints - confirm.cost).toLocaleString('es-MX')} pts</span>
              </div>
            </div>
            <p class="text-[0.6875rem] text-charcoal/50 mb-5">
              El equipo de Icónico te contactará por email en 24-48h hábiles para coordinar la entrega.
            </p>
            <div class="flex gap-3">
              <button onClick={() => setConfirm(null)} class="flex-1 px-4 py-3 rounded-full border border-charcoal/20 text-sm font-medium text-charcoal/70 hover:border-charcoal/40 transition-colors cursor-pointer">
                Cancelar
              </button>
              <button onClick={() => handleRedeem(confirm)} class="flex-1 px-4 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors cursor-pointer">
                Confirmar canje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {redeemed && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setRedeemed(null)} />
          <div class="relative w-full max-w-sm p-6 rounded-2xl bg-cream border border-sand/40 text-center">
            <div class="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F3829" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 class="font-serif text-2xl font-bold text-charcoal mb-2">¡Canje exitoso!</h3>
            <p class="text-sm text-charcoal/60 mb-1">Canjeaste <span class="text-navy font-medium">{redeemed.cost.toLocaleString('es-MX')} pts</span> por</p>
            <p class="font-serif text-lg font-bold text-charcoal mb-5">{redeemed.name}</p>
            <p class="text-xs text-charcoal/50 mb-6">Te contactaremos por email en 24-48h hábiles.</p>
            <button onClick={() => setRedeemed(null)} class="w-full px-4 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors cursor-pointer">
              Listo
            </button>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
