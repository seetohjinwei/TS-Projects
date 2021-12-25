window.onload = () => {
    document.querySelectorAll("#numbers").forEach((num) => {
        const div: HTMLDivElement = <HTMLDivElement>num;
        const value: string = div.innerText;
        div.onclick = () => stackPush(value);
    });

    document.querySelectorAll("#operators").forEach((opr) => {
        const div: HTMLDivElement = <HTMLDivElement>opr;
        const value: string = div.innerText;
        div.onclick = () => buttonOpr(value);
    });

    document.addEventListener("keydown", (press: KeyboardEvent) => {
        const key: string = press.key;
        // Override firefox quick search feature (search with "/")
        if (key === "/") press.preventDefault();
        if ("0123456789.".includes(key)) stackPush(key);
        else if (key === "Enter" || key === "=") buttonResult.click();
        else if (key === "Backspace") buttonDelete();
        else if ("+-*/".includes(key)) buttonOpr(key);
        else if (key === "c") buttonClear.click();
    });
};

let value: number = 0;
let stack: string[] = [];
let func: string = "";

const buttonResult: HTMLButtonElement = <HTMLButtonElement>document.getElementById("result");
const buttonClear: HTMLButtonElement = <HTMLButtonElement>document.getElementById("clear");

buttonResult.onclick = () => {
    if (func === "+") value = value + currValue();
    else if (func === "-") value = value - currValue();
    else if (func === "*") value = value * currValue();
    else if (func === "/") value = value / currValue();
    else return;
    func = "";
    if (value.toString() === "Infinity") {
        stack = [];
        value = 0;
        displayMessage("Infinity (&#10135 by 0)");
    } else {
        stack = value.toString().split("");
        displayMessage(value.toString());
    }
};

buttonClear.onclick = () => {
    stack = [];
    value = 0;
    displayMessage("0");
    func = "";
};

function currValue(): number {
    const value = parseFloat(stack.join(""));
    stack = [];
    // treat all NaN as 0 (aka when stack === [] or ["."] or ["-"] or any other weird circumstance)
    return value || 0;
}

function stackPush(x: string): void {
    stack.push(x);
    displayMessage((func ? `${value} ${func} ` : "") + stack.join(""));
}

function buttonDelete(): void {
    stack.pop();
    displayMessage(stack.length === 0 ? "0" : stack.join(""));
}

function buttonOpr(key: string): void {
    if (key === "BACK") {
        buttonDelete();
        return;
    }
    if (key === "-" && stack.length === 0) {
        stackPush("-");
        return;
    }
    value = currValue();
    displayMessage(`${value} ${key} `);
    func = key;
}

function displayMessage(message: string): void {
    const display: HTMLDivElement = <HTMLDivElement>document.getElementById("input");
    display.innerHTML = message;
}
