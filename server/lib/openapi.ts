import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "@/lib/zod";
import { PaysSchema, updatePaysSchema } from "@/app/api/admin/pays/schema";
import { createArticleDeBlogSchema, updateArticleDeBlogSchema } from "@/app/api/admin/article-de-blog/schema";
import { createCoursLangueSchema, updateCoursLangueSchema } from "@/app/api/admin/cours-langue/schema";
import { createFiliereEtudeSchema, updateFiliereEtudeSchema } from "@/app/api/admin/filiere-etude/schema";
import { createPromotionsSchema, updatePromotionsSchema } from "@/app/api/admin/promotions/schema";
import { typeVisaCreateSchema, typeVisaUpdateSchema } from "@/app/api/admin/type-visa/schema";
import { visaParPaysCreateSchema, visaParPaysUpdateSchema } from "@/app/api/admin/visa-par-pays/schema";
import { createSectionHoraireSchema, updateSectionHoraireSchema } from "@/app/api/admin/section-horaire/schema";
import { createOffreEmploiSchema, updateOffreEmploiSchema } from "@/app/api/admin/offre-emploi/schema";

// Zod is already extended with OpenAPI in lib/zod

export const registry = new OpenAPIRegistry();

// Register global components (e.g., security schemes) on the registry
// Note: generateDocument's config type does not accept a `components` field.
// Security schemes should be registered on the registry instead.
registry.registerComponent("securitySchemes", "sessionAuth", {
  type: "apiKey",
  in: "cookie",
  name: "sessionId",
});

// Register shared schemas
const Pays = registry.register("Pays", PaysSchema);
const IdPayload = registry.register(
  "IdPayload",
  z.object({ id: z.number() })
);

// Register paths for Admin Pays endpoints
registry.registerPath({
  method: "get",
  path: "/api/admin/pays",
  summary: "Lister tous les pays",
  tags: ["Admin/Pays"],
  security: [{ sessionAuth: [] }],
  responses: {
    200: {
      description: "Liste des pays",
      content: {
        "application/json": {
          schema: z.array(PaysSchema),
        },
      },
    },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/pays",
  summary: "Créer un pays",
  tags: ["Admin/Pays"],
  security: [{ sessionAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: Pays },
      },
    },
  },
  responses: {
    200: {
      description: "Pays créé",
      content: { "application/json": { schema: Pays } },
    },
    400: { description: "Requête invalide" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/pays",
  summary: "Mettre à jour un pays",
  tags: ["Admin/Pays"],
  security: [{ sessionAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z
            .object({ id: z.number() })
            .and(updatePaysSchema),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Pays mis à jour",
      content: { "application/json": { schema: Pays } },
    },
    400: { description: "ID requis" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/pays",
  summary: "Supprimer un pays",
  tags: ["Admin/Pays"],
  security: [{ sessionAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: IdPayload },
      },
    },
  },
  responses: {
    200: { description: "Supprimé" },
    400: { description: "ID requis" },
    401: { description: "Unauthorized" },
  },
});

// Register paths for Admin Avis endpoints
registry.registerPath({
  method: "get",
  path: "/api/admin/avis",
  summary: "Lister les avis voyageurs",
  tags: ["Admin/Avis"],
  security: [{ sessionAuth: [] }],
  request: {
    query: z.object({ approuve: z.string().optional() }),
  },
  responses: {
    200: {
      description: "Liste des avis",
      content: {
        "application/json": {
          schema: z.array(z.unknown()),
        },
      },
    },
    401: { description: "Unauthorized" },
  },
});

// Register paths for Admin Article de Blog endpoints
const ArticleCreate = registry.register("ArticleDeBlogCreate", createArticleDeBlogSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/article-de-blog",
  summary: "Lister les articles de blog",
  tags: ["Admin/ArticleDeBlog"],
  security: [{ sessionAuth: [] }],
  responses: {
    200: {
      description: "Liste des articles",
      content: {
        "application/json": { schema: z.array(ArticleCreate) },
      },
    },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/article-de-blog",
  summary: "Créer un article de blog",
  tags: ["Admin/ArticleDeBlog"],
  security: [{ sessionAuth: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: ArticleCreate } },
    },
  },
  responses: {
    200: { description: "Article créé", content: { "application/json": { schema: ArticleCreate } } },
    400: { description: "Requête invalide" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/article-de-blog",
  summary: "Mettre à jour un article de blog",
  tags: ["Admin/ArticleDeBlog"],
  security: [{ sessionAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: z.object({ id: z.number() }).and(updateArticleDeBlogSchema) },
      },
    },
  },
  responses: {
    200: { description: "Article mis à jour", content: { "application/json": { schema: ArticleCreate } } },
    400: { description: "ID requis" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/article-de-blog",
  summary: "Supprimer un article de blog",
  tags: ["Admin/ArticleDeBlog"],
  security: [{ sessionAuth: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: IdPayload } },
    },
  },
  responses: {
    200: { description: "Supprimé" },
    400: { description: "ID requis" },
    401: { description: "Unauthorized" },
  },
});

export function generateOpenApi() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Admin API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
    security: [{ sessionAuth: [] }],
  });
}

// ---------------- Additional Admin Endpoints ----------------

// Cours Langue
const CoursCreate = registry.register("CoursLangueCreate", createCoursLangueSchema);
const CoursUpdate = registry.register("CoursLangueUpdate", updateCoursLangueSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/cours-langue",
  summary: "Lister les cours de langue",
  tags: ["Admin/CoursLangue"],
  security: [{ sessionAuth: [] }],
  responses: {
    200: { description: "Liste des cours", content: { "application/json": { schema: z.array(CoursCreate) } } },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/cours-langue",
  summary: "Créer un cours de langue",
  tags: ["Admin/CoursLangue"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: CoursCreate } } } },
  responses: { 200: { description: "Créé", content: { "application/json": { schema: CoursCreate } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/cours-langue",
  summary: "Mettre à jour un cours de langue",
  tags: ["Admin/CoursLangue"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(CoursUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: CoursCreate } } }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/cours-langue",
  summary: "Supprimer un cours de langue",
  tags: ["Admin/CoursLangue"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Filière Étude
const FiliereCreate = registry.register("FiliereEtudeCreate", createFiliereEtudeSchema);
const FiliereUpdate = registry.register("FiliereEtudeUpdate", updateFiliereEtudeSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/filiere-etude",
  summary: "Lister les filières d'étude",
  tags: ["Admin/FiliereEtude"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Liste", content: { "application/json": { schema: z.array(FiliereCreate) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/filiere-etude",
  summary: "Créer une filière d'étude",
  tags: ["Admin/FiliereEtude"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: FiliereCreate } } } },
  responses: { 200: { description: "Créé", content: { "application/json": { schema: FiliereCreate } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/filiere-etude",
  summary: "Mettre à jour une filière d'étude",
  tags: ["Admin/FiliereEtude"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(FiliereUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: FiliereCreate } } }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/filiere-etude",
  summary: "Supprimer une filière d'étude",
  tags: ["Admin/FiliereEtude"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Promotions
const PromoCreate = registry.register("PromotionsCreate", createPromotionsSchema);
const PromoUpdate = registry.register("PromotionsUpdate", updatePromotionsSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/promotions",
  summary: "Lister les promotions",
  tags: ["Admin/Promotions"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Liste", content: { "application/json": { schema: z.array(PromoCreate) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/promotions",
  summary: "Créer une promotion",
  tags: ["Admin/Promotions"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: PromoCreate } } } },
  responses: { 200: { description: "Créé", content: { "application/json": { schema: PromoCreate } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/promotions",
  summary: "Mettre à jour une promotion",
  tags: ["Admin/Promotions"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(PromoUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: PromoCreate } } }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/promotions",
  summary: "Supprimer une promotion",
  tags: ["Admin/Promotions"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Type Visa
const TypeVisaCreate = registry.register("TypeVisaCreate", typeVisaCreateSchema);
const TypeVisaUpdate = registry.register("TypeVisaUpdate", typeVisaUpdateSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/type-visa",
  summary: "Lister les types de visa",
  tags: ["Admin/TypeVisa"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Liste", content: { "application/json": { schema: z.array(TypeVisaCreate) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/type-visa",
  summary: "Créer un type de visa",
  tags: ["Admin/TypeVisa"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: TypeVisaCreate } } } },
  responses: { 200: { description: "Créé", content: { "application/json": { schema: TypeVisaCreate } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/type-visa",
  summary: "Mettre à jour un type de visa",
  tags: ["Admin/TypeVisa"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(TypeVisaUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: TypeVisaCreate } } }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/type-visa",
  summary: "Supprimer un type de visa",
  tags: ["Admin/TypeVisa"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Visa par Pays
const VisaPaysCreate = registry.register("VisaParPaysCreate", visaParPaysCreateSchema);
const VisaPaysUpdate = registry.register("VisaParPaysUpdate", visaParPaysUpdateSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/visa-par-pays",
  summary: "Lister les visas par pays",
  tags: ["Admin/VisaParPays"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Liste", content: { "application/json": { schema: z.array(VisaPaysCreate) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/visa-par-pays",
  summary: "Créer un visa par pays",
  tags: ["Admin/VisaParPays"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: VisaPaysCreate } } } },
  responses: { 201: { description: "Créé", content: { "application/json": { schema: VisaPaysCreate } } }, 409: { description: "Conflit (doublon)" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/visa-par-pays",
  summary: "Mettre à jour un visa par pays",
  tags: ["Admin/VisaParPays"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(VisaPaysUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: VisaPaysCreate } } }, 409: { description: "Conflit (doublon)" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/visa-par-pays",
  summary: "Supprimer un visa par pays",
  tags: ["Admin/VisaParPays"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Section Horaire
const SectionCreate = registry.register("SectionHoraireCreate", createSectionHoraireSchema);
const SectionUpdate = registry.register("SectionHoraireUpdate", updateSectionHoraireSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/section-horaire",
  summary: "Lister les sections horaires",
  tags: ["Admin/SectionHoraire"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Liste", content: { "application/json": { schema: z.array(SectionCreate) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/section-horaire",
  summary: "Créer une section horaire",
  tags: ["Admin/SectionHoraire"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: SectionCreate } } } },
  responses: { 200: { description: "Créé", content: { "application/json": { schema: SectionCreate } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/section-horaire",
  summary: "Mettre à jour une section horaire",
  tags: ["Admin/SectionHoraire"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(SectionUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: SectionCreate } } }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/section-horaire",
  summary: "Supprimer une section horaire",
  tags: ["Admin/SectionHoraire"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Offre Emploi
const OffreCreate = registry.register("OffreEmploiCreate", createOffreEmploiSchema);
const OffreUpdate = registry.register("OffreEmploiUpdate", updateOffreEmploiSchema);

registry.registerPath({
  method: "get",
  path: "/api/admin/offre-emploi",
  summary: "Lister les offres d'emploi",
  tags: ["Admin/OffreEmploi"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Liste", content: { "application/json": { schema: z.array(OffreCreate) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/offre-emploi",
  summary: "Créer une offre d'emploi",
  tags: ["Admin/OffreEmploi"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: OffreCreate } } } },
  responses: { 200: { description: "Créé", content: { "application/json": { schema: OffreCreate } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "patch",
  path: "/api/admin/offre-emploi",
  summary: "Mettre à jour une offre d'emploi",
  tags: ["Admin/OffreEmploi"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }).and(OffreUpdate) } } } },
  responses: { 200: { description: "Mis à jour", content: { "application/json": { schema: OffreCreate } } }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/admin/offre-emploi",
  summary: "Supprimer une offre d'emploi",
  tags: ["Admin/OffreEmploi"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: IdPayload } } } },
  responses: { 200: { description: "Supprimé" }, 400: { description: "ID requis" }, 401: { description: "Unauthorized" } },
});

// Auth: login / logout / me / register
registry.registerPath({
  method: "post",
  path: "/api/admin/login",
  summary: "Connexion",
  tags: ["Admin/Auth"],
  security: [],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ email: z.string().email(), password: z.string().min(6) }) } } } },
  responses: { 200: { description: "Connecté", content: { "application/json": { schema: z.object({ success: z.boolean() }) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/logout",
  summary: "Déconnexion",
  tags: ["Admin/Auth"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Déconnecté", content: { "application/json": { schema: z.object({ success: z.boolean() }) } } } },
});

registry.registerPath({
  method: "get",
  path: "/api/admin/me",
  summary: "Utilisateur courant",
  tags: ["Admin/Auth"],
  security: [{ sessionAuth: [] }],
  responses: { 200: { description: "Utilisateur", content: { "application/json": { schema: z.object({ user: z.unknown() }) } } }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/admin/register",
  summary: "Inscription",
  tags: ["Admin/Auth"],
  security: [],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ email: z.string().email(), password: z.string().min(6) }) } } } },
  responses: { 200: { description: "Inscrit", content: { "application/json": { schema: z.object({ success: z.boolean() }) } } } },
});

// Avis approve
registry.registerPath({
  method: "post",
  path: "/api/admin/avis/approve",
  summary: "Approuver un avis",
  tags: ["Admin/Avis"],
  security: [{ sessionAuth: [] }],
  request: { body: { required: true, content: { "application/json": { schema: z.object({ id: z.number() }) } } } },
  responses: { 200: { description: "Approuvé" }, 401: { description: "Unauthorized" } },
});
