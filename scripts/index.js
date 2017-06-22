function loadLinks() {
    var items = getCache();
    clearDiv();
    var d = document.getElementById("dvLinks");
    for (var i = 0; i < items.length; i++) {
        var a = document.createElement('a');
        a.setAttribute("href", "#");
        a.setAttribute("link", items[i].link);
        a.addEventListener("click", function () {
            if (document.getElementById("cbx").checked) {
                window.open(this.getAttribute("link"));
            } else {
                window.location.href = this.getAttribute("link");
            }
        });
        a.setAttribute("style", "line-height:30px;");
        a.innerHTML = items[i].name;
        d.appendChild(a);
        d.appendChild(document.createElement('br'));
    }
}
function editLinks() {
    var items = getCache();
    var d = document.getElementById("dvEdit");
    if (document.getElementById("tbData") == null) {
        var t = document.createElement('textarea');
        t.setAttribute('id', "tbData");
        t.setAttribute('style', "width:99%;height:100px;");
        d.appendChild(t);
    }
    document.getElementById("tbData").value = localStorage.getItem("links");
    d.style.display = "block";
}
function add() {
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
function reset() {
    if (confirm("Clear?")) {
        clearDiv();
        localStorage.setItem("links", null);
    }
}
function save() {
    localStorage.setItem("links", document.getElementById("tbData").value);
    cancel();
    loadLinks();
}
function cancel() {
    document.getElementById("tbData").value = "";
    document.getElementById("dvEdit").style.display = "none";
}
