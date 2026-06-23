// src/components/admin/AccessGate.tsx
// Helper para bloquear /admin si el perfil activo no es admin.
// En este mockup, solo Diego es admin. El switcher arriba permite cambiar.

import type { ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { $mockProfile } from '../../mocks/session';

export default function AccessGate({ children }: { children: ReactNode }) {
  const profile = useStore($mockProfile);

  if (!profile.isAdmin) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center px-6">
        <div class="max-w-md w-full text-center">
          <div class="w-14 h-14 rounded-full bg-coffee/10 flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 class="font-serif text-2xl font-bold text-charcoal mb-2">Acceso restringido</h2>
          <p class="text-sm text-charcoal/60 mb-5">Esta sección es solo para administradores del sistema.</p>
          <p class="text-xs text-charcoal/40">Tip: cambiá al perfil <span class="text-navy font-medium">Diego (Icónico · admin)</span> usando el switcher arriba a la derecha para ver esta sección.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
