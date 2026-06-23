// src/mocks/session.ts
// Nanostore del perfil activo mockeado.
// Persiste en localStorage para que el switcher sobreviva a recargas.

import { atom } from 'nanostores';
import { MOCK_PROFILES } from './profiles';
import type { MockProfile, MockProfileId } from './types';

export { MOCK_PROFILES };

const STORAGE_KEY = 'iconico-mock-profile';

function loadInitial(): MockProfileId {
  if (typeof window === 'undefined') return 'visitante';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in MOCK_PROFILES) return saved as MockProfileId;
  } catch {}
  return 'visitante';
}

export const $mockProfileId = atom<MockProfileId>(loadInitial());

if (typeof window !== 'undefined') {
  $mockProfileId.subscribe((id) => {
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
  });
}

export function setMockProfile(id: MockProfileId) {
  $mockProfileId.set(id);
}

export function getMockProfile(id: MockProfileId): MockProfile {
  return MOCK_PROFILES[id];
}

// Derived: el perfil activo como objeto (re-render cuando cambia el id).
import { computed } from 'nanostores';
export const $mockProfile = computed($mockProfileId, (id) => MOCK_PROFILES[id]);

// Helpers de mutación (mockean lo que sería backend).
export function deductRedeemablePoints(amount: number) {
  const current = $mockProfileId.get();
  const profile = MOCK_PROFILES[current];
  if (profile.redeemablePoints < amount) return;
  profile.redeemablePoints -= amount;
  profile.pointsHistory.unshift({
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    type: 'redeem',
    rankDelta: 0,
    redeemableDelta: -amount,
    description: `Canje de ${amount} puntos`,
  });
  // Forzar reactividad reemplazando la ref
  $mockProfileId.set(current);
}
