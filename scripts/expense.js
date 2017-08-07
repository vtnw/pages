document.getElementById("btnAdd").addEventListener("click", function () {
    var c = document.getElementById("tbCategory").value;
    var p = document.getElementById("tbPlanned").value;
    var a = document.getElementById("tbActual").value;
    var i = getIndex();
    
    p = (p == '') ? 0 : p;
    a = (a == '') ? 0 : a;
    
    if (c != '') {
        var item = { id: i, category: c, planned: p, actual: a };
        var items = getCache();
        items.Summary.push(item);
        alert(JSON.stringify(items));
        if(a != null && parseInt(a) > 0){
            items.Details.push({date: getFormattedDate(true), name: c, amount: parseInt(a)});
        }
        setCache(items);
        AddEntry(i, c, p, a);
        document.getElementById("tbCategory").value = "";
        document.getElementById("tbPlanned").value = "";
        document.getElementById("tbActual").value = "";
        updateTotal(items.Summary);
    }
});
document.getElementById("btnReset").addEventListener("click", function () {
    if (confirm("Reset?")) {
        var items = getCache();

        for (var i = 0; i < items.Summary.length; i++) {
            items.Summary[i].actual=0;
        }
        items.Details = [];
        setCache(items);
        loadList();
    }
});
document.getElementById("btnClear").addEventListener("click", function () {
    if (confirm("Clear?")) {
        clearDiv();
        setCache(null);
        document.getElementById("dvTotal").style.display = "none";
    }
});
document.getElementById("btnEdit").addEventListener("click", function () {
    if (document.getElementById("dvEdit").style.display == "none") {
        document.getElementById("tbData").value = JSON.stringify(getCache());
        document.getElementById("dvEdit").style.display = "block";
        document.getElementById("btnEdit").value = "Save";
    } else {
        setCache(JSON.parse(document.getElementById("tbData").value));
        document.getElementById("tbData").value = "";
        document.getElementById("dvEdit").style.display = "none";
        loadList();
        document.getElementById("dvEdit").style.display = "none";
        document.getElementById("btnEdit").value = "Edit";
    }
});
document.getElementById("btnAddCat").addEventListener("click", function () {
    if (document.getElementById("dvAdd").style.display == "none") {
        document.getElementById("dvAdd").style.display = "block";
        document.getElementById("btnAddCat").value = "Close";
    } else {
        document.getElementById("dvAdd").style.display = "none";
        document.getElementById("tbCategory").value = "";
        document.getElementById("tbPlanned").value = "";
        document.getElementById("tbActual").value = "";
        document.getElementById("btnAddCat").value = "Add";
    }
});
document.getElementById("ddlMonth").addEventListener("change", function () {
    loadList();
});
document.getElementById("ddlMode").addEventListener("change", function () {
    toggleMode();
});

function initialize() {
    var today = new Date();
    var mm = today.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;
    var yyyymm = today.getFullYear() + mm;
    document.getElementById("ddlMonth").value = yyyymm;
    loadList();
}
function loadList() {
    var items = getCache();
    items.Summary.sort(function(a,b){return a.category.localeCompare(b.category)});
    clearDiv();    
    for (var i = 0; i < items.Summary.length; i++) {
        AddEntry(items.Summary[i].id, items.Summary[i].category, items.Summary[i].planned, items.Summary[i].actual);
    }
    updateTotal(items.Summary);
}
function loadDetails(){
    var items = getCache();
    var dvDetail = document.getElementById("dvDetailList");
    dvDetailList.innerHTML = "";
    var dvDetailItem, spnName, spnDate, spnAmount;
    for (var i = 0; i < items.Details.length; i++) {
        dvDetailItem = document.createElement("div");
        spnDetailDate = document.createElement("span");
        spnDetailDate.innerHTML = items.Details[i].date;
        spnDetailDate.className = "spnDetailDate";
        dvDetailItem.appendChild(spnDetailDate);
        spnDetailName = document.createElement("span");
        spnDetailName.innerHTML = items.Details[i].name;
        spnDetailName.className = "spnDetailName";
        dvDetailItem.appendChild(spnDetailName);
        spnDetailAmount = document.createElement("span");
        spnDetailAmount.innerHTML = items.Details[i].amount;
        spnDetailAmount.className = "spnDetailAmount";
        dvDetailItem.appendChild(spnDetailAmount);
        dvDetail.appendChild(dvDetailItem);
    }
}
function toggleMode(){
    if(document.getElementById("ddlMode").selectedIndex == 0){
        document.getElementById("dvSummary").style.display = "block";
        document.getElementById("dvDetails").style.display = "none";
        loadList();
    }
    else{
        document.getElementById("dvSummary").style.display = "none";
        document.getElementById("dvDetails").style.display = "block";
        loadDetails();
    }
}
function updateTotal(items) {
    var totP = 0;
    var totA = 0;
    for (var i = 0; i < items.length; i++) {
        totP = totP + parseInt(items[i].planned);
        totA = totA + parseInt(items[i].actual);
    }
    if(items != null && items.length > 0) {
        document.getElementById("spnTotalP").innerHTML = totP;
        document.getElementById("spnTotalA").innerHTML = totA;
        document.getElementById("spnTotalA").className = (totA > totP) ? "spnTotAR" : "spnTotAG";
        document.getElementById("dvTotal").style.display = "block";
    }
    else {
        document.getElementById("dvTotal").style.display = "none";
    }
}
function AddEntry(id, category, planned, actual) {
    var d = document.getElementById("dvExpenses");
    var s = document.createElement('span');
    s.id = "sCategory" + id;
    s.innerHTML = category;
    s.className = "spnCtg";
    d.appendChild(s);

    var s = document.createElement('span');
    s.id = "sPlanned" + id;
    s.innerHTML = planned;
    s.className = "spnAmtP";
    d.appendChild(s);

    var s = document.createElement('span');
    s.id = "sAmount" + id;
    s.innerHTML = actual;
    s.className = (actual > planned) ? "spnAmtRed" : "spnAmt";
    d.appendChild(s);

    var t = document.createElement('input');
    t.id = "tAmount" + id;
    t.setAttribute("type", "number");
    t.className = "tbAmount";
    d.appendChild(t);

    var b = document.createElement('input');
    b.id = id;
    b.setAttribute("type", "button");
    b.setAttribute("value", "+");
    b.className = "btnAddAmt";
    b.addEventListener("click", function () {        
        var id = this.getAttribute("id");
        var items = getCache();
        var i = items.Summary.findIndex((i => i.id == id));
        var tbA = document.getElementById("tAmount" + id);
        var spnA = document.getElementById("sAmount" + id);
        if(tbA.value != '') {
            items.Summary[i].actual = parseInt(items.Summary[i].actual) + parseInt(tbA.value);
            spnA.innerHTML = items.Summary[i].actual;
            spnA.className = (items.Summary[i].actual > items.Summary[i].planned) ? "spnAmtRed" : "spnAmt";            
            items.Details.push({date: getFormattedDate(true), name: items.Summary[i].category, amount: parseInt(tbA.value)});
            tbA.value = "";
            setCache(items);
            updateTotal(items.Summary);
        }
    });
    d.appendChild(b);

    d.appendChild(document.createElement("br"));
}
function getMonth() {
    var ddl = document.getElementById("ddlMonth");
    return ddl.options[ddl.selectedIndex].value;
}
function getCache() {
    var items = JSON.parse(localStorage.getItem("expenses_" + getMonth()));
    if (items == null) {
        items = { Summary: [], Details: []};
    }
    else if(items.Summary == null){
        items = {Summary: items, Details: []};
        alert("Upgraded!");
        setCache(items);
    }
    return items;
}
function setCache(items) {
    localStorage.setItem("expenses_" + getMonth(), JSON.stringify(items));
}
function clearDiv() {
    document.getElementById("dvExpenses").innerHTML = "";
}
function getIndex() {
    var index = localStorage.getItem("index_expense");
        if (index == null) {
        index = 0;
    }
    else {
        index = parseInt(index);
    }
    index = index + 1;
    localStorage.setItem("index_expense", index);
    return index;
}
function sortItems(s) {
    var items = getCache();
    if (s == 1) {
        items.sort(function(a,b){return a.id - b.id});
    }
    if (s == 2) {
        items.sort(function(a,b){return a.category.localeCompare(b.category)});
    }
    if (s == 3) {
        items.sort(function(a,b){return a.planned - b.planned});
    }
    if (s == 4) {
        items.sort(function(a,b){return a.actual - b.actual});
    }
    setCache(items);
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
