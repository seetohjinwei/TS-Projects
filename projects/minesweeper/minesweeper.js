function initCell(row, col) {
    var element = document.createElement("td");
    element.innerHTML = " ";
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
        else if (value === "c")
            toggleCheatMode();
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
var cheatMode = false;
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
function toggleCheatMode() {
    var displayCheatMode = document.getElementById("display-cheat-mode");
    cheatMode = !cheatMode;
    displayCheatMode.innerText = (cheatMode) ? "On" : "Off";
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
                    updateCell(r, c, false, "<img src=\"pics/white_flag.png\">");
                }
            }
            else if (cell.value === -1) {
                updateCell(r, c, false, "<img src=\"pics/bomb.png\">");
            }
            else {
                updateCell(r, c, false);
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
    if (cell.flag)
        cellUnFlag(row, col);
    else if (cell.revealed && cheatMode)
        cellCheat(row, col);
    else if (flagMode)
        cellFlag(row, col);
    else
        cellReveal(row, col);
}
function cellCheat(row, col) {
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col)
                continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol) {
                var cell = board[r][c];
                if (cell.value === -1 && !cell.flag) {
                    return;
                }
            }
        }
    }
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col)
                continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol) {
                var cell = board[r][c];
                if (!cell.revealed) {
                    if (cell.value === 0)
                        revealAroundZeros(r, c);
                    else
                        updateCell(r, c);
                }
            }
        }
    }
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
    updateCell(row, col, false, "<img src=\"pics/flag.png\">");
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
    updateCell(row, col, false, "");
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
        updateCell(row, col);
    }
}
function revealAroundZeros(row, col) {
    updateCell(row, col);
    function revealNext(row, col) {
        var cell = board[row][col];
        if (cell.value === 0) {
            revealAroundZeros(row, col);
        }
        else {
            updateCell(row, col);
        }
    }
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col)
                continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol && !board[r][c].revealed)
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
function updateCell(row, col, reveal, message) {
    if (reveal === void 0) { reveal = true; }
    var cell = board[row][col];
    var element = cell.element;
    var num = cell.value;
    var value = num.toString();
    if (reveal)
        cell.revealed = true;
    if (message === undefined)
        element.innerHTML = value;
    else
        element.innerHTML = message;
    element.onclick = function () { return cellPressed(row, col); };
}
