var tasks = [];
var buttonAddTask;
var buttonRemoveTask;
var taskDisplay;
var userInput;
window.onload = function () {
    var buttonPalindrome = document.getElementById("button-palindrome");
    var palindromeDisplay = document.getElementById("display-palindrome");
    userInput = document.getElementById("user-input");
    buttonPalindrome.onclick = function () {
        var input = userInput.value;
        var reverse = input.split("").reverse().join("");
        palindromeDisplay.innerHTML = "\"" + input + "\" is " + (reverse == input ? "" : "not ") + "a palindrome!";
    };
    document.getElementById("button-tasks-add").onclick = function () {
        var input = userInput.value;
        if (!input.match(/\S/))
            return;
        tasks.push(input);
        userInput.value = "";
        taskDisplayFunc();
    };
    document.getElementById("button-tasks-remove").onclick = function () {
        var userRemove = document.getElementById("user-remove");
        var input = userRemove.value;
        if (input.match(/^\d+$/)) {
            var indexToRemove = parseInt(input);
            tasks.splice(indexToRemove - 1, 1);
        }
        else if (input.match(/^\d+-\d+$/)) {
            var digits = input.split("-");
            var a = parseInt(digits[0]);
            var b = parseInt(digits[1]);
            tasks.splice(a - 1, b - a + 1);
        }
        else if (input.match(/^\d+-$/)) {
            var indexToRemove = parseInt(input.substr(0, input.length - 1));
            tasks.splice(indexToRemove - 1);
        }
        else if (input.match(/^-\d+$/)) {
            var numToRemove = parseInt(input.substr(1));
            tasks.splice(0, numToRemove);
        }
        userRemove.value = "";
        taskDisplayFunc();
    };
    document.getElementById("button-tasks-clear").onclick = function () {
        tasks = [];
        taskDisplayFunc();
    };
    taskDisplay = document.getElementById("display-tasks");
};
function taskDisplayFunc() {
    var ol = document.createElement("ol");
    for (var i = 0; i < tasks.length; i++) {
        var li = document.createElement("li");
        var itemToAppend = document.createElement("span");
        itemToAppend.setAttribute("data-index", i.toString());
        if (tasks[i].startsWith("DONE~~~DEBUG")) {
            var text = tasks[i].substr(12);
            itemToAppend.innerHTML = "<span style=\"text-decoration:line-through\"><em>" + text + "</em></span>";
        }
        else {
            itemToAppend.onclick = function () { strikeThroughTask(this); };
            itemToAppend.innerText = tasks[i];
        }
        li.appendChild(itemToAppend);
        ol.appendChild(li);
    }
    taskDisplay.innerHTML = "";
    taskDisplay.appendChild(ol);
}
function strikeThroughTask(item) {
    var index = parseInt(item.getAttribute("data-index"));
    var text = item.innerText;
    item.innerHTML = "<span style=\"text-decoration:line-through\"><em>" + text + "</em></span>";
    item.onclick = function () { };
    tasks[index] = "DONE~~~DEBUG" + tasks[index];
}
