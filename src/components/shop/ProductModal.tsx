import { useEffect, useRef } from 'react';
import type { Product } from './types';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div class="bg-cream rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in">
        <div class="relative">
          <div class="aspect-[16/9] bg-sand/30 flex items-center justify-center">
            <div class="w-32 h-32 rounded-full bg-coffee/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4A3525" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>
              </svg>
            </div>
            {product.badge && (
              <span class="absolute top-4 left-4 text-[0.625rem] tracking-[0.15em] uppercase font-medium bg-navy text-cream px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            class="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/90 flex items-center justify-center hover:bg-cream transition-colors duration-200 cursor-pointer"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="p-8 md:p-10">
          <h2 class="font-serif text-3xl font-bold text-charcoal mb-2">{product.name}</h2>
          <p class="text-charcoal/50 text-sm leading-relaxed mb-6">{product.description}</p>

          <div class="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span key={tag} class="text-[0.625rem] text-sage/60 bg-sage/[0.06] px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div class="border-t border-sand/30 pt-6">
            <h3 class="text-xs tracking-[0.2em] uppercase text-charcoal/40 font-medium mb-4">
              Especificaciones
            </h3>
            <dl class="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              {[
                ['Origen', product.specs.origin],
                ['Tueste', product.specs.roast.charAt(0).toUpperCase() + product.specs.roast.slice(1)],
                ['Proceso', product.specs.process],
                ['Altitud', product.specs.altitude],
                ...(product.specs.varietal ? [['Varietal', product.specs.varietal]] : []),
                ...(product.specs.score ? [['Puntaje', `${product.specs.score} pts`]] : []),
              ].map(([label, value]) => (
                <div key={label} class="flex flex-col">
                  <dt class="text-[0.5625rem] tracking-[0.15em] uppercase text-charcoal/30 mb-0.5">{label}</dt>
                  <dd class="text-charcoal font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div class="border-t border-sand/30 pt-4 mt-4">
            <h4 class="text-[0.5625rem] tracking-[0.15em] uppercase text-charcoal/30 mb-2">Notas de cata</h4>
            <div class="flex flex-wrap gap-1.5">
              {product.specs.flavorNotes.map((note) => (
                <span key={note} class="text-xs text-coffee bg-coffee/[0.06] px-3 py-1 rounded-full">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div class="flex items-center justify-between mt-8 pt-6 border-t border-sand/30">
            <div>
              <span class="text-charcoal font-bold text-2xl">${product.price.toLocaleString('es-CL')}</span>
              <span class="text-charcoal/40 text-sm ml-2">{product.unit}</span>
              {product.subscriptionPrice && (
                <p class="text-xs text-sage mt-0.5">Suscripción: ${product.subscriptionPrice.toLocaleString('es-CL')}/mes</p>
              )}
            </div>
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              class="px-8 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-navy/90 transition-all duration-200 cursor-pointer active:scale-95"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
