const board: number[][] = Array(9).fill(Array(9).fill(0));
const message: HTMLElement = document.getElementById("display-message");
const button: HTMLElement = document.getElementById("button-solve");
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
            const displayedValue: string = (value == 0) ? "" : value.toString();
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