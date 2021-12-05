window.onload = () => {
    updateBoard();
    displaySelectors(true);
    displayInfo();

    document.addEventListener("keypress", (press: KeyboardEvent) => {
        const value: string = press.key.toUpperCase();
        handleKeyPress(value);
    });
};

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

var selectorsArray: HTMLTableCellElement[] = [];
var cellsSelected: HTMLTableCellElement[] = [];

const message: HTMLElement = document.getElementById("display-message");
const buttonSolve: HTMLElement = document.getElementById("button-solve");
const buttonReset: HTMLElement = document.getElementById("button-reset");
const display: HTMLElement = document.getElementById("display-board");
let value: number = null;

const buttonEasy: HTMLElement = document.getElementById("button-easy");
const buttonMedium: HTMLElement = document.getElementById("button-medium");
const buttonHard: HTMLElement = document.getElementById("button-hard");
const buttonValidate: HTMLElement = document.getElementById("button-validate");

buttonEasy.onclick = () => generateBoard(0);
buttonMedium.onclick = () => generateBoard(1);
buttonHard.onclick = () => generateBoard(2);

function generateBoard(difficulty: number): void {
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

    const table: number[] = [45, 35, 25];
    let revealedCount: number = table[difficulty] + Math.floor(Math.random() * 5) - 2; // += 2
    console.log(revealedCount);

    while (revealedCount > 0) {
        const row: number = Math.floor(Math.random() * 9);
        const col: number = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) continue;
        board[row][col] = generateNumber(row, col);
        revealedCount--;
    }

    function generateNumber(row: number, col: number): number {
        const possibleValues: boolean[] = [
            false, false, false,
            false, false, false,
            false, false, false
        ]
        let count: number = 0;
        for (let i = 0; i < 9; i++) {
            const possible: boolean = (validPos(row, col, i+1));
            possibleValues[i] = possible;
            if (possible) count++;
        }
        console.log(count, possibleValues.toString());
        if (count === 0) return 0;
        const index: number = Math.floor(Math.random() * count) + 1;
        for (let i = 0; i < 9; i++) {
            const possible: boolean = possibleValues[i];
            if (possible) count--;
            if (count === 0) return i + 1;
        }
    }
    updateBoard();
}

buttonValidate.onclick = () => {
    function solvedBoard(): boolean {
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
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                const box: Set<number> = new Set();
                for (let k = i; k < i + 3; k++) {
                    for (let l = j; l < j + 3; l++) {
                        const b: number = board[k][l];
                        if (b === 0) return false;
                        box.add(b);
                    }
                }
                if (box.size !== 9) return false;
            }
        }
        return true;
    }
    const valid: boolean = solvedBoard();
    
    message.innerText = valid ? "You did it! :D" : "Hmm, seems like there's an error";
};

function handleKeyPress(value: string): void {
    if (!['E','0','1','2','3','4','5','6','7','8','9'].includes(value)) return;
    // E === 0 in our use case here
    if (cellsSelected.length === 0) {
        if (value === "0") value = "E";
        clickSelector(value);
    } else {
        if (value === "E") value = "0";
        cellsSelected.forEach((cell: HTMLTableCellElement) => {
            cell.style.backgroundColor = "";
            const row: number = parseInt(cell.getAttribute("row"));
            const col: number = parseInt(cell.getAttribute("col"));
            board[row][col] = parseInt(value);
            cell.innerText = (value === "0") ? "" : value;
        });
        cellsSelected = [];
    }
}

function updateBoard(): void {
    while (display.hasChildNodes()) {
        display.removeChild(display.firstChild);
    }
    for (let i = 0; i < 9; i++) {
        const tr: HTMLTableRowElement = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const td: HTMLTableCellElement = document.createElement("td");
            const value: number = board[i][j];
            const displayedValue: string = (value === 0) ? "" : value.toString();
            td.innerText = displayedValue;
            td.setAttribute("row", i.toString());
            td.setAttribute("col", j.toString());
            td.onclick = () => clickCell(td);

            tr.appendChild(td);
        }
        display.appendChild(tr);
    }
}

function displaySelectors(show: boolean): void {
    const selectors: HTMLElement = document.getElementById("display-selectors");
    while (selectors.hasChildNodes()) {
        selectors.removeChild(selectors.firstChild);
    }
    selectorsArray = [];
    if (!show) return;
    const tr: HTMLTableRowElement = document.createElement("tr");

    function makeTD(value: string): HTMLTableCellElement {
        const td: HTMLTableCellElement = document.createElement("td");
        td.innerText = value;
        td.setAttribute("value", value);
        td.setAttribute("selected", "false");
        td.onclick = () => clickSelector(value);
        return td;
    }

    for (let i = 1; i <= 9; i++) {
        const td: HTMLTableCellElement = makeTD(i.toString());
        tr.appendChild(td);
        selectorsArray.push(td);
    }
    const td: HTMLTableCellElement = makeTD("E");
    tr.appendChild(td);
    selectorsArray.push(td);
    selectors.appendChild(tr);
}

function clickCell(cell: HTMLTableCellElement): void {
    if (value !==  null) {
        const row: number = parseInt(cell.getAttribute("row"));
        const col: number = parseInt(cell.getAttribute("col"));
        board[row][col] = value;
        cell.innerText = (value === 0) ? "" : value.toString();
    } else {
        const index: number = cellsSelected.indexOf(cell);
        if (index !== -1) {
            cell.style.backgroundColor = "";
            cellsSelected.splice(index, 1);
        } else {
            cell.style.backgroundColor = "#00B3B3";
            cellsSelected.push(cell);
        }
    }
}

function clickSelector(string: string): void {
    if (cellsSelected.length !== 0) {
        handleKeyPress(string);
        return;
    }
    const index: number = (string === "E") ? 9 : parseInt(string) - 1;
    const cell: HTMLTableCellElement = selectorsArray[index];
    const selected: boolean = cell.getAttribute("selected") === "true";
    if (selected) {
        cell.setAttribute("selected", "false");
        cell.style.backgroundColor = "#FFFFFF00";
        value = null;
    } else {
        selectorsArray.forEach((cell) => {
            cell.setAttribute("selected", "false");
            cell.style.backgroundColor = "";
        });
        cell.setAttribute("selected", "true");
        cell.style.backgroundColor = "#00B3B3";
        value = (string === "E") ? 0 : parseInt(string);
    }
}

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
    document.getElementById("button-toggle-info").onclick = () => {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    };
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
    updateBoard();
    displaySelectors(true);
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
    updateBoard();
    displaySelectors(false);
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

buttonSolve.onclick = () => {
    if (!validBoard()) return;
    solve();
    message.innerText = "Solved!";
};

/* used for debugging
UNSOLVED:

board = [
[0,0,0,0,0,0,0,0,0],
[0,0,2,0,1,0,0,9,0],
[0,0,5,0,0,0,7,0,6],
[0,0,0,1,0,0,9,6,3],
[0,3,0,0,2,5,1,0,0],
[0,7,0,4,0,6,5,0,0],
[9,6,3,0,0,0,0,0,0],
[0,0,0,0,6,0,0,3,0],
[0,4,0,0,0,8,0,7,0]
];

SOLVED:

board = [
[3,9,6,5,7,2,8,1,4],
[7,8,2,6,1,4,3,9,5],
[4,1,5,8,9,3,7,2,6],
[5,2,4,1,8,7,9,6,3],
[6,3,8,9,2,5,1,4,7],
[1,7,9,4,3,6,5,8,2],
[9,6,3,7,4,1,2,5,8],
[8,5,7,2,6,9,4,3,1],
[2,4,1,3,5,8,6,7,9]
];
*/