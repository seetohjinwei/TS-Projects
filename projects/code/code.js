var snippets = {
    "function": ["def ", true, "(", true, "):\n\tpass"],
    "str": [true, ": str = \"", true, "\""]
};
var select = document.getElementById("select");
for (var key in snippets) {
    var option = document.createElement("option");
    option.text = key;
    option.value = key;
    select.appendChild(option);
}
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
    var count = 0;
    var reference = snippets[option];
    var parameters = [];
    for (var i = 0; i < reference.length; i++) {
        var parameter = reference[i];
        if (parameter !== true) {
            parameters.push(parameter);
        }
        else {
            count++;
            var inputElement = document.createElement("input");
            span.appendChild(inputElement);
            parameters.push(inputElement);
        }
    }
    var buttonGenerate = document.getElementById("button-generate");
    buttonGenerate.hidden = false;
    buttonGenerate.onclick = function () {
        generateCode(parameters);
        while (span.hasChildNodes()) {
            span.removeChild(span.firstChild);
        }
        buttonGenerate.hidden = true;
    };
}
function generateCode(paramters) {
    var output = "";
    paramters.forEach(function (parameter) {
        if (typeof parameter === "string") {
            output += parameter;
        }
        else {
            var value = parameter.value;
            output += value;
        }
    });
    displayOutput(output);
}
function displayOutput(value) {
    var output = document.getElementById("display");
    output.rows = (value.match(/\n/g) || []).length + 1;
    output.textContent = value;
}
