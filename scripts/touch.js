var xDown = null;                                                        
var yDown = null;

document.addEventListener("touchstart", function(evt){
  alert("start");
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}, false);

document.addEventListener("touchmove", function(evt){
  if ( ! xDown || ! yDown ) {
      return;
  }

  var xUp = evt.touches[0].clientX;                                    
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;
  
  var event;
  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
      if ( xDiff > 0 ) {
          event = new Event('leftSwipe');
      } else {
          event = new Event('rightSwipe');
      }                       
  } else {
      if ( yDiff > 0 ) {
          event = new Event('upSwipe');
      } else { 
          event = new Event('downSwipe');
      }                                                                 
  }
  document.dispatchEvent(event);
  
  xDown = null;
  yDown = null;
}, false);
