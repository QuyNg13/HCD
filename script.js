const output = document.getElementById('output');
let startX, startY, isTouch = false;

// Om de richting van het swipe-beweging te bepalen
function getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'down' : 'up';
    }
}

// Verwerkt de swipebeweging
function handleSwipe(key, direction) {
    let letters = key.dataset.letters ? key.dataset.letters.split('-') : [];
    let selectedLetter = '';

    switch (direction) {
        case 'up': selectedLetter = letters[0] || ''; break;
        case 'down': selectedLetter = letters[1] || ''; break;
    }

    if (selectedLetter) {
        output.value += selectedLetter;
    }
}

// Verwerkt een druk op een toets
function handleKeyPress(key) {
    if (key.dataset.space) {
        output.value += ' '; // Alleen een spatie toevoegen
    } else {
        output.value += key.innerText.charAt(0);
    }
}

// Voeg de gedragingen toe aan elke toets
document.querySelectorAll('.key').forEach(key => {
    let isSpatieClicked = false; // Voorkomt dubbele spatie-invoer bij klik/touch

    // Muisgebeurtenissen
    key.addEventListener('mousedown', (e) => {
        if (isTouch || isSpatieClicked) return; // Vermijd dubbele invoer
        startX = e.clientX;
        startY = e.clientY;
        key.dataset.pressed = 'true';
    });

    key.addEventListener('mouseup', (e) => {
        if (isTouch || key.dataset.pressed !== 'true') return;
        handleKeyPress(key);
        key.dataset.pressed = 'false';
    });

    key.addEventListener('mousemove', (e) => {
        if (isTouch || key.dataset.pressed !== 'true') return;

        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        let direction = getSwipeDirection(deltaX, deltaY);

        handleSwipe(key, direction);
        key.dataset.pressed = 'false';
    });

    // Touchgebeurtenissen
    key.addEventListener('touchstart', (e) => {
        if (isTouch || isSpatieClicked) return; // Vermijd dubbele invoer
        isTouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        key.dataset.pressed = 'true';
    });

    key.addEventListener('touchend', (e) => {
        if (key.dataset.pressed === 'true') {
            handleKeyPress(key);
            if (key.dataset.space) isSpatieClicked = true; // Zorg ervoor dat spatie maar één keer wordt toegevoegd
        }
        key.dataset.pressed = 'false';
    });

    key.addEventListener('touchmove', (e) => {
        if (key.dataset.pressed !== 'true') return;

        let deltaX = e.touches[0].clientX - startX;
        let deltaY = e.touches[0].clientY - startY;
        let direction = getSwipeDirection(deltaX, deltaY);

        handleSwipe(key, direction);
        key.dataset.pressed = 'false';
    });
});

// Event handler voor de spatieknop (klik of touch)
document.querySelector('.space').addEventListener('click', () => {
    if (output.value.slice(-1) !== ' ') { // Controleer of de laatste teken geen spatie is
        output.value += ' ';
    }
});

// Voorkom dubbele spaties bij touch
document.querySelector('.space').addEventListener('touchstart', (e) => {
    if (output.value.slice(-1) !== ' ') { // Controleer of de laatste teken geen spatie is
        output.value += ' ';
    }
    e.preventDefault(); // Voorkom andere ongewenste gedragingen
});