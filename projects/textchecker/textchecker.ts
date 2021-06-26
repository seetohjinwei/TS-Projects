let tasks: string[] = [];
let buttonAddTask: HTMLElement;
let buttonRemoveTask: HTMLElement;
let taskDisplay: HTMLElement;

let userInput: HTMLInputElement;

window.onload = function(): void {
    const buttonPalindrome: HTMLElement = document.getElementById("button-palindrome");
    const palindromeDisplay: HTMLElement = document.getElementById("display-palindrome");

    userInput = <HTMLInputElement> document.getElementById("user-input");

    buttonPalindrome.onclick = function(): void {
        const input: string = userInput.value;
        const reverse: string = input.split("").reverse().join("");
        palindromeDisplay.innerHTML = `"${input}" is ${reverse == input ? "" : "not "}a palindrome!`;
    }

    document.getElementById("button-tasks-add").onclick = function(): void {
        const input: string = userInput.value;
        if (!input.match(/\S/)) return;
        tasks.push(input);
        userInput.value = "";
        taskDisplayFunc();
    };

    document.getElementById("button-tasks-remove").onclick = function(): void {
        const userRemove: HTMLInputElement = <HTMLInputElement> document.getElementById("user-remove");
        const input: string = userRemove.value;
        if (input.match(/^\d+$/)) {
            const indexToRemove: number = parseInt(input);
            tasks.splice(indexToRemove - 1, 1);
        } else if (input.match(/^\d+-\d+$/)) {
            const digits: string[] = input.split("-");
            const a: number = parseInt(digits[0]);
            const b: number = parseInt(digits[1]);
            tasks.splice(a - 1, b - a + 1);
        } else if (input.match(/^\d+-$/)) {
            const indexToRemove: number = parseInt(input.substr(0, input.length - 1));
            tasks.splice(indexToRemove - 1);
        } else if (input.match(/^-\d+$/)) {
            const numToRemove: number = parseInt(input.substr(1));
            tasks.splice(0, numToRemove);
        }
        userRemove.value = "";
        taskDisplayFunc();
    };

    document.getElementById("button-tasks-clear").onclick = function(): void {
        tasks = [];
        taskDisplayFunc();
    }

    taskDisplay = document.getElementById("display-tasks");
}

function taskDisplayFunc(): void {
    const ol = document.createElement("ol");
    for (let i = 0; i < tasks.length; i++) {
        const li: HTMLLIElement = document.createElement("li");
        const itemToAppend: HTMLSpanElement = document.createElement("span");
        itemToAppend.setAttribute("data-index", i.toString());
        if (tasks[i].startsWith("DONE~~~DEBUG")) {
            const text: string = tasks[i].substr(12)
            itemToAppend.innerHTML = `<span style="text-decoration:line-through"><em>${text}</em></span>`;
        } else {
            itemToAppend.onclick = function() { strikeThroughTask(<HTMLSpanElement> this); }
            itemToAppend.innerText = tasks[i];
        }
        li.appendChild(itemToAppend);
        ol.appendChild(li);
    }
    taskDisplay.innerHTML = "";
    taskDisplay.appendChild(ol);
}

function strikeThroughTask(item: HTMLSpanElement): void {
    const index: number = parseInt(item.getAttribute("data-index"));
    const text: string = item.innerText;
    item.innerHTML = `<span style="text-decoration:line-through"><em>${text}</em></span>`;
    item.onclick = function(): void { unstrikeTask(<HTMLSpanElement> this); };
    tasks[index] = "DONE~~~DEBUG" + tasks[index];
}

function unstrikeTask(item: HTMLSpanElement): void {
    const index: number = parseInt(item.getAttribute("data-index"));
    const text: string = item.innerText;
    item.innerHTML = `<span>${text}</span>`;
    item.onclick = function(): void { strikeThroughTask(<HTMLSpanElement> this); };
    tasks[index] = tasks[index].substr(12);
}