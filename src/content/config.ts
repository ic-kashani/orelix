import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    order: z.number(),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

export const collections = { services };
