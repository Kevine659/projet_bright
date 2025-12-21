-- CreateTable
CREATE TABLE "pays" (
    "id" SERIAL NOT NULL,
    "drapeau" TEXT,
    "nom_pays" TEXT NOT NULL,
    "continent" TEXT NOT NULL,

    CONSTRAINT "pays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_visa" (
    "id" SERIAL NOT NULL,
    "nom_visa" TEXT NOT NULL,
    "description_courte" TEXT NOT NULL,

    CONSTRAINT "type_visa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_blog" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avis_entreprise" TEXT NOT NULL,

    CONSTRAINT "article_blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_par_pays" (
    "id" SERIAL NOT NULL,
    "paysId" INTEGER NOT NULL,
    "typeVisaId" INTEGER NOT NULL,

    CONSTRAINT "visa_par_pays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "victoire_voyageur" (
    "id" SERIAL NOT NULL,
    "nom_voyageur" TEXT NOT NULL,
    "metier" TEXT NOT NULL,
    "pays_destination" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "typeVisaId" INTEGER,

    CONSTRAINT "victoire_voyageur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "paysId" INTEGER NOT NULL,
    "typeVisaId" INTEGER NOT NULL,
    "reduction" TEXT NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offre_emploi" (
    "id" SERIAL NOT NULL,
    "visaParPaysId" INTEGER NOT NULL,
    "poste_disponible" TEXT NOT NULL,
    "salaire_mensuel_min" DECIMAL(12,2) NOT NULL,
    "salaire_mensuel_max" DECIMAL(12,2) NOT NULL,
    "exigences_specifiques" TEXT NOT NULL,

    CONSTRAINT "offre_emploi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filiere_etude" (
    "id" SERIAL NOT NULL,
    "nom_filiere" TEXT NOT NULL,
    "domaine_etude" TEXT NOT NULL,

    CONSTRAINT "filiere_etude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avis_voyageur" (
    "id" SERIAL NOT NULL,
    "nom_auteur" TEXT NOT NULL,
    "email" TEXT,
    "contenu_avis" TEXT NOT NULL,
    "note" INTEGER NOT NULL DEFAULT 5,
    "date_soumission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approuve" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "avis_voyageur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cours_langue" (
    "id" SERIAL NOT NULL,
    "nom_cours" TEXT NOT NULL,
    "description_programme" TEXT NOT NULL,

    CONSTRAINT "cours_langue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_horaire" (
    "id" SERIAL NOT NULL,
    "coursId" INTEGER NOT NULL,
    "nom_section" TEXT NOT NULL,
    "jours_semaine" TEXT NOT NULL,
    "heure_debut" TIMESTAMP(3) NOT NULL,
    "duree_heures" DECIMAL(4,2) NOT NULL,
    "prix_total" DECIMAL(10,2) NOT NULL,
    "date_debut" TIMESTAMP(3),

    CONSTRAINT "section_horaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pays_nom_pays_key" ON "pays"("nom_pays");

-- CreateIndex
CREATE UNIQUE INDEX "type_visa_nom_visa_key" ON "type_visa"("nom_visa");

-- CreateIndex
CREATE UNIQUE INDEX "visa_par_pays_paysId_typeVisaId_key" ON "visa_par_pays"("paysId", "typeVisaId");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_paysId_typeVisaId_key" ON "promotions"("paysId", "typeVisaId");

-- CreateIndex
CREATE INDEX "avis_voyageur_date_soumission_idx" ON "avis_voyageur"("date_soumission");

-- AddForeignKey
ALTER TABLE "visa_par_pays" ADD CONSTRAINT "visa_par_pays_paysId_fkey" FOREIGN KEY ("paysId") REFERENCES "pays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visa_par_pays" ADD CONSTRAINT "visa_par_pays_typeVisaId_fkey" FOREIGN KEY ("typeVisaId") REFERENCES "type_visa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "victoire_voyageur" ADD CONSTRAINT "victoire_voyageur_typeVisaId_fkey" FOREIGN KEY ("typeVisaId") REFERENCES "type_visa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_paysId_fkey" FOREIGN KEY ("paysId") REFERENCES "pays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_typeVisaId_fkey" FOREIGN KEY ("typeVisaId") REFERENCES "type_visa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offre_emploi" ADD CONSTRAINT "offre_emploi_visaParPaysId_fkey" FOREIGN KEY ("visaParPaysId") REFERENCES "visa_par_pays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_horaire" ADD CONSTRAINT "section_horaire_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "cours_langue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
