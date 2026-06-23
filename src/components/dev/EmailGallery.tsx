// src/components/dev/EmailGallery.tsx
// HU-11 (puntos ganados), HU-12 (rank up), HU-15 (inactividad), + 8 más.
// Galería de los 11 emails transaccionales del PRD §7.
// Renderizados como "preview" con datos del perfil activo.

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $mockProfile } from '../../mocks/session';
import { RANKS, POINTS_TO_PESOS, getNextRank, getRankByPoints } from '../../mocks/ranks';

type EmailKey =
  | 'welcome'
  | 'order-confirmation'
  | 'order-confirmation-guest'
  | 'rank-up'
  | 'subscription-renewed'
  | 'subscription-cancelled'
  | 'redeem-confirmation'
  | 'inactivity-warning'
  | 'we-miss-you'
  | 'points-expiring'
  | 'free-shipping-unlocked';

interface EmailMeta {
  key: EmailKey;
  subject: string;
  trigger: string;
  hu: string;
}

const EMAILS: EmailMeta[] = [
  { key: 'welcome',                       subject: 'Bienvenido a Icónico',                       trigger: 'Registro',                      hu: 'HU-2' },
  { key: 'order-confirmation-guest',      subject: 'Tu pedido fue confirmado',                   trigger: 'Pedido guest',                  hu: 'HU-1' },
  { key: 'order-confirmation',            subject: 'Tu pedido fue confirmado',                   trigger: 'Pedido user',                   hu: 'HU-11' },
  { key: 'rank-up',                       subject: '¡Subiste de rango!',                          trigger: 'Cambio de rango',               hu: 'HU-12' },
  { key: 'subscription-renewed',          subject: 'Tu suscripción se renovó',                   trigger: 'Cobro mensual',                 hu: 'HU-4' },
  { key: 'subscription-cancelled',        subject: 'Tu suscripción fue cancelada',               trigger: 'Cancelación',                   hu: 'HU-7' },
  { key: 'redeem-confirmation',           subject: '¡Canje confirmado!',                          trigger: 'Canje de puntos',               hu: 'HU-13' },
  { key: 'inactivity-warning',            subject: 'Te extrañamos',                               trigger: '5 meses sin comprar',           hu: 'HU-15' },
  { key: 'we-miss-you',                   subject: 'Hay café nuevo esperándote',                  trigger: '30 días sin comprar',           hu: 'HU-15' },
  { key: 'points-expiring',               subject: 'Tus puntos están por expirar',                trigger: 'Puntos a punto de expirar',     hu: 'HU-15' },
  { key: 'free-shipping-unlocked',        subject: '¡Envío gratis desbloqueado!',                 trigger: 'Subtotal ≥ $1,900',             hu: 'HU-14' },
];

function EmailFrame({ subject, children, from = 'Icónico Café <hola@iconico.cafe>' }: { subject: string; children: any; from?: string }) {
  return (
    <div class="rounded-2xl border border-sand/40 overflow-hidden bg-cream">
      <div class="px-5 py-3 border-b border-sand/30 bg-sand/10">
        <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium">{from}</p>
        <p class="text-sm font-semibold text-charcoal mt-1">{subject}</p>
      </div>
      <div class="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function EmailBody({ children }: { children: any }) {
  return <div class="font-sans text-sm text-charcoal/80 leading-relaxed max-w-prose">{children}</div>;
}

function EmailCta({ href, children }: { href: string; children: any }) {
  return (
    <a href={href} onclick="event.preventDefault()" class="inline-block mt-4 px-6 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors">
      {children}
    </a>
  );
}

function renderEmail(key: EmailKey, profile: any) {
  const rank = RANKS.find((r) => r.level === profile.rank) ?? RANKS[0];

  switch (key) {
    case 'welcome':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Hola!</h1>
          <p>Bienvenido a Icónico. Creamos esta tienda para gente que ama el café y valora la lealtad.</p>
          <p class="mt-3">Como <span class="text-navy font-medium">{rank.name}</span>, cada compra que hagas suma puntos a tu rango y te devuelve cashback real (1 punto = $0.10 MXN).</p>
          <p class="mt-3">Empezás en rango <span class="text-navy font-medium">Grano</span> con multiplicador 1.00x. Si llegás a Icónico, tu nombre va en la bolsa del año.</p>
          <EmailCta href="/tienda">Explorar la tienda</EmailCta>
        </EmailBody>
      );

    case 'order-confirmation-guest':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Gracias por tu compra!</h1>
          <p>Tu pedido <span class="text-coffee">ICN-2026-XXXX</span> fue confirmado. Te enviamos el seguimiento por email en las próximas horas.</p>
          <p class="mt-4 font-medium text-charcoal">Si te hubieras registrado, habrías ganado:</p>
          <div class="mt-3 flex items-center gap-6 p-4 rounded-xl bg-sand/20">
            <div>
              <p class="font-serif text-2xl font-bold text-navy">1,200</p>
              <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 mt-1">pts rango</p>
            </div>
            <div>
              <p class="font-serif text-2xl font-bold text-coffee">120</p>
              <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 mt-1">pts canjeables ($12 MXN)</p>
            </div>
          </div>
          <EmailCta href="/auth/login">Crear cuenta y guardar mis puntos</EmailCta>
        </EmailBody>
      );

    case 'order-confirmation':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Gracias, {profile.email.split('@')[0]}!</h1>
          <p>Tu pedido <span class="text-coffee">ICN-2026-0142</span> fue confirmado.</p>
          <p class="mt-4 font-medium text-charcoal">Sumaste a tu cuenta:</p>
          <div class="mt-3 flex items-center gap-6 p-4 rounded-xl bg-sand/20">
            <div>
              <p class="font-serif text-2xl font-bold text-navy">+612</p>
              <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 mt-1">pts rango</p>
            </div>
            <div>
              <p class="font-serif text-2xl font-bold text-coffee">+61</p>
              <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 mt-1">pts canjeables</p>
            </div>
          </div>
          <p class="mt-4 text-charcoal/60">Rango actual: <span class="text-navy font-medium">{rank.name}</span> · {rank.multiplier.toFixed(2)}x · {rank.cashbackPct}% cashback</p>
          <EmailCta href="/cuenta/pedidos">Ver mis pedidos</EmailCta>
        </EmailBody>
      );

    case 'rank-up':
      const next = getNextRank(profile.rank);
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Subiste a {next?.name ?? 'Icónico'}!</h1>
          <p>Cada compra te acerca más. Acabás de subir de rango.</p>
          <div class="mt-4 p-5 rounded-2xl bg-navy/5 border border-navy/20">
            <p class="text-[0.625rem] tracking-[0.2em] uppercase text-navy/70 font-medium">Tus nuevos beneficios</p>
            <p class="font-serif text-4xl font-bold text-navy mt-2">{next?.multiplier.toFixed(2)}x</p>
            <p class="text-xs text-charcoal/60 mt-1">Multiplicador de puntos</p>
            <p class="font-serif text-2xl font-bold text-coffee mt-3">{next?.cashbackPct}%</p>
            <p class="text-xs text-charcoal/60 mt-1">Cashback efectivo</p>
            <p class="text-sm text-charcoal/80 mt-3">{next?.perk}</p>
          </div>
          <EmailCta href="/cuenta">Ver mi cuenta</EmailCta>
        </EmailBody>
      );

    case 'subscription-renewed':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">Tu suscripción se renovó</h1>
          <p>Cobramos <span class="text-charcoal font-medium">${((profile.subscription?.monthlyPrice ?? 0) / 100).toLocaleString('es-MX')} MXN</span> por <span class="text-coffee">{profile.subscription?.productName}</span>.</p>
          <p class="mt-2">Próxima renovación: <span class="text-charcoal font-medium">{profile.subscription?.nextBilling}</span></p>
          <div class="mt-4 p-4 rounded-xl bg-sand/20">
            <p class="text-xs text-charcoal/60">Esta compra sumó</p>
            <p class="font-serif text-xl font-bold text-navy mt-1">+157 rango · +16 canjeables</p>
          </div>
          <EmailCta href="/cuenta/pedidos">Ver recibo</EmailCta>
        </EmailBody>
      );

    case 'subscription-cancelled':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">Suscripción cancelada</h1>
          <p>Tu suscripción a <span class="text-coffee">{profile.subscription?.productName}</span> fue cancelada. No se te cobrará más.</p>
          <p class="mt-3 text-charcoal/60">Tu rango {rank.name} queda activo, pero ya no estará congelado. Si dejás de comprar 6 meses, bajás un nivel.</p>
          <p class="mt-3 text-charcoal/60">Podés reactivar cuando quieras.</p>
          <EmailCta href="/tienda">Volver a la tienda</EmailCta>
        </EmailBody>
      );

    case 'redeem-confirmation':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Canje confirmado!</h1>
          <p>Canjeaste <span class="text-coffee font-medium">2,000 pts</span> por <span class="text-coffee">Catación presencial</span>.</p>
          <p class="mt-3">Nuestro equipo te contactará en 24-48h hábiles para coordinar fecha y hora.</p>
          <p class="mt-3 text-charcoal/60">Saldo restante: <span class="text-charcoal font-medium">450 pts canjeables</span></p>
          <EmailCta href="/cuenta/canjear">Ver más canjes</EmailCta>
        </EmailBody>
      );

    case 'inactivity-warning':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">Te extrañamos</h1>
          <p>Hace 5 meses que no comprás. Tu rango <span class="text-navy font-medium">{rank.name}</span> está por bajar a <span class="text-charcoal">{RANKS.find((r) => r.level === profile.rank - 1)?.name ?? 'Grano'}</span> en 30 días.</p>
          <p class="mt-3">Una sola compra lo mantiene. Y si reactivás tu suscripción, el rango queda congelado.</p>
          <EmailCta href="/tienda">Ver novedades</EmailCta>
        </EmailBody>
      );

    case 'we-miss-you':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">Hay café nuevo esperándote</h1>
          <p>Tiene 30 días desde tu última compra. Acaban de llegar microlotes nuevos que no querés perderte.</p>
          <p class="mt-3 text-charcoal/60">Además, esta semana tenés <span class="text-coffee font-medium">envío gratis en pedidos +$1,200 MXN</span>.</p>
          <EmailCta href="/tienda">Explorar microlotes</EmailCta>
        </EmailBody>
      );

    case 'points-expiring':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">Tus puntos están por expirar</h1>
          <p><span class="text-coffee font-medium">{profile.redeemableExpiring.amount} pts canjeables</span> expiran en <span class="text-charcoal font-medium">{profile.redeemableExpiring.daysUntil} días</span>.</p>
          <p class="mt-3">Equivalen a <span class="text-coffee">${(profile.redeemableExpiring.amount * POINTS_TO_PESOS).toLocaleString('es-MX')} MXN</span> en productos canjeables.</p>
          <p class="mt-3 text-charcoal/60">Si los usás, mantenés tu rango y sumás nuevos puntos por la compra del canje.</p>
          <EmailCta href="/cuenta/canjear">Canjear ahora</EmailCta>
        </EmailBody>
      );

    case 'free-shipping-unlocked':
      return (
        <EmailBody>
          <h1 class="font-serif text-3xl font-bold text-charcoal mb-3">¡Envío gratis desbloqueado!</h1>
          <p>Tu pedido pasó los $1,900 MXN. El envío estándar corre por nuestra cuenta.</p>
          <p class="mt-3 text-charcoal/60">Esta compra también te acerca a un nuevo rango.</p>
          <EmailCta href="/cuenta/pedidos">Ver pedido</EmailCta>
        </EmailBody>
      );
  }
}

export default function EmailGallery() {
  const profile = useStore($mockProfile);
  const [active, setActive] = useState<EmailKey>('order-confirmation');

  return (
    <div class="min-h-screen pt-20 pb-16">
      <div class="max-w-6xl mx-auto px-6 md:px-12">
        <div class="mb-8">
          <h1 class="font-serif text-4xl font-bold text-charcoal tracking-[-0.02em]">Emails transaccionales</h1>
          <p class="text-sm text-charcoal/50 mt-2">Los 11 disparadores del PRD §7, previsualizados con datos del perfil activo. Cambiá de perfil arriba para ver cada email con datos distintos.</p>
        </div>

        <div class="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside class="space-y-1">
            {EMAILS.map((e) => {
              const isActive = active === e.key;
              return (
                <button
                  key={e.key}
                  onClick={() => setActive(e.key)}
                  class={`w-full text-left p-3 rounded-xl border transition-colors duration-200 cursor-pointer ${
                    isActive ? 'border-navy bg-navy/5' : 'border-sand/30 hover:border-navy/30'
                  }`}
                >
                  <p class={`text-xs font-medium ${isActive ? 'text-navy' : 'text-charcoal'}`}>{e.subject}</p>
                  <p class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40 mt-1">{e.hu} · {e.trigger}</p>
                </button>
              );
            })}
          </aside>

          <div>
            <EmailFrame subject={EMAILS.find((e) => e.key === active)!.subject}>
              {renderEmail(active, profile)}
            </EmailFrame>
            <p class="mt-4 text-[0.6875rem] text-charcoal/40 text-center">
              Solo preview. En producción lo envía Resend según el disparador correspondiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
