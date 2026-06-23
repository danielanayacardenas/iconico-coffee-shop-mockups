import { atom } from 'nanostores';
import type { ShopMode, ShopSection } from '../types';

export const $shopMode = atom<ShopMode>('explorador');
export const $activeSection = atom<ShopSection>('todos');
export const $activeOrigins = atom<string[]>([]);
export const $activeRoasts = atom<string[]>([]);
export const $priceRange = atom<[number, number]>([0, 100000]);

export function toggleMode() {
  $shopMode.set($shopMode.get() === 'explorador' ? 'experto' : 'explorador');
}

export function setSection(section: ShopSection) {
  $activeSection.set(section);
}

export function toggleOrigin(origin: string) {
  const current = $activeOrigins.get();
  $activeOrigins.set(
    current.includes(origin) ? current.filter((o) => o !== origin) : [...current, origin]
  );
}

export function toggleRoast(roast: string) {
  const current = $activeRoasts.get();
  $activeRoasts.set(
    current.includes(roast) ? current.filter((r) => r !== roast) : [...current, roast]
  );
}

export function setPriceRange(range: [number, number]) {
  $priceRange.set(range);
}

export function clearFilters() {
  $activeOrigins.set([]);
  $activeRoasts.set([]);
  $priceRange.set([0, 100000]);
}
