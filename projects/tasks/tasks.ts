// task = ["Task", markAsDone]
type task = [string, boolean];
let tasks: task[] = [];
let buttonAddTask: HTMLElement;
let buttonRemoveTask: HTMLElement;
let taskDisplay: HTMLElement;

let userInput: HTMLInputElement;
let browserImport: HTMLInputElement;

// https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage
Storage.prototype.setTasks = function(obj: task[]): string {
    return this.setItem("tasks", JSON.stringify(obj))
}
Storage.prototype.getTasks = function(): task[] {
    return JSON.parse(this.getItem("tasks"))
}

window.onload = function(): void {
    userInput = <HTMLInputElement> document.getElementById("user-input");
    taskDisplay = document.getElementById("display-tasks");
    tasks = localStorage.getTasks() || [];
    taskDisplayFunc();

    document.getElementById("button-tasks-add").onclick = function(): void {
        addFunc();
    };

    userInput.addEventListener('keypress', function(press) {
        if (press.key == "Enter") addFunc();
    });

    document.getElementById("button-tasks-remove").onclick = function(): void {
        removeFunc();
    };

    document.getElementById("user-remove").addEventListener('keypress', function(press) {
        if (press.key == "Enter") removeFunc();
    });

    document.getElementById("button-tasks-clear").onclick = function(): void {
        if (confirm("Clear all?")) {
            tasks = [];
            taskDisplayFunc();
        }
    };

    document.getElementById("button-tasks-save").onclick = function (): void {
        saveFunc();
    };

    document.getElementById("button-tasks-recover").onclick = function(): void {
        recoverFunc();
    };

    browserImport = <HTMLInputElement> document.getElementById("browser-import");

    document.getElementById("button-tasks-export").onclick = function(): void {
        browserImport.value = encodeTasks();
        browserImport.select();
    };

    document.getElementById("button-tasks-import").onclick = function(): void {
        decodeTasks(browserImport.value);
        browserImport.value = "";
    };
}

window.onbeforeunload = function(): void {
    console.log("detected refresh")
    saveFunc();
}

function saveFunc():void {
    localStorage.setTasks(tasks);
    taskDisplayFunc();
}

function recoverFunc(): void {
    tasks = localStorage.getTasks();
    taskDisplayFunc();
}

function addFunc(): void {
    const input: string = userInput.value;
    const sanitisedInput: string = input.replaceAll(/;/g, "");
    if (!sanitisedInput.match(/\S/)) return;
    tasks.push([sanitisedInput, false]);
    userInput.value = "";
    taskDisplayFunc();
}

function removeFunc(): void {
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
}

function taskDisplayFunc(): void {
    const ol = document.createElement("ol");
    for (let i = 0; i < tasks.length; i++) {
        const li: HTMLLIElement = document.createElement("li");

        const binIcon: HTMLSpanElement = document.createElement("span");
        binIcon.innerHTML = "&#128465";
        binIcon.onclick = function():void { deleteThisTask(i) };
        li.appendChild(binIcon);

        const emptySpace: HTMLSpanElement = document.createElement("span");
        emptySpace.innerText = " ";
        li.appendChild(emptySpace);

        const taskToAppend: HTMLSpanElement = document.createElement("span");
        taskToAppend.setAttribute("data-index", i.toString());
        taskToAppend.innerText = tasks[i][0];
        if (tasks[i][1]) strikeThroughTask(taskToAppend);
        else             unstrikeTask(taskToAppend);
        li.appendChild(taskToAppend);

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
    tasks[index][1] = true;
}

function unstrikeTask(item: HTMLSpanElement): void {
    const index: number = parseInt(item.getAttribute("data-index"));
    const text: string = item.innerText;
    item.innerHTML = `<span>${text}</span>`;
    item.onclick = function(): void { strikeThroughTask(<HTMLSpanElement> this); };
    tasks[index][1] = false;
}

function deleteThisTask(index: number): void {
    tasks.splice(index, 1);
    taskDisplayFunc();
}

function encodeTasks(): string {
    const tasksEncoded: string[] = [];
    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i][0];
        const done = tasks[i][1] ? "1" : "0";
        tasksEncoded.push(done + item);
    }
    return tasksEncoded.join(";");
}

function decodeTasks(hash: string): void {
    if (!hash.match(/^[01][^;]+(;[01][^;]+)*$/)) return;
    const tasksEncoded: string[] = hash.split(";");
    tasks = [];
    for (let i = 0; i < tasksEncoded.length; i++) {
        const item = tasksEncoded[i].substr(1);
        const done = !!(tasksEncoded[i].substr(0, 1) == "1");
        tasks.push([item, done]);
    }
    saveFunc();
}