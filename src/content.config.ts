import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/products' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    category: z.enum(['best-seller', 'pack', 'subscription']),
    type: z.enum(['blend', 'single-origin', 'decaf', 'microlot', 'special']),
    price: z.number(),
    subscriptionPrice: z.number().optional(),
    unit: z.string(),
    description: z.string(),
    specs: z.object({
      origin: z.string(),
      roast: z.enum(['claro', 'medio', 'oscuro']),
      process: z.string(),
      altitude: z.string(),
      flavorNotes: z.array(z.string()),
      score: z.number().optional(),
      varietal: z.string().optional(),
    }),
    tags: z.array(z.string()),
    image: z.string(),
    badge: z.string().optional(),
    inStock: z.boolean(),
    isNew: z.boolean().optional(),
    isDecaf: z.boolean().optional(),
  }),
});

export const collections = { products };
