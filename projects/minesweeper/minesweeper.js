function initCell(row, col) {
    var element = document.createElement("td");
    element.innerText = " ";
    element.onclick = function () { return cellPressed(row, col); };
    var value = 0;
    var revealed = false;
    var flag = false;
    return { element: element, value: value, revealed: revealed, flag: flag };
}
window.onload = function () {
    document.addEventListener("keypress", function (press) {
        var value = press.key;
        if (value === "f")
            toggleFlagMode();
        else if ("123".includes(value))
            startGame(parseInt(value));
    });
    displayInfo();
    var images = [
        "pics/bomb.png",
        "pics/flag.png",
        "pics/white_flag.png"
    ];
    images.forEach(function (path) {
        var image = new Image();
        image.src = path;
    });
};
var board = [];
var sizeOfRow = 0;
var sizeOfCol = 0;
var totalBombs = 0;
var currBombs = 0;
var bombsFlagged = 0;
var flagMode = false;
var in_game = false;
function displayInfo() {
    var infoDisplay = document.getElementById("display-info");
    var toggleInfo = document.getElementById("display-toggle-text");
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
function toggleFlagMode() {
    var displayFlagMode = document.getElementById("display-flag-mode");
    flagMode = !flagMode;
    displayFlagMode.innerText = (flagMode) ? "On" : "Off";
}
function startGame(difficulty) {
    var _a;
    in_game = true;
    bombsFlagged = 0;
    displayMessage("Good luck!");
    var table = {
        1: [8, 8, 10],
        2: [16, 16, 40],
        3: [16, 30, 99]
    };
    _a = table[difficulty], sizeOfRow = _a[0], sizeOfCol = _a[1], totalBombs = _a[2];
    board = [];
    for (var r = 0; r < sizeOfRow; r++) {
        var row = [];
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = initCell(r, c);
            row.push(cell);
        }
        board.push(row);
    }
    function randInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }
    var bombsPlaced = 0;
    while (bombsPlaced < totalBombs) {
        var r = randInt(sizeOfRow);
        var c = randInt(sizeOfCol);
        var cell = board[r][c];
        if (cell.value !== -1) {
            cell.value = -1;
            bombsPlaced++;
        }
    }
    function updateHints(row, col) {
        for (var r = row - 1; r <= row + 1; r++) {
            for (var c = col - 1; c <= col + 1; c++) {
                if (r == row && c == col)
                    continue;
                if (r < 0 || r >= sizeOfRow || c < 0 || c >= sizeOfCol)
                    continue;
                var cell = board[r][c];
                if (cell.value !== -1) {
                    cell.value++;
                }
            }
        }
    }
    for (var r = 0; r < sizeOfRow; r++) {
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = board[r][c];
            if (cell.value === -1) {
                updateHints(r, c);
            }
        }
    }
    var displayTotalBombs = document.getElementById("display-total-bombs");
    displayTotalBombs.innerText = totalBombs.toString();
    currBombs = totalBombs;
    displayCurrBombs();
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
            var cell = board[r][c].element;
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
}
function endGame() {
    in_game = false;
    var playArea = document.getElementById("display-board");
    while (playArea.hasChildNodes()) {
        playArea.removeChild(playArea.firstChild);
    }
    for (var r = 0; r < sizeOfRow; r++) {
        var row = document.createElement("tr");
        for (var c = 0; c < sizeOfCol; c++) {
            var cell = board[r][c];
            if (cell.revealed) {
                if (cell.flag && cell.value !== -1) {
                    cell.element.innerHTML = "<img src=\"pics/white_flag.png\">";
                }
            }
            else if (cell.value === -1) {
                cell.element.innerHTML = "<img src=\"pics/bomb.png\">";
            }
            else {
                cell.element.innerText = cell.value.toString();
            }
            row.appendChild(cell.element);
        }
        playArea.appendChild(row);
    }
}
function cellPressed(row, col) {
    if (!in_game)
        return;
    var cell = board[row][col];
    cell.element.onclick = null;
    if (flagMode)
        cellFlag(row, col);
    else
        cellReveal(row, col);
}
function cellFlag(row, col) {
    if (currBombs === 0)
        return;
    currBombs--;
    displayCurrBombs();
    var cell = board[row][col];
    cell.revealed = true;
    cell.flag = true;
    if (cell.value === -1) {
        bombsFlagged++;
        if (bombsFlagged === totalBombs) {
            displayMessage(true);
            endGame();
        }
    }
    cell.element.innerHTML = "<img src=\"pics/flag.png\">";
    cell.element.onclick = function () { return cellUnFlag(row, col); };
}
function cellUnFlag(row, col) {
    if (!in_game)
        return;
    currBombs++;
    displayCurrBombs();
    var cell = board[row][col];
    cell.revealed = false;
    cell.flag = false;
    if (cell.value === -1) {
        bombsFlagged--;
    }
    cell.element.innerHTML = "";
    cell.element.onclick = function () { return cellPressed(row, col); };
}
function cellReveal(row, col) {
    var cell = board[row][col];
    if (cell.value === -1) {
        displayMessage(false);
        endGame();
    }
    else if (cell.value === 0) {
        revealAroundZeros(row, col);
    }
    else {
        cell.element.innerText = cell.value.toString();
        cell.revealed = true;
    }
}
function revealAroundZeros(row, col) {
    var cell = board[row][col];
    cell.element.innerText = cell.value.toString();
    cell.revealed = true;
    cell.element.onclick = null;
    function revealNext(row, col) {
        var cellNext = board[row][col];
        if (cellNext.revealed)
            return;
        if (cellNext.value === 0) {
            revealAroundZeros(row, col);
        }
        else {
            cellNext.element.innerText = cellNext.value.toString();
            cellNext.revealed = true;
            cellNext.element.onclick = null;
        }
    }
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col)
                continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol)
                revealNext(r, c);
        }
    }
}
function displayMessage(message) {
    var GAME_WON = "You win! :D";
    var GAME_LOST = "You lost! :(";
    var display = document.getElementById("display-message");
    if (typeof message === "boolean") {
        display.innerText = message ? GAME_WON : GAME_LOST;
    }
    else {
        display.innerText = message;
    }
}
function displayCurrBombs() {
    var message = currBombs.toString();
    var displayCurrBombs = document.getElementById("display-curr-bombs");
    displayCurrBombs.innerText = message;
}
