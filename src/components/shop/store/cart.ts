import { atom, computed, map } from 'nanostores';
import type { CartItem, Product } from '../types';

const STORAGE_KEY = 'iconico-cart';

function loadInitial(): Record<string, CartItem> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export const $cartItems = map<Record<string, CartItem>>(loadInitial());
export const $cartOpen = atom(false);

if (typeof window !== 'undefined') {
  $cartItems.subscribe((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  });
}

export function addToCart(product: Product, quantity = 1) {
  const existing = $cartItems.get()[product.id];
  if (existing) {
    $cartItems.setKey(product.id, { ...existing, quantity: existing.quantity + quantity });
  } else {
    $cartItems.setKey(product.id, {
      productId: product.id,
      name: product.name,
      price: product.subscriptionPrice ?? product.price,
      unit: product.unit,
      image: product.image,
      quantity,
    });
  }
}

export function removeFromCart(productId: string) {
  $cartItems.setKey(productId, undefined as unknown as CartItem);
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = $cartItems.get()[productId];
  if (item) {
    $cartItems.setKey(productId, { ...item, quantity });
  }
}

export function clearCart() {
  $cartItems.set({});
}

export const $cartCount = computed($cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + (item?.quantity ?? 0), 0)
);

export const $cartTotal = computed($cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0)
);

export const $cartList = computed($cartItems, (items) =>
  Object.values(items).filter(Boolean)
);

export function toggleCart() {
  $cartOpen.set(!$cartOpen.get());
}

export function openCart() {
  $cartOpen.set(true);
}

export function closeCart() {
  $cartOpen.set(false);
}
