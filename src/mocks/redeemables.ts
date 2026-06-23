// src/mocks/redeemables.ts
// Catálogo de productos canjeables por puntos (HU-13, HU-17).
// Espejo del seed de ProductRequirements.md §3.5.

export interface RedeemableProduct {
  id: string;
  name: string;
  description: string;
  cost: number;        // puntos
  valuePesos: number;  // valor en MXN (referencia)
  minRank: number;     // nivel mínimo requerido
  image: string;
  inStock: boolean;
  stock: number;
}

export const REDEEMABLES: RedeemableProduct[] = [
  {
    id: 'cupping-virtual',
    name: 'Catación privada virtual',
    description: 'Sesión de 45 min con nuestro Q-Grader certificado. Vos y hasta 3 amigos, desde donde estén.',
    cost: 500,
    valuePesos: 5000,
    minRank: 1,
    image: '/images/canjeables/cupping-virtual.jpg',
    inStock: true,
    stock: 999,
  },
  {
    id: 'microlote-100g',
    name: 'Microlote especial 100g',
    description: 'Una bolsa de 100g de un microlote seleccionado del mes. Disponibilidad limitada.',
    cost: 1000,
    valuePesos: 10000,
    minRank: 2,
    image: '/images/canjeables/microlote-100.jpg',
    inStock: true,
    stock: 12,
  },
  {
    id: 'pack-regalo',
    name: 'Pack regalo premium',
    description: 'Caja con 2 bolsas a elección, tarjeta personalizada y stickers. Listo para regalar.',
    cost: 800,
    valuePesos: 8000,
    minRank: 2,
    image: '/images/canjeables/pack-regalo.jpg',
    inStock: true,
    stock: 24,
  },
  {
    id: 'cupping-presencial',
    name: 'Catación presencial',
    description: 'Sesión de 90 min en nuestro lab de CDMX o GDL. Para vos o un grupo de hasta 6.',
    cost: 2000,
    valuePesos: 20000,
    minRank: 3,
    image: '/images/canjeables/cupping-presencial.jpg',
    inStock: true,
    stock: 8,
  },
  {
    id: 'edicion-iconico',
    name: 'Edición Icónico anual 250g',
    description: 'Nuestro café más exclusivo del año, numerado y con tu nombre en la bolsa si llegaste a Icónico.',
    cost: 5000,
    valuePesos: 50000,
    minRank: 10,
    image: '/images/canjeables/edicion-iconico.jpg',
    inStock: false,
    stock: 0,
  },
];
