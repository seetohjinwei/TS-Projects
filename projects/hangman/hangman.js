var health = 1;
var picture;
var wordInput;
var buttonStart;
var buttonReset;
var alphabets;
var guessArea;
var word = "";
var in_game = false;
var table = [
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false
];
window.onload = function () {
    picture = document.getElementById("display-health");
    wordInput = document.getElementById("word");
    buttonStart = document.getElementById("button-start");
    buttonReset = document.getElementById("button-reset");
    alphabets = document.getElementById("alphabets");
    guessArea = document.getElementById("guess-area");
    buttonStart.onclick = function () {
        startGame();
    };
    buttonReset.onclick = function () {
        resetGame();
    };
    resetGame();
    displayInfo();
};
function displayInfo() {
    var infoDisplay = document.getElementById("display-info");
    var toggleInfo = document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
    document.getElementById("button-toggle-info").onclick = function () {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        }
        else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    };
}
function resetGame() {
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
function generateAlphabets() {
    while (alphabets.hasChildNodes()) {
        alphabets.removeChild(alphabets.firstChild);
    }
    for (var x = 65; x <= 90; x++) {
        var char = String.fromCharCode(x);
        var span = document.createElement("span");
        span.innerText = char;
        span.setAttribute("char", x.toString());
        span.addEventListener("click", charPressed);
        alphabets.appendChild(span);
    }
}
function charPressed(charPressed) {
    if (!in_game)
        return;
    var cell = charPressed.target;
    var index = parseInt(cell.getAttribute("char")) - 65;
    cell.hidden = true;
    if (table[index]) {
        table[index] = false;
        generateGuessArea();
    }
    else {
        reduceHealth();
    }
    if (health >= 6) {
        in_game = false;
        alert("You lost!");
    }
}
function generateGuessArea() {
    var string = "";
    var unsolved = 0;
    for (var i = 0; i < word.length; i++) {
        var char = word[i];
        var value = word.charCodeAt(i);
        if (value == 32) {
            string += " ";
        }
        else if (table[value - 65]) {
            string += "_";
            unsolved++;
        }
        else {
            string += char;
        }
    }
    guessArea.innerText = string;
    if (unsolved == 0) {
        in_game = false;
        alert("You won!");
    }
}
function reduceHealth() {
    if (health >= 6)
        return;
    health++;
    picture.src = "pics/" + health + ".png";
}
function startGame() {
    if (wordInput.value.length < 5)
        return;
    word = wordInput.value.toUpperCase();
    var length = 0;
    for (var i = 0; i < word.length; i++) {
        var value = word.charCodeAt(i);
        if (value == 32)
            continue;
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
