window.onload = function () {
    var infoDisplay = document.getElementById("display-info");
    var toggleInfo = document.getElementById("display-toggle-text");
    infoDisplay.style.display = "none";
    document.getElementById("button-toggle-info").onclick = function () {
        if (toggleInfo.innerHTML === "Show") {
            toggleInfo.innerText = "Hide";
            infoDisplay.style.display = "block";
        }
        else {
            toggleInfo.innerText = "Show";
            infoDisplay.style.display = "none";
        }
    };
};
var snippets = {
    "Python function": ["def ", false, "(", true, "):\n\tpass"],
    "Python str": [false, ": str = \"", true, "\""],
    "Java print": ["System.out.println(", false, ");"],
    "CPP cout": ["cout << ", false, ";"],
    "TypeScript Function": ["function ", true, "(", true, ")", true, " {\n\t", true, "\n}"]
};
var select = document.getElementById("select");
for (var key in snippets) {
    var option = document.createElement("option");
    option.text = key;
    option.value = key;
    select.appendChild(option);
}
var buttonAdd = document.getElementById("button-add");
buttonAdd.onclick = function () {
    var text = textArea();
    var indexToSplit = text.indexOf("\n");
    var key = text.substring(0, indexToSplit);
    var content = text.substring(indexToSplit + 1);
    if (key === "" || content === "")
        return;
    var table = { "\\t": "\t", "\\n": "\n" };
    var parameters = content.replace(/\\[tn]/g, function (c) { return table[c]; }).split(".{");
    var value = [];
    parameters.forEach(function (parameter) {
        if (parameter.startsWith("true}")) {
            value.push(true);
            parameter = parameter.substring(5);
        }
        else if (parameter.startsWith("false}")) {
            value.push(false);
            parameter = parameter.substring(6);
        }
        if (!parameter)
            return;
        value.push(parameter);
    });
    if (!(key in snippets)) {
        var option = document.createElement("option");
        option.text = key;
        option.value = key;
        select.appendChild(option);
    }
    snippets[key] = value;
};
var buttonSelect = document.getElementById("button-select");
buttonSelect.onclick = function () {
    if (select.selectedIndex === 0)
        return;
    var value = select.value;
    select.selectedIndex = 0;
    main(value);
};
function main(option) {
    var span = document.getElementById("parameters");
    while (span.hasChildNodes()) {
        span.removeChild(span.firstChild);
    }
    var reference = snippets[option];
    var parameters = [];
    for (var i = 0; i < reference.length; i++) {
        var parameter = reference[i];
        if (typeof parameter === "string") {
            var string = parameter;
            parameters.push(string);
        }
        else {
            var inputElement = document.createElement("textarea");
            inputElement.cols = 10;
            inputElement.rows = 2;
            var optional = parameter ? "true" : "false";
            inputElement.setAttribute("optional", optional);
            span.appendChild(inputElement);
            parameters.push(inputElement);
        }
    }
    var buttonGenerate = document.getElementById("button-generate");
    buttonGenerate.hidden = false;
    buttonGenerate.onclick = function () {
        var done = generateCode(parameters);
        if (!done)
            return;
        while (span.hasChildNodes()) {
            span.removeChild(span.firstChild);
        }
        buttonGenerate.hidden = true;
    };
}
function generateCode(paramters) {
    var output = "";
    var _loop_1 = function (i) {
        var parameter = paramters[i];
        if (typeof parameter === "string") {
            output += parameter;
        }
        else {
            parameter = parameter;
            var value = parameter.value;
            var table_1 = { "\\t": "\t", "\\n": "\n" };
            var text = value.replace(/\\[tn]/g, function (c) { return table_1[c]; });
            var optional = parameter.getAttribute("optional") === "true";
            if (!optional && value === "")
                return { value: false };
            output += text;
        }
    };
    for (var i = 0; i < paramters.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    textArea(output);
    return true;
}
function textArea(message) {
    var output = document.getElementById("display");
    if (message === undefined) {
        var res = output.value;
        output.value = "";
        return res;
    }
    output.rows = (message.match(/\n/g) || []).length + 1;
    output.value = message;
    return message;
}
function displayMessage(message) {
    var display = document.getElementById("display-message");
    display.innerText = message;
}
