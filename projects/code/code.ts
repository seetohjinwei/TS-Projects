window.onload = () => {
    // displayinfo
    const infoDisplay: HTMLDivElement = <HTMLDivElement> document.getElementById("display-info");
    const toggleInfo: HTMLSpanElement = <HTMLSpanElement> document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
    document.getElementById("button-toggle-info").onclick = () => {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        } else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    };
};

const snippets: {[name: string]: (string | boolean)[]} = {
    "Python function": ["def ", false, "(", true, "):\n\tpass"],
    "Python str": [false, ": str = \"", true, "\""],
    "Java print": ["System.out.println(", false, ");"],
    "CPP cout": ["cout << ", false, ";"],
    "TypeScript Function": ["function ", true, "(", true, ")", true, " {\n\t", true, "\n}"],
};

const select: HTMLSelectElement = <HTMLSelectElement> document.getElementById("select");

for (const key in snippets) {
    const option: HTMLOptionElement = document.createElement("option");
    option.text = key;
    option.value = key;
    select.appendChild(option);
}

const buttonAdd: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-add");
buttonAdd.onclick = () => {
    const text: string = textArea();
    const indexToSplit: number = text.indexOf("\n");
    const key: string = text.substring(0, indexToSplit);
    const content: string = text.substring(indexToSplit + 1);
    if (key === "" || content === "") return;
    const table: {[literal: string]: string} = {"\\t": "\t", "\\n": "\n"};
    const parameters: string[] = content.replace(/\\[tn]/g, (c: string) => table[c]).split(".{");
    const value: (string | boolean)[] = [];
    parameters.forEach(parameter => {
        if (parameter.startsWith("true}")) {
            value.push(true);
            parameter = parameter.substring(5);
        } else if (parameter.startsWith("false}")) {
            value.push(false);
            parameter = parameter.substring(6);
        }
        if (!parameter) return;
        value.push(parameter);
    });
    if (!(key in snippets)) {
        const option: HTMLOptionElement = document.createElement("option");
        option.text = key;
        option.value = key;
        select.appendChild(option);
    }
    snippets[key] = value;
};

const buttonSelect: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-select");
buttonSelect.onclick = () => {
    if (select.selectedIndex === 0) return;
    const value: string = select.value;
    select.selectedIndex = 0;
    main(value);
};

function main(option: string): void {
    const span: HTMLSpanElement = <HTMLSpanElement> document.getElementById("parameters");
    while (span.hasChildNodes()) {
        span.removeChild(span.firstChild);
    }
    const reference: (string | boolean)[] = snippets[option];
    const parameters: (string | HTMLTextAreaElement)[] = [];
    
    for (let i = 0; i < reference.length; i++) {
        const parameter: string | boolean = reference[i];
        if (typeof parameter === "string") {
            const string: string = <string> parameter;
            parameters.push(string);
        } else {
            const inputElement: HTMLTextAreaElement = document.createElement("textarea");
            inputElement.cols = 10;
            inputElement.rows = 2;
            const optional: string = <boolean> parameter ? "true" : "false";
            inputElement.setAttribute("optional", optional);
            span.appendChild(inputElement);
            parameters.push(inputElement);
        }
    }
    
    const buttonGenerate: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-generate");
    buttonGenerate.hidden = false;
    buttonGenerate.onclick = () => {
        const done: boolean = generateCode(parameters);
        if (!done) return;
        while (span.hasChildNodes()) {
            span.removeChild(span.firstChild);
        }
        buttonGenerate.hidden = true;
    };
}

function generateCode(paramters: (string | HTMLTextAreaElement)[]): boolean {
    let output: string = "";
    for (let i = 0; i < paramters.length; i++) {
        let parameter: string | HTMLTextAreaElement = paramters[i];
        if (typeof parameter === "string") {
            output += <string> parameter;
        } else {
            parameter = <HTMLTextAreaElement> parameter;
            const value: string = parameter.value;
            const table: {[literal: string]: string} = {"\\t": "\t", "\\n": "\n"};
            const text: string = value.replace(/\\[tn]/g, (c: string) => table[c]);
            const optional: boolean = parameter.getAttribute("optional") === "true";
            if (!optional && value === "") return false;
            output += text;
        }
    }
    textArea(output);
    return true;
}

function textArea(message?: string): string {
    const output: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("display");
    if (message === undefined) {
        const res: string = output.value;
        output.value = "";
        return res;
    }
    output.rows = (message.match(/\n/g) || []).length + 1;
    output.value = message;
    return message;
}

function displayMessage(message: string): void {
    const display: HTMLDivElement = <HTMLDivElement> document.getElementById("display-message");
    display.innerText = message;
}