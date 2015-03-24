Gh.define("Baseline", ["Observer", "Config", "ShapeType"], function (Observer, Config, ShapeType) {
//  var centerX = Config.centerX;
//  var centerY = Config.centerY;
    var scaleWorld = Config.scaleWorld;
    var canvasDiv = Config.canvasDiv;
    var draftCanvas = Config.draftCanvas;
    var finalCanvas = Config.finalCanvas;
    var baselineCanvas = Config.baselineCanvas;
    var colors = Config.colors;
//  var gridSize = Config.gridSize;

    var Baseline = function () {
        this.game = null;
        this.canvasDiv = null;
        this.draftCanvas = null;
        this.finalCanvas = null;
        this.baselineCanvas = null;
        this.centerX = null;
        this.centerY = null;
        this.scaleWorld = scaleWorld;
        this.refPoints = {};

        this.mouseDownEvent = "pointerdown";
        this.mouseMoveEvent = "pointermove";
        this.mouseUpEvent = "pointerup";

        this.pointerId = undefined;
        this.pointerDown = {};
        this.lastPositions = {};
        this.selectedVertex = undefined;
        this.selectedShape = undefined;
        this.renderFunction = function () {
        };

        this._currentAction = "select";
        Object.defineProperty(this, "currentAction", {
            set: function (value) {
                var old = this._currentAction;
                this._currentAction = value;
                if (old != value) {
                    this.switchMode(this._currentAction);
                    this.setRenderFunction(this._currentAction);
                }
            },
            get: function () {
                return this._currentAction;
            }
        });

    };

    Baseline.prototype = {
        init: function () {
            this.canvasDiv = document.getElementById(canvasDiv);
            this.canvasDiv.style.width = window.innerWidth;
            this.canvasDiv.style.height = window.innerHeight;
            this.canvasDiv.style.backgroundColor = '#fff';
            this.canvasDiv.innerHTML = '<canvas id="' + draftCanvas + '" width=' + (this.canvasDiv.offsetWidth) + ' height=' + (this.canvasDiv.offsetHeight) + '></canvas>' +
                '<canvas id="' + finalCanvas + '" width=' + (this.canvasDiv.offsetWidth) + ' height=' + (this.canvasDiv.offsetHeight) + '></canvas>' +
                '<canvas id="' + baselineCanvas + '" width=' + (this.canvasDiv.offsetWidth) + ' height=' + (this.canvasDiv.offsetHeight) + '></canvas>';
            this.draftCanvas = document.getElementById(draftCanvas);
            this.finalCanvas = document.getElementById(finalCanvas);
            this.baselineCanvas = document.getElementById(baselineCanvas);
            this.centerX = Math.round(this.canvasDiv.offsetWidth / 40) * 20;
            this.centerY = Math.round(this.canvasDiv.offsetHeight / 40) * 20;
            this.drawGrid();
            this.focusCanvas(draftCanvas);
            this.mouseDownHandler = this.onObjectMouseDown();
            this.mouseMoveHandler = this.onObjectMouseMove();
            this.mouseUpHandler = this.onObjectMouseUp();
            this.draftCanvas.addEventListener(this.mouseDownEvent, this.mouseDownHandler, false);
            this.draftCanvas.addEventListener(this.mouseMoveEvent, this.mouseMoveHandler, false);
            this.draftCanvas.addEventListener(this.mouseUpEvent, this.mouseUpHandler, false);
            this.currentAction = "select";
        },

        switchMode: function (currentAction) {
            this.draftCanvas.removeEventListener(this.mouseDownEvent, this.mouseDownHandler, false);
            this.draftCanvas.removeEventListener(this.mouseMoveEvent, this.mouseMoveHandler, false);
            this.draftCanvas.removeEventListener(this.mouseUpEvent, this.mouseUpHandler, false);
            if (currentAction == "select") {
//                this.draftCanvas.style.cursor = 'url("../img/icons/pencil.cur")';
                this.mouseDownHandler = this.onObjectMouseDown();
                this.mouseMoveHandler = this.onObjectMouseMove();
                this.mouseUpHandler = this.onObjectMouseUp();
                this.draftCanvas.addEventListener(this.mouseDownEvent, this.mouseDownHandler, false);
                this.draftCanvas.addEventListener(this.mouseMoveEvent, this.mouseMoveHandler, false);
                this.draftCanvas.addEventListener(this.mouseUpEvent, this.mouseUpHandler, false);
            }
            else {
                this.mouseDownHandler = this.onCanvasMouseDown();
                this.draftCanvas.addEventListener(this.mouseDownEvent, this.mouseDownHandler, false);
            }
        },

        setRenderFunction: function (currentAction) {
            if (currentAction == "drawing") {
                this.renderFunction = this.updateCanvasByDrawing;
            }
            else if (currentAction == "line") {
                this.renderFunction = this.updateCanvasByLine;
            }
            else if (currentAction == "circle") {
                this.renderFunction = this.updateCanvasByCircle;
            }
        },

        updateMousePosition: function (event) {
            this.lastPositions[event.pointerId] = { x: event.clientX, y: event.clientY };
        },

        selectVertex: function (tapPosScreen) {
            var nearest = 40 / scaleWorld;
            var tapPos = this.S2W(tapPosScreen);
            var self = this;
            var shapes = this.game.shapes;
            var i, j;
            for (i = 0; i < shapes.length; i++) {
                if (!shapes[i].hidden) {
                    var error;
                    if (shapes[i].type == ShapeType.TRIANGLE || shapes[i].type == ShapeType.LINE) {
                        var vertices = shapes[i].vertices;
                        for (j = 0; j < vertices.length; j++) {
                            error = this.calDistance(tapPos, vertices[j]);
                            if (error < nearest) {
                                nearest = error;
                                self.selectedVertex = vertices[j];
                                self.selectedShape = shapes[i];
                            }
                        }
                    }
//                    else if (shapes[i].type == ShapeType.LINE) {
//
//                    }
                    else if (shapes[i].type == ShapeType.POINT) {
                        error = this.calDistance(tapPos, shapes[i]);
                        if (error < nearest) {
                            nearest = error;
                            self.selectedVertex = shapes[i];
                            self.selectedShape = shapes[i];
                        }
                    }
                    else if (shapes[i].type == ShapeType.CIRCLE) {
                        error = this.calDistance(tapPos, shapes[i].center);
                        if (error < nearest) {
                            nearest = error;
                            self.selectedVertex = shapes[i].center;
                            self.selectedShape = shapes[i];
                        }
                        if (Math.abs(error - shapes[i].radius) < nearest) {
                            nearest = Math.abs(error - shapes[i].radius);
                            self.selectedVertex = shapes[i].point;
                            self.selectedShape = shapes[i];
                        }
                    }
                }
            }
        },

        /*
         * Draw temporary shape on draftCanvas in highlight color.
         * @Deprecated
         */
        highlight: function (shape) {
            switch (shape.type) {
                case 7:
                    this.highlightTriangle(shape);
                    break;
                case 6:
                    this.highlightPoint(shape);
                    break;
            }
        },

        /*
         * Draw temporary point on draftCanvas in highlight color.
         * @Deprecated
         */
        highlightPoint: function (point) {
            var context = this.draftCanvas.getContext("2d");
            this.draftCanvas.width = this.draftCanvas.width;
            context.fillStyle = 'red';
//      context.beginPath();
//      context.arc(point.pageX, point.pageY, 2, 0, 2*Math.PI);
//      context.fill();

            this.drawPoint(point, false);
        },

        /*
         * Draw temporary triangle on draftCanvas in highlight color.
         * @Deprecated
         */
        highlightTriangle: function (tri) {
            var context = this.draftCanvas.getContext("2d");
            var A = tri.vertices[0], B = tri.vertices[1], C = tri.vertices[2];

            this.draftCanvas.width = this.draftCanvas.width;
            context.lineCap = 'round';
            context.strokeStyle = 'red';
            context.beginPath();
            context.moveTo(A.pageX, A.pageY);
            context.lineTo(B.pageX, B.pageY);
            context.lineTo(C.pageX, C.pageY);
            context.lineTo(A.pageX, A.pageY);
            context.lineWidth = 3;
            context.stroke();
            this.drawAngle(A, B, C, false);
            this.drawAngle(B, C, A, false);
            this.drawAngle(C, A, B, false);
        },

        onCanvasMouseDown: function () {
            var self = this;
            return function (event) {
                self.mouseMoveHandler = self.onCanvasMouseMove();
                self.mouseUpHandler = self.onCanvasMouseUp();

                self.draftCanvas.addEventListener(self.mouseMoveEvent, self.mouseMoveHandler);
                self.draftCanvas.addEventListener(self.mouseUpEvent, self.mouseUpHandler);

//        if (currentAction!="drawing"){
//            $(".functionWarp").append(
//                '<div class="functions">' +
//                    "..."+
//                '</div>'
//            );
//            divFunction = $(".functionWarp").children().last();
//        }
                self.updateMousePosition(event);
                self.refPoints[event.pointerId] = self.lastPositions[event.pointerId];
                self.renderFunction(event);
            }
        },
        onCanvasMouseMove: function () {
            var self = this;
            return function (event) {
                if (self._currentAction != "drawing") {
                    self.draftCanvas.width = self.draftCanvas.width;
                }
                self.renderFunction(event);
                event.preventDefault();
                return false;
            }
        },
        onCanvasMouseUp: function () {
            var self = this;
            return function (event) {
                self.draftCanvas.removeEventListener(self.mouseMoveEvent, self.mouseMoveHandler, false);
                self.draftCanvas.removeEventListener(self.mouseUpEvent, self.mouseUpHandler, false);
                self.mouseMoveHandler = null;
                self.mouseUpHandler = null;
                self.draftCanvas.width = self.draftCanvas.width;
                if (self._currentAction == "drawing") {

                }
                else if (self._currentAction == "line") {
                    var line = {
                        type: ShapeType.LINE,
                        vertices: [
                            {
                                x: self.S2W(self.refPoints[event.pointerId]).x,
                                y: self.S2W(self.refPoints[event.pointerId]).y,
                                name: 'X'
                            },
                            {
                                x: self.S2W(self.lastPositions[event.pointerId]).x,
                                y: self.S2W(self.lastPositions[event.pointerId]).y,
                                name: 'Y'
                            }
                        ]
                    }
                    self.game.createShape(line).draw();
                }
                else if (self._currentAction == "circle") {
                    var circle = {
                        type: ShapeType.CIRCLE,
                        center: {
                            x: self.S2W(self.refPoints[event.pointerId]).x,
                            y: self.S2W(self.refPoints[event.pointerId]).y,
                            name: 'O'
                        },
                        point: {
                            x: self.S2W(self.lastPositions[event.pointerId]).x,
                            y: self.S2W(self.lastPositions[event.pointerId]).y,
                            name: 'P'
                        },
                        radius: self.calDistance(self.S2W(self.lastPositions[event.pointerId]), self.S2W(self.refPoints[event.pointerId]))
                    }
                    self.game.createShape(circle).draw();
                }
                self.refPoints = {};
                self.lastPositions = {};
//                if (currentAction == "drawing") {
//                    draw_freehand(self.freehand);
//                    self.freehand = new Array();
//                }
//                if (currentAction == "line") {
//                    draw_line(self.center, self.lastMousePoint);
//                }
//                if (currentAction == "ray") {
//                    draw_ray(self.center, self.lastMousePoint);
//                }
//                if (currentAction == "circle") {
//                    draw_circle(self.center, self.lastMousePoint);
//                }
//                if (currentAction == "sine") {
//                    var delta = S2W(self.center);
//                    var kx = (self.lastMousePoint.x - self.center.x) / scaleWorld;
//                    var ky = (self.lastMousePoint.y - self.center.y) / scaleWorld;
//                    draw_sin(delta.x, delta.y, kx, ky);
//                }
//                if (currentAction == "ellipse") {
//                    self.focal1 = {x: snap(self.center).x, y: snap(self.center).y};
//                    self.focal2 = {x: snap(self.lastMousePoint).x, y: snap(self.lastMousePoint).y};
//                    self.context.strokeStyle = Colors.obj;
//                    self.drawPoint(self.focal1);
//                    self.drawPoint(self.focal2);
//                    self.canvas.unbind(self.mouseDownEvent, self.mouseDownHandler);
//                    self.mouseDownHandler = self.onExtraMouseDown();
//                    self.canvas.bind(self.mouseDownEvent, self.mouseDownHandler);
//                }
//                if (currentAction == "textnote") {
//                    var editableText = $(
//                        '<textarea class="textnote" style="position:absolute;left:' + self.lastMousePoint.x + 'px;top:' + self.lastMousePoint.y + 'px;background-color: transparent;">SomeText</textarea>'
//                    );
//                    $(".appWrap").append(editableText);
//                    editableText.focus();
//                }
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
                if (self.pointerId == undefined) {
                    self.pointerId = event.pointerId;
                }
                if (self.pointerId == event.pointerId) {
                    self.updateMousePosition(event);
                    self.selectVertex({x: self.lastPositions[event.pointerId].x, y: self.lastPositions[event.pointerId].y});
                    if (self.selectedVertex != undefined) {
//            self.finalCanvas.width = self.finalCanvas.width;
                        self.selectedShape.hide();
                        for (var i=0; i<self.game.intersects.length; i++ ){
                            if (self.game.intersects[i].obj1==self.selectedShape||self.game.intersects[i].obj2==self.selectedShape){
//                                self.game.intersects[i].hide();
                                var index1 = self.game.utility.names.indexOf(self.game.intersects[i].name);
                                self.game.utility.names.splice(index1,1);
                                self.game.intersects.splice(i,1);
                                i--;
                            }
                        }
//            self.highlight(self.selectedShape);
                        self.drawAllShapes();
                        self.draftCanvas.width = self.draftCanvas.width;
                        self.selectedShape.draw(false);
                    }
                }
            }
        },

        onObjectMouseMove: function () {
            var self = this;
            var delay = 8;
            var executionTimer;
            return function (event) {
                if (self.pointerId == event.pointerId) {
                    if (!!executionTimer) {
                        clearTimeout(executionTimer);
                    }
                    executionTimer = setTimeout(function () {
                        if (self != undefined && self.selectedVertex != undefined) {
                            self.updateMousePosition(event);
                            var dest = self.S2W(self.lastPositions[event.pointerId]);
                            self.selectedShape.transform(dest);
                            self.draftCanvas.width = self.draftCanvas.width;
                            self.selectedShape.draw(false);
                        }
                    }, delay);
                }
            };
        },

        onObjectMouseUp: function () {
            var self = this;
            return function (event) {
                if (self.pointerId == event.pointerId) {
                    if (self.selectedVertex != undefined) {
                        self.draftCanvas.width = self.draftCanvas.width;
//            self.drawShape(self.selectedShape);
                        self.selectedShape.show();
                        if (!self.selectedShape.disabled){
                            self.game.shapes.forEach(function(obj){
                                self.game.utility.intersect(self.selectedShape,obj);
                            });
                        }
//            self.drawAllShapes();
                        self.selectedVertex = undefined;
                        self.selectedShape = undefined;
                    }
                    self.pointerId = undefined;
                }
            }
        },

        drawGrid: function () {
            var context = this.baselineCanvas.getContext('2d');
            var canvasDivWidth = this.canvasDiv.offsetWidth;
            var canvasDivHeight = this.canvasDiv.offsetHeight;
            for (var x = 0; x < canvasDivWidth; x += 20) {
                context.moveTo(x, 0);
                context.lineTo(x, canvasDivHeight);
            }
            for (var y = 0; y < canvasDivHeight; y += 20) {
                context.moveTo(0, y);
                context.lineTo(canvasDivWidth, y);
            }
            context.strokeStyle = colors.grid;
            context.stroke();
            context.beginPath();
            context.moveTo(this.centerX, 0);
            context.lineTo(this.centerX, canvasDivHeight);
            context.moveTo(0, this.centerY);
            context.lineTo(canvasDivWidth, this.centerY);
            context.strokeStyle = colors.axis;
            context.stroke();
        },

        focusCanvas: function (canvasID) {
            var canvasList = this.canvasDiv.getElementsByTagName('canvas');
            for (var i = 0; i < canvasList.length; i++) {
                if (canvasList[i].id == canvasID) {
                    canvasList[i].style.zIndex = '2';
                } else if (canvasList[i].id == 'baselineCanvas') {
                    canvasList[i].style.zIndex = '0';
                } else {
                    canvasList[i].style.zIndex = '1';
                }
            }
        },

        drawAllShapes: function () {
            this.finalCanvas.width = this.finalCanvas.width;
            for (var i = 0; i < this.game.shapes.length; i++) {
                if (!this.game.shapes[i].hidden) {
                    this.game.shapes[i].draw();
                }
            }
            for (var i = 0; i < this.game.intersects.length; i++) {
                if (!this.game.intersects[i].hidden) {
                    this.game.intersects[i].draw();
                }
            }
        },

        drawShape: function (shape) {
            switch (shape.type) {
                case 7:
                    this.drawTriangle(shape);
//          console.log('triangle area: '+ shape.area());
                    break;
                case 6:
                    this.drawPoint(shape, true);
                    break;
            }
        },

        drawPoint: function (point, isFinal) {
            var context;
            if (isFinal) {
                context = this.finalCanvas.getContext('2d');
            } else {
                context = this.draftCanvas.getContext('2d');
                context.lineCap = 'round';
                context.strokeStyle = 'red';
                context.fillStyle = 'red';
                context.lineWidth = 3;
            }

            if (point.pointType == 0||point.pointType==2) {
                context.beginPath();
                context.arc(point.pageX, point.pageY, 2, 0, 2 * Math.PI, false);
                context.fill();
                if (point.showName) {
                    context.font = 'italic 12px sans-serif';
                    context.textAlign = 'right';
                    context.textBaseline = 'bottom';
//        var textPoint = lerp(W2S(B), midPoint, -10/calDistance(W2S(B), midPoint));
                    context.fillText(point.name, point.pageX, point.pageY);
                }
                if (point.showCoordinate) {
                    var coord = "(" + Math.round(point.x * 100) / 100 + ", " + Math.round(point.y * 100) / 100 + ")";
                    context.font = 'italic 12px sans-serif';
                    context.textAlign = 'left';
                    context.textBaseline = 'top';
                    context.fillText(coord, point.pageX, point.pageY);
                }

            } else if (point.pointType == 1) {
                var A = point.neighbor[0];
                var B = point;
                var C = point.neighbor[1];
                var tanBC = (C.y - B.y) / (C.x - B.x);
                var tanAC = (A.y - B.y) / (A.x - B.x);
                var start = Math.atan(tanBC);
                var end = Math.atan(tanAC);
                if ((C.x - B.x) < 0) start += Math.PI;
                if ((A.x - B.x) < 0) end += Math.PI;
                if (end - start > Math.PI) end -= Math.PI * 2;
                if (start - end > Math.PI) start -= Math.PI * 2;
                if (start > end) {
                    var temp = start;
                    start = end;
                    end = temp;
                }

                context.beginPath();
                context.arc(point.pageX, point.pageY, 2, 0, 2 * Math.PI, false);
                context.fill();
                context.beginPath();
                var startPoint = this.W2S({x: B.x + Math.cos(start), y: B.y + Math.sin(start)}),
                    midPoint = this.W2S({x: B.x + Math.cos(end) + Math.cos(start), y: B.y + Math.sin(end) + Math.sin(start)}),
                    endPoint = this.W2S({x: B.x + Math.cos(end), y: B.y + Math.sin(end)}),
                    angleDegree = Math.round((end - start) * 180 / Math.PI),
                    tooltip = '';

                if (point.showAngle) {
                    if (angleDegree != 90) {
                        context.arc(this.W2S(B).x, this.W2S(B).y, 20, -start, -end, true);
                    } else {
                        context.moveTo(startPoint.x, startPoint.y);
                        context.lineTo(midPoint.x, midPoint.y);
                        context.lineTo(endPoint.x, endPoint.y);
                    }
                    context.stroke();
                    tooltip = ' ' + angleDegree;
                }
                if (point.showCoordinate) {
                    var coord = "(" + Math.round(point.x * 100) / 100 + ", " + Math.round(point.y * 100) / 100 + ")";
                    tooltip += (' ' + coord);
                }

                if (point.showName) {
                    context.beginPath();
                    context.fillStyle = context.strokeStyle;
                    context.font = 'italic 12px sans-serif';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    var textPoint = this.lerp(this.W2S(B), midPoint, -10 / this.calDistance(this.W2S(B), midPoint));
                    context.fillText(B.name + tooltip, textPoint.x, textPoint.y);
                }
            } else {
                //TODO
            }

        },

        drawTriangle: function (shape, isFinal) {
            var point1 = shape.vertices[0];
            var point2 = shape.vertices[1];
            var point3 = shape.vertices[2];
            this.drawLine(point1, point2, isFinal);
            this.drawLine(point2, point3, isFinal);
            this.drawLine(point3, point1, isFinal);
            this.drawPoint(point1, isFinal);
            this.drawPoint(point2, isFinal);
            this.drawPoint(point3, isFinal);

        },

        /*
         * Draw line by two Point object.
         */
        drawLine: function (startPoint, endPoint, isFinal) {
            var context;
            if (isFinal) {
                context = this.finalCanvas.getContext('2d');
            } else {
                context = this.draftCanvas.getContext('2d');
                context.lineCap = 'round';
                context.strokeStyle = 'red';
                context.lineWidth = 3;
            }
            var A = endPoint.y - startPoint.y,
                B = startPoint.x - endPoint.x,
                C = startPoint.y * endPoint.x - startPoint.x * endPoint.y;
            if (A == 0 && B == 0 && C == 0) {
                return;
            }
            context.beginPath();
            context.moveTo(startPoint.pageX, startPoint.pageY);
            context.lineTo(endPoint.pageX, endPoint.pageY);
            context.stroke();
        },
        /*
         * Draw Circle by Center & Radius.
         */
        drawCircle: function (center, radius, isFinal) {
            var context;
            if (isFinal) {
                context = this.finalCanvas.getContext('2d');
            } else {
                context = this.draftCanvas.getContext('2d');
                context.lineCap = 'round';
                context.strokeStyle = 'red';
                context.lineWidth = 3;
            }
            context.beginPath();
            context.arc(center.pageX, center.pageY, radius * scaleWorld, 0, 2 * Math.PI, false);
            context.stroke();
        },
        /*
         * Draw details of angle B
         * @Deprecated
         */
        drawAngle: function (A, B, C, isFinal) {
            var context;
            if (isFinal) {
                context = this.finalCanvas.getContext('2d');
            } else {
                context = this.draftCanvas.getContext('2d');
                context.lineCap = 'round';
                context.strokeStyle = 'red';
                context.lineWidth = 3;
            }
            var tanBC = (C.y - B.y) / (C.x - B.x);
            var tanAC = (A.y - B.y) / (A.x - B.x);
            var start = Math.atan(tanBC);
            var end = Math.atan(tanAC);
            if ((C.x - B.x) < 0) start += Math.PI;
            if ((A.x - B.x) < 0) end += Math.PI;
            if (end - start > Math.PI) end -= Math.PI * 2;
            if (start - end > Math.PI) start -= Math.PI * 2;
            if (start > end) {
                var temp = start;
                start = end;
                end = temp;
            }

            context.beginPath();
            var startPoint = this.W2S({x: B.x + Math.cos(start), y: B.y + Math.sin(start)}),
                midPoint = this.W2S({x: B.x + Math.cos(end) + Math.cos(start), y: B.y + Math.sin(end) + Math.sin(start)}),
                endPoint = this.W2S({x: B.x + Math.cos(end), y: B.y + Math.sin(end)}),
                angleDegree = Math.round((end - start) * 180 / Math.PI);

            if (angleDegree != 90) {
                context.arc(this.W2S(B).x, this.W2S(B).y, 20, -start, -end, true);
            }
            else {
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(midPoint.x, midPoint.y);
                context.lineTo(endPoint.x, endPoint.y);
            }
            context.stroke();
            context.beginPath();
            context.fillStyle = context.strokeStyle;
            context.font = 'italic 12px sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            var textPoint = this.lerp(this.W2S(B), midPoint, -10 / this.calDistance(this.W2S(B), midPoint));
            context.fillText(B.name + angleDegree, textPoint.x, textPoint.y);
            return angleDegree;
        },

        lerp: function (a1, a2, t) {  // Linear interpolation
            return {
                x: a1.x + (a2.x - a1.x) * t,
                y: a1.y + (a2.y - a1.y) * t
            };
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

        updateCanvasByDrawing: function (event) {
            var context = this.draftCanvas.getContext('2d');
            context.lineCap = 'round';
            context.strokeStyle = colors.obj;
            context.beginPath();
            context.moveTo(this.lastPositions[event.pointerId].x, this.lastPositions[event.pointerId].y);
            this.updateMousePosition(event);
            context.lineTo(this.lastPositions[event.pointerId].x, this.lastPositions[event.pointerId].y);
            context.stroke();
        },

        updateCanvasByLine: function (event) {
            var context = this.draftCanvas.getContext('2d');
            this.updateMousePosition(event);
            for (var key in this.lastPositions) {
                context.lineCap = 'round';
                context.strokeStyle = colors.obj;
                context.beginPath();
                context.moveTo(this.refPoints[key].x, this.refPoints[key].y);
                context.lineTo(this.lastPositions[key].x, this.lastPositions[key].y);
                context.stroke();
            }
        },

        updateCanvasByCircle: function (event) {
            var context = this.draftCanvas.getContext('2d');
            this.updateMousePosition(event);
            for (var key in this.lastPositions) {
                context.lineCap = 'round';
                context.strokeStyle = colors.obj;
                context.beginPath();
                var radius = this.calDistance(this.lastPositions[key], this.refPoints[key]);
                context.arc(this.refPoints[key].x, this.refPoints[key].y, radius, 0, 2 * Math.PI, false);
//                context.lineTo( this.lastPositions[key].x, this.lastPositions[key].y );
                context.stroke();
            }
        },

        calDistance: function (p1, p2) {
            var distance = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
            return distance;
        }
    }.extend(Observer);

    return Baseline;
});