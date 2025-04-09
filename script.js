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

function handleSwipe(key, direction) {
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

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        key.dataset.pressed = 'true';
    });

    key.addEventListener('touchend', (e) => {
        if (key.dataset.pressed === 'true' && !key.classList.contains('space')) {
            output.value += key.innerText.charAt(0);
        }
        key.dataset.pressed = 'false';
    });

    key.addEventListener('touchmove', (e) => {
        if (key.dataset.pressed !== 'true') return;
        e.preventDefault();

        // Berekent de verplaatsing in X- en Y-richting
        let deltaX = e.touches[0].clientX - startX;
        let deltaY = e.touches[0].clientY - startY;
        let direction = getSwipeDirection(deltaX, deltaY); // Bepaalt de swipe-richting

        handleSwipe(key, direction);
        key.dataset.pressed = 'false';
    });
});

// Ensure the space button only adds a space
document.querySelector('.space').addEventListener('touchend', (e) => {
    output.value += ' ';
});

document.querySelector('.backspace').addEventListener('touchend', (e) => {
    e.preventDefault();
    output.value = output.value.slice(0, -1);
});