/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 8/26/13
 * Time: 4:45 PM
 * To change this template use File | Settings | File Templates.
 */
var centerX, centerY;
var triSke;
var scaleWorld = 20;
var Colors = {
    bg: "#ffffff",
    obj: "#000000",
    grid: "#81DAF5",
    keyPoint: "ff0000"
};
function initTriSke(){
    triSke = new TriangleSketch();
}

function TriangleSketch(){
    this.triangle={
        vertices: [{x:10.0, y:10.0, name:"A"},{x:0, y:10.0, name:"B"},{x:10.0, y:0, name:"C"}]
    };
    this.selected = undefined;
    fullApp = false;
    centerX = Math.round($("#canvasDiv").width()/40)*20;
    centerY = Math.round($("#canvasDiv").height()/40)*20;
    drawGrid();
    this.draw_triangle(this.triangle);
    focusCanvas("draftCanvas");
    var draftCanvas = new Draw('draftCanvas');
//    var finalCanvas = new Draw('finalCanvas');

    currentAction = "move";
    draftCanvas.canvas.unbind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
    draftCanvas.mouseDownHandler = draftCanvas.onObjectMouseDown();
    draftCanvas.canvas.bind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);

}

TriangleSketch.prototype.draw_triangle = function(tri){
    draw_line(W2S(tri.vertices[0]),W2S(tri.vertices[1]));
    draw_line(W2S(tri.vertices[1]),W2S(tri.vertices[2]));
    draw_line(W2S(tri.vertices[2]),W2S(tri.vertices[0]));
    draw_angle(tri.vertices[0],tri.vertices[1],tri.vertices[2],"finalCanvas");
    draw_angle(tri.vertices[1],tri.vertices[2],tri.vertices[0],"finalCanvas");
    draw_angle(tri.vertices[2],tri.vertices[0],tri.vertices[1],"finalCanvas");


//    addKeyPoint(tri.vertices[0]);
//    addKeyPoint(tri.vertices[1]);
//    addKeyPoint(tri.vertices[2]);
//    drawKeyPoints();
}

TriangleSketch.prototype.select_vertex = function(tapPosScreen){
    var nearest = 40 / scaleWorld;
    var tapPos = S2W(tapPosScreen);
    var self = this;
    this.triangle.vertices.forEach(function(vertex){
        var error = calDistance(tapPos, vertex);
        if (error < nearest) {
            nearest = error;
            self.selected = self.triangle.vertices.indexOf(vertex);
        }
    });
}

TriangleSketch.prototype.highlight = function(tri){
    var draftCanvas = document.getElementById("draftCanvas");
    var context = draftCanvas.getContext("2d");
    var A = tri.vertices[0], B=tri.vertices[1], C = tri.vertices[2];

    draftCanvas.width = draftCanvas.width;
    context.lineCap = 'round';
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(W2S(A).x, W2S(A).y);
    context.lineTo(W2S(B).x, W2S(B).y);
    context.lineTo(W2S(C).x, W2S(C).y);
    context.lineTo(W2S(A).x, W2S(A).y);
    context.lineWidth = 3;
    context.stroke();
    draw_angle(tri.vertices[0],tri.vertices[1],tri.vertices[2],"draftCanvas");
    draw_angle(tri.vertices[1],tri.vertices[2],tri.vertices[0],"draftCanvas");
    draw_angle(tri.vertices[2],tri.vertices[0],tri.vertices[1],"draftCanvas");
}


Draw.prototype.onObjectMouseDown = function(){
    var self = this;
    return function(event) {
        self.updateMousePosition( event );
        triSke.select_vertex({x:self.lastMousePoint.x,y:self.lastMousePoint.y});
        if (triSke.selected!=undefined){
            document.getElementById("finalCanvas").width = document.getElementById("finalCanvas").width;
            triSke.highlight(triSke.triangle);
            self.mouseMoveHandler = self.onObjectMouseMove();
            self.mouseUpHandler = self.onObjectMouseUp();
            $(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
            $(document).bind( self.mouseUpEvent, self.mouseUpHandler );
        }
        else {
            console.log("nothing selected");
        }
    }
}

Draw.prototype.onObjectMouseMove = function(){
    var self = this;
    return function(event){
        self.updateMousePosition( event );
        triSke.triangle.vertices[triSke.selected].x = S2W(self.lastMousePoint).x;
        triSke.triangle.vertices[triSke.selected].y = S2W(self.lastMousePoint).y;
        triSke.highlight(triSke.triangle);
    }
}

Draw.prototype.onObjectMouseUp = function(){
    var self = this;
    return function(event){
        self.canvas[0].width = self.canvas[0].width;
        triSke.draw_triangle(triSke.triangle);
        triSke.selected = undefined;
        $(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
        $(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
        self.mouseMoveHandler = null;
        self.mouseUpHandler = null;
    }
}

function draw_angle(A, B, C, canvas){   // draw details of angle B
    var finalCanvas = document.getElementById(canvas);
    var context = finalCanvas.getContext("2d");
    var tanBC = (C.y- B.y)/(C.x- B.x);
    var tanAC = (A.y- B.y)/(A.x- B.x);
    var start = Math.atan(tanBC);
    var end = Math.atan(tanAC);
    if ((C.x-B.x)<0) start+=Math.PI;
    if ((A.x-B.x)<0) end+=Math.PI;
    if (end-start>Math.PI) end-=Math.PI*2;
    if (start-end>Math.PI) start-=Math.PI*2;
    if (start>end){var temp = start;start = end;end = temp;}

    context.beginPath();
    var startPoint=W2S({x:B.x+Math.cos(start), y:B.y+Math.sin(start)}),
        midPoint=W2S({x:B.x+Math.cos(end)+Math.cos(start), y:B.y+Math.sin(end)+Math.sin(start)}),
        endPoint=W2S({x:B.x+Math.cos(end), y:B.y+Math.sin(end)}),
        angleDegree = Math.round((end-start)*180/Math.PI);

    if (angleDegree!=90){
        context.arc(W2S(B).x, W2S(B).y, 20, -start, -end, true);
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
    var textPoint = lerp(W2S(B), midPoint, -10/calDistance(W2S(B), midPoint));
    context.fillText(B.name+angleDegree, textPoint.x, textPoint.y);
    return angleDegree;
}

function draw_line(start, end) {
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    var startWorld = S2W(start), endWorld = S2W(end);
    var A = endWorld.y - startWorld.y, B = startWorld.x - endWorld.x, C = startWorld.y * endWorld.x - startWorld.x * endWorld.y;
    if (A == 0 && B == 0 && C == 0) return;

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
}

function drawGrid() {
    var gridCanvas = document.getElementById("baselineCanvas");
    var context = gridCanvas.getContext("2d");
    for (var x = 0; x < $("#canvasDiv").width(); x += 20) {
        context.moveTo(x, 0);
        context.lineTo(x, $("#canvasDiv").height());
    }
    for (var y = 0; y < $("#canvasDiv").height(); y += 20) {
        context.moveTo(0, y);
        context.lineTo($("#canvasDiv").width(), y);
    }
    context.strokeStyle = Colors.grid;
    context.stroke();
    context.beginPath();
    context.moveTo(centerX, 0);
    context.lineTo(centerX, $("#canvasDiv").height());
    context.moveTo(0, centerY);
    context.lineTo($("#canvasDiv").width(), centerY);
    context.strokeStyle = "#f00";
    context.stroke();
}


function lerp(a1, a2, t){  // Linear interpolation
    return {
        x: a1.x + (a2.x - a1.x) * t,
        y: a1.y + (a2.y - a1.y) * t
    };
}

function W2S(worldPoint){
    return {
        x: centerX + worldPoint.x*scaleWorld,
        y: centerY - worldPoint.y*scaleWorld
    }

}

function S2W(screenPoint){
    return {
        x: (screenPoint.x - centerX)/scaleWorld,
        y: (centerY - screenPoint.y)/scaleWorld
    }
}

function calDistance(p1, p2){
    var distance = Math.sqrt(Math.pow((p1.x-p2.x), 2)+Math.pow((p1.y-p2.y),2));
    return distance;
}

function focusCanvas(canvasID) {
    $("#canvasDiv").children().each(function () {

        if ($(this).attr("id") == canvasID) {
            $(this).css('z-index', '2');
        }
        else if ($(this).attr("id") == "baselineCanvas") {
            $(this).css('z-index', '0');
        }
        else {
            $(this).css('z-index', '1');
        }
    })
};
