document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            
            // Changer l'icône de burger à croix
            if (mainMenu.classList.contains('active')) {
                menuToggle.innerHTML = '✕';
                document.body.style.overflow = 'hidden'; // Empêche le scroll
            } else {
                menuToggle.innerHTML = '☰';
                document.body.style.overflow = 'auto'; // Réactive le scroll
            }
        });
    }
});