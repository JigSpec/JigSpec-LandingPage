import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stage = z.enum(['Available for work', 'Interning', 'Open role']);

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    stage,
    order: z.number().int().min(1).max(6),
    cta: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('external'),
        url: z.string().url(),
        label: z.string().default('Visit'),
      }),
      z.object({
        type: z.literal('interest'),
        label: z.string().default('Tell us'),
      }),
    ]),
    headline: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { products, blog };
