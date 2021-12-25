var Task = (function () {
    function Task(name, done) {
        var _this = this;
        if (done === void 0) { done = false; }
        this.name = name;
        this.done = done;
        var bin = document.createElement("span");
        bin.innerText = String.fromCodePoint(128465);
        bin.onclick = function () { return _this["delete"](); };
        var space = document.createElement("span");
        space.innerText = " ";
        var display = document.createElement("span");
        display.innerText = this.name;
        display.onclick = function () {
            if (_this.done)
                _this.unstrike();
            else
                _this.strike();
        };
        this.element = document.createElement("li");
        this.element.append(bin, space, display);
        if (this.done)
            this.strike();
    }
    Task.prototype["delete"] = function () {
        tasks["delete"](this);
    };
    Task.prototype.strike = function () {
        this.element.style.textDecoration = "line-through";
        this.done = true;
    };
    Task.prototype.unstrike = function () {
        this.element.style.textDecoration = null;
        this.done = false;
    };
    return Task;
}());
var Tasks = (function () {
    function Tasks() {
        this.list = [];
        this.retrieveLocal();
        this.display = document.getElementById("display-tasks");
    }
    Tasks.prototype.add = function (name) {
        var task = new Task(name);
        this.list.push(task);
        this.display.appendChild(task.element);
    };
    Tasks.prototype.deleteByIndex = function (start, end) {
        if (end === void 0) { end = start + 1; }
        end = Math.min(end, this.list.length + 1);
        for (var index = start; index < end; index++) {
            var task = this.list[start - 1];
            this["delete"](task);
        }
    };
    Tasks.prototype["delete"] = function (task) {
        var index = this.list.indexOf(task);
        this.list.splice(index, 1);
        this.display.removeChild(task.element);
    };
    Tasks.prototype.clear = function () {
        this.list = [];
        this.refresh();
    };
    Tasks.prototype.refresh = function () {
        var _this = this;
        while (this.display.hasChildNodes()) {
            this.display.removeChild(this.display.firstChild);
        }
        this.list.forEach(function (task) { return _this.display.appendChild(task.element); });
    };
    Tasks.prototype.retrieveLocal = function () {
        var result = [];
        var arr = JSON.parse(localStorage.getItem("tasks")) || [];
        for (var index = 0; index < arr.length; index++) {
            var obj = arr[index];
            var name_1 = obj["name"];
            var done = obj["done"];
            var task = new Task(name_1, done);
            result.push(task);
        }
        this.list = result;
    };
    return Tasks;
}());
var Button = (function () {
    function Button() {
    }
    Button.add = function () {
        var input = Input.input.value;
        var sanitisedInput = input.replaceAll(/;/g, "");
        if (!sanitisedInput.match(/\S/))
            return;
        tasks.add(sanitisedInput);
        Input.input.value = "";
    };
    Button.remove = function () {
        var input = Input.remove.value;
        if (input.match(/^\d+$/)) {
            var index = parseInt(input);
            tasks.deleteByIndex(index);
        }
        else if (input.match(/^\d+-\d+$/)) {
            var digits = input.split("-");
            var start = parseInt(digits[0]);
            var end = parseInt(digits[1]);
            tasks.deleteByIndex(start, end + 1);
        }
        else if (input.match(/^\d+-$/)) {
            var index = parseInt(input.substr(0, input.length - 1));
            tasks.deleteByIndex(index, tasks.list.length + 1);
        }
        else if (input.match(/^-\d+$/)) {
            var index = parseInt(input.substr(1));
            tasks.deleteByIndex(1, index + 1);
        }
        else
            return;
        Input.remove.value = "";
    };
    Button.clear = function () {
        if (confirm("Clear all?")) {
            tasks.clear();
        }
    };
    Button.save = function () {
        localStorage.setItem("tasks", JSON.stringify(tasks.list));
    };
    Button.recover = function () {
        tasks.retrieveLocal();
        tasks.refresh();
    };
    Button["import"] = function () {
        var hash = this.browserImport.value;
        if (!hash.match(/^[01][^;]+(;[01][^;]+)*$/))
            return;
        var tasksEncoded = hash.split(";");
        tasks.clear();
        for (var i = 0; i < tasksEncoded.length; i++) {
            var item = tasksEncoded[i].substr(1);
            var done = tasksEncoded[i].substr(0, 1) === "1";
            var task = new Task(item, done);
            tasks.list.push(task);
        }
        this.browserImport.value = "";
        Button.save();
        tasks.refresh();
    };
    Button["export"] = function () {
        var tasksEncoded = [];
        for (var i = 0; i < tasks.list.length; i++) {
            var item = tasks.list[i].name;
            var done = tasks.list[i].done ? "1" : "0";
            tasksEncoded.push(done + item);
        }
        this.browserImport.value = tasksEncoded.join(";");
        this.browserImport.select();
    };
    Button.browserImport = (document.getElementById("browser-import"));
    return Button;
}());
var Input = (function () {
    function Input() {
    }
    Input.input = document.getElementById("user-input");
    Input.remove = document.getElementById("user-remove");
    return Input;
}());
var tasks = new Tasks();
window.onload = function () {
    tasks.refresh();
    displayInfo();
    document.addEventListener("keypress", function (press) {
        if (press.key !== "Enter")
            return;
        if (Input.input.value !== "")
            Button.add();
        if (Input.remove.value !== "")
            Button.remove();
    });
};
window.onbeforeunload = Button.save;
function displayInfo() {
    var infoDisplay = document.getElementById("display-info");
    var toggleInfo = (document.getElementById("display-toggle-text"));
    var button = (document.getElementById("button-toggle-info"));
    button.onclick = function () {
        if (infoDisplay.hidden) {
            toggleInfo.innerText = "Hide";
            infoDisplay.hidden = false;
        }
        else {
            toggleInfo.innerText = "Show";
            infoDisplay.hidden = true;
        }
    };
}
