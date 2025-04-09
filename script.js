// Haalt output element op
const output = document.getElementById('output');
let startX, startY;

// Richting van swipe defniëren
function getSwipeDirection(deltaX, deltaY) {
    //horizontaal of verticaal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left'; // Rechts of links
    } else {
        return deltaY > 0 ? 'down' : 'up'; // Omlaag of omhoog
    }
}

// Verwerkt een swipe-beweging en voegt de juiste letter toe aan de output
function handleSwipe(key, direction) {
    // Letters ophalen uit data-letters
    let letters = key.dataset.letters.split('-');
    let selectedLetter = '';

    // Letter op basis van swipe richting
    switch (direction) {
        case 'up': selectedLetter = letters[0] || ''; break; // Omhoog
        case 'down': selectedLetter = letters[1] || ''; break; // Omlaag
    }

    // Voegt letter toe aan de output
    if (selectedLetter) {
        output.value += selectedLetter;
    }
}

// event listener letterknoppen
document.querySelectorAll('.letter').forEach(letter => {
    // Start een touch-gebeurtenis en slaat de startpositie op
    letter.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startX = e.touches[0].clientX; // Startpositie X
        startY = e.touches[0].clientY; // Startpositie Y
        letter.dataset.pressed = 'true'; // Markeert de knop als ingedrukt
    });

    // voegt de letter toe aan de output bij touchend
    letter.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (letter.dataset.pressed === 'true' && !letter.classList.contains('space')) {
            output.value += letter.innerText.charAt(0); // Voegt de eerste letter van de knop toe
        }
        letter.dataset.pressed = 'false'; // Reset de knopstatus
    });

    // Verwerkt een swipe-beweging tijdens een touch-gebeurtenis
    letter.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (letter.dataset.pressed !== 'true') return;

        // Berekent de verplaatsing in X- en Y-richting
        let deltaX = e.touches[0].clientX - startX;
        let deltaY = e.touches[0].clientY - startY;
        let direction = getSwipeDirection(deltaX, deltaY); // Bepaalt de swipe-richting

        handleSwipe(letter, direction); // Verwerkt de swipe
        letter.dataset.pressed = 'false'; // Reset de knopstatus
    });
});

// Voegt een spatie toe aan de output wanneer de spatieknop wordt losgelaten
document.querySelector('.space').addEventListener('touchend', (e) => {
    e.preventDefault();
    output.value += ' '; // Voegt een spatie toe
});

// Verwijdert het laatste teken uit de output wanneer de backspace-knop wordt losgelaten
document.querySelector('.backspace').addEventListener('touchend', (e) => {
    e.preventDefault();
    output.value = output.value.slice(0, -1); // Verwijdert het laatste teken
});