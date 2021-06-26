let value = 0;
let stack = [];
let func = "";

let display;

window.onload = function() {
    display = document.getElementById("input");

    document.querySelectorAll(".numbers div"  ).forEach(num => num.addEventListener('click', stackPush));
    document.querySelectorAll(".operators div").forEach(opr => opr.addEventListener('click', buttonOpr));

    document.getElementById("result").onclick = function() {buttonEnter();};
    document.getElementById("clear" ).onclick = function() {buttonClear();};

    document.addEventListener("keydown", function(press) {
        const key = press.key;
        // Override firefox quick search feature (search with "/")
        if      (key == "/")                   press.preventDefault();
        if      ("0123456789.".includes(key))  stackPush(key);
        else if (key == "Enter" || key == "=") buttonEnter();
        else if (key == "Backspace")           buttonDelete();
        else if ("+-*/".includes(key))         buttonOpr(key);
        else if (key == "c")                   buttonClear();
    })
}

function currValue() {
    const value = parseFloat(stack.join(""));
    stack = [];
    // treat all NaN as 0 (aka when stack == [] or ["."] or ["-"] or any other weird circumstance)
    return value || 0;
}

function stackPush(x) {
    if (typeof x != "string") x = x.target.innerHTML;
    stack.push(x);
    display.innerHTML = (func ? value + ` ${func} ` : "") + stack.join("");
}

function buttonEnter() {
    if      (func == "+") value = value + currValue();
    else if (func == "-") value = value - currValue();
    else if (func == "*") value = value * currValue();
    else if (func == "/") value = value / currValue();
    else                  return;
    func = "";
    if (value.toString() == "Infinity") {
        stack = [];
        value = 0;
        display.innerHTML = "Infinity (&#10135 by 0)";
    } else {
        stack = value.toString().split("");
        display.innerHTML = value;
    }
}

function buttonDelete() {
    stack.pop();
    display.innerHTML = (stack.length == 0) ? 0 : stack.join("");
}

function buttonOpr(key) {
    if (typeof key != "string") key = key.target.innerHTML;
    if (key == "BACK") {
        buttonDelete();
        return;
    }
    if (key == "-" && stack.length == 0) {
        stackPush("-");
        return;
    }
    value = currValue();
    display.innerHTML = value + ` ${key} `;
    func = key;
}

function buttonClear() {
    stack = [];
    value = 0;
    display.innerHTML = 0;
    func = "";
}