window.onload = function () {
    document.querySelectorAll(".cell").forEach(function (cell) {
        var div = cell;
        div.onclick = function () { return cellClicked(div); };
    });
    document.addEventListener("keydown", function (press) {
        if (press.key === 'r')
            restartGame();
    });
    buttons();
};
var player1 = "Player 1";
var player2 = "Player 2";
var turn = 0;
var in_game = true;
var board = ["", "", "", "", "", "", "", "", ""];
var restarting = false;
var divPlayer1 = document.getElementById("player1");
var divPlayer2 = document.getElementById("player2");
function buttons() {
    var buttonAIEasy = document.getElementById("button-ai-easy");
    var buttonAIHard = document.getElementById("button-ai-hard");
    var buttonAINo = document.getElementById("button-no-ai");
    var buttonRestart = document.getElementById("button-restart");
    buttonAIEasy.onclick = function () {
        restartGame();
        player2 = "Easy AI";
        divPlayer2.innerHTML = "Easy AI (O)";
    };
    buttonAIHard.onclick = function () {
        restartGame();
        player2 = "Hard AI";
        divPlayer2.innerHTML = "Hard AI (O)";
    };
    buttonAINo.onclick = function () {
        restartGame();
        player2 = "Player 2";
        player2Set("no-ai");
    };
    buttonRestart.onclick = restartGame;
}
function cellClicked(cell) {
    var index = parseInt(cell.getAttribute("data-cell"));
    if (in_game && board[index] === "") {
        if (turn % 2 === 0) {
            cell.innerHTML = "X";
            board[index] = "X";
            displayMessage(player2 + "'s turn (O)");
        }
        else {
            cell.innerHTML = "O";
            board[index] = "O";
            displayMessage(player1 + "'s turn (X)");
        }
        turn++;
        checkGameState();
        if (in_game && player2 === "Easy AI") {
            var emptyCells = 9 - turn;
            var roll = Math.floor(Math.random() * emptyCells) + 1;
            var count = 0;
            for (var i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    count++;
                    if (count === roll) {
                        document.querySelectorAll(".cell")[i].innerHTML = "O";
                        board[i] = "O";
                        break;
                    }
                }
            }
        }
        if (in_game && player2 === "Hard AI") {
        }
        if (in_game && player2 === "Easy AI" || player2 === "Hard AI") {
            turn++;
            displayMessage(player1 + "'s turn (X)");
            checkGameState();
        }
    }
}
function hardAIPlace(n) {
    board[n] = "O";
    document.querySelectorAll(".cell")[n].innerHTML = "O";
}
function checkGameState() {
    if (board.every(function (x) { return x !== ""; })) {
        in_game = false;
        displayMessage("Game over! T'was a tie!");
    }
    var _loop_1 = function (i) {
        var row = board.slice(i * 3, i * 3 + 3);
        if (row.every(function (x) { return x !== "" && x === row[0]; })) {
            gameWon(row[0]);
            return { value: void 0 };
        }
        var col = [];
        for (var j = 0; j < 3; j++) {
            col.push(board[i + j * 3]);
        }
        if (col.every(function (x) { return x !== "" && x === col[0]; })) {
            gameWon(col[0]);
            return { value: void 0 };
        }
        if (board[4] !== "" && board[0] === board[4] && board[4] === board[8]) {
            gameWon(board[4]);
            return { value: void 0 };
        }
        if (board[4] !== "" && board[2] === board[4] && board[4] === board[6]) {
            gameWon(board[4]);
            return { value: void 0 };
        }
    };
    for (var i = 0; i < 3; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
function gameWon(x) {
    in_game = false;
    var message;
    if (x === "O") {
        if (player2 === "Easy AI")
            message = "Imagine losing to Easy AI... &#129318";
        else if (player2 === "Hard AI")
            message = "Better luck next time!";
        else
            message = player2 + " won! Congrats!";
    }
    else
        message = player1 + " won! Congrats!";
    displayMessage(message);
}
function restartGame() {
    turn = 0;
    in_game = true;
    restarting = true;
    board = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll(".cell").forEach(function (cell) { return cell.innerHTML = ""; });
    displayMessage("Game restarted! " + player1 + "'s move (X)");
    setTimeout(function () {
        var currDisplay = displayMessage();
        if (restarting && currDisplay.startsWith("Game restarted!")) {
            displayMessage(player1 + "'s move (X)");
            restarting = false;
        }
    }, 5000);
}
function player1Input(span) {
    var name = span.innerText;
    divPlayer1.innerHTML = "<input onblur=\"player1Set(this)\" value=\"" + name + "\" id=\"player1-input\"/>";
    var inputField = document.getElementById("player1-input");
    inputField.focus();
    inputField.onkeypress = function (press) {
        if (press.key === "Enter")
            inputField.blur();
    };
}
function player1Set(input) {
    player1 = input.value;
    divPlayer1.innerHTML = "<span onclick=\"player1Input(this)\">" + player1 + "</span> (X)";
}
function player2Input(span) {
    var name = span.innerText;
    divPlayer2.innerHTML = "<input onblur=\"player2Set(this)\" value=\"" + name + "\" id=\"player2-input\"/>";
    var inputField = document.getElementById("player2-input");
    inputField.focus();
    inputField.onkeypress = function (press) {
        if (press.key === "Enter")
            inputField.blur();
    };
}
function player2Set(input) {
    if (typeof input === "string")
        player2 = "Player 2";
    else
        player2 = input.value;
    divPlayer2.innerHTML = "<span onclick=\"player2Input(this)\">" + player2 + "</span> (O)";
}
function displayMessage(message) {
    var messageDisplay = document.getElementById("message");
    if (message !== undefined)
        messageDisplay.innerHTML = message;
    return messageDisplay.innerHTML;
}
