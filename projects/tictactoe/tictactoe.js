let player1 = "Player 1";
let player2 = "Player 2";
let turn = 1;
let active = true;
let messageDisplay;
let board = ["", "", "", "", "", "", "", "", ""];

window.onload = function() {
    messageDisplay = document.getElementById("message");
    document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('click', cellClicked));

    document.getElementById("button-restart").onclick = function() {
        turn = 1;
        active = true;
        board = ["", "", "", "", "", "", "", "", ""];
        document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
        messageDisplay.innerHTML = `Game restarted! ${player1}'s move`
    }
}

function cellClicked(cellPressed) {
    const cell = cellPressed.target;
    const index = parseInt(cell.getAttribute("data-cell"));
    if (active && board[index] == "") {
        if (turn == 1) {
            turn = 2;
            cell.innerHTML = "X";
            board[index] = "X";
            messageDisplay.innerHTML = `${player2}'s turn`;
        } else {
            turn = 1;
            cell.innerHTML = "O";
            board[index] = "O";
            messageDisplay.innerHTML = `${player1}'s turn`;
        }
        checkGameState();
    }
}

function checkGameState() {
    console.log(board);
    if (board.every(x => x != "")) {
        active = false;
        messageDisplay.innerHTML = `Game over! T'was a tie!`;
    }
    for (let i = 0; i < 3; i++) {
        let row = board.slice(i*3, i*3+3);
        if (row.every(x => x != "" && x == row[0])) {
            gameWon();
            return;
        }
        let col = [];
        for (let j = 0; j < 3; j++) {
            col.push(board[i+j*3]);
        }
        if (col.every(x => x != "" && x == col[0])) {
            gameWon();
            return;
        }
        if (board[4] != "" && board[0] == board[4] && board[4] == board[8]) {
            gameWon();
            return;
        }
        if (board[4] != "" && board[2] == board[4] && board[4] == board[6]) {
            gameWon();
            return;
        }
    }
}

function gameWon() {
    active = false;
    messageDisplay.innerHTML = `${turn == 2 ? player1 : player2} won! Congrats!`;
}

function player1Input(name) {
    name = name.innerText;
    let player1Display = document.getElementById("player1");

    player1Display.innerHTML = `<input onblur="player1Set(this)" value="${name}" id="player1-input"/>`;
    let inputField = document.getElementById("player1-input");
    inputField.focus();
    inputField.addEventListener("keydown", function(press) {
        if (press.key == 'Enter') inputField.blur();
    });

}

function player1Set(name) {
    player1 = name.value;
    let player1Display = document.getElementById("player1");

    player1Display.innerHTML = `<span onclick="player1Input(this)">${player1}</span> (X)`;
}

function player2Input(name) {
    name = name.innerText;
    let player2Display = document.getElementById("player2");

    player2Display.innerHTML = `<input onblur="player2Set(this)" value="${name}" id="player2-input"/>`;
    let inputField = document.getElementById("player2-input");
    inputField.focus();
    inputField.addEventListener("keydown", function(press) {
        if (press.key == 'Enter') inputField.blur();
    });

}

function player2Set(name) {
    player2 = name.value;
    let player2Display = document.getElementById("player2");

    player2Display.innerHTML = `<span onclick="player2Input(this)">${player2}</span> (O)`;
}