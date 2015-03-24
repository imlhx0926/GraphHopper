/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 8/26/13
 * Time: 4:45 PM
 * To change this template use File | Settings | File Templates.
 */
var centerX, centerY;
var polySke;
var quadrilateral = false;
function initPloygonSketch(){
    polySke = new PloygonSketch();
}

function PloygonSketch(){
//    this.poly={
//        vertices: [
//            {x:0, y:10.0, name:"A"},
//            {x:10.0, y:10.0, name:"B"},
//            {x:10.0, y:0, name:"C"},
//            {x:0, y:0, name:"D"},
//            {x:-5, y:3, name:"E"},
//            {x:-5, y:7, name:"F"}
//        ]
//    };

    this.selected = undefined;
    fullApp = false;
    centerX = Math.round($("#canvasDiv").width()/40)*20;
    centerY = Math.round($("#canvasDiv").height()/40)*20;
    drawGrid();
    this.gen_poly(5);
    focusCanvas("draftCanvas");
    var draftCanvas = new Draw('draftCanvas');
//    var finalCanvas = new Draw('finalCanvas');

    currentAction = "move";
    draftCanvas.canvas.unbind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
    draftCanvas.mouseDownHandler = draftCanvas.onObjectMouseDown();
    draftCanvas.canvas.bind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);

}

PloygonSketch.prototype.gen_poly = function(side){
    var interval = Math.PI*2/side;
    var point = {x:0, y:0};
    this.poly={
        vertices: new Array()
    }
    for (var i = 0; i< side; i++){
        point = {
            x: 10*Math.cos(interval*i),
            y: 10*Math.sin(interval*i),
            name: String.fromCharCode(65+i)
        }
        this.poly.vertices.push(point);
    }
    this.draw_poly(this.poly);
}

PloygonSketch.prototype.draw_poly = function(obj){
    document.getElementById("finalCanvas").width = document.getElementById("finalCanvas").width;
    var side = obj.vertices.length;
    for (var i=0; i<side-1; i++){
        draw_line(W2S(obj.vertices[i]),W2S(obj.vertices[i+1]));
    }
    draw_line(W2S(obj.vertices[side-1]),W2S(obj.vertices[0]));

    for (var i=0; i<side-2; i++){
        draw_angle(obj.vertices[i],obj.vertices[i+1],obj.vertices[i+2],"finalCanvas");
    }
    draw_angle(obj.vertices[side-2],obj.vertices[side-1],obj.vertices[0],"finalCanvas");
    draw_angle(obj.vertices[side-1],obj.vertices[0],obj.vertices[1],"finalCanvas");



//    addKeyPoint(obj.vertices[0]);
//    addKeyPoint(obj.vertices[1]);
//    addKeyPoint(obj.vertices[2]);
//    drawKeyPoints();
}

PloygonSketch.prototype.select_vertex = function(tapPosScreen){
    var nearest = 40 / scaleWorld;
    var tapPos = S2W(tapPosScreen);
    var self = this;
    this.poly.vertices.forEach(function(vertex){
        var error = calDistance(tapPos, vertex);
        if (error < nearest) {
            nearest = error;
            self.selected = self.poly.vertices.indexOf(vertex);
        }
    });
}

PloygonSketch.prototype.highlight = function(obj){
    var draftCanvas = document.getElementById("draftCanvas");
    var context = draftCanvas.getContext("2d");
    var side = obj.vertices.length;

    draftCanvas.width = draftCanvas.width;
    context.lineCap = 'round';
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(W2S(obj.vertices[0]).x, W2S(obj.vertices[0]).y);

    for (var i=0; i<side; i++){
        context.lineTo(W2S(obj.vertices[i]).x,W2S(obj.vertices[i]).y);
    }
    context.lineTo(W2S(obj.vertices[0]).x,W2S(obj.vertices[0]).y);
    context.lineWidth = 3;
    context.stroke();
    var sum = 0;
    for (var i=0; i<side-2; i++){
        sum+=draw_angle(obj.vertices[i],obj.vertices[i+1],obj.vertices[i+2],"draftCanvas");
    }
    sum+=draw_angle(obj.vertices[side-2],obj.vertices[side-1],obj.vertices[0],"draftCanvas");
    sum+=draw_angle(obj.vertices[side-1],obj.vertices[0],obj.vertices[1],"draftCanvas");
    context.beginPath();
    context.fillStyle = context.strokeStyle;
    context.font = 'italic 12px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(Math.round(sum), 100, 100);
}

PloygonSketch.prototype.test_convex = function(selected){
    var A=selected- 1, C=selected+1;
    var side = this.poly.vertices.length;
    if (A<0) A+=side; if (C>side-1) C-=side;
    this.poly.vertices

}

Draw.prototype.onObjectMouseDown = function(){
    var self = this;
    return function(event) {
        self.updateMousePosition( event );
        polySke.select_vertex({x:self.lastMousePoint.x,y:self.lastMousePoint.y});
        if (polySke.selected!=undefined){
            document.getElementById("finalCanvas").width = document.getElementById("finalCanvas").width;
            polySke.highlight(polySke.poly);
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
        polySke.poly.vertices[polySke.selected].x = S2W(self.lastMousePoint).x;
        polySke.poly.vertices[polySke.selected].y = S2W(self.lastMousePoint).y;

        var side = polySke.poly.vertices.length
        var A = polySke.selected, B=A+1, C=A+2, D=A-1;
        if (B>side-1) B-=side;if (C>side-1) C-=side;if (D<0) D+=side;
        var center = {
            x:(polySke.poly.vertices[B].x)/2+(polySke.poly.vertices[D].x)/2,
            y:(polySke.poly.vertices[B].y)/2+(polySke.poly.vertices[D].y)/2
        }
        var rightanglepoint = lerp(center, S2W(self.lastMousePoint), calDistance(polySke.poly.vertices[B],polySke.poly.vertices[D])/2/calDistance(center, S2W(self.lastMousePoint)));




        if (calDistance(self.lastMousePoint, W2S(rightanglepoint))<10){
            polySke.poly.vertices[A].x=rightanglepoint.x;
            polySke.poly.vertices[A].y=rightanglepoint.y;
        }
        if (quadrilateral){     //A-B-C-D-A
            polySke.poly.vertices[C].x = lerp(polySke.poly.vertices[A], center, 2).x;
            polySke.poly.vertices[C].y = lerp(polySke.poly.vertices[A], center, 2).y;
        }

        polySke.highlight(polySke.poly);
    }
}

Draw.prototype.onObjectMouseUp = function(){
    var self = this;
    return function(event){
        self.canvas[0].width = self.canvas[0].width;
        polySke.draw_poly(polySke.poly);
        polySke.selected = undefined;
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
    var ccw = true;
    if ((C.x-B.x)<0) start+=Math.PI;
    if ((A.x-B.x)<0) end+=Math.PI;
    if (end-start>Math.PI) end-=Math.PI*2;
    if (start-end>Math.PI) start-=Math.PI*2;
//    if (start>end) ccw = false;
//
//    if (start>end){var temp = start;start = end;end = temp;}

    context.beginPath();
    var startPoint=W2S({x:B.x+Math.cos(start), y:B.y+Math.sin(start)}),
        midPoint=W2S({x:B.x+Math.cos(end)+Math.cos(start), y:B.y+Math.sin(end)+Math.sin(start)}),
        endPoint=W2S({x:B.x+Math.cos(end), y:B.y+Math.sin(end)}),
        angleDegree = end-start;
    if (angleDegree<0) angleDegree += Math.PI*2;
    angleDegree = Math.round((angleDegree)*1800/Math.PI)/10;
    if (angleDegree!=90){
        context.arc(W2S(B).x, W2S(B).y, 20, -start, -end, ccw);
    }
    else {
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(midPoint.x, midPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
    }
    context.stroke();

//    context.beginPath();
//    context.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI, true);
//    context.stroke();

    context.beginPath();
    context.fillStyle = context.strokeStyle;
    context.font = 'italic 12px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    var textPoint = lerp(W2S(B), midPoint, -10/calDistance(W2S(B), midPoint));
    context.fillText(B.name+angleDegree, textPoint.x, textPoint.y);
    return angleDegree;
}
