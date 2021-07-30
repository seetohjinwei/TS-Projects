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
let value: number = null;

const buttonEasy: HTMLElement = document.getElementById("button-easy");
const buttonMedium: HTMLElement = document.getElementById("button-medium");
const buttonHard: HTMLElement = document.getElementById("button-hard");
const buttonValidate: HTMLElement = document.getElementById("button-validate");

buttonValidate.onclick = () => {
    function solvedBoard(): boolean {
        // haven't check for box
        for (let i = 0; i < 9; i++) {
            const row: Set<number> = new Set();
            const col: Set<number> = new Set();
            for (let j = 0; j < 9; j++) {
                const r: number = board[i][j];
                const c: number = board[j][i];
                if (r === 0 || c === 0) return false;
                row.add(r);
                col.add(c);
            }
            if (row.size !== 9) return false;
            if (col.size !== 9) return false;
        }
        return true;
    }
    const valid: boolean = solvedBoard();
    
    message.innerText = valid ? "You did it! :D" : "Hmm, seems like there's an error";
};

window.onload = function (): void {
    updateBoard(true);
    displayInfo();
}

function updateBoard(displayInput: boolean): void {
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
        if (displayInput) {
            tr.appendChild(document.createElement("td"));
            const td_value: HTMLTableDataCellElement = document.createElement("td");
            td_value.innerText = (i + 1).toString();
            td_value.setAttribute("value", (i + 1).toString());
            td_value.addEventListener('click', clickValue);
            tr.appendChild(td_value);
            if (i === 0) {
                const td_value: HTMLTableDataCellElement = document.createElement("td");
                td_value.innerText = "C";
                td_value.setAttribute("value", "C");
                td_value.addEventListener('click', clickValue);
                tr.appendChild(td_value);
            } else if (i === 1) {
                const td_value: HTMLTableDataCellElement = document.createElement("td");
                td_value.innerText = "0";
                td_value.setAttribute("value", "0");
                td_value.addEventListener('click', clickValue);
                tr.appendChild(td_value);
            }
        }
        display.appendChild(tr);
    }
}

function clickCell(cellPressed): void {
    const cell: HTMLTableDataCellElement = cellPressed.target;
    const row: number = parseInt(cell.getAttribute("row"));
    const col: number = parseInt(cell.getAttribute("col"));
    function readValue(press: KeyboardEvent): void {
        const value = press.key;
        if (['0','1','2','3','4','5','6','7','8','9'].includes(value)) {
            let key: number = parseInt(value);
            board[row][col] = key;
            cell.innerText = (key === 0) ? "" : key.toString();
            document.removeEventListener('keydown', readValue);
        }
    }
    if (value === null) document.addEventListener('keydown', readValue);
    else {
        board[row][col] = value;
        cell.innerText = (value === 0) ? "" : value.toString();
    }
}

function clickValue(cellPressed): void {
    const cell: HTMLTableDataCellElement = cellPressed.target;
    const input: string = cell.getAttribute("value");
    value = (input === "C") ? null : parseInt(input);
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

buttonReset.onclick = () => {
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
    updateBoard(true);
    message.innerText = "Reset!";
};

function validBoard(): boolean {
    let count: number = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
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
    updateBoard(false);
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
    if (!validBoard()) return;
    solve();
    message.innerText = "Solved!";
}
