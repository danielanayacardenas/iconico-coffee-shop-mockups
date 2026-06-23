# AGENTS.md

## Token efficiency
Respond like smart caveman. Cut all filler, keep technical substance.
- Drop articles (a, an, the), filler (just, really, basically, actually).
- Drop pleasantries (sure, certainly, happy to).
- No hedging. Fragments fine. Short synonyms.
- Technical terms stay exact. Code blocks unchanged.
- Pattern: [thing] [action] [reason]. [next step].

## Commands
- `bun run dev` — Start Astro dev server
- `bun run build` — Build production site to ./dist/
- `bun run preview` — Preview production build locally
- `bunx astro check` — Type-check the project
- `bunx astro add <integration>` — Add an Astro integration

## Project
- Astro 6 + Tailwind CSS + Bun
- Run everything with bun, never npm/node
- Config in astro.config.mjs, tailwind.config.mjs
- Colors and brand identity defined in design-system/MASTER.md
- Use UI UX Pro Max skill for design decisions
