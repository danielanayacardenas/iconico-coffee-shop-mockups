// src/components/admin/RanksAdmin.tsx
// HU-6: Configurar rangos

import { RANKS } from '../../mocks/ranks';
import AccountLayout from '../../components/cuenta/AccountLayout';
import AccessGate from './AccessGate';

function IconBox() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; }
function IconTrophy() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3"/></svg>; }
function IconGift() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>; }

const navItems = [
  { href: '/admin/productos', label: 'Productos', icon: <IconBox /> },
  { href: '/admin/rangos', label: 'Rangos', icon: <IconTrophy />, active: true },
  { href: '/admin/canjeables', label: 'Canjeables', icon: <IconGift /> },
];

export default function RanksAdmin() {
  return (
    <AccessGate>
      <AccountLayout variant="admin" title="Rangos" subtitle="10 niveles del programa Icónico" navItems={navItems}>
        <p class="text-sm text-charcoal/60 mb-5">
          Los cambios aplican inmediatamente. Reordenar arrastrando las filas.
        </p>

        <div class="space-y-2">
          {RANKS.map((r) => (
            <div key={r.level} class="flex items-center gap-3 p-4 rounded-2xl border border-sand/40 hover:border-navy/30 transition-colors group">
              <button class="text-charcoal/30 hover:text-navy cursor-pointer" aria-label="Arrastrar">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>
                </svg>
              </button>

              <div class="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center text-xs font-bold text-charcoal">
                {r.level}
              </div>

              <div class="flex-1 min-w-0">
                <input defaultValue={r.name} class="w-full bg-transparent text-sm font-semibold text-charcoal focus:outline-none focus:bg-sand/10 rounded px-2 py-1 -mx-2" />
                <input defaultValue={r.perk} class="w-full bg-transparent text-xs text-charcoal/60 focus:outline-none focus:bg-sand/10 rounded px-2 py-1 -mx-2 mt-0.5" />
              </div>

              <div class="hidden sm:flex items-center gap-3 shrink-0">
                <label class="flex flex-col items-end">
                  <span class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40">Pts</span>
                  <input defaultValue={r.minPoints} type="number" class="w-20 px-2 py-1 text-right text-sm font-semibold text-charcoal bg-cream border border-sand/40 rounded-lg focus:border-navy focus:outline-none" />
                </label>
                <label class="flex flex-col items-end">
                  <span class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40">Mult.</span>
                  <input defaultValue={r.multiplier} step="0.05" type="number" class="w-16 px-2 py-1 text-right text-sm font-semibold text-charcoal bg-cream border border-sand/40 rounded-lg focus:border-navy focus:outline-none" />
                </label>
                <label class="flex flex-col items-end">
                  <span class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40">Cash %</span>
                  <input defaultValue={r.cashbackPct} step="0.5" type="number" class="w-16 px-2 py-1 text-right text-sm font-semibold text-charcoal bg-cream border border-sand/40 rounded-lg focus:border-navy focus:outline-none" />
                </label>
                <label class="flex flex-col items-end">
                  <span class="text-[0.625rem] tracking-[0.15em] uppercase text-charcoal/40">Envío</span>
                  <select defaultValue={r.freeShipping} class="w-20 px-2 py-1 text-sm text-charcoal bg-cream border border-sand/40 rounded-lg focus:border-navy focus:outline-none">
                    <option value="none">—</option>
                    <option value="standard">Std</option>
                    <option value="both">Ambos</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div class="mt-6 flex items-center justify-end gap-3">
          <button class="px-5 py-2.5 rounded-full border border-sand/40 text-sm text-charcoal/60 hover:border-charcoal/40 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button class="px-5 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors cursor-pointer">
            Guardar cambios
          </button>
        </div>
      </AccountLayout>
    </AccessGate>
  );
}
