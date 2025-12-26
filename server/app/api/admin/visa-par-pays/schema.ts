import { z } from "zod";

export const visaParPaysCreateSchema = z.object({
  paysId: z.number().int().positive(),
  typeVisaId: z.number().int().positive(),
});

export const visaParPaysUpdateSchema = visaParPaysCreateSchema.partial();
