# HCD
HCD repository | Quy Nguyen

<details>
<summary><h2>Week 1</h2></summary>

## Doel
In de eerste week van het project wil ik zo veel mogelijk verschillende ideeën bedenken. 
Ik ben van plan zo veel mogelijk bestaande oplossingen voor accessible toetsenborden te vinden, en hopelijk zo inspiratie op te doen.
Hopelijk lukt het mij om een kleine prototype te maken voor het feedback moment.

## Voortgang

### Onderzoek
Voor mijn onderzoek heb ik voordat ik eric heb ontmoet zo veel mogelijk bestaande toetsenborden geprobeerd.
De toetsenborden die naar mijn mening het meeste potentie hadden om Eric zijn probleem op te lossen waren in mijn mening het MessageEasy en Minuum toetsenbord.

- **MessageEasy** Een toetsenbord met 9 knoppen waar letters op staat waarbij meerdere letters op een knop staan. 
Je kan op elke knop swipen om de letter te selecteren.
Ik vond het er zelf niet intuitief uit zien en het was erg lastig om letters te vinden maar de interactie heeft wel veel potentie.

- **Minuum** Een toetsenbord waar alle letters op een rij staan waarop wordt ingezoomd wanneer je op het toetsenbord drukt om een letter uit de rij te kiezen.
Ik vond het toetsenbord erg klein en dus niet zo overzichtelijk maar het prinzipe om in te zoomen op het toetsenbord vond ik wel gaaf.
Ik vond het ook een beetje onhandig om meerdere handelingen te moeten doen om een letter te typen.

Na Eric voor de eerste keer onmoet te hebben ben ik tot de volgende conclusies gekomen:
- Alle bewegingen die hij kan doen heeft hij volledige controle over.
- typen en door zijn telefoon navigeren doet hij met een stylus.
- Typen in de trein gaat vaak niet goed door de beweging van de trein en de stoel waar hij in zit.
- Hij moet zijn volledige arm optillen om zijn telefoon te gebruiken, dit zorgt er ook voor dat het vermoeiend en minder accuraat is.
- Wisselen tussen cijfers en letters gaat lastig omdat het een kleine knop is.
- Hij wilt accuraat kunnen typen met mijn product en zo min mogelijk fouten moeten verbeteren.
- Hij schrijft vaak kleine teksten als hij in de trein zit bijvoorbeeld notities en appjes.

---

### Idee
Na Eric ontmoet te hebben ben ik tot de conclusie gekomen om het beste is om een toetsenbord te maken met zo groot mogelijke knoppen en toch zo veel mogelijk verschillende tekens te kunnen typen.
Ik wil graag een eigen versie maken van het MessageEasy toetsenbord met een aantal verbeteringen om hem passend te maken voor Eric.

---

### Code

#### *HTML*
Om een toetsenbord te maken met 9 knoppen voor letters met secundaire letters als je swiped heb ik `data-letters` gebruikt om de secundaire letters op de slaan zodat ik die kan gebruiken in het script om deze letters in te kunnen voeren in de `input`.
Ik heb er voor gekozen om de 9 meest gebruikte letters in de Nederlandse taal te gebruiken met touch en de rest met swipe.
<details>html
<summary>code html voor toetsenbord</summary>

```
    <input type="text" id="output" placeholder="Typ hier...">

    <div class="keyboard">
        <div class="key" data-letters="Q-L">I <div class="letters">↑ Q | ↓ L</div></div>
        <div class="key" data-letters="V-Y">T <div class="letters">↑ V | ↓ Y</div></div>
        <div class="key" data-letters="X-G">A <div class="letters">↑ X | ↓ G</div></div>
        <div class="key" data-letters="H-C">D <div class="letters">↑ H | ↓ C</div></div>
        <div class="key" data-letters="F-M">O <div class="letters">↑ F | ↓ M</div></div>
        <div class="key" data-letters="K-Z">R <div class="letters">↑ K | ↓ Z</div></div>
        <div class="key" data-letters="J-P">S <div class="letters">↑ J | ↓ P</div></div>
        <div class="key" data-letters="B-W">E <div class="letters">↑ B | ↓ W</div></div>
        <div class="key" data-letters="U-.">N <div class="letters">↑ U | ↓ .</div></div>
        <div class="key space" data-letters="">Spatie</div>
    </div>
    <script src="script.js"></script>
```
</details>

#### *JS*
Ik heb een eerste script geschreven met behulp van chatGPT bij het troubleshooten van problemen. Het zorgt ervoor dat het toetsenbord werkt met zowel muis als touchscreen. 
Als je op een toets klikt of erop tikt, wordt de primaire letter toegevoegd aan het invoerveld. <br><br>
Bij de toetsen kun je ook omhoog of omlaag swipen om een andere letter te kiezen, die letters zijn opgeslagen in het data-letters attribuut van de toets. 
De code kijkt dan welke kant je op veegt (omhoog of omlaag) en kiest de juiste letter. <br><br>
Ik heb ook een spatie gemaakt, aangezien het toetsenbord zowel touch en muis interacties accepteerd, dit zorgt er voor dat tekens dubbel worden getypt.
Dit is niet persee een probleem aangezien het uiteindelijk alleen hoeft te wertken op touch. Toch heb ik geprobeerd om een fix te maken.
<details>
<summary>code swipe richting ophalen en letter invoeren</summary>

```js
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
```
</details>

<details>
<summary>code drukken op toets verwerken</summary>

```js
// Verwerkt een druk op een toets
function handleKeyPress(key) {
    if (key.dataset.space) {
        output.value += ' '; // Alleen een spatie toevoegen
    } else {
        output.value += key.innerText.charAt(0);
    }
}
```
</details>

<details>
<summary>code muis en touch interactie detecteren en functies uitvoeren</summary>

```js
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
```
</details>

<details>
<summary>code dubbele invoer voorkomen</summary>

```js
// Voorkom dubbele spaties bij click
document.querySelector('.space').addEventListener('click', () => {
    if (output.value.slice(-1) !== ' ') { // Controleer of de laatste teken geen spatie is
        output.value += ' ';
    }
});

// Voorkom dubbele spaties bij touch
document.querySelector('.space').addEventListener('touchstart', (e) => {
    e.preventDefault(); // Voorkom ongewild extra invoer van het spatiesymbool (␣)
    if (output.value.slice(-1) !== ' ') { // Controleer of de laatste teken geen spatie is
        output.value += ' ';
    }
});
```
</details>

#### *CSS*
Ik heb voor het gemak de styling laten genereren door chatGPT om een beeld te krijgen van hoe het toetsenbord er uit kan zien.
Ik heb daarna zelf een aantal aanpassingen gedaan zodat het er goed uit zag. ik wil dit later netter gaan maken.
<details>
<summary>code CSS voor toetsenbord</summary>

```css
body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    overflow-y: hidden;
}
#output {
    width: 90%;
    max-width: 400px;
    height: 50px;
    margin-bottom: 20px;
    font-size: 20px;
    text-align: center;
    border: 1px solid #ccc;
    background-color: white;
    padding: 10px;
}
input {
    width: 90%;
    max-width: 400px;
    height: 50px;
    font-size: 20px;
    text-align: left;
    padding: 10px;
}
.keyboard {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    gap: 10px;
}
.key {
    width: 100px;
    height: 100px;
    background-color: #3498db;
    color: white;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    text-align: center;
    user-select: none;
    cursor: pointer;
    padding: 5px;
}
.space {
    grid-column: span 3;
    background-color: #2ecc71;
    font-size: 24px;
}
.letters {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 5px;
}
```
</details>


</details>
<!-- ////////////////// -->
<details>
<summary><h2>Week 2</h2></summary>

## Doel
In deze week ga ik de eerste echte test uitvoeren. Ik wil hiervoor verschillende versies van mijn toetsenbord maken voor zo veel mogelijk feedback.
verder wil ik graag een backspace toevoegen zodat hij echt dingen kan typen. Ook wil ik graag feedback over de layout van het toetsenbord.

## Voortgang

### Idee
Ik wil graag weten welke van de twee opties beter zijn, omhoog en omlaag of naar links en rechts swipen.
Hiervoor wil ik dus 2 verschillende versies maken van het toetsenbord.

---

### Code
Als eerste heb ik de code verwijderd voor de muis functionaliteit. 
Dit maakt de code een stuk overzichtelijker en is de code om dubbele tekens te voorkomen ook niet meer nodig.
<br>
<br>
om de richting van het toetsenbord te verandering heb ik he volgende stukje code aangepast in het script:
<details>
<summary> omlaag en omhoog swipen</summary>

```js
// haalt swipe op en voegtletter toe aan de output
function handleSwipe(key, direction) {
    let letters = key.dataset.letters.split('-');
    let selectedLetter = '';

    // letter op basis swipe richting
    switch (direction) {
        case 'up': selectedLetter = letters[0] || ''; break; // Omhoog
        case 'down': selectedLetter = letters[1] || ''; break; // Omlaag
    }

    // letter toevoegen aan de output
    if (selectedLetter) {
        output.value += selectedLetter;
    }
}
```
</details>

<details>
<summary> links en rechts swipen</summary>

```js
// haalt swipe op en voegtletter toe aan de output
function handleSwipe(key, direction) {
    let letters = key.dataset.letters.split('-');
    let selectedLetter = '';

    // letter op basis swipe richting
    switch (direction) {
        case 'left': selectedLetter = letters[0] || ''; break; // Links
        case 'right': selectedLetter = letters[1] || ''; break; // Rechts
    }

    // letter toevoegen aan de output
    if (selectedLetter) {
        output.value += selectedLetter;
    }
}
```
</details>
<br>

Ik wou graag en backspace maken waarbij het mogelijk is om heb ingedrukt te houden om veel tekst te verwijderen. 
Hiervoor heb ik de variable `backspaceInterval` aangemaakt die bepaalt wat de delay is tussen het verwijderen van letters in miliseconden.
<details>
<summary> Code backspace</summary>

```js
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
```
</details>
<br>

Ik was er deze week achter gekomen tijdens het testen op mijn telefoon dat bij het omlaag swipen, de web pagina wordt gerefreshed om een telefoon.
Uiteindelijk heb ik dit opgelost met `e.preventDefault()` in de eventlistener voor touchmove:

<details>
<summary> Code refresh voorkomen</summary>

```js
    document.addEventListener('touchmove', e => {
        if (window.scrollY === 0 && e.touches[0].clientY > 0) e.preventDefault();
    }, { passive: false });
```
</details>

---

### Test
Bij de eerste echte test met WEric ben ik op de volgende conclusies gekomen:
- Het toetsebord moet naar de onderkant van het scherm zodat hij er beter bij kan en zodat er meer ruimte is voor de applicatie die er onder zit.
- Omhoog en omlaag swipen is beter dan naar links en rechts aangezien de trein naar links en rechts beweegt tijdens het rijden en er dan dus meer fouten worden gemaakt.
- Het swipen is te gevoelig, als je nu ook maar 1 pixel beweegt pakt hij al de secundaire letter.
- de layout is fijn, de knoppen zijn groot genoeg en hij begrijpt wat elke knop doet.

</details>
<!-- ////////////////// -->
<details>
<summary><h2>Week 3</h2></summary>

## Doel
Deze week wil ik de punten aanpakken die uit de vorige test zijn gekoemn en extra features toevoegen waarvan ik vind dat een toetsenbord moet hebben.
Dit bevat kunnen wisselen tussen hoofdletters en kleine letters en cijfers en leestekens kunnen typen.

## Voortgang

### Idee
Het idee is om eerder gevonden problemen op te lossen en nieuwe features te testen.
Om te kunnen wisselen tussen verschillende toetsenborden (hoofdletter en cijfers) moet ik een manier vinden om de inhoud van het toetsenbord te veranderen.

---

### Code
Om het toetsenbord onderaand het scherm te plaatsen en de `input` de rest van het veld in te laten nemen hen ik de input veranderd naar een `textarea`.
<br>
<br>
Om een drempel te maken voor de swipe afstand heb ik de variable `swipe_threshold` gemaakt. 
Ik bekijk bij het detecteren van de swipe telkens hoe ver er geswiped is in pixels, de secundaire letter wordt alleen getypt als de afstand meer is dan de drempel.
Op deze manier kan ik het snel aanpassen om het passend te maken voor Eric.
<details>
<summary> Code swipe threshhold</summary>

```js
const swipe_threshold = 20;

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
    
        // Check swipe afstand ver genoeg is
        if (Math.abs(deltaX) < swipe_threshold && Math.abs(deltaY) < swipe_threshold) {
            return; //Niks doen zolang het niet genoeg is
        }
    
        let direction = getSwipeDirection(deltaX, deltaY);
        handleSwipe(key, direction);
        key.dataset.pressed = 'false';
    });
});
```
</details>
<br>

Voor de verschillende toetsenborden heb ik de verschillende layouts opgeslagen in variables (`letterKeys` voor hoofdletters en `symbolKeys` voor cijfers en symbolen).
Deze koppel ik aan booleans (`isSymbols`, `isShiftActive` en `isCapsLockActive`) om in en uit te kunnen schakelen.
Als shift aan staat veranderd het toetsenbord direct terug naar kleine letters als er een hoofdletter getypt is, bij caps blijft het toetsenbord in hoofdletters tot dat het uit word gezet.

<details>
<summary> hoofdletters, cijfers en symbolen</summary>

```js
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
```
</details>
<br>

Ik heb deze week ik aan de styling gewerkt om logischer te maken dan wat chatGPT heeft gemaakt.

---

### Test
Deze week kwam ik er achter dat het niet mogelijk was om met Eric te testen. Ik heb dus met klasgenoten in de metro getest. 
Aangezien ik niet de dingen kan testen waarvan ik de mening van Eric wil weten zoals of de swipe te gevoelig is of de backspace te snel gaat.
Daarom heb ik vooral feedback gevraagd van klasgenoten over de layout en functionaliteiten.
<br>
<br>
Uit de test heb ik de volgende conclusies gehaald:
- Ik moet een andere versie maken waar ik de shift en cijfer knop aan de zijkant van het toetsenbord heb in plaats van onder de spatie.
- Verschillende layouts maken voor hoe de knoppen er uit zien om te kijken of het overzichtelijker kan.
- swipe is misschien iets te gevoelig
- backspace ingedrukt kunnen houden in plaats van telkens op moeten tikken is erg fijn als je heen en weer schudt.

</details>
<!-- ////////////////// -->
<details>
<summary><h2>Week 4</h2></summary>

## Doel

## Voortgang

</details>
