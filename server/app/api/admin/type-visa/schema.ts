import { z } from "zod";

export const typeVisaCreateSchema = z.object({
  nom_visa: z.string().min(2, "Nom du visa trop court").max(50),
  description_courte: z.string().min(5, "Description trop courte"),
});

export const typeVisaUpdateSchema = typeVisaCreateSchema.partial();