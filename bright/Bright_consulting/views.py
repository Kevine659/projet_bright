from django.shortcuts import render, redirect
from django.urls import reverse
from .models import ArticleDeBlog, CoursLangue, VictoireVoyageur, Pays,  Promotions , OffreEmploi, FiliereEtude, VisaParPays
from collections import defaultdict
from .forms import AvisForm
from django.db.models import Prefetch
from django.contrib import messages

def soumettre_avis(request):
    if request.method == 'POST':
        form = AvisForm(request.POST)
        
        if form.is_valid():
            avis_instance = form.save(commit=False)
            avis_instance.approuve = False
            avis_instance.save()
            
            messages.success(request, "Merci ! Votre avis a été soumis et sera publié après vérification.")
            
            return redirect(request.META.get('HTTP_REFERER', '/'))
    
    form = AvisForm()
    context = {
        'form': form,
        'titre': 'Laissez votre avis sur notre service'
    }
    return render(request, 'avis/formulaire_avis.html', context)




def home(request):
  
    pays_data = Pays.objects.all().order_by('pk').prefetch_related(
        'visaparpays_set__type_visa'
    )

    toutes_promotions = Promotions.objects.all().select_related(
        'pays', 
        'type_visa'
    ).order_by('pays__nom_pays', 'type_visa__nom_visa')
    
    context = {
        'pays_avec_visas': pays_data,

        'promotions': toutes_promotions

    }
    return render(request, 'home.html', context)




def visa_etudiant(request):
    
    filiere_prefetch = Prefetch(
        'filiereetude_set',
        queryset=FiliereEtude.objects.all().order_by('nom_filiere')
    )
    
    liste_filieres = FiliereEtude.objects.all().order_by('nom_filiere')

    opportunites_visa_etudiant = VisaParPays.objects.filter(
        type_visa__nom_visa="Visa etudiant"
    ).select_related('pays').order_by('pays__nom_pays')
    
    opportunites_par_pays = defaultdict(list)
    
    try:
        
        victoires = VictoireVoyageur.objects.filter(
            type_visa__nom_visa="Visa etudiant"
        )
    except VictoireVoyageur.DoesNotExist:
        victoires = []

    form_avis = AvisForm()

    context = {
        'liste_filieres': liste_filieres,
        'opportunites_pays': opportunites_visa_etudiant,
        'opportunites_regroupees': dict(opportunites_par_pays).items(),
        'titre_page': "Opportunités de Visa Étudiant",
        'victoires': victoires,
        'titre_page2': 'Nos Victoires : Visa Etudiant',
        'titre_page3': 'Questions Fréquements posées',
        'form_avis': form_avis

    }
    return render(request, 'visa_etudiant.html', context)



def visa_travail(request):

    offres = OffreEmploi.objects.all().select_related(
        'visa_pays',
        'visa_pays__pays',
        'visa_pays__type_visa'
    ).order_by('visa_pays__pays__nom_pays', 'poste_disponible')
    
    offres_par_pays = defaultdict(list)
    
    for offre in offres:
        pays_obj = offre.visa_pays.pays
        offres_par_pays[pays_obj].append(offre)

    try:
        
        victoires = VictoireVoyageur.objects.filter(
            type_visa__nom_visa="Visa travail"
        )
    except VictoireVoyageur.DoesNotExist:
        victoires = []
    
    form_avis = AvisForm()
    
    context = {
        'offres_regroupees': dict(offres_par_pays).items(),
        'titre_page': "Offres d'Emplois disponibles par Pays",

        'titre_page2': 'Nos Victoires : Visa de Travail',
        'titre_page3': 'Questions Fréquements posées',
        'victoires': victoires,
        'form_avis': form_avis
    }
    return render(request, 'visa_travail.html', context)

def cours(request):
    
    tous_les_cours = CoursLangue.objects.all().prefetch_related('sectionhoraire_set')

    context = {
        'tous_les_cours': tous_les_cours,
        'titre': "Nos Programmes de Cours de Langue et Horaires"
    }
    return render(request, 'cours.html', context)

def visa_tourisme(request):
    visas_par_pays = VisaParPays.objects.filter(
        type_visa__nom_visa="Visa visiteur"
    ).select_related('pays').order_by('pays__nom_pays')

    try:
        
        victoires = VictoireVoyageur.objects.filter(
            type_visa__nom_visa="Visa visiteur"
        )
    except VictoireVoyageur.DoesNotExist:
        victoires = []
    
    form_avis = AvisForm()
    
    context = {
        'visas_par_pays': visas_par_pays,
        'titre': 'Pays offrant le Visa Visiteur',

        'titre_page2': 'Nos Victoires : Visa de Travail',
        'titre_page3': 'Questions Fréquements posées',
        'victoires': victoires,
        'form_avis': form_avis
    }
    return render(request, 'visa_tourisme.html',context)

def service(request):
    return render(request, 'services.html')

def liste_articles_blog(request):
    # Récupère tous les articles de la base de données
    articles = ArticleDeBlog.objects.all().order_by('-id')

    context = {
        'articles': articles,
        'titre_page': "Notre Blog"
    }
    return render(request, 'blog.html', context)

def formulaire (request):
    return render(request, 'formulaire.html')

