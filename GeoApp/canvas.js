/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 6/19/13
 * Time: 5:35 PM
 * To change this template use File | Settings | File Templates.
 */
var keyPoints = new Array();
var intersectPoints = new Array();
var objects = new Array();
var recording = new Array();
var selectedIndex = -1;
var selectedObj={id:-1};
var Colors = {
    bg: "#ffffff",
    obj: "#000000",
    grid: "#81DAF5",
    keyPoint: "ff0000"
};
var divFunction;
var nightvision = false;
var currentAction = "";
var snaptokeypoints = false;
var snaptogrid = false;
var snaptotangent = false;
var snaptoobject = false;
var showCoord = false;
var isRecording = "idle"; // recording, ready
var fullApp = true;

function initCanvas() {
//    drawGrid();
    focusCanvas("baselineCanvas");
    var draftCanvas = new Draw('draftCanvas');
    var finalCanvas = new Draw('finalCanvas');
//    var baselineCanvas = new Baseline();
    $(".toolbar").on("click", ".nightvision", function () {
        if (nightvision) {
            Colors = {
                bg: "#ffffff",
                obj: "#000000",
                grid: "#81DAF5",
                keyPoint: "ff0000"
            };
            nightvision = false;
        }
        else {
            Colors = {
                bg: "#000000",
                obj: "#FFFF00",
                grid: "008442",
                keyPoint: "00ff00"
            };
            nightvision = true;
        }
        draftCanvas.context.strokeStyle = Colors.obj;
        finalCanvas.context.strokeStyle = Colors.obj;
        $("#canvasDiv").css("background-color", Colors.bg);
        drawBoard({
            scale: hammerScale,
            minX: 5 * (-Math.round(bw / 100)),
            minY: 5 * (-Math.round(bh / 100)),
            maxX: 5 * Math.round(bw / 100),
            maxY: 5 * Math.round(bh / 100),
            unitsPerTick: ticks
        });
        drawXAxis();
        drawYAxis();
        refreshFinalCanvas();
    });
    $(".toolbar").on("click", ".drawingTool", function () {
        draftCanvas.canvas.unbind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
        draftCanvas.mouseDownHandler = draftCanvas.onCanvasMouseDown();
        draftCanvas.canvas.bind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
    });
    $(".toolbar").on("click", ".editingTool", function () {
        draftCanvas.canvas.unbind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
        draftCanvas.mouseDownHandler = draftCanvas.onObjectMouseDown();
        draftCanvas.canvas.bind(draftCanvas.mouseDownEvent, draftCanvas.mouseDownHandler);
    });
    $(".toolbar").on("click", ".drawing_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "drawing";
        draftCanvas.renderFunction = draftCanvas.updateCanvasByDrawing;
    });
    $(".toolbar").on("click", ".sine_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "sine";
        draftCanvas.renderFunction = draftCanvas.updateCanvasBySine;
    });
    $(".toolbar").on("click", ".line_radiobutton", function () {
        if($(this).css("content").match("LineSeg")){
            focusCanvas("draftCanvas");
            currentAction = "line";
            draftCanvas.renderFunction = draftCanvas.updateCanvasByLine;
        }
        else if($(this).css("content").match("line")){
            focusCanvas("draftCanvas");
            currentAction = "ray";
            draftCanvas.renderFunction = draftCanvas.updateCanvasByLine;
        }
    });
    $(".toolbar").on("click", ".conic_radiobutton", function () {
        if($(this).css("content").match("circle")){
            focusCanvas("draftCanvas");
            currentAction = "circle";
            draftCanvas.renderFunction = draftCanvas.updateCanvasByCircle;
        }
        else if($(this).css("content").match("Sphear")){
            focusCanvas("draftCanvas");
            currentAction = "ellipse";
            draftCanvas.renderFunction = draftCanvas.updateCanvasByCircle;
        }
    });
    $(".linePop").on("click", ".lineseg_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "line";
        draftCanvas.renderFunction = draftCanvas.updateCanvasByLine;
    });
    $(".linePop").on("click", ".ray_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "ray";
        draftCanvas.renderFunction = draftCanvas.updateCanvasByLine;
    });
    $(".conicPop").on("click", ".circle_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "circle";
        draftCanvas.renderFunction = draftCanvas.updateCanvasByCircle;
    });
    $(".conicPop").on("click", ".ellipse_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "ellipse";
        draftCanvas.renderFunction = draftCanvas.updateCanvasByLine;
        // draw line first, become ellipse during extra mouse move
    });

    $(".toolbar").on("click", ".text_radiobutton", function(){
        focusCanvas("draftCanvas");
        currentAction = "textnote";
        draftCanvas.renderFunction = draftCanvas.updateCanvasByText;
    });

    $(".toolbar").on("click", ".handtool_radiobutton", function () {
        focusCanvas("baselineCanvas");
        currentAction = "handtool";
//        changeMode("nav");
//        draftCanvas.renderFunction = function(){};
    });
    $(".toolbar").on("click", ".resize_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "resize";
    });
    $(".toolbar").on("click", ".delete_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "delete";
    });

    $(".toolbar").on("click", ".move_radiobutton", function () {
        focusCanvas("draftCanvas");
        currentAction = "move";
    });
    $(".toolbar").on("click", ".snaptogrid_checkbox", function () {
        snaptogrid=!snaptogrid;
    });
    $(".toolbar").on("click", ".snaptoobject_checkbox", function () {
        snaptoobject=!snaptoobject;
    });
    $(".toolbar").on("click", ".snaptotangent_checkbox", function () {
        snaptotangent=!snaptotangent;
    });
    $(".toolbar").on("click", ".snaptokeypoint_checkbox", function () {
        if (!snaptokeypoints) {
            snaptokeypoints = true;
            drawKeyPoints();
        }
        else {
            snaptokeypoints = false;
            $("#baselineCanvas")[0].width = $("#baselineCanvas")[0].width;
            drawBoard({
                scale: hammerScale,
                minX: 5 * (-Math.round(bw / 100)),
                minY: 5 * (-Math.round(bh / 100)),
                maxX: 5 * Math.round(bw / 100),
                maxY: 5 * Math.round(bh / 100),
                unitsPerTick: ticks
            });
            drawXAxis();
            drawYAxis();
        }
    });
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

function getFormula(target) {
    var formula = ""
    if (target.type == "line"||target.type == "ray") {
        var a = Math.round(target.A * 100) / 100;
        var b = Math.round(target.B * 100) / 100;
        var c = Math.round(target.C * 100) / 100;
        var sign_b = (b >= 0) ? "+" : "";
        var sign_c = (c >= 0) ? "+" : "";

        formula = a + "x" + sign_b + b + "y" + sign_c + c + "=0";
    }
    else if (target.type == "circle") {
        var a = Math.abs(Math.round(target.center.x * 100) / 100);
        var b = Math.abs(Math.round(target.center.y * 100) / 100);
        var r = Math.round(target.radius * 100) / 100;
        var sign_a = (target.center.x >= 0) ? "-" : "+";
        var sign_b = (target.center.y >= 0) ? "-" : "+";
        formula = "(x" + sign_a + a + ")" + String.fromCharCode(178) + "+(y" + sign_b + b + ")" + String.fromCharCode(178) + "=" + r + String.fromCharCode(178);
    }
    else if (target.type == "ellipse") {

        var c1={x:(target.focal1.x+target.focal2.x)/2,y:(target.focal1.y+target.focal2.y)/2},
            rx1=target.a, ry1=target.b, alpha1 = target.alpha;
        var A1=Math.pow((Math.cos(alpha1)*ry1),2)+Math.pow((Math.sin(alpha1)*rx1),2),
            B1=2*Math.cos(alpha1)*Math.sin(alpha1)*(ry1*ry1-rx1*rx1),
            C1=Math.pow((Math.sin(alpha1)*ry1),2)+Math.pow((Math.cos(alpha1)*rx1),2);
        var p = [
            A1, B1, C1, -(2*A1*c1.x+B1*c1.y), -(2*C1*c1.y+B1*c1.x),
            A1*c1.x*c1.x + B1*c1.x*c1.y + C1*c1.y*c1.y - rx1*rx1*ry1*ry1
        ];
        var s = ["x"+String.fromCharCode(178),"xy","y"+String.fromCharCode(178),"x","y","=0"];
        for (var i=0; i<6; i++){
            p[i]=Math.round(p[i]*100)/100;
            s[i]=(p[i]>0&&i>0) ? "+"+p[i]+s[i]: p[i]+s[i];
            if (p[i]==0) s[i]="";
        }
        formula = s[0]+s[1]+s[2]+s[3]+s[4]+s[5];




//        var xc = Math.abs(Math.round((target.focal1.x + target.focal2.x) * 50) / 100);
//        var yc = Math.abs(Math.round((target.focal1.y + target.focal2.y) * 50) / 100);
//        var f = Math.round(target.f * 100) / 100;
//        var a = Math.round(target.a * 100) / 100;
//        var b = Math.round(target.b * 100) / 100;
//        var sign_x = (xc >= 0) ? "-" : "+";
//        var sign_y = (yc >= 0) ? "-" : "+";
//        formula = "(x" + sign_x + xc + ")" + String.fromCharCode(178) + "/" + a + String.fromCharCode(178)
//            + "+(y" + sign_y + yc + ")" + String.fromCharCode(178) + "/" + b + String.fromCharCode(178) + "=1";
    }
    else if (target.type == "sin"){
        var dx = Math.abs(Math.round(target.dx * 100) / 100);
        var dy = Math.abs(Math.round(target.dy * 100) / 100);
        var kx = Math.abs(Math.round(1/2/target.kx * 100) / 100);
        var ky = Math.abs(Math.round(target.ky * 100) / 100);

        formula = "y="+ ky +"Sin((x-"+dx+")*"+kx+"PI)+"+dy;
    }
    return formula;
}

function getID(){
    if (selectedObj.id>-1) return selectedObj.id;
    else {
        var last=-1;
        for (var i=0; i<objects.length; i++){
            if (last!=objects[i].id-1) return i;
            last = i;
        }
        return objects.length;
    }
}

function draw_circle(center, point) {
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    var centerWorld = S2W(center), pointWorld = S2W(point);
    var radius = Math.pow((point.x - center.x), 2) + Math.pow((point.y - center.y), 2);
    if (radius == 0) return;
    context.beginPath();
    context.arc(center.x, center.y, Math.sqrt(radius), 0, 2 * Math.PI, true);
    context.stroke();
    addKeyPoint(centerWorld);
    addKeyPoint(pointWorld);
    var circle = {
        // equation: (x-center.x)^2 - (x-center.y)^2 = radius (already is radius^2)
        id: getID(),             // <===this part is wrong!!!!!!!!!!!
        type: "circle",
        center: centerWorld,
        point: pointWorld,
        radius: Math.sqrt(radius) / scaleWorld,
        formula: ""
    };
    objects.forEach(function (obj) {
        intersect(circle, obj)
    });
    circle.formula = getFormula(circle);
    addObject(circle);
    $(".functionWarp").append('<div class="functions">...</div>');
    divFunction = $(".functionWarp").children().last();
    divFunction.css("color", "white");
    divFunction.html(circle.formula);
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
    var line = {
        // equation: Ax+By+C=0
        id: getID(),
        type: "line",
        start: startWorld,
        end: endWorld,
        A: A,
        B: B,
        C: C,
        formula: ""
    };

    if(fullApp){
        objects.forEach(function (obj) {
            intersect(line, obj)
        });
        line.formula = getFormula(line);
        addObject(line);
        addKeyPoint(startWorld);
        addKeyPoint(endWorld);
        $(".functionWarp").append('<div class="functions">...</div>');
        divFunction = $(".functionWarp").children().last();
        divFunction.css("color", "white");
        divFunction.html(line.formula);
    }
}

function draw_ray(start, end) {
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    var startWorld = S2W(start), endWorld = S2W(end);
    var A = endWorld.y - startWorld.y, B = startWorld.x - endWorld.x, C = startWorld.y * endWorld.x - startWorld.x * endWorld.y;
    if (A == 0 && B == 0 && C == 0) return;
    context.beginPath();
    if (Math.abs(start.x-end.x)<100){
        var raystart = lerp(start, end, (1024-start.y)/(end.y-start.y));
        var rayend = lerp(end, start, end.y/(end.y-start.y));
    }
    else{
        var raystart = lerp(start, end, (1024-start.x)/(end.x-start.x));
        var rayend = lerp(end, start, end.x/(end.x-start.x));
    }
    context.moveTo(raystart.x, raystart.y);
    context.lineTo(rayend.x, rayend.y);
    context.stroke();

    var line = {
        // equation: Ax+By+C=0
        id: getID(),
        type: "ray",
        start: startWorld,
        end: endWorld,
        A: A,
        B: B,
        C: C,
        formula: ""
    };

    if(fullApp){
        objects.forEach(function (obj) {
            intersect(line, obj)
        });
        line.formula = getFormula(line);
        addObject(line);
        addKeyPoint(startWorld);
        addKeyPoint(endWorld);
        $(".functionWarp").append('<div class="functions">...</div>');
        divFunction = $(".functionWarp").children().last();
        divFunction.css("color", "white");
        divFunction.html(line.formula);
    }
}

function draw_ellipse(focal1, focal2, point) {
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    var focal1World = S2W(focal1), focal2World = S2W(focal2), pointWorld = S2W(point);
    var f = 0.5 * Math.sqrt(Math.pow((focal2.x - focal1.x), 2) + Math.pow((focal2.y - focal1.y), 2));
    var a = (calDistance(point, focal1) + calDistance(point, focal2)) / 2;
    var b = Math.sqrt(a * a - f * f);
    var alpha = Math.atan((focal2.y - focal1.y)/(focal2.x - focal1.x));
    if (b == 0) return;
    context.beginPath();
    context.ellipse(
        (focal1.x + focal2.x) / 2,
        (focal1.y + focal2.y) / 2,
        a, b, 0, 2, alpha
    );
    context.stroke();
    var ellipse = {
        id: getID(),
        type: "ellipse",
        focal1: focal1World,
        focal2: focal2World,
        a: a / scaleWorld,
        b: b / scaleWorld,
        f: f / scaleWorld,
        alpha: -alpha,
        point: pointWorld,
        formula: ""
    };
    if (fullApp){
        objects.forEach(function (obj) {
            intersect(ellipse, obj)
        });
        ellipse.formula = getFormula(ellipse);
        addObject(ellipse);
        addKeyPoint(focal1World);
        addKeyPoint(focal2World);
        addKeyPoint(pointWorld);
        $(".functionWarp").append('<div class="functions">...</div>');
        divFunction = $(".functionWarp").children().last();
        divFunction.css("color", "white");
        divFunction.html(ellipse.formula);
    }
};

function draw_sin(dx, dy, kx, ky) {
    var pointWorld = {x: 0, y: 0};
    var pointScreen = W2S(pointWorld);
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    context.beginPath();
    for (pointWorld.x = -centerX / scaleWorld; pointWorld.x < ($(".appWrap").width() - centerX) / scaleWorld; pointWorld.x += scale / 10) {
        pointWorld.y = -ky * Math.sin((pointWorld.x - dx) * Math.PI / 2 / kx) + dy;
        pointScreen = W2S(pointWorld);
        context.lineTo(pointScreen.x, pointScreen.y);
//        context.moveTo(pointScreen.x,pointScreen.y);
    }
    context.stroke();
    var sin = {
        id: getID(),
        type: "sin",
        dx: dx,
        dy: dy,
        kx: kx,
        ky: ky,
        formula: ""
    };
//    objects.forEach(function (obj) {
//        intersect(sin, obj)
//    });
    if (fullApp){
        sin.formula = getFormula(sin);
        addObject(sin);
        $(".functionWarp").append('<div class="functions">...</div>');
        divFunction = $(".functionWarp").children().last();
        divFunction.css("color", "white");
        divFunction.html(sin.formula);
    }
}

function draw_freehand(trail){
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    context.beginPath();
    for (var i=0; i<trail.length;i++){
        context.lineTo(W2S(trail[i]).x, W2S(trail[i]).y);
    }
    context.stroke();
    addObject({
        type: "freehand",
        trail: trail
    });

}

function polygon(vertices) {

}

function removeKeyPoints(target) {
    if (target.type == "line"||target.type == "ray") {
        var p1Removed = false, p2Removed = false;
        for (var i = 0; i < intersectPoints.length; i++) {
            var keyPoint = intersectPoints[i];
            if (target.id==keyPoint.id1||target.id==keyPoint.id2){
                console.log(keyPoint.id1+" , "+keyPoint.id2);
                intersectPoints.splice(i,1);
                i--;
            }
//            var error = Math.sqrt(Math.pow(target.A * keyPoint.x + target.B * keyPoint.y + target.C, 2) / (Math.pow(target.A, 2) + Math.pow(target.B, 2)));
//            if (error < 1e-10) {
//                intersectPoints.splice(i, 1);
//                i--;
//            }
        }
        for (var i = 0; i < keyPoints.length; i++) {
            var keyPoint = keyPoints[i];
            if (keyPoint.x == target.start.x && keyPoint.y == target.start.y && !p1Removed) {
                keyPoints.splice(i, 1);
                p1Removed = true;
                i--;
            }
            else if (keyPoint.x == target.end.x && keyPoint.y == target.end.y && !p2Removed) {
                keyPoints.splice(i, 1);
                p2Removed = true;
                i--;
            }
        }
    }
    else if (target.type == "circle") {
        var p1Removed = false, p2Removed = false;
        for (var i = 0; i < intersectPoints.length; i++) {
            var intersectionPoint = intersectPoints[i];
            var error = Math.sqrt(Math.pow((intersectionPoint.x - target.center.x), 2) + Math.pow((intersectionPoint.y - target.center.y), 2)) - target.radius;
            error = Math.abs(error);
            if (error < 1e-10) {
//                console.log(keyPoints.indexOf(keyPoint));
                intersectPoints.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < keyPoints.length; i++) {
            var keyPoint = keyPoints[i];
//            console.log(keyPoint);
            if (keyPoint.x == target.center.x && keyPoint.y == target.center.y && !p1Removed) {
                console.log(keyPoint);
                keyPoints.splice(i, 1);
                p1Removed = true;
                i--;
            }
            else if (keyPoint.x == target.point.x && keyPoint.y == target.point.y && !p2Removed) {
                console.log(keyPoint);
                keyPoints.splice(i, 1);
                p2Removed = true;
                i--;
            }
        }
    }
    else if (target.type == "ellipse") {
        var p1Removed = false, p2Removed = false, p3Removed = false;
        for (var i = 0; i < intersectPoints.length; i++) {
            var intersectionPoint = intersectPoints[i];
            var error = Math.abs(calDistance(intersectionPoint, target.focal1)+calDistance(intersectionPoint, target.focal2)-2*target.a);
            error = Math.abs(error);
            if (error < 1e-10) {
//                console.log(keyPoints.indexOf(keyPoint));
                intersectPoints.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < keyPoints.length; i++) {
            var keyPoint = keyPoints[i];
            console.log(keyPoint);
            if (keyPoint.x == target.focal1.x && keyPoint.y == target.focal1.y && !p1Removed) {
                console.log(keyPoint);
                keyPoints.splice(i, 1);
                p1Removed = true;
                i--;
            }
            else if (keyPoint.x == target.focal2.x && keyPoint.y == target.focal2.y && !p2Removed) {
                console.log(keyPoint);
                keyPoints.splice(i, 1);
                p2Removed = true;
                i--;
            }
            else if (keyPoint.x == target.point.x && keyPoint.y == target.point.y && !p3Removed) {
                console.log(keyPoint);
                keyPoints.splice(i, 1);
                p3Removed = true;
                i--;
            }
        }
    }
    if (snaptokeypoints&&fullApp) {
//        drawKeyPoints();
//        $("#baselineCanvas")[0].width = $("#baselineCanvas")[0].width;
        drawBoard({
            scale: Math.round(hammerScale),
            minX: 5 * (-Math.round(bw / 100)),
            minY: 5 * (-Math.round(bh / 100)),
            maxX: 5 * Math.round(bw / 100),
            maxY: 5 * Math.round(bh / 100),
            unitsPerTick: ticks
        });
        drawXAxis();
        drawYAxis();
    }
}

function drawPoint(point) {
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    context.beginPath();
    context.arc(point.x, point.y, 2, 0, 2 * Math.PI, true);
    context.stroke();
}

function addKeyPoint(point) {
//    if (!$.inArray(point, keyPoints)){
        keyPoints.push({x: point.x, y: point.y});
//    }
    if (snaptokeypoints) {
        drawKeyPoints();
    }
}

function addIntersectPoint(point,id1,id2) {
    intersectPoints.push({
        x: point.x,
        y: point.y,
        id1: id1,
        id2: id2
    });
    console.log("adding "+id1+" , "+id2);
    if (snaptokeypoints) {
        drawKeyPoints();
    }
}

function addObject(newObject) {
//    if (selectedIndex != -1) {
//        newObject.id = selectedObj.id;
//    }
    if (isRecording!="recording"){
        objects.splice(newObject.id, 0, newObject);
    }
    else {
        recording.push(newObject);
    }
//    objects.sort(function(a, b){return a.id-b.id})
}

function selectObject(tapPosScreen) {
    var nearest = 10 / scaleWorld;
    var selected = undefined;
    var tapPos = S2W(tapPosScreen);
    objects.forEach(function (target) {
        var error;
        if (target.type == "circle") {
            error = Math.sqrt(Math.pow((tapPos.x - target.center.x), 2) + Math.pow((tapPos.y - target.center.y), 2)) - target.radius;
            error = Math.abs(error);
        }
        else if (target.type == "line"||target.type == "ray") {
            error = Math.sqrt(Math.pow(target.A * tapPos.x + target.B * tapPos.y + target.C, 2) / (Math.pow(target.A, 2) + Math.pow(target.B, 2)));
        }
        else if (target.type == "ellipse") {
            error = Math.abs(calDistance(tapPos, target.focal1)+calDistance(tapPos, target.focal2)-2*target.a);
        }
        else if (target.type == "sin"){
            error = (Math.abs(tapPos.y-(target.dy+target.ky))<Math.abs(tapPos.y-(target.dy-target.ky)))?Math.abs(tapPos.y-(target.ky+target.dy)):Math.abs(tapPos.y-(target.dy-target.ky));
        }
        else if (target.type == "text"){
            error = calDistance(tapPos, target.position);
        }
//        console.log(error);
        if (error < nearest) {
            nearest = error;
            selected = target;
            selectedIndex = objects.indexOf(target);
//            selectedObj = target;
        }
    });
    if (selected == undefined) return undefined;

    return selected;
}

function highlight(selected) {
    var draftCanvas = document.getElementById("draftCanvas");
    var context = draftCanvas.getContext("2d");
    draftCanvas.width = draftCanvas.width;
    context.lineCap = 'round';
    context.strokeStyle = 'red';

//    console.log(selected);
    if (selected.type == "line") {
        context.beginPath();
        context.moveTo(W2S(selected.start).x, W2S(selected.start).y);
        context.lineTo(W2S(selected.end).x, W2S(selected.end).y);
        context.lineWidth = 3;
        context.stroke();
    }
    else if (selected.type == "ray") {
        context.beginPath();
        var start = W2S(selected.start), end = W2S(selected.end);
        if (Math.abs(start.x-end.x)<100){
            var raystart = lerp(start, end, (768-start.y)/(end.y-start.y));
            var rayend = lerp(end, start, end.y/(end.y-start.y));
        }
        else{
            var raystart = lerp(start, end, (1024-start.x)/(end.x-start.x));
            var rayend = lerp(end, start, end.x/(end.x-start.x));
        }
        context.moveTo(raystart.x, raystart.y);
        context.lineTo(rayend.x, rayend.y);
        context.lineWidth = 3;
        context.stroke();
    }
    else if (selected.type == "circle") {
        context.beginPath();
        context.arc(W2S(selected.center).x, W2S(selected.center).y, selected.radius * scaleWorld, 0, 2 * Math.PI, true);
        context.lineWidth = 3;
        context.stroke();
        context.beginPath();
        context.arc(W2S(selected.center).x, W2S(selected.center).y, 2, 0, 2 * Math.PI, true);
        context.moveTo(W2S(selected.center).x, W2S(selected.center).y);
        context.lineTo(W2S(selected.point).x, W2S(selected.point).y);
        context.lineWidth = 1;
        context.stroke();
        context.beginPath();
        context.arc(W2S(selected.point).x, W2S(selected.point).y, 2, 0, 2 * Math.PI, true);
        context.stroke();
    }
    else if (selected.type == "ellipse"){
        context.lineWidth = 3;
        context.ellipse(
            (W2S(selected.focal1).x + W2S(selected.focal2).x) / 2,
            (W2S(selected.focal1).y + W2S(selected.focal2).y) / 2,
            selected.a* scaleWorld, selected.b* scaleWorld, 0, 2, -selected.alpha
        );
    }
    else if (selected.type == "sin"){
        context.lineWidth = 3;
        var pointWorld = {x: 0, y: 0};
        var pointScreen = W2S(pointWorld);
        context.beginPath();
        for (pointWorld.x = -centerX / scaleWorld; pointWorld.x < ($(".appWrap").width() - centerX) / scaleWorld; pointWorld.x += scale / 10) {
            pointWorld.y = -selected.ky * Math.sin((pointWorld.x - selected.dx) * Math.PI / 2 / selected.kx) + selected.dy;
            pointScreen = W2S(pointWorld);
            context.lineTo(pointScreen.x, pointScreen.y);
        }
        context.stroke();
    }
    else if (selected.type == "text"){
        context.beginPath();
        context.fillStyle = Colors.obj;
        context.font = 'italic bold 16px sans-serif';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText(selected.content, W2S(selected.position).x, W2S(selected.position).y);
    }
    context.lineWidth = 1;
    if (selected.type!="text"){
        divFunction.html(getFormula(selected));
        $(".functions").each(function () {
            if ($(this).html().toString() == "") {
                $(this).remove();
            }
        });
    }
}

function refreshFinalCanvas() {
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    finalCanvas.width = finalCanvas.width;
    context.strokeStyle = Colors.obj;
//    context.shadowColor = '#555';
//    context.shadowBlur = 10;
//    context.shadowOffsetX = 5;
//    context.shadowOffsetY = 5;
    tables.forEach(function(selected){
        if(selected.type == "graph"){
            context.beginPath();
            selected.values.forEach(function(point){
                var pointScreen = W2S(point);
                context.lineTo(pointScreen.x, pointScreen.y);
                context.lineWidth = 3;
                context.strokeStyle =  selected.color;
            });
            context.stroke();
            selected.values.forEach(function(point){
                var pointScreen = W2S(point);
                context.beginPath();
                context.arc(pointScreen.x, pointScreen.y, 3, 0, 2 * Math.PI, true);
                context.fillStyle =  selected.color;
                context.fill();
                if (showCoord==true){
                    var coord = "("+Math.round(point.x*100)/100 +","+ Math.round(point.y*100)/100+")";
                    context.fillStyle = Colors.obj;
                    context.font = 'italic 12px sans-serif';
                    context.textAlign = 'left';
                    context.textBaseline = 'top';
                    context.fillText(coord, pointScreen.x, pointScreen.y);
                }
            });
        }
        else if (selected.type=="chart"){
            selected.values.forEach(function(point){
                var lefttop = W2S({x:point.x-0.25,y:point.y});
                var pointScreen = W2S(point);
                var rightbottom = W2S({x:point.x+0.25,y:0});
                context.beginPath();
                context.rect(lefttop.x, lefttop.y, rightbottom.x-lefttop.x, rightbottom.y-lefttop.y);
//                context.fillStyle = Colors.obj/2;
                context.fillStyle =  selected.color;
                context.fill();
                if (showCoord==true){
                    var coord = Math.round(point.y*100)/100;
                    context.fillStyle = Colors.obj;
                    context.font = 'italic 12px sans-serif';
                    context.textAlign = 'center';
                    context.textBaseline = 'bottom';
                    context.fillText(coord, pointScreen.x, pointScreen.y);
                }
            });
        }
    });
    context.lineWidth = 1;

    context.strokeStyle =  Colors.obj;
    objects.forEach(function (selected) {
        if (selected.type=="freehand"){
            context.beginPath();
            for (var i=0; i<selected.trail.length;i++){
                context.lineTo(W2S(selected.trail[i]).x, W2S(selected.trail[i]).y);
            }
            context.stroke();
        }
        if (selected.type == "line") {
            context.beginPath();
            context.moveTo(W2S(selected.start).x, W2S(selected.start).y);
            context.lineTo(W2S(selected.end).x, W2S(selected.end).y);
            context.lineWidth = 1;
            context.stroke();
        }
        else if (selected.type == "ray") {
            context.beginPath();
            var start = W2S(selected.start), end = W2S(selected.end);
            if (Math.abs(start.x-end.x)<100){
                var raystart = lerp(start, end, (768-start.y)/(end.y-start.y));
                var rayend = lerp(end, start, end.y/(end.y-start.y));
            }
            else{
                var raystart = lerp(start, end, (1024-start.x)/(end.x-start.x));
                var rayend = lerp(end, start, end.x/(end.x-start.x));
            }
            context.moveTo(raystart.x, raystart.y);
            context.lineTo(rayend.x, rayend.y);
            context.lineWidth = 1;
            context.stroke();
        }
        else if (selected.type == "circle") {
            context.beginPath();
            context.arc(W2S(selected.center).x, W2S(selected.center).y, selected.radius * scaleWorld, 0, 2 * Math.PI, true);
            context.lineWidth = 1;
            context.stroke();
        }
        else if (selected.type == "ellipse"){
            context.ellipse(
                (W2S(selected.focal1).x + W2S(selected.focal2).x) / 2,
                (W2S(selected.focal1).y + W2S(selected.focal2).y) / 2,
                selected.a* scaleWorld, selected.b* scaleWorld, 0, 2, -selected.alpha
            );
        }
        else if(selected.type == "sin"){
            var pointWorld = {x: 0, y: 0};
            var pointScreen = W2S(pointWorld);
            context.beginPath();
            for (pointWorld.x = -centerX / scaleWorld; pointWorld.x < ($(".appWrap").width() - centerX) / scaleWorld; pointWorld.x += scale / 10) {
                pointWorld.y = -selected.ky * Math.sin((pointWorld.x - selected.dx) * Math.PI / 2 / selected.kx) + selected.dy;
                pointScreen = W2S(pointWorld);
                context.lineTo(pointScreen.x, pointScreen.y);
            }
            context.stroke();
        }
        else if(selected.type == "text"){
            context.beginPath();
            context.fillStyle = Colors.obj;
            context.font = 'italic 12px sans-serif';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText(selected.content, W2S(selected.position).x, W2S(selected.position).y);
        }
    });
    if (snaptokeypoints) {
        drawKeyPoints();
    }
}

function drawKeyPoints() {
    var baselineCanvas = document.getElementById("baselineCanvas");
    var context = baselineCanvas.getContext("2d");
    keyPoints.forEach(function (point) {
        var pointScreen = W2S(point);
        var coord = "("+Math.round(point.x*100)/100 +","+ Math.round(point.y*100)/100+")";
        context.beginPath();
        context.arc(pointScreen.x, pointScreen.y, 2, 0, 2 * Math.PI, true);
        context.strokeStyle = Colors.obj;
        context.stroke();
        if (showCoord==true){
            context.fillStyle = Colors.obj;
            context.font = 'italic 12px sans-serif';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText(coord, pointScreen.x, pointScreen.y);
        }
    });
    intersectPoints.forEach(function (point) {
        var pointScreen = W2S(point);
        var coord = "("+Math.round(point.x*100)/100 +","+ Math.round(point.y*100)/100+")";
        context.beginPath();
        context.arc(pointScreen.x, pointScreen.y, 2, 0, 2 * Math.PI, true);
        context.strokeStyle = Colors.keyPoint;
        context.stroke();
        if (showCoord==true){
            context.fillStyle = Colors.keyPoint;
            context.font = 'italic 12px sans-serif';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText(coord, pointScreen.x, pointScreen.y);
        }
    });
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

function snapToKeyPoint(point) {
    var shortest = 100;
    var nearest = {x: point.x, y: point.y};
    keyPoints.forEach(function (keyPointWorld) {
        var keyPoint = W2S(keyPointWorld);
        var distance = Math.pow((point.x - keyPoint.x), 2) + Math.pow((point.y - keyPoint.y), 2);
        if (distance < shortest) {
            shortest = distance;
            nearest.x = keyPoint.x;
            nearest.y = keyPoint.y;
        }
    });
    intersectPoints.forEach(function (keyPointWorld) {
        var keyPoint = W2S(keyPointWorld);
        var distance = Math.pow((point.x - keyPoint.x), 2) + Math.pow((point.y - keyPoint.y), 2);
        if (distance < shortest) {
            shortest = distance;
            nearest.x = keyPoint.x;
            nearest.y = keyPoint.y;
        }
    });
    return nearest;
}

function snapToGrid(point) {
    var nearest = {x: point.x, y: point.y};
    nearest.x = Math.round(nearest.x / scaleWorld) * scaleWorld;
    nearest.y = Math.round(nearest.y / scaleWorld) * scaleWorld;
    return nearest;
}

function snapToObject(point){
    var object = selectObject(point);
    var nearest = {x: point.x, y: point.y};
    if (object==undefined){
        return nearest;
    }
    else if (object.type == "circle"){
        nearest = lerp(
            W2S(object.center),
            point,
            (object.radius*scaleWorld)/calDistance(point,W2S(object.center))
        );
    }
    else if (object.type == "line"||object.type == "ray"){
        var A = object.A, B = object.B, C = object.C;
        var x0 = S2W(point).x, y0 = S2W(point).y;
        nearest = W2S({
            x: (  B*B*x0  -  A*B*y0  -  A*C  ) / ( A*A + B*B ),
            y: ( -A*B*x0 + A*A*y0 - B*C  ) / ( A*A + B*B )
        });
    }
    return nearest;
}

function snap(point) {
    if (snaptogrid) {
        return snapToGrid(point);
    }
    if (snaptokeypoints) {
        return snapToKeyPoint(point);
    }
    if (snaptoobject) {
        return snapToObject(point);
    }
    return point;
}

function plot(formula){
    console.log(formula);
    var poly = parseFormula(formula); //    Ax2+Bxy+Cy2+Dx+Ey+F=0
    console.log(poly);
    var A = poly[0].coeff, B = poly[1].coeff, C = poly[2].coeff,
        D = poly[3].coeff, E = poly[4].coeff, F = poly[5].coeff;
    if (A==0&&B==0&&C==0){ //line
        var start = W2S({x:0,y:-F/E}), end = W2S({x:-F/D,y:0});
        draw_ray(start,end);
    }
    else if (A==C&&B==0){ // circle
        var a = -D/(2*A), b=-E/(2*C), r = Math.sqrt(a*a+b*b-F/A);
        draw_circle(W2S({x:a,y:b}),W2S({x:(a+r),y:b}));
    }
    else if (A*C>0){ // ellipse
        if (B!=0){
            var m = (B*E-2*C*D)/(4*A*C-B*B),
                n = -(m*2*A+D)/B;
        }
        else{
            var m = -D/(2*A),
                n = -E/(2*C);
        }
        var scale = (A*m*m+B*m*n+C*n*n-F)/(A*C-B*B/4);

        A=A*scale, B=B*scale, C=C*scale;
        var alpha = 0.5*Math.atan(B/(A-C));
        var max = Math.PI/2, min = -Math.PI/2;
        if(A==C&&B<0){max=Math.PI/4, min=Math.PI/4} else if(A==C&&B>0){max=-Math.PI/4, min=-Math.PI/4}
        else if (A>C&&B<=0){ max=Math.PI/2, min=Math.PI/4; } else if (A>C&&B>=0){ max=-Math.PI/4, min=-Math.PI/2; } else if (A<C&&B<=0){ max=Math.PI/4, min=0; } else if (A<C&&B>=0){ max=0, min=-Math.PI/4; }
        console.log("["+min+","+max+"]"+" <- "+alpha);
        if (alpha>max){alpha-=Math.PI/2} else if (alpha<min){alpha+=Math.PI/2}

        var sin2 = Math.pow(Math.sin(alpha),2), cos2 = Math.pow(Math.cos(alpha),2);
        var b = Math.sqrt((C*sin2-A*cos2)/(sin2*sin2-cos2*cos2));
        var a = Math.sqrt((C*cos2-A*sin2)/(cos2*cos2-sin2*sin2));
        if (A==C){a=Math.sqrt(A-B/2);b=Math.sqrt(A+B/2);}

        var f = Math.sqrt(Math.abs(a*a-b*b));
        var f1 = {
            x: f*Math.cos(alpha)+m,
            y: f*Math.sin(alpha)+n
        };
        var f2 = {
            x: -f*Math.cos(alpha)+m,
            y: -f*Math.sin(alpha)+n
        };
        a = (a>b)? a:b;
        var point = {
            x: a*Math.cos(alpha)+m,
            y: a*Math.sin(alpha)+n
        };
        draw_ellipse(W2S(f1),W2S(f2),W2S(point));
    }
}

function replaceAll(find, replace, str)
{
    while( str.indexOf(find) >= 0 )
    {
        str = str.replace(find, replace);
    }
    return str;
}

var timeoutcount;
function message(msg){
    clearTimeout(timeoutcount);
    $(".messagebox").html(msg).fadeIn(500,function(){
            timeoutcount=setTimeout(function(){
                $(".messagebox").fadeOut(500);
            },5000)
        }

    );
}


