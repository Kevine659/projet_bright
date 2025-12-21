import { z } from "zod";

export const PaysSchema = z.object({
  nom_pays: z.string().min(2),
  continent: z.string(),
  drapeau: z.string().optional(),
});

export const updatePaysSchema = PaysSchema.partial();
  