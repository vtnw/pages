var cacheName = "link" + decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
var showType = true;

document.getElementById("btnEdit").addEventListener("click", function () {
    if (document.getElementById("dvEdit").style.display == "none") {
        document.getElementById("btnEdit").value = "Save";
        document.getElementById("tbData").value = localStorage.getItem(cacheName);
        document.getElementById("dvEdit").style.display = "block";
    } else {
        localStorage.setItem(cacheName, document.getElementById("tbData").value);
        document.getElementById("tbData").value = "";
        document.getElementById("dvEdit").style.display = "none";
        document.getElementById("btnEdit").value = "Edit";
        loadLinks();
    }

});
document.getElementById("btnAdd").addEventListener("click", function () {
    var n = document.getElementById("tbName").value;
    var l = document.getElementById("tbLink").value;
    var t = document.getElementById("tbType").value;
    if (n != '' && l != '' && t != '') {
        var item = { "name": n, "link": l, "type": t };
        var items = getCache();
        items.push(item);
        setCache(items);
        loadLinks();
        document.getElementById("tbName").value = "";
        document.getElementById("tbLink").value = "";
        document.getElementById("tbType").value = "";
    }
});
document.getElementById("btnClear").addEventListener("click", function () {
    if (confirm("Clear?")) {
        clearDiv();
        localStorage.setItem(cacheName, null);
    }
});
document.getElementById("btnShowAdd").addEventListener("click", function () {
    if (document.getElementById("dvLinkAdd").style.display == "none") {
        document.getElementById("dvLinkAdd").style.display = "block";
        document.getElementById("btnShowAdd").value = "Close";
    } else {
        document.getElementById("dvLinkAdd").style.display = "none";
        document.getElementById("btnShowAdd").value = "Add";
    }
});

function loadLinks() {
    var items = getCache();
    if (showType) {
        items.sort(function (a, b) {
            if (a.type === b.type) {
                return (a.name - b.name);
            } else if (a.type > b.type) {
                return 1;
            } else if (a.type < b.type) {
                return -1;
            }
        });
    } else {
        items.sort(function (a, b) { return a.name > b.name });
    }
    clearDiv();
    var d = document.getElementById("dvLinks");
    var currType = "";
    for (var i = 0; i < items.length; i++) {
        if (currType != items[i].type && showType) {
            currType = items[i].type;
            var a = document.createElement('a');
            a.setAttribute("href", "#" + currType);
            a.setAttribute("name", "type");
            a.setAttribute("style", "line-height:30px;");
            a.innerHTML = currType;
            d.appendChild(a);
            d.appendChild(document.createElement('br'));
        }                
    }
    currType = "";
    for (var i = 0; i < items.length; i++) {
        if (currType != items[i].type && showType) {
            currType = items[i].type;
            var a = document.createElement('a');
            a.setAttribute("name", items[i].type);
            a.setAttribute("href", "#type");
            a.setAttribute("style", "line-height:30px;color:black;font-weight:bold;text-decoration:none;");
            a.innerHTML = currType;
            d.appendChild(document.createElement('hr'));
            d.appendChild(a);
            d.appendChild(document.createElement('br'));
        }                
        var a = document.createElement('a');
        a.setAttribute("href", items[i].link);
        a.setAttribute("style", "line-height:30px;");
        a.innerHTML = items[i].name;
        d.appendChild(a);
        d.appendChild(document.createElement('br'));
    }
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
function clearDiv() {
    document.getElementById("dvLinks").innerHTML = "";
}
