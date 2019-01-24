var cacheName = "home" + decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("u").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
var sortByRank = true;

document.getElementById("dvLinks").addEventListener("click", function () {
  document.getElementById("tbSearch").focus();
});

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
    if (n != '' && l != '') {
        var item = {"id": getNextIndex(), "name": n, "link": l, "rank": 0 };
        var items = getCache();
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
    } else {
        document.getElementById("dvLinkAdd").style.display = "none";
        document.getElementById("btnShowAdd").value = "Add";
    }
});
function search(){
    var criteria = document.getElementById("tbSearch").value;
    if(event.keyCode == 13){
        location.href = "https://www.google.com/search?q=" + criteria;
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
function getNextIndex() {
      var index = localStorage.getItem("index_" + cacheName);
      if (index == null) {
          index = 0;
      }
      else {
          index = parseInt(index);
      }
      index = index + 1;
      localStorage.setItem("index_" + cacheName, index);
      return index;
  }
