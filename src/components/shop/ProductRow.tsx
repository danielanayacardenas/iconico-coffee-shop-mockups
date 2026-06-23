import type { Product } from './types';

interface Props {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductRow({ product, onOpenDetail, onAddToCart }: Props) {
  return (
    <article
      class="group grid grid-cols-[80px_1fr_auto] md:grid-cols-[100px_2fr_1fr_1fr_auto] gap-4 md:gap-6 items-center px-5 py-4 bg-cream border border-navy/20 rounded-xl hover:border-navy/40 transition-all duration-300 cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      <div class="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-sand/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <div class="w-10 h-10 rounded-full bg-coffee/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A3525" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="opacity-40">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>
          </svg>
        </div>
      </div>

      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-serif text-lg font-bold text-charcoal group-hover:text-navy transition-colors duration-300 truncate">
            {product.name}
          </h3>
          {product.badge && (
            <span class="shrink-0 text-[0.5rem] tracking-[0.15em] uppercase font-medium bg-navy/10 text-navy px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-charcoal/50">
          <span>{product.specs.origin}</span>
          <span class="text-sand/60">|</span>
          <span class="capitalize">Tueste {product.specs.roast}</span>
          <span class="text-sand/60">|</span>
          <span>{product.specs.process}</span>
          {product.specs.score && (
            <>
              <span class="text-sand/60">|</span>
              <span class="text-sage font-medium">{product.specs.score} pts</span>
            </>
          )}
        </div>
        <div class="flex flex-wrap gap-1 mt-1.5">
          {product.specs.flavorNotes.map((note) => (
            <span key={note} class="text-[0.5rem] text-sage/60 bg-sage/[0.06] px-1.5 py-0.5 rounded-full">
              {note}
            </span>
          ))}
        </div>
      </div>

      <div class="hidden md:block text-xs text-charcoal/40">
        <span class="font-medium text-charcoal/60">{product.unit}</span>
      </div>

      <div class="hidden md:flex flex-col items-end">
        <span class="text-charcoal font-semibold">${product.price.toLocaleString('es-CL')}</span>
        {product.subscriptionPrice && (
          <span class="text-[0.5625rem] text-sage">${product.subscriptionPrice.toLocaleString('es-CL')}/mes</span>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
        class="shrink-0 px-4 py-2 rounded-full bg-navy text-cream text-xs font-medium hover:bg-navy/90 transition-all duration-200 cursor-pointer active:scale-95"
      >
        Agregar
      </button>
    </article>
  );
}
