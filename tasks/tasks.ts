class Task {
    name: string;
    done: boolean;
    element: HTMLLIElement;

    constructor(name: string, done: boolean = false) {
        this.name = name;
        this.done = done;

        const bin: HTMLSpanElement = document.createElement("span");
        bin.innerText = String.fromCodePoint(128465);
        bin.onclick = () => this.delete();

        const space: HTMLSpanElement = document.createElement("span");
        space.innerText = " ";

        const display: HTMLSpanElement = document.createElement("span");
        display.innerText = this.name;
        display.onclick = () => {
            if (this.done) this.unstrike();
            else this.strike();
        };

        this.element = document.createElement("li");
        this.element.append(bin, space, display);
        if (this.done) this.strike();
    }

    delete(): void {
        tasks.delete(this);
    }

    strike(): void {
        this.element.style.textDecoration = "line-through";
        this.done = true;
    }

    unstrike(): void {
        this.element.style.textDecoration = null;
        this.done = false;
    }
}

class Tasks {
    list: Task[];
    display: HTMLOListElement;

    constructor() {
        this.list = [];
        this.retrieveLocal();
        this.display = <HTMLOListElement>document.getElementById("display-tasks");
    }

    add(name: string): void {
        const task: Task = new Task(name);
        this.list.push(task);
        this.display.appendChild(task.element);
    }

    /**
     * @param start start index
     * @param end inclusive of the end index
     */
    deleteByIndex(start: number, end: number = start + 1): void {
        end = Math.min(end, this.list.length + 1);
        for (let index = start; index < end; index++) {
            const task: Task = this.list[start - 1];
            this.delete(task);
        }
    }

    delete(task: Task): void {
        const index: number = this.list.indexOf(task);
        this.list.splice(index, 1);
        this.display.removeChild(task.element);
    }

    clear(): void {
        this.list = [];
        this.refresh();
    }

    refresh(): void {
        while (this.display.hasChildNodes()) {
            this.display.removeChild(this.display.firstChild);
        }
        this.list.forEach((task) => this.display.appendChild(task.element));
    }

    retrieveLocal(): void {
        const result: Task[] = [];
        const arr: { [parameter: string]: any }[] = JSON.parse(localStorage.getItem("tasks")) || [];
        for (let index = 0; index < arr.length; index++) {
            const obj = arr[index];
            const name: string = obj["name"];
            const done: boolean = obj["done"];
            const task = new Task(name, done);
            result.push(task);
        }
        this.list = result;
    }
}

class Button {
    static add(): void {
        const input: string = Input.input.value;
        const sanitisedInput: string = input.replaceAll(/;/g, "");
        if (!sanitisedInput.match(/\S/)) return;
        tasks.add(sanitisedInput);
        Input.input.value = "";
    }

    static remove(): void {
        const input: string = Input.remove.value;
        if (input.match(/^\d+$/)) {
            const index: number = parseInt(input);
            tasks.deleteByIndex(index);
        } else if (input.match(/^\d+-\d+$/)) {
            const digits: string[] = input.split("-");
            const start: number = parseInt(digits[0]);
            const end: number = parseInt(digits[1]);
            tasks.deleteByIndex(start, end + 1);
        } else if (input.match(/^\d+-$/)) {
            const index: number = parseInt(input.substr(0, input.length - 1));
            tasks.deleteByIndex(index, tasks.list.length + 1);
        } else if (input.match(/^-\d+$/)) {
            const index: number = parseInt(input.substr(1));
            tasks.deleteByIndex(1, index + 1);
        } else return;
        Input.remove.value = "";
    }

    static clear(): void {
        if (confirm("Clear all?")) {
            tasks.clear();
        }
    }

    static save(): void {
        localStorage.setItem("tasks", JSON.stringify(tasks.list));
    }

    static recover(): void {
        tasks.retrieveLocal();
        tasks.refresh();
    }

    private static browserImport: HTMLInputElement = <HTMLInputElement>(
        document.getElementById("browser-import")
    );

    static import(): void {
        const hash: string = this.browserImport.value;
        if (!hash.match(/^[01][^;]+(;[01][^;]+)*$/)) return;
        const tasksEncoded: string[] = hash.split(";");
        tasks.clear();
        for (let i = 0; i < tasksEncoded.length; i++) {
            const item = tasksEncoded[i].substr(1);
            const done = tasksEncoded[i].substr(0, 1) === "1";
            const task: Task = new Task(item, done);
            tasks.list.push(task);
        }
        this.browserImport.value = "";
        Button.save();
        tasks.refresh();
    }

    static export(): void {
        const tasksEncoded: string[] = [];
        for (let i = 0; i < tasks.list.length; i++) {
            const item = tasks.list[i].name;
            const done = tasks.list[i].done ? "1" : "0";
            tasksEncoded.push(done + item);
        }
        this.browserImport.value = tasksEncoded.join(";");
        this.browserImport.select();
    }
}

class Input {
    static input: HTMLInputElement = <HTMLInputElement>document.getElementById("user-input");
    static remove: HTMLInputElement = <HTMLInputElement>document.getElementById("user-remove");
}

const tasks: Tasks = new Tasks();

window.onload = () => {
    tasks.refresh();
    displayInfo();

    document.addEventListener("keypress", (press) => {
        if (press.key !== "Enter") return;
        if (Input.input.value !== "") Button.add();
        if (Input.remove.value !== "") Button.remove();
    });
};

window.onbeforeunload = Button.save;

function displayInfo(): void {
    const infoDisplay: HTMLUListElement = <HTMLUListElement>document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement>(
        document.getElementById("display-toggle-text")
    );
    const button: HTMLButtonElement = <HTMLButtonElement>(
        document.getElementById("button-toggle-info")
    );
    button.onclick = function (): void {
        if (infoDisplay.hidden) {
            toggleInfo.innerText = "Hide";
            infoDisplay.hidden = false;
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.hidden = true;
        }
    };
}
