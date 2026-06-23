import type { Product } from './types';

interface Props {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetail, onAddToCart }: Props) {
  return (
    <article class="group bg-cream border border-navy/20 rounded-2xl overflow-hidden hover:border-navy/40 transition-all duration-300 cursor-pointer flex flex-col h-full">
      <div class="relative aspect-[4/3] bg-sand/30 overflow-hidden" onClick={() => onOpenDetail(product)}>
        <div class="w-full h-full bg-gradient-to-br from-coffee/5 to-sage/5 flex items-center justify-center p-8">
          <div class="w-24 h-24 rounded-full bg-coffee/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4A3525" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="opacity-40">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>
            </svg>
          </div>
        </div>
        {product.badge && (
          <span class="absolute top-3 left-3 text-[0.625rem] tracking-[0.15em] uppercase font-medium bg-navy text-cream px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {product.isNew && (
          <span class="absolute top-3 right-3 text-[0.625rem] tracking-[0.15em] uppercase font-medium bg-sage text-cream px-2.5 py-1 rounded-full">
            Nuevo
          </span>
        )}
      </div>

      <div class="p-6 flex flex-col flex-1" onClick={() => onOpenDetail(product)}>
        <h3 class="font-serif text-xl font-bold text-charcoal group-hover:text-navy transition-colors duration-300 mb-2">
          {product.name}
        </h3>
        <p class="text-sm text-charcoal/50 leading-relaxed mb-4 min-h-[3.5rem]">
          {product.description}
        </p>

        <div class="flex flex-wrap gap-1.5 mb-2 mt-auto">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} class="text-[0.5625rem] text-sage/60 bg-sage/[0.06] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div class="px-6 pb-6">
        <div class="flex items-center justify-between pt-4 border-t border-sand/30 min-h-[3rem]">
          <div class="flex flex-col">
            <span class="text-charcoal font-semibold text-lg leading-tight">${product.price.toLocaleString('es-CL')}</span>
            <span class="text-xs text-charcoal/40 mt-0.5">{product.unit}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            class="px-4 py-2 rounded-full bg-navy text-cream text-xs font-medium hover:bg-navy/90 transition-all duration-200 cursor-pointer active:scale-95 self-center"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
