var board: number[][] = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
];
const message: HTMLElement = document.getElementById("display-message");
const buttonSolve: HTMLElement = document.getElementById("button-solve");
const buttonReset: HTMLElement = document.getElementById("button-reset");
const display: HTMLElement = document.getElementById("display-board");

window.onload = function (): void {
    updateBoard();
    displayInfo();
}

function updateBoard(): void {
    while (display.hasChildNodes()) {
        display.removeChild(display.firstChild);
    }
    for (let i = 0; i < 9; i++) {
        const tr: HTMLTableRowElement = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const td: HTMLTableDataCellElement = document.createElement("td");
            const value: number = board[i][j];
            const displayedValue: string = (value === 0) ? "" : value.toString();
            td.innerText = displayedValue;
            td.setAttribute("row", i.toString());
            td.setAttribute("col", j.toString());
            td.addEventListener('click', clickCell);
            
            tr.appendChild(td);
        }
        display.appendChild(tr);
    }
}

function clickCell(cellPressed): void {
    const cell: HTMLTableCellElement = cellPressed.target;
    const row: number = parseInt(cell.getAttribute("row"));
    const col: number = parseInt(cell.getAttribute("col"));
    let endListen = false;
    function readValue(press): void {
        const value = press.key;
        if (['0','1','2','3','4','5','6','7','8','9'].includes(value)) {
            let key: number = parseInt(value);
            board[row][col] = key;
            cell.innerText = (key === 0) ? "" : key.toString();
            document.removeEventListener('keydown', readValue);
        }
    }
    document.addEventListener('keydown', readValue);
}

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

buttonReset.onclick = function(): void {
    board = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];
    updateBoard();
    message.innerText = "";
}

function validBoard(): boolean {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0 && !validPos(i, j, board[i][j])) return false;
        }
    }
    return true;
}

function solve(): void {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let n = 1; n <= 9; n++) {
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
}

function validPos(r: number, c: number, value: number): boolean {
    // there is a need to check if i !== c or r because of validBoard() calling
    // this function on values already in board
    for (let i = 0; i < 9; i++) {
        if (i !== c && board[r][i] === value) return false;
        if (i !== r && board[i][c] === value) return false;
    }
    const r1: number = ~~(r / 3) * 3;
    const c1: number = ~~(c / 3) * 3;
    for (let i = r1; i < r1 + 3; i++) {
        for (let j = c1; j < c1 + 3; j++) {
            if (i !== r && j !== c && board[i][j] === value) return false;
        }
    }
    return true;
}

buttonSolve.onclick = function(): void {
    if (!validBoard()) {
        message.innerText = "Invalid board!";
        return;
    }
    solve();
}
