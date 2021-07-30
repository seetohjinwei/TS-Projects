var board = [];
var sizeOfRow = 0;
var sizeOfCol = 0;
var totalBombs = 0;
var currBombs = 0;
var flagMode = false;
var in_game = false;
window.onload = function () {
    var buttonEasy = document.getElementById("button-easy");
    var buttonMedium = document.getElementById("button-medium");
    var buttonHard = document.getElementById("button-hard");
    buttonEasy.onclick = function () { return startGame(1); };
    buttonMedium.onclick = function () { return startGame(2); };
    buttonHard.onclick = function () { return startGame(3); };
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
function startGame(difficulty) {
    var _a;
    in_game = true;
    var table = {
        1: [8, 8, 10],
        2: [16, 16, 40],
        3: [16, 30, 99]
    };
    _a = table[difficulty], sizeOfRow = _a[0], sizeOfCol = _a[1], totalBombs = _a[2];
    var baseCell = document.createElement("td");
    baseCell.innerText = " ";
    baseCell.setAttribute("value", "0");
    board = [];
    var _loop_1 = function (r) {
        var row = [];
        var _loop_2 = function (c) {
            var cell = baseCell.cloneNode(true);
            cell.onclick = function () { return cellPressed(r, c); };
            row.push(cell);
        };
        for (var c = 0; c < sizeOfCol; c++) {
            _loop_2(c);
        }
        board.push(row);
    };
    for (var r = 0; r < sizeOfRow; r++) {
        _loop_1(r);
    }
    function randInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }
    var bombsPlaced = 0;
    while (bombsPlaced < totalBombs) {
        var r = randInt(sizeOfRow);
        var c = randInt(sizeOfCol);
        var cell = board[r][c];
        var value = cell.getAttribute("value");
        if (value !== "-1") {
            cell.setAttribute("value", "-1");
            bombsPlaced++;
        }
    }
    function updateHints(row, col) {
        for (var r = row - 1; r <= row + 1; r++) {
            if (r < 0 || r > sizeOfRow - 1)
                continue;
            for (var c = col - 1; c <= col + 1; c++) {
                if (c < 0 || c > sizeOfCol - 1)
                    continue;
                var cell = board[r][c];
                var value = parseInt(cell.getAttribute("value"));
                if (value !== -1) {
                    cell.setAttribute("value", (value + 1).toString());
                }
            }
        }
    }
    for (var r = 0; r < sizeOfRow; r++) {
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = board[r][c];
            var value = cell.getAttribute("value");
            if (value === "-1") {
                updateHints(r, c);
            }
        }
    }
    displayBoard();
}
function displayBoard() {
    var playArea = document.getElementById("display-board");
    while (playArea.hasChildNodes()) {
        playArea.removeChild(playArea.firstChild);
    }
    for (var r = 0; r < sizeOfRow; r++) {
        var row = document.createElement("tr");
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = board[r][c];
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
}
function lostGame() {
    in_game = false;
    var playArea = document.getElementById("display-board");
    while (playArea.hasChildNodes()) {
        playArea.removeChild(playArea.firstChild);
    }
    for (var r = 0; r < sizeOfRow; r++) {
        var row = document.createElement("tr");
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = board[r][c];
            var value = cell.getAttribute("value");
            if (value === "-1") {
                cell.innerHTML = "<img src=\"pics/bomb.png\">";
            }
            else {
                cell.innerText = value;
            }
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
    alert("You lost!");
}
function cellPressed(row, col) {
    if (!in_game)
        return;
    var cell = board[row][col];
    var value = cell.getAttribute("value");
    if (value === "-1") {
        lostGame();
    }
    else {
        cell.innerText = value;
    }
}
