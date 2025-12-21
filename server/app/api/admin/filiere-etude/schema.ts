import { z } from "zod";

export const createFiliereEtudeSchema = z.object({
  nom_filiere: z.string(),
  domaine_etude: z.string(),
});

export const updateFiliereEtudeSchema = createFiliereEtudeSchema.partial();
