import { z as baseZod } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Apply OpenAPI augmentation exactly once to a single Zod instance
extendZodWithOpenApi(baseZod);

export const z = baseZod;
export default baseZod;
