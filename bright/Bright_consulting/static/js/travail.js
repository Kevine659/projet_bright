document.addEventListener('DOMContentLoaded', function() {
    
    // ------------------------------------------------
    // 1. LOGIQUE DE L'ACCORDÉON (Gardée)
    // ------------------------------------------------
    const countryHeaders = document.querySelectorAll('.country-header');

    countryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const countryId = this.getAttribute('data-country-id');
            const targetContent = document.getElementById('content-' + countryId);
            
            if (!targetContent) return; 

            const isContentVisible = targetContent.classList.contains('show');

            document.querySelectorAll('.offers-content.show').forEach(content => {
                if (content !== targetContent) {
                    content.classList.remove('show');
                    content.previousElementSibling.classList.remove('active');
                }
            });
            
            if (isContentVisible) {
                targetContent.classList.remove('show');
                this.classList.remove('active');
            } else {
                targetContent.classList.add('show');
                this.classList.add('active');
            }
        });
    });

    // ------------------------------------------------
    // 2. LOGIQUE D'ANIMATION AU SCROLL (Gardée)
    // ------------------------------------------------
    const countryCards = document.querySelectorAll('.country-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    countryCards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // ------------------------------------------------
    // 3. LOGIQUE DE RECHERCHE INTELLIGENTE
    // ------------------------------------------------
    const searchInput = document.getElementById('global-search');
    const allCountryCards = document.querySelectorAll('.country-card');
    const noResultsMessage = document.getElementById('no-results-message');

    searchInput.addEventListener('input', applySearch);

    function applySearch() {
        const searchText = searchInput.value.toLowerCase().trim();
        let resultsFound = 0;

        if (searchText === '') {
            // Afficher tout et fermer l'accordéon si la barre est vide
            allCountryCards.forEach(countryCard => {
                countryCard.style.display = 'block';
                countryCard.querySelectorAll('.job-offer-card').forEach(jobCard => {
                    jobCard.style.display = 'block';
                });
                countryCard.querySelector('.offers-content').classList.remove('show');
                countryCard.querySelector('.country-header').classList.remove('active');
            });
            noResultsMessage.style.display = 'none';
            return;
        }

        allCountryCards.forEach(countryCard => {
            const countryName = countryCard.getAttribute('data-country-name').toLowerCase();
            const jobCards = countryCard.querySelectorAll('.job-offer-card');
            
            let jobMatchesInCountry = 0;
            const countryHeader = countryCard.querySelector('.country-header');
            const offersContent = countryCard.querySelector('.offers-content');

            // 1. Recherche par titre de poste
            jobCards.forEach(jobCard => {
                const jobTitle = jobCard.getAttribute('data-job-title');
                const jobMatchesSearch = jobTitle.includes(searchText);

                if (jobMatchesSearch) {
                    jobCard.style.display = 'block';
                    jobMatchesInCountry++;
                } else {
                    jobCard.style.display = 'none';
                }
            });
            
            // 2. Recherche par nom de pays
            const countryNameMatchesSearch = countryName.includes(searchText);
            
            if (countryNameMatchesSearch) {
                // CAS 1: CORRESPONDANCE PAR PAYS
                countryCard.style.display = 'block';
                resultsFound++;
                
                // On affiche TOUTES les offres du pays
                jobCards.forEach(jobCard => {
                    jobCard.style.display = 'block';
                });
                
                // On déroule le pays
                offersContent.classList.add('show');
                countryHeader.classList.add('active');
                
            } else if (jobMatchesInCountry > 0) {
                // CAS 2: CORRESPONDANCE PAR POSTE (dans un autre pays)
                countryCard.style.display = 'block';
                resultsFound++;
                
                // Les offres correspondantes sont déjà affichées (jobCard.style.display='block')
                
                // On déroule le pays
                offersContent.classList.add('show');
                countryHeader.classList.add('active');

            } else {
                // CAS 3: AUCUNE CORRESPONDANCE
                countryCard.style.display = 'none';
                
                // S'assurer qu'il est fermé (visuellement)
                offersContent.classList.remove('show');
                countryHeader.classList.remove('active');
            }
        });

        // 4. Affichage du message "No results"
        if (resultsFound === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
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

// formulaire avis 

