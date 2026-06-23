// src/components/cuenta/ProfileApp.tsx
// HU-10: Editar perfil y direcciones
// Solo mock — los cambios no se persisten, pero la UI funciona.

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
  { href: '/cuenta/pedidos', label: 'Mis pedidos', icon: <IconOrders /> },
  { href: '/cuenta/canjear', label: 'Canjear puntos', icon: <IconGift /> },
  { href: '/cuenta/perfil', label: 'Perfil y direcciones', icon: <IconUser />, active: true },
];

export default function ProfileApp() {
  const profile = useStore($mockProfile);
  const [saved, setSaved] = useState(false);

  const initial = profile.addresses[0] ?? { fullName: '', street: '', city: '', state: '', postalCode: '', phone: '' };
  const [name, setName] = useState(initial.fullName);
  const [street, setStreet] = useState(initial.street);
  const [city, setCity] = useState(initial.city);
  const [stateAddr, setStateAddr] = useState(initial.state);
  const [postalCode, setPostalCode] = useState(initial.postalCode);
  const [phone, setPhone] = useState(initial.phone);

  if (!profile.hasAccount) {
    return (
      <AccountLayout variant="cuenta" title="Perfil" navItems={navItems}>
        <p class="text-sm text-charcoal/50 text-center py-12">Inicia sesión para editar tu perfil.</p>
      </AccountLayout>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AccountLayout variant="cuenta" title="Perfil y direcciones" navItems={navItems}>
      <form onSubmit={handleSave} class="space-y-6">
        <section class="p-6 md:p-8 rounded-2xl border border-sand/40 space-y-5">
          <div>
            <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium">Datos personales</p>
            <p class="text-xs text-charcoal/50 mt-1">Esta información aparece en tus pedidos y emails.</p>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Email</label>
              <input value={profile.email} disabled class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-sand/20 text-sm text-charcoal/50" />
            </div>
            <div>
              <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Nombre completo</label>
              <input value={name} onChange={(e) => setName(e.target.value)} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal focus:border-navy focus:outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Teléfono</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal focus:border-navy focus:outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Miembro desde</label>
              <input value={profile.joinedAt} disabled class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-sand/20 text-sm text-charcoal/50" />
            </div>
          </div>
        </section>

        <section class="p-6 md:p-8 rounded-2xl border border-sand/40 space-y-5">
          <div>
            <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium">Dirección principal</p>
            <p class="text-xs text-charcoal/50 mt-1">Se precarga automáticamente en el checkout.</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Calle y número</label>
              <input value={street} onChange={(e) => setStreet(e.target.value)} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal focus:border-navy focus:outline-none transition-colors" />
            </div>
            <div class="grid sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-charcoal/70 mb-1.5">CP</label>
                <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} maxLength={5} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal focus:border-navy focus:outline-none transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Ciudad</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal focus:border-navy focus:outline-none transition-colors" />
              </div>
              <div>
                <label class="block text-xs font-medium text-charcoal/70 mb-1.5">Estado</label>
                <input value={stateAddr} onChange={(e) => setStateAddr(e.target.value)} class="w-full px-4 py-3 rounded-xl border border-sand/40 bg-cream text-sm text-charcoal focus:border-navy focus:outline-none transition-colors" />
              </div>
            </div>
          </div>
        </section>

        <div class="flex items-center justify-between">
          <p class={`text-xs text-sage transition-opacity duration-200 ${saved ? 'opacity-100' : 'opacity-0'}`}>
            Cambios guardados
          </p>
          <button type="submit" class="px-6 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-colors duration-200 cursor-pointer">
            Guardar cambios
          </button>
        </div>
      </form>
    </AccountLayout>
  );
}
