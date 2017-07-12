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
        items.push(item);
        setCache(items);
        AddEntry(i, c, p, a);
        document.getElementById("tbCategory").value = "";
        document.getElementById("tbPlanned").value = "";
        document.getElementById("tbActual").value = "";
        updateTotal(items);
    }
});
document.getElementById("btnClear").addEventListener("click", function () {
    if (confirm("Clear?")) {
        clearDiv();
        setCache(null);
    }
});
document.getElementById("btnSave").addEventListener("click", function () {
    setCache(JSON.parse(document.getElementById("tbData").value));
    document.getElementById("tbData").value = "";
    document.getElementById("dvEdit").style.display = "none";
    loadList();
});
document.getElementById("btnCancel").addEventListener("click", function () {
    document.getElementById("tbData").value = "";
    document.getElementById("dvEdit").style.display = "none";
});
document.getElementById("btnEdit").addEventListener("click", function () {
    if (document.getElementById("dvEdit").style.display == "none") {
        document.getElementById("tbData").value = JSON.stringify(getCache());
        document.getElementById("dvEdit").style.display = "block";
    } else {
        document.getElementById("dvEdit").style.display = "none";
    }
});
document.getElementById("btnAddCat").addEventListener("click", function () {
    if (document.getElementById("dvAdd").style.display == "none") {
        document.getElementById("dvAdd").style.display = "block";
    } else {
        document.getElementById("dvAdd").style.display = "none";
        document.getElementById("tbCategory").value = "";
        document.getElementById("tbPlanned").value = "";
        document.getElementById("tbActual").value = "";
    }
});
document.getElementById("ddlMonth").addEventListener("change", function () {
    loadList();
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
    clearDiv();    
    for (var i = 0; i < items.length; i++) {
        AddEntry(items[i].id, items[i].category, items[i].planned, items[i].actual);
    }
    updateTotal(items);
}
function updateTotal(items) {
    var totP, totA = 0;
    for (var i = 0; i < items.length; i++) {
        totP = totP + items[i].planned;
        totA = totA + items[i].actual;
    }
    alert(items);alert(items.length);alert(totP);alert(totA);
    if(items != null && items.length > 0) {
        document.getElementyId("spnTotalP").innerHTML = totP;
        document.getElementById("spnTotalA").innerHTML = totA;
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
        var i = items.findIndex((i => i.id == id));
        var tbA = document.getElementById("tAmount" + id);
        var spnA = document.getElementById("sAmount" + id);
        if(tbA.value != '') {
            items[i].actual = parseInt(items[i].actual) + parseInt(tbA.value);
            spnA.innerHTML = items[i].actual;
            spnA.className = (items[i].actual > items[i].planned) ? "spnAmtRed" : "spnAmt";
            tbA.value = "";
            setCache(items);
            updateTotal(items);
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
        items = [];
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
    var index = localStorage.getItem("index");
        if (index == null) {
        index = 1;
    }
    else {
        index = parseInt(index);
    }
    index = index + 1;
    localStorage.setItem("index", index);
    return index;
}
