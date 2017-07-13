document.getElementById("btnEdit").addEventListener("click", function () {
    if(document.getElementById("dvEdit").style.display == "none"){
        document.getElementById("btnEdit").value = "Save";
        document.getElementById("tbData").value = localStorage.getItem("links");
        document.getElementById("dvEdit").style.display = "block";
    } else {
        localStorage.setItem("links", document.getElementById("tbData").value);
        document.getElementById("tbData").value = "";
        document.getElementById("dvEdit").style.display = "none";
        document.getElementById("btnEdit").value = "Edit";
        loadLinks();
    }
    
});
document.getElementById("btnAdd").addEventListener("click", function () {
    var n = document.getElementById("tbName").value;
    var l = document.getElementById("tbLink").value;
    if (n != '' && l != '') {
        var item = { "name": n, "link": l };
        var items = getCache();
        items.push(item);
        setCache(items);
        loadLinks();
        document.getElementById("tbName").value = "";
        document.getElementById("tbLink").value = "";
    }
});
document.getElementById("btnClear").addEventListener("click", function () {
    if (confirm("Clear?")) {
        clearDiv();
        localStorage.setItem("links", null);
    }
});
document.getElementById("btnShowAdd").addEventListener("click", function () {
    if(document.getElementById("dvLinkAdd").style.display == "none"){
        document.getElementById("dvLinkAdd").style.display = "block";
        document.getElementById("btnShowAdd").value = "Close";
    } else {
        document.getElementById("dvLinkAdd").style.display = "none";
        document.getElementById("btnShowAdd").value = "Add";
    }
});

function loadLinks() {
    var items = getCache();
    clearDiv();
    var d = document.getElementById("dvLinks");
    for (var i = 0; i < items.length; i++) {
        var a = document.createElement('a');
        a.setAttribute("href", items[i].link);
        a.setAttribute("style", "line-height:30px;");
        a.innerHTML = items[i].name;
        d.appendChild(a);
        d.appendChild(document.createElement('br'));
    }
}
function getCache() {
    var items = JSON.parse(localStorage.getItem("links"));
    if (items == null) {
        items = [];
    }
    return items;
}
function setCache(items) {
    localStorage.setItem("links", JSON.stringify(items));
}
function clearDiv() {
    document.getElementById("dvLinks").innerHTML = "";
}
