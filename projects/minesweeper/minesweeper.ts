interface Cell {
    element: HTMLTableDataCellElement;
    value: number;
    revealed: boolean;
    flag: boolean;
}

function initCell(row: number, col: number): Cell {
    const element: HTMLTableDataCellElement = document.createElement("td");
    element.innerHTML = " ";
    element.onclick = () => cellPressed(row, col);
    const value: number = 0;
    const revealed: boolean = false;
    const flag: boolean = false;
    return {element, value, revealed, flag};
}

window.onload = () => {
    document.addEventListener("keypress", (press: KeyboardEvent) => {
        const value: string = press.key;
        if (value === "f") toggleFlagMode();
        else if (value === "c") toggleCheatMode();
        else if ("123".includes(value)) startGame(parseInt(value));
    });

    displayInfo();
    
    //preload images
    const images: string[] = [
        "pics/bomb.png",
        "pics/flag.png",
        "pics/white_flag.png"
    ];
    images.forEach((path: string) => {
        const image: HTMLImageElement = new Image();
        image.src = path;
    });
};

var board: Cell[][] = [];
// -1 means bomb
// otherwise, number indicates number of surronding bombs
var sizeOfRow: number = 0;
var sizeOfCol: number = 0;
var totalBombs: number = 0;
var currBombs: number = 0; // displayed value that simply shows number of flags (real or not)
var bombsFlagged: number = 0; // hidden value that tracks actual bombs that are flagged
var flagMode: boolean = false;
var in_game: boolean = false;
var cheatMode: boolean = false;

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    document.getElementById("button-toggle-info").onclick = function(): void {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    }
}

function toggleFlagMode(): void {
    const displayFlagMode: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-flag-mode");
    flagMode = !flagMode;
    displayFlagMode.innerText = (flagMode) ? "On" : "Off";
}

function toggleCheatMode(): void {
    const displayCheatMode: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-cheat-mode");
    cheatMode = !cheatMode;
    displayCheatMode.innerText = (cheatMode) ? "On" : "Off";
}

function startGame(difficulty: number): void {
    in_game = true;
    bombsFlagged = 0;
    displayMessage("Good luck!");
    const table: {[difficulty: number]: number[]} = {
        1: [8, 8, 10],
        2: [16, 16, 40],
        3: [16, 30, 99]
    };
    [sizeOfRow, sizeOfCol, totalBombs] = table[difficulty];
    // generate empty board
    board = [];
    for (let r = 0; r < sizeOfRow; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < sizeOfCol; c++) {
            const cell: Cell = initCell(r, c);
            row.push(cell);
        }
        board.push(row);
    }
    // generate bombs
    function randInt(maxValue: number): number {
        return Math.floor(Math.random() * maxValue);
    }
    let bombsPlaced = 0;
    while (bombsPlaced < totalBombs) {
        const r: number = randInt(sizeOfRow);
        const c: number = randInt(sizeOfCol);
        const cell: Cell = board[r][c];
        if (cell.value !== -1) {
            cell.value = -1;
            bombsPlaced++;
        }
    }
    // generate hints
    function updateHints(row: number, col: number): void {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r == row && c == col) continue;
                if (r < 0 || r >= sizeOfRow || c < 0 || c >= sizeOfCol) continue;
                const cell: Cell = board[r][c];
                if (cell.value !== -1) {
                    cell.value++;
                }
            }
        }
    }
    for (let r = 0; r < sizeOfRow; r++) {
        for (let c = 0; c < sizeOfCol; c++) {
            const cell: Cell = board[r][c];
            if (cell.value === -1) {
                updateHints(r, c);
            }
        }
    }
    const displayTotalBombs: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-total-bombs");
    displayTotalBombs.innerText = totalBombs.toString();
    currBombs = totalBombs;
    displayCurrBombs();
    displayBoard();
}

function displayBoard(): void {
    const playArea: HTMLTableElement = <HTMLTableElement> document.getElementById("display-board");
    while (playArea.hasChildNodes()) {
        playArea.removeChild(playArea.firstChild);
    }
    for (let r = 0; r < sizeOfRow; r++) {
        const row: HTMLTableRowElement = document.createElement("tr");
        for (let c = 0; c < sizeOfCol; c++) {
            const cell: HTMLTableDataCellElement = board[r][c].element;
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
}

function endGame(): void {
    in_game = false;
    const playArea: HTMLTableElement = <HTMLTableElement> document.getElementById("display-board");
    while (playArea.hasChildNodes()) {
        playArea.removeChild(playArea.firstChild);
    }
    for (let r = 0; r < sizeOfRow; r++) {
        const row: HTMLTableRowElement = document.createElement("tr");
        for (let c = 0; c < sizeOfCol; c++) {
            const cell: Cell = board[r][c];
            if (cell.revealed) {
                if (cell.flag && cell.value !== -1) {
                    updateCell(r, c, false, `<img src="pics/white_flag.png">`);
                }
            } else if (cell.value === -1) {
                updateCell(r, c, false, `<img src="pics/bomb.png">`);
            } else {
                updateCell(r, c, false);
            }
            row.appendChild(cell.element);
        }
        playArea.appendChild(row);
    }
}

function cellPressed(row: number, col: number): void {
    if (!in_game) return;
    const cell: Cell = board[row][col];
    if (cell.flag) cellUnFlag(row, col);
    else if (cell.revealed && cheatMode) cellCheat(row, col);
    else if (flagMode) cellFlag(row, col);
    else cellReveal(row, col);
}

function cellCheat(row: number, col: number) : void {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol) {
                const cell: Cell = board[r][c];
                if (cell.value === -1 && !cell.flag) {
                    return;
                }
            }
        }
    }
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol) {
                const cell: Cell = board[r][c];
                if (!cell.revealed) {
                    if (cell.value === 0) revealAroundZeros(r, c);
                    else updateCell(r, c);
                }
            }
        }
    }
}

function cellFlag(row: number, col: number): void {
    if (currBombs === 0) return;
    currBombs--;
    displayCurrBombs();
    const cell: Cell = board[row][col];
    cell.revealed = true;
    cell.flag = true;
    if (cell.value === -1) {
        bombsFlagged++;
        if (bombsFlagged === totalBombs) {
            displayMessage(true);
            endGame();
        }
    }
    updateCell(row, col, false, `<img src="pics/flag.png">`);
}

function cellUnFlag(row: number, col: number): void {
    if (!in_game) return;
    currBombs++;
    displayCurrBombs();
    const cell: Cell = board[row][col];
    cell.revealed = false;
    cell.flag = false;
    if (cell.value === -1) {
        bombsFlagged--;
    }
    updateCell(row, col, false, "");
}

function cellReveal(row: number, col: number): void {
    const cell: Cell = board[row][col];
    if (cell.value === -1) {
        displayMessage(false);
        endGame();
    } else if (cell.value === 0) {
        revealAroundZeros(row, col);
    } else {
        updateCell(row, col);
    }
}

function revealAroundZeros(row: number, col: number): void {
    updateCell(row, col);

    function revealNext(row: number, col: number): void {
        const cell: Cell = board[row][col];
        if (cell.value === 0) {
            revealAroundZeros(row, col);
        } else {
            updateCell(row, col);
        }
    }

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol && !board[r][c].revealed) revealNext(r, c);
        }
    }
}

function displayMessage(message: (boolean | string)): void {
    const GAME_WON: string = "You win! :D";
    const GAME_LOST: string = "You lost! :(";

    const display: HTMLDivElement = <HTMLDivElement> document.getElementById("display-message");
    if (typeof message === "boolean") {
        display.innerText = message ? GAME_WON : GAME_LOST;
    } else {
        display.innerText = message;
    }
}

function displayCurrBombs(): void {
    const message: string = currBombs.toString();
    const displayCurrBombs: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-curr-bombs");

    displayCurrBombs.innerText = message;
}

function updateCell(row: number, col: number, reveal: boolean = true, message?: string): void {
    const cell: Cell = board[row][col];
    const element: HTMLTableDataCellElement = cell.element;
    const num: number = cell.value;
    const value: string = num.toString();
    if (reveal) cell.revealed = true;
    if (message === undefined) element.innerHTML = value;
    else element.innerHTML = message;
    element.onclick = () => cellPressed(row, col);
}
