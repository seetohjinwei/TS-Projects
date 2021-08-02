window.onload = () => {
    document.querySelectorAll(".cell").forEach(cell => {
        const div: HTMLDivElement = <HTMLDivElement> cell;
        div.onclick = () => cellClicked(div);
    });
    document.addEventListener("keydown", (press: KeyboardEvent) => {
        if (press.key === 'r') restartGame();
    });

    buttons();
};

let player1: string = "Player 1";
let player2: string = "Player 2";
let turn: number = 0;
let in_game: boolean = true;
let board: string[] = ["", "", "", "", "", "", "", "", ""];
let restarting: boolean = false;

const divPlayer1: HTMLDivElement = <HTMLDivElement> document.getElementById("player1");
const divPlayer2: HTMLDivElement = <HTMLDivElement> document.getElementById("player2");

function buttons(): void {
    const buttonAIEasy: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-ai-easy");
    const buttonAIHard: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-ai-hard");
    const buttonAINo: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-no-ai");
    const buttonRestart: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-restart");

    buttonAIEasy.onclick = () => {
        restartGame();
        player2 = "Easy AI";
        divPlayer2.innerHTML = "Easy AI (O)";
    };
    buttonAIHard.onclick = () => {
        restartGame();
        player2 = "Hard AI";
        divPlayer2.innerHTML = "Hard AI (O)";
    };
    buttonAINo.onclick = () => {
        restartGame();
        player2 = "Player 2";
        player2Set("no-ai");
    };
    buttonRestart.onclick = restartGame;
}

function cellClicked(cell: HTMLDivElement): void {
    const index = parseInt(cell.getAttribute("data-cell"));
    if (in_game && board[index] === "") {
        if (turn % 2 === 0) {
            cell.innerHTML = "X";
            board[index] = "X";
            displayMessage(`${player2}'s turn (O)`);
        } else {
            cell.innerHTML = "O";
            board[index] = "O";
            displayMessage(`${player1}'s turn (X)`);
        }
        turn++;
        checkGameState();

        if (in_game && player2 === "Easy AI") {
            const emptyCells: number = 9 - turn;
            const roll: number = Math.floor(Math.random() * emptyCells) + 1;
            let count: number = 0;
            for (let i = 0; i < board.length; i++) {
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
            displayMessage(`${player1}'s turn (X)`);
            checkGameState();
        }
    }
}

function hardAIPlace(n: number): void {
    board[n] = "O";
    document.querySelectorAll(".cell")[n].innerHTML = "O";
}

function checkGameState(): void {
    if (board.every(x => x !== "")) {
        in_game = false;
        displayMessage(`Game over! T'was a tie!`);
    }
    for (let i = 0; i < 3; i++) {
        const row: string[] = board.slice(i*3, i*3+3);
        if (row.every(x => x !== "" && x === row[0])) {
            gameWon(row[0]);
            return;
        }
        const col: string[] = [];
        for (let j = 0; j < 3; j++) {
            col.push(board[i+j*3]);
        }
        if (col.every(x => x !== "" && x === col[0])) {
            gameWon(col[0]);
            return;
        }
        if (board[4] !== "" && board[0] === board[4] && board[4] === board[8]) {
            gameWon(board[4]);
            return;
        }
        if (board[4] !== "" && board[2] === board[4] && board[4] === board[6]) {
            gameWon(board[4]);
            return;
        }
    }
}

function gameWon(x: string): void {
    in_game = false;
    let message: string;
    if (x === "O") {
        if (player2 === "Easy AI") message = "Imagine losing to Easy AI... &#129318";
        else if (player2 === "Hard AI") message = "Better luck next time!";
        else message = `${player2} won! Congrats!`;
    } else message = `${player1} won! Congrats!`;
    displayMessage(message);
}

function restartGame(): void {
    turn = 0;
    in_game = true;
    restarting = true;
    board = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
    displayMessage(`Game restarted! ${player1}'s move (X)`);
    setTimeout(() => {
        const currDisplay: string = displayMessage();
        if (restarting && currDisplay.startsWith("Game restarted!")) {
            displayMessage(`${player1}'s move (X)`);
            restarting = false;
        }
    }, 5000);
}

function player1Input(span: HTMLSpanElement) {
    const name: string = span.innerText;
    divPlayer1.innerHTML = `<input onblur="player1Set(this)" value="${name}" id="player1-input"/>`;
    const inputField = document.getElementById("player1-input");
    inputField.focus();
    inputField.onkeypress = (press: KeyboardEvent) => {
        if (press.key === "Enter") inputField.blur();
    };
}

function player1Set(input: HTMLInputElement) {
    player1 = input.value;
    divPlayer1.innerHTML = `<span onclick="player1Input(this)">${player1}</span> (X)`;
}

function player2Input(span: HTMLSpanElement) {
    const name: string = span.innerText;
    divPlayer2.innerHTML = `<input onblur="player2Set(this)" value="${name}" id="player2-input"/>`;
    const inputField = document.getElementById("player2-input");
    inputField.focus();
    inputField.onkeypress = (press: KeyboardEvent) => {
        if (press.key === "Enter") inputField.blur();
    };
}

function player2Set(input: HTMLInputElement | string) {
    if (typeof input === "string") player2 = "Player 2";
    else player2 = (<HTMLInputElement> input).value;
    divPlayer2.innerHTML = `<span onclick="player2Input(this)">${player2}</span> (O)`;
}

function displayMessage(message?: string): string {
    const messageDisplay: HTMLSpanElement = <HTMLSpanElement> document.getElementById("message");
    if (message !== undefined) messageDisplay.innerHTML = message;
    return messageDisplay.innerHTML;
}