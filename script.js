const output = document.getElementById('output');
let startX, startY;

function getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
    } else {
        return deltaY > 0 ? 'down' : 'up';
    }
}

function handleSwipe(letter, direction) {
    let letters = letter.dataset.letters.split('-');
    let selectedLetter = '';

    switch (direction) {
        case 'up': selectedLetter = letters[0] || ''; break;
        case 'down': selectedLetter = letters[1] || ''; break;
    }

    if (selectedLetter) {
        output.value += selectedLetter;
    }
}

document.querySelectorAll('.letter').forEach(letter => {
    letter.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        letter.dataset.pressed = 'true';
    });

    letter.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (letter.dataset.pressed === 'true' && !letter.classList.contains('space')) {
            output.value += letter.innerText.charAt(0);
        }
        letter.dataset.pressed = 'false';
    });

    letter.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (letter.dataset.pressed !== 'true') return;

        let deltaX = e.touches[0].clientX - startX;
        let deltaY = e.touches[0].clientY - startY;
        let direction = getSwipeDirection(deltaX, deltaY);

        handleSwipe(letter, direction);
        letter.dataset.pressed = 'false';
    });
});

document.querySelector('.space').addEventListener('touchend', (e) => {
    e.preventDefault();
    output.value += ' ';
});

document.querySelector('.backspace').addEventListener('touchend', (e) => {
    e.preventDefault();
    output.value = output.value.slice(0, -1);
});