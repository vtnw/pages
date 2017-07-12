document.getElementById("btnAdd").addEventListener("click", function () {
    var c = document.getElementById("tbCategory").value;
    var p = document.getElementById("tbPlanned").value;
    var a = document.getElementById("tbActual").value;
    var i = getIndex();
    
    if (c != '' && a != '') {
        var item = { id: i, category: c, planned: p, actual: a };
        var items = getCache();
        items.push(item);
        setCache(items);
        AddEntry(i, c, p, a);
        document.getElementById("tbCategory").value = "";
        document.getElementById("tbPlanned").value = "0";
        document.getElementById("tbActual").value = "0";
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
    s.className = "spnAmt";
    d.appendChild(s);

    var s = document.createElement('span');
    s.id = "sAmount" + id;
    s.innerHTML = actual;
    s.className = "spnAmt";
    d.appendChild(s);

    var t = document.createElement('input');
    t.id = "tAmount" + id;
    t.setAttribute("type", "text");
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
        
        items[i].actual = parseInt(items[i].actual) + parseInt(tbA.value);
        spnA.innerHTML = items[i].actual;
        tbA.value = "";
        setCache(items);
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
