document.addEventListener("keydown", function (press) {
    var value = press.key;
    if (value === " ")
        buttonStart.click();
    else if (value === "r")
        buttonReset.click();
    else if (value === "l")
        buttonLap.click();
    else if (value === "o")
        buttonClearLaps.click();
    else if (value === "f")
        buttonFreeze.click();
});
var buttonStart = document.getElementById("button-start");
var buttonReset = document.getElementById("button-reset");
var buttonLap = document.getElementById("lap");
var buttonClearLaps = document.getElementById("clear-laps");
var buttonFreeze = document.getElementById("button-freeze");
buttonStart.onclick = function () {
    clearInterval(Interval);
    if (!running) {
        Interval = setInterval(startTimer, 10);
        running = true;
        displayStartStop("Stop");
    }
    else {
        running = false;
        displayStartStop("Start");
    }
};
buttonReset.onclick = function () {
    running = false;
    displayStartStop("Start");
    clearInterval(Interval);
    milli = -1;
    seconds = 0;
    minutes = 0;
    startTimer();
};
buttonLap.onclick = function () { return funcLaps(false); };
buttonClearLaps.onclick = function () { return funcLaps(true); };
function funcLaps(clear) {
    var lapsList = document.getElementById("laps-list");
    if (clear) {
        while (lapsList.hasChildNodes()) {
            lapsList.removeChild(lapsList.firstChild);
        }
        return;
    }
    var entry = displayTime();
    var item = document.createElement("li");
    item.textContent = entry;
    lapsList.appendChild(item);
}
buttonFreeze.onclick = function () {
    var freezeDisplay = (document.getElementById("freeze-display"));
    freezeDisplay.innerText = ": " + displayTime();
};
var milli = 0;
var seconds = 0;
var minutes = 0;
var Interval;
var running = false;
function displayTime() {
    var minuteString = minutes.toString().padStart(2, "0");
    var secondsString = seconds.toString().padStart(2, "0");
    var milliString = milli.toString().padStart(2, "0");
    return "" + (minutes != 0 ? minuteString + ":" : "") + secondsString + ":" + milliString;
}
function startTimer() {
    var appendMilli = document.getElementById("milli");
    var appendSeconds = document.getElementById("seconds");
    var appendMinutes = document.getElementById("minutes");
    milli++;
    if (milli < 10)
        appendMilli.innerText = "0" + milli;
    else if (milli < 100)
        appendMilli.innerText = milli.toString();
    else {
        seconds++;
        milli = 0;
        appendMilli.innerText = "00";
    }
    if (seconds == 0)
        appendSeconds.innerText = "00";
    else if (seconds < 10)
        appendSeconds.innerText = "0" + seconds;
    else if (seconds < 60)
        appendSeconds.innerText = seconds.toString();
    else {
        seconds = 0;
        minutes++;
        appendSeconds.innerText = "00";
    }
    if (minutes == 0)
        appendMinutes.innerText = "";
    else if (minutes < 10)
        appendMinutes.innerText = "0" + minutes + ":";
    else
        appendMinutes.innerText = minutes + ":";
}
function displayStartStop(message) {
    var display = document.getElementById("start-stop");
    display.innerText = message;
}
