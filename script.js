const output = document.getElementById('output');
let startX, startY;

document.addEventListener('touchmove', e => {
  if (window.scrollY === 0 && e.touches[0].clientY > 0) e.preventDefault();
}, { passive: false });

// Richting van swipe ophalen
function getSwipeDirection(deltaX, deltaY) {
    // Bepaalt of de swipe horizontaal of verticaal is
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left'; // Rechts of links
    } else {
        return deltaY > 0 ? 'down' : 'up'; // Omlaag of omhoog
    }
}

// haalt swipe op en voegtletter toe aan de output
function handleSwipe(key, direction) {
    let letters = key.dataset.letters.split('-');
    let selectedLetter = '';

    // letter op basis swipe richting
    switch (direction) {
        case 'up': selectedLetter = letters[0] || ''; break; 
        case 'down': selectedLetter = letters[1] || ''; break; 
    }

    // letter toevoegen aan de output
    if (selectedLetter) {
        output.value += selectedLetter;
    }
}

//event listeners bij alle toetsen
document.querySelectorAll('.key').forEach(key => {
    //detecteren van swipe
    key.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        key.dataset.pressed = 'true';
    });

    // Voegt de letter toe bij het loslaten van de toets
    key.addEventListener('touchend', (e) => {
        if (key.dataset.pressed === 'true' && !key.classList.contains('space')) {
            output.value += key.innerText.charAt(0);
        }
        key.dataset.pressed = 'false';
    });

    // Detecteert swipe beweging
    key.addEventListener('touchmove', (e) => {
        if (key.dataset.pressed !== 'true') return;

        // Berekent de verplaatsing in X- en Y-richting
        let deltaX = e.touches[0].clientX - startX;
        let deltaY = e.touches[0].clientY - startY;
        let direction = getSwipeDirection(deltaX, deltaY); // Bepaalt de swipe-richting

        handleSwipe(key, direction);
        key.dataset.pressed = 'false';
    });
});

// Voegt een spatie toe bij het loslaten van de spatiebalk
document.querySelector('.space').addEventListener('touchend', (e) => {
    output.value += ' ';
});

let backspaceInterval;

// Start het verwijderen van tekst bij het ingedrukt houden van de backspace
document.querySelector('.backspace').addEventListener('touchstart', (e) => {
    e.preventDefault();
    backspaceInterval = setInterval(() => {
        output.value = output.value.slice(0, -1);
    }, 50);
});

// Stopt het verwijderen van tekst bij het loslaten van de backspace
document.querySelector('.backspace').addEventListener('touchend', (e) => {
    e.preventDefault();
    clearInterval(backspaceInterval);
});