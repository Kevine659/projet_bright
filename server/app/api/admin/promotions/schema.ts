import { z } from "zod";

export const createPromotionsSchema = z.object({
  paysId: z.number(),
  typeVisaId: z.number(),
  reduction: z.string(),
});

export const updatePromotionsSchema = createPromotionsSchema.partial();
