var u = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));;
var cacheName = "album" + u;
var indexName = "index" + cacheName;
var noteList = [];
var typeList = [];
var maxWidth = 1024;
var quality = 50;

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
document.getElementById("btnImg").addEventListener("click", function () {
    document.getElementById("fileImg").click();
});
document.getElementById("fileImg").addEventListener("change", function () {
    loadImage();
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
    saveAsFile(getExportData(supportRestore), supportRestore);
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
        clearTypeSelection();
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
        clearTypeSelection();
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
        clearTypeSelection();
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
        clearTypeSelection();
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
    var selTypes = "";
    for(var ix = 0; ix < typeList.length;ix++){
        if(typeList[ix].Selected){
            selTypes += " " + typeList[ix].Name;
        }
    }
    if(note != ""){
        document.getElementById("tbNote").value = note.trim() + selTypes;
    }
    else{
        document.getElementById("tbNote").value = selTypes.trim() + " ";
        document.getElementById("tbNote").focus();
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
        Note: getNote(document.getElementById("tbNote").value),
		Image: getImage()
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
    //document.getElementById("dvNotes").scrollTop = 0;
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

	if(item.Image != null){
		var imgEle = document.createElement('img');
		imgEle.id = "img" + item.Id;
   	 imgEle.src = "data:image/jpeg;base64," + item.Image;
    	imgEle.className = "img";
		dvItem.appendChild(imgEle);
	}

    var dvNote = document.createElement('div');
    dvNote.id = "dvNote" + item.Id;
    dvNote.innerHTML = item.Note.replace(/(?:\r\n|\r|\n)/g, '<br />');
    dvItem.className = "dvNote";
    dvItem.appendChild(dvNote);

    dvItem.appendChild(document.createElement('br'));
    
    d = document.getElementById(divName);
    d.insertBefore(dvItem, d.firstChild);
}
function saveAsFile(data, supportRestore) {
    var a = document.createElement("a");
    a.download = "note" + "_" + getFormattedDate(false) + (supportRestore ? ".txt" : ".html");
    a.innerHTML = "export";
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
    a.style.display = "none";
    a.onclick = function (event) { document.body.removeChild(event.target); };
    document.body.appendChild(a);
    a.click();
}
function getExportData(supportRestore){
    var expResult = "";
    var exportList = [];
    applyFilter = hasSelection();
    for (var i = 0; i < noteList.length; i++) {
       if (!applyFilter || isTypeSelected(noteList[i].Type)){
           exportList.push(noteList[i]);
       }
    }
    if(supportRestore){
        expResult = JSON.stringify(exportList);
    }
    else{
        expResult += "<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE =edge'><meta name='viewport' content='width =device-width, initial-scale=1.0'><title>Album</title><style>body{font-size:14px;font-family:Arial;}.dvDate{font-style: italic;color: #aaaaaa;font-size:12px;}.img{width:376px;}</style></head><body onload='initialize();'><div id='dvNotes' class='dvNotes'></div><script language='javascript'>var noteList = ";
	expResult += JSON.stringify(exportList);
    	expResult += ";function initialize(){for (var i = 0; i < noteList.length; i++) {var dvItem = document.createElement('div');dvItem.className = 'dvItem';var dvDate = document.createElement('div');dvDate.innerHTML = noteList[i].Date + ' [' + noteList[i].Type + ']';dvDate.className = 'dvDate';dvItem.appendChild(dvDate);if(noteList[i].Image != null){var imgEle = document.createElement('img');imgEle.src = 'data:image/jpeg;base64,' + noteList[i].Image;imgEle.className = 'img';dvItem.appendChild(imgEle);}var dvNote = document.createElement('div');dvNote.innerHTML = noteList[i].Note.replace(/(?:\\r\\n|\\r|\\n)/g, '<br />');dvItem.className = 'dvNote';dvItem.appendChild(dvNote);dvItem.appendChild(document.createElement('br'));d = document.getElementById('dvNotes');d.insertBefore(dvItem, d.firstChild);}}</script></body></html>";
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
function loadImage(){
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = new Image();
            image.onload = function () {
           	 var canvas = document.getElementById("cvsImg");
          	  if (image.width > maxWidth) {
           	     image.height *= maxWidth/image.width;
           	     image.width = maxWidth;
          	  }
         	   var ctx = canvas.getContext("2d");
          	  ctx.clearRect(0, 0, canvas.width, canvas.height);
         	   canvas.width = image.width;
        	    canvas.height = image.height;
         	   ctx.drawImage(image, 0, 0, image.width, image.height);
            };
        	image.src = e.target.result;
        };
        reader.readAsDataURL(document.getElementById("fileImg").files[0]);
}
function getImage(){
	var canvas = document.getElementById("cvsImg");
	return canvas.toDataURL("image/jpeg", quality/100).replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
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
