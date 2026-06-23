// src/mocks/ranks.ts
// Tabla de los 10 rangos del programa Icónico.
// Espejo exacto de ProductRequirements.md §3.3.

export interface RankDef {
  level: number;
  name: string;
  minPoints: number;
  multiplier: number;     // ej 1.20
  cashbackPct: number;    // ej 12 (% display, no fraccional)
  freeShipping: 'none' | 'standard' | 'both';
  perk: string;
}

export const RANKS: RankDef[] = [
  { level: 1,  name: 'Grano',     minPoints: 0,      multiplier: 1.00, cashbackPct: 10,   freeShipping: 'none',     perk: 'Acumulación base' },
  { level: 2,  name: 'Tueste',    minPoints: 200,    multiplier: 1.05, cashbackPct: 10.5, freeShipping: 'none',     perk: 'Acceso a catas mensuales' },
  { level: 3,  name: 'Cata',      minPoints: 500,    multiplier: 1.10, cashbackPct: 11,   freeShipping: 'none',     perk: '5% de descuento en packs' },
  { level: 4,  name: 'Barista',   minPoints: 1000,   multiplier: 1.15, cashbackPct: 11.5, freeShipping: 'none',     perk: 'Envío gratis desde $500' },
  { level: 5,  name: 'Catador',   minPoints: 1800,   multiplier: 1.20, cashbackPct: 12,   freeShipping: 'standard', perk: '10% descuento en suscripciones' },
  { level: 6,  name: 'Maestro',   minPoints: 3000,   multiplier: 1.30, cashbackPct: 13,   freeShipping: 'standard', perk: '1 cata gratis al año' },
  { level: 7,  name: 'Embajador', minPoints: 5000,   multiplier: 1.40, cashbackPct: 14,   freeShipping: 'standard', perk: 'Acceso anticipado a microlotes' },
  { level: 8,  name: 'Sommelier', minPoints: 8000,   multiplier: 1.50, cashbackPct: 15,   freeShipping: 'standard', perk: 'Regalo de cumpleaños' },
  { level: 9,  name: 'Leyenda',   minPoints: 12000,  multiplier: 1.75, cashbackPct: 17.5, freeShipping: 'both',     perk: 'Edición limitada anual gratis' },
  { level: 10, name: 'Icónico',   minPoints: 20000,  multiplier: 2.00, cashbackPct: 20,   freeShipping: 'both',     perk: 'Tu nombre en la bolsa del año' },
];

export const FREE_SHIPPING_THRESHOLD = 190000; // $1,900 MXN en centavos
export const POINTS_TO_PESOS = 0.10;          // 1 punto = $0.10 MXN

export function getRankByPoints(points: number): RankDef {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (points >= r.minPoints) current = r;
  }
  return current;
}

export function getNextRank(currentLevel: number): RankDef | null {
  return RANKS.find((r) => r.level === currentLevel + 1) ?? null;
}

export function hasFreeShipping(rankLevel: number, shipping: 'standard' | 'express'): boolean {
  const rank = RANKS.find((r) => r.level === rankLevel);
  if (!rank) return false;
  if (rank.freeShipping === 'both') return true;
  if (rank.freeShipping === 'standard' && shipping === 'standard') return true;
  return false;
}
