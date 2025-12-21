import { z } from "zod";

export const createArticleDeBlogSchema = z.object({
  titre: z.string(),
  description: z.string(),
  avis_entreprise: z.string(),
  image: z.string().optional(),
});

export const updateArticleDeBlogSchema = createArticleDeBlogSchema.partial();
