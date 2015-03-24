/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 9/13/13
 * Time: 12:17 PM
 * To change this template use File | Settings | File Templates.
 */
var tables = new Array();
$(".tableDiv").on("blur",".table_input",function(){
    var x = parseFloat($(this).parent().parent().find(".table_input_x").val()),
        y = parseFloat($(this).parent().parent().find(".table_input_y").val());
    var current = $("#ul1").attr("data-current");
    if(x==x&&y==y){
        $('<tr><td class="value_x_'+current+'">'+x+'</td><td class="value_y_'+current+'">'+y+'</td></tr>').insertBefore(
            $(this).parent().parent()
        );
        $(".table_input").val("");
    }
    tableplot();
});

$(".tableDiv").on("blur",".colorpicker",function(){
    var current = $("#ul1").attr("data-current");
    console.log(current);
    if(tables[current]!=undefined){
        tables[current].color = $(".colorpicker").val();
    }
    var color = $("#tabpage_"+current).find(".colorpicker").val();
    $("#tabpage_"+current).find(".colorpicker").css("background-color", color);
    tableplot();
});

$(".tableDiv").on("blur",".table_edit",function(){
    var x = parseFloat($(this).parent().parent().find(".table_edit_x").val()),
        y = parseFloat($(this).parent().parent().find(".table_edit_y").val());
    var current = $("#ul1").attr("data-current");
    if(x==x&&y==y){
        $('<tr><td class="value_x_'+current+'">'+x+'</td><td class="value_y_'+current+'">'+y+'</td></tr>').insertBefore(
            $(this).parent().parent()
        );
        $(".table_edit").parent().remove();
    }
    tableplot();
});

$(".tableDiv").on("tap click","td",function(){
    var index=-1;
    var current = $("#ul1").attr("data-current");
    if ($(this).hasClass("value_x_"+current)){
        index = $(".value_x_"+current).index($(this));
        $(this).removeClass("value_x_"+current);
        $(this).html('<textarea class="table_edit table_edit_x" placeholder="X">'+$(this).html()+'</textarea>');
        $(".value_y_"+current+":nth("+index+")").html('<textarea class="table_edit table_edit_y" placeholder="Y">'+$(".value_y_"+current+":nth("+index+")").html()+'</textarea>');
        $(".value_y_"+current+":nth("+index+")").removeClass("value_y_"+current);
        $(this).parent().find("textarea:nth(0)").focus();
    }
    else if ($(this).hasClass("value_y_"+current)){
        index = $(".value_y_"+current).index($(this));
        $(this).removeClass("value_y_"+current);
        $(this).html('<textarea class="table_edit table_edit_y" placeholder="Y">'+$(this).html()+'</textarea>');
        $(".value_x_"+current+":nth("+index+")").html('<textarea class="table_edit table_edit_x" placeholder="X">'+$(".value_x_"+current+":nth("+index+")").html()+'</textarea>');
        $(".value_x_"+current+":nth("+index+")").removeClass("value_x_"+current);
        $(this).parent().find("textarea:nth(1)").focus();
    }
});

function tableplot(){
    var values = new Array();
    var current = $("#ul1").attr("data-current");
    var table_id = $("#tabpage_"+current).find("table").attr("table_id");
    for (var i=0; i<$(".value_x_"+current).length; i++){
        var x = parseFloat($(".value_x_"+current)[i].innerHTML);
        var y = parseFloat($(".value_y_"+current)[i].innerHTML);
        values.push({x:x, y:y});
    }
    if (tables[table_id]==undefined){
        var tableplot = {
            type: $("#tabpage_"+current).find(".tableplot_radiobutton").html(),
            table_id: table_id,
            values: values,
            color:  $("#tabpage_"+current).find(".colorpicker").val()
        }
        tables[table_id] = tableplot;
    }
    else {
        tables[table_id].values = values;
    }

    refreshFinalCanvas();
}


$(".appWrap").on("tap click",".tableplot_radiobutton", function(){
//    var values = new Array();
    var current = $("#ul1").attr("data-current");
//    var table_id = $(this).parent().find("table").attr("table_id");
//    for (var i=0; i<$(".value_x_"+current).length; i++){
//        var x = parseFloat($(".value_x_"+current)[i].innerHTML);
//        var y = parseFloat($(".value_y_"+current)[i].innerHTML);
//        values.push({x:x, y:y});
//    }
    if ($(this).html()=="chart"){
        $(this).html("graph");
    } else {$(this).html("chart");}
//    var tableplot = {
//        type: $(this).html(),
//        table_id: table_id,
//        values: values,
//        color: "#"+((1<<24)*Math.random()|0).toString(16)
//    }
    if(tables[current]!=undefined){
        tables[current].type = $(this).html();
    }

    refreshFinalCanvas();
});




$(function(){
    var tableDiv =
        '<div class="tablePlot"><table table_id="0">'+
            '<tr><td>X</td><td>Y</td></tr>'+
            '<tr>'+
            '<td><textarea class="table_input table_input_x" placeholder="X"></textarea></td>'+
            '<td><textarea class="table_input table_input_y" placeholder="Y"></textarea></td>'+
            '</tr>'+
        '</table></div>'+
        '<textarea class="colorpicker" placeholder="#000000">' +
            "#"+((1<<24)*Math.random()|0).toString(16)+'</textarea>'+
        '<div class="tableplot_radiobutton drawingTool">chart</div>';
    var tabContainer =
        '<div id="tabContainer">'+
            '<div class="tabs">'+
                '<ul id="ul1">'+
                   '<li id="tabHeader_0">Table 0</li>'+
                '</ul>'+
                '<button id="addTab">Add</button>'+
            '</div>'+
            '<div id = "mainDiv" class="tabscontent">'+
            '<div class="tabpage" id="tabpage_0">'+
            tableDiv+
            '</div></div>'+
        '</div>'
    $(".tableDiv").append(tabContainer);
    $("#tabpage_0").find(".colorpicker").css("background-color", $("#tabpage_0").find(".colorpicker").val());

    $(".appWrap").on("tap click", "#addTab",function(){

        $("#ul1").append('<li id="tabHeader_'+j+'">Table '+j+'</li>');
        $("#mainDiv").append('<div class="tabpage" id="tabpage_'+j+'" style="display: none;">'+tableDiv+'</div>');
        $("#tabpage_"+j).find("table").attr("table_id",j);
        $(".tabs").css("height", (parseInt(j/5)+1)*25+"px");
        var random = "#"+((1<<24)*Math.random()|0).toString(16);
        $("#tabpage_"+j).find(".colorpicker").val(random);
        $("#tabpage_"+j).find(".colorpicker").css("background-color", random);
//    j=j+1;
        initiate();
    });
});

var j=1;

$(function(){
    // get tab container
    var container = document.getElementById("tabContainer");
    // set current tab
    var navitem = container.querySelector(".tabs ul li");
    //store which tab we are on
    var ident = navitem.id.split("_")[1];
    navitem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
    navitem.setAttribute("class","tabActiveHeader");

    //hide two tab contents we don't need
    var pages = container.querySelectorAll(".tabpage");
    for (var i = 1; i < pages.length; i++) {
        pages[i].style.display="none";
    }

    //this adds click event to tabs
    var tabs = container.querySelectorAll(".tabs ul li");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].onclick=displayPage;
    }
});

function initiate()
{

    // get tab container
    var container = document.getElementById("tabContainer");
    // set current tab
    var navitem = container.querySelector(".tabs ul li");
    //store which tab we are on
    var ident = navitem.id.split("_")[1];

//    navitem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
//    navitem.setAttribute("class","tabActiveHeader");

    //hide two tab contents we don't need
    var pages = container.querySelectorAll(".tabpage");
//    for (var i = 2; i < pages.length; i++) {
//        pages[i].style.display="none";
//    }


    pages[j].style.display="none";
    j++;

    //this adds click event to tabs

    var tabs = container.querySelectorAll(".tabs ul li");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].onclick=displayPage;
    }
}

// on click of one of tabs
function displayPage() {
    var current = this.parentNode.getAttribute("data-current");
    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display="none";

    var ident = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    this.setAttribute("class","tabActiveHeader");
    document.getElementById("tabpage_" + ident).style.display="block";
    this.parentNode.setAttribute("data-current",ident);
}






