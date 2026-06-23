# Design System — Icónico

> Specialty Coffee, Made Simple

**Generated:** 2026-06-18 · **Source:** UI UX Pro Max + Brand Identity

---

## Brand Identity

- **Name:** Icónico
- **Positioning:** Specialty Coffee, Made Simple
- **Personality:** Cercano, Honesto, Minimalista, Premium accesible, Natural, Confiable
- **Visual Keywords:** Quiet Premium, Scandinavian, Japanese Minimalism, Natural Materials, Editorial Design, Warm Neutral Palette, Thoughtful Simplicity
- **Design Principles:** Mucho espacio en blanco, jerarquía clara, menos es más, diseño editorial sobre comercial

---

## Color Palette

| Role | Hex | CSS Variable | Usage | Distribution |
|------|-----|-------------|-------|-------------|
| Primary Background | `#F3EEE6` | `--color-cream` | Fondos principales, web, etiquetas | 80% |
| Secondary Background | `#E4D8C8` | `--color-sand` | Fondos secundarios, bordes suaves, apoyo | — |
| Primary Text | `#1F1F1D` | `--color-charcoal` | Logotipo, textos, máxima jerarquía | — |
| Premium Accent | `#1F2B38` | `--color-navy` | Acentos premium, divisores, elementos destacados | 10% |
| Sensory Icons | `#4A3525` | `--color-coffee` | Iconografía, detalles sensoriales, café | 5% |
| Natural Details | `#6B5E4A` | `--color-sage` | Detalles secundarios, acentos naturales, sostenibilidad | 5% |

## Typography

- **Heading Font:** Playfair Display (serif, editorial, elegante)
- **Body Font:** Inter (sans, limpio, funcional)
- **Mood:** Elegant, luxurious, editorial, timeless, premium yet approachable
- **CSS Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');`

---

## Style Guidelines

**Style:** Exaggerated Minimalism
- Oversized typography, high contrast, massive whitespace, statement design
- Bold minimalism with editorial touch

**Pattern:** Minimal Single Column
- Single CTA focus, large typography, lots of whitespace, no nav clutter, mobile-first
- CTA centered, large button

**Key Effects:**
- `font-size: clamp(3rem, 10vw, 12rem)` for hero
- `font-weight: 700-900` for headings
- `letter-spacing: -0.05em` for display text
- Massive whitespace between sections
- Smooth transitions (200-300ms)
- Subtle hover states

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — Use SVG (Lucide)
- ❌ Missing cursor:pointer on clickable elements
- ❌ Layout-shifting hovers
- ❌ Low contrast text (< 4.5:1 ratio)
- ❌ Instant state changes (always transition 150-300ms)
- ❌ Invisible focus states
- ❌ Dark mode (brand is light-only)
- ❌ AI purple/pink gradients
- ❌ Generic design, no atmosphere
- ❌ Bright neon colors
- ❌ Harsh animations

---

## Pre-Delivery Checklist

- [ ] No emojis as icons
- [ ] All icons from Lucide
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Intersection Observer-based animations only
