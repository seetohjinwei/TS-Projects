var health = 1;
var word = "";
var in_game = false;
var table = [];
var picture = document.getElementById("display-health");
var guessArea = document.getElementById("guess-area");
var message = document.getElementById("display-message");
window.onload = function () {
    document.addEventListener("keypress", function (press) {
        var value = press.key.toUpperCase();
        var ascii = value.charCodeAt(0);
        if (value === "ENTER")
            buttonStart.click();
        else if (ascii >= 65 && ascii <= 90)
            alphabetPressed(ascii - 65);
    });
    resetGame();
    displayInfo();
    for (var i = 1; i <= 6; i++) {
        var image = new Image();
        image.src = "hangman/pics/" + i + ".png";
    }
};
var buttonStart = document.getElementById("button-start");
var buttonReset = document.getElementById("button-reset");
buttonStart.onclick = function () {
    var wordInput = document.getElementById("word");
    if (wordInput.value.length < 5) {
        message.innerText = "Word must have >= 5 characters";
        return;
    }
    wordInput.blur();
    message.innerText = "Good luck!";
    word = wordInput.value.toUpperCase().replace(/[^A-Z]/g, "");
    console.log(word);
    var length = 0;
    for (var i = 0; i < word.length; i++) {
        var value = word.charCodeAt(i);
        if (value === 32)
            continue;
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
function displayInfo() {
    var infoDisplay = document.getElementById("display-info");
    var toggleInfo = (document.getElementById("display-toggle-text"));
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
    guessArea.innerText = "";
    health = 1;
    picture.src = "hangman/pics/1.png";
    generateAlphabets();
}
function generateAlphabets() {
    var alphabets = document.getElementById("alphabets");
    table = [];
    while (alphabets.hasChildNodes()) {
        alphabets.removeChild(alphabets.firstChild);
    }
    var _loop_1 = function (x) {
        var span = document.createElement("span");
        var char = String.fromCharCode(x);
        var index = x - 65;
        span.innerText = char;
        span.setAttribute("char", x.toString());
        span.setAttribute("toBeFound", "false");
        span.onclick = function () { return alphabetPressed(index); };
        table.push(span);
        alphabets.appendChild(span);
    };
    for (var x = 65; x <= 90; x++) {
        _loop_1(x);
    }
}
function alphabetPressed(index) {
    if (!in_game)
        return;
    var cell = table[index];
    var toBeFound = cell.getAttribute("toBeFound") === "true";
    cell.hidden = true;
    if (toBeFound) {
        cell.setAttribute("toBeFound", "false");
        generateGuessArea();
    }
    else {
        reduceHealth();
    }
    if (health >= 6) {
        in_game = false;
        message.innerText = "You lost! :(";
    }
}
function generateGuessArea() {
    var string = "";
    var unsolved = 0;
    for (var i = 0; i < word.length; i++) {
        var char = word[i];
        var value = word.charCodeAt(i);
        if (value === 32) {
            string += " ";
            continue;
        }
        var cell = table[value - 65];
        var toBeFound = cell.getAttribute("toBeFound") === "true";
        if (toBeFound) {
            string += "_";
            unsolved++;
        }
        else {
            string += char;
        }
    }
    guessArea.innerText = string;
    if (unsolved === 0) {
        in_game = false;
        message.innerText = "You won! :D";
    }
}
function reduceHealth() {
    if (health >= 6)
        return;
    health++;
    picture.src = "hangman/pics/" + health + ".png";
}
