# Figma Import Guide — Icónico Design Tokens

## Setup
1. **Instala el plugin "Tokens Studio for Figma"** (formerly Figma Tokens)
   - Figma → Resources → Plugins → search "Tokens Studio"
2. **Crea un nuevo archivo en Figma** (vacío, llamado "Icónico Design System")
3. **Abre el plugin** → clic en el ícono de engranaje (Settings) → **Load from JSON**
4. **Pega el contenido de `design-system/tokens.json`** o selecciona el archivo
5. **Clic en "Load"** → el plugin genera las collections automáticamente

## Qué se genera

| Token Type | Figma Output |
|---|---|
| `color.*` | Variables con collection "Icónico / Colors", mode "Light" |
| `fontFamily.*` | Text Styles base para Playfair Display + Inter |
| `fontSize.*` | Variables de spacing o text styles según config |
| `letterSpacing.*` | Variables de number |
| `spacing.*` | Variables de number (Spacing) |
| `radius.*` | Variables de number (Border Radius) |
| `motion.duration.*` | Variables de number |
| `motion.easing.*` | Variables de string (cubic-bezier) |
| `elevation.*` | Effect Styles para box-shadow |

## Crear Text Styles manualmente

El plugin maneja los valores pero los **Text Styles** debes crearlos a mano la primera vez, apuntando a las variables:

| Style Name | font-family | font-weight | font-size | letter-spacing |
|---|---|---|---|---|
| `Display/Hero` | Playfair Display | 700 | 96px (10vw) | -0.05em |
| `Heading/H1` | Playfair Display | 700 | 64px | -0.03em |
| `Heading/H2` | Playfair Display | 600 | 40px | -0.02em |
| `Heading/H3` | Playfair Display | 600 | 24px | -0.02em |
| `Body/Large` | Inter | 400 | 18px | 0 |
| `Body/Base` | Inter | 400 | 16px | 0 |
| `Body/Small` | Inter | 400 | 14px | 0 |
| `Label/Default` | Inter | 500 | 14px | 0 |
| `Eyebrow` | Inter | 500 | 11px | 0.3em (uppercase) |
| `Caption` | Inter | 400 | 12px | 0 |

## Vincular a CSS Variables del proyecto

Para mantener sincronía, los tokens del JSON están mapeados a las CSS variables usadas en `src/styles/global.css`:

| Token | CSS Variable |
|---|---|
| color/cream | `--color-cream` |
| color/sand | `--color-sand` |
| color/charcoal | `--color-charcoal` |
| color/navy | `--color-navy` |
| color/coffee | `--color-coffee` |
| color/sage | `--color-sage` |
| color/forest | (inline only) |

Si cambias un color en Figma, regenéralo aquí y actualiza `global.css` con el nuevo hex.

## Brandbook local

Abre `src/pages/brandbook.astro` en el dev server (`bun run dev`) para ver el brandbook visual completo:

```
http://localhost:4321/brandbook
```

Incluye paleta, tipografía, specimens en contexto, y tabla de tokens.

## Versionado

Cuando cambies tokens:
1. Actualiza `design-system/tokens.json`
2. Sincroniza con Figma (Tokens Studio → "Update" desde el JSON)
3. Aplica cambios a `src/styles/global.css` si son colors
4. Regenera el brandbook si agregaste tokens nuevos
5. Commit + push
