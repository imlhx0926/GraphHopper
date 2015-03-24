/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 8/26/13
 * Time: 4:45 PM
 * To change this template use File | Settings | File Templates.
 */
var centerX, centerY;
var FillRect;
var scaleWorld = 20;
var Colors = {
    bg: "#ffffff",
    obj: "#000000",
    grid: "#81DAF5",
    keyPoint: "ff0000"
};
function initFillingRectangle(){
    FillRect = new FillingRectangle();
}

function FillingRectangle(){
//    this.FillingArea={
//        slots: [
//            {x:0, y:0, filled:false},{x:1, y:0, filled:false},{x:2, y:0, filled:false},{x:3, y:0, filled:false},{x:4, y:0, filled:false},{x:5, y:0, filled:false},
//            {x:0, y:1, filled:false},{x:1, y:1, filled:false},{x:2, y:1, filled:false},{x:3, y:1, filled:false},{x:4, y:1, filled:false},{x:5, y:1, filled:false},
//            {x:0, y:2, filled:false},{x:1, y:2, filled:false},{x:2, y:2, filled:false},{x:3, y:2, filled:false},{x:4, y:2, filled:false},{x:5, y:2, filled:false},
//            {x:0, y:3, filled:false},{x:1, y:3, filled:false},{x:2, y:3, filled:false},{x:3, y:3, filled:false},{x:4, y:3, filled:false},{x:5, y:3, filled:false}
//        ]
//    };
    this.FillingArea={
        slots:[
            [false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false,false,false]
        ]
    }
    this.samples = new Array();
    var sample1 = {
        center:{x:-5, y:8},
        slots:[
            {x:0, y:0},{x:1, y:0},{x:0, y:1},{x:0, y:2}
        ]
    };
    var sample2 = {
        center:{x:1, y:9},
        slots:[
            {x:0, y:0},{x:0, y:1},{x:1, y:0},{x:0, y:-1}
        ]
    };
    var sample3 = {
        center:{x:7, y:9},
        slots:[
            {x:0, y:-1},{x:0, y:0},{x:1, y:0},{x:1, y:1}
        ]
    };
    var sample4 = {
        center:{x:13, y:8},
        slots:[
            {x:0, y:0},{x:0, y:1},{x:1, y:1},{x:1, y:0}
        ]
    };
    var sample5 = {
        center:{x:-5, y:13},
        slots:[
            {x:0, y:0},{x:1, y:2},{x:1, y:1},{x:1, y:0}
        ]
    };
    var sample6 = {
        center:{x:1, y:14},
        slots:[
            {x:0, y:0},{x:0, y:1},{x:1, y:-1},{x:1, y:0}
        ]
    };
    var sample7 = {
        center:{x:7, y:14},
        slots:[
            {x:0, y:-1},{x:0, y:0},{x:0, y:1},{x:0, y:2}
        ]
    };

    this.samples.push(sample1);
    this.samples.push(sample2);
    this.samples.push(sample3);
    this.samples.push(sample4);
    this.samples.push(sample5);
    this.samples.push(sample6);
    this.samples.push(sample7);

    this.ghost = {
        center:{x:0, y:0},
        slots:[
            {x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0}
        ]
    }


    this.selected = undefined;
    this.offset = undefined;

    fullApp = false;
    centerX = Math.round($("#canvasDiv").width()/60)*20;
    centerY = Math.round($("#canvasDiv").height()/25)*20;
    this.draw_FillingArea();

    focusCanvas("draftCanvas");
    var draftCanvas = new Draw('draftCanvas');
//    var finalCanvas = new Draw('finalCanvas');

    currentAction = "move";
    draftCanvas.canvas.unbind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
    draftCanvas.mouseDownHandler = draftCanvas.onObjectMouseDown();
    draftCanvas.canvas.bind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);

}

FillingRectangle.prototype.draw_FillingArea = function(){
    var baselineCanvas = document.getElementById("baselineCanvas");
    var context = baselineCanvas.getContext("2d");
    baselineCanvas.width = baselineCanvas.width;
    drawGrid();
    var self = this;
    for (var y=0; y<this.FillingArea.slots.length; y++){
        var row = this.FillingArea.slots[y];
        for (var x=0; x<row.length; x++){
            var center = W2S({x:x*2, y:y*2});
            if (this.FillingArea.slots[y][x]==true){
                context.lineCap = 'round';
                context.strokeStyle = 'black';
                context.fillStyle = 'red';
            }
            else if (this.FillingArea.slots[y][x]==false){
                context.lineCap = 'round';
                context.strokeStyle = 'black';
                context.fillStyle = 'pink';
            }
            context.beginPath();
            context.fillRect(center.x-20, center.y-20, 40, 40);
            context.moveTo(center.x-20, center.y+20);
            context.lineTo(center.x+20, center.y+20);
            context.lineTo(center.x+20, center.y-20);
            context.lineTo(center.x-20, center.y-20);
            context.lineTo(center.x-20, center.y+20);

            context.lineWidth = 3;
            context.stroke();
        }
    }
    this.draw_samples();
};

FillingRectangle.prototype.draw_samples = function(){
    var baselineCanvas = document.getElementById("baselineCanvas");
    var context = baselineCanvas.getContext("2d");
//    draftCanvas.width = draftCanvas.width;
    this.samples.forEach(function(sample){
        var samplecenter = sample.center;
        sample.slots.forEach(function(slot){
            var center = W2S({x:(slot.x+samplecenter.x)*2, y:(slot.y+samplecenter.y)*2});
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            context.fillStyle = 'red';
            context.beginPath();
            context.fillRect(center.x-20, center.y-20, 40, 40);
            context.moveTo(center.x-20, center.y+20);
            context.lineTo(center.x+20, center.y+20);
            context.lineTo(center.x+20, center.y-20);
            context.lineTo(center.x-20, center.y-20);
            context.lineTo(center.x-20, center.y+20);

            context.lineWidth = 3;
            context.stroke();
        });
    });
};

FillingRectangle.prototype.draw_ghost = function(){
    var draftCanvas = document.getElementById("draftCanvas");
    var context = draftCanvas.getContext("2d");
    var samplecenter = this.ghost.center;
    this.ghost.slots.forEach(function(slot){
        var center = W2S({x:(slot.x+samplecenter.x)*2, y:(slot.y+samplecenter.y)*2});
        console.log(slot);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.fillStyle = 'yellow';
        context.beginPath();
        context.fillRect(center.x-20, center.y-20, 40, 40);
        context.moveTo(center.x-20, center.y+20);
        context.lineTo(center.x+20, center.y+20);
        context.lineTo(center.x+20, center.y-20);
        context.lineTo(center.x-20, center.y-20);
        context.lineTo(center.x-20, center.y+20);

        context.lineWidth = 3;
        context.stroke();
    });
}

FillingRectangle.prototype.select_vertex = function(tapPosScreen){
    var nearest = 20;
    var tapPos = S2W(tapPosScreen);
    var self = this;
    this.samples.forEach(function(sample){
        var samplecenter = sample.center;
        sample.slots.forEach(function(slot){
            var center = W2S({x:(slot.x+samplecenter.x)*2, y:(slot.y+samplecenter.y)*2});
            var error = calDistance(tapPosScreen, center);
            if (error < nearest) {
                nearest = error;
                self.selected = self.samples.indexOf(sample);
                self.offset = slot;
            }
        });
    });
    console.log(self.selected);
};

FillingRectangle.prototype.clone_sample = function(){
    this.ghost = {
        center: {x:this.samples[this.selected].center.x,y:this.samples[this.selected].center.y},
        slots: this.samples[this.selected].slots
    }
}

FillingRectangle.prototype.isFillable = function(sample){
    var self = this;
    var fillable = true;
    var samplecenter = sample.center;
    sample.slots.forEach(function(slot){
        var y=slot.y+samplecenter.y, x=slot.x+samplecenter.x;
            if ((self.FillingArea.slots[y]!=undefined)&&(self.FillingArea.slots[y][x]))
                fillable = false;
        console.log(x,y,fillable);
    });
    return fillable;
}

FillingRectangle.prototype.rotate = function(sample){
    sample.slots.forEach(function(slot){
        var x = slot.y;
        var y = -slot.x;
        slot.x = x;
        slot.y = y;
    });

}

FillingRectangle.prototype.all_valid = function(){
    var all_valid = true;
    var samplecenter = FillRect.ghost.center;
    FillRect.ghost.slots.forEach(function(slot){
        var y=slot.y+samplecenter.y, x=slot.x+samplecenter.x;
        if ((FillRect.FillingArea.slots[y]==undefined)||(FillRect.FillingArea.slots[y][x]==undefined)){
            all_valid = false;
            console.log(y,x);
        }
    });
    return all_valid;
}

Draw.prototype.onObjectMouseDown = function(){
    var self = this;
    return function(event) {
        self.updateMousePosition( event );
        FillRect.select_vertex({x:self.lastMousePoint.x,y:self.lastMousePoint.y});
        if (FillRect.selected!=undefined){
            currentAction = "rotate";

//            document.getElementById("draftCanvas").width = document.getElementById("draftCanvas").width;
            self.mouseMoveHandler = self.onObjectMouseMove();
            self.mouseUpHandler = self.onObjectMouseUp();
            $(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
            $(document).bind( self.mouseUpEvent, self.mouseUpHandler );
        }
        else {
            console.log("nothing selected");
        }
    }
};

Draw.prototype.onObjectMouseMove = function(){
    var self = this;
    return function(event){
        self.updateMousePosition( event );
        self.canvas[0].width = self.canvas[0].width;
        if (currentAction=="rotate"){
            currentAction = "";
            FillRect.clone_sample();
        }
        var sample = {
            center:{
                x:Math.round(S2W(self.lastMousePoint).x/2)-FillRect.offset.x,
                y:Math.round(S2W(self.lastMousePoint).y/2)-FillRect.offset.y
            },
            slots:FillRect.ghost.slots
        };
        if (FillRect.isFillable(sample)){
            FillRect.ghost.center.x = Math.round(S2W(self.lastMousePoint).x/2)-FillRect.offset.x;
            FillRect.ghost.center.y = Math.round(S2W(self.lastMousePoint).y/2)-FillRect.offset.y;
        }
        FillRect.draw_ghost();
    }
};

Draw.prototype.onObjectMouseUp = function(){
    var self = this;
    return function(event){
        self.canvas[0].width = self.canvas[0].width;
//        FillRect.draw_samples();
        if (currentAction == "rotate"){
            FillRect.rotate(FillRect.samples[FillRect.selected]);
        }
        else if (FillRect.all_valid()){
            var samplecenter = FillRect.ghost.center;
            FillRect.ghost.slots.forEach(function(slot){
                var y=slot.y+samplecenter.y, x=slot.x+samplecenter.x;
                if ((FillRect.FillingArea.slots[y]!=undefined)&&(FillRect.FillingArea.slots[y][x]==false)){
                    FillRect.FillingArea.slots[y][x]=true;
                    console.log(y,x);
                }
            });
        }
        FillRect.draw_FillingArea();
        FillRect.selected = undefined;
        $(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
        $(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
        self.mouseMoveHandler = null;
        self.mouseUpHandler = null;
    }
};



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
//    context.beginPath();
//    context.moveTo(centerX, 0);
//    context.lineTo(centerX, $("#canvasDiv").height());
//    context.moveTo(0, centerY);
//    context.lineTo($("#canvasDiv").width(), centerY);
//    context.strokeStyle = "#f00";
//    context.stroke();
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
