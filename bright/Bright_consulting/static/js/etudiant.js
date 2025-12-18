document.addEventListener('DOMContentLoaded', function() {
    
    const searchInput = document.getElementById('global-search-etudiant');
    const noResultsMessage = document.getElementById('no-results-message-etudiant');
    
    // Séquence d'animation : Redémarrer l'animation si la page est chargée avec un hash
    document.querySelectorAll('.country-card-animated').forEach(card => {
        // Force le navigateur à re-calculer l'animation au chargement
        card.style.animation = 'none';
        card.offsetHeight; /* Trigger reflow */
        card.style.animation = null; 
    });

    searchInput.addEventListener('input', applySearch);

    function applySearch() {
        const searchText = searchInput.value.toLowerCase().trim();
        let matchesFound = 0;
        
        // Cible tous les éléments de recherche
        const searchableItems = document.querySelectorAll('.country-item, .filiere-item');

        if (searchText === '') {
            // Si la barre est vide, on affiche tout et on masque le message
            searchableItems.forEach(item => {
                item.style.display = ''; // Réinitialise l'affichage par défaut (grid item ou block)
            });
            noResultsMessage.style.display = 'none';
            return;
        }

        searchableItems.forEach(item => {
            const searchTerm = item.getAttribute('data-search-term');
            const isMatch = searchTerm && searchTerm.includes(searchText);
            
            if (isMatch) {
                // Pour les filières (col-md-4) on utilise 'block' pour conserver la mise en page
                // Pour les pays (grid item), une chaîne vide devrait fonctionner si le CSS de la grille est bien défini.
                item.style.display = 'block'; 
                matchesFound++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Gestion du message "Aucun résultat"
        if (matchesFound === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
});


// FAQ

document.addEventListener('DOMContentLoaded', function () {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', function () {
            const item = this.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item) {
                    i.classList.remove('open');
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    i.querySelector('.faq-icon').textContent = '+';
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.faq-icon').textContent = '+';
            } else {
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.faq-icon').textContent = '-';
            }
        });
    });
});
