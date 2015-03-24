/**
 * Created with JetBrains WebStorm.
 * User: fanzhang
 * Date: 7/12/13
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    var canvasWidth = $(".appWrap").width();
    var canvasHeight = $(".appWrap").height()-43;
    $('#canvasDiv').css("width", canvasWidth);
    $('#canvasDiv').css("height", canvasHeight+"px");
    $('#canvasDiv').html(
        '<canvas id="draftCanvas" width='+ ($("#canvasDiv").width()) + ' height=' + ($("#canvasDiv").height()) + '></canvas>' +
        '<canvas id="finalCanvas" width='+ ($("#canvasDiv").width()) + ' height=' + ($("#canvasDiv").height()) + '></canvas>' +
        '<canvas id="baselineCanvas" width='+ ($("#canvasDiv").width()) + ' height=' + ($("#canvasDiv").height()) + '></canvas>'
    );
    $('#canvasDiv').css("background-color", "#ffffff");
    initCanvas();
    initBaseline();
    $("body").on('keyup','input[type="text"]',resizeInput);
//    $('input[type="text"]')
//        .keyup(resizeInput)
//        // resize on page load
//        .each(resizeInput);
    $(".inputPop").on("tap click","#plot_line_button", function(){
        var A=$("#input_line_A").val();
        var B=$("#input_line_B").val();
        var C=$("#input_line_C").val();
        var start = W2S({x:0,y:-C/B}), end = W2S({x:-C/A,y:0});
        draw_ray(start,end);
    });
    $(".inputPop").on("tap click","#plot_circle_button", function(){
        var a = parseFloat($("#input_circle_a").val());
        var b = parseFloat($("#input_circle_b").val());
        var r = parseFloat($("#input_circle_r").val());
        draw_circle(W2S({x:a,y:b}), W2S({x:(a+Math.abs(r)),y:b}));
    });
    $(".inputPop").on("tap click","#plot_ellipse_button", function(){
        var a = parseFloat($("#input_ellipse_a").val());
        var b = parseFloat($("#input_ellipse_b").val());
        var m = parseFloat($("#input_ellipse_m").val());
        var n = parseFloat($("#input_ellipse_n").val());
        var f = Math.sqrt(Math.abs(a*a-b*b));
        var f1 = (a>b)?{x:(m-f),y:n}:{x:m,y:n-f};
        var f2 = (a>b)?{x:(m+f),y:n}:{x:m,y:n+f};
        var point = (a>b)?{
            x:(f1.x+f2.x)/2+a,
            y:(f1.y+f2.y)/2
        }:{
            x:(f1.x+f2.x)/2,
            y:(f1.y+f2.y)/2+b
        };
        draw_ellipse(W2S(f1), W2S(f2), W2S(point));
    });
    $(".inputPop").on("tap click","#plot_button", function(){
        plot(document.getElementById("input_text").value);
    });

});

function resizeInput() {
    $(this).val($(this).val().replace(String.fromCharCode(34),""));
    $(this).val($(this).val().replace(String.fromCharCode(34),""));
    $(this).val($(this).val().replace("x2","x^2").replace("y2","y^2"));
    $(this).val($(this).val().replace("x"+String.fromCharCode(178),"x^2").replace("y"+String.fromCharCode(178),"y^2"));
    var bytes =  ($(this).val().length>$(this).attr("placeholder").length)?$(this).val().length:$(this).attr("placeholder").length;
    var newsize = (bytes+1)*10;
    if (newsize>420) newsize=420;
    $(this).animate({
        width: newsize+'px'
    }, 200 )
}



//    Preload
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}
preload([
    'img/icons/circle.png',
    'img/icons/circleOn.png',
    'img/icons/GridS.png',
    'img/icons/GridSOn.png',
    'img/icons/Hand.png',
    'img/icons/HandOn.png',
    'img/icons/lightOff.png',
    'img/icons/lightOffOn.png',
    'img/icons/lightOn.png',
    'img/icons/lightOnOn.png',
    'img/icons/line.png',
    'img/icons/lineOn.png',
    'img/icons/pencil.png',
    'img/icons/pencilOn.png',
    'img/icons/pointS.png',
    'img/icons/pointSOn.png',
    'img/icons/poly.png',
    'img/icons/polyOn.png',
    'img/icons/resize.png',
    'img/icons/resizeOn.png',
    'img/icons/Sin.png',
    'img/icons/SinOn.png',
    'img/icons/Sphear.png',
    'img/icons/SphearOn.png',
    'img/icons/Hand.png',
    'img/icons/HandOn.png',
    'img/icons/move.png',
    'img/icons/moveOn.png',
    'img/icons/trash.png',
    'img/icons/trashOn.png'
]);


var popFlag = 0;
var elipsFlag = 0;
var lineFlag = 0;
var funcWrap = 1;
var tblWrap = 0;
var toPoint = 0;
var toGird = 0;
var toObj = 0;
var toTan = 0;
var light = 0;
$(".conic_radiobutton").on("tap click",function(){
    if(popFlag==0){
        $(".conicPop").animate({
            bottom:20
        },400);
        popFlag = 1;
    } else {
        $(".conicPop").animate({
            bottom:-100
        },400);
        popFlag = 0;
    }
    message("Draw a conic section(circle or ellipse).");
});
$(".line_radiobutton").on("tap click",function(){
    if(popFlag==0){
        $(".linePop").animate({
            bottom:20
        },400);
        popFlag = 1;
    } else {
        $(".linePop").animate({
            bottom:-100
        },400);
        popFlag = 0;
    }
    message("Draw a line or a segment.");
});
$(".input_radiobutton").on("tap click",function(){
    focusCanvas("baselineCanvas");
    currentAction = "handtool";

    if(popFlag==0){
        $(".inputPop").fadeIn(400);
        popFlag = 1;
    } else {
        $(".inputPop").fadeOut(400);
        popFlag = 0;
    }
    message("Plot a shape from a equation.");
});
$(".lineseg_radiobutton").on("tap click",function(){
    lineFlag = 0;
    $(".linePop").animate({
        bottom:-100
    },400);
    popFlag = 0;
    $(".line_radiobutton").css({
        content: 'url("img/icons/LineSegOn.png")',
        margin: '0 15px 0 15px'
    });
    message("Swipe to define start and end point of a line segment");
});

$(".ray_radiobutton").on("tap click",function(){
    lineFlag = 1;
    $(".linePop").animate({
        bottom:-100
    },400);
    popFlag = 0;
    $(".line_radiobutton").css({
        content: 'url("img/icons/lineOn.png")',
        margin: '0px 15px 0px 15px'
    });
    message("Swipe to define two points on a line");
});
$(".circle_radiobutton").on("tap click",function(){
    elipsFlag = 0;
    $(".conicPop").animate({
        bottom:-100
    },400);
    popFlag = 0;
    $(".conic_radiobutton").css({
        content: 'url("img/icons/circleOn.png")',
        margin: '0 15px 0 15px'
    });
    message("Swipe to define center and a point on the circle");
});

$(".ellipse_radiobutton").on("tap click",function(){
    elipsFlag = 1;
    $(".conicPop").animate({
        bottom:-100
    },400);
    popFlag = 0;
    $(".conic_radiobutton").css({
        content: 'url("img/icons/SphearOn.png")',
        margin: '0px 15px 0px 15px'
    });
    message("Swipe to define 2 foci and touch to define a point on the curve");
});

$(".leftGroup > div").on("tap, click",function(){
    $(".leftGroup > div").each(function(){
        var currentClass = $(this).attr('class').split(" ")[0];
        if(currentClass == 'drawing_radiobutton'){
            $(this).css({
                content:'url("img/icons/pencil.png")'
            });
        } else if(currentClass == 'conic_radiobutton'){
            if(elipsFlag == 0){
                $(this).css({
                    content: 'url("img/icons/circle.png")',
                    margin: '0 15px 0 15px'
                });
            } else if(elipsFlag == 1){
                $(this).css({
                    content: 'url("img/icons/Sphear.png")',
                    margin: '0 15px 0 15px'
                });
            }
        } else if(currentClass == 'line_radiobutton'){
            if(lineFlag == 0){
                $(this).css({
                    content: 'url("img/icons/LineSeg.png")',
                    margin: '0 15px 0 15px'
                });
            } else if(lineFlag == 1){
                $(this).css({
                    content: 'url("img/icons/line.png")',
                    margin: '0 15px 0 15px'
                });
            }
        } else if(currentClass == 'sine_radiobutton'){
            $(this).css({
                content:'url("img/icons/Sin.png")'
            });
        } else if(currentClass == 'text_radiobutton'){
            $(this).css({
                content:'url("img/icons/text.png")'
            });
//        } else if(currentClass == 'snaptogrid_checkbox'){
//            $(this).css({
//                content:'url("img/icons/GridS.png")'
//            });
        } else if(currentClass == 'handtool_radiobutton'){
            $(this).css({
                'content':'url("img/icons/Hand.png")'
            });
        } else if(currentClass == 'delete_radiobutton'){
            $(this).css({
                'content':'url("img/icons/trash.png")'
            });
        }else if(currentClass == 'move_radiobutton'){
            $(this).css({
                content:'url("img/icons/move.png")'
            });
        } else if(currentClass == 'resize_radiobutton'){
            $(this).css({
                content:'url("img/icons/resize.png")'
            });
//        } else if(currentClass == 'nightvision'){
//            $(this).css({
//                content:'url("img/icons/lightOff.png")'
//            });
        }

    });
    if(!$(this).hasClass('conic_radiobutton')){
        $(".conicPop").animate({bottom:-100},400);
        popFlag = 0;
    }
    if(!$(this).hasClass('line_radiobutton')){
        $(".linePop").animate({bottom:-100},400);
        popFlag = 0;
    }
    if(!$(this).hasClass('input_radiobutton')){
        $(".inputPop").fadeOut(400);
        popFlag = 0;
    }
//    $(this).css({
//        'box-shadow': 'inset 1px 1px 10px 2px rgba(0,0,0,0.8)',
//        'background': 'rgba(255,255,255,0.12)'
//    },200);

    var currentClass = $(this).attr('class').split(" ")[0];

    if(currentClass == 'drawing_radiobutton'){
        $(this).css({
            content:'url("img/icons/pencilOn.png")'
        });
    } else if(currentClass == 'line_radiobutton'){
        if(lineFlag == 0){
            $(this).css({
                content: 'url("img/icons/LineSegOn.png")',
                height: 30,
                margin: '0 15px 0 15px'
            });
        } else if(lineFlag == 1){
            $(this).css({
                content: 'url("img/icons/lineOn.png")',
                margin: '0 15px 0 15px'
            });
        }
    } else if(currentClass == 'conic_radiobutton'){
        if(elipsFlag == 0){
            $(this).css({
                content: 'url("img/icons/circleOn.png")',
                height: 30,
                margin: '0 15px 0 15px'
            });
        } else if(elipsFlag == 1){
            $(this).css({
                content: 'url("img/icons/SphearOn.png")',
                height: 30,
                margin: '0 15px 0 15px'
            });
        }
    } else if(currentClass == 'sine_radiobutton'){
        $(this).css({
            content:'url("img/icons/SinOn.png")'
        });
        message("Swipe to draw a sine curve");
    } else if(currentClass == 'text_radiobutton'){
        $(this).css({
            content:'url("img/icons/textOn.png")'
        });
//    } else if(currentClass == 'snaptogrid_checkbox'){
//        $(this).css({
//            content:'url("img/icons/GridSOn.png")'
//        });
    } else if(currentClass == 'handtool_radiobutton'){
        $(this).css({
            'content':'url("img/icons/HandOn.png")'
        });
        message("Drag with one finger to move axis or zoom in/out with two");
    } else if(currentClass == 'input_radiobutton'){
        $('.handtool_radiobutton').css({
            'content':'url("img/icons/HandOn.png")'
        });
    } else if(currentClass == 'delete_radiobutton'){
        $(this).css({
            'content':'url("img/icons/trashOn.png")'
        });
        message("Select an object and drag to delete");
    } else if(currentClass == 'move_radiobutton'){
        $(this).css({
            content:'url("img/icons/moveOn.png")'
        });
        message("Select an object and drag to move");
    } else if(currentClass == 'resize_radiobutton'){
        $(this).css({
            content:'url("img/icons/resizeOn.png")'
        });
        message("Select an object and drag to resize");
//    } else if(currentClass == 'nightvision'){
//        $(this).css({
//            content:'url("img/icons/lightOffOn.png")'
//        });
    }
});


$('.snaptokeypoint_checkbox').on('tap click',function(){
    if(toPoint == 0){
        $(this).css({
            content:'url("img/icons/pointSOn.png")'
        });
        toPoint = 1;
        message("Show and snap gestures to keypoints");
    } else {
        $(this).css({
            content:'url("img/icons/pointS.png")'
        });
        toPoint = 0;
        message("Hide and do NOT snap gestures to keypoints");
    }
});

$('.snaptogrid_checkbox').on('tap click',function(){
    if(toGird == 0){
        $(this).css({
            content:'url("img/icons/GridSOn.png")'
        });
        toGird = 1;
        message("Snap gestures to grid");
    } else {
        $(this).css({
            content:'url("img/icons/GridS.png")'
        });
        toGird = 0;
        message("Do NOT snap gestures to grid");
    }
});
$('.snaptoobject_checkbox').on('tap click',function(){
    if(toObj == 0){
        $(this).css({
            content:'url("img/icons/magObjOn.png")'
        });
        toObj = 1;
        message("Snap gestures to objects");
    } else {
        $(this).css({
            content:'url("img/icons/magObj.png")'
        });
        toObj = 0;
        message("Do NOT snap gestures to objects");
    }
});

$('.snaptotangent_checkbox').on('tap click',function(){
    if(toTan == 0){
        $(this).css({
            content:'url("img/icons/magTanOn.png")'
        });
        toTan = 1;
        message("Snap line objects to tangents of conic objects");
    } else {
        $(this).css({
            content:'url("img/icons/magTan.png")'
        });
        toTan = 0;
        message("Do NOT snap line objects to tangents");
    }
});

$('.showCoord').on('tap click',function(){
    if(showCoord == false){
        $(this).css({
            content:'url("img/icons/xyOn.png")'
        });
        showCoord = true;
        $(".snaptokeypoint_checkbox").css({
            content:'url("img/icons/pointSOn.png")'
        });
        toPoint = 1;
        snaptokeypoints=true;
        message("Show point coordinates");
    } else {
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
        $(this).css({
            content:'url("img/icons/xy.png")'
        });
        showCoord = false;
        message("Do not show point coordinates");
    }
    if (snaptokeypoints) {
        drawKeyPoints();
    }

});

$('.nightvision').on('tap click',function(){
    if(light == 0){
        $(this).css({
            content:'url("img/icons/lightOffOn.png")'
        });
        light = 1;
    } else {
        $(this).css({
            content:'url("img/icons/lightOff.png")'
        });
        light = 0;
    }
});

$(".functionBtn").on('tap click',function(){
    if(funcWrap==0){
        $(".functionDiv").animate({
            'right':'-400px'
        },200);
        funcWrap = 1;
        $(".functionBtn").animate({
            'right':'0px'
        },200).css({
                'content': 'url("img/icons/expand.png")'
            });
    } else {
        $(".functionDiv").animate({
            'right':'0px'
        },200);
        funcWrap = 0;
        $(".functionBtn").animate({
            'right':'400px'
        },200).css({
                'content': 'url("img/icons/collaps.png")'
            });
    }
});

$(".tableBtn").on('tap click',function(){
    if(tblWrap==1){
        $(".tableDiv").animate({
            'left':'-400px'
        },200);
        tblWrap = 0;
        $(".tableBtn").animate({
            'left':'0px'
        },200).css({
                'content': 'url("img/icons/collaps.png")'
            });
    } else {
        $(".tableDiv").animate({
            'left':'0px'
        },200);
        tblWrap = 1;
        $(".tableBtn").animate({
            'left':'400px'
        },200).css({
                'content': 'url("img/icons/expand.png")'
            });
    }
});

$(".inputPop").on('tap click', ".plot_line", function(){
    $(".inputPop").html(
        '<div class="input_back"></div>'+
        '<div class="equation">'+
            '<input id="input_line_A" class="input_plot" type="text" placeholder="A"/>x +'+
            '<input id="input_line_B" class="input_plot" type="text" placeholder="B"/>y +'+
            '<input id="input_line_C" class="input_plot" type="text" placeholder="C"/>= 0'+
        '</div>'+
        '<div id="plot_line_button" class="plot_button"><div/>'
    );
});

$(".inputPop").on('tap click', ".plot_circle", function(){
    $(".inputPop").html(
        '<div class="input_back"></div>' +
        '<div class="equation">'+
            '( x -<input id="input_circle_a" class="input_plot" type="text" placeholder="m"/>)&#178 +'+
            '( y -<input id="input_circle_b" class="input_plot" type="text" placeholder="n"/>)&#178 ='+
            '<input id="input_circle_r" class="input_plot" type="text" placeholder="r"/>&#178' +
        '</div>'+
        '<div id="plot_circle_button" class="plot_button"><div/>'
    );
});

$(".inputPop").on('tap click', ".plot_ellipse", function(){
    $(".inputPop").html(
        '<div class="input_back"></div>'+
        '<div class="equation">'+
            '( x -<input id="input_ellipse_m" class="input_plot" type="textsass" placeholder="m"/>)&#178 /'+
            '<input id="input_ellipse_a" class="input_plot" type="text" placeholder="a"/>&#178+'+
            '( y -<input id="input_ellipse_n" class="input_plot" type="text" placeholder="n"/>)&#178 /'+
            '<input id="input_ellipse_b" class="input_plot" type="text" placeholder="b"/>&#178 = 1'+
        '</div>'+
        '<div id="plot_ellipse_button" class="plot_button"><div/>'
    );
});

$(".inputPop").on('tap click', ".plot_text", function(){
    $(".inputPop").html(
        '<div class="input_back"></div>'+
        '<div class="equation">'+
            '<input id="input_text" class="input_plot" type="text" placeholder="Enter equation here..." style="width: 230px;"/>'+
        '</div>'+
        '<div id="plot_button" class="plot_button"><div/>'
    );
});

$(".inputPop").on('tap click', ".input_back", function(){
    $(".inputPop").html(
        '<div align="center">'+
            '<div class="plot_line"></div>'+
            '<div class="plot_circle"></div>'+
            '<div class="plot_ellipse"></div>'+
            '<div class="plot_text"></div>' +
        '</div>'
    );
});




$(".handtool_radiobutton").css({
    content:'url("img/icons/HandOn.png")'
});
currentAction = "handtool";