/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 9/30/13
 * Time: 2:34 PM
 * To change this template use File | Settings | File Templates.
 */
Gh.define("Draw", ["Observer", "Config"], function (Observer, Config) {
    var Colors = Config.colors;
    var snaptogrid = false;
    var currentAction = "drawing";


    var draw = function (canvasID, brushImage) {
        this.renderFunction = (brushImage == null || brushImage == undefined) ? this.updateCanvasByDrawing : this.updateCanvasByBrush;
        this.brush = brushImage;
        this.baseline = null;
        this.freehand = new Array();
//        this.touchSupported = Modernizr.touch;
        this.canvasID = canvasID;
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = Colors.obj;
        this.context.lineWidth = 1;

        this.context.shadowColor = '#555';
        this.context.shadowBlur = 10;
        this.context.shadowOffsetX = 5;
        this.context.shadowOffsetY = 5;

        this.lastMousePoint = {x: 0, y: 0};
        this.center = {x: 0, y: 0};
        this.refPoint = {x: 0, y: 0};
        this.refPoint2 = {x: 0, y: 0};
        this.refVector = {x: 0, y: 0};
        this.moveStart = true; // move start or end point when dragging line

//        if (this.touchSupported) {
//            this.mouseDownEvent = "touchstart";
//            this.mouseMoveEvent = "touchmove";
//            this.mouseUpEvent = "touchend";
//        }
//        else {
        this.mouseDownEvent = "mousedown";
        this.mouseMoveEvent = "mousemove";
        this.mouseUpEvent = "mouseup";
//        }
        this.mouseDownHandler = this.onCanvasMouseDown();
//        this.canvas.bind( this.mouseDownEvent, this.mouseDownHandler );

    }

    draw.prototype = {
        onCanvasMouseDown: function () {
            var self = this;
            return function (event) {
                self.mouseMoveHandler = self.onCanvasMouseMove();
                self.mouseUpHandler = self.onCanvasMouseUp();

                self.canvas.addEventListener(self.mouseMoveEvent, self.mouseMoveHandler);
                self.canvas.addEventListener(self.mouseUpEvent, self.mouseUpHandler);
//        if (currentAction!="drawing"){
//            $(".functionWarp").append(
//                '<div class="functions">' +
//                    "..."+
//                '</div>'
//            );
//            divFunction = $(".functionWarp").children().last();
//        }
                self.updateMousePosition(event);
                self.center.x = self.lastMousePoint.x;
                self.center.y = self.lastMousePoint.y;
                self.renderFunction(event);
            }
        },
        onCanvasMouseMove: function () {
            var self = this;
            return function (event) {
                if (currentAction != "drawing") {
                    self.canvas.width = self.canvas.width;
//            self.context.lineWidth=$("#thickness").val() ;
                }
                self.renderFunction(event);
                event.preventDefault();
                return false;
            }
        },
        onCanvasMouseUp: function () {
            var self = this;
            return function (event) {
                $(document).unbind(self.mouseMoveEvent, self.mouseMoveHandler);
                $(document).unbind(self.mouseUpEvent, self.mouseUpHandler);

                self.mouseMoveHandler = null;
                self.mouseUpHandler = null;
//        console.log(self.canvas[0]);
                self.canvas[0].width = self.canvas[0].width;

                if (currentAction == "drawing") {
                    draw_freehand(self.freehand);
                    self.freehand = new Array();
                }
                if (currentAction == "line") {
                    draw_line(self.center, self.lastMousePoint);
                }
                if (currentAction == "ray") {
                    draw_ray(self.center, self.lastMousePoint);
                }
                if (currentAction == "circle") {
                    draw_circle(self.center, self.lastMousePoint);
                }
                if (currentAction == "sine") {
                    var delta = S2W(self.center);
                    var kx = (self.lastMousePoint.x - self.center.x) / scaleWorld;
                    var ky = (self.lastMousePoint.y - self.center.y) / scaleWorld;
                    draw_sin(delta.x, delta.y, kx, ky);
                }
                if (currentAction == "ellipse") {
                    self.focal1 = {x: snap(self.center).x, y: snap(self.center).y};
                    self.focal2 = {x: snap(self.lastMousePoint).x, y: snap(self.lastMousePoint).y};
                    self.context.strokeStyle = Colors.obj;
                    self.drawPoint(self.focal1);
                    self.drawPoint(self.focal2);
                    self.canvas.unbind(self.mouseDownEvent, self.mouseDownHandler);
                    self.mouseDownHandler = self.onExtraMouseDown();
                    self.canvas.bind(self.mouseDownEvent, self.mouseDownHandler);
                }
                if (currentAction == "textnote") {
                    var editableText = $(
                        '<textarea class="textnote" style="position:absolute;left:' + self.lastMousePoint.x + 'px;top:' + self.lastMousePoint.y + 'px;background-color: transparent;">SomeText</textarea>'
                    );
                    $(".appWrap").append(editableText);
                    editableText.focus();
                }
//        $(".functions").each(function () {
//            if ($(this).html().toString() == "...") {
//                $(this).remove();
//            }
//        });
            }
        },

        onObjectMouseDown: function () {
            var self = this;
            return function (event) {
                self.updateMousePosition(event);
                var selected = selectObject({x: self.lastMousePoint.x, y: self.lastMousePoint.y});
                selectedObj = selected;
                if (selected != undefined) {
                    $(".functions").each(function () {
                        if ($(this).html().toString() == selected.formula) {
                            $(this).css("color", "red");
                            divFunction = $(this);
                        }
                    });
                    console.log("removing " + selected.id);
                    removeKeyPoints(selected);
                    objects.splice(selectedIndex, 1);
                    refreshFinalCanvas();
                    highlight(selected);
                    self.center = {x: self.lastMousePoint.x, y: self.lastMousePoint.y};
                    if (selected.type == "line" || selected.type == "ray") {
                        self.moveStart = calDistance(S2W(self.center), selectedObj.start) < calDistance(S2W(self.center), selectedObj.end);
                        self.refPoint = {x: selected.start.x, y: selected.start.y};
                        self.refVector = {
                            x: selected.end.x - selected.start.x,
                            y: selected.end.y - selected.start.y
                        };
                    }
                    else if (selected.type == "circle") {
                        self.refPoint = {x: selected.center.x, y: selected.center.y};
                        self.refVector = {
                            x: selected.point.x - selected.center.x,
                            y: selected.point.y - selected.center.y
                        };
                    }
                    else if (selected.type == "text") {
                        self.refPoint = {x: selected.position.x, y: selected.position.y};
                    }
                    else if (selected.type == "ellipse") {
                        self.refPoint = {x: selected.focal1.x, y: selected.focal1.y};
                        self.refPoint2 = {x: selected.focal2.x, y: selected.focal2.y};
                        self.refVector = {
                            x: selected.point.x - selected.focal1.x,
                            y: selected.point.y - selected.focal1.y
                        };
                    }
                    self.mouseMoveHandler = self.onObjectMouseMove();
                    self.mouseUpHandler = self.onObjectMouseUp();
                    self.canvas.addEventListenser(self.mouseMoveEvent, self.mouseMoveHandler);
                    self.canvas.addEventListenser(self.mouseUpEvent, self.mouseUpHandler);
                }
                else {
                    selectedIndex = -1;
                    console.log("nothing selected");
                }
            }
        },
        onObjectMouseMove: function () {
            var self = this;
            return function (event) {
//        var startPoint = {x:self.lastMousePoint.x,y:self.lastMousePoint.y};
                self.updateMousePosition(event);
                var offsetVector = {
                    x: (self.lastMousePoint.x - self.center.x) / scaleWorld,
                    y: (-self.lastMousePoint.y + self.center.y) / scaleWorld
                };
                if (currentAction == "resize") {
                    if (selectedObj.type == "line" || selectedObj.type == "ray") {
                        if (self.moveStart) {
                            selectedObj.start = S2W(snap({
                                x: self.lastMousePoint.x,
                                y: self.lastMousePoint.y
                            }));
                        }
                        else {
                            selectedObj.end = S2W(snap({
                                x: self.lastMousePoint.x,
                                y: self.lastMousePoint.y
                            }));
                        }
                        selectedObj.A = selectedObj.end.y - selectedObj.start.y;
                        selectedObj.B = selectedObj.start.x - selectedObj.end.x;
                        selectedObj.C = selectedObj.start.y * selectedObj.end.x - selectedObj.start.x * selectedObj.end.y;
                    }
                    else if (selectedObj.type == "circle") {
                        selectedObj.point = S2W(snap({
                            x: self.lastMousePoint.x,
                            y: self.lastMousePoint.y
                        }));
                        selectedObj.radius = Math.sqrt(Math.pow((selectedObj.point.x - selectedObj.center.x), 2) + Math.pow((selectedObj.point.y - selectedObj.center.y), 2));
                    }
                }
                else if (currentAction == "move") {
                    if (selectedObj.type == "line" || selectedObj.type == "ray") {
                        if (self.moveStart) {
                            selectedObj.start = S2W(snap(W2S({
                                x: self.refPoint.x + offsetVector.x,
                                y: self.refPoint.y + offsetVector.y
                            })));
                            selectedObj.end = {
                                x: selectedObj.start.x + self.refVector.x,
                                y: selectedObj.start.y + self.refVector.y
                            };
                        }
                        else {
                            selectedObj.end = S2W(snap(W2S({
                                x: self.refPoint.x + self.refVector.x + offsetVector.x,
                                y: self.refPoint.y + self.refVector.y + offsetVector.y
                            })));
                            selectedObj.start = {
                                x: selectedObj.end.x - self.refVector.x,
                                y: selectedObj.end.y - self.refVector.y
                            };
                        }
                        selectedObj.A = selectedObj.end.y - selectedObj.start.y;
                        selectedObj.B = selectedObj.start.x - selectedObj.end.x;
                        selectedObj.C = selectedObj.start.y * selectedObj.end.x - selectedObj.start.x * selectedObj.end.y;
                    }
                    else if (selectedObj.type == "circle") {
                        selectedObj.center = S2W(snap(W2S({
                            x: self.refPoint.x + offsetVector.x,
                            y: self.refPoint.y + offsetVector.y
                        })));
                        selectedObj.point = {
                            x: selectedObj.center.x + self.refVector.x,
                            y: selectedObj.center.y + self.refVector.y
                        };
                    }
                    else if (selectedObj.type == "ellipse") {
                        selectedObj.focal1 = S2W(snap(W2S({
                            x: self.refPoint.x + offsetVector.x,
                            y: self.refPoint.y + offsetVector.y
                        })));
                        selectedObj.focal2 = S2W(snap(W2S({
                            x: self.refPoint2.x + offsetVector.x,
                            y: self.refPoint2.y + offsetVector.y
                        })));
                        selectedObj.point = {
                            x: selectedObj.focal1.x + self.refVector.x,
                            y: selectedObj.focal1.y + self.refVector.y
                        };
                    }
                    else if (selectedObj.type == "text") {
                        selectedObj.position = S2W(snap(W2S({
                            x: self.refPoint.x + offsetVector.x,
                            y: self.refPoint.y + offsetVector.y
                        })));
                    }
                }
                else if (currentAction == "delete") {
                    selectedObj = {id: -1};
                    $(document).unbind(self.mouseMoveEvent, self.mouseMoveHandler);
                    $(document).unbind(self.mouseUpEvent, self.mouseUpHandler);
                    self.mouseMoveHandler = null;
                    self.mouseUpHandler = null;
                }
                highlight(selectedObj);
            }
        },
        onObjectMouseUp: function () {
            var self = this;
            return function (event) {
                self.canvas[0].width = self.canvas[0].width;

                if (selectedObj.type == "line") {
                    draw_line(W2S(selectedObj.start), W2S(selectedObj.end));
                }
                if (selectedObj.type == "ray") {
                    draw_ray(W2S(selectedObj.start), W2S(selectedObj.end));
                }
                else if (selectedObj.type == "circle") {
                    draw_circle(W2S(selectedObj.center), W2S(selectedObj.point));
                }
                else if (selectedObj.type == "ellipse") {
                    draw_ellipse(W2S(selectedObj.focal1), W2S(selectedObj.focal2), W2S(selectedObj.point));
                }
                else if (selectedObj.type == "text") {
                    var position = W2S(selectedObj.position);
                    var editableText = $(
                        '<textarea class="textnote" style="position:absolute;left:' + position.x + 'px;top:' + position.y + 'px;background-color: transparent;">' + selectedObj.content + '</textarea>'
                    );
                    $(".appWrap").append(editableText);
                    editableText.focus();
                }
                selectedObj = {id: -1};
                $(document).unbind(self.mouseMoveEvent, self.mouseMoveHandler);
                $(document).unbind(self.mouseUpEvent, self.mouseUpHandler);
                self.mouseMoveHandler = null;
                self.mouseUpHandler = null;
            }
        },

        onExtraMouseMove: function () {
            var self = this;
            return function (event) {
                if (currentAction == "ellipse") {
                    self.canvas[0].width = self.canvas[0].width;
                    self.updateCanvasByEllipse(event);
                }
                event.preventDefault();
                return false;
            }
        },
        onExtraMouseUp: function () {
            var self = this;
            return function (event) {
                $(document).unbind(self.mouseMoveEvent, self.mouseMoveHandler);
                $(document).unbind(self.mouseUpEvent, self.mouseUpHandler);
                self.canvas.unbind(self.mouseDownEvent, self.mouseDownHandler);
//        self.mouseMoveEvent = null;
//        self.mouseUpEvent = null;
                self.mouseDownHandler = self.onCanvasMouseDown();
                self.canvas.bind(self.mouseDownEvent, self.mouseDownHandler);
                self.canvas[0].width = self.canvas[0].width;
                if (currentAction == "ellipse") {
                    draw_ellipse(self.focal1, self.focal2, self.lastMousePoint);
                }
                selectedObj = {id: -1};
            }
        },
        onExtraMouseDown: function () {
            var self = this;
            return function (event) {
                self.mouseMoveHandler = self.onExtraMouseMove();
                self.mouseUpHandler = self.onExtraMouseUp();
                self.canvas.addEventListenser(self.mouseMoveEvent, self.mouseMoveHandler);
                self.canvas.addEventListenser(self.mouseUpEvent, self.mouseUpHandler);
                if (currentAction == "ellipse") {
                    self.canvas[0].width = self.canvas[0].width;
                    self.updateCanvasByEllipse(event);
                }
            }
        },


        updateMousePosition: function (event) {
            this.lastMousePoint = { x: event.clientX, y: event.clientY };
        },

        drawPoint: function (point) {
            this.context.beginPath();
            point = snap(point);
            this.context.arc(point.x, point.y, 2, 0, 2 * Math.PI, true);
            this.context.stroke();
        },

        updateCanvasByDrawing: function (event) {
            this.context.lineCap = 'round';
            this.context.strokeStyle = Colors.obj;
            this.context.beginPath();
            if (snaptogrid) {
                this.lastMousePoint = snapToGrid(this.lastMousePoint);
            }

            this.context.moveTo(this.lastMousePoint.x, this.lastMousePoint.y);
            this.updateMousePosition(event);
            if (snaptogrid) {
                this.lastMousePoint = snapToGrid(this.lastMousePoint);
            }
            if (currentAction == "drawing") {
                this.freehand.push(this.S2W(this.lastMousePoint));
            }
            this.context.lineTo(this.lastMousePoint.x, this.lastMousePoint.y);
            this.context.stroke();
        },

        updateCanvasByLine: function (event) {
            this.context.lineCap = 'round';
            this.context.strokeStyle = Colors.obj;
            this.drawPoint(this.center);
            this.context.beginPath();
            this.center = snap(this.center);
            this.context.moveTo(this.center.x, this.center.y);
            this.updateMousePosition(event);
            this.lastMousePoint = snap(this.lastMousePoint);
            if ((currentAction == "line" || currentAction == "ray") && snaptotangent) {
                var object = selectObject(this.lastMousePoint);
                if (object != undefined && object.type == "circle") {
                    var d = calDistance(object.center, S2W(this.center));
                    var l = Math.sqrt(d * d - object.radius * object.radius);
                    var f = Math.asin(object.radius / d);
//            console.log("d="+d+",i="+i+"f="+f);
                    var vx = (object.center.x - S2W(this.center).x) / d;
                    var vy = (object.center.y - S2W(this.center).y) / d;
                    var tp1 = W2S({
                        x: (vx * Math.cos(f) - vy * Math.sin(f)) * l + S2W(this.center).x,
                        y: (vx * Math.sin(f) + vy * Math.cos(f)) * l + S2W(this.center).y
                    });
                    var tp2 = W2S({
                        x: (vx * Math.cos(-f) - vy * Math.sin(-f)) * l + S2W(this.center).x,
                        y: (vx * Math.sin(-f) + vy * Math.cos(-f)) * l + S2W(this.center).y
                    });
                    this.lastMousePoint = (calDistance(this.lastMousePoint, tp1) < calDistance(this.lastMousePoint, tp2)) ? tp1 : tp2;
                }
                else if (object != undefined && object.type == "ellipse") {
                    var tp = getTangentPoint(S2W(this.center), object);
                    if (tp.length == 2) {
                        tp[0] = W2S(tp[0]);
                        tp[1] = W2S(tp[1]);
                        this.lastMousePoint = (calDistance(this.lastMousePoint, tp[0]) < calDistance(this.lastMousePoint, tp[1])) ? tp[0] : tp[1];
                    }
                }
            }
            this.context.lineTo(this.lastMousePoint.x, this.lastMousePoint.y);
            this.context.stroke();
            this.drawPoint(this.lastMousePoint);
        },

        updateCanvasByCircle: function (event) {
            this.context.lineCap = 'round';
            this.context.strokeStyle = Colors.obj;
            var radius;
            this.drawPoint(this.center);
            this.context.beginPath();
            this.center = snap(this.center);
            this.updateMousePosition(event);
            this.lastMousePoint = snap(this.lastMousePoint);
            radius = Math.pow((this.lastMousePoint.x - this.center.x), 2) + Math.pow((this.lastMousePoint.y - this.center.y), 2);
            this.context.arc(this.center.x, this.center.y, Math.sqrt(radius), 0, 2 * Math.PI, false);
            this.context.stroke();
            this.drawPoint(this.lastMousePoint);
        },

        updateCanvasByEllipse: function (event) {
            this.context.lineCap = 'round';
            this.context.strokeStyle = Colors.obj;
            this.drawPoint(this.focal1);
            this.drawPoint(this.focal2);
            this.context.beginPath();
            var f = 0.5 * Math.sqrt(Math.pow((this.focal2.x - this.focal1.x), 2) + Math.pow((this.focal2.y - this.focal1.y), 2));
            this.updateMousePosition(event);
            this.lastMousePoint = snap(this.lastMousePoint);
            var a = (calDistance(this.lastMousePoint, this.focal1) + calDistance(this.lastMousePoint, this.focal2)) / 2;
            var b = Math.sqrt(a * a - f * f);
            this.context.ellipse(
                (this.focal1.x + this.focal2.x) / 2,
                (this.focal1.y + this.focal2.y) / 2,
                a, b, 0, 2,
                Math.atan((this.focal2.y - this.focal1.y) / (this.focal2.x - this.focal1.x))
            );
            this.context.stroke();
            this.drawPoint(this.lastMousePoint);
        },

        updateCanvasBySine: function (event) {
            this.context.lineCap = 'round';
            this.context.strokeStyle = Colors.obj;
            this.drawPoint(this.center);
            this.context.beginPath();
            this.center = snap(this.center);
//    this.context.moveTo( this.center.x, this.center.y );
            this.updateMousePosition(event);
            this.lastMousePoint = snap(this.lastMousePoint);
//    this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
            var pointWorld = {x: 0, y: 0}, pointScreen;
            var delta = S2W(this.center);
            var kx = (this.lastMousePoint.x - this.center.x) / scaleWorld;
            var ky = (this.lastMousePoint.y - this.center.y) / scaleWorld;
            for (pointWorld.x = -centerX / scaleWorld; pointWorld.x < ($(".appWrap").width() - centerX) / scaleWorld; pointWorld.x += scale / 10) {
                pointWorld.y = -ky * Math.sin((pointWorld.x - delta.x) * Math.PI / 2 / kx) + delta.y;
                pointScreen = W2S(pointWorld);
                this.context.lineTo(pointScreen.x, pointScreen.y);
//        context.moveTo(pointScreen.x,pointScreen.y);
            }
            this.context.stroke();
            this.drawPoint(this.lastMousePoint);
        },

        updateCanvasByText: function (event) {
//    var editableText = $(
//        '<div class="textnote" style="position:absolute;left:'+this.lastMousePoint.x+'px;top:'+this.lastMousePoint.y+'px;">' +
//            '<textarea style="background-color: transparent;">SomeText</textarea>' +
//        '</div>'
//    );
//    $(".appWrap").append(editableText);
//    editableText.focus();
        },

        updateCanvasByBrush: function (event) {
            var halfBrushW = this.brush.width / 2;
            var halfBrushH = this.brush.height / 2;

            var start = { x: this.lastMousePoint.x, y: this.lastMousePoint.y };
            this.updateMousePosition(event);
            var end = { x: this.lastMousePoint.x, y: this.lastMousePoint.y };

            var distance = parseInt(Trig.distanceBetween2Points(start, end));
            var angle = Trig.angleBetween2Points(start, end);

            var x, y;

            for (var z = 0; (z <= distance || z == 0); z++) {
                x = start.x + (Math.sin(angle) * z) - halfBrushW;
                y = start.y + (Math.cos(angle) * z) - halfBrushH;
                //console.log( x, y, angle, z );
                this.context.drawImage(this.brush, x, y);
            }
        },

        W2S: function (worldPoint) {
            return {
                x: this.centerX + worldPoint.x * scaleWorld,
                y: this.centerY - worldPoint.y * scaleWorld
            }
        },

        S2W: function (screenPoint) {
            return {
                x: (screenPoint.x - this.centerX) / scaleWorld,
                y: (this.centerY - screenPoint.y) / scaleWorld
            }
        },

        toString: function () {

            var dataString = this.canvas.get(0).toDataURL("image/png");
            var index = dataString.indexOf(",") + 1;
            dataString = dataString.substring(index);

            return dataString;
        },

        toDataURL: function () {

            var dataString = this.canvas.get(0).toDataURL("image/png");
            return dataString;
        },

        clear: function () {

            var c = this.canvas[0];
            this.context.clearRect(0, 0, c.width, c.height);

            ///yang
            this.isEmpty = true;
        }
    }.extend(Observer);

    return draw;
});

CanvasRenderingContext2D.prototype.ellipse = function (x, y, a, b, startAngle, endAngle, rotation) {
    var cxt = this;
    cxt.beginPath();
    for (var i = startAngle * Math.PI; i < endAngle * Math.PI; i += 0.01) {
        xPos = x - (b * Math.sin(i)) * Math.sin(rotation) + (a * Math.cos(i)) * Math.cos(rotation);
        yPos = y + (a * Math.cos(i)) * Math.sin(rotation) + (b * Math.sin(i)) * Math.cos(rotation);

        if (i == 0) {
            cxt.moveTo(xPos, yPos);
        } else {
            cxt.lineTo(xPos, yPos);
        }
    }
//    cxt.lineWidth = 1;
    cxt.stroke();
    cxt.closePath();
}
