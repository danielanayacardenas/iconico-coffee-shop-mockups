// src/components/admin/RedeemablesAdmin.tsx
// HU-17: Admin gestiona catálogo canjeable

import { useState } from 'react';
import { REDEEMABLES, type RedeemableProduct } from '../../mocks/redeemables';
import { RANKS } from '../../mocks/ranks';
import AccountLayout from '../../components/cuenta/AccountLayout';
import AccessGate from './AccessGate';

function IconBox() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; }
function IconTrophy() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3"/></svg>; }
function IconGift() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>; }

const navItems = [
  { href: '/admin/productos', label: 'Productos', icon: <IconBox /> },
  { href: '/admin/rangos', label: 'Rangos', icon: <IconTrophy /> },
  { href: '/admin/canjeables', label: 'Canjeables', icon: <IconGift />, active: true },
];

export default function RedeemablesAdmin() {
  const [editing, setEditing] = useState<RedeemableProduct | null>(null);

  return (
    <AccessGate>
      <AccountLayout variant="admin" title="Canjeables" subtitle="Productos exclusivos por puntos" navItems={navItems}>
        <div class="flex items-center justify-between mb-5">
          <p class="text-sm text-charcoal/60">5 productos · 4 disponibles · 1 agotado</p>
          <button class="px-4 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200 cursor-pointer flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo canjeable
          </button>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          {REDEEMABLES.map((p) => (
            <article key={p.id} class={`p-5 rounded-2xl border ${p.inStock ? 'border-sand/40' : 'border-sand/30 opacity-60'}`}>
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg bg-sand/30 flex items-center justify-center">
                  <IconGift />
                </div>
                <button
                  class={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${p.inStock ? 'bg-sage' : 'bg-sand/50'}`}
                >
                  <span class={`absolute top-0.5 w-4 h-4 rounded-full bg-cream shadow transition-transform duration-200 ${p.inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <h3 class="font-serif text-base font-bold text-charcoal mb-1">{p.name}</h3>
              <p class="text-xs text-charcoal/60 leading-relaxed mb-3 line-clamp-2">{p.description}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="text-charcoal/50">Costo: <span class="font-bold text-navy">{p.cost.toLocaleString('es-MX')} pts</span></span>
                <span class="text-charcoal/50">Stock: {p.stock === 999 ? '∞' : p.stock}</span>
              </div>
              <div class="mt-3 pt-3 border-t border-sand/30 flex items-center justify-between text-xs">
                <span class="text-charcoal/50">Mín: {RANKS.find((r) => r.level === p.minRank)?.name}</span>
                <button onClick={() => setEditing(p)} class="text-navy hover:underline cursor-pointer">Editar</button>
              </div>
            </article>
          ))}
        </div>

        {editing && (
          <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setEditing(null)} />
            <div class="relative w-full max-w-xl p-6 md:p-8 rounded-2xl bg-cream border border-sand/40 max-h-[90vh] overflow-y-auto">
              <h3 class="font-serif text-2xl font-bold text-charcoal mb-5">Editar canjeable</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Nombre</label>
                  <input defaultValue={editing.name} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Descripción</label>
                  <textarea rows={2} defaultValue={editing.description} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none resize-none" />
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Costo (pts)</label>
                    <input defaultValue={editing.cost} type="number" class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Stock</label>
                    <input defaultValue={editing.stock === 999 ? 999 : editing.stock} type="number" class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Rango mín.</label>
                    <select defaultValue={editing.minRank} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none">
                      {RANKS.map((r) => (
                        <option key={r.level} value={r.level}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div class="flex gap-3 mt-6">
                <button onClick={() => setEditing(null)} class="flex-1 px-4 py-3 rounded-full border border-sand/40 text-sm text-charcoal/70 hover:border-charcoal/40 transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button onClick={() => setEditing(null)} class="flex-1 px-4 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors cursor-pointer">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </AccountLayout>
    </AccessGate>
  );
}
