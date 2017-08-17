document.getElementById("btnSave").addEventListener("click", function () {
  save();
});
document.getElementById("btnClear").addEventListener("click", function () {
  clear();
});
document.getElementById("btnImg").addEventListener("click", function () {  
  document.getElementById("fileImg").click();
});
document.getElementById("fileImg").addEventListener("change", function () {
  loadImage();
});
document.getElementById("ddlSize").addEventListener("change", function () {
  loadImage();
});
document.getElementById("ddlQuality").addEventListener("change", function () {
  loadImage();
});

function loadImage(){
  if (document.getElementById("fileImg").value == "") { return; }
  document.getElementById("btnImg").style.display = "none";
  updateStatus("processing...");
  var reader = new FileReader();
  reader.onload = function (e) {
    var image = new Image();
    image.onload = function () {
      var canvas = document.getElementById("cvsImg");
      var orgWidth = image.width;
      var orgHeight = image.height;
      var revisedWidth = getWidth(image.width);
      if (image.width > revisedWidth) {
         image.height *= revisedWidth/image.width;
         image.width = revisedWidth;
      }
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      var dataUrl = canvas.toDataURL("image/jpeg", getQuality());
      document.getElementById("img").src = dataUrl;
      updateStatus("");
      var orgSize = document.getElementById("fileImg").files[0].size;
      var newSize = (dataUrl.length - "data:image/jpeg;base64,".length)*3/4;            
      updateSize(orgWidth, orgHeight, canvas.width, canvas.height, orgSize, newSize);
      showActions();
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(document.getElementById("fileImg").files[0]);
}
function save(){
  if (document.getElementById("fileImg").value == "") { return; }
  updateStatus("processing...");
  var canvas = document.getElementById("cvsImg");
  
  canvas.toBlob(function(blob){
    var a = document.createElement("a");
    a.download = "sample.jpeg";
    a.innerHTML = "save";
    a.href = URL.createObjectURL(blob);
    a.style.display = "none";
    a.onclick = function (event) { document.body.removeChild(event.target); };
    document.body.appendChild(a);
    a.click();
    updateStatus("");
  },'image/jpeg', getQuality());
}
function getWidth(currWidth){
  var widthPercent = parseInt(document.getElementById("ddlSize")[document.getElementById("ddlSize").selectedIndex].value);
  return (widthPercent/100) * currWidth;
}
function getQuality(){
  var qualityPercent = parseInt(document.getElementById("ddlQuality")[document.getElementById("ddlQuality").selectedIndex].value);
  return qualityPercent/100;
}
function updateStatus(status){
  if(status != ""){
    document.getElementById("dvImage").style.display = "none";
  }
  else{
    document.getElementById("dvImage").style.display = "block";
  }
  document.getElementById("spnStatus").innerHTML = status;
}
function clear(){
  document.getElementById("fileImg").value = "";
  document.getElementById("img").src = "";  
  document.getElementById("dvAction").style.display = "none";
  document.getElementById("dvSelects").style.display = "none";
  document.getElementById("dvImage").style.display = "none";
  document.getElementById("btnImg").style.display = "block";
}
function updateSize(orgWidth, orgHeight, newWidth, newHeight, orgSize, newSize){
  document.getElementById("spnResize").innerHTML = orgWidth + "x" + orgHeight + " => " + newWidth + "x" + newHeight;
  document.getElementById("spnCompress").innerHTML = fixSize(orgSize) + " => " + fixSize(newSize);
}
function showActions(){  
  document.getElementById("dvAction").style.display = "block";
  document.getElementById("dvSelects").style.display = "block";  
}
function fixSize(size){
  var ext = new Array('Bytes', 'KB', 'MB', 'GB');
  i=0;while(size>900){size/=1024;i++;}
  return (Math.round(size*100)/100) + " " + ext[i]
}
