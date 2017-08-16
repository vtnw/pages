document.getElementById("btnSave").addEventListener("click", function () {
  save();
});
document.getElementById("btnClear").addEventListener("click", function () {
  toggleClear();
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
  var reader = new FileReader();
  reader.onload = function (e) {
    var image = new Image();
    image.onload = function () {
      var canvas = document.getElementById("cvsImg");
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
      document.getElementById("img").src = canvas.toDataURL("image/jpeg", getQuality());
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(document.getElementById("fileImg").files[0]);
}
function save(){
  var canvas = document.getElementById("cvsImg");
  var imgUrl = canvas.toDataURL("image/jpeg", getQuality());
  var a = document.createElement("a");
  a.download = "sample.jpeg";
  a.innerHTML = "save";
  //a.href = window.URL.createObjectURL(new Blob([imgText], { type: "image/jpeg" }));
  a.href = imgUrl;
  a.style.display = "none";
  a.onclick = function (event) { document.body.removeChild(event.target); };
  document.body.appendChild(a);
  a.click();
}
function getWidth(currWidth){
  var widthPercent = parseInt(document.getElementById("ddlSize")[document.getElementById("ddlSize").selectedIndex].value);
  return (widthPercent/100) * currWidth;
}
function getQuality(){
  var qualityPercent = parseInt(document.getElementById("ddlQuality")[document.getElementById("ddlQuality").selectedIndex].value);
  return qualityPercent/100;
}
