import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $shopMode, $activeSection, $activeOrigins, $activeRoasts } from './store/filters';
import { addToCart, openCart } from './store/cart';
import type { Product } from './types';
import ProductCard from './ProductCard';
import ProductRow from './ProductRow';
import ProductModal from './ProductModal';
import CartIcon from './CartIcon';

interface Props {
  products: Product[];
}

function ModeToggle() {
  const mode = useStore($shopMode);

  return (
    <button
      onClick={() => $shopMode.set(mode === 'explorador' ? 'experto' : 'explorador')}
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
  );
}

function ShopNav() {
  const active = useStore($activeSection);

  const sections = [
    { id: 'todos' as const, label: 'Todos' },
    { id: 'best-seller' as const, label: 'Más vendidos' },
    { id: 'pack' as const, label: 'Packs' },
    { id: 'subscription' as const, label: 'Suscripciones' },
  ];

  return (
    <nav class="border-b border-sand/30">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex gap-1 -mb-px overflow-x-auto scrollbar-none">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => $activeSection.set(s.id)}
              class={`relative shrink-0 px-5 py-3.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer ${
                active === s.id
                  ? 'text-navy'
                  : 'text-charcoal/40 hover:text-charcoal/70'
              }`}
            >
              {s.label}
              {active === s.id && (
                <span class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: '#1F3829' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function FilterBar() {
  const [open, setOpen] = useState(false);
  const origins = ['Colombia', 'Brasil', 'Etiopía'];
  const roasts = ['claro', 'medio', 'oscuro'];

  const activeOrigins = useStore($activeOrigins);
  const activeRoasts = useStore($activeRoasts);

  const activeCount = activeOrigins.length + activeRoasts.length;
  const hasFilters = activeCount > 0;

  function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        style={active ? { backgroundColor: '#1F3829', color: '#F3EEE6' } : undefined}
        class={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
          active
            ? ''
            : 'bg-sand/30 text-charcoal/60 hover:bg-sand/50 hover:text-charcoal/80'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-6 md:px-12 pt-4">
      <div class="flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer"
          style={{ borderColor: 'rgba(31,56,41,0.2)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#1F3829' }}>
            <line x1="4" y1="6" x2="14" y2="6"/><circle cx="17" cy="6" r="2"/><line x1="20" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="6" y2="12"/><circle cx="9" cy="12" r="2"/><line x1="12" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="14" y2="18"/><circle cx="17" cy="18" r="2"/><line x1="20" y1="18" x2="20" y2="18"/>
          </svg>
          <span class="text-xs font-medium tracking-wide" style={{ color: '#1F3829' }}>Filtros</span>
          {activeCount > 0 && (
            <span class="text-cream text-[0.5625rem] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1F3829' }}>
              {activeCount}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ color: '#1F3829' }} class={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {hasFilters && (
          <button
            onClick={() => { $activeOrigins.set([]); $activeRoasts.set([]); }}
            class="text-[0.625rem] tracking-[0.15em] uppercase text-coffee/50 hover:text-coffee transition-colors duration-200 cursor-pointer underline underline-offset-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {open && (
        <div class="flex flex-wrap items-start gap-x-8 gap-y-4 pt-4 pb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium mr-1">Origen</span>
            {origins.map((o) => (
              <Chip key={o} label={o} active={activeOrigins.includes(o)} onClick={() => {
                $activeOrigins.set(activeOrigins.includes(o) ? activeOrigins.filter((x) => x !== o) : [...activeOrigins, o]);
              }} />
            ))}
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium mr-1">Tueste</span>
            {roasts.map((r) => (
              <Chip key={r} label={r} active={activeRoasts.includes(r)} onClick={() => {
                $activeRoasts.set(activeRoasts.includes(r) ? activeRoasts.filter((x) => x !== r) : [...activeRoasts, r]);
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopApp({ products }: Props) {
  const mode = useStore($shopMode);
  const activeSection = useStore($activeSection);
  const activeOrigins = useStore($activeOrigins);
  const activeRoasts = useStore($activeRoasts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (mode === 'experto') {
      document.documentElement.setAttribute('data-shop-mode', 'experto');
    } else {
      document.documentElement.removeAttribute('data-shop-mode');
    }
    return () => {
      document.documentElement.removeAttribute('data-shop-mode');
    };
  }, [mode]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeSection !== 'todos') {
      result = result.filter((p) => p.category === activeSection);
    }
    if (activeOrigins.length > 0) {
      result = result.filter((p) => activeOrigins.some((o) => p.specs.origin.toLowerCase().includes(o.toLowerCase())));
    }
    if (activeRoasts.length > 0) {
      result = result.filter((p) => activeRoasts.includes(p.specs.roast));
    }
    return result;
  }, [products, activeSection, activeOrigins, activeRoasts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    openCart();
  };

  return (
    <div class="shop-root" data-mode={mode}>
      {/* Shop Header */}
      <header class="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-sand/30">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
          <div class="flex items-center justify-between h-20 gap-6">
            <a href="/" class="text-charcoal font-serif text-xl md:text-2xl font-bold tracking-[-0.03em] hover:text-coffee transition-colors duration-200 shrink-0">
              icónico
            </a>
            <div class="flex-1 min-w-0">
              <h1 class="font-serif text-2xl md:text-3xl font-bold text-charcoal tracking-[-0.02em]">
                Tienda
              </h1>
              <p class="text-xs text-charcoal/40 tracking-wide mt-0.5 truncate">
                {mode === 'explorador' ? 'Descubre tu café ideal' : 'Especificaciones técnicas'}
              </p>
            </div>
            <div class="flex items-center gap-6 shrink-0">
              <ModeToggle />
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      <ShopNav />
      <FilterBar />

      {/* Products */}
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {filtered.length === 0 ? (
          <div class="text-center py-20">
            <p class="text-charcoal/40 text-sm tracking-wide">No hay productos con estos filtros</p>
          </div>
        ) : (
          <div key={mode} class="shop-mode-anim">
            {mode === 'explorador' ? (
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div class="flex flex-col gap-3">
                {filtered.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
