import { z } from "zod";

export const createSectionHoraireSchema = z.object({
  coursId: z.number(),
  nom_section: z.string(),
  jours_semaine: z.string(),
  heure_debut: z.string(),
  duree_heures: z.number(),
  prix_total: z.number(),
  date_debut: z.string().optional(),
});

export const updateSectionHoraireSchema = createSectionHoraireSchema.partial();
