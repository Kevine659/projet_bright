"""
URL configuration for bright project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Bright_consulting.views import formulaire, liste_articles_blog, soumettre_avis, home, visa_etudiant, visa_travail, cours, visa_tourisme, service
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('avis/soumettre/', soumettre_avis, name='soumettre_avis'),
    
    path('admin/', admin.site.urls),
    path('', home, name = 'home'),
    path('visa_etudiant/', visa_etudiant ,name = 'visa_etudiant'),
    path('visa_travail/', visa_travail, name = 'visa_travail'),
    path('cours/', cours, name = 'cours'),
    path('visa_tourisme/', visa_tourisme, name = 'visa_tourisme'),
    path('service/', service, name = 'service'),
    path('blog/', liste_articles_blog, name = 'blog'),
    path('formulaire/', formulaire, name = 'formulaire'),
    
]


if settings.DEBUG:
    # Pour servir les fichiers médias (images téléchargées)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Pour servir les fichiers statiques (CSS, JS) non collectés
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
