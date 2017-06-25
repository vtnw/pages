var clickX = new Array();
        var clickY = new Array();
        var clickDrag = new Array();
        var paint;
        var context;
        function addClick(x, y, dragging) {
            clickX.push(x);
            clickY.push(y);
            clickDrag.push(dragging);
        }
        function redraw() {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
            context.strokeStyle = "black";
            context.lineJoin = "round";
            context.lineWidth = 3;
            
            for (var i = 0; i < clickX.length; i++) {
                context.beginPath();
                if (clickDrag[i] && i) {
                    context.moveTo(clickX[i - 1], clickY[i - 1]);
                } else {
                    context.moveTo(clickX[i] - 1, clickY[i]);
                }
                context.lineTo(clickX[i], clickY[i]);
                context.closePath();
                context.stroke();
            }
        }
        window.onload = initialize();
        function initialize() {
            context = document.getElementById('canvas').getContext("2d");
            context.canvas.width  = window.innerWidth*96/100;
            context.canvas.height = window.innerHeight*93/100;
            document.getElementById('canvas').onmousedown = function (e) {
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                paint = true;
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                redraw();
            };
            document.getElementById('canvas').onmousemove =function (e) {
                if (paint) {
                    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                    redraw();
                }
            };
            document.getElementById('canvas').onmouseup = function (e) {
                paint = false;
            };
            document.getElementById('canvas').onmouseleave = function (e) {
                paint = false;
            };
            document.getElementById('canvas').addEventListener("touchstart", function (e) {
                mousePos = getTouchPos(document.getElementById('canvas'), e);
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                document.getElementById('canvas').dispatchEvent(mouseEvent);
            }, false);
            document.getElementById('canvas').addEventListener("touchend", function (e) {
                var mouseEvent = new MouseEvent("mouseup", {});
                document.getElementById('canvas').dispatchEvent(mouseEvent);
            }, false);
            document.getElementById('canvas').addEventListener("touchmove", function (e) {
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                document.getElementById('canvas').dispatchEvent(mouseEvent);
            }, false);
            document.body.addEventListener("touchstart", function (e) {
                if (e.target == canvas) {
                    e.preventDefault();
                }
            }, {passive: false });
            document.body.addEventListener("touchend", function (e) {
                if (e.target == canvas) {
                    e.preventDefault();
                }
            }, {passive: false });
            document.body.addEventListener("touchmove", function (e) {
                if (e.target == canvas) {
                    e.preventDefault();
                }
            }, { passive: false });
            document.getElementById('btnClear').onclick = function (e) {
                clickX = new Array();
                clickY = new Array();
                clickDrag = new Array();
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            }
                                            
            document.getElementById('btnSave').onclick = function (e) {
                context.globalCompositeOperation = "destination-over";
                context.fillStyle = 'white'; 
                context.fillRect(0,0,context.canvas.width,context.canvas.height);
                var image_data = document.getElementById('canvas').toDataURL("image/png");
                
                //var image_data = context.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                window.open(image_data);
            }
        }
        function getTouchPos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top
            };
        }
