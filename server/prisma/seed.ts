import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  /* =========================
     1️ Permissions
     ========================= */

  const permissionsData = [
    // Pays
    { resource: "pays", action: "view" },
    { resource: "pays", action: "create" },

    // TypeVisa
    { resource: "type_visa", action: "view" },
    { resource: "type_visa", action: "create" },

    // VisaParPays
    { resource: "visa_par_pays", action: "view" },
    { resource: "visa_par_pays", action: "create" },

    // Avis
    { resource: "avis", action: "view" },
    { resource: "avis", action: "approve" },

    // Promotions
    { resource: "promotions", action: "view" },
    { resource: "promotions", action: "create" },

    // Offre emploi
    { resource: "offre_emploi", action: "view" },
    { resource: "offre_emploi", action: "create" },

    // Filière
    { resource: "filiere_etude", action: "view" },
    { resource: "filiere_etude", action: "create" },

    // Cours & sections
    { resource: "cours_langue", action: "view" },
    { resource: "cours_langue", action: "create" },
    { resource: "section_horaire", action: "view" },
    { resource: "section_horaire", action: "create" },

    // Articles
    { resource: "article_blog", action: "view" },
    { resource: "article_blog", action: "create" },
  ];

  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action } },
      update: {},
      create: p,
    });
  }

  /* =========================
     2️ Rôle ADMIN
     ========================= */

  const adminRole = await prisma.role.upsert({
    where: { key: "admin" },
    update: {},
    create: {
      key: "admin",
      label: "Administrateur",
    },
  });

  const permissions = await prisma.permission.findMany();

  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  /* =========================
     3️ Utilisateur admin
     ========================= */

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@local.test" },
    update: {},
    create: {
      email: "admin@local.test",
      password: bcrypt.hashSync("admin123", 10),
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  /* =========================
     4️ Données métier minimales
     ========================= */

  const france = await prisma.pays.create({
    data: {
      nom_pays: "France",
      continent: "Europe",
    },
  });

  const visaTravail = await prisma.typeVisa.create({
    data: {
      nom_visa: "Visa travail",
      description_courte: "Visa permettant de travailler",
    },
  });

  await prisma.visaParPays.create({
    data: {
      paysId: france.id,
      typeVisaId: visaTravail.id,
    },
  });

  await prisma.avisVoyageur.create({
    data: {
      nom_auteur: "Jean Dupont",
      email: "jean@test.com",
      contenu_avis: "Très bonne expérience",
      note: 5,
      approuve: false,
    },
  });

  console.log("✅ Seed terminé avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
