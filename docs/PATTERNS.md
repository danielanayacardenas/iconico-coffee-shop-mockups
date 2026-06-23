# Patterns — Datos: nanostores + localStorage + SSR

> Patrones oficiales de `nanostores` para state management, con persistencia en `localStorage` y soporte SSR. Cada patrón incluye: **cuándo usarlo**, **ejemplo**, y **fuente** a la doc oficial.

**Stack:** nanostores 1.3 + @nanostores/react 1.1. Para SSR: check `typeof window === 'undefined'`. Para arquitectura de componentes ver `ARCHITECTURE.md`.

---

## 1. 3 tipos de store según la forma del estado

| Tipo | Para | API |
|---|---|---|
| `atom<T>()` | primitivos, objetos completos, strings, numbers, arrays | `.set(newValue)`, `.get()` |
| `map<T>()` | objetos con keys que cambian granularmente | `.setKey(key, value)`, `.set(obj)` |
| `computed()` | derivado de otros stores, recalcula automático | declarativo |

**Cuándo `atom` vs `map`:**
- Si reemplazás el objeto entero → `atom`
- Si cambiás 1 key a la vez → `map` (más eficiente, notifica solo listeners de esa key)

**Ejemplo:**
```ts
// atom — string, number, o "trato al objeto como value completo"
import { atom } from 'nanostores';
export const $shopMode = atom<ShopMode>('explorador');

// map — object con keys que cambian independientemente
import { map } from 'nanostores';
export const $cartItems = map<Record<string, CartItem>>({});

// computed — derivado
import { computed } from 'nanostores';
export const $cartCount = computed($cartItems, (items) =>
  Object.values(items).reduce((sum, i) => sum + (i?.quantity ?? 0), 0)
);
```

**Fuente:** [nanostores README — Atoms / Maps / Computed](https://github.com/nanostores/nanostores#guide)

---

## 2. Convención `$nombre` para stores

**Por qué:** señal visual inmediata de "esto es un store, no un value". Usado en toda la codebase actual.

**Convención:**
- Archivos: `camelCase.ts` (`cart.ts`, `filters.ts`)
- Exports: `$camelCase` (`$cartItems`, `$shopMode`)
- Functions: `camelCase` (`addToCart`, `toggleMode`)

**Fuente:** convención oficial del repo de nanostores (no es regla escrita, es práctica recomendada en la doc y en 100% de proyectos que lo usan).

---

## 3. SSR-safe load pattern (OBLIGATORIO)

**Cuándo:** cualquier store que se inicialice desde `localStorage` o `sessionStorage`. Astro renderiza en server primero.

**MAL:**
```ts
export const $cartItems = map<Record<string, CartItem>>(
  JSON.parse(localStorage.getItem('iconico-cart') ?? '{}')  // rompe en server
);
```

**BIEN:**
```ts
function loadInitial(): Record<string, CartItem> {
  if (typeof window === 'undefined') return {};  // server: default
  try {
    const saved = localStorage.getItem('iconico-cart');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export const $cartItems = map<Record<string, CartItem>>(loadInitial());
```

**Por qué el `try/catch`:** `localStorage` puede lanzar en modo privado de Safari, en iframes sin storage, o si el JSON está corrupto. Catch retorna default y la app no rompe.

**Fuente:** [nanostores README — SSR](https://github.com/nanostores/nanostores#server-side-rendering) + experiencia en este proyecto (`src/components/shop/store/cart.ts`).

---

## 4. Persistencia con `subscribe` (sin `nanostores/persistent`)

**Cuándo:** querés que un store persista en localStorage. Dos opciones:

**Opción A — subscribe manual (lo que usamos):**
```ts
const STORAGE_KEY = 'iconico-cart';

if (typeof window !== 'undefined') {
  $cartItems.subscribe((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  });
}
```

**Opción B — `nanostores/persistent` (paquete externo):**
```ts
import { persistentMap } from '@nanostores/persistent';
export const $cartItems = persistentMap<Record<string, CartItem>>('iconico-cart:', {});
```

**Decisión del proyecto:** opción A porque ya está implementado, no agrega dep, y funciona bien con SSR.

**Fuente:** [nanostores/persistent](https://github.com/nanostores/persistent) + patrón actual.

---

## 5. `useStore($store)` en React — leer, nunca `.get()` en JSX

**Cuándo:** cualquier componente React que necesite leer un store.

**MAL:**
```jsx
function CartIcon() {
  const count = $cartCount.get();  // NO se re-renderiza al cambiar
  return <span>{count}</span>;
}
```

**BIEN:**
```jsx
import { useStore } from '@nanostores/react';

function CartIcon() {
  const count = useStore($cartCount);  // re-render automático
  return <span>{count}</span>;
}
```

**Regla:** `.get()` solo en (1) action functions dentro del store, (2) tests, (3) event handlers no-React. **Nunca en JSX**.

**Fuente:** [nanostores README — React](https://github.com/nanostores/nanostores#react--preact) + [Best Practices — Reduce get() usage](https://github.com/nanostores/nanostores#reduce-get-usage-outside-of-tests).

---

## 6. Lógica en stores, NO en componentes

**Cuándo:** cualquier action que muta state (`addToCart`, `toggleFilter`, `redeemPoints`).

**MAL:** lógica en el handler del componente, set directo del store.
```jsx
function ProductCard({ product }) {
  const items = useStore($cartItems);
  return (
    <button onClick={() => {
      const next = { ...items, [product.id]: { ...product, quantity: 1 } };
      $cartItems.set(next);  // lógica de merge en el componente
    }}>Add</button>
  );
}
```

**BIEN:** función exportada del store.
```ts
// store/cart.ts
export function addToCart(product: Product, quantity = 1) {
  const existing = $cartItems.get()[product.id];
  if (existing) {
    $cartItems.setKey(product.id, { ...existing, quantity: existing.quantity + quantity });
  } else {
    $cartItems.setKey(product.id, { productId: product.id, name: product.name, /* ... */ quantity });
  }
}
```

```jsx
// ProductCard.tsx
import { addToCart } from './store/cart';
<button onClick={() => addToCart(product)}>Add</button>
```

**Por qué:** testeable sin React, reusable desde otros componentes, lógica centralizada.

**Fuente:** [Best Practices — Move Logic from Components to Stores](https://github.com/nanostores/nanostores#move-logic-from-components-to-stores)

---

## 7. Separar cambio y reacción (CRÍTICO)

**Cuándo:** un cambio en un store necesita disparar un side effect (analytics, sync, network).

**MAL:**
```ts
function increase() {
  $counter.set($counter.get() + 1);
  printCounter($counter.get());  // side effect pegado al cambio
}
```

**BIEN:**
```ts
// action
function increase() {
  $counter.set($counter.get() + 1);  // solo cambia
}

// reacción separada
$counter.listen((value) => {
  printCounter(value);
});
```

**Por qué:** el action no es la única forma de cambiar el store. Puede venir de otro tab (vía storage event), de un sync de server, de otra action. Si la reacción está pegada al action, se pierde en esos casos.

**En este proyecto:** aplica a la hora de enviar analytics o llamar APIs en respuesta a cambios. Hoy solo el cart usa localStorage subscribe, que ya es un side effect automático.

**Fuente:** [Best Practices — Separate changes and reaction](https://github.com/nanostores/nanostores#separate-changes-and-reaction)

---

## 8. Computed para derivados (no recalcular en cada render)

**Cuándo:** valor que depende de uno o más stores y se lee en múltiples componentes.

**MAL:**
```jsx
function CartSummary() {
  const items = useStore($cartItems);
  const total = Object.values(items).reduce((s, i) => s + i.price * i.quantity, 0);  // recalcula cada render
  return <div>${total}</div>;
}
```

**BIEN:**
```ts
// store/cart.ts
export const $cartTotal = computed($cartItems, (items) =>
  Object.values(items).reduce((sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0)
);
```

```jsx
import { $cartTotal } from './store/cart';
function CartSummary() {
  const total = useStore($cartTotal);  // recalcula solo cuando items cambia
  return <div>${total}</div>;
}
```

**Bonus:** se cachea entre componentes. 10 componentes que leen `$cartTotal` no recalculan 10 veces.

**Multi-store computed:**
```ts
export const $filtered = computed([$activeSection, $activeOrigins, $activeRoasts, $products],
  (section, origins, roasts, products) => {
    return products.filter(/* ... */);
  }
);
```

**Fuente:** [Computed stores](https://github.com/nanostores/nanostores#computed-stores)

---

## 9. `batched` para múltiples updates que deben ser 1 reacción

**Cuándo:** cambias 2+ stores y querés que los computed/efectos downstream se actualicen una sola vez.

**Ejemplo:**
```ts
import { batched } from 'nanostores';

const $sortBy = atom('date');
const $category = atom('');

export const $apiUrl = batched([$sortBy, $category], (sort, cat) =>
  `/api/items?sort=${sort}&cat=${cat}`
);

// cambiar ambos: 1 sola notificación downstream
export function resetFilters() {
  $sortBy.set('date');
  $category.set('all');  // $apiUrl se actualiza 1 vez, no 2
}
```

**En este proyecto:** no usado hoy, pero relevante cuando agreguemos filtros que tocan 3+ stores simultáneos.

**Fuente:** [Computed stores — batched](https://github.com/nanostores/nanostores#computed-stores)

---

## 10. `effect` para multi-store side effects con cleanup

**Cuándo:** querés reaccionar a múltiples stores y hacer side effects que necesitan cleanup (timers, intervals, WebSocket).

**Ejemplo:**
```ts
import { effect } from 'nanostores';

const $isOnline = atom(true);
const $interval = atom(1000);

const cancelPing = effect([$isOnline, $interval], (online, interval) => {
  if (!online) return;
  const id = setInterval(() => sendPing(), interval);
  return () => clearInterval(id);  // cleanup automático
});
```

**Cleanup hierarchy:**
- Cuando `$isOnline` o `$interval` cambia → cleanup del callback anterior → corre el nuevo.
- `cancelPing()` → cleanup final.

**En este proyecto:** útil para auto-logout tras X minutos de inactividad (HU-15 indirectamente).

**Fuente:** [Effects](https://github.com/nanostores/nanostores#effects)

---

## 11. `onMount` para lazy stores (con cleanup)

**Cuándo:** store que abre recursos (WebSocket, fetch, interval) solo cuando hay un componente que lo lee.

**Ejemplo:**
```ts
import { onMount } from 'nanostores';

export const $liveNotifications = atom<Notification[]>([]);

onMount($liveNotifications, () => {
  // mount: primer listener suscrito
  const ws = new WebSocket('/api/notifications');
  ws.addEventListener('message', (e) => {
    $liveNotifications.set(JSON.parse(e.data));
  });
  return () => {
    // disabled: último listener se desuscribió (+ 1s debounce)
    ws.close();
  };
});
```

**Por qué importa:** si nadie lee `$liveNotifications`, no se abre el WebSocket. Si todos los componentes se desmontan, se cierra. Recursos solo cuando se usan.

**En este proyecto:** no usado hoy. Útil para suscripción activa (HU-4) cuando notifiquemos en UI.

**Fuente:** [Lazy Stores](https://github.com/nanostores/nanostores#lazy-stores)

---

## 12. `onSet` para validar antes de cambiar

**Cuándo:** querés rechazar un cambio inválido o transformar el value antes de aplicar.

**Ejemplo:**
```ts
import { onSet } from 'nanostores';

onSet($quantity, ({ newValue, abort }) => {
  if (newValue < 0) abort();
});
```

**Fuente:** [Store Events](https://github.com/nanostores/nanostores#store-events)

---

## 13. `setKey(key, undefined)` para borrar una key de un `map`

**Cuándo:** querés remover un item de un `map<T>`.

**Ejemplo:**
```ts
$cartItems.setKey(productId, undefined as unknown as CartItem);
```

**Caveat:** el `undefined` se queda en el objeto. Si tu computed filtra con `Object.values()`, podés usar:
```ts
export const $cartList = computed($cartItems, (items) =>
  Object.values(items).filter(Boolean)
);
```

**En este proyecto:** `cart.ts:70-72` lo hace así.

**Fuente:** [Maps](https://github.com/nanostores/nanostores#maps)

---

## 14. SSR testing pattern

**Cuándo:** testear stores que tienen `onMount`, `loadInitial` desde localStorage, o async tasks.

**Ejemplo:**
```ts
import { cleanStores, keepMount } from 'nanostores';

afterEach(() => cleanStores($myStore));

it('starts empty', () => {
  keepMount($myStore);  // fuerza mount sin componente
  expect($myStore.get()).toEqual({});
});
```

**Para esperar async:** `await allTasks()`.

**Fuente:** [Tests](https://github.com/nanostores/nanostores#tests)

---

## 15. Tree-shaking: imports nombrados, un store por archivo

**Por qué:** nanostores se tree-shakea por export. Si importás 5 stores en 1 bundle, solo se incluyen los que el chunk usa. Para eso, cada store en su archivo.

**MAL:**
```ts
// stores/index.ts
export const $a = atom(0);
export const $b = atom(0);
export const $c = atom(0);
```

**BIEN:**
```ts
// stores/a.ts
export const $a = atom(0);
// stores/b.ts
export const $b = atom(0);
// stores/c.ts
export const $c = atom(0);
```

**Fuente:** [Smart stores — Tree Shakable](https://github.com/nanostores/nanostores) (intro del README).

---

## 16. Stores entre islands: usar stores globales, no props

**Cuándo:** dos React islands separados en la misma página necesitan compartir state (ej: `CartIcon` en header + `CartDrawer` flotante).

**Problema:** islands son roots React independientes. State no se propaga.

**Workaround (lo que hace este proyecto):** stores en módulos. Cada island hace `useStore($cartItems)` y se sincroniza via localStorage.

**Limitación:** cada island tiene su propio ciclo de render. Si el cart cambia, ambas re-renderean, pero no es coordinado por React. Suficiente para cart/count/total.

**Mejor para state complejo:** 1 island grande que envuelva todo (ver `ARCHITECTURE.md` #17).

**Fuente:** [Share state between islands](https://docs.astro.build/en/recipes/sharing-state-islands/)

---

## 17. No serializar stores como props

**MAL:**
```astro
<MyReactComp client:load store={$cartItems} />  <!-- $cartItems es un objeto con métodos, no serializable -->
```

**BIEN:** leer el store dentro del componente.
```jsx
// MyReactComp.tsx
import { useStore } from '@nanostores/react';
import { $cartItems } from './store/cart';

export default function MyReactComp() {
  const items = useStore($cartItems);
  return <div>{items.length}</div>;
}
```

**Por qué:** props a islands se serializan con `JSON.stringify` (Astro limitation, ver `ARCHITECTURE.md` #7). Los métodos del store se pierden.

**Fuente:** [Framework components — passing props](https://docs.astro.build/en/guides/framework-components/#passing-props-to-framework-components)

---

## 18. Reducir `get()` fuera de tests

**Regla:** en UI, usar `useStore()` o `subscribe()`. `get()` solo en (1) action functions del store, (2) tests, (3) event handlers cortos donde no querés re-render.

**MAL:**
```jsx
function Button() {
  const items = useStore($cartItems);
  const count = $cartCount.get();  // re-render solo cuando items cambia, no cuando count
  return <button>{items.length} / {count}</button>;
}
```

**BIEN:**
```jsx
function Button() {
  const count = useStore($cartCount);  // re-render en cada cambio
  return <button>{count}</button>;
}
```

**Fuente:** [Best Practices — Reduce get()](https://github.com/nanostores/nanostores#reduce-get-usage-outside-of-tests)

---

## 19. Subscription vs listener

| Método | Cuándo llama |
|---|---|
| `store.listen(cb)` | solo en el próximo cambio |
| `store.subscribe(cb)` | inmediato con valor actual + en cada cambio |
| `store.subscribeKeys(store, keys, cb)` | inmediato + cuando cambian keys específicas (map) |

**Para UI en React:** siempre `useStore()` (internamente usa `subscribe`).

**Para side effects en código:** `listen()` si querés reaccionar solo a cambios futuros (más predecible, no dispara con el valor inicial).

**Fuente:** [Atoms / Map creator / Vanilla JS](https://github.com/nanostores/nanostores#atoms)

---

## 20. Pre-delivery checklist (data)

- [ ] `loadInitial()` con `typeof window === 'undefined'` check
- [ ] `try/catch` alrededor de `localStorage.getItem` y `setItem`
- [ ] Persistencia con `subscribe` envuelto en `if (typeof window !== 'undefined')`
- [ ] Action functions exportadas del store, no inline en componentes
- [ ] Valores derivados como `computed`, no recalculados en render
- [ ] Stores nombrados con `$` prefix
- [ ] Un store por archivo para tree-shaking
- [ ] Sin `store` o `get()` como props a React islands
- [ ] `useStore()` en JSX, no `.get()`
- [ ] `onSet` para validación donde aplique
