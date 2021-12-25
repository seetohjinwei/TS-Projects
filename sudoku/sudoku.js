window.onload = function () {
    updateBoard();
    displaySelectors(true);
    displayInfo();
    document.addEventListener("keypress", function (press) {
        var value = press.key.toUpperCase();
        handleKeyPress(value);
    });
};
var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
var selectorsArray = [];
var cellsSelected = [];
var message = document.getElementById("display-message");
var buttonSolve = document.getElementById("button-solve");
var buttonReset = document.getElementById("button-reset");
var display = document.getElementById("display-board");
var value = null;
var buttonEasy = document.getElementById("button-easy");
var buttonMedium = document.getElementById("button-medium");
var buttonHard = document.getElementById("button-hard");
var buttonValidate = document.getElementById("button-validate");
buttonEasy.onclick = function () { return generateBoard(0); };
buttonMedium.onclick = function () { return generateBoard(1); };
buttonHard.onclick = function () { return generateBoard(2); };
function generateBoard(difficulty) {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    var table = [45, 35, 25];
    var revealedCount = table[difficulty] + Math.floor(Math.random() * 5) - 2;
    console.log(revealedCount);
    while (revealedCount > 0) {
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0)
            continue;
        board[row][col] = generateNumber(row, col);
        revealedCount--;
    }
    function generateNumber(row, col) {
        var possibleValues = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ];
        var count = 0;
        for (var i = 0; i < 9; i++) {
            var possible = validPos(row, col, i + 1);
            possibleValues[i] = possible;
            if (possible)
                count++;
        }
        console.log(count, possibleValues.toString());
        if (count === 0)
            return 0;
        var index = Math.floor(Math.random() * count) + 1;
        for (var i = 0; i < 9; i++) {
            var possible = possibleValues[i];
            if (possible)
                count--;
            if (count === 0)
                return i + 1;
        }
    }
    updateBoard();
}
buttonValidate.onclick = function () {
    function solvedBoard() {
        for (var i = 0; i < 9; i++) {
            var row = new Set();
            var col = new Set();
            for (var j = 0; j < 9; j++) {
                var r = board[i][j];
                var c = board[j][i];
                if (r === 0 || c === 0)
                    return false;
                row.add(r);
                col.add(c);
            }
            if (row.size !== 9)
                return false;
            if (col.size !== 9)
                return false;
        }
        for (var i = 0; i < 9; i += 3) {
            for (var j = 0; j < 9; j += 3) {
                var box = new Set();
                for (var k = i; k < i + 3; k++) {
                    for (var l = j; l < j + 3; l++) {
                        var b = board[k][l];
                        if (b === 0)
                            return false;
                        box.add(b);
                    }
                }
                if (box.size !== 9)
                    return false;
            }
        }
        return true;
    }
    var valid = solvedBoard();
    message.innerText = valid ? "You did it! :D" : "Hmm, seems like there's an error";
};
function handleKeyPress(value) {
    if (!["E", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(value))
        return;
    if (cellsSelected.length === 0) {
        if (value === "0")
            value = "E";
        clickSelector(value);
    }
    else {
        if (value === "E")
            value = "0";
        cellsSelected.forEach(function (cell) {
            cell.style.backgroundColor = "";
            var row = parseInt(cell.getAttribute("row"));
            var col = parseInt(cell.getAttribute("col"));
            board[row][col] = parseInt(value);
            cell.innerText = value === "0" ? "" : value;
        });
        cellsSelected = [];
    }
}
function updateBoard() {
    while (display.hasChildNodes()) {
        display.removeChild(display.firstChild);
    }
    for (var i = 0; i < 9; i++) {
        var tr = document.createElement("tr");
        var _loop_1 = function (j) {
            var td = document.createElement("td");
            var value_1 = board[i][j];
            var displayedValue = value_1 === 0 ? "" : value_1.toString();
            td.innerText = displayedValue;
            td.setAttribute("row", i.toString());
            td.setAttribute("col", j.toString());
            td.onclick = function () { return clickCell(td); };
            tr.appendChild(td);
        };
        for (var j = 0; j < 9; j++) {
            _loop_1(j);
        }
        display.appendChild(tr);
    }
}
function displaySelectors(show) {
    var selectors = document.getElementById("display-selectors");
    while (selectors.hasChildNodes()) {
        selectors.removeChild(selectors.firstChild);
    }
    selectorsArray = [];
    if (!show)
        return;
    var tr = document.createElement("tr");
    function makeTD(value) {
        var td = document.createElement("td");
        td.innerText = value;
        td.setAttribute("value", value);
        td.setAttribute("selected", "false");
        td.onclick = function () { return clickSelector(value); };
        return td;
    }
    for (var i = 1; i <= 9; i++) {
        var td_1 = makeTD(i.toString());
        tr.appendChild(td_1);
        selectorsArray.push(td_1);
    }
    var td = makeTD("E");
    tr.appendChild(td);
    selectorsArray.push(td);
    selectors.appendChild(tr);
}
function clickCell(cell) {
    if (value !== null) {
        var row = parseInt(cell.getAttribute("row"));
        var col = parseInt(cell.getAttribute("col"));
        board[row][col] = value;
        cell.innerText = value === 0 ? "" : value.toString();
    }
    else {
        var index = cellsSelected.indexOf(cell);
        if (index !== -1) {
            cell.style.backgroundColor = "";
            cellsSelected.splice(index, 1);
        }
        else {
            cell.style.backgroundColor = "#00B3B3";
            cellsSelected.push(cell);
        }
    }
}
function clickSelector(string) {
    if (cellsSelected.length !== 0) {
        handleKeyPress(string);
        return;
    }
    var index = string === "E" ? 9 : parseInt(string) - 1;
    var cell = selectorsArray[index];
    var selected = cell.getAttribute("selected") === "true";
    if (selected) {
        cell.setAttribute("selected", "false");
        cell.style.backgroundColor = "#FFFFFF00";
        value = null;
    }
    else {
        selectorsArray.forEach(function (cell) {
            cell.setAttribute("selected", "false");
            cell.style.backgroundColor = "";
        });
        cell.setAttribute("selected", "true");
        cell.style.backgroundColor = "#00B3B3";
        value = string === "E" ? 0 : parseInt(string);
    }
}
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
buttonReset.onclick = function () {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    updateBoard();
    displaySelectors(true);
    message.innerText = "Reset!";
};
function validBoard() {
    var count = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                count++;
                if (!validPos(i, j, board[i][j])) {
                    message.innerText = "Invalid board!";
                    return false;
                }
            }
        }
    }
    if (count <= 20) {
        message.innerText = "Give >20 clues";
        return false;
    }
    return true;
}
function solve() {
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (var n = 1; n <= 9; n++) {
                    if (validPos(r, c, n)) {
                        board[r][c] = n;
                        solve();
                        board[r][c] = 0;
                    }
                }
                return;
            }
        }
    }
    updateBoard();
    displaySelectors(false);
}
function validPos(r, c, value) {
    for (var i = 0; i < 9; i++) {
        if (i !== c && board[r][i] === value)
            return false;
        if (i !== r && board[i][c] === value)
            return false;
    }
    var r1 = ~~(r / 3) * 3;
    var c1 = ~~(c / 3) * 3;
    for (var i = r1; i < r1 + 3; i++) {
        for (var j = c1; j < c1 + 3; j++) {
            if (i !== r && j !== c && board[i][j] === value)
                return false;
        }
    }
    return true;
}
buttonSolve.onclick = function () {
    if (!validBoard())
        return;
    solve();
    message.innerText = "Solved!";
};
