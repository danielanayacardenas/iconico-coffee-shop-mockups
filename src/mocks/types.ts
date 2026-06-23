// src/mocks/types.ts
// Tipos compartidos para los mocks del proyecto.

export type MockProfileId = 'visitante' | 'maria' | 'diego';

export interface MockAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface MockSubscription {
  productName: string;
  monthlyPrice: number;
  startedAt: string;
  nextBilling: string;
  status: 'active' | 'paused' | 'cancelled';
  pausedUntil?: string;
}

export interface MockOrder {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number; unit: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'delivered' | 'in_transit' | 'processing' | 'cancelled';
  paymentMethod: 'card' | 'spei' | 'oxxo' | 'apple_pay';
  pointsEarned: { rank: number; redeemable: number };
}

export interface MockRedeem {
  id: string;
  productName: string;
  cost: number;
  redeemedAt: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface MockPointsTransaction {
  id: string;
  date: string;
  type: 'earn' | 'redeem' | 'expire' | 'downgrade';
  rankDelta: number;
  redeemableDelta: number;
  description: string;
}

export interface MockProfile {
  id: MockProfileId;
  label: string;
  email: string;
  isAdmin: boolean;
  hasAccount: boolean;
  rank: number; // 1-10
  rankPoints: number;
  redeemablePoints: number;
  redeemableExpiring: { amount: number; daysUntil: number };
  subscription: MockSubscription | null;
  addresses: MockAddress[];
  orders: MockOrder[];
  redeems: MockRedeem[];
  pointsHistory: MockPointsTransaction[];
  joinedAt: string;
  lastPurchaseAt: string;
}
