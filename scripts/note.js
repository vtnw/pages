var u = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));;
var cacheName = "note" + u;
var indexName = "index" + cacheName;
var noteList = [];
var typeList = [];

//events
document.getElementById("btnAdd").addEventListener("click", function () {
    addItem();
});
document.getElementById("btnClear").addEventListener("click", function () {
    toggleClear();
});
document.getElementById("btnExport").addEventListener("click", function () {
    toggleExport();
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
document.getElementById("btnType").addEventListener("click", function () {
    toggleType();
});

//app functions
function initialize() {
    noteList = getCache();
    loadTypeList();
    loadList();
}
function loadTypeList(){
    typeList = [];
    document.getElementById("dvTypes").innerHTML = "";
    for (var i = 0; i < noteList.length; i++) {
        for (j = 0; j < noteList[i].Type.length; j++) {
            if (isNewType(noteList[i].Type[j])){
                addTypeToList(noteList[i].Type[j], false);
            }
        }
    }
    typeList = typeList.sort(function(a,b){return  a.Name.localeCompare(b.Name)});
    for (n = 0; n < typeList.length; n++) {
        addTypeToDiv(typeList[n].Name, typeList[n].Selected);
    }
}
function loadList() {    
    document.getElementById("dvNotes").innerHTML = "";
    applyFilter = hasSelection();
    for (var i = 0; i < noteList.length; i++) {
        if (!applyFilter || isTypeSelected(noteList[i].Type)) {
            addToDiv("dvNotes", noteList[i]);
        }
    }
}
function isTypeSelected(type){
    var result = true;
    for (k = 0; k < typeList.length; k++) {
        if(typeList[k].Selected && type.indexOf(typeList[k].Name) < 0){
            result = false;
            break;
        }
    }
    return result;
}
function hasSelection(){
    return (typeList.findIndex(t => t.Selected)) >= 0;
}
function exportData(){
    var supportRestore = confirm("Support restore?");
    saveAsFile(getExportData(supportRestore));
}
function toggleImport(){
    resetToggle("btnImport");
    if(document.getElementById("btnImport").value == "Import"){
        document.getElementById("fileImport").value = "";
        document.getElementById("btnImport").value = "Close";
        document.getElementById("btnImport").style.textDecoration = "underline";
        document.getElementById("dvImport").style.display = "block";
    }
    else{
        document.getElementById("btnImport").value = "Import";
        document.getElementById("btnImport").style.textDecoration = "";
        document.getElementById("dvImport").style.display = "none";
    }
}
function toggleFilter(){
    resetToggle("btnFilter");
    if(document.getElementById("btnFilter").value == "Filter"){
        document.getElementById("btnFilter").value = "Apply";
        document.getElementById("btnFilter").style.textDecoration = "underline";
        document.getElementById("dvTypes").style.display = "block";
    }
    else{        
        loadList();
        document.getElementById("btnFilter").value = "Filter";
        document.getElementById("btnFilter").style.textDecoration = "";
        document.getElementById("dvTypes").style.display = "none";                
    }
}
function toggleType(){
    resetToggle("btnType");
    if(document.getElementById("btnType").value == "Type"){
        document.getElementById("btnType").value = "Apply";
        document.getElementById("btnType").style.textDecoration = "underline";
        document.getElementById("dvTypes").style.display = "block";
    }
    else{        
        applyTypes();
        document.getElementById("btnType").value = "Type";
        document.getElementById("btnType").style.textDecoration = "";
        document.getElementById("dvTypes").style.display = "none";
    }
}
function toggleClear(){
    resetToggle("btnClear");
    if(document.getElementById("btnClear").value == "Clear"){
        document.getElementById("btnClear").value = "Apply";
        document.getElementById("btnClear").style.textDecoration = "underline";
        document.getElementById("dvTypes").style.display = "block";
    }
    else{
        clearList();
        document.getElementById("btnClear").value = "Clear";
        document.getElementById("btnClear").style.textDecoration = "";
        document.getElementById("dvTypes").style.display = "none";
    }
}
function toggleExport(){
    resetToggle("btnExport");
    if(document.getElementById("btnExport").value == "Export"){
        document.getElementById("btnExport").value = "Apply";
        document.getElementById("btnExport").style.textDecoration = "underline";
        document.getElementById("dvTypes").style.display = "block";
    }
    else{
        exportData();
        document.getElementById("btnExport").value = "Export";
        document.getElementById("btnExport").style.textDecoration = "";
        document.getElementById("dvTypes").style.display = "none";
    }
}
function resetToggle(source){
    clearTypeSelection();
    if(source != "btnFilter"){
        document.getElementById("btnFilter").value = "Filter";
        document.getElementById("dvTypes").style.display = "none";
        document.getElementById("btnFilter").style.textDecoration = "";
    }    
    if(source != "btnType"){
        document.getElementById("btnType").value = "Type";
        document.getElementById("dvTypes").style.display = "none";
        document.getElementById("btnType").style.textDecoration = "";
    }    
    if(source != "btnImport"){
        document.getElementById("btnImport").value = "Import";
        document.getElementById("dvImport").style.display = "none";
        document.getElementById("btnImport").style.textDecoration = "";
    }
    if(source != "btnClear"){
        document.getElementById("btnClear").value = "Clear";
        document.getElementById("dvTypes").style.display = "none";
        document.getElementById("btnClear").style.textDecoration = "";
    }
    if(source != "btnExport"){
        document.getElementById("btnExport").value = "Export";
        document.getElementById("dvTypes").style.display = "none";
        document.getElementById("btnExport").style.textDecoration = "";
    }
}
function applyTypes(){
    var note = document.getElementById("tbNote").value;
    var selTypes = " ";
    for(var ix = 0; ix < typeList.length;ix++);{
        if(typeList[ix].Selected){
            selTypes += " " + typeList[ix].Name;
        }
    }
    if(note != ""){
        document.getElementById("tbNote").value = note + selTypes;
    }
    else{
        document.getElementById("tbNote").value = selTypes.trim() + " " + note;
    }
    document.getElementById("dvTypes").style.display = "none";
    document.getElementById("btnType").value = "Type";
    document.getElementById("btnType").style.textDecoration = "";
}
function clearTypeSelection(){
    var typeSpanList = document.getElementById("dvTypes").getElementsByTagName("span");
    for(var iy=0;iy<typeSpanList.length;iy++){
        typeSpanList[iy].className = "spnType";
        typeList[typeList.findIndex(t => t.Name == typeSpanList[iy].innerHTML)].Selected = false;
    }
}
function clearList() {
    if (confirm("Reset index as well?")) {
        resetIndex();
    }
    var tempList = [];
    applyFilter = hasSelection();
    for (var i = 0; i < noteList.length; i++) {
        if (applyFilter && !isTypeSelected(noteList[i].Type)) {
            tempList.push(noteList[i]);
        }
    }
    noteList = tempList;
    setCache(noteList);
    loadTypeList();
    loadList();
}
function addItem() {
    if(document.getElementById("tbNote").value == ""){
        return;
    }
    var item = {
        Id: getNextIndex(),
        Type: getType(document.getElementById("tbNote").value),
        Date: getFormattedDate(true),
        Note: getNote(document.getElementById("tbNote").value)
    }    
    addToList(item);
    addToDiv("dvNotes", item);
    for(l=0;l<item.Type.length;l++){
        if(isNewType(item.Type[l])){
            addTypeToList(item.Type[l], false);
            addTypeToDiv(item.Type[l], false);
        }
    }
    document.getElementById("tbNote").value = "";
    document.getElementById("tbNote").focus();
    document.getElementById("dvNotes").scrollTop = 0;
}
function getType(text) {
    var type = text.match(/[#]+[A-Za-z0-9-_]+/g);
    if (type == null) {
        type = ["#note" + u];
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
    var dvItem = document.createElement('div');
    dvItem.id = "dvItem" + item.Id;
    dvItem.className = "dvItem";

    var dvDate = document.createElement('div');
    dvDate.id = "dvDate" + item.Id;
    dvDate.innerHTML = item.Date + " [" + item.Type + "]";
    dvDate.className = "dvDate";
    dvItem.appendChild(dvDate);

    var dvNote = document.createElement('div');
    dvNote.id = "dvNote" + item.Id;
    dvNote.innerHTML = item.Note.replace(/(?:\r\n|\r|\n)/g, '<br />');
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
    var expResult = "";
    if(supportRestore){   
        var exportList = [];
        applyFilter = hasSelection();
        for (var i = 0; i < noteList.length; i++) {
            if (!applyFilter || isTypeSelected(noteList[i].Type)){
                exportList.push(noteList[i]);
            }
        }
        expResult = JSON.stringify(exportList);
    }
    else{
        applyFilter = hasSelection();
        for (var i = 0; i < noteList.length; i++) {
            if (!applyFilter || isTypeSelected(noteList[i].Type)){
                expResult += noteList[i].Date + " [" + noteList[i].Type + "]\n" + noteList[i].Note + "\n\n";
            }
        }
    }
    return expResult;
}
function loadFile(replace) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var importedData = JSON.parse(event.target.result);
        if (replace) {
            noteList = [];
        }
        for (var i = 0; i < importedData.length; i++) {
            importedData[i].Id = getNextIndex();
            noteList.push(importedData[i]);
        }
        setCache(noteList);
        loadTypeList();
        loadList();
    };
    fileReader.readAsText(document.getElementById("fileImport").files[0], "UTF-8");
}
function isNewType(type){
    return typeList.findIndex(t => t.Name == type) < 0; 
}
function addTypeToList(type, isSelected){
    typeList.push({"Name": type, "Selected": isSelected});
}
function addTypeToDiv(type, isSelected){
    var spnType = document.createElement("span");
    spnType.innerHTML = type;
    spnType.className = isSelected ? "spnTypeSel" : "spnType";    
    spnType.addEventListener("click", function () {
        if(document.getElementById("btnFilter").value == "Apply"
            || document.getElementById("btnExport").value == "Apply"
            || document.getElementById("btnClear").value == "Apply"
            || document.getElementById("btnType").value == "Apply"){
                isSelected = (this.className == "spnTypeSel");
                this.className = isSelected ? "spnType" : "spnTypeSel";
                typeList[typeList.findIndex(t => t.Name == this.innerHTML)].Selected = !isSelected;
        }        
    });
    document.getElementById("dvTypes").appendChild(spnType);
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
