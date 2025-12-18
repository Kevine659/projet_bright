document.addEventListener('DOMContentLoaded', () => {
    const paysListElement = document.getElementById('pays-list');
    
    // Le JS compte directement les cartes (wrappers) dans le DOM
    const totalCountries = paysListElement.querySelectorAll('.pays-card-wrapper').length; 
    
    let currentIndex = 0;
    const cardsPerSlide = 1; // Glissement 1 par 1
    const intervalTime = 5000; // 2 secondes

    function updateSlider() {
        const totalSlides = totalCountries; 
        
        if (totalSlides <= 1) return;

        if (currentIndex >= totalSlides) {
            currentIndex = 0; // Revenir au premier
        }

        // Décalage : currentIndex * 100% de la largeur
        const offset = currentIndex * 100; 
        
        paysListElement.style.transform = `translateX(-${offset}%)`;
        currentIndex++;
    }

    if (totalCountries > 1) { 
        updateSlider(); 
        setInterval(updateSlider, intervalTime);
    }
});