var board: HTMLTableCellElement[][] = [];
// -1 means bomb
// otherwise, number indicates number of surronding bombs
var sizeOfRow: number = 0;
var sizeOfCol: number = 0;
var totalBombs: number = 0;
var currBombs: number = 0; // displayed value that simply shows number of flags (real or not)
var bombsFlagged: number = 0; // hidden value that tracks actual bombs that are flagged
const displayCurrBombs: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-curr-bombs");;
var flagMode: boolean = false;
var in_game: boolean = false;
const message: HTMLDivElement = <HTMLDivElement> document.getElementById("display-message");

const GAME_WON: string = "You win! :D";
const GAME_LOST: string = "You lost! :(";

window.onload = () => {
    const buttonSmall: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-small");
    const buttonMedium: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-medium");
    const buttonLarge: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-large");

    buttonSmall.onclick = () => startGame(1);
    buttonMedium.onclick = () => startGame(2);
    buttonLarge.onclick = () => startGame(3);

    const displayFlagMode: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-flag-mode");
    const buttonFlag: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-flag");

    buttonFlag.onclick = () => {
        flagMode = !flagMode;
        displayFlagMode.innerText = (flagMode) ? "On" : "Off";
    };
    
    document.addEventListener("keypress", (press) => {
        const value: string = press.key;
        if (value === "f") buttonFlag.click();
        else if (["1", "2", "3"].includes(value)) startGame(parseInt(value));
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

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
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

function startGame(difficulty: number): void {
    in_game = true;
    bombsFlagged = 0;
    message.innerText = "Good Luck!";
    const table: {[difficulty: number]: number[]} = {
        1: [8, 8, 10],
        2: [16, 16, 40],
        3: [16, 30, 99]
    };
    [sizeOfRow, sizeOfCol, totalBombs] = table[difficulty];
    // generate empty board
    const baseCell: HTMLTableCellElement = document.createElement("td");
    baseCell.innerText = " ";
    baseCell.setAttribute("value", "0");
    baseCell.setAttribute("revealed", "false");
    baseCell.setAttribute("flag", "false");
    board = [];
    for (let r = 0; r < sizeOfRow; r++) {
        const row: HTMLTableCellElement[] = [];
        for (let c = 0; c < sizeOfCol; c++) {
            const cell: HTMLTableCellElement = <HTMLTableCellElement> baseCell.cloneNode(true);
            cell.onclick = () => cellPressed(r, c);
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
        const cell: HTMLTableCellElement = board[r][c];
        const value: string = cell.getAttribute("value");
        if (value !== "-1") {
            cell.setAttribute("value", "-1");
            bombsPlaced++;
        }
    }
    // generate hints
    function updateHints(row: number, col: number): void {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r == row && c == col) continue;
                if (r < 0 || r >= sizeOfRow || c < 0 || c >= sizeOfCol) continue;
                const cell: HTMLTableCellElement = board[r][c];
                const value: number = parseInt(cell.getAttribute("value"));
                if (value !== -1) {
                    cell.setAttribute("value", (value + 1).toString());
                }
            }
        }
    }
    for (let r = 0; r < sizeOfRow; r++) {
        for (let c = 0; c < sizeOfCol; c++) {
            const cell: HTMLTableCellElement = board[r][c];
            const value: string = cell.getAttribute("value");
            if (value === "-1") {
                updateHints(r, c);
            }
        }
    }
    const displayTotalBombs: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-total-bombs");
    displayTotalBombs.innerText = totalBombs.toString();
    currBombs = totalBombs;
    displayCurrBombs.innerText = currBombs.toString();
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
            const cell: HTMLTableCellElement = board[r][c];
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
            const cell: HTMLTableCellElement = board[r][c];
            const value: string = cell.getAttribute("value");
            const revealed: boolean = cell.getAttribute("revealed") === "true";
            const flag: boolean = cell.getAttribute("flag") === "true";
            if (revealed) {
                if (flag && value !== "-1") {
                    cell.innerHTML = `<img src="pics/white_flag.png">`;
                }
            } else if (value === "-1") {
                cell.innerHTML = `<img src="pics/bomb.png">`;
            } else {
                cell.innerText = value;
            }
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
}

function cellPressed(row: number, col: number): void {
    if (!in_game) return;
    const cell: HTMLTableCellElement = board[row][col];
    cell.onclick = () => {};
    if (flagMode) cellFlag(row, col);
    else cellReveal(row, col);
}

function cellFlag(row: number, col: number): void {
    if (currBombs === 0) return;
    currBombs--;
    displayCurrBombs.innerText = currBombs.toString();
    const cell: HTMLTableCellElement = board[row][col];
    const value: string = cell.getAttribute("value");
    cell.setAttribute("revealed", "true");
    cell.setAttribute("flag", "true");
    if (value === "-1") {
        bombsFlagged++;
        if (bombsFlagged === totalBombs) {
            message.innerText = GAME_WON;
            endGame();
        }
    }
    cell.innerHTML = `<img src="pics/flag.png">`;
    cell.onclick = () => cellUnFlag(row, col);
}

function cellUnFlag(row: number, col: number): void {
    if (!in_game) return;
    currBombs++;
    displayCurrBombs.innerText = currBombs.toString();
    const cell: HTMLTableCellElement = board[row][col];
    const value: string = cell.getAttribute("value");
    cell.setAttribute("revealed", "false");
    cell.setAttribute("flag", "false");
    if (value === "-1") {
        bombsFlagged--;
    }
    cell.innerHTML = "";
    cell.onclick = () => cellPressed(row, col);
}

function cellReveal(row: number, col: number): void {
    const cell: HTMLTableCellElement = board[row][col];
    const value: string = cell.getAttribute("value");
    if (value === "-1") {
        message.innerText = GAME_LOST;
        endGame();
    } else if (value === "0") {
        revealAroundZeros(row, col);
    } else {
        cell.innerText = value;
        cell.setAttribute("revealed", "true");
    }
}

function revealAroundZeros(row: number, col: number): void {
    const cell: HTMLTableCellElement = board[row][col];
    const value: string = cell.getAttribute("value");

    cell.innerText = value;
    cell.setAttribute("revealed", "true");
    cell.onclick = () => {};

    function revealNext(row: number, col: number): void {
        const cellNext: HTMLTableCellElement = board[row][col];
        const valueNext: string = cellNext.getAttribute("value");
        const revealedNext: boolean = cellNext.getAttribute("revealed") === "true";
        
        if (valueNext === "0" && !revealedNext) {
            revealAroundZeros(row, col);
        }
        else {
            cellNext.innerText = valueNext;
            cellNext.setAttribute("revealed", "true");
            cellNext.onclick = () => {};
        }
    }

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue;
            if (r >= 0 && r < sizeOfRow && c >= 0 && c < sizeOfCol) revealNext(r, c);
        }
    }
}