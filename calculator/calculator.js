window.onload = function () {
    document.querySelectorAll("#numbers").forEach(function (num) {
        var div = num;
        var value = div.innerText;
        div.onclick = function () { return stackPush(value); };
    });
    document.querySelectorAll("#operators").forEach(function (opr) {
        var div = opr;
        var value = div.innerText;
        div.onclick = function () { return buttonOpr(value); };
    });
    document.addEventListener("keydown", function (press) {
        var key = press.key;
        if (key === "/")
            press.preventDefault();
        if ("0123456789.".includes(key))
            stackPush(key);
        else if (key === "Enter" || key === "=")
            buttonResult.click();
        else if (key === "Backspace")
            buttonDelete();
        else if ("+-*/".includes(key))
            buttonOpr(key);
        else if (key === "c")
            buttonClear.click();
    });
};
var value = 0;
var stack = [];
var func = "";
var buttonResult = document.getElementById("result");
var buttonClear = document.getElementById("clear");
buttonResult.onclick = function () {
    if (func === "+")
        value = value + currValue();
    else if (func === "-")
        value = value - currValue();
    else if (func === "*")
        value = value * currValue();
    else if (func === "/")
        value = value / currValue();
    else
        return;
    func = "";
    if (value.toString() === "Infinity") {
        stack = [];
        value = 0;
        displayMessage("Infinity (&#10135 by 0)");
    }
    else {
        stack = value.toString().split("");
        displayMessage(value.toString());
    }
};
buttonClear.onclick = function () {
    stack = [];
    value = 0;
    displayMessage("0");
    func = "";
};
function currValue() {
    var value = parseFloat(stack.join(""));
    stack = [];
    return value || 0;
}
function stackPush(x) {
    stack.push(x);
    displayMessage((func ? value + " " + func + " " : "") + stack.join(""));
}
function buttonDelete() {
    stack.pop();
    displayMessage(stack.length === 0 ? "0" : stack.join(""));
}
function buttonOpr(key) {
    if (key === "BACK") {
        buttonDelete();
        return;
    }
    if (key === "-" && stack.length === 0) {
        stackPush("-");
        return;
    }
    value = currValue();
    displayMessage(value + " " + key + " ");
    func = key;
}
function displayMessage(message) {
    var display = document.getElementById("input");
    display.innerHTML = message;
}
