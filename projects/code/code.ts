const snippets: {[name: string]: (string | boolean)[]} = {
    "function": ["def ", true, "(", true, "):\n\tpass"],
    "str": [true, ": str = \"", true, "\""],
};

const select: HTMLSelectElement = <HTMLSelectElement> document.getElementById("select");

for (const key in snippets) {
    const option: HTMLOptionElement = document.createElement("option");
    option.text = key;
    option.value = key;
    select.appendChild(option);
}

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
    let count: number = 0;
    const reference: (string | boolean)[] = snippets[option];
    const parameters: (string | HTMLInputElement)[] = [];
    
    for (let i = 0; i < reference.length; i++) {
        const parameter: string | boolean = reference[i];
        if (parameter !== true) {
            parameters.push(<string> parameter);
        } else {
            count++;
            const inputElement: HTMLInputElement = document.createElement("input");
            span.appendChild(inputElement);
            parameters.push(inputElement);
        }
    }
    
    const buttonGenerate: HTMLButtonElement = <HTMLButtonElement> document.getElementById("button-generate");
    buttonGenerate.hidden = false;
    buttonGenerate.onclick = () => {
        generateCode(parameters);
        while (span.hasChildNodes()) {
            span.removeChild(span.firstChild);
        }
        buttonGenerate.hidden = true;
    };
}

function generateCode(paramters: (string | HTMLInputElement)[]): void {
    let output: string = "";
    paramters.forEach((parameter: string | HTMLInputElement) => {
        if (typeof parameter === "string") {
            output += <string> parameter;
        } else {
            const value: string = (<HTMLInputElement> parameter).value;
            output += value;
        }
    });
    displayOutput(output);
}

function displayOutput(value: string): void {
    const output: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("display");
    output.rows = (value.match(/\n/g) || []).length + 1;
    output.textContent = value;
}