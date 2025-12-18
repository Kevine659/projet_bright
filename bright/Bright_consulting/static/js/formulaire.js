document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const nom = document.getElementById('nom').value;
            const tel = document.getElementById('tel').value;
            const email = document.getElementById('email').value;
            const projet = document.getElementById('projet').value;
            const pays = document.getElementById('pays').value;
            const date = document.getElementById('date').value;
            const heure = document.getElementById('heure').value;
            const motif = document.getElementById('motif').value;

            let message = `* Nouvelle Demande de RDV - Bright Consulting*\n\n`;
            message += ` *Nom :* ${nom}\n`;
            message += ` *Tél :* ${tel}\n`;
            if(email) message += ` *Email :* ${email}\n`;
            message += ` *type de visa :* ${projet}\n`;
            message += ` *Pays :* ${pays}\n`;
            message += ` *Date :* ${date}\n`;
            message += ` *Heure :* ${heure}\n`;
            message += ` *Motif de la demande :* ${motif}`;


            const numero = "237698309424";
            const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;

            window.open(url, '_blank');
        });
    }
});