var u = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));;
var cacheName = "note" + u;
var indexName = "index" + cacheName + u;
var noteList = [];
var typeList = [{"Name": "#all", "Selected": true}];

//events
document.getElementById("btnAdd").addEventListener("click", function () {
    addItem();
});
document.getElementById("btnClear").addEventListener("click", function () {
    clearList();
});
document.getElementById("btnExport").addEventListener("click", function () {
    exportData();
});
document.getElementById("btnFilter").addEventListener("click", function () {
    toggleFilter();
});
document.getElementById("btnImport").addEventListener("click", function () {
    toggleImport();
});
document.getElementById("btnMerge").addEventListener("click", function () {
    loadFile(false);
    toggleImport();
});
document.getElementById("btnReplace").addEventListener("click", function () {
    loadFile(true);
    toggleImport();
});

//app functions
function initialize() {
    noteList = getCache();
    loadList();
}
function loadTypeList(){
    document.getElementById("dvTypes").innerHTML = "";
    for (i = 0; i < noteList.length; i++) {
        for (j = 0; j < noteList[i].Type.length; j++) {
            addType(noteList[i].Type[j], true);
        }
    }
}
function loadList() {
    loadTypeList();
    document.getElementById("dvNotes").innerHTML = "";
    for (i = 0; i < noteList.length; i++) {
        if (isTypeSelected(noteList[i].Type)) {
            addToDiv("dvNotes", noteList[i]);
        }
    }
}
function isTypeSelected(type){
    result = false;
    for (k = 0; k < type.length; k++) {
        sel = typeList.findIndex((t => t.Name == type[k] && t.Selected));
        alert(k + "-" + type[k] + "-" + sel);
        if(sel >= 0){
            result = true;
            break;
        }
    }
    return result;
}
function toggleMore(){
    if(document.getElementById("dvMore").style.display == "none"){
        document.getElementById("dvMore").style.display = "block";
        document.getElementById("btnMore").value = "<<<";
    }
    else{
        document.getElementById("dvMore").style.display = "none";
        document.getElementById("btnMore").value = ">>>";
    }
}
function exportData(){
    supportRestore = confirm("Support restore?");
    saveAsFile(getExportData(supportRestore));
}
function toggleImport(){
    if(document.getElementById("dvImport").style.display == "none"){
        document.getElementById("fileImport").value = "";
        document.getElementById("btnImport").value = "Close";
        document.getElementById("dvImport").style.display = "block";
    }
    else{
        document.getElementById("btnImport").value = "Import";
        document.getElementById("dvImport").style.display = "none";
    }
}
function toggleFilter(){
    if(document.getElementById("dvFilter").style.display == "none"){
        document.getElementById("btnFilter").value = "Apply";
        document.getElementById("dvFilter").style.display = "block";
    }
    else{
        document.getElementById("btnFilter").value = "Filter";
        document.getElementById("dvFilter").style.display = "none";
    }
}
function clearList() {
    if (confirm("Reset index as well?")) {
        resetIndex();
    }
    tempList = [];
    for (i = 0; i < noteList.length; i++) {
        if (!isTypeSelected(noteList[i].Type)) {
            tempList.push(noteList[i]);
        }
    }
    noteList = tempList;
    setCache(noteList);
    loadList();
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
    addType(item.Type, true);
    document.getElementById("tbNote").value = "";
    document.getElementById("tbNote").focus();
    document.getElementById("dvNotes").scrollTop = 0;
}
function getType(text) {
    type = text.match(/[#]+[A-Za-z0-9-_]+/g);
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
    dvDate.innerHTML = item.Date + " [" + item.Type + "]";
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
function saveAsFile(data) {
    var a = document.createElement("a");
    a.download = "note" + "_" + getFormattedDate(false);
    a.innerHTML = "export";
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
    a.style.display = "none";
    a.onclick = function (event) { document.body.removeChild(event.target); };
    document.body.appendChild(a);
    a.click();
}
function getExportData(supportRestore){
    result = "";
    if(supportRestore){   
        exportData = [];
        for (i = 0; i < noteList.length; i++) {
            if (IsTypeSelected(noteList[i].Type)){
                exportData.push(noteList[i]);
            }
        }
        result = JSON.stringify(exportData);
    }
    else{
        result = document.getElementById("dvNotes").innerText;
    }
    return result;
}
function loadFile(replace) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        importedData = JSON.parse(event.target.result);
        if (replace) {
            noteList = [];
        }
        for (i = 0; i < importedData.length; i++) {
            importedData[i].Id = getNextIndex();
            noteList.push(importedData[i]);
        }
        setCache(noteList);        
        loadList();
    };
    fileReader.readAsText(document.getElementById("fileImport").files[0], "UTF-8");
}
function addType(type, isSelected){        
    isNew = (typeList.findIndex(t => t.Name == type) < 0);    
    if(isNew){
        typeList.push({"Name": type, "Selected": isSelected});        
        spnType = document.createElement("span");
        spnType.innerHTML = type;
        spnType.className = isSelected ? "spnTypeSel" : "spnType";    
        spnType.addEventListener("click", function () {
            isSelected = (this.className == "spnTypeSel");
            this.className = isSelected ? "spnType" : "spnTypeSel";
            typeList.findIndex(t => t.Name == this.innerText).Selected = !isSelected;
        });
        document.getElementById("dvTypes").appendChild(spnType);
    }
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
