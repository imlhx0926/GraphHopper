/**
 * Created with JetBrains WebStorm.
 * User: tongjiang
 * Date: 9/13/13
 * Time: 1:04 PM
 * To change this template use File | Settings | File Templates.
 */
var j=3;

window.onload=function() {

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
}

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

function addTab()
{
    var j2=j+1;

    $("#ul1").append('<li id="tabHeader_'+j2+'">new tab</li>');

    $("#mainDiv").append('<div class="tabpage" id="tabpage_'+j2+'">' +
        '<h2>4444如何正確使用筆刀以免手指當祭品</h2>' +
        '<p>4444通常使用筆刀切削湯口時，很多人會把刀刃朝內，並且用大拇指當後盾，所以只要等您的大拇指長繭之後，就比較不容易見血了，不然就是把刀刃朝外小心的使用即可，還有就是如果筆刀從桌上滾下來時，大腿不要夾．．．</p>' +
        '</div>');

//    j=j+1;
    console.log(j2);

    initiate();
}


function deleteTab(a)
{

};
