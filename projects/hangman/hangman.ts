let health: number = 1;  // from 1 - 5 (6 is dead)
var picture: HTMLImageElement;
var guessArea: HTMLSpanElement;
var word: string = "";
var in_game: boolean = false;
var table: boolean[] = [
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false
];  // length of 26, 1 for each char

window.onload = function(): void {
    picture = <HTMLImageElement> document.getElementById("display-health");
    guessArea = <HTMLSpanElement> document.getElementById("guess-area");
    
    const buttonStart: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-start");
    const buttonReset: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-reset");

    buttonStart.onclick = function(): void {
        startGame();
    };

    buttonReset.onclick = function(): void {
        resetGame();
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
    table = [
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
    const alphabets: HTMLDivElement = <HTMLDivElement> document.getElementById("alphabets");
    while (alphabets.hasChildNodes()) {
        alphabets.removeChild(alphabets.firstChild);
    }
    for (let x = 65; x <= 90; x++) {
        const char: string = String.fromCharCode(x);
        const span: HTMLSpanElement = document.createElement("span");
        span.innerText = char;
        span.setAttribute("char", x.toString());
        span.addEventListener("click", charPressed);
        alphabets.appendChild(span);
    }
}

function charPressed(charPressed): void {
    if (!in_game) return;
    const cell: HTMLSpanElement = charPressed.target;
    const index: number = parseInt(cell.getAttribute("char")) - 65;
    cell.hidden = true;
    if (table[index]) {
        table[index] = false;
        generateGuessArea();
    } else {
        reduceHealth();
    }
    if (health >= 6) {
        in_game = false;
        alert("You lost!")
    }
}

function generateGuessArea(): void {
    let string: string = "";
    let unsolved: number = 0;
    for (let i = 0; i < word.length; i++) {
        const char: string = word[i];
        const value: number = word.charCodeAt(i);
        if (value === 32) {
            string += " ";
        } else if (table[value - 65]) {
            string += "_";
            unsolved++;
        } else {
            string += char;
        }
    }
    guessArea.innerText = string;
    if (unsolved === 0) {
        in_game = false;
        alert("You won!");
    }
}

function reduceHealth(): void {
    if (health >= 6) return;
    health++;
    picture.src = `pics/${health}.png`;
}

function startGame(): void {
    const wordInput: HTMLInputElement = <HTMLInputElement> document.getElementById("word");
    if (wordInput.value.length < 5) return;
    word = wordInput.value.toUpperCase();
    let length: number = 0;
    for (let i = 0; i < word.length; i++) {
        const value: number = word.charCodeAt(i);
        if (value === 32) continue;
        if (value < 65 || value > 90) {
            resetGame();
            return;
        }
        length++;
        table[value - 65] = true;
    }
    if (length < 5) {
        resetGame();
        return;
    }
    in_game = true;
    wordInput.value = "";
    health = 1;
    generateGuessArea();
}