import { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $shopMode, $activeSection, $activeOrigins, $activeRoasts, $activeFlavors } from './store/filters';
import { addToCart } from './store/cart';
import ProductCard from './ProductCard';
import ProductRow from './ProductRow';
import ProductModal from './ProductModal';
import type { Product } from './types';

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  const mode = useStore($shopMode);
  const activeSection = useStore($activeSection);
  const activeOrigins = useStore($activeOrigins);
  const activeRoasts = useStore($activeRoasts);
  const activeFlavors = useStore($activeFlavors);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result = products;

    if (activeSection !== 'todos') {
      result = result.filter((p) => p.category === activeSection);
    }

    if (activeOrigins.length > 0) {
      result = result.filter((p) =>
        activeOrigins.some((o) => p.specs.origin.toLowerCase().includes(o.toLowerCase()))
      );
    }

    if (activeRoasts.length > 0) {
      result = result.filter((p) => activeRoasts.includes(p.specs.roast));
    }

    if (activeFlavors.length > 0) {
      result = result.filter((p) =>
        p.specs.flavorNotes.some((f) => activeFlavors.includes(f))
      );
    }

    return result;
  }, [products, activeSection, activeOrigins, activeRoasts, activeFlavors]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <>
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {filtered.length === 0 ? (
          <div class="text-center py-20">
            <p class="text-charcoal/40 text-sm tracking-wide">No hay productos con estos filtros</p>
          </div>
        ) : mode === 'explorador' ? (
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-opacity duration-300">
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
          <div class="flex flex-col gap-3 transition-opacity duration-300">
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}
