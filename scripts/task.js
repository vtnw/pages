var u = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));;
var cacheName = "task" + u;
var indexName = "index" + cacheName + u;
var taskList = [];
var options = {};
var today;

//events
document.getElementById("btnAdd").addEventListener("click", function () {
    addTask();
})

//functions
function initialize() {
    today = new Date();
    today.setHours(0, 0, 0, 0);
    var cache = getCache();
    taskList = cache.taskList;
    options = cache.options;
    loadTaskList();
}
function getDateOnly(date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}
function loadTaskList() {
    document.getElementById("dvTasks").innerHTML = "";
    taskList = taskList.sort(function (a, b) { return a.eventDate > b.eventDate; });
    var task, currDate;
    for (var i = 0; i < taskList.length; i++) {
        task = taskList[i];
        task.eventDate = new Date(task.eventDate);
        if (task.status > 0) {
            var dvTask = document.createElement("div");
            dvTask.className = "dvTask";
            if (currDate == null || currDate.getTime() != getDateOnly(task.eventDate).getTime()) {
                currDate = getDateOnly(task.eventDate);
                var dvDate = document.createElement("div");
                dvDate.className = "dvDate";
                dvDate.innerHTML = getFormattedDate(currDate, true, false, true);
                dvTask.appendChild(dvDate);                
            }

            var spnTime = document.createElement("span");
            spnTime.className = "spnTime";
            spnTime.innerHTML = getFormattedDate(task.eventDate, true, false, false, true, true);
            dvTask.appendChild(spnTime);

            var spnNote = document.createElement("span");
            spnNote.className = "spnNote";
            spnNote.innerHTML = task.note;
            dvTask.appendChild(spnNote);

            if (task.eventDate.getDate() <= today.getDate()) {
                var spnLater = document.createElement("span");
                spnLater.className = "spnLater";
                spnLater.innerHTML = "Move";
                spnLater.id = task.id;
                spnLater.addEventListener("click", function () {
                    updateTaskStatus(this.id, 2);
                });
                dvTask.appendChild(spnLater);

                var spnDone = document.createElement("span");
                spnDone.className = "spnDone";
                spnDone.innerHTML = "Done";
                spnDone.id = task.id;
                spnDone.addEventListener("click", function () {
                    updateTaskStatus(this.id, 0);
                });
                dvTask.appendChild(spnDone);
            }

            document.getElementById("dvTasks").appendChild(dvTask);
        }
    }

}
function updateTaskStatus(id, status) {
    var i = taskList.findIndex(t => t.id == id);
    var task;
    taskList[i].status = status;
    if (status == 2) {
        task = taskList[i].note + " @ " + getFormattedDate(taskList[i].eventDate, true, false, false, true);
        taskList.splice(i, 1);
    }
    setCache({ taskList: taskList, options: options });
    loadTaskList();
    if (status == 2) {
        document.getElementById("tbTask").value = task;
        document.getElementById("tbTask").focus();
    }
}
function addTask() {
    var taskText = document.getElementById("tbTask").value;
    var part = taskText.split(" ");
    
    var note = part[1].replace(part[0] + " ", "");
    
    var dateTimePart = part[0].trim().split("-");
    
    var datePart = dateTimePart[0];
    var timePart = (dateTimePart.length > 1) ? dateTimePart[1] : "09:00";
    var dateValues = datePart.split("/");
    var date, month, year, hour, min;
    if (dateValues.length == 1) {
        date = dateValues[0];
        month = today.getMonth();
        year = today.getFullYear();
    }
    if (dateValues.length == 2) {
        date = dateValues[1];
        month = parseInt(dateValues[0]) - 1;
        year = today.getFullYear();
    }
    if (dateValues.length == 3) {
        date = dateValues[1];
        month = parseInt(dateValues[0]) - 1;
        year = dateValues[2];
    }
    var timeValues = timePart.split(":");
    hour = timeValues[0];
    min = (timeValues.length > 1) ? timeValues[1] : "00";
    
    var fullDate = new Date(year, month, date, hour, min, 0, 0);
    alert(fullDate);alert(note);
    
    var task = {
        id: getNextIndex(),
        createdDate: today,
        eventDate: fullDate,
        note: note,
        status: 1
    };
    addTaskToList(task);
    loadTaskList();
}
function addTaskToList(task) {
    taskList.push(task);
    setCache({ taskList: taskList, options: options });
}


//common functions
function getNextIndex() {
    var index = localStorage.getItem(indexName);
    if (index == null) {
        index = 0;
    }
    else {
        index = parseInt(index);
    }
    index = index + 1;
    localStorage.setItem(indexName, index);
    return index;
}
function resetIndex() {
    localStorage.removeItem(indexName);
}
function getCache() {
    var items = JSON.parse(localStorage.getItem(cacheName));
    if (items == null) {
        items = { taskList: [], options: { snoozeDays: 1, hideOthers: false } };
    }
    return items;
}
function setCache(items) {
    localStorage.setItem(cacheName, JSON.stringify(items));
}
function clearCache() {
    localStorage.removeItem(cacheName);
}
function getFormattedDate(d, includeSeparators, changeHours, dateOnly, excludeSeconds, timeOnly) {
    d = new Date(d);
    var h = d.getHours();
    var tt = "";
    var result = "";
    if (changeHours) {
        var tt = " am";
        if (h == 0) { h = 12; } else if (h > 12) { h = h - 12; tt = " pm"; } else if (h == 12) { tt = " pm"; }
    }
    if (!timeOnly) {
        result += ('0' + (d.getMonth() + 1)).slice(-2)
            + (includeSeparators ? "/" : "")
            + ('0' + d.getDate()).slice(-2)
            + (includeSeparators ? "/" : "")
            + d.getFullYear();
    }

    if (!dateOnly) {
        result += (includeSeparators ? " " : "")
            + ('0' + h).slice(-2)
            + (includeSeparators ? ":" : "")
            + ('0' + d.getMinutes()).slice(-2)
            + (excludeSeconds ? "" : (includeSeparators ? ":" : "") + ('0' + d.getSeconds()).slice(-2))
            + tt;
    }
    return result;
}
