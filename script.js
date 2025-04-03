const output = document.getElementById('output');
let startX, startY, isTouch = false;

function getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'down' : 'up';
    }
}

function handleSwipe(key, direction) {
    let letters = key.dataset.letters.split('-');
    let selectedLetter = '';

    switch (direction) {
        case 'up': selectedLetter = letters[0] || ''; break;
        case 'down': selectedLetter = letters[1] || ''; break;
    }

    if (selectedLetter) {
        output.value += selectedLetter;
    }
}

function handleKeyPress(key) {
    output.value += key.innerText.charAt(0);
}

document.querySelectorAll('.key').forEach(key => {
    // Muis events
    key.addEventListener('mousedown', (e) => {
        if (isTouch) return; // Vermijd dubbele invoer
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

    // Touch events
    key.addEventListener('touchstart', (e) => {
        isTouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        key.dataset.pressed = 'true';
    });

    key.addEventListener('touchend', (e) => {
        if (key.dataset.pressed === 'true') {
            handleKeyPress(key);
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

document.querySelector('.space').addEventListener('click', () => {
    output.value += ' ';
});

document.querySelector('.space').addEventListener('touchstart', (e) => {
    output.value += ' ';
    e.preventDefault(); // Voorkomt onnodige dubbelinvoer op mobiele browsers
});