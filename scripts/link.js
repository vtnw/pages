document.getElementById("btnEdit").addEventListener("click", function () {
    document.getElementById("tbData").value = localStorage.getItem("links");
    document.getElementById("dvEdit").style.display = "block";
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
document.getElementById("btnSave").addEventListener("click", function () {
    localStorage.setItem("links", document.getElementById("tbData").value);
    document.getElementById("tbData").value = "";
    document.getElementById("dvEdit").style.display = "none";
    loadLinks();
});
document.getElementById("btnCancel").addEventListener("click", function () {
    document.getElementById("tbData").value = "";
    document.getElementById("dvEdit").style.display = "none";
});
document.getElementById("btnSearch").addEventListener("click", function () {
    var q = document.getElementById("tbSearch").value;
    if(document.getElementById("cbxDefine").checked){
        q = "define " + q;
    }
    window.location.href = "https://www.google.co.in/search?q=" + q;
});
document.getElementById("btnBrowse").addEventListener("click", function () {
    var q = "http://" + document.getElementById("tbSearch").value;
    if(document.getElementById("cbxDefine").checked){
        q = q + ".com";
    }
    window.location.href = q;
});
document.getElementById("btnManage").addEventListener("click", function () {
    if(document.getElementById("dvLinkAdd").style.display == "none"){
        document.getElementById("dvLinkAdd").style.display = "block";
    } else {
        document.getElementById("dvLinkAdd").style.display = "none";
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
