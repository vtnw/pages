var listName = "list_";
  document.getElementById("btnAdd").addEventListener("click", function () {
      addItem();
  });
  document.getElementById("btnSave").addEventListener("click", function () {
      saveList();
      toggleSave(false);
  });
  document.getElementById("btnImport").addEventListener("click", function () {
      toggleImport();
  });
  document.getElementById("btnMore").addEventListener("click", function () {
      toggleMore();
  });
  document.getElementById("btnReplace").addEventListener("click", function () {
      loadFile(1);
      toggleImport();
  });
  document.getElementById("btnMerge").addEventListener("click", function () {
      loadFile(0);
      toggleImport();
  });
  document.getElementById("btnExport").addEventListener("click", function () {
      saveAsFile();
  });
  document.getElementById("btnClear").addEventListener("click", function () {
      if (confirm("Clear?")) {
          clearList();
          toggleSave(true);
      }
  });
  document.getElementById("btnReset").addEventListener("click", function () {
      resetSelection(confirm("Retain pending items?"));
  });
  document.getElementById("ddlFilter").addEventListener("change", function () {
      loadList();
  });
  document.getElementById("ddlFilterBuy").addEventListener("change", function () {
      loadList();
  });
  document.getElementById("ddlMode").addEventListener("change", function () {
      loadList();
  });
  document.getElementById("ddlList").addEventListener("change", function () {
      initialize();
  });

  var listData = [];
  function initialize() {
      listData = getCache();
      loadList();
  }
  function loadList() {
      document.getElementById("dvList").innerHTML = "";
      type = document.getElementById("ddlFilter").selectedIndex;
      buyType = document.getElementById("ddlFilterBuy").selectedIndex;
      mode = document.getElementById("ddlMode").selectedIndex;
      count = 0;
      listData.sort(function(a,b){return a.Type.localeCompare(b.Type)});
      for (i = 0; i < listData.length; i++) {
          if((mode == 0 && type == 0)
             || (mode == 0 && type == 1 && listData[i].Buy)
             || (mode == 0 && type == 2 && !listData[i].Buy)
             || (mode == 1 && buyType == 0 && listData[i].Buy)
             || (mode == 1 && buyType == 1 && listData[i].Buy && listData[i].Bought)
             || (mode == 1 && buyType == 2 && listData[i].Buy && !listData[i].Bought)){
                  addToDiv(document.getElementById("dvList"), listData[i], false, mode);
              count = count+1;
          }
      }
      document.getElementById("spnCount").innerHTML = "(" + count + ")";
      document.getElementById("spnBoughtCount").innerHTML = "(" + count + ")";
      toggleMode(mode);
  }
  function clearList() {
    if(confirm("Reset Index?")){
      localStorage.removeItem("index_list");
    }
    type = document.getElementById("ddlFilter").selectedIndex;
    revisedListData = [];
    for (i = 0; i < listData.length; i++) {
        if((type == 1 && !listData[i].Buy)
           || (type == 2 && listData[i].Buy)){
                revisedListData.push(listData[i]);
        }
    }
    listData = revisedListData;
    loadList();
  }
  function resetSelection(retainPending) {
      for (i = 0; i < listData.length; i++) {
          if(listData[i].Buy
            && (listData[i].Bought || !retainPending)){
              listData[i].Buy = false;
              listData[i].Bought = false;
          }
      }
      loadList();
  }
  function saveToList(item) {
      if (item.Id == null) {
          item.Id = getNextIndex();
          listData.push(item);
      }
      else {
          i = listData.findIndex((d => d.Id == item.Id));
          listData[i] = item;
      }
      toggleSave(true);
      return item;
  }
  function saveList() {
      setCache(listData);
  }
  function saveAsFile() {
      exportData = [];
      for (i = 0; i < listData.length; i++) {
          if((type == 0)
             || (type == 1 && listData[i].Buy)
             || (type == 2 && !listData[i].Buy)){
                  exportData.push(listData[i]);
          }
      }
      var a = document.createElement("a");
      a.download = "list_" + getFormattedDate();
      a.innerHTML = "export";
      a.href = window.URL.createObjectURL(new Blob([JSON.stringify(exportData)], { type: "text/plain" }));
      a.style.display = "none";
      a.onclick = function (event) { document.body.removeChild(event.target); };
      document.body.appendChild(a);
      a.click();
  }
  function loadFile(replace) {
      var fileReader = new FileReader();
      fileReader.onload = function(event) {
          importedData = JSON.parse(event.target.result);
          if(replace){
              listData = [];
          }
          for (i = 0; i < importedData.length; i++) {
              importedData[i].Id = getNextIndex();
              listData.push(importedData[i]);
          }
          loadList();
          toggleSave(true);
      };
      fileReader.readAsText(document.getElementById("fileImport").files[0], "UTF-8");
  }
  function addToDiv(d, item, addToTop, mode) {
      dv = document.createElement('div');
      dv.id = "dvItem" + item.Id;
      if(item.Buy) {
          dv.style.color = (item.Bought) ? "green" : "blue";
      }
      tb = document.createElement('input');
      tb.setAttribute("type", "text");
      tb.setAttribute("itemId", item.Id);
      tb.id = "tbType" + item.Id;
      tb.value = item.Type;
      tb.className = "type";
      tb.addEventListener("blur", function () { saveItem(this); });
      //if (mode == 1) { tb.setAttribute("readOnly", "true");}
      dv.appendChild(tb);
      tb = document.createElement('input');
      tb.setAttribute("type", "text");
      tb.setAttribute("itemId", item.Id);
      tb.id = "tbName" + item.Id;
      tb.value = item.Name;
      tb.className = "name";
      tb.addEventListener("blur", function () { saveItem(this); });
      if (mode == 1) { tb.setAttribute("readOnly", "true");}
      dv.appendChild(tb);
      tb = document.createElement('input');
      tb.setAttribute("type", "text");
      tb.setAttribute("itemId", item.Id);
      tb.id = "tbRemark" + item.Id;
      tb.value = item.Remark;
      tb.className = "rem";
      tb.addEventListener("blur", function () { saveItem(this); });
      if (mode == 1) { tb.setAttribute("readOnly", "true");}
      dv.appendChild(tb);
      tb = document.createElement('input');
      tb.setAttribute("type", "text");
      tb.setAttribute("itemId", item.Id);
      tb.id = "tbQuantity" + item.Id;
      tb.value = item.Quantity;
      tb.className = "qty";
      tb.addEventListener("blur", function () { saveItem(this); });
      if (mode == 1) { tb.setAttribute("readOnly", "true");}
      dv.appendChild(tb);
      tb = document.createElement('input');
      tb.setAttribute("type", "checkbox");
      tb.setAttribute("itemId", item.Id);
      tb.id = "cbBuy" + item.Id;
      tb.checked = item.Buy;
      tb.addEventListener("click", function () { saveItem(this); });
      if (mode == 1) { tb.style.display = "none";}
      dv.appendChild(tb); 
      tb = document.createElement('input');
      tb.setAttribute("type", "checkbox");
      tb.setAttribute("itemId", item.Id);
      tb.id = "cbBought" + item.Id;
      tb.checked = item.Bought;
      tb.addEventListener("click", function () { saveItem(this); });
      if (mode == 0) { tb.style.display = "none";}
      dv.appendChild(tb); 
      if(addToTop){
          d.insertBefore(dv, d.firstChild);
      } else{
          d.appendChild(dv);
      }
  }
  function saveItem(element) {
      id = element.getAttribute("itemId");
      item = {
          Id: id,
          Type: document.getElementById("tbType" + id).value,
          Name: document.getElementById("tbName" + id).value,
          Remark: document.getElementById("tbRemark" + id).value,
          Quantity: document.getElementById("tbQuantity" + id).value,
          Buy: document.getElementById("cbBuy" + id).checked,
          Bought: document.getElementById("cbBought" + id).checked
      }
      saveToList(item);
      updateColor(item);
  }
  function updateColor(item) {
      if(item.Buy){
          document.getElementById("dvItem" + id).style.color = (item.Bought) ? "green" : "blue";
      }
      else {
          document.getElementById("dvItem" + id).style.color = "black";
      }
  }
  function toggleSave(status){
      if (status) {
          document.getElementById("btnSave").style.color = "red"
      }
      else{
          document.getElementById("btnSave").style.color = "green"
      }
  }
  function toggleImport(){
      if (document.getElementById("dvImport").style.display == "none") {
          document.getElementById("dvImport").style.display = "block";
          document.getElementById("btnImport").value = "Cancel";
          document.getElementById("fileImport").value = "";
      }
      else{
          document.getElementById("dvImport").style.display = "none";
          document.getElementById("btnImport").value = "Import";
      }
  }        
  function toggleMore(){
      if (document.getElementById("dvMore").style.display == "none") {
          document.getElementById("dvMore").style.display = "block";
          document.getElementById("btnMore").value = "<<<";
      }
      else{
          document.getElementById("dvMore").style.display = "none";
          document.getElementById("btnMore").value = ">>>";
      }
  }        
  function toggleMode(mode){
      if (mode == 0) {
          document.getElementById("spnCount").style.display = "inline";
          document.getElementById("dvEdit").style.display = "block";
          document.getElementById("spnBoughtCount").style.display = "none";
          document.getElementById("btnMore").style.display = "inline";
          document.getElementById("ddlFilterBuy").style.display = "none";
          document.getElementById("ddlFilter").style.display = "inline";
      }
      else{
          document.getElementById("spnCount").style.display = "none";
          document.getElementById("dvEdit").style.display = "none";
          document.getElementById("spnBoughtCount").style.display = "inline";
          document.getElementById("btnMore").style.display = "none";
          document.getElementById("ddlFilterBuy").style.display = "inline";
          document.getElementById("ddlFilter").style.display = "none";
      }
  }        
  function addItem() {
      item = {Id: null, Type: null, Name: null, Remark: null, Quantity: null, Buy: false, Bought: false};
      item = saveToList(item);
      mode = document.getElementById("ddlMode").selectedIndex;
      addToDiv(document.getElementById("dvList"), item, true, mode);
  }
  function getListName(){
    var ddl = document.getElementById("ddlList");
    return ddl.options[ddl.selectedIndex].value;
  }
  function getNextIndex() {
      var index = localStorage.getItem("index_list");
      if (index == null) {
          index = 0;
      }
      else {
          index = parseInt(index);
      }
      index = index + 1;
      localStorage.setItem("index_list", index);
      return index;
  }
  function getCache() {
      var items = JSON.parse(localStorage.getItem(listName + getListName()));
      if (items == null) {
          items = [];
      }
      return items;
  }
  function setCache(items) {
      localStorage.setItem(listName + getListName(), JSON.stringify(items));
  }
  function getFormattedDate(){
      var d = new Date();
      d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
      return d;
  }
