var board: HTMLTableCellElement[][] = [];
// -1 means bomb
// otherwise, number indicates number of surronding bombs
var sizeOfRow: number = 0;
var sizeOfCol: number = 0;
var totalBombs: number = 0;
var currBombs: number = 0;
var flagMode: boolean = false;
var in_game: boolean = false;

window.onload = (): void => {
    const buttonEasy: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-easy");
    const buttonMedium: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-medium");
    const buttonHard: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-hard");

    buttonEasy.onclick = () => startGame(1);
    buttonMedium.onclick = () => startGame(2);
    buttonHard.onclick = () => startGame(3);

    displayInfo();
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
            if (r < 0 || r > sizeOfRow - 1) continue;
            for (let c = col - 1; c <= col + 1; c++) {
                if (c < 0 || c > sizeOfCol - 1) continue;
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

function lostGame(): void {
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
            if (value === "-1") {
                cell.innerHTML = `<img src="pics/bomb.png">`;
            } else {
                cell.innerText = value;
            }
            row.appendChild(cell);
        }
        playArea.appendChild(row);
    }
    alert("You lost!");
}

function cellPressed(row: number, col: number): void {
    if (!in_game) return;
    const cell: HTMLTableCellElement = board[row][col];
    const value: string = cell.getAttribute("value");
    if (value === "-1") {
        lostGame();
    } else {
        cell.innerText = value;
    }
}
