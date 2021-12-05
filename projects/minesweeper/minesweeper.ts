class Cell {
    element: HTMLTableCellElement;
    value: number;
    revealed: boolean;
    flag: boolean;
    row: number;
    col: number;

    constructor(row: number, col: number) {
        const element: HTMLTableCellElement = document.createElement("td");
        element.innerText = " ";
        element.onclick = () => this.pressed(false);
        element.oncontextmenu = () => {
            this.pressed(true);
            return false; // return false to prevent actual context menu from popping out.
        }
        const img: HTMLImageElement = document.createElement("img");
        img.src = "";
        element.appendChild(img);

        this.element = element;
        this.value = 0;
        this.revealed = false;
        this.flag = false;
        this.row = row;
        this.col = col;
    }

    pressed(rightClick: boolean): void {
        if (!game.active) return;
        if (this.flag) this.pressUnFlag();
        else if (this.revealed) {
            if (game.cheat) this.pressCheat();
        }
        else if (game.flag !== rightClick) this.pressFlag();
        else this.reveal();
    }
    
    pressCheat() : void {
        for (let r = this.row - 1; r <= this.row + 1; r++) {
            for (let c = this.col - 1; c <= this.col + 1; c++) {
                if (r === this.row && c === this.col) continue;
                if (r >= 0 && r < board.rowsize && c >= 0 && c < board.colsize) {
                    const cell: Cell = board.cells[r][c];
                    if (cell.value === -1 && !cell.flag) {
                        return;
                    }
                }
            }
        }
        for (let r = this.row - 1; r <= this.row + 1; r++) {
            for (let c = this.col - 1; c <= this.col + 1; c++) {
                if (r === this.row && c === this.col) continue;
                if (r >= 0 && r < board.rowsize && c >= 0 && c < board.colsize) {
                    const cell: Cell = board.cells[r][c];
                    if (!cell.revealed) {
                        if (cell.value === 0) board.cells[r][c].revealAroundZeros();
                        else board.cells[r][c].updateDisplay();
                    }
                }
            }
        }
    }
    
    pressFlag(): void {
        if (bombs.curr === 0) return;
        bombs.curr--;
        bombs.displayCurr();
        this.revealed = true;
        this.flag = true;
        if (this.value === -1) {
            bombs.flagged++;
            if (bombs.flagged === bombs.total) {
                displayMessage(true);
                game.end();
            }
        }
        this.updateDisplay(false, `pics/flag.png`);
    }
    
    pressUnFlag(): void {
        if (!game.active) return;
        bombs.curr++;
        bombs.displayCurr();
        this.revealed = false;
        this.flag = false;
        if (this.value === -1) {
            bombs.flagged--;
        }
        this.updateDisplay(false, "");
    }
    
    reveal(): void {
        if (this.value === -1) {
            displayMessage(false);
            game.end();
        } else if (this.value === 0) {
            this.revealAroundZeros();
        } else {
            this.updateDisplay();
        }
    }
    
    revealAroundZeros(): void {
        this.updateDisplay();
    
        function revealNext(row: number, col: number): void {
            const cell: Cell = board.cells[row][col];
            if (cell.value === 0) {
                cell.revealAroundZeros();
            } else {
                cell.updateDisplay();
            }
        }
    
        for (let r = this.row - 1; r <= this.row + 1; r++) {
            for (let c = this.col - 1; c <= this.col + 1; c++) {
                if (r === this.row && c === this.col) continue;
                if (r >= 0 && r < board.rowsize && c >= 0 && c < board.colsize && !board.cells[r][c].revealed) revealNext(r, c);
            }
        }
    }

    updateDisplay(reveal: boolean = true, image?: string): void {
        const value: string = this.value.toString();
        const img: HTMLImageElement = <HTMLImageElement> this.element.firstElementChild;
        if (reveal) this.revealed = true;
        if (image === undefined) {
            this.element.innerText = value;
            img.src = "";
        } else {
            img.src = image;
        }
    }
}

class Game {
    active: boolean;
    flag: boolean;
    cheat: boolean;

    constructor() {
        this.active = true;
        this.flag = false;
        this.cheat = false;
    }

    toggleFlag(): void {
        const displayFlagMode: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-flag-mode");
        this.flag = !this.flag;
        displayFlagMode.innerText = (this.flag) ? "On" : "Off";
    }
    
    toggleCheat(): void {
        const displayCheatMode: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-cheat-mode");
        this.cheat = !this.cheat;
        displayCheatMode.innerText = (this.cheat) ? "On" : "Off";
    }

    start(difficulty: number): void {
        game.active = true;
        displayMessage("Good luck!");
        const table: {[difficulty: number]: number[]} = {
            // difficulty: bombs.total, board.rowsize, board.colsize
            1: [10, 8, 8],
            2: [40, 16, 16],
            3: [99, 16, 30]
        };
        
        const bombcount: number = table[difficulty][0];
        // re-creates bomb instance
        bombs = new Bombs(bombcount);

        const rowsize: number = table[difficulty][1];
        const colsize: number = table[difficulty][2];
        // re-creates board instance
        board = new Board(rowsize, colsize);
    }

    end(): void {
        game.active = false;
        board.end();
    }
}

class Board {
    cells: Cell[][] = [];
    // -1 means bomb
    // otherwise, number indicates number of surronding bombs
    rowsize: number = 0;
    colsize: number = 0;
    
    constructor(rowsize: number, colsize: number) {
        this.cells = [];
        this.rowsize = rowsize;
        this.colsize = colsize;
        this.generate();
        this.update();
    }

    generate(): void {
        // fills board with empty cells
        this.cells = [];
        for (let r = 0; r < this.rowsize; r++) {
            const row: Cell[] = [];
            for (let c = 0; c < this.colsize; c++) {
                const cell: Cell = new Cell(r, c);
                row.push(cell);
            }
            this.cells.push(row);
        }
        // generates bombs
        function randInt(maxValue: number): number {
            return Math.floor(Math.random() * maxValue);
        }
        let bombsPlaced = 0;
        while (bombsPlaced < bombs.total) {
            const r: number = randInt(this.rowsize);
            const c: number = randInt(this.colsize);
            const cell: Cell = this.cells[r][c];
            if (cell.value !== -1) {
                cell.value = -1;
                bombsPlaced++;
            }
        }
        for (let r = 0; r < this.rowsize; r++) {
            for (let c = 0; c < this.colsize; c++) {
                const cell: Cell = this.cells[r][c];
                if (cell.value === -1) {
                    // updateHints
                    for (let row = r - 1; row <= r + 1; row++) {
                        for (let col = c - 1; col <= c + 1; col++) {
                            if (row == r && col == c) continue;
                            if (row < 0 || row >= this.rowsize || col < 0 || col >= this.colsize) continue;
                            const cell: Cell = this.cells[row][col];
                            if (cell.value !== -1) {
                                cell.value++;
                            }
                        }
                    }
                }
            }
        }
    }

    update(): void {
        const playArea: HTMLTableElement = <HTMLTableElement> document.getElementById("display-board");
        while (playArea.hasChildNodes()) {
            playArea.removeChild(playArea.firstChild);
        }
        for (let r = 0; r < this.rowsize; r++) {
            const row: HTMLTableRowElement = document.createElement("tr");
            for (let c = 0; c < this.colsize; c++) {
                const cell: HTMLTableCellElement = this.cells[r][c].element;
                row.appendChild(cell);
            }
            playArea.appendChild(row);
        }
    }

    end(): void {
        const playArea: HTMLTableElement = <HTMLTableElement> document.getElementById("display-board");
        while (playArea.hasChildNodes()) {
            playArea.removeChild(playArea.firstChild);
        }
        for (let r = 0; r < this.rowsize; r++) {
            const row: HTMLTableRowElement = document.createElement("tr");
            for (let c = 0; c < this.colsize; c++) {
                const cell: Cell = this.cells[r][c];
                if (cell.revealed) {
                    if (cell.flag && cell.value !== -1) {
                        cell.updateDisplay(false, `pics/white_flag.png`);
                    }
                } else if (cell.value === -1) {
                    cell.updateDisplay(false, `pics/bomb.png`);
                } else {
                    cell.updateDisplay(false);
                }
                row.appendChild(cell.element);
            }
            playArea.appendChild(row);
        }
    }
}

class Bombs {
    total: number;
    curr: number; // displayed value that simply shows number of flags (real or not)
    flagged: number; // hidden value that tracks actual bombs that are flagged

    constructor(total: number) {
        this.total = total;
        this.curr = total;
        this.flagged = 0;

        this.displayCurr();
        this.displayTotal();
    }

    displayCurr(): void {
        const message: string = this.curr.toString();
        const displayCurrBombs: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-curr-bombs");
    
        displayCurrBombs.innerText = message;
    }

    displayTotal(): void {
        const message: string = this.total.toString();
        const displayTotalBombs: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-total-bombs");

        displayTotalBombs.innerText = message;
    }
}

window.onload = () => {
    document.addEventListener("keypress", (press: KeyboardEvent) => {
        const value: string = press.key;
        if (value === "f") game.toggleFlag();
        else if (value === "c") game.toggleCheat();
        else if ("123".includes(value)) game.start(parseInt(value));
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

const game: Game = new Game();
let bombs: Bombs;
let board: Board;

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    document.getElementById("button-toggle-info").onclick = function(): void {
        if (toggleInfo.innerText === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
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
