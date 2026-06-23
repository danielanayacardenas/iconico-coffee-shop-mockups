// src/components/cuenta/DashboardApp.tsx
// HU-3: Ver mis puntos y rango
// HU-4: Suscripción mensual (card)
// HU-7: Cancelar / pausar suscripción (botones en card)
// Dos secciones claras: tu rango + tus puntos canjeables + historial de transacciones.

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $mockProfile, MOCK_PROFILES, $mockProfileId } from '../../mocks/session';
import { RANKS, getNextRank, POINTS_TO_PESOS } from '../../mocks/ranks';
import AccountLayout from './AccountLayout';

function IconDashboard() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function IconOrders() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>; }
function IconUser() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconGift() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>; }

const navItems = [
  { href: '/cuenta', label: 'Mi cuenta', icon: <IconDashboard />, active: true },
  { href: '/cuenta/pedidos', label: 'Mis pedidos', icon: <IconOrders /> },
  { href: '/cuenta/canjear', label: 'Canjear puntos', icon: <IconGift /> },
  { href: '/cuenta/perfil', label: 'Perfil y direcciones', icon: <IconUser /> },
];

export default function DashboardApp() {
  const profile = useStore($mockProfile);
  const profileId = useStore($mockProfileId);
  const [action, setAction] = useState<'pause' | 'cancel' | null>(null);

  function updateSub(status: 'active' | 'paused' | 'cancelled', pausedUntil?: string) {
    const sub = MOCK_PROFILES[profileId].subscription;
    if (!sub) return;
    sub.status = status;
    sub.pausedUntil = pausedUntil;
    $mockProfileId.set(profileId);
  }

  if (!profile.hasAccount) {
    return (
      <AccountLayout variant="cuenta" title="Mi cuenta" subtitle="Inicia sesión para ver tu cuenta" navItems={navItems}>
        <div class="p-12 rounded-2xl border border-sand/40 text-center">
          <p class="font-serif text-2xl text-charcoal mb-3">Aún no tienes cuenta</p>
          <p class="text-sm text-charcoal/60 mb-6">Crea una para acumular puntos con cada compra.</p>
          <a href="/auth/login" class="inline-block px-6 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors">
            Crear cuenta
          </a>
        </div>
      </AccountLayout>
    );
  }

  const rank = RANKS.find((r) => r.level === profile.rank)!;
  const next = getNextRank(profile.rank);
  const progressPct = next
    ? Math.min(100, ((profile.rankPoints - rank.minPoints) / (next.minPoints - rank.minPoints)) * 100)
    : 100;
  const toNext = next ? Math.max(0, next.minPoints - profile.rankPoints) : 0;

  return (
    <AccountLayout variant="cuenta" title={`Hola, ${profile.email.split('@')[0]}`} subtitle={rank.name} navItems={navItems}>
      <div class="space-y-6">
        {/* Suscripción (HU-4, HU-7) */}
        {profile.subscription && (
          <section class="p-6 md:p-8 rounded-2xl border border-sand/40 bg-navy/[0.02]">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <p class="text-[0.625rem] tracking-[0.2em] uppercase text-navy/60 font-medium">Tu suscripción</p>
                <h3 class="font-serif text-xl font-bold text-charcoal mt-1">{profile.subscription.productName}</h3>
              </div>
              <span class={`shrink-0 px-3 py-1 rounded-full text-[0.6875rem] font-medium ${
                profile.subscription.status === 'active' ? 'bg-sage/10 text-sage' :
                profile.subscription.status === 'paused' ? 'bg-coffee/10 text-coffee' :
                'bg-charcoal/5 text-charcoal/50'
              }`}>
                {profile.subscription.status === 'active' ? 'Activa' : profile.subscription.status === 'paused' ? `Pausada hasta ${profile.subscription.pausedUntil}` : 'Cancelada'}
              </span>
            </div>
            <div class="grid sm:grid-cols-3 gap-4 mb-5 text-sm">
              <div>
                <p class="text-charcoal/40 text-[0.625rem] tracking-[0.15em] uppercase">Cobro mensual</p>
                <p class="font-serif text-lg font-bold text-charcoal mt-1">${(profile.subscription.monthlyPrice / 100).toLocaleString('es-MX')} MXN</p>
              </div>
              <div>
                <p class="text-charcoal/40 text-[0.625rem] tracking-[0.15em] uppercase">Próximo cobro</p>
                <p class="font-serif text-lg font-bold text-charcoal mt-1">{profile.subscription.nextBilling}</p>
              </div>
              <div>
                <p class="text-charcoal/40 text-[0.625rem] tracking-[0.15em] uppercase">Activa desde</p>
                <p class="font-serif text-lg font-bold text-charcoal mt-1">{profile.subscription.startedAt}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 pt-4 border-t border-sand/30">
              <button onClick={() => setAction('pause')} class="px-4 py-2 rounded-full border border-sand/40 text-xs font-medium text-charcoal/70 hover:border-navy/30 transition-colors cursor-pointer">
                Pausar 1-3 meses
              </button>
              <button onClick={() => setAction('cancel')} class="px-4 py-2 rounded-full border border-sand/40 text-xs font-medium text-charcoal/70 hover:border-coffee/30 hover:text-coffee transition-colors cursor-pointer">
                Cancelar
              </button>
              <a href="#" onclick="event.preventDefault()" class="ml-auto px-4 py-2 rounded-full bg-navy text-cream text-xs font-medium hover:bg-navy/90 transition-colors cursor-pointer">
                Abrir portal de Stripe
              </a>
            </div>
          </section>
        )}

        {!profile.subscription && (
          <section class="p-6 md:p-8 rounded-2xl border border-dashed border-sand/40 text-center">
            <p class="font-serif text-lg text-charcoal mb-2">No tenés suscripción activa</p>
            <p class="text-sm text-charcoal/50 mb-4">Recibí tu café cada mes y ahorrá con envío gratis permanente.</p>
            <a href="/tienda" class="inline-block px-5 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors">
              Ver suscripciones
            </a>
          </section>
        )}
        {/* Tu rango */}
        <section class="p-6 md:p-8 rounded-2xl border border-sand/40 bg-sand/10">
          <div class="flex items-center justify-between mb-4">
            <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium">Tu rango</p>
            <span class="text-xs font-serif text-navy">{rank.name}</span>
          </div>
          <div class="flex items-baseline gap-3 mb-2">
            <p class="font-serif text-5xl font-bold text-charcoal tracking-[-0.02em]">{profile.rankPoints.toLocaleString('es-MX')}</p>
            <p class="text-sm text-charcoal/40">/ {next ? next.minPoints.toLocaleString('es-MX') : '∞'} pts</p>
          </div>
          {next && (
            <>
              <div class="h-2 rounded-full bg-sand/50 overflow-hidden mb-2">
                <div class="h-full bg-navy rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <p class="text-xs text-charcoal/50">Te faltan <span class="font-medium text-charcoal">{toNext.toLocaleString('es-MX')}</span> pts para <span class="text-navy font-medium">{next.name}</span></p>
            </>
          )}
          {!next && <p class="text-sm text-coffee">Eres Icónico. El nivel máximo. Tu nombre va en la bolsa del año. ☕</p>}

          <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-sand/30">
            <div>
              <p class="font-serif text-2xl font-bold text-charcoal">{rank.multiplier.toFixed(2)}x</p>
              <p class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40 mt-1">Multiplicador</p>
            </div>
            <div>
              <p class="font-serif text-2xl font-bold text-charcoal">{rank.cashbackPct}%</p>
              <p class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40 mt-1">Cashback efectivo</p>
            </div>
            <div>
              <p class="font-serif text-2xl font-bold text-charcoal">
                {rank.freeShipping === 'none' ? '—' : rank.freeShipping === 'both' ? '✓+' : '✓'}
              </p>
              <p class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40 mt-1">Envío gratis</p>
            </div>
          </div>
        </section>

        {/* Puntos canjeables */}
        <section class="p-6 md:p-8 rounded-2xl border border-sand/40 bg-coffee/5">
          <div class="flex items-center justify-between mb-4">
            <p class="text-[0.625rem] tracking-[0.2em] uppercase text-coffee/60 font-medium">Tus puntos canjeables</p>
            <span class="text-xs text-coffee/60">Cashback</span>
          </div>
          <div class="flex items-baseline gap-3 mb-3">
            <p class="font-serif text-5xl font-bold text-charcoal tracking-[-0.02em]">{profile.redeemablePoints.toLocaleString('es-MX')}</p>
            <p class="text-sm text-charcoal/40">pts</p>
          </div>
          <p class="text-sm text-charcoal/60 mb-1">
            Equivale a <span class="text-coffee font-semibold">${(profile.redeemablePoints * POINTS_TO_PESOS).toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN</span> en productos canjeables
          </p>
          {profile.redeemableExpiring.amount > 0 && (
            <p class="text-xs text-coffee/70 mt-3">
              {profile.redeemableExpiring.amount} pts expiran en {profile.redeemableExpiring.daysUntil} días. <a href="/cuenta/canjear" class="underline underline-offset-2">Canjear ahora</a>
            </p>
          )}

          <a href="/cuenta/canjear" class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200">
            Ver catálogo canjeable
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </section>

        {/* Historial */}
        <section class="p-6 md:p-8 rounded-2xl border border-sand/40">
          <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium mb-4">Historial de puntos</p>
          {profile.pointsHistory.length === 0 ? (
            <p class="text-sm text-charcoal/40 text-center py-8">Sin movimientos aún.</p>
          ) : (
            <div class="divide-y divide-sand/30">
              {profile.pointsHistory.map((t) => (
                <div key={t.id} class="py-3 flex items-center justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-charcoal">{t.description}</p>
                    <p class="text-[0.6875rem] text-charcoal/40 mt-0.5">{t.date}</p>
                  </div>
                  <div class="text-right shrink-0">
                    {t.rankDelta !== 0 && (
                      <p class={`text-xs font-medium ${t.rankDelta > 0 ? 'text-navy' : 'text-charcoal/30'}`}>
                        {t.rankDelta > 0 ? '+' : ''}{t.rankDelta} rango
                      </p>
                    )}
                    {t.redeemableDelta !== 0 && (
                      <p class={`text-xs font-medium ${t.redeemableDelta > 0 ? 'text-coffee' : 'text-charcoal/30'}`}>
                        {t.redeemableDelta > 0 ? '+' : ''}{t.redeemableDelta} canje
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal pausar/cancelar */}
      {action && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setAction(null)} />
          <div class="relative w-full max-w-md p-6 rounded-2xl bg-cream border border-sand/40">
            {action === 'pause' ? (
              <>
                <h3 class="font-serif text-2xl font-bold text-charcoal mb-2">Pausar suscripción</h3>
                <p class="text-sm text-charcoal/60 mb-5">Elegí cuántos meses querés pausar. No se te cobra durante este período.</p>
                <div class="grid grid-cols-3 gap-3 mb-5">
                  {[1, 2, 3].map((m) => {
                    const until = new Date();
                    until.setMonth(until.getMonth() + m);
                    const untilStr = until.toISOString().slice(0, 10);
                    return (
                      <button
                        key={m}
                        onClick={() => { updateSub('paused', untilStr); setAction(null); }}
                        class="p-4 rounded-xl border-2 border-sand/40 hover:border-navy hover:bg-navy/5 transition-colors text-center cursor-pointer"
                      >
                        <p class="font-serif text-2xl font-bold text-charcoal">{m}</p>
                        <p class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/50 mt-1">mes{m > 1 ? 'es' : ''}</p>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setAction(null)} class="w-full px-4 py-2.5 rounded-full border border-sand/40 text-sm text-charcoal/60 hover:border-charcoal/40 transition-colors cursor-pointer">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h3 class="font-serif text-2xl font-bold text-charcoal mb-2">¿Cancelar suscripción?</h3>
                <p class="text-sm text-charcoal/60 mb-5">Tu próxima renovación será el <span class="text-charcoal font-medium">{profile.subscription?.nextBilling}</span>. Después ya no se te cobra más.</p>
                <p class="text-xs text-coffee/70 mb-5">Vas a perder envío gratis permanente y la congelación de tu rango Icónico.</p>
                <div class="flex gap-3">
                  <button onClick={() => setAction(null)} class="flex-1 px-4 py-3 rounded-full border border-sand/40 text-sm text-charcoal/70 hover:border-charcoal/40 transition-colors cursor-pointer">
                    Volver
                  </button>
                  <button onClick={() => { updateSub('cancelled'); setAction(null); }} class="flex-1 px-4 py-3 rounded-full bg-coffee text-cream text-sm font-medium hover:bg-coffee/90 transition-colors cursor-pointer">
                    Sí, cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
