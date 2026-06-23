import { useStore } from '@nanostores/react';
import {
  $activeOrigins,
  $activeRoasts,
  $activeFlavors,
  $priceRange,
  toggleOrigin,
  toggleRoast,
  toggleFlavor,
  setPriceRange,
  clearFilters,
} from './store/filters';

const origins = ['Colombia', 'Brasil', 'Etiopía'];
const roasts = ['claro', 'medio', 'oscuro'];
const flavors = ['chocolate', 'caramelo', 'nueces', 'cítrico', 'floral', 'dulce', 'avellana', 'té negro'];

export default function FilterBar() {
  const originsStore = useStore($activeOrigins);
  const roastsStore = useStore($activeRoasts);
  const flavorsStore = useStore($activeFlavors);

  const hasFilters = originsStore.length > 0 || roastsStore.length > 0 || flavorsStore.length > 0;

  function Chip({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        class={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
          active
            ? 'bg-navy text-cream'
            : 'bg-sand/30 text-charcoal/60 hover:bg-sand/50 hover:text-charcoal/80'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-4">
      <div class="flex flex-wrap items-start gap-x-8 gap-y-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium mr-1">Origen</span>
          {origins.map((o) => (
            <Chip key={o} label={o} active={originsStore.includes(o)} onClick={() => toggleOrigin(o)} />
          ))}
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium mr-1">Tueste</span>
          {roasts.map((r) => (
            <Chip key={r} label={r} active={roastsStore.includes(r)} onClick={() => toggleRoast(r)} />
          ))}
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[0.625rem] tracking-[0.2em] uppercase text-charcoal/40 font-medium mr-1">Perfil</span>
          {flavors.map((f) => (
            <Chip key={f} label={f} active={flavorsStore.includes(f)} onClick={() => toggleFlavor(f)} />
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            class="text-[0.625rem] tracking-[0.15em] uppercase text-coffee/50 hover:text-coffee transition-colors duration-200 cursor-pointer underline underline-offset-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
