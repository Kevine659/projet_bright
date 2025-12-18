from django.db import models

# Create your models here.
class Pays(models.Model):
    drapeau = models.ImageField(upload_to='images/', blank=True, null=True,verbose_name="Image du Drapeau")
    nom_pays = models.CharField(max_length=100, unique=True, verbose_name="Nom du Pays")
    continent = models.CharField(max_length=50)
    

    def __str__(self):
        return self.nom_pays

    class Meta:
        verbose_name_plural = "Pays"


class TypeVisa(models.Model):
    nom_visa = models.CharField(max_length=50, unique=True, verbose_name="Nom du Visa")
    description_courte = models.TextField()

    def __str__(self):
        return self.nom_visa

    class Meta:
        verbose_name = "Type de Visa"        

class ArticleDeBlog(models.Model):
    image = models.ImageField(upload_to='images/', blank=True, null=True,verbose_name="Image du Drapeau")
    titre = models.CharField(max_length=100, verbose_name="Titre de l'article")
    description = models.TextField()
    avis_entreprise = models.TextField()

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Articles de blog"
        verbose_name_plural = "Articles de blog"

class VisaParPays(models.Model):
    pays = models.ForeignKey(Pays, on_delete=models.CASCADE)
    type_visa = models.ForeignKey(TypeVisa, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.type_visa.nom_visa} pour {self.pays.nom_pays}"

    class Meta:
        # Assure qu'un type de visa n'est pas répertorié deux fois pour le même pays
        unique_together = ('pays', 'type_visa')
        verbose_name = "Visa par Pays"
        verbose_name_plural = "Visas par Pays"

class VictoireVoyageur(models.Model):
    nom_voyageur = models.CharField(max_length=100, verbose_name="Nom complet du Voyageur")
    metier = models.CharField(max_length=100, verbose_name="Métier ou Profession")
    pays_destination = models.CharField(max_length=100, verbose_name="Pays d'Arrivée (Destination)")
    photo = models.ImageField(upload_to='victoires_photos/', verbose_name="Photo du Voyageur") 

    # Lien vers le type de visa (relation "many-to-one")
    type_visa = models.ForeignKey(
        TypeVisa,
        on_delete=models.SET_NULL, # Gère la suppression du TypeVisa (ici, il devient NULL si le visa est supprimé)
        null=True, # Permet de ne pas avoir de visa associé
        blank=True, # Permet de laisser le champ vide dans le formulaire admin/front-end
        verbose_name="Type de Visa Obtenu"
    )

    def __str__(self):
        return f"Victoire de {self.nom_voyageur} pour {self.pays_destination}"

    class Meta:
        verbose_name = "Victoire de Voyageur"
        verbose_name_plural = "Victoires des Voyageurs"        


class Promotions(models.Model):
    pays = models.ForeignKey(Pays, on_delete=models.CASCADE)
    type_visa = models.ForeignKey(TypeVisa, on_delete=models.CASCADE)
    reduction = models.TextField(verbose_name="reduction")
    
    def __str__(self):
        return f"{self.type_visa.nom_visa} pour {self.pays.nom_pays}"

    class Meta:
        unique_together = ('pays', 'type_visa')
        verbose_name = "Promotion"
        verbose_name_plural = "Promotions"


class OffreEmploi(models.Model):
    visa_pays = models.ForeignKey(VisaParPays, on_delete=models.CASCADE, 
    limit_choices_to={'type_visa__nom_visa': 'Visa travail'}, 
    verbose_name="Lien Visa Travail")
    poste_disponible = models.CharField(max_length=100)
    salaire_mensuel_min = models.DecimalField(max_digits=12, decimal_places=2)
    salaire_mensuel_max = models.DecimalField(max_digits=12, decimal_places=2)
    exigences_specifiques = models.TextField(verbose_name="Exigences du Poste")

    def __str__(self):
        return f"{self.poste_disponible} chez({self.visa_pays.pays.nom_pays})"

    class Meta:
        verbose_name = "Offre d'Emploi"
        verbose_name_plural = "Offres d'Emploi"
        

    

class FiliereEtude(models.Model):
 
    nom_filiere = models.CharField(max_length=150, verbose_name="Nom de la Filière")
    domaine_etude = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nom_filiere} "

    class Meta:
        verbose_name = "Filière d'Étude"
        verbose_name_plural = "Filières d'Étude"

    
class AvisVoyageur(models.Model):
    nom_auteur = models.CharField(max_length=100, verbose_name="Nom complet")
    email = models.EmailField(blank=True, null=True, verbose_name="Email (Non Public)")
    contenu_avis = models.TextField(verbose_name="Votre Avis/Témoignage")
    note = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        default=5,
        verbose_name="Note (sur 5)"
    )
    date_soumission = models.DateTimeField(auto_now_add=True)
    approuve = models.BooleanField(default=False, verbose_name="Approuvé pour publication")

    def __str__(self):
        return f"Avis de {self.nom_auteur} - Note: {self.note}"

    class Meta:
        verbose_name = "Avis Voyageur"
        verbose_name_plural = "Avis des Voyageurs"
        ordering = ['-date_soumission']
    
class CoursLangue(models.Model):
    nom_cours = models.CharField(max_length=100, verbose_name="Nom du Cours")
    description_programme = models.TextField()

    def __str__(self):
        return self.nom_cours

    class Meta:
        verbose_name = "Cours de Langue"
        verbose_name_plural = "Cours de Langue"


class SectionHoraire(models.Model):
    cours = models.ForeignKey(CoursLangue, on_delete=models.CASCADE)
    nom_section = models.CharField(max_length=50, verbose_name="Nom de la Section (ex: Soir, Intensif)")
    jours_semaine = models.CharField(max_length=100, verbose_name="Jours (ex: Lun-Mer-Ven)")
    heure_debut = models.TimeField(verbose_name="Heure de Début")
    duree_heures = models.DecimalField(max_digits=4, decimal_places=2, verbose_name="Durée (heures)")
    prix_total = models.DecimalField(max_digits=10, decimal_places=2)
    date_debut = models.DateField(blank=True, null=True, verbose_name="Date de Début (optionnel)")

    def __str__(self):
        return f"{self.cours.nom_cours} - {self.nom_section}"

    class Meta:
        verbose_name = "Section et Horaire"
        verbose_name_plural = "Sections et Horaires"