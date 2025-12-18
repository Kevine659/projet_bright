from django import forms
from .models import AvisVoyageur

class AvisForm(forms.ModelForm):
    class Meta:
        model = AvisVoyageur
        fields = ['nom_auteur', 'contenu_avis', 'note']
        
        widgets = {
            'nom_auteur': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Votre nom et prénom'}),
            'contenu_avis': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'Partagez votre expérience avec notre agence...'}),
            'note': forms.Select(attrs={'class': 'form-control'}),
        }
        
        labels = {
            'nom_auteur': 'Votre Nom',
            'contenu_avis': 'Votre Témoignage',
        }