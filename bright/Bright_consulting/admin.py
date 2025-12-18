from django.contrib import admin

# Register your models here.
from .models import ArticleDeBlog, VictoireVoyageur,Promotions, Pays, TypeVisa, VisaParPays, OffreEmploi, FiliereEtude, CoursLangue, SectionHoraire

# Register your models here.

class AdminPays(admin.ModelAdmin):
    
    list_display = ('drapeau','nom_pays','continent')

class AdminTypeVisa(admin.ModelAdmin):
    
    list_display = ('nom_visa','description_courte')

class AdminVisaParPays(admin.ModelAdmin):
    
    list_display = ('pays','type_visa')

class AdminOffreEmploi(admin.ModelAdmin):
    
    list_display = ('visa_pays','poste_disponible','salaire_mensuel_min','salaire_mensuel_max','exigences_specifiques')


class AdminFiliereEtude(admin.ModelAdmin):
    
    list_display = ('nom_filiere','domaine_etude')

class AdminCoursLangue(admin.ModelAdmin):
    
    list_display = ('nom_cours','description_programme')


class AdminSectionHoraire(admin.ModelAdmin):
    
    list_display = ('cours','nom_section','jours_semaine','heure_debut','duree_heures','prix_total', 'date_debut')

class AdminPromotions(admin.ModelAdmin):
    list_display = ('pays','type_visa','reduction')   

class AdminVictoireVoyageur(admin.ModelAdmin):
    list_display = ('photo','nom_voyageur','metier', 'pays_destination', 'type_visa')   

class AdminArticleDeBlog(admin.ModelAdmin):
    list_display = ('image','titre','description', 'avis_entreprise')  


admin.site.register(ArticleDeBlog, AdminArticleDeBlog)
admin.site.register(VictoireVoyageur, AdminVictoireVoyageur)
admin.site.register(Pays, AdminPays)
admin.site.register(TypeVisa, AdminTypeVisa)
admin.site.register(VisaParPays, AdminVisaParPays)
admin.site.register(OffreEmploi, AdminOffreEmploi)
admin.site.register(FiliereEtude, AdminFiliereEtude)
admin.site.register(CoursLangue, AdminCoursLangue)
admin.site.register(SectionHoraire, AdminSectionHoraire)
admin.site.register(Promotions, AdminPromotions)