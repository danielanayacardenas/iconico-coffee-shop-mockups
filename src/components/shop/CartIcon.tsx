import { useStore } from '@nanostores/react';
import { $cartCount, openCart } from './store/cart';

interface Props {
  onClick?: () => void;
}

export default function CartIcon({ onClick }: Props) {
  const count = useStore($cartCount);

  return (
    <button
      onClick={onClick ?? openCart}
      class="relative p-2.5 rounded-full border border-navy/20 hover:border-navy/40 transition-all duration-300 cursor-pointer"
      aria-label="Abrir carrito"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-navy">
        <circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/>
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
      </svg>
      {count > 0 && (
        <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-navy text-cream text-[10px] font-bold flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
