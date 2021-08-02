var health: number = 1;  // from 1 - 5 (6 is dead)
var word: string = "";
var in_game: boolean = false;
var table: HTMLSpanElement[] = [];  // length of 26, 1 for each char

const picture: HTMLImageElement = <HTMLImageElement> document.getElementById("display-health");
const guessArea: HTMLSpanElement = <HTMLSpanElement> document.getElementById("guess-area");
const message: HTMLDivElement = <HTMLDivElement> document.getElementById("display-message");

window.onload = () => {
    document.addEventListener("keypress", (press) => {
        const value: string = press.key.toUpperCase();
        const ascii: number = value.charCodeAt(0);
        if (value === "ENTER") buttonStart.click();
        else if (ascii >= 65 && ascii <= 90) alphabetPressed(ascii - 65);
    });

    resetGame();
    displayInfo();

    // preload images
    for (let i = 1; i <= 6; i++) {
        const image: HTMLImageElement = new Image();
        image.src = `pics/${i}.png`;
    }
};

const buttonStart: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-start");
const buttonReset: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-reset");

buttonStart.onclick = () => {
    const wordInput: HTMLInputElement = <HTMLInputElement> document.getElementById("word");
    if (wordInput.value.length < 5) {
        message.innerText = "Word must have >= 5 characters";
        return;
    }
    wordInput.blur();
    message.innerText = "Good luck!";
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
        table[value - 65].setAttribute("toBeFound", "true");
    }
    if (length < 5) {
        resetGame();
        return;
    }
    in_game = true;
    wordInput.value = "";
    health = 1;
    generateGuessArea();
};
buttonReset.onclick = resetGame;

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
    document.getElementById("button-toggle-info").onclick = () => {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    };
}

function resetGame(): void {
    in_game = false;
    word = "";
    guessArea.innerText = "";
    health = 1;
    picture.src = "pics/1.png";

    generateAlphabets();
}

function generateAlphabets(): void {
    const alphabets: HTMLDivElement = <HTMLDivElement> document.getElementById("alphabets");
    table = [];
    while (alphabets.hasChildNodes()) {
        alphabets.removeChild(alphabets.firstChild);
    }
    for (let x = 65; x <= 90; x++) {
        const span: HTMLSpanElement = document.createElement("span");
        const char: string = String.fromCharCode(x);
        const index: number = x - 65;
        span.innerText = char;
        span.setAttribute("char", x.toString());
        span.setAttribute("toBeFound", "false");
        span.onclick = () => alphabetPressed(index);

        table.push(span);
        alphabets.appendChild(span);
    }
}

function alphabetPressed(index: number): void {
    if (!in_game) return;
    const cell: HTMLSpanElement = table[index];
    const toBeFound: boolean = cell.getAttribute("toBeFound") === "true";
    cell.hidden = true;
    if (toBeFound) {
        cell.setAttribute("toBeFound", "false");
        generateGuessArea();
    } else {
        reduceHealth();
    }
    if (health >= 6) {
        in_game = false;
        message.innerText = "You lost! :(";
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
            continue;
        }
        const cell: HTMLSpanElement = table[value - 65];
        const toBeFound: boolean = cell.getAttribute("toBeFound") === "true";
        if (toBeFound) {
            string += "_";
            unsolved++;
        } else {
            string += char;
        }
    }
    guessArea.innerText = string;
    if (unsolved === 0) {
        in_game = false;
        message.innerText = "You won! :D";
    }
}

function reduceHealth(): void {
    if (health >= 6) return;
    health++;
    picture.src = `pics/${health}.png`;
}
