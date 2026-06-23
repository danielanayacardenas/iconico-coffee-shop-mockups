import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cartOpen,
  $cartList,
  $cartTotal,
  $cartCount,
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from './store/cart';
import FreeShippingBar from './FreeShippingBar';

export default function CartDrawer() {
  const open = useStore($cartOpen);
  const items = useStore($cartList);
  const total = useStore($cartTotal);
  const count = useStore($cartCount);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div class="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm" onClick={closeCart} />
      <div class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cream border-l border-sand/30 shadow-2xl flex flex-col">
        <div class="flex items-center justify-between px-6 py-5 border-b border-sand/30">
          <div>
            <h2 class="font-serif text-xl font-bold text-charcoal">Carrito</h2>
            <p class="text-xs text-charcoal/40">{count} {count === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button
            onClick={closeCart}
            class="w-9 h-9 rounded-full border border-navy/20 flex items-center justify-center hover:border-navy/40 transition-colors duration-200 cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-navy">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div class="flex flex-col items-center justify-center h-full text-center">
              <div class="w-16 h-16 rounded-2xl bg-sand/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal/30">
                  <circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/>
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                </svg>
              </div>
              <p class="text-charcoal/40 text-sm">Tu carrito está vacío</p>
              <p class="text-charcoal/30 text-xs mt-1">Agrega productos para empezar</p>
            </div>
          ) : (
            <div class="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.productId} class="flex gap-4 p-4 bg-sand/20 rounded-xl">
                  <div class="w-16 h-16 rounded-xl bg-sand/30 flex items-center justify-center shrink-0">
                    <div class="w-8 h-8 rounded-full bg-coffee/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A3525" stroke-width="1.2" class="opacity-40">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-charcoal truncate">{item.name}</h4>
                    <p class="text-xs text-charcoal/40">{item.unit}</p>
                    <div class="flex items-center justify-between mt-2">
                      <div class="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          class="w-7 h-7 rounded-full border border-navy/20 flex items-center justify-center text-xs text-navy hover:border-navy/40 transition-colors duration-200 cursor-pointer"
                        >
                          −
                        </button>
                        <span class="text-sm font-medium text-charcoal w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          class="w-7 h-7 rounded-full border border-navy/20 flex items-center justify-center text-xs text-navy hover:border-navy/40 transition-colors duration-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span class="text-sm font-semibold text-charcoal">
                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    class="shrink-0 text-charcoal/30 hover:text-coffee transition-colors duration-200 cursor-pointer self-start mt-1"
                    aria-label="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && <FreeShippingBar subtotal={total} items={items} />}

        {items.length > 0 && (
          <div class="border-t border-sand/30 px-6 py-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-charcoal/60">Subtotal</span>
              <span class="text-lg font-bold text-charcoal">${total.toLocaleString('es-CL')}</span>
            </div>
            <p class="text-xs text-charcoal/30">Envío calculado en el próximo paso</p>
            <div class="flex gap-3">
              <button
                onClick={clearCart}
                class="flex-1 px-4 py-3 rounded-full border border-charcoal/20 text-xs font-medium text-charcoal/60 hover:border-charcoal/40 transition-colors duration-200 cursor-pointer"
              >
                Vaciar
              </button>
              <button class="flex-1 px-4 py-3 rounded-full bg-navy text-cream text-xs font-medium hover:bg-navy/90 transition-all duration-200 cursor-pointer active:scale-95">
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
