import { z } from "zod";

export const createCoursLangueSchema = z.object({
  nom_cours: z.string(),
  description_programme: z.string(),
});

export const updateCoursLangueSchema = createCoursLangueSchema.partial();
