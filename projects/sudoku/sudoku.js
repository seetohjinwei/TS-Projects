var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var message = document.getElementById("display-message");
var buttonSolve = document.getElementById("button-solve");
var buttonReset = document.getElementById("button-reset");
var display = document.getElementById("display-board");
var value = null;
window.onload = function () {
    updateBoard(true);
    displayInfo();
};
function updateBoard(displayInput) {
    while (display.hasChildNodes()) {
        display.removeChild(display.firstChild);
    }
    for (var i = 0; i < 9; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < 9; j++) {
            var td = document.createElement("td");
            var value_1 = board[i][j];
            var displayedValue = (value_1 === 0) ? "" : value_1.toString();
            td.innerText = displayedValue;
            td.setAttribute("row", i.toString());
            td.setAttribute("col", j.toString());
            td.addEventListener('click', clickCell);
            tr.appendChild(td);
        }
        if (displayInput) {
            var td_value = document.createElement("td");
            td_value.innerText = (i + 1).toString();
            td_value.setAttribute("value", (i + 1).toString());
            td_value.addEventListener('click', clickValue);
            tr.append(td_value);
            if (i === 0) {
                var td_value_1 = document.createElement("td");
                td_value_1.innerText = "C";
                td_value_1.setAttribute("value", "C");
                td_value_1.addEventListener('click', clickValue);
                tr.append(td_value_1);
            }
            else if (i === 1) {
                var td_value_2 = document.createElement("td");
                td_value_2.innerText = "0";
                td_value_2.setAttribute("value", "0");
                td_value_2.addEventListener('click', clickValue);
                tr.append(td_value_2);
            }
        }
        display.appendChild(tr);
    }
}
function clickCell(cellPressed) {
    var cell = cellPressed.target;
    var row = parseInt(cell.getAttribute("row"));
    var col = parseInt(cell.getAttribute("col"));
    var endListen = false;
    function readValue(press) {
        var value = press.key;
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)) {
            var key = parseInt(value);
            board[row][col] = key;
            cell.innerText = (key === 0) ? "" : key.toString();
            document.removeEventListener('keydown', readValue);
        }
    }
    if (value === null)
        document.addEventListener('keydown', readValue);
    else {
        board[row][col] = value;
        cell.innerText = (value === 0) ? "" : value.toString();
    }
}
function clickValue(cellPressed) {
    var cell = cellPressed.target;
    var input = cell.getAttribute("value");
    value = (input === "C") ? null : parseInt(input);
}
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
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    updateBoard(true);
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
    updateBoard(false);
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
