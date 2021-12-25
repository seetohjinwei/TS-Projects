var Cell = (function () {
    function Cell(row, col) {
        var _this = this;
        var element = document.createElement("td");
        element.innerText = " ";
        element.onclick = function () { return _this.pressed(false); };
        element.oncontextmenu = function () {
            _this.pressed(true);
            return false;
        };
        var img = document.createElement("img");
        img.src = "";
        element.appendChild(img);
        this.element = element;
        this.value = 0;
        this.revealed = false;
        this.flag = false;
        this.row = row;
        this.col = col;
    }
    Cell.prototype.pressed = function (rightClick) {
        if (!game.active)
            return;
        if (this.flag)
            this.pressUnFlag();
        else if (this.revealed) {
            if (game.cheat)
                this.pressCheat();
        }
        else if (game.flag !== rightClick)
            this.pressFlag();
        else
            this.reveal();
    };
    Cell.prototype.pressCheat = function () {
        for (var r = this.row - 1; r <= this.row + 1; r++) {
            for (var c = this.col - 1; c <= this.col + 1; c++) {
                if (r === this.row && c === this.col)
                    continue;
                if (r >= 0 && r < board.rowsize && c >= 0 && c < board.colsize) {
                    var cell = board.cells[r][c];
                    if (cell.value === -1 && !cell.flag) {
                        return;
                    }
                }
            }
        }
        for (var r = this.row - 1; r <= this.row + 1; r++) {
            for (var c = this.col - 1; c <= this.col + 1; c++) {
                if (r === this.row && c === this.col)
                    continue;
                if (r >= 0 && r < board.rowsize && c >= 0 && c < board.colsize) {
                    var cell = board.cells[r][c];
                    if (!cell.revealed) {
                        if (cell.value === 0)
                            board.cells[r][c].revealAroundZeros();
                        else
                            board.cells[r][c].updateDisplay();
                    }
                }
            }
        }
    };
    Cell.prototype.pressFlag = function () {
        if (bombs.curr === 0)
            return;
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
        this.updateDisplay(false, "minesweeper/pics/flag.png");
    };
    Cell.prototype.pressUnFlag = function () {
        if (!game.active)
            return;
        bombs.curr++;
        bombs.displayCurr();
        this.revealed = false;
        this.flag = false;
        if (this.value === -1) {
            bombs.flagged--;
        }
        this.updateDisplay(false, "");
    };
    Cell.prototype.reveal = function () {
        if (this.value === -1) {
            displayMessage(false);
            game.end();
        }
        else if (this.value === 0) {
            this.revealAroundZeros();
        }
        else {
            this.updateDisplay();
        }
    };
    Cell.prototype.revealAroundZeros = function () {
        this.updateDisplay();
        function revealNext(row, col) {
            var cell = board.cells[row][col];
            if (cell.value === 0) {
                cell.revealAroundZeros();
            }
            else {
                cell.updateDisplay();
            }
        }
        for (var r = this.row - 1; r <= this.row + 1; r++) {
            for (var c = this.col - 1; c <= this.col + 1; c++) {
                if (r === this.row && c === this.col)
                    continue;
                if (r >= 0 &&
                    r < board.rowsize &&
                    c >= 0 &&
                    c < board.colsize &&
                    !board.cells[r][c].revealed)
                    revealNext(r, c);
            }
        }
    };
    Cell.prototype.updateDisplay = function (reveal, image) {
        if (reveal === void 0) { reveal = true; }
        var value = this.value.toString();
        var img = this.element.firstElementChild;
        if (reveal)
            this.revealed = true;
        if (image === undefined) {
            this.element.innerText = value;
            img.src = "";
        }
        else {
            img.src = image;
        }
    };
    return Cell;
}());
var Game = (function () {
    function Game() {
        this.active = true;
        this.flag = false;
        this.cheat = false;
    }
    Game.prototype.toggleFlag = function () {
        var displayFlagMode = (document.getElementById("display-flag-mode"));
        this.flag = !this.flag;
        displayFlagMode.innerText = this.flag ? "On" : "Off";
    };
    Game.prototype.toggleCheat = function () {
        var displayCheatMode = (document.getElementById("display-cheat-mode"));
        this.cheat = !this.cheat;
        displayCheatMode.innerText = this.cheat ? "On" : "Off";
    };
    Game.prototype.start = function (difficulty) {
        game.active = true;
        displayMessage("Good luck!");
        var table = {
            1: [10, 8, 8],
            2: [40, 16, 16],
            3: [99, 16, 30]
        };
        var bombcount = table[difficulty][0];
        bombs = new Bombs(bombcount);
        var rowsize = table[difficulty][1];
        var colsize = table[difficulty][2];
        board = new Board(rowsize, colsize);
    };
    Game.prototype.end = function () {
        game.active = false;
        board.end();
    };
    return Game;
}());
var Board = (function () {
    function Board(rowsize, colsize) {
        this.cells = [];
        this.rowsize = 0;
        this.colsize = 0;
        this.cells = [];
        this.rowsize = rowsize;
        this.colsize = colsize;
        this.generate();
        this.update();
    }
    Board.prototype.generate = function () {
        this.cells = [];
        for (var r = 0; r < this.rowsize; r++) {
            var row = [];
            for (var c = 0; c < this.colsize; c++) {
                var cell = new Cell(r, c);
                row.push(cell);
            }
            this.cells.push(row);
        }
        function randInt(maxValue) {
            return Math.floor(Math.random() * maxValue);
        }
        var bombsPlaced = 0;
        while (bombsPlaced < bombs.total) {
            var r = randInt(this.rowsize);
            var c = randInt(this.colsize);
            var cell = this.cells[r][c];
            if (cell.value !== -1) {
                cell.value = -1;
                bombsPlaced++;
            }
        }
        for (var r = 0; r < this.rowsize; r++) {
            for (var c = 0; c < this.colsize; c++) {
                var cell = this.cells[r][c];
                if (cell.value === -1) {
                    for (var row = r - 1; row <= r + 1; row++) {
                        for (var col = c - 1; col <= c + 1; col++) {
                            if (row == r && col == c)
                                continue;
                            if (row < 0 || row >= this.rowsize || col < 0 || col >= this.colsize)
                                continue;
                            var cell_1 = this.cells[row][col];
                            if (cell_1.value !== -1) {
                                cell_1.value++;
                            }
                        }
                    }
                }
            }
        }
    };
    Board.prototype.update = function () {
        var playArea = (document.getElementById("display-board"));
        while (playArea.hasChildNodes()) {
            playArea.removeChild(playArea.firstChild);
        }
        for (var r = 0; r < this.rowsize; r++) {
            var row = document.createElement("tr");
            for (var c = 0; c < this.colsize; c++) {
                var cell = this.cells[r][c].element;
                row.appendChild(cell);
            }
            playArea.appendChild(row);
        }
    };
    Board.prototype.end = function () {
        var playArea = (document.getElementById("display-board"));
        while (playArea.hasChildNodes()) {
            playArea.removeChild(playArea.firstChild);
        }
        for (var r = 0; r < this.rowsize; r++) {
            var row = document.createElement("tr");
            for (var c = 0; c < this.colsize; c++) {
                var cell = this.cells[r][c];
                if (cell.revealed) {
                    if (cell.flag && cell.value !== -1) {
                        cell.updateDisplay(false, "minesweeper/pics/white_flag.png");
                    }
                }
                else if (cell.value === -1) {
                    cell.updateDisplay(false, "minesweeper/pics/bomb.png");
                }
                else {
                    cell.updateDisplay(false);
                }
                row.appendChild(cell.element);
            }
            playArea.appendChild(row);
        }
    };
    return Board;
}());
var Bombs = (function () {
    function Bombs(total) {
        this.total = total;
        this.curr = total;
        this.flagged = 0;
        this.displayCurr();
        this.displayTotal();
    }
    Bombs.prototype.displayCurr = function () {
        var message = this.curr.toString();
        var displayCurrBombs = (document.getElementById("display-curr-bombs"));
        displayCurrBombs.innerText = message;
    };
    Bombs.prototype.displayTotal = function () {
        var message = this.total.toString();
        var displayTotalBombs = (document.getElementById("display-total-bombs"));
        displayTotalBombs.innerText = message;
    };
    return Bombs;
}());
window.onload = function () {
    document.addEventListener("keypress", function (press) {
        var value = press.key;
        if (value === "f")
            game.toggleFlag();
        else if (value === "c")
            game.toggleCheat();
        else if ("123".includes(value))
            game.start(parseInt(value));
    });
    displayInfo();
    var images = [
        "minesweeper/pics/bomb.png",
        "minesweeper/pics/flag.png",
        "minesweeper/pics/white_flag.png",
    ];
    images.forEach(function (path) {
        var image = new Image();
        image.src = path;
    });
};
var game = new Game();
var bombs;
var board;
function displayInfo() {
    var infoDisplay = document.getElementById("display-info");
    var toggleInfo = (document.getElementById("display-toggle-text"));
    document.getElementById("button-toggle-info").onclick = function () {
        if (toggleInfo.innerText === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        }
        else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    };
}
function displayMessage(message) {
    var GAME_WON = "You win! :D";
    var GAME_LOST = "You lost! :(";
    var display = document.getElementById("display-message");
    if (typeof message === "boolean") {
        display.innerText = message ? GAME_WON : GAME_LOST;
    }
    else {
        display.innerText = message;
    }
}
