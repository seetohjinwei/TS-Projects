var board = [];
var sizeOfRow = 0;
var sizeOfCol = 0;
var totalBombs = 0;
var currBombs = 0;
var bombsFlagged = 0;
var displayCurrBombs = document.getElementById("display-curr-bombs");
;
var flagMode = false;
var in_game = false;
var message = document.getElementById("display-message");
var GAME_WON = "You win! :D";
var GAME_LOST = "You lost! :(";
window.onload = function () {
    var buttonSmall = document.getElementById("button-small");
    var buttonMedium = document.getElementById("button-medium");
    var buttonLarge = document.getElementById("button-large");
    buttonSmall.onclick = function () { return startGame(1); };
    buttonMedium.onclick = function () { return startGame(2); };
    buttonLarge.onclick = function () { return startGame(3); };
    var displayFlagMode = document.getElementById("display-flag-mode");
    var buttonFlag = document.getElementById("button-flag");
    buttonFlag.onclick = function () {
        flagMode = !flagMode;
        displayFlagMode.innerText = (flagMode) ? "On" : "Off";
    };
    document.addEventListener("keypress", function (press) {
        var value = press.key;
        if (value === "f")
            buttonFlag.click();
        else if (["1", "2", "3"].includes(value))
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
    bombsFlagged = 0;
    message.innerText = "Good Luck!";
    var table = {
        1: [8, 8, 10],
        2: [16, 16, 40],
        3: [16, 30, 99]
    };
    _a = table[difficulty], sizeOfRow = _a[0], sizeOfCol = _a[1], totalBombs = _a[2];
    var baseCell = document.createElement("td");
    baseCell.innerText = " ";
    baseCell.setAttribute("value", "0");
    baseCell.setAttribute("revealed", "false");
    baseCell.setAttribute("flag", "false");
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
            for (var c = col - 1; c <= col + 1; c++) {
                if (r == row && c == col)
                    continue;
                if (r < 0 || r >= sizeOfRow || c < 0 || c >= sizeOfCol)
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
    var displayTotalBombs = document.getElementById("display-total-bombs");
    displayTotalBombs.innerText = totalBombs.toString();
    currBombs = totalBombs;
    displayCurrBombs.innerText = currBombs.toString();
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
            var value = cell.getAttribute("value");
            var revealed = cell.getAttribute("revealed") === "true";
            var flag = cell.getAttribute("flag") === "true";
            if (revealed) {
                if (flag && value !== "-1") {
                    cell.innerHTML = "<img src=\"pics/white_flag.png\">";
                }
            }
            else if (value === "-1") {
                cell.innerHTML = "<img src=\"pics/bomb.png\">";
            }
            else {
                cell.innerText = value;
            }
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
}
function cellPressed(row, col) {
    if (!in_game)
        return;
    var cell = board[row][col];
    cell.onclick = function () { };
    if (flagMode)
        cellFlag(row, col);
    else
        cellReveal(row, col);
}
function cellFlag(row, col) {
    if (currBombs === 0)
        return;
    currBombs--;
    displayCurrBombs.innerText = currBombs.toString();
    var cell = board[row][col];
    var value = cell.getAttribute("value");
    cell.setAttribute("revealed", "true");
    cell.setAttribute("flag", "true");
    if (value === "-1") {
        bombsFlagged++;
        if (bombsFlagged === totalBombs) {
            message.innerText = GAME_WON;
            endGame();
        }
    }
    cell.innerHTML = "<img src=\"pics/flag.png\">";
    cell.onclick = function () { return cellUnFlag(row, col); };
}
function cellUnFlag(row, col) {
    if (!in_game)
        return;
    currBombs++;
    displayCurrBombs.innerText = currBombs.toString();
    var cell = board[row][col];
    var value = cell.getAttribute("value");
    cell.setAttribute("revealed", "false");
    cell.setAttribute("flag", "false");
    if (value === "-1") {
        bombsFlagged--;
    }
    cell.innerHTML = "";
    cell.onclick = function () { return cellPressed(row, col); };
}
function cellReveal(row, col) {
    var cell = board[row][col];
    var value = cell.getAttribute("value");
    if (value === "-1") {
        message.innerText = GAME_LOST;
        endGame();
    }
    else if (value === "0") {
        revealAroundZeros(row, col);
    }
    else {
        cell.innerText = value;
        cell.setAttribute("revealed", "true");
    }
}
function revealAroundZeros(row, col) {
    var cell = board[row][col];
    var value = cell.getAttribute("value");
    cell.innerText = value;
    cell.setAttribute("revealed", "true");
    cell.onclick = function () { };
    function revealNext(row, col) {
        var cellNext = board[row][col];
        var valueNext = cellNext.getAttribute("value");
        var revealedNext = cellNext.getAttribute("revealed") === "true";
        if (valueNext === "0" && !revealedNext) {
            revealAroundZeros(row, col);
        }
        else {
            cellNext.innerText = valueNext;
            cellNext.setAttribute("revealed", "true");
            cellNext.onclick = function () { };
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
