var u = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));;
var cacheName = "task" + u;
var indexName = "index" + cacheName + u;
var taskList = [];
var options = {};
var today;

//events
document.getElementById("btnAdd").addEventListener("click", function () {
    addTask();
});
document.getElementById("tbTask").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        addTask();
        document.getElementById("tbTask").blur();
    }
});

//functions
function initialize() {
    today = new Date();
    today.setHours(23, 59, 59, 999);
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
    taskList.sort(function (a, b) { return formatDate(a.eventDate, "yyyymmddhhmm").localeCompare(formatDate(b.eventDate, "yyyymmddhhmm")) });
    var currDate;
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].status > 0) {
            var dvTask = document.createElement("div");
            dvTask.className = "dvTask";
            
            if (currDate == null || currDate != formatDate(taskList[i].eventDate, "yyyymmdd")) {                
                var dvDate = document.createElement("div");
                dvDate.className = "dvDate";
                dvDate.innerHTML = formatDate(taskList[i].eventDate,"mm/dd/yyyy ddd");
                var lineBreak = (currDate == formatDate(today, "yyyymmdd")) ? "hr" : "br";
                dvTask.appendChild(document.createElement(lineBreak));                
                dvTask.appendChild(dvDate);                
                currDate = formatDate(taskList[i].eventDate, "yyyymmdd")
            }
            
            var notify = formatDate(taskList[i].eventDate, "yyyymmddhhmm") <= formatDate(today, "yyyymmddhhmm");

            var spnTime = document.createElement("span");
            spnTime.className = notify ? "spnTimeAlarm" : "spnTime";
            spnTime.innerHTML = formatDate(taskList[i].eventDate,"hh:mm");
            dvTask.appendChild(spnTime);

            var spnNote = document.createElement("span");
            spnNote.className = notify ? "spnNoteAlarm" : "spnNote";
            spnNote.innerHTML = taskList[i].note;
            dvTask.appendChild(spnNote);

            if (notify) {
                var spnLater = document.createElement("span");
                spnLater.className = "spnLater";
                spnLater.innerHTML = "Move";
                spnLater.id = taskList[i].id;
                spnLater.addEventListener("click", function () {
                    updateTaskStatus(this.id, 2);
                });
                dvTask.appendChild(spnLater);

                var spnDone = document.createElement("span");
                spnDone.className = "spnDone";
                spnDone.innerHTML = "Done";
                spnDone.id = taskList[i].id;
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
        task = formatDate(taskList[i].eventDate, "mm/dd/yyyy-hh:mm") + " " + taskList[i].note;
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
    
    var note = taskText.replace(part[0] + " ", "");
    
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
    
    var task = {
        id: getNextIndex(),
        createdDate: new Date(),
        eventDate: fullDate,
        note: note,
        status: 1
    };
    addTaskToList(task);
    loadTaskList();
    document.getElementById("tbTask").value = "";
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
function formatDate(date, format){
    date = new Date(date);
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var result = "";
    switch(format){
        case "mm/dd/yyyy":{
            result = ('0' + (date.getMonth() + 1)).slice(-2)
                    + "/"
                    + ('0' + date.getDate()).slice(-2)
                    + "/"
                    + date.getFullYear();
            break;
        }
        case "mm/dd/yyyy ddd":{
            result = ('0' + (date.getMonth() + 1)).slice(-2)
                    + "/"
                    + ('0' + date.getDate()).slice(-2)
                    + "/"
                    + date.getFullYear()
                    + " "
                    + days[date.getDay()];
            break;
        }
        case "hh:mm":{
            result = ('0' + date.getHours()).slice(-2)
                    + ":"
                    + ('0' + date.getMinutes()).slice(-2);
            break;
        }
        case "mm/dd/yyyy hh:mm":{
            result = ('0' + (date.getMonth() + 1)).slice(-2)
                    + "/"
                    + ('0' + date.getDate()).slice(-2)
                    + "/"
                    + date.getFullYear()
                    + ('0' + date.getHours()).slice(-2)
                    + ":"
                    + ('0' + date.getMinutes()).slice(-2);
            break;
        }
        case "yyyymmddhhmm":{
            result = date.getFullYear()
                    + ('0' + (date.getMonth() + 1)).slice(-2)
                    + ('0' + date.getDate()).slice(-2)
                    + ('0' + date.getHours()).slice(-2)
                    + ('0' + date.getMinutes()).slice(-2);
            break;
        }
        case "yyyymmdd":{
            result = date.getFullYear()
                    + ('0' + (date.getMonth() + 1)).slice(-2)
                    + ('0' + date.getDate()).slice(-2);
            break;
        }
        case "mm/dd/yyyy-hh:mm":{
            result = ('0' + (date.getMonth() + 1)).slice(-2)
                    + "/"
                    + ('0' + date.getDate()).slice(-2)
                    + "/"
                    + date.getFullYear()
                    + "-"
                    + ('0' + date.getHours()).slice(-2)
                    + ":"
                    + ('0' + date.getMinutes()).slice(-2);
            break;
        }
    }
    return result;
}
