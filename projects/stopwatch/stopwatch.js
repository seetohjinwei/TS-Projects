window.onload = function() {
    console.log("Window loaded, javascript working!");

    document.addEventListener("keydown", function(press) {
        switch (press.key) {
            case " ":
                startFunc();
                break;
            case "r":
                resetFunc();
                break;
            case "l":
                lapFunc();
                break;
            case "o":
                clearLapsFunc();
                break;
            case "f":
                freezeFunc();
                break;
            default:
                break;
        }
    });

    let milli = 0;
    let seconds = 0;
    let minutes = 0;
    let appendMilli = document.getElementById("milli");
    let appendSeconds = document.getElementById("seconds");
    let appendMinutes = document.getElementById("minutes");
    let buttonStart = document.getElementById("button-start");
    let startstopDisplay = document.getElementById("start-stop");
    let buttonReset = document.getElementById("button-reset");
    let Interval;
    let running = false;

    let laps = [];
    let buttonLap = document.getElementById("lap");
    let buttonClearLaps = document.getElementById("clear-laps");
    let lapsList = document.getElementById("laps-list");

    let freeze = "";
    let buttonFreeze = document.getElementById("button-freeze");
    let freezeDisplay = document.getElementById("freeze-display");

    buttonStart.onclick = function() {startFunc();}
    
    function startFunc() {
        clearInterval(Interval);
        if (!running) {
            Interval = setInterval(startTimer, 10);
            running = true;
            startstopDisplay.innerHTML = "Stop";
        } else {
            running = false;
            startstopDisplay.innerHTML = "Start";
        }
    }

    buttonReset.onclick = function() {resetFunc();}
    
    function resetFunc() {
        running = false;
        startstopDisplay.innerHTML = "Start";
        clearInterval(Interval);
        milli = 0;
        seconds = 0;
        minutes = 0;
        appendMilli.innerHTML = "00";
        appendSeconds.innerHTML = "00";
        appendMinutes.innerHTML = "";
    }

    function displayTime() {
        let minuteString = minutes.toString().padStart(2, '0');
        let secondsString = seconds.toString().padStart(2, '0');
        let milliString = milli.toString().padStart(2, '0');
        return `${minutes != 0 ? minuteString + ":" : ""}${secondsString}:${milliString}`;
    }

    buttonLap.onclick = function() {lapFunc();}

    function lapFunc() {
        laps.push(displayTime());
        lapOL();
    }

    buttonClearLaps.onclick = function() {clearLapsFunc();}
    
    function clearLapsFunc() {
        laps.length = 0;
        lapOL();
    }

    function lapOL() {
        let list = document.createElement("ol");
        for (let i = 0; i < laps.length; i++) {
            let item = document.createElement("li");
            item.appendChild(document.createTextNode(laps[i]));
            list.appendChild(item);
        }
        lapsList.innerHTML = "";
        lapsList.appendChild(list);
    }

    buttonFreeze.onclick = function() {freezeFunc();}

    function freezeFunc() {
        freezeDisplay.innerHTML = ": " + displayTime();
    }

    function startTimer() {
        milli++;
        if (milli < 10) appendMilli.innerHTML = "0" + milli;
        else if (milli < 100) appendMilli.innerHTML = milli;
        else {
            seconds++;
            milli = 0;
            appendMilli.innerHTML = "00";
        }
        if (seconds == 0) appendSeconds.innerHTML = "00";
        else if (seconds < 10) appendSeconds.innerHTML = "0" + seconds;
        else if (seconds < 60) appendSeconds.innerHTML = seconds;
        else {
            seconds = 0;
            minutes++;
            appendSeconds.innerHTML = "00";
        }
        if (minutes == 0) appendMinutes.innerHTML = "";
        else if (minutes < 10) appendMinutes.innerHTML = "0" + minutes + ":";
        else appendMinutes.innerHTML = minutes + ":";
    }
}