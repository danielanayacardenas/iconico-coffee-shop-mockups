import { useStore } from '@nanostores/react';
import { $activeSection, setSection } from './store/filters';
import type { ShopSection } from './types';

const sections: { id: ShopSection; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'best-seller', label: 'Más vendidos' },
  { id: 'pack', label: 'Packs' },
  { id: 'subscription', label: 'Suscripciones' },
];

export default function ShopNav() {
  const active = useStore($activeSection);

  return (
    <nav class="border-b border-sand/30">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex gap-1 -mb-px overflow-x-auto scrollbar-none">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              class={`relative shrink-0 px-5 py-3.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer ${
                active === s.id
                  ? 'text-navy'
                  : 'text-charcoal/40 hover:text-charcoal/70'
              }`}
            >
              {s.label}
              {active === s.id && (
                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-navy rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
