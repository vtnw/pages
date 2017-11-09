    document.getElementById("btnImport").addEventListener("click", function(){
          loadFile(document.getElementById("tbKey").value);
      });
    function calcSize(){
        var items = [];
        var total = 0;
        var item;
        
        for(var key in localStorage){
            if(localStorage.hasOwnProperty(key)){
                item = {
                    "Key" : key,
                    "Size" : ((key.length + localStorage.getItem(key).length)*16)/(8*1024)
                    };
                items.push(item);
                total += item.Size;
            }
        }
        items.push({
            "Key" : "[Default]",
            "Size" : 3
            });
        total += 3;
        items.push({
            "Key" : "[Total]",
            "Size" : total
            });
        return items;
    }
    function showSize(items){
        for(var i = 0; i < items.length; i++){
            var dvItem = document.createElement("div");
            dvItem.className = "dvItem";
            if(items[i].Key == "[Default]"){
                dvItem.appendChild(document.createElement("hr"));
            }
            var spnKey = document.createElement("span");
            spnKey.className = "spnKey";
            spnKey.innerHTML = items[i].Key;
            dvItem.appendChild(spnKey);
            
            var spnSize = document.createElement("span");
            spnSize.className = "spnSize";
            spnSize.innerHTML = items[i].Size.toFixed(2) + " kb";
            dvItem.appendChild(spnSize);
            
            dvItem.appendChild(document.createElement("br"));
            
            if(items[i].Key != "[Default]"){
                var btnClear = document.createElement("input");
                btnClear.setAttribute("type", "button");
                btnClear.className = "btnClear";
                btnClear.value = "Clear";
                btnClear.key = items[i].Key;
                btnClear.addEventListener("click", function(){
                    if(confirm("Clear?")){
                        if(this.key == "[Total]"){
                            localStorage.clear();
                        } else {
                            localStorage.removeItem(this.key);
                        }
                    }
                });
                dvItem.appendChild(btnClear);

                var btnExport = document.createElement("input");
                btnExport.setAttribute("type", "button");
                btnExport.className = "btnExport";
                btnExport.value = "Export";
                btnExport.key = items[i].Key;
                btnExport.addEventListener("click", function(){
                    if(this.key == "[Total]"){
                        exportData(localStorage, "all");
                    } else {
                        exportData(localStorage.getItem(this.key), this.key);
                    }
                });
                dvItem.appendChild(btnExport);
                
                if(items[i].Key != "[Total]"){
                    var btnImport = document.createElement("input");
                    btnImport.setAttribute("type", "button");
                    btnImport.className = "btnImport";
                        btnImport.value = "Import";
                        btnImport.key = items[i].Key;
                        btnImport.addEventListener("click", function(){
                            if(confirm("Replace?")){
                                importData(this.key);
                            }
                        });
                        dvItem.appendChild(btnImport);
                    }
                }

                document.getElementById("dvItems").appendChild(dvItem);
            }
        }
        function exportData(data, key){
            if(document.getElementById("rf").checked){
                saveAsFile(data, key);
            }
            else{
                document.getElementById("tbData").value = key + "\n" + data;
            }
        }
        function importData(key){
            if(document.getElementById("rf").checked){
                loadFile(key);
            }
            else{
                localStorage.setItem(key, document.getElementById("tbData").value);
            }
        }
        function saveAsFile(data, key) {
            var a = document.createElement("a");
            a.download = "export" + "#" + key + "_" + getFormattedDate(false);
            a.innerHTML = "export";
            a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
            a.style.display = "none";
            a.onclick = function (event) { document.body.removeChild(event.target); };
            document.body.appendChild(a);
            a.click();
        }
        function loadFile(key) {
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                localStorage.setItem(key, event.target.result);
            };
            fileReader.readAsText(document.getElementById("fileImport").files[0], "UTF-8");
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
        showSize(calcSize());
