import { z } from "zod";

export const createOffreEmploiSchema = z.object({
  visaParPaysId: z.number(),
  poste_disponible: z.string(),
  salaire_mensuel_min: z.number(),
  salaire_mensuel_max: z.number(),
  exigences_specifiques: z.string(),
});

export const updateOffreEmploiSchema = createOffreEmploiSchema.partial();
