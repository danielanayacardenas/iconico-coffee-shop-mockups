// src/mocks/profiles.ts
// 3 perfiles precargados para los mockups.
// Visitante (sin cuenta), María (Catador con suscripción), Diego (Icónico admin).

import type { MockProfile } from './types';

export const MOCK_PROFILES: Record<string, MockProfile> = {
  visitante: {
    id: 'visitante',
    label: 'Visitante (sin cuenta)',
    email: '',
    isAdmin: false,
    hasAccount: false,
    rank: 1,
    rankPoints: 0,
    redeemablePoints: 0,
    redeemableExpiring: { amount: 0, daysUntil: 0 },
    subscription: null,
    addresses: [],
    orders: [],
    redeems: [],
    pointsHistory: [],
    joinedAt: '',
    lastPurchaseAt: '',
  },

  maria: {
    id: 'maria',
    label: 'María (Catador)',
    email: 'maria.garcia@gmail.com',
    isAdmin: false,
    hasAccount: true,
    rank: 5,
    rankPoints: 1200,
    redeemablePoints: 850,
    redeemableExpiring: { amount: 120, daysUntil: 47 },
    subscription: {
      productName: 'Suscripción Casa — Mensual',
      monthlyPrice: 13050, // 10% off del precio normal 14500
      startedAt: '2025-11-12',
      nextBilling: '2026-07-12',
      status: 'active',
    },
    addresses: [
      {
        fullName: 'María García López',
        street: 'Av. Insurgentes Sur 1234, Int. 502',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: '03100',
        phone: '+52 55 1234 5678',
      },
    ],
    orders: [
      {
        id: 'ICN-2026-0142',
        date: '2026-06-12',
        items: [
          { name: 'Casa', quantity: 2, price: 14500, unit: '250g' },
          { name: 'Microlote Geisha', quantity: 1, price: 22000, unit: '200g' },
        ],
        subtotal: 51000,
        shipping: 0,
        total: 51000,
        status: 'delivered',
        paymentMethod: 'card',
        pointsEarned: { rank: 612, redeemable: 61 },
      },
      {
        id: 'ICN-2026-0098',
        date: '2026-05-12',
        items: [
          { name: 'Suscripción Casa — Mensual', quantity: 1, price: 13050, unit: '250g' },
        ],
        subtotal: 13050,
        shipping: 0,
        total: 13050,
        status: 'delivered',
        paymentMethod: 'card',
        pointsEarned: { rank: 157, redeemable: 16 },
      },
      {
        id: 'ICN-2026-0067',
        date: '2026-04-15',
        items: [
          { name: 'Pack Descubrimiento', quantity: 1, price: 38000, unit: '3x200g' },
        ],
        subtotal: 38000,
        shipping: 0,
        total: 38000,
        status: 'delivered',
        paymentMethod: 'spei',
        pointsEarned: { rank: 456, redeemable: 46 },
      },
    ],
    redeems: [],
    pointsHistory: [
      { id: 't1', date: '2026-06-12', type: 'earn',      rankDelta: 612, redeemableDelta: 61,  description: 'Compra ICN-2026-0142' },
      { id: 't2', date: '2026-05-12', type: 'earn',      rankDelta: 157, redeemableDelta: 16,  description: 'Suscripción renovada' },
      { id: 't3', date: '2026-04-15', type: 'earn',      rankDelta: 456, redeemableDelta: 46,  description: 'Compra ICN-2026-0067 (SPEI)' },
      { id: 't4', date: '2026-04-02', type: 'redeem',    rankDelta: 0,   redeemableDelta: -100, description: 'Canje: Microlote especial 100g' },
    ],
    joinedAt: '2025-11-12',
    lastPurchaseAt: '2026-06-12',
  },

  diego: {
    id: 'diego',
    label: 'Diego (Icónico · admin)',
    email: 'diego@iconico.cafe',
    isAdmin: true,
    hasAccount: true,
    rank: 10,
    rankPoints: 25400,
    redeemablePoints: 2400,
    redeemableExpiring: { amount: 300, daysUntil: 22 },
    subscription: {
      productName: 'Suscripción Leyenda — Mensual',
      monthlyPrice: 27000,
      startedAt: '2023-03-01',
      nextBilling: '2026-07-01',
      status: 'active',
    },
    addresses: [
      {
        fullName: 'Diego Ramírez Castro',
        street: 'Calle Reforma 245, Piso 8',
        city: 'Guadalajara',
        state: 'Jalisco',
        postalCode: '44100',
        phone: '+52 33 9876 5432',
      },
    ],
    orders: [
      { id: 'ICN-2026-0156', date: '2026-06-19', items: [{ name: 'Edición Icónico 2026', quantity: 1, price: 95000, unit: '500g' }], subtotal: 95000, shipping: 0, total: 95000, status: 'in_transit', paymentMethod: 'card', pointsEarned: { rank: 1900, redeemable: 190 } },
      { id: 'ICN-2026-0148', date: '2026-06-05', items: [{ name: 'Suscripción Leyenda — Mensual', quantity: 1, price: 27000, unit: '500g' }], subtotal: 27000, shipping: 0, total: 27000, status: 'delivered', paymentMethod: 'card', pointsEarned: { rank: 540, redeemable: 54 } },
      { id: 'ICN-2026-0121', date: '2026-05-05', items: [{ name: 'Suscripción Leyenda — Mensual', quantity: 1, price: 27000, unit: '500g' }], subtotal: 27000, shipping: 0, total: 27000, status: 'delivered', paymentMethod: 'card', pointsEarned: { rank: 540, redeemable: 54 } },
      { id: 'ICN-2026-0098', date: '2026-04-05', items: [{ name: 'Suscripción Leyenda — Mensual', quantity: 1, price: 27000, unit: '500g' }], subtotal: 27000, shipping: 0, total: 27000, status: 'delivered', paymentMethod: 'card', pointsEarned: { rank: 540, redeemable: 54 } },
      { id: 'ICN-2026-0075', date: '2026-03-05', items: [{ name: 'Suscripción Leyenda — Mensual', quantity: 1, price: 27000, unit: '500g' }], subtotal: 27000, shipping: 0, total: 27000, status: 'delivered', paymentMethod: 'card', pointsEarned: { rank: 540, redeemable: 54 } },
      { id: 'ICN-2026-0052', date: '2026-02-05', items: [{ name: 'Suscripción Leyenda — Mensual', quantity: 1, price: 27000, unit: '500g' }], subtotal: 27000, shipping: 0, total: 27000, status: 'delivered', paymentMethod: 'card', pointsEarned: { rank: 540, redeemable: 54 } },
    ],
    redeems: [
      { id: 'r1', productName: 'Catación presencial',  cost: 2000, redeemedAt: '2026-05-20', status: 'delivered' },
      { id: 'r2', productName: 'Edición Icónico 2024', cost: 5000, redeemedAt: '2024-12-15', status: 'delivered' },
    ],
    pointsHistory: [
      { id: 't1', date: '2026-06-19', type: 'earn', rankDelta: 1900, redeemableDelta: 190,  description: 'Compra ICN-2026-0156' },
      { id: 't2', date: '2026-05-20', type: 'redeem', rankDelta: 0,  redeemableDelta: -2000, description: 'Canje: Catación presencial' },
      { id: 't3', date: '2026-05-05', type: 'earn', rankDelta: 540,  redeemableDelta: 54,   description: 'Suscripción renovada' },
      { id: 't4', date: '2026-03-01', type: 'earn', rankDelta: 4000, redeemableDelta: 400,  description: 'Bonificación aniversario 3 años' },
    ],
    joinedAt: '2023-03-01',
    lastPurchaseAt: '2026-06-19',
  },
};
