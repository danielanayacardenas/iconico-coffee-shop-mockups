// src/components/ProfileSwitcher.tsx
// Dropdown flotante para cambiar entre los 3 perfiles mockeados.
// Solo visible en /cuenta/*, /admin/*, /dev/*.

import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $mockProfileId, setMockProfile, MOCK_PROFILES } from '../mocks/session';
import type { MockProfileId } from '../mocks/types';

export default function ProfileSwitcher() {
  const id = useStore($mockProfileId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-switcher]')) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  return (
    <div data-profile-switcher class="fixed top-4 right-4 z-[60]">
      <button
        onClick={() => setOpen(!open)}
        class="flex items-center gap-2 px-3 py-2 rounded-full bg-cream border border-sand/40 shadow-sm hover:border-navy/30 transition-colors duration-200 cursor-pointer"
        aria-label="Cambiar perfil mock"
        aria-expanded={open}
      >
        <span class="w-2 h-2 rounded-full bg-navy" />
        <span class="text-xs font-medium text-charcoal">{MOCK_PROFILES[id].label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={`text-charcoal/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div class="absolute top-full right-0 mt-2 w-72 bg-cream border border-sand/40 rounded-2xl shadow-lg overflow-hidden">
          <div class="px-4 py-3 border-b border-sand/30">
            <p class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium">Perfil activo (mock)</p>
            <p class="text-xs text-charcoal/60 mt-1">Solo visible en mockups. Cambia para ver cada pantalla con datos distintos.</p>
          </div>
          {(Object.keys(MOCK_PROFILES) as MockProfileId[]).map((pid) => {
            const p = MOCK_PROFILES[pid];
            const isActive = pid === id;
            return (
              <button
                key={pid}
                onClick={() => { setMockProfile(pid); setOpen(false); }}
                class="w-full text-left px-4 py-3 hover:bg-sand/30 transition-colors duration-150 cursor-pointer flex items-start gap-3"
              >
                <span class={`mt-1 w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-navy' : 'bg-charcoal/20'}`} />
                <div class="flex-1 min-w-0">
                  <p class={`text-sm font-medium ${isActive ? 'text-navy' : 'text-charcoal'}`}>{p.label}</p>
                  <p class="text-[0.6875rem] text-charcoal/50 mt-0.5">
                    {p.hasAccount ? `${p.rankPoints.toLocaleString('es-MX')} pts rango · ${p.redeemablePoints.toLocaleString('es-MX')} pts canjeables` : 'sin cuenta, sin puntos'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
