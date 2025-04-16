window.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const swipe_threshold = 20; // Drempel voor swipe detectie in pixels
    let startX, startY;

    document.addEventListener('touchmove', e => {
        if (window.scrollY === 0 && e.touches[0].clientY > 0) e.preventDefault();
    }, { passive: false });

//===========================
// Swipe functionaliteit
//===========================

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

//===========================
// Toetsenbord
//===========================

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

            let deltaX = e.touches[0].clientX - startX;
            let deltaY = e.touches[0].clientY - startY;

            // Check if swipe distance is large enough
            if (Math.abs(deltaX) < swipe_threshold && Math.abs(deltaY) < swipe_threshold) {
                return; // Don't trigger anything if swipe is too small
            }

            let direction = getSwipeDirection(deltaX, deltaY);
            handleSwipe(key, direction);
            key.dataset.pressed = 'false';
        });
    });

//===========================
// Space en Backspace
//===========================

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

//===========================
// Toggle case en symbols
//===========================

    let isUppercase = false;
    let isSymbols = false;

    // Original letter keys and swipe data
    const letterKeys = [
        { label: 'I', letters: 'Q-L' },
        { label: 'T', letters: 'V-Y' },
        { label: 'A', letters: 'X-G' },
        { label: 'D', letters: 'H-C' },
        { label: 'O', letters: 'F-M' },
        { label: 'R', letters: 'K-Z' },
        { label: 'S', letters: 'J-P' },
        { label: 'E', letters: 'B-W' },
        { label: 'N', letters: 'U-.' },
    ];

    // Alternative numbers/symbols layout
    const symbolKeys = [
        { label: '1', letters: '!-~' },
        { label: '2', letters: '@-`' },
        { label: '3', letters: '#-^' },
        { label: '4', letters: '$-*' },
        { label: '5', letters: '%-(' },
        { label: '6', letters: '^-)' },
        { label: '7', letters: '&-_' },
        { label: '8', letters: '*-+' },
        { label: '9', letters: '(-=' },
    ];

    document.querySelector('.toggle-numbers').addEventListener('touchend', () => {
        isSymbols = !isSymbols;
        updateKeyboardLayout();
    });

    // function updateKeyboardLayout() {
    //     const keys = document.querySelectorAll('.key');

    //     const layout = isSymbols ? symbolKeys : letterKeys;

    //     keys.forEach((key, index) => {
    //         const { label, letters } = layout[index];
    //         const [up, down] = letters.split('-');

    //         // main key label switchen
    //         let newMain = isUppercase && !isSymbols ? label.toUpperCase() : label.toLowerCase();
    //         key.childNodes[0].nodeValue = newMain;

    //         // secundary key label switchen
    //         const upChar = isUppercase && !isSymbols ? up.toUpperCase() : up;
    //         const downChar = isUppercase && !isSymbols ? down.toUpperCase() : down;

    //         key.dataset.letters = `${upChar}-${downChar}`;
    //         const lettersDiv = key.querySelector('.letters');
    //         if (lettersDiv) {
    //             lettersDiv.innerHTML = `↑ ${upChar} <div></div> ${downChar} ↓`;
    //         }
    //     });
    // }

    function updateKeyboardLayout() {
        const keys = document.querySelectorAll('.key');
        const layout = isSymbols ? symbolKeys : letterKeys;
    
        keys.forEach((key, index) => {
            const { label, letters } = layout[index];
            let [up, down] = letters.split('-');
    
            // Update main key label
            let mainLetter = isSymbols ? label : (isUppercase ? label.toUpperCase() : label.toLowerCase());
            key.childNodes[0].nodeValue = mainLetter;
    
            // Process swipe letters
            if (!isSymbols) {
                up = isUppercase ? up.toUpperCase() : up.toLowerCase();
                down = isUppercase ? down.toUpperCase() : down.toLowerCase();
            }
    
            key.dataset.letters = `${up}-${down}`;
    
            const lettersDiv = key.querySelector('.letters');
            if (lettersDiv) {
                lettersDiv.innerHTML = `↑ ${up} <div></div> ${down} ↓`;
            }
        });
    }

    document.querySelector('.toggle-case').addEventListener('touchend', () => {
        isUppercase = !isUppercase;
        updateKeyboardLayout();
    });
});
