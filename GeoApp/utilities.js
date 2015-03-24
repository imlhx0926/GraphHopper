function loadXMLDoc(dname)
{
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
    }
    else
    {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",dname,false);
    xhttp.send();
    return xhttp.responseXML;
}

function loadConfig(filename){
    if (filename==undefined){
        filename="config.xml"
    }
    xmlDoc=loadXMLDoc(filename);
    console.log(xmlDoc);
    x=xmlDoc.documentElement.childNodes;
    for (var i=0;i<x.length;i++)
    {

        if (x[i].nodeType==1)
        {//Process only element nodes (type 1)
            console.log(x[i].nodeName);
            if (x[i].nodeName=="scale"){
                console.log(x[i].childNodes[1].nodeName+"="+x[i].childNodes[1].textContent);
                console.log(x[i].childNodes[3].nodeName+"="+x[i].childNodes[3].textContent);
            }
            if (x[i].nodeName=="origin"){
                console.log(x[i].childNodes[1].nodeName+"="+x[i].childNodes[1].textContent);
                console.log(x[i].childNodes[3].nodeName+"="+x[i].childNodes[3].textContent);
            }
            if (x[i].nodeName=="panning"){
                console.log(x[i].childNodes[1].nodeName+"="+x[i].childNodes[1].textContent);
                console.log(x[i].childNodes[3].nodeName+"="+x[i].childNodes[3].textContent);
            }
            if (x[i].nodeName=="background"){
                console.log(x[i].textContent);
            }
        }
    }
}

jQuery.download = function(url, data, method){
    //url and data options required
    if( url && data ){
        //data can be string of parameters or array/object
        data = typeof data == 'string' ? data : jQuery.param(data);
        //split params into form inputs
        var inputs = '';
        jQuery.each(data.split('&'), function(){
            var pair = this.split('=');
            inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
        });
        //send request
        jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
            .appendTo('body').submit().remove();
    }
}
var intervalId;
function playback(){
    refreshFinalCanvas();
    var finalCanvas = document.getElementById( "finalCanvas");
    var context = finalCanvas.getContext("2d");
    context.strokeStyle = Colors.obj;
    var index=0, selected=recording[index];
    intervalId = setInterval(function(){
        selected = recording[index];
        if (selected.type=="freehand"){
            context.beginPath();
            for (var i=0; i<selected.trail.length;i++){
                context.lineTo(W2S(selected.trail[i]).x, W2S(selected.trail[i]).y);
            }
            context.stroke();
        }
        if (selected.type == "line") {
            draw_line(W2S(selected.start), W2S(selected.end));
        }
        else if (selected.type == "ray") {
            draw_ray(W2S(selected.start), W2S(selected.end));
        }
        else if (selected.type == "circle") {
            draw_circle(W2S(selected.center),W2S(selected.point));
        }
        else if (selected.type == "ellipse"){
            draw_ellipse(W2S(selected.focal1),W2S(selected.focal2),W2S(selected.point));
        }
        else if(selected.type == "sin"){
            draw_sin(selected.dx, selected.dy, selected.kx, selected.ky);
        }
        if (snaptokeypoints) {
            drawKeyPoints();
        }
        index++;
        console.log(index);
        if (index==recording.length){
            clearInterval(intervalId);
            $(".playback").css({content:'url("img/recording.png")'});
            recording = new Array();
            isRecording = "idle";
        }
    },1000);
}