document.addEventListener("keydown", (press: KeyboardEvent) => {
    const value: string = press.key;
    if (value === " ") buttonStart.click();
    else if (value === "r") buttonReset.click();
    else if (value === "l") buttonLap.click();
    else if (value === "o") buttonClearLaps.click();
    else if (value === "f") buttonFreeze.click();
});

const buttonStart: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-start");
const buttonReset: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-reset");
const buttonLap: HTMLButtonElement = <HTMLButtonElement>document.getElementById("lap");
const buttonClearLaps: HTMLButtonElement = <HTMLButtonElement>document.getElementById("clear-laps");
const buttonFreeze: HTMLButtonElement = <HTMLButtonElement>document.getElementById("button-freeze");

buttonStart.onclick = () => {
    clearInterval(Interval);
    if (!running) {
        Interval = setInterval(startTimer, 10);
        running = true;
        displayStartStop("Stop");
    } else {
        running = false;
        displayStartStop("Start");
    }
};

buttonReset.onclick = () => {
    running = false;
    displayStartStop("Start");
    clearInterval(Interval);
    milli = -1;
    seconds = 0;
    minutes = 0;
    startTimer();
};

buttonLap.onclick = () => funcLaps(false);
buttonClearLaps.onclick = () => funcLaps(true);

function funcLaps(clear: boolean): void {
    const lapsList: HTMLOListElement = <HTMLOListElement>document.getElementById("laps-list");
    if (clear) {
        while (lapsList.hasChildNodes()) {
            lapsList.removeChild(lapsList.firstChild);
        }
        return;
    }
    const entry: string = displayTime();
    const item: HTMLLIElement = document.createElement("li");
    item.textContent = entry;
    lapsList.appendChild(item);
}

buttonFreeze.onclick = () => {
    const freezeDisplay: HTMLSpanElement = <HTMLSpanElement>(
        document.getElementById("freeze-display")
    );
    freezeDisplay.innerText = ": " + displayTime();
};

let milli: number = 0;
let seconds: number = 0;
let minutes: number = 0;
let Interval: number;
let running: boolean = false;

function displayTime(): string {
    let minuteString = minutes.toString().padStart(2, "0");
    let secondsString = seconds.toString().padStart(2, "0");
    let milliString = milli.toString().padStart(2, "0");
    return `${minutes != 0 ? minuteString + ":" : ""}${secondsString}:${milliString}`;
}

function startTimer(): void {
    const appendMilli: HTMLSpanElement = <HTMLSpanElement>document.getElementById("milli");
    const appendSeconds: HTMLSpanElement = <HTMLSpanElement>document.getElementById("seconds");
    const appendMinutes: HTMLSpanElement = <HTMLSpanElement>document.getElementById("minutes");

    milli++;
    if (milli < 10) appendMilli.innerText = "0" + milli;
    else if (milli < 100) appendMilli.innerText = milli.toString();
    else {
        seconds++;
        milli = 0;
        appendMilli.innerText = "00";
    }
    if (seconds == 0) appendSeconds.innerText = "00";
    else if (seconds < 10) appendSeconds.innerText = "0" + seconds;
    else if (seconds < 60) appendSeconds.innerText = seconds.toString();
    else {
        seconds = 0;
        minutes++;
        appendSeconds.innerText = "00";
    }
    if (minutes == 0) appendMinutes.innerText = "";
    else if (minutes < 10) appendMinutes.innerText = "0" + minutes + ":";
    else appendMinutes.innerText = minutes + ":";
}

function displayStartStop(message: string): void {
    const display: HTMLSpanElement = <HTMLSpanElement>document.getElementById("start-stop");
    display.innerText = message;
}
