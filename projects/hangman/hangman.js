var health = 1;
var picture;
var wordInput;
var buttonStart;
var alphabets;
var guessArea;
var word = "";
var length;
var in_game = false;
var found = [
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false
];
window.onload = function () {
    picture = document.getElementById("display-health");
    wordInput = document.getElementById("word");
    buttonStart = document.getElementById("button-start");
    alphabets = document.getElementById("alphabets");
    guessArea = document.getElementById("guess-area");
    buttonStart.onclick = function () {
        startGame();
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
function generateAlphabets() {
    while (alphabets.hasChildNodes()) {
        alphabets.removeChild(alphabets.firstChild);
    }
    for (var x = 65; x <= 90; x++) {
        var char = String.fromCharCode(x);
        var span = document.createElement("span");
        span.innerText = char;
        span.setAttribute("char", char);
        span.addEventListener("click", charPressed);
        alphabets.appendChild(span);
    }
}
function charPressed(charPressed) {
    if (!in_game)
        return;
    var cell = charPressed.target;
    var char = cell.getAttribute("char");
    cell.hidden = true;
    reduceHealth();
    if (health >= 6) {
        in_game = false;
        return;
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
    word = wordInput.value.toLowerCase();
    length = word.length;
    for (var i = 0; i < length; i++) {
        var value = word.charCodeAt(i) - 97;
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
