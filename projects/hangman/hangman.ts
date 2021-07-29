let health: number = 1;  // from 1 - 5 (6 is dead)
var picture: HTMLImageElement;
var wordInput: HTMLInputElement;
var buttonStart: HTMLButtonElement;
var alphabets: HTMLDivElement;
var guessArea: HTMLSpanElement;
var word: string = "";
var length: number;
var in_game: boolean = false;
var found: boolean[] = [
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false
];  // length of 26, 1 for each char

window.onload = function(): void {
    picture = <HTMLImageElement> document.getElementById("display-health");
    wordInput = <HTMLInputElement> document.getElementById("word");
    buttonStart = <HTMLButtonElement> document.getElementById("button-start");
    alphabets = <HTMLDivElement> document.getElementById("alphabets");
    guessArea = <HTMLSpanElement> document.getElementById("guess-area");

    buttonStart.onclick = function(): void {
        startGame();
    };

    resetGame();
    displayInfo();
}

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
    document.getElementById("button-toggle-info").onclick = function(): void {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    }
}

function resetGame(): void {
    in_game = false;
    word = "";
    length = null;
    found = [
        false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, 
        false, false, false, false, false, false
    ];
    guessArea.innerText = "";
    health = 1;
    picture.src = "pics/1.png";

    generateAlphabets();
}

function generateAlphabets(): void {
    while (alphabets.hasChildNodes()) {
        alphabets.removeChild(alphabets.firstChild);
    }
    for (let x = 65; x <= 90; x++) {
        const char: string = String.fromCharCode(x);
        const span: HTMLSpanElement = document.createElement("span");
        span.innerText = char;
        span.setAttribute("char", char);
        span.addEventListener("click", charPressed);
        alphabets.appendChild(span);
    }
}

function charPressed(charPressed): void {
    if (!in_game) return;
    const cell: HTMLSpanElement = charPressed.target;
    const char: string = cell.getAttribute("char");
    cell.hidden = true;
    reduceHealth()
    if (health >= 6) {
        in_game = false;
        return;
    }
}

function reduceHealth(): void {
    if (health >= 6) return;
    health++;
    picture.src = `pics/${health}.png`;
}

function startGame(): void {
    if (wordInput.value.length < 5) return;
    word = wordInput.value.toLowerCase();
    length = word.length;
    for (let i = 0; i < length; i++) {
        const value: number = word.charCodeAt(i) - 97;
        if (value < 0 || value > 25) {
            resetGame();
            return;
        }
        found[value] = true;
    }
    in_game = true;
    wordInput.value = "";
    health = 1;
    guessArea.innerText = "_".repeat(length);
}