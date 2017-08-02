var u = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));;
var cacheName = "note" + u;
var indexName = "index" + cacheName + u;
var noteList = [];

//events
document.getElementById("btnAdd").addEventListener("click", function () {
    addItem();
});
document.getElementById("btnMore").addEventListener("click", function () {
    toggleMore();
});
document.getElementById("btnClear").addEventListener("click", function () {
    clearList(getSelectedType());
});
document.getElementById("btnExport").addEventListener("click", function () {
    saveAsFile(getSelectedType());
});
document.getElementById("ddlType").addEventListener("change", function () {
    loadList(getSelectedType());
});

function toggleMore() {
    if (document.getElementById("dvMore").style.display == "none") {
        document.getElementById("dvMore").style.display = "block";
    }
    else {
        document.getElementById("dvMore").style.display = "none";
    }
}

//app functions
function initialize() {
    noteList = getCache();
    loadList("#all");
}
function loadList(type) {
    document.getElementById("dvNotes").innerHTML = "";
    for (i = 0; i < noteList.length; i++) {
        if (type == "#all" || noteList[i].Type.indexOf(type) >= 0) {
            addToDiv("dvNotes", noteList[i]);
        }
    }
}
function getSelectedType() {
    return document.getElementById("ddlType")[document.getElementById("ddlType").selectedIndex].value;
}
function clearList(type) {
    if (confirm("Reset index as well?")) {
        resetIndex();
    }
    if (type == null) {
        noteList = [];
    }
    else {
        tempList = [];
        for (i = 0; i < noteList.length; i++) {
            if (noteList[i].Type.indexOf(type) >= 0) {
                tempList.push(noteList[i]);
            }
        }
        noteList = tempList;
    }
    setCache(noteList);    
    loadList(type);
}
function addItem() {
    item = {
        Id: getNextIndex(),
        Type: getType(document.getElementById("tbNote").value),
        Date: getFormattedDate(true),
        Note: getNote(document.getElementById("tbNote").value)
    }    
    addToList(item);
    addToDiv("dvNotes", item);
}
function getType(text) {
    type = text.match(/(^|\s)(#[a-z\d-]+)/ig);
    if (type == null) {
        type = ["#n"];
    }
    return type;
}
function getNote(text) {
    return text.replace(/(^|\s)(#[a-z\d-]+)/ig, "");
}
function addToList(item) {
    noteList.push(item);    
    setCache(noteList);
}
function addToDiv(divName, item) {
    dvItem = document.createElement('div');
    dvItem.id = "dvItem" + item.Id;
    dvItem.className = "dvItem";

    dvDate = document.createElement('div');
    dvDate.id = "dvDate" + item.Id;
    dvDate.innerHTML = item.Date;
    dvDate.className = "dvDate";
    dvItem.appendChild(dvDate);

    dvNote = document.createElement('div');
    dvNote.id = "dvNote" + item.Id;
    dvNote.innerHTML = item.Note;
    dvItem.className = "dvNote";
    dvItem.appendChild(dvNote);

    dvItem.appendChild(document.createElement('br'));
    
    d = document.getElementById(divName);
    d.insertBefore(dvItem, d.firstChild);
}
function saveAsFile(type) {
    exportData = [];
    for (i = 0; i < noteList.length; i++) {
        if (type == "#all" || noteList[i].Type.indexOf(type) >= 0){
            exportData.push(noteList[i]);
        }
    }
    var a = document.createElement("a");
    a.download = "note" + type + "_" + getFormattedDate(false);
    a.innerHTML = "export";
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(exportData)], { type: "text/plain" }));
    a.style.display = "none";
    a.onclick = function (event) { document.body.removeChild(event.target); };
    document.body.appendChild(a);
    a.click();
}
function loadFile(replace) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        importedData = JSON.parse(event.target.result);
        if (replace) {
            listData = importedData;
        }
        else {
            for (i = 0; i < importedData.length; i++) {
                importedData[i].Id = getNextIndex();
                listData.push(importedData[i]);
            }
        }
        loadList();
        toggleSave(true);
    };
    fileReader.readAsText(document.getElementById("fileImport").files[0], "UTF-8");
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
    localStorage.setItem(indexName, null);
}
function getCache() {
    var items = JSON.parse(localStorage.getItem(cacheName));
    if (items == null) {
        items = [];
    }
    return items;
}
function setCache(items) {
    localStorage.setItem(cacheName, JSON.stringify(items));
}
function getFormattedDate(includeSeparators) {
    var d = new Date();
    d = ('0' + (d.getMonth() + 1)).slice(-2)
        + (includeSeparators ? "/" : "")
        + ('0' + d.getDate()).slice(-2)
        + (includeSeparators ? "/" : "")
        + d.getFullYear()    
        + (includeSeparators ? " " : "")
        + ('0' + d.getHours()).slice(-2)
        + (includeSeparators ? ":" : "")
        + ('0' + d.getMinutes()).slice(-2)
        + (includeSeparators ? ":" : "")
        + ('0' + d.getSeconds()).slice(-2);
    return d;
}
