var refCanvas;

var bw = $(".appWrap").width()*1.2;
var bh = $(".appWrap").height()*1.2;
console.log(bw);
console.log(bh);
var centerX,centerY,lastCenterX,lastCenterY;
var ctx;
var ticks = 10;
var hammertime;
var posX=0, posY=0,
        lastPosX=0, lastPosY=0,
        bufferX=0, bufferY=0,
        hammerScale=2, last_scale,
        dragReady=0;

var index_highest = 0,
    lastScaleTransform = {
        width: 0,
        height: 0,
        ratio: 1
    };


function initBaseline() {
		
        refCanvas = this;
        //console.log(refCanvas);
        canvas  = document.getElementById('baselineCanvas');
        ctx = canvas.getContext("2d");
        //console.log(bw,bh);
        bw = 100*(Math.round(bw/100));
        bh = 100*(Math.round(bh/100));
        //console.log(bw,bh);
        // if((bw/20)%20!=0){
        //   bw = bw + 200;
        // }
        // if((bh/20)%20!=0){
        //   bh = bh + 200;
        // }
        //console.log(bw,bh);
        drawBoard({
        	scale: 2,
        	minX: 5*(-Math.round(bw/100)),
        	minY: 5*(-Math.round(bh/100)),
        	maxX: 5*Math.round(bw/100),
        	maxY: 5*Math.round(bh/100),
        	unitsPerTick: ticks
        });
        drawXAxis();
        drawYAxis();
        addEvents();
      	////console.log(graph);
};

function drawBoard(config){
    canvasClear();
    scale = config.scale;
    minX = config.minX/scale;
    minY = config.minY/scale;
    maxX = config.maxX/scale;
    maxY = config.maxY/scale;
    unitsPerTick = config.unitsPerTick;
    //console.log(config);
    ////console.log(minX, minY, maxX, maxY);
    //console.log(ctx);	
    ctx.beginPath();  
	var p = 0;
	ctx.lineWidth = 0.5;
    var increment;

    if(scale<0.4 && scale >0.05){
        increment = 100*scale;
    }
    else if(scale<=0.05){
        increment = 1000*scale;
    }
    else{
        increment = 10*scale;
    }
    //console.log(bw,bh,increment);
	for (var x = 0; x <= bw; x += increment) {
		ctx.moveTo(0.5 + x + p, p);
		ctx.lineTo(0.5 + x + p, bh + p);
       // //console.log('x',x);
	}
      
	for (var x = 0; x <= bh; x += increment) {
		ctx.moveTo(p, 0.5 + x + p);
		ctx.lineTo(bw + p, 0.5 + x + p);
       // //console.log('y',x);
	}
		  
    // constants
    font = '8pt Calibri';
    tickSize = 10;
      ////console.log(font);
      // relationships
    rangeX = maxX - minX;
    rangeY = maxY - minY;
    unitX = bw / rangeX;
    unitY = bh / rangeY;

    if(centerY==undefined && centerX==undefined){
        centerX = (bw-220)/2;
        centerY = (bh-43)/2;
//    	    centerY = Math.round(Math.abs(minY / rangeY) * bh);
//      	centerX = Math.round(Math.abs(minX / rangeX) * bw);
      	centerY = increment*Math.round(centerY/(increment));
      	centerX = increment*Math.round(centerX/(increment));
    };

    iteration = (maxX - minX) / 1000;
    scaleX = bw / rangeX;
    scaleY = bh / rangeY;     
	ctx.strokeStyle = Colors.grid;
    ctx.fillStyle = Colors.obj;
	ctx.stroke();
};

function drawXAxis(){
	    
	var xPosIncrement = unitsPerTick * unitX;
    var xPos, unit;
    // ctx.font = '8pt Calibri';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    //ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(bw, centerY);
    ctx.strokeStyle = Colors.obj;
    ctx.lineWidth = 1.5;
	ctx.stroke();

    // draw left tick marks
    xPos = centerX - xPosIncrement;
    unit = -1 * 	unitsPerTick;
    //console.log(xPos, unit);
    while(xPos > 0) {
        ctx.moveTo(xPos, 0.5 + centerY - 5 - tickSize / 2);
        ctx.lineTo(xPos, 0.5 + centerY - 5 + tickSize / 2);
        ctx.stroke();
        ctx.fillText(unit, xPos, centerY + tickSize / 2 + 3);
        unit -= unitsPerTick;
        xPos = Math.round(xPos - xPosIncrement);
    }

    // draw right tick marks
    xPos = centerX + xPosIncrement;
    unit = unitsPerTick;
    while(xPos < bw) {
    	ctx.moveTo(xPos, 0.5 + centerY - 5 - tickSize / 2);
        ctx.lineTo(xPos, 0.5 + centerY - 5 + tickSize / 2);
        ctx.stroke();
        ctx.fillText(unit, xPos, centerY + tickSize / 2 + 3);
        unit += unitsPerTick;
        xPos = Math.round(xPos + xPosIncrement);
    }
    
    ctx.closePath();
};

function drawYAxis(){
    // draw tick marks
    var yPosIncrement = unitsPerTick * unitY;
    var yPos, unit;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'right';
    // draw top tick marks
    yPos = centerY - yPosIncrement;
    unit = unitsPerTick;

    //ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX,0);
    ctx.lineTo(centerX, bh);
    ctx.strokeStyle = Colors.obj;
    ctx.lineWidth = 1.5;
    ctx.stroke();
        
    while(yPos > 0) {
	    ctx.moveTo(0.5 + centerX - 5 - tickSize / 2, yPos);
    	ctx.lineTo(0.5 + centerX - 5 + tickSize / 2, yPos);
        ctx.stroke();
        ctx.fillText(unit, centerX - tickSize / 2 - 3, yPos);
        unit += unitsPerTick;
        yPos = Math.round(yPos - yPosIncrement);
    }

    // draw bottom tick marks
    yPos = centerY + yPosIncrement;
    unit = -1 * unitsPerTick;
    while(yPos < bh) {
        ctx.moveTo(0.5 + centerX - 5 - tickSize / 2, yPos);
        ctx.lineTo(0.5 + centerX - 5 + tickSize / 2, yPos);
        ctx.stroke();
        ctx.fillText(unit, centerX - tickSize / 2 - 3, yPos);
        unit -= unitsPerTick;
        yPos = Math.round(yPos + yPosIncrement);
    }
    ctx.closePath();
 };

function addEvents(){
	if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
	   Hammer.plugins.showTouches();
	}
		 
	if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
	   Hammer.plugins.fakeMultitouch();
	}

	if(hammertime == undefined){
        hammertime = Hammer(document.getElementById('baselineCanvas'), {
        	transform_always_block: true,
        	transform_min_scale: 1,
        	drag_block_horizontal: true,
        	drag_block_vertical: true,
        	drag_min_distance: 0
    	});

    	hammertime.on('touch drag dragend transform', function(ev) {
    		refCanvas.manageMultitouch(ev);
    	});
    }
};

function manageMultitouch(ev){
	elemRect = ev.target.parentElement;
    switch(ev.type) {
    	case 'touch':
            var lastTransform = ev.target.parentElement.style.webkitTransform;
            lastPosX = posX;
            lastPosY = posY;
            lastCenterX = centerX;
            lastCenterY = centerY;
            last_scale = scale;
            // //console.log(posX,posY);
            break;

        case 'drag':
            posX = ev.gesture.deltaX + lastPosX;
            posY = ev.gesture.deltaY + lastPosY;
            // //console.log(posX,posY);

            if(hammerScale>1){
                hammerScale = Math.round(hammerScale);
            }
            else if(hammerScale<1 && hammerScale>0.1){
                hammerScale = Math.round(hammerScale*10)/10;
            }
            else{
                hammerScale = Math.round(hammerScale*100)/100;
            }

            drawBoard({
        	    scale: hammerScale,
        	    minX: 5*(-Math.round(bw/100)),
        	    minY: 5*(-Math.round(bh/100)),
        	    maxX: 5*Math.round(bw/100),
        	    maxY: 5*Math.round(bh/100),
        	    unitsPerTick: ticks
            });
            var increment;
            if(scale<0.4 && scale >0.05){
                increment = 100*scale;
            }
            else if(scale<=0.05){
                increment = 1000*scale;
            }
            // else if(scale>=3.5){
            //     increment = 1*scale;
            // }
            else{
                increment = 10*scale;
            }
            scaleWorld = 10*scale;
            centerX = ev.gesture.deltaX + lastCenterX;
            centerY = ev.gesture.deltaY + lastCenterY;

            centerY = increment*Math.round(centerY/(increment));
            centerX = increment*Math.round(centerX/(increment));
            drawXAxis();
            drawYAxis();
            refreshFinalCanvas();
       //   //console.log('POSITION: '+$('#canvasView').width() );
            break;

        case 'transform':

        	hammerScale = Math.max(0.02, Math.min(last_scale * ev.gesture.scale, 15));

            if(hammerScale>=3.5){
        	    ticks = 1;
        	}
        	else if(hammerScale<0.4 && hammerScale >0.05){
        		ticks = 100;
        	}
            else if(hammerScale<=0.05){
                ticks = 1000;
            }
        	else{
        		ticks = 10;
        	}
              
        	// //console.log(hammerScale);

            if(hammerScale>1){
                hammerScale = Math.round(hammerScale);
            }
            else if(hammerScale<1 && hammerScale>0.1){
                hammerScale = Math.round(hammerScale*10)/10;
            }
            else{
                hammerScale = Math.round(hammerScale*100)/100;
            }

            drawBoard({
        	    scale: hammerScale,
        		minX: 5*(-Math.round(bw/100)),
        	    minY: 5*(-Math.round(bh/100)),
        	    maxX: 5*Math.round(bw/100),
        	    maxY: 5*Math.round(bh/100),
        	    unitsPerTick: ticks
        	});

            if(scale<0.4 && scale >0.05){
                increment = 100*scale;
            }
            else if(scale<=0.05){
                increment = 1000*scale;
            }
            // else if(scale>=3.5){
            //     increment = 1*scale;
            // }
            else{
                increment = 10*scale;
            }
            scaleWorld = 10*scale;
            //console.log('BEFORE',centerX,centerY);
        	centerY = increment*Math.round(centerY/(increment));
        	centerX = increment*Math.round(centerX/(increment));
        	//console.log('AFTER',centerX,centerY);
        	drawXAxis();
        	drawYAxis();
            refreshFinalCanvas();

        	break;

        case 'dragend':
                
        	// refCanvas.drawXAxis();
        	// refCanvas.drawYAxis();

	    	lastCenterX = centerX;
    		lastCenterY = centerY;
        	////console.log(lastCenterX,lastCenterY);
        	lastPosY = posY;
        	lastPosX = posX;
        	       
        	break;
    }
};

function canvasClear() {
    ctx.clearRect(0, 0, bw, bh);
};

