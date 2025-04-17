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

        // als shift actief is, hoofdletter typen en anders lowercase
        if (isShiftActive) {
            selectedLetter = selectedLetter.toUpperCase();
        } else {
            selectedLetter = selectedLetter.toLowerCase();
        }

        // letter toevoegen aan de output
        if (selectedLetter) {
            output.value += selectedLetter;
        }

        // na de swipe, shift mode resetten als hij aan staat
        if (isShiftActive) {
            isShiftActive = false; 
            updateKeyboardLayout();
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
                //als shift actief is, hoofdletter typen daarna keyboard naar lowercase en anders lowercase typen
                if (isShiftActive) {
                    output.value += key.innerText.charAt(0).toUpperCase();
                    isShiftActive = false;
                    updateKeyboardLayout();
                } else {
                    output.value += key.innerText.charAt(0);
                }
            }
            key.dataset.pressed = 'false';
        }); 

        // Detecteert swipe beweging
        key.addEventListener('touchmove', (e) => {
            if (key.dataset.pressed !== 'true') return;

            let deltaX = e.touches[0].clientX - startX;
            let deltaY = e.touches[0].clientY - startY;

            // Check od swipe beweging groot genoeg is
            if (Math.abs(deltaX) < swipe_threshold && Math.abs(deltaY) < swipe_threshold) {
                return; // Doet niks als de swipe te klein is
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
// Toggle symbols
//===========================

    let isSymbols = false; // voor cijfers en symbolen

    // letter layout
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

    // cijfer/symbol layout
    const symbolKeys = [
        { label: '1', letters: '!-?' },
        { label: '2', letters: '@-#' },
        { label: '3', letters: '$-€' },
        { label: '4', letters: '%-&' },
        { label: '5', letters: '0-*' },
        { label: '6', letters: '(-)' },
        { label: '7', letters: '/-"' },
        { label: '8', letters: '+-=' },
        { label: '9', letters: '.-,' },
    ];

    document.querySelector('.toggle-numbers').addEventListener('touchend', () => {
        isSymbols = !isSymbols;
        updateKeyboardLayout();
    });

    function updateKeyboardLayout() {
        const keys = document.querySelectorAll('.key');
        const layout = isSymbols ? symbolKeys : letterKeys;
    
        keys.forEach((key, index) => {
            const { label, letters } = layout[index];
            let [up, down] = letters.split('-');
    
            // voor main letters laat hoofdletter zien als caps of shift aan is
            let mainLetter = isSymbols ? label : (isCapsLockActive || isShiftActive ? label.toUpperCase() : label.toLowerCase());
            key.childNodes[0].nodeValue = mainLetter;
    
            // voor secundaire letters laat kleine letter zien als caps of shift aan is
            if (!isSymbols) {
                up = isCapsLockActive || isShiftActive ? up.toUpperCase() : up.toLowerCase();
                down = isCapsLockActive || isShiftActive ? down.toUpperCase() : down.toLowerCase();
            }
    
            key.dataset.letters = `${up}-${down}`;
    
            const lettersDiv = key.querySelector('.letters');
            if (lettersDiv) {
                lettersDiv.innerHTML = `↑ ${up} | ${down} ↓`;
            }
        });
    }

//===========================
// Toggle shift en caps
//===========================

let isShiftActive = true; // voor shift 
let isCapsLockActive = false; // voor caps lock 

    document.querySelector('.toggle-case').addEventListener('touchend', () => {
        const shiftButton = document.querySelector('.toggle-case');

        if (isCapsLockActive) {
            // als Caps Lock actief is, gaat hij uit als je op de knop drukt
            isCapsLockActive = false;
            shiftButton.classList.remove('caps-lock-active');
        } else if (isShiftActive) {
            // als Shift actief is, gaat caps aan en shift uit als je op de knop drukt
            isCapsLockActive = true;
            isShiftActive = false; 
            shiftButton.classList.remove('shift-active'); 
            shiftButton.classList.add('caps-lock-active'); 
        } else {
            // als er geen aan staat, gaat shift aan als je op de knop drukt
            isShiftActive = true;
            shiftButton.classList.remove('caps-lock-active'); 
            shiftButton.classList.add('shift-active'); 
        }
    
        updateKeyboardLayout(); // Update layout naar de nieuwe shift state
    });
});
