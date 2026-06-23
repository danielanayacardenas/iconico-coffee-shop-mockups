import { useStore } from '@nanostores/react';
import { $shopMode, toggleMode } from './store/filters';
import { $cartCount, openCart } from './store/cart';

export default function ShopHeader() {
  const mode = useStore($shopMode);
  const count = useStore($cartCount);

  return (
      <header class="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-sand/30">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
          <div class="flex items-center justify-between h-20">
            <div>
              <h1 class="font-serif text-2xl md:text-3xl font-bold text-charcoal tracking-[-0.02em]">
                Tienda
              </h1>
              <p class="text-xs text-charcoal/40 tracking-wide mt-0.5">
                {mode === 'explorador' ? 'Descubre tu café ideal' : 'Especificaciones técnicas'}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <button
                onClick={toggleMode}
                style={{ borderColor: 'rgba(31,56,41,0.2)', color: '#1F3829' }}
                class="group relative overflow-hidden rounded-full border px-5 py-2.5 text-xs font-medium transition-all duration-300 hover:opacity-80 cursor-pointer"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <span style={{ borderColor: 'rgba(31,56,41,0.3)', backgroundColor: mode === 'experto' ? '#1F3829' : 'transparent' }} class="inline-block w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300">
                    <span style={{ backgroundColor: '#1F3829' }} class={`w-2 h-2 rounded-full transition-all duration-300 ${mode === 'explorador' ? 'scale-100' : 'scale-0'}`} />
                  </span>
                  {mode === 'explorador' ? 'Modo Experto' : 'Modo Explorador'}
                </span>
              </button>

              <button
                onClick={openCart}
                class="relative p-2.5 rounded-full border transition-all duration-300 cursor-pointer"
                style={{ borderColor: 'rgba(31,56,41,0.2)' }}
                aria-label="Abrir carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#1F3829' }}>
                  <circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/>
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                </svg>
                {count > 0 && (
                  <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full text-cream text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: '#1F3829' }}>
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
  );
}
