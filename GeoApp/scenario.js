function scenario() {
    this.objects = new Array();
    this.keyPoints = new Array();
    this.intersections = new Array();

    this.descripstion = "";
    this.answer = {
        type: "angle",
        objective: "equalsto", //greater than
        tolerance: 0.05

    };


}

scenario.prototype.refresh = function(){
    var finalCanvas = document.getElementById("finalCanvas");
    var context = finalCanvas.getContext("2d");
    finalCanvas.width = finalCanvas.width;
    context.strokeStyle = Colors.obj;
    context.shadowColor = '#555';
    context.shadowBlur = 10;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    this.objects.forEach(function (selected) {
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

scenario.prototype.compare = function(){
    if (this.answer.objective == "equalsto"){

    }
    else if (this.answer.objective == "lessthan"){

    }
    else if (this.answer.objective == "greaterthan"){

    }
}

scenario.prototype.construct_problem = function(){

}