var key = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
var cacheName = "home" + key;
var sortByRank = true;
var memoCacheName = "memo" + key;

document.addEventListener("leftSwipe", function(event){    
    save();
    document.getElementById("dvPanel1").style.display = "block";
    document.getElementById("dvPanel2").style.display = "none";
});
document.addEventListener("rightSwipe", function(event){    
    document.getElementById("dvPanel1").style.display = "none";
    document.getElementById("dvPanel2").style.display = "block";    
    document.getElementById("tbNote").focus();
});
document.getElementById("dvLinks").addEventListener("click", function (e) {
  if(this === e.target) {
    document.getElementById("tbSearch").focus();
  }
});
document.getElementById("btnEdit").addEventListener("click", function () {
    if (document.getElementById("dvEdit").style.display == "none") {
        document.getElementById("btnEdit").value = "Save";
        document.getElementById("tbData").value = localStorage.getItem(cacheName);
        document.getElementById("dvEdit").style.display = "block";
        document.getElementById("dvLinkAdd").style.display = "none";
        document.getElementById("btnShowAdd").value = "Add";
    } else {
        localStorage.setItem(cacheName, document.getElementById("tbData").value);
        document.getElementById("tbData").value = "";
        document.getElementById("dvEdit").style.display = "none";
        document.getElementById("btnEdit").value = "Edit";
        var items = getCache();
        loadLinks(items);
    }
});
document.getElementById("btnAdd").addEventListener("click", function () {
    var n = document.getElementById("tbName").value;
    var l = document.getElementById("tbLink").value;
    if (n != '' && l != '') {        
        var items = getCache();
        items.sort(function (a, b) { return b.id - a.id });
        var item = {"id": (items.length > 0) ? items[0].id + 1 : 1, "name": n, "link": l, "rank": 0 };
        items.push(item);
        setCache(items);
        loadLinks(items);
        document.getElementById("tbName").value = "";
        document.getElementById("tbLink").value = "";
    }
});
document.getElementById("btnClear").addEventListener("click", function () {
    if (confirm("Clear?")) {
        clearDiv();
        localStorage.setItem(cacheName, null);
        localStorage.setItem("index_" + cacheName, null);
    }
});
document.getElementById("btnShowAdd").addEventListener("click", function () {
    if (document.getElementById("dvLinkAdd").style.display == "none") {
        document.getElementById("dvLinkAdd").style.display = "block";
        document.getElementById("btnShowAdd").value = "Close";
        document.getElementById("tbData").value = "";
        document.getElementById("dvEdit").style.display = "none";
        document.getElementById("btnEdit").value = "Edit";
    } else {
        document.getElementById("dvLinkAdd").style.display = "none";
        document.getElementById("btnShowAdd").value = "Add";
    }
});

function restore() {
    document.getElementById("tbNote").value = localStorage.getItem(memoCacheName);
}
function save() {
    localStorage.setItem(memoCacheName, document.getElementById("tbNote").value);
}
function search(){
    var criteria = document.getElementById("tbSearch").value;
    if(event.keyCode == 13){
      if(criteria.indexOf(".") >= 0 && criteria.indexOf(" ") < 0){
        criteria = criteria.startsWith("http") ? criteria : "https://" + criteria;
        location.href= criteria;
      }
      else{
        location.href = "https://www.google.com/search?q=" + criteria;
      }
    }
    else{
        var items = getCache();        
        var filteredItems = items.filter(function(item){
          return item.name.toLowerCase().indexOf(criteria.toLowerCase()) >= 0;
        });
        loadLinks(filteredItems);
    }
}
function initialize(){
    var items = getCache();
    loadLinks(items);
    restore();
}
function loadLinks(items) {    
    if (sortByRank) {
        items.sort(function (a, b) {
            if (a.rank === b.rank) {
                return a.name.localeCompare(b.name);
            } else if (a.rank < b.rank) {
                return 1;
            } else if (a.rank > b.rank) {
                return -1;
            }
        });
    } else {
        items.sort(function (a, b) { return a.name > b.name });
    }
    clearDiv();
    var d = document.getElementById("dvLinks");
    for (var i = 0; i < items.length; i++) {
        var a = document.createElement('a');
        a.setAttribute("href", items[i].link);
        a.setAttribute("class", "link");
        a.setAttribute("onclick", "setRank("+ items[i].id + ");");
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
function setRank(id){
  var items = getCache();
  var index = items.findIndex(d => d.id == id);
  items[index].rank = items[index].rank +1;
  setCache(items);
}
