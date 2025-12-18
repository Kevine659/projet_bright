document.addEventListener('DOMContentLoaded', function() {
    // 1. Déclaration des éléments du DOM
    const searchInput = document.getElementById('search-input');
    const paysList = document.getElementById('pays-liste');
    const noResultsMessage = document.getElementById('js-no-results');

    // S'assurer que les éléments essentiels existent avant d'exécuter le script
    if (!searchInput || !paysList) {
        return; 
    }

    const paysItems = paysList.querySelectorAll('.pays-item');

    // 2. Événement de recherche instantanée (sur 'input' plutôt que 'keyup')
    searchInput.addEventListener('input', function() {
        const terme = searchInput.value.toLowerCase().trim();
        let resultatsTrouves = 0;

        paysItems.forEach(item => {
            // Récupère le texte du pays et le nettoie
            const nomPays = item.textContent.toLowerCase().trim();
            
            if (nomPays.includes(terme)) {
                item.style.display = ''; // Afficher l'élément li
                resultatsTrouves++;
            } else {
                item.style.display = 'none'; // Cacher l'élément li
            }
        });

        // 3. Gestion du message "Aucun résultat"
        if (resultatsTrouves === 0) {
            noResultsMessage.style.display = 'block';
            paysList.style.display = 'none'; // Cacher la liste vide
        } else {
            noResultsMessage.style.display = 'none';
            paysList.style.display = 'grid'; // Afficher la liste si des résultats existent
        }
    });
});


// FAQ

document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', function() {
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
