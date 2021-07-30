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
    board = new Array(sizeOfRow);
    for (var i = 0; i < sizeOfRow; i++) {
        board[i] = new Array(sizeOfCol).fill(0);
    }
    function randInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }
    var bombsPlaced = 0;
    while (bombsPlaced < totalBombs) {
        var r = randInt(sizeOfRow);
        var c = randInt(sizeOfCol);
        if (board[r][c] !== -1) {
            board[r][c] = -1;
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
                var value = board[r][c];
                if (value !== -1) {
                    board[r][c]++;
                }
            }
        }
    }
    for (var r = 0; r < sizeOfRow; r++) {
        for (var c = 0; c < sizeOfCol; c++) {
            var value = board[r][c];
            if (value === -1) {
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
        var _loop_1 = function (c) {
            var cell = document.createElement("td");
            var value = board[r][c];
            cell.innerText = " ";
            cell.setAttribute("value", value.toString());
            cell.onclick = function () { return cellPressed(cell); };
            row.appendChild(cell);
        };
        for (var c = 0; c < sizeOfCol; c++) {
            _loop_1(c);
        }
        playArea.appendChild(row);
    }
}
function lostGame() {
    alert("You lost!");
    in_game = false;
    var playArea = document.getElementById("display-board");
    while (playArea.hasChildNodes()) {
        playArea.removeChild(playArea.firstChild);
    }
    for (var r = 0; r < sizeOfRow; r++) {
        var row = document.createElement("tr");
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = document.createElement("td");
            var value = board[r][c];
            if (value === -1) {
                cell.innerHTML = "<img src=\"pics/bomb.png\">";
            }
            else {
                cell.innerText = value.toString();
            }
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
}
function cellPressed(cell) {
    if (!in_game)
        return;
    var string = cell.getAttribute("value");
    var value = parseInt(string);
    if (value === -1) {
        lostGame();
    }
    else
        cell.innerText = string;
}
