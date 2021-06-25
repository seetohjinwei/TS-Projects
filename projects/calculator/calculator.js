let value = 0;
let stack = [];
let func = "";

window.onload = function() {
    let display = document.getElementById("input");
    let numbers = document.querySelectorAll(".numbers div");
    let opr = document.querySelectorAll(".operators div");
    let result = document.getElementById("result");
    let clear = document.getElementById("clear");

    document.addEventListener("keydown", function(press) {
        const key = press.key;
        if ("0123456789.".includes(key)) {
            stack.push(key);
            display.innerHTML = (func ? value + ` ${func} ` : "") + stack.join("");
        } else if (func && key == "Enter" || key == "=") {
            if (func == "+") value = value + currValue();
            else if (func == "-") value = value - currValue();
            else if (func == "*") value = value * currValue();
            else if (func == "/") value = value / currValue();
            func = "";
            stack = value.toString().split("");
            display.innerHTML = value;
        } else if (key == "Backspace") {
            stack.pop();
            display.innerHTML = stack.join("");
        } else if (key == "+") {
            value = currValue();
            display.innerHTML = value + " + ";
            func = "+";
        } else if (key == "-") {
            if (stack.length == 0) {
                stack.push("-");
                display.innerHTML = (func ? value + ` ${func} ` : "") + stack.join("");
            } else {
                value = currValue();
                display.innerHTML = value + " - ";
                func = "-";
            }
        } else if (key == "*") {
            value = currValue();
            display.innerHTML = value + " * ";
            func = "*";
        } else if (key == "/") {
            value = currValue();
            display.innerHTML = value + " / ";
            func = "/";
        } else if (key == "c") {
            stack = [];
            value = 0;
            display.innerHTML = 0;
            func = "";
        }
    })
}

function currValue() {
    const value = parseFloat(stack.join(""));
    stack = [];
    return value;
}