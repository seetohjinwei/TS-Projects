var tasks = [];
var buttonAddTask;
var buttonRemoveTask;
var taskDisplay;
var userInput;
var browserImport;
Storage.prototype.setTasks = function (obj) {
    return this.setItem("tasks", JSON.stringify(obj));
};
Storage.prototype.getTasks = function () {
    return JSON.parse(this.getItem("tasks"));
};
window.onload = function () {
    userInput = document.getElementById("user-input");
    taskDisplay = document.getElementById("display-tasks");
    tasks = localStorage.getTasks() || [];
    taskDisplayFunc();
    document.getElementById("button-tasks-add").onclick = function () {
        addFunc();
    };
    userInput.addEventListener('keypress', function (press) {
        if (press.key == "Enter")
            addFunc();
    });
    document.getElementById("button-tasks-remove").onclick = function () {
        removeFunc();
    };
    document.getElementById("user-remove").addEventListener('keypress', function (press) {
        if (press.key == "Enter")
            removeFunc();
    });
    document.getElementById("button-tasks-clear").onclick = function () {
        if (confirm("Clear all?")) {
            tasks = [];
            taskDisplayFunc();
        }
    };
    document.getElementById("button-tasks-save").onclick = function () {
        saveFunc();
    };
    document.getElementById("button-tasks-recover").onclick = function () {
        recoverFunc();
    };
    browserImport = document.getElementById("browser-import");
    document.getElementById("button-tasks-export").onclick = function () {
        browserImport.value = encodeTasks();
        browserImport.select();
    };
    document.getElementById("button-tasks-import").onclick = function () {
        decodeTasks(browserImport.value);
        browserImport.value = "";
    };
};
window.onbeforeunload = function () {
    console.log("detected refresh");
    saveFunc();
};
function saveFunc() {
    localStorage.setTasks(tasks);
    taskDisplayFunc();
}
function recoverFunc() {
    tasks = localStorage.getTasks();
    taskDisplayFunc();
}
function addFunc() {
    var input = userInput.value;
    var sanitisedInput = input.replaceAll(/;/g, "");
    if (!sanitisedInput.match(/\S/))
        return;
    tasks.push([sanitisedInput, false]);
    userInput.value = "";
    taskDisplayFunc();
}
function removeFunc() {
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
}
function taskDisplayFunc() {
    var ol = document.createElement("ol");
    var _loop_1 = function (i) {
        var li = document.createElement("li");
        var binIcon = document.createElement("span");
        binIcon.innerHTML = "&#128465";
        binIcon.onclick = function () { deleteThisTask(i); };
        li.appendChild(binIcon);
        var emptySpace = document.createElement("span");
        emptySpace.innerText = " ";
        li.appendChild(emptySpace);
        var taskToAppend = document.createElement("span");
        taskToAppend.setAttribute("data-index", i.toString());
        taskToAppend.innerText = tasks[i][0];
        if (tasks[i][1])
            strikeThroughTask(taskToAppend);
        else
            unstrikeTask(taskToAppend);
        li.appendChild(taskToAppend);
        ol.appendChild(li);
    };
    for (var i = 0; i < tasks.length; i++) {
        _loop_1(i);
    }
    taskDisplay.innerHTML = "";
    taskDisplay.appendChild(ol);
}
function strikeThroughTask(item) {
    var index = parseInt(item.getAttribute("data-index"));
    var text = item.innerText;
    item.innerHTML = "<span style=\"text-decoration:line-through\"><em>" + text + "</em></span>";
    item.onclick = function () { unstrikeTask(this); };
    tasks[index][1] = true;
}
function unstrikeTask(item) {
    var index = parseInt(item.getAttribute("data-index"));
    var text = item.innerText;
    item.innerHTML = "<span>" + text + "</span>";
    item.onclick = function () { strikeThroughTask(this); };
    tasks[index][1] = false;
}
function deleteThisTask(index) {
    tasks.splice(index, 1);
    taskDisplayFunc();
}
function encodeTasks() {
    var tasksEncoded = [];
    for (var i = 0; i < tasks.length; i++) {
        var item = tasks[i][0];
        var done = tasks[i][1] ? "1" : "0";
        tasksEncoded.push(done + item);
    }
    return tasksEncoded.join(";");
}
function decodeTasks(hash) {
    if (!hash.match(/^[01][^;]+(;[01][^;]+)*$/))
        return;
    var tasksEncoded = hash.split(";");
    tasks = [];
    for (var i = 0; i < tasksEncoded.length; i++) {
        var item = tasksEncoded[i].substr(1);
        var done = !!(tasksEncoded[i].substr(0, 1) == "1");
        tasks.push([item, done]);
    }
    saveFunc();
}
