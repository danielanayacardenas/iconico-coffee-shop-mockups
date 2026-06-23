# Architecture — Patrones de componentes Astro 6 + React 19

> Referencia rápida de patrones oficiales para construir UI. Cada patrón incluye: **cuándo usarlo**, **ejemplo**, y **fuente** a la doc oficial.

**Stack:** Astro 6.4 + React 19 + Tailwind v4 + Bun. Para estado: nanostores + `@nanostores/react`. Ver `PATTERNS.md` para datos.

---

## 1. Astro puro para contenido estático

**Cuándo:** Hero, Footer, Testimonials, cualquier sección que se renderiza una vez y no necesita estado ni handlers interactivos. Cero JS al cliente.

**Ejemplo:**
```astro
---
// src/components/Hero.astro
const { title, subtitle } = Astro.props;
---
<section class="min-h-screen flex items-center bg-cream">
  <h1 class="font-serif text-6xl">{title}</h1>
  <p class="text-charcoal/60">{subtitle}</p>
</section>
```

**Fuente:** [Astro Components](https://docs.astro.build/en/basics/astro-components/) — "By default, your framework components will only render on the server, as static HTML."

---

## 2. `client:load` para interactividad inmediata

**Cuándo:** UI visible al cargar que necesita ser interactiva ya: carrito (badge count), modal de login, formulario de checkout.

**Ejemplo:**
```astro
---
import CartDrawer from '../components/shop/CartDrawer';
---
<CartDrawer client:load />
```

**Fuente:** [Directives reference](https://docs.astro.build/en/reference/directives-reference/#clientload) — "Load and hydrate the component JavaScript immediately on page load."

---

## 3. `client:visible` para interactividad bajo el fold

**Cuándo:** ProductCard, reviews, video embeds, listas largas. Usa `IntersectionObserver` interno. No se hidrata si el usuario nunca scroll-ea hasta ahí.

**Ejemplo:**
```astro
<HeavyImageCarousel client:visible />
<HeavyImageCarousel client:visible={{ rootMargin: "200px" }} />
```

`rootMargin: "200px"` empieza a hidratar 200px antes de que entre al viewport — reduce CLS y permite hidratar en conexiones lentas.

**Fuente:** [Directives reference](https://docs.astro.build/en/reference/directives-reference/#clientvisible)

---

## 4. `client:idle` para interactividad secundaria

**Cuándo:** Newsletter, chatbot, tooltips, banners. Espera al `requestIdleCallback` (o al `load` event en browsers sin soporte).

**Ejemplo:**
```astro
<NewsletterWidget client:idle />
<NewsletterWidget client:idle={{ timeout: 500 }} />
```

`timeout: 500` fuerza hidratación después de 500ms aunque la página no haya terminado de cargar.

**Fuente:** [Directives reference](https://docs.astro.build/en/reference/directives-reference/#clientidle)

---

## 5. `client:media` para visibilidad condicional por breakpoint

**Cuándo:** Sidebar toggle solo en mobile, widgets que solo aparecen en ciertos tamaños. Mejor que `client:visible` si el elemento ya tiene CSS de media query.

**Ejemplo:**
```astro
<MobileMenuToggle client:media="(max-width: 768px)" />
```

**Fuente:** [Directives reference](https://docs.astro.build/en/reference/directives-reference/#clientmedia)

---

## 6. `client:only="react"` para componentes que rompen en SSR

**Cuándo:** Componentes que dependen de `window`, `localStorage`, `IntersectionObserver`, Web APIs, o cualquier cosa que no existe en server.

**OBLIGATORIO:** pasar el framework (`"react"`, `"svelte"`, etc.).

**Ejemplo:**
```astro
<ClientOnlyCounter client:only="react" />
```

Con fallback visual:
```astro
<ClientOnlyCounter client:only="react">
  <div slot="fallback" class="animate-pulse">Cargando…</div>
</ClientOnlyCounter>
```

**En este proyecto:** casi todos los stores de cart/session/filters usan `localStorage` en su `loadInitial()`. Si un componente los lee con `useStore()` y se hidrata con `client:load`, el primer render del server va a tener `{}` o default, y el cliente va a tener el real. Eso causa un flash. **Usar `client:only="react"` cuando:**
- el componente depende 100% de state del localStorage
- un flash de "estado vacío → estado cargado" se ve feo

**Regla práctica:** carrito/session → `client:only="react"`. UI toggle/forms → `client:load`.

**Fuente:** [Directives reference](https://docs.astro.build/en/reference/directives-reference/#clientonly)

---

## 7. Reglas de props a React islands (serialización)

**Cuándo:** pasando datos de `.astro` a `.jsx` con `client:*`.

**Soportado:** plain object, `number`, `string`, `Array`, `Map`, `Set`, `RegExp`, `Date`, `BigInt`, `URL`, `Uint8Array`, `Uint16Array`, `Uint32Array`, `Infinity`.

**NO soportado:** funciones, class instances, symbols, referencias a stores.

**Ejemplo OK:**
```astro
<ProductCard client:load product={product} index={0} />
```

**Ejemplo MAL:**
```astro
<MyComp client:load onClick={() => doSomething()} />  <!-- función -->
<MyComp client:load store={$cartItems} />             <!-- store ref -->
```

**Workaround para handlers:** exponerlos via store (ver `PATTERNS.md`).

**Fuente:** [Framework components](https://docs.astro.build/en/guides/framework-components/#passing-props-to-framework-components)

---

## 8. Slot pattern para inyectar HTML estático a islands

**Cuándo:** querés que un `.astro` padre pase contenido estático (header, footer, sidebar) a un React island, sin que el React island tenga que importar Astro.

**Ejemplo:**
```astro
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
---
<MyReactSidebar client:load>
  <h2 slot="title">Menú</h2>
  <p>Contenido estático de Astro</p>
  <ul slot="links">
    <li><a href="/a">A</a></li>
  </ul>
</MyReactSidebar>
```

```jsx
// MyReactSidebar.jsx
export default function MyReactSidebar({ title, links, children }) {
  return (
    <aside>
      <header>{title}</header>
      <main>{children}</main>
      <footer>{links}</footer>
    </aside>
  );
}
```

**Reglas:**
- `slot="name"` en Astro → prop `name` (camelCase) en React.
- `slot="default"` o sin slot → prop `children`.

**Fuente:** [Framework components — Passing children](https://docs.astro.build/en/guides/framework-components/#passing-children-to-framework-components)

---

## 9. NO anidar Astro dentro de React

**Cuándo:** siempre. No se puede. `import` de `.astro` en `.jsx` no funciona.

**Workaround:** pasar contenido Astro via slot (patrón #8).

**Fuente:** [Framework components — Can I use Astro components inside my framework components?](https://docs.astro.build/en/guides/framework-components/#can-i-use-astro-components-inside-my-framework-components)

---

## 10. `class:list` para clases condicionales (Astro)

**Cuándo:** cualquier elemento con clases que dependen de props/estado en `.astro`. Powered by `clsx`.

**Ejemplo:**
```astro
<button
  class:list={[
    'px-4 py-2 rounded-full transition-colors',
    { 'bg-navy text-cream': isActive, 'bg-sand text-charcoal': !isActive },
  ]}
>
  {label}
</button>
```

Acepta: strings, objects (truthy keys), arrays, falsy values.

**En React island:** usar el paquete `clsx` directamente o template strings.
```jsx
import clsx from 'clsx';
<button className={clsx('px-4 py-2', isActive && 'bg-navy text-cream')}>
```

**Fuente:** [Directives reference — `class:list`](https://docs.astro.build/en/reference/directives-reference/#classlist)

---

## 11. `set:html` SOLO con datos confiables (XSS)

**Cuándo:** CMS, markdown ya procesado, contenido que controlás.

**NUNCA:** user input, comentarios, cualquier string que no hayas generado vos.

**Ejemplo:**
```astro
---
const trustedMarkdown = await fetchFromCMS();
---
<article set:html={trustedMarkdown} />
```

Para data de usuario usar `{}` (escape automático):
```astro
<p>{userComment}</p>  <!-- seguro -->
```

**Fuente:** [Directives reference — `set:html`](https://docs.astro.build/en/reference/directives-reference/#sethtml)

---

## 12. `define:vars` para pasar frontmatter a `<script>`/`<style>`

**Cuándo:** necesitás una variable de Astro en CSS o JS inline sin hacer un import dinámico.

**Ejemplo:**
```astro
---
const accent = '#1F2B38';
---
<style define:vars={{ accent }}>
  h1 { color: var(--accent); }
</style>

<script define:vars={{ accent }}>
  console.log(accent);
</script>
```

**Caveat:** implica `is:inline` (no bundled, no dedup). Solo para casos chicos.

**Fuente:** [Directives reference — `define:vars`](https://docs.astro.build/en/reference/directives-reference/#definevars)

---

## 13. `<script>` bundled vs `is:inline`

**Por defecto** (bundled): Astro procesa, optimiza, deduplica. Múltiples instancias del mismo componente = 1 sola ejecución.

**`is:inline`:** literal en el HTML final. Cada instancia corre. Sin imports relativos, sin npm.

**Cuándo `is:inline`:** scripts que necesitan ejecutarse múltiples veces con diferentes datos, o que usan atributos DOM que bundling rompería (`defer` en un inline script no tiene sentido).

**Ejemplo:**
```astro
<script>
  // bundled por default — se ejecuta una sola vez
  document.querySelectorAll('.toggle').forEach(el => el.addEventListener(...));
</script>

<script is:inline>
  // inline literal — se ejecuta cada vez que aparece
  console.log('Inline script ran');
</script>
```

**Fuente:** [Directives reference — `is:inline`](https://docs.astro.build/en/reference/directives-reference/#isinline)

---

## 14. `transition:animate="none"` para desactivar view transitions

**Cuándo:** querés controlar la transición manualmente, o tu diseño usa `data-mode` + CSS transitions (como el Modo Experto de este proyecto).

**Ejemplo:**
```astro
<html lang="es" transition:animate="none">
```

**Fuente:** [Layouts](https://docs.astro.build/en/basics/layouts/) + [View transitions](https://docs.astro.build/en/guides/view-transitions/)

---

## 15. React 19 hooks — qué usar para qué

| Necesidad | Hook | Cuándo |
|---|---|---|
| State local simple | `useState` | form input, toggle, modal open |
| State con lógica compleja | `useReducer` | múltiples actions sobre mismo state |
| Ref a DOM node | `useRef` | focus, scroll, medir |
| Sync con external system | `useEffect` | event listener, fetch, storage |
| Cálculo pesado cacheado | `useMemo` | filter/sort sobre listas grandes |
| Handler estable para memo child | `useCallback` | pasar `onClick` a componente memoizado |
| Update no bloqueante | `useTransition` | search input que filtra miles de items |
| ID estable para a11y | `useId` | `aria-describedby`, `htmlFor` |
| Sync con external store | `useSyncExternalStore` | (caso raro, no en este proyecto) |

**Fuente:** [React Hooks reference](https://react.dev/reference/react/hooks)

---

## 16. NO usar `useEffect` para data flow interno

**Cuándo:** querés derivar state de props/otro state.

**MAL:**
```jsx
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

**BIEN:**
```jsx
const fullName = `${firstName} ${lastName}`;
```

**Effect es para external systems:** DOM, network, storage, third-party widgets. Si no estás hablando con algo externo, no es Effect.

**Fuente:** [You might not need an effect](https://react.dev/learn/you-might-not-need-an-effect)

---

## 17. Regla de oro: 1 island grande > muchas islands pequeñas

**Cuándo:** el state necesita compartirse entre componentes (cart count en header + items en drawer + total en checkout).

**Problema:** múltiples React islands en la misma página NO comparten state automáticamente, aunque vivan en componentes `.astro` separados. Cada island es un root React independiente.

**Workaround (no ideal):** nanostores globales (ver `PATTERNS.md`).

**Patrón preferido:** **un solo React island grande que envuelve todo lo que comparte state**.

**Ejemplo real (`ShopApp.tsx`):**
```tsx
export default function ShopApp({ products }: Props) {
  const mode = useStore($shopMode);
  const items = useStore($cartItems);
  // ... toda la lógica de la tienda
  return (
    <div>
      <ShopHeader mode={mode} count={items.length} />
      <ProductGrid products={filtered} onAddToCart={...} />
      <CartDrawer />
    </div>
  );
}
```

Renderizado una sola vez en la página:
```astro
<ShopApp products={products} client:load />
```

Aunque uses stores (que técnicamente funcionan entre islands via localStorage sync), **prefiero 1 island** para que React maneje el árbol y los re-renders sean coordinados.

**Fuente:** [Share state between islands](https://docs.astro.build/en/recipes/sharing-state-islands/)

---

## 18. `useTransition` para inputs que filtran listas grandes

**Cuándo:** input que dispara filter/sort sobre 100+ items y querés que el typing no se trabe.

**Ejemplo:**
```jsx
const [query, setQuery] = useState('');
const [filtered, setFiltered] = useState(items);
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setQuery(e.target.value);  // inmediato
  startTransition(() => {
    setFiltered(items.filter(i => i.name.includes(e.target.value)));  // puede esperar
  });
}
```

**En este proyecto:** la tienda filtra ~5 productos. No hace falta. Reservar para casos reales (catálogo de 100+ SKUs).

**Fuente:** [`useTransition`](https://react.dev/reference/react/useTransition)

---

## 19. `useId` para a11y

**Cuándo:** label de form, `aria-describedby`, `aria-controls` con elementos múltiples.

**Ejemplo:**
```jsx
const emailId = useId();
return (
  <>
    <label htmlFor={emailId}>Email</label>
    <input id={emailId} type="email" />
  </>
);
```

Útil porque genera IDs únicos entre server y client render (evita hydration mismatches en SSR).

**Fuente:** [`useId`](https://react.dev/reference/react/useId)

---

## 20. Pre-delivery checklist (componentes)

- [ ] No `client:load` innecesario (preferir `client:visible` para fold)
- [ ] Si depende de localStorage → `client:only="react"` con `slot="fallback"`
- [ ] Props a islands son serializables (sin funciones)
- [ ] Slots usados para contenido Astro dentro de islands
- [ ] `class:list` en Astro, `clsx` en React
- [ ] No `useEffect` para derivar state
- [ ] 1 island grande cuando state se comparte
- [ ] `useId` para todos los a11y IDs
- [ ] `set:html` solo con datos confiables
- [ ] `focus-visible` y `aria-label` en todos los interactivos
