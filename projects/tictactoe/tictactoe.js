let player1 = "Player 1";
let player2 = "Player 2";
let turn = 0;
let active = true;
let board = ["", "", "", "", "", "", "", "", ""];
let restarting = false;

window.onload = function() {
    messageDisplay = document.getElementById("message");
    document.querySelectorAll(".cell").forEach(cell => cell.addEventListener('click', cellClicked));

    document.getElementById("button-ai-easy").onclick = function() {
        restartGame();
        player2 = "Easy AI";
        document.getElementById("player2").innerHTML = "Easy AI (O)";
    }

    document.getElementById("button-ai-hard").onclick = function() {
        restartGame();
        player2 = "Hard AI";
        document.getElementById("player2").innerHTML = "Hard AI (O)";
    }

    document.getElementById("button-no-ai").onclick = function() {
        restartGame();
        player2 = "Player 2";
        player2Set("no-ai");
    }

    document.getElementById("button-restart").onclick = function() {
        restartGame();
    }

    document.addEventListener("keydown", function(press){
        if (press.key == 'r') restartGame();
    });
}

function cellClicked(cellPressed) {
    const cell = cellPressed.target;
    const index = parseInt(cell.getAttribute("data-cell"));
    if (active && board[index] == "") {
        if (turn % 2 == 0) {
            cell.innerHTML = "X";
            board[index] = "X";
            messageDisplay.innerHTML = `${player2}'s turn (O)`;
        } else {
            cell.innerHTML = "O";
            board[index] = "O";
            messageDisplay.innerHTML = `${player1}'s turn (X)`;
        }
        turn++;
        checkGameState();

        if (active && player2 == "Easy AI") {
            const emptyCells = 9 - turn;
            const roll = Math.floor(Math.random() * emptyCells) + 1;
            let count = 0;
            for (let i = 0; i < board.length; i++) {
                if (board[i] == "") {
                    count++;
                    if (count == roll) {
                        document.querySelectorAll(".cell")[i].innerHTML = "O";
                        board[i] = "O";
                        break;
                    }
                }
            }
        }

        if (active && player2 == "Hard AI") {
            
        }

        if (active && player2 == "Easy AI" || player2 == "Hard AI") {
            turn++;
            messageDisplay.innerHTML = `${player1}'s turn (X)`;
            checkGameState();
        }
    }
}

function hardAIPlace(n) {
    board[n] = "O";
    document.querySelectorAll(".cell")[n].innerHTML = "O";
}

function checkGameState(real=true) {
    if (board.every(x => x != "")) {
        active = false;
        messageDisplay.innerHTML = `Game over! T'was a tie!`;
    }
    for (let i = 0; i < 3; i++) {
        const row = board.slice(i*3, i*3+3);
        if (row.every(x => x != "" && x == row[0])) {
            if (real) gameWon(row[0]);
            return;
        }
        const col = [];
        for (let j = 0; j < 3; j++) {
            col.push(board[i+j*3]);
        }
        if (col.every(x => x != "" && x == col[0])) {
            if (real) gameWon(col[0]);
            return;
        }
        if (board[4] != "" && board[0] == board[4] && board[4] == board[8]) {
            if (real) gameWon(board[4]);
            return;
        }
        if (board[4] != "" && board[2] == board[4] && board[4] == board[6]) {
            if (real) gameWon(board[4]);
            return;
        }
    }
}

function gameWon(x) {
    active = false;
    if (x == "O") {
        if (player2 == "Easy AI") messageDisplay.innerHTML = "Imagine losing to Easy AI... &#129318";
        else if (player2 == "Hard AI") messageDisplay.innerHTML = "Better luck next time!";
        else messageDisplay.innerHTML = `${player2} won! Congrats!`;
    } else messageDisplay.innerHTML = `${player1} won! Congrats!`;
}

function restartGame() {
    turn = 0;
    active = true;
    restarting = true;
    board = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
    messageDisplay.innerHTML = `Game restarted! ${player1}'s move (X)`;
    setTimeout(() => {
        const currDisplay = messageDisplay.innerHTML;
        if (restarting && currDisplay.startsWith("Game restarted!")) {
            messageDisplay.innerHTML = `${player1}'s move (X)`;
            restarting = false;
        }
    }, 5000);
}

function player1Input(name) {
    name = name.innerText;
    document.getElementById("player1").innerHTML = `<input onblur="player1Set(this)" value="${name}" id="player1-input"/>`;
    const inputField = document.getElementById("player1-input");
    inputField.focus();
    inputField.addEventListener("keydown", function(press) {
        if (press.key == 'Enter') inputField.blur();
    });
}

function player1Set(name) {
    player1 = name.value;
    document.getElementById("player1").innerHTML = `<span onclick="player1Input(this)">${player1}</span> (X)`;
}

function player2Input(name) {
    name = name.innerText;
    document.getElementById("player2").innerHTML = `<input onblur="player2Set(this)" value="${name}" id="player2-input"/>`;
    const inputField = document.getElementById("player2-input");
    inputField.focus();
    inputField.addEventListener("keydown", function(press) {
        if (press.key == 'Enter') inputField.blur();
    });
}

function player2Set(name) {
    if (!(name == "no-ai")) player2 = name.value;
    document.getElementById("player2").innerHTML = `<span onclick="player2Input(this)">${player2}</span> (O)`;
}