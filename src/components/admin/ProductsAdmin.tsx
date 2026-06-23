// src/components/admin/ProductsAdmin.tsx
// HU-5: Admin CRUD productos (catálogo normal)

import { useState } from 'react';
import AccountLayout from '../../components/cuenta/AccountLayout';
import AccessGate from './AccessGate';

function IconBox() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; }
function IconTrophy() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3"/></svg>; }
function IconGift() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>; }

const navItems = [
  { href: '/admin/productos', label: 'Productos', icon: <IconBox />, active: true },
  { href: '/admin/rangos', label: 'Rangos', icon: <IconTrophy /> },
  { href: '/admin/canjeables', label: 'Canjeables', icon: <IconGift /> },
];

const MOCK_ADMIN_PRODUCTS = [
  { id: 'casa', name: 'Casa', price: 14500, category: 'blend', inStock: true, badge: 'Más vendido' },
  { id: 'descafeinado', name: 'Descafeinado', price: 15500, category: 'decaf', inStock: true, badge: null },
  { id: 'microlote', name: 'Microlote Geisha', price: 22000, category: 'microlote', inStock: true, badge: 'Nuevo' },
  { id: 'pack-casa', name: 'Pack Descubrimiento', price: 38000, category: 'pack', inStock: true, badge: null },
  { id: 'suscripcion', name: 'Suscripción Mensual', price: 13050, category: 'subscription', inStock: true, badge: 'Ahorrá 10%' },
];

export default function ProductsAdmin() {
  const [editing, setEditing] = useState<typeof MOCK_ADMIN_PRODUCTS[0] | null>(null);

  return (
    <AccessGate>
      <AccountLayout variant="admin" title="Productos" subtitle="CRUD del catálogo normal" navItems={navItems}>
        <div class="flex items-center justify-between mb-5">
          <p class="text-sm text-charcoal/60">5 productos · 5 activos</p>
          <button class="px-4 py-2.5 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200 cursor-pointer flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo producto
          </button>
        </div>

        <div class="rounded-2xl border border-sand/40 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-sand/10 text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40">
              <tr>
                <th class="text-left px-5 py-3 font-medium">Producto</th>
                <th class="text-left px-5 py-3 font-medium">Categoría</th>
                <th class="text-right px-5 py-3 font-medium">Precio</th>
                <th class="text-left px-5 py-3 font-medium">Badge</th>
                <th class="text-center px-5 py-3 font-medium">Estado</th>
                <th class="text-right px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand/30">
              {MOCK_ADMIN_PRODUCTS.map((p) => (
                <tr key={p.id} class="hover:bg-sand/5 transition-colors">
                  <td class="px-5 py-4">
                    <p class="font-medium text-charcoal">{p.name}</p>
                    <p class="text-[0.625rem] text-charcoal/40 mt-0.5 font-mono">{p.id}</p>
                  </td>
                  <td class="px-5 py-4 text-charcoal/60 capitalize">{p.category}</td>
                  <td class="px-5 py-4 text-right text-charcoal">${(p.price / 100).toLocaleString('es-MX')}</td>
                  <td class="px-5 py-4">
                    {p.badge ? (
                      <span class="px-2 py-1 rounded-full bg-navy/10 text-navy text-[0.6875rem] font-medium">{p.badge}</span>
                    ) : (
                      <span class="text-charcoal/30">—</span>
                    )}
                  </td>
                  <td class="px-5 py-4 text-center">
                    <button class={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${p.inStock ? 'bg-sage' : 'bg-sand/50'}`}>
                      <span class={`absolute top-0.5 w-4 h-4 rounded-full bg-cream shadow transition-transform duration-200 ${p.inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <button onClick={() => setEditing(p)} class="text-xs text-navy hover:underline cursor-pointer">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal edición */}
        {editing && (
          <div class="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setEditing(null)} />
            <div class="relative w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-cream border border-sand/40 max-h-[90vh] overflow-y-auto">
              <h3 class="font-serif text-2xl font-bold text-charcoal mb-1">Editar producto</h3>
              <p class="text-xs text-charcoal/50 mb-5 font-mono">{editing.id}</p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Imagen</label>
                  <div class="w-full h-32 rounded-xl border-2 border-dashed border-sand/40 flex items-center justify-center text-xs text-charcoal/40 cursor-pointer hover:border-navy/30 transition-colors">
                    Click para subir (decorativo)
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Nombre</label>
                  <input defaultValue={editing.name} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Precio (centavos)</label>
                  <input defaultValue={editing.price} type="number" class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Descripción</label>
                  <textarea rows={3} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none resize-none" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Categoría</label>
                  <select class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none capitalize">
                    {['blend', 'decaf', 'microlote', 'pack', 'subscription'].map((c) => (
                      <option key={c} selected={c === editing.category}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Badge</label>
                  <input defaultValue={editing.badge ?? ''} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm focus:border-navy focus:outline-none" />
                </div>
              </div>
              <div class="flex gap-3 mt-6">
                <button onClick={() => setEditing(null)} class="flex-1 px-4 py-3 rounded-full border border-sand/40 text-sm text-charcoal/70 hover:border-charcoal/40 transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button onClick={() => setEditing(null)} class="flex-1 px-4 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors cursor-pointer">
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </AccountLayout>
    </AccessGate>
  );
}
