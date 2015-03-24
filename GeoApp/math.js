var scaleWorld = 20;
function intersect(obj1, obj2){
    if (obj1.type=="circle"&&obj2.type=="circle"){
        intersectCircleCircle(obj1, obj2);
    }
    else if ((obj1.type=="line"||obj1.type=="ray")&&(obj2.type=="line"||obj2.type=="ray")){
        intersectLineLine(obj1, obj2);
    }
    else if (obj1.type=="circle"&&(obj2.type=="line"||obj2.type=="ray")){
        intersectCircleLine(obj1, obj2);
    }
    else if ((obj1.type=="line"||obj1.type=="ray")&&obj2.type=="circle"){
        intersectCircleLine(obj2, obj1);
    }
    else if (obj1.type=="ellipse"&&obj2.type=="ellipse"){
        intersectEllipseEllipse(obj1, obj2);
    }
    else if (obj1.type=="ellipse"&&obj2.type=="circle"){
        intersectCircleEllipse(obj2, obj1);
    }
    else if (obj1.type=="circle"&&obj2.type=="ellipse"){
        intersectCircleEllipse(obj1, obj2);
    }
    else if ((obj1.type=="line"||"ray")&&obj2.type=="ellipse"){
        intersectEllipseLine(obj2, obj1);
    }
    else if (obj1.type=="ellipse"&&(obj2.type=="line"||obj2.type=="ray")){
        intersectEllipseLine(obj1, obj2);
    }
}

function intersectLineLine(obj1, obj2){
    var a1=obj1.start, a2=obj1.end;
    var b1=obj2.start, b2=obj2.end;
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b != 0) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;
        if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            addIntersectPoint({
                x:a1.x + ua * (a2.x - a1.x),
                y:a1.y + ua * (a2.y - a1.y)
            }, obj1.id, obj2.id);
        } else {
            console.log("No Intersection");
        }
    } else {
        if (ua_t == 0 || ub_t == 0) {
            console.log("Coincident");
        } else {
            console.log("Parallel");
        }
    }
}

function intersectCircleCircle(obj1, obj2){
    var x1,x2,y1,y2;//此為兩圓相交的坐標
    if(obj1.center.y!=obj2.center.y)//兩圓圓心Y值不同時
    {//m= y=mx+k的x項系數、k= y=mx+k的k項常數、 a、b、c= x=(-b±√(b^2-4ac))/2a的係數
        var m=(obj1.center.x-obj2.center.x)/(obj2.center.y-obj1.center.y),
            k=(Math.pow(obj1.radius,2)-Math.pow(obj2.radius,2)+Math.pow(obj2.center.x,2)-Math.pow(obj1.center.x,2)+Math.pow(obj2.center.y,2)-Math.pow(obj1.center.y,2))/(2*(obj2.center.y-obj1.center.y));
        var a=1+Math.pow(m,2),
            b=2*(k*m-obj2.center.x-m*obj2.center.y),
            c=Math.pow(obj2.center.x,2)+Math.pow(obj2.center.y,2)+Math.pow(k,2)-2*k*obj2.center.y-Math.pow(obj2.radius,2);

        if(b*b-4*a*c>=0)//有交點時
        {
            x1=((-b)+Math.sqrt(b*b-4*a*c))/(2*a);//x=(-b+√(b^2-4ac))/2a
            y1=m*x1+k;//y=mx+k
            x2=((-b)-Math.sqrt(b*b-4*a*c))/(2*a);//x=(-b-√(b^2-4ac))/2a
            y2=m*x2+k;//y=mx+k
            if(b*b-4*a*c>0){
                console.log("The cross points are ("+x1+","+y1+")("+x2+","+y2+")");
                addIntersectPoint({x:x1,y:y1}, obj1.id, obj2.id);
                addIntersectPoint({x:x2,y:y2}, obj1.id, obj2.id);
            }//兩交點
            else{
                console.log("The cross points are ("+x1+","+y1+")");
                addIntersectPoint({x:x1,y:y1}, obj1.id, obj2.id);
            }//一交點
        }
        else//沒有交點時
            console.log("No cross points.");
    }
    else if((obj1.center.y==obj2.center.y))//兩圓圓心Y值相同時
    {//x1= 兩交點的x值、 a、b、c= x=(-b±√(b^2-4ac))/2a的係數
        x1=-(Math.pow(obj1.center.x,2)-Math.pow(obj2.center.x,2)-Math.pow(obj1.radius,2)+Math.pow(obj2.radius,2))/(2*obj2.center.x-2*obj1.center.x);
        var a=1,
            b=-2*obj1.center.y,
            c=Math.pow(x1,2)+Math.pow(obj1.center.x,2)-2*obj1.center.x*x1+Math.pow(obj1.center.y,2)-Math.pow(obj1.radius,2);
        if(b*b-4*a*c>=0)
        {
            y1=((-b)+Math.sqrt(b*b-4*a*c))/(2*a);//y=(-b+√(b^2-4ac))/2a
            y2=((-b)-Math.sqrt(b*b-4*a*c))/(2*a);//y=(-b-√(b^2-4ac))/2a
            if(b*b-4*a*c>0){
                console.log("The cross points are ("+x1+","+y1+")("+x1+","+y2+")");
                addIntersectPoint({x:x1,y:y1},obj1.id, obj2.id);
                addIntersectPoint({x:x1,y:y2},obj1.id, obj2.id);
            }//兩交點
            else{
                console.log("The cross points are ("+x1+","+y1+")");
                addIntersectPoint({x:x1,y:y1},obj1.id, obj2.id);
            }//一交點
        }
        else//沒有交點時
            console.log("No cross points.");
    }
}

function intersectCircleLine(obj1, obj2) {
    var c=obj1.center, r=obj1.radius;
    var a1=obj2.start, a2=obj2.end;
    var a = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
    var b = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));
    var cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y - 2 * (c.x * a1.x + c.y * a1.y) - r * r;
    var deter = b * b - 4 * a * cc;
    if (deter < 0) {
        console.log("Outside");
    } else if (deter == 0) {
        console.log("Tangent");
    } else {
        var e = Math.sqrt(deter);
        var u1 = (-b + e) / (2 * a);
        var u2 = (-b - e) / (2 * a);
        if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
            if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
                console.log("Outside");
            } else {
                console.log("Inside");
            }
        } else {
            console.log("Intersection");
            if (0 <= u1 && u1 <= 1)
                addIntersectPoint(lerp(a1, a2, u1),obj1.id, obj2.id);
            if (0 <= u2 && u2 <= 1)
                addIntersectPoint(lerp(a1, a2, u2),obj1.id, obj2.id);
        }
    }
}

function intersectCircleEllipse(obj1, obj2) {
    var circle = {
        a: obj1.radius,
        b: obj1.radius,
        focal1: {x: obj1.center.x, y:obj1.center.y},
        focal2: {x: obj1.center.x, y:obj1.center.y},
        alpha: 0
    }
    return intersectEllipseEllipse(circle, obj2);
}

function intersectEllipseLine(obj1, obj2){
    var c1={x:(obj1.focal1.x+obj1.focal2.x)/2,y:(obj1.focal1.y+obj1.focal2.y)/2},
        rx1=obj1.a, ry1=obj1.b, alpha1 = obj1.alpha;

    var A1=Math.pow((Math.cos(alpha1)*ry1),2)+Math.pow((Math.sin(alpha1)*rx1),2),
        B1=2*Math.cos(alpha1)*Math.sin(alpha1)*(ry1*ry1-rx1*rx1),
        C1=Math.pow((Math.sin(alpha1)*ry1),2)+Math.pow((Math.cos(alpha1)*rx1),2);

    var a = [
        A1, B1, C1, -(2*A1*c1.x+B1*c1.y), -(2*C1*c1.y+B1*c1.x),
        A1*c1.x*c1.x + B1*c1.x*c1.y + C1*c1.y*c1.y - rx1*rx1*ry1*ry1
    ];
    var b = [
        0, 0, 0, obj2.A, obj2.B, obj2.C
    ];
    var roots = solveLinear(a, b);
    roots.forEach(function(root){
        console.log(obj2.A*root.x+obj2.B*root.y+obj2.C);
        if (Math.abs(obj2.A*root.x+obj2.B*root.y+obj2.C) < 1e-10)
            if ((obj2.start.x-root.x)*(obj2.end.x-root.x)<0&&(obj2.start.y-root.y)*(obj2.end.y-root.y))
                addIntersectPoint(root,obj1.id, obj2.id);
    });
}

function intersectEllipseEllipse (obj1, obj2) {

    var c1={x:(obj1.focal1.x+obj1.focal2.x)/2,y:(obj1.focal1.y+obj1.focal2.y)/2},
        rx1=obj1.a, ry1=obj1.b, alpha1 = obj1.alpha,
        c2={x:(obj2.focal1.x+obj2.focal2.x)/2,y:(obj2.focal1.y+obj2.focal2.y)/2},
        rx2=obj2.a, ry2=obj2.b, alpha2 = obj2.alpha;

    var A1=Math.pow((Math.cos(alpha1)*ry1),2)+Math.pow((Math.sin(alpha1)*rx1),2),
        B1=2*Math.cos(alpha1)*Math.sin(alpha1)*(ry1*ry1-rx1*rx1),
        C1=Math.pow((Math.sin(alpha1)*ry1),2)+Math.pow((Math.cos(alpha1)*rx1),2);

    var A2=Math.pow((Math.cos(alpha2)*ry2),2)+Math.pow((Math.sin(alpha2)*rx2),2),
        B2=2*Math.cos(alpha2)*Math.sin(alpha2)*(ry2*ry2-rx2*rx2),
        C2=Math.pow((Math.sin(alpha2)*ry2),2)+Math.pow((Math.cos(alpha2)*rx2),2);
    var a = [
        A1, B1, C1, -(2*A1*c1.x+B1*c1.y), -(2*C1*c1.y+B1*c1.x),
        A1*c1.x*c1.x + B1*c1.x*c1.y + C1*c1.y*c1.y - rx1*rx1*ry1*ry1
    ];
    var b = [
        A2, B2, C2, -(2*A2*c2.x+B2*c2.y), -(2*C2*c2.y+B2*c2.x),
        A2*c2.x*c2.x + B2*c2.x*c2.y + C2*c2.y*c2.y - rx2*rx2*ry2*ry2
    ];
    var roots = solvePoly(a, b);
    roots.forEach(function(root){
        addIntersectPoint(root,obj1.id, obj2.id);
    });

//    if ( result.points.length > 0 ) result.status = "Intersection";
//
//    return result;
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

function getTangentPoint(point, object){
    if (object.type=="ellipse"){
        var focal1 = (calDistance(point, object.focal1)>calDistance(point, object.focal2))? object.focal1 : object.focal2;
        var focal2 = (calDistance(point, object.focal1)<=calDistance(point, object.focal2))? object.focal1 : object.focal2;
        if (calDistance(point, focal1)+calDistance(point, focal2)<2*object.a) return [];
        console.log(focal1+" ? "+object.focal1);
        var circle1 = {
            center: focal1,
            radius: object.a*2
        };
        var circle2 = {
            center: point,
            radius: calDistance(point, focal2)
        };
        var intersize = intersectPoints.length;
        intersectCircleCircle(circle1, circle2);
        var startWorld = intersectPoints[intersectPoints.length-2], endWorld = focal1
        var A = endWorld.y - startWorld.y, B = startWorld.x - endWorld.x, C = startWorld.y * endWorld.x - startWorld.x * endWorld.y;
        var P1F1 = {
            start: startWorld,
            end: endWorld,
            A: A,
            B: B,
            C: C
        }
        startWorld = intersectPoints[intersectPoints.length-1], endWorld = focal1
        A = endWorld.y - startWorld.y, B = startWorld.x - endWorld.x, C = startWorld.y * endWorld.x - startWorld.x * endWorld.y;
        var P2F1 = {
            start: startWorld,
            end: endWorld,
            A: A,
            B: B,
            C: C
        }
        intersectEllipseLine(object, P1F1);
        var tp0 = intersectPoints[intersectPoints.length-1];
        intersectEllipseLine(object, P2F1);
        var tp1 = intersectPoints[intersectPoints.length-1];
        intersectPoints.splice(intersectPoints.length-4,4);
        return [tp0, tp1];
    }


}


function bezout(e1, e2) {
    var AB    = e1[0]*e2[1] - e2[0]*e1[1];
    var AC    = e1[0]*e2[2] - e2[0]*e1[2];
    var AD    = e1[0]*e2[3] - e2[0]*e1[3];
    var AE    = e1[0]*e2[4] - e2[0]*e1[4];
    var AF    = e1[0]*e2[5] - e2[0]*e1[5];
    var BC    = e1[1]*e2[2] - e2[1]*e1[2];
    var BE    = e1[1]*e2[4] - e2[1]*e1[4];
    var BF    = e1[1]*e2[5] - e2[1]*e1[5];
    var CD    = e1[2]*e2[3] - e2[2]*e1[3];
    var DE    = e1[3]*e2[4] - e2[3]*e1[4];
    var DF    = e1[3]*e2[5] - e2[3]*e1[5];
    var BFpDE = BF + DE;
    var BEmCD = BE - CD;

    return new Polynomial(
        AB*BC - AC*AC,
        AB*BEmCD + AD*BC - 2*AC*AE,
        AB*BFpDE + AD*BEmCD - AE*AE - 2*AC*AF,
        AB*DF + AD*BFpDE - 2*AE*AF,
        AD*DF - AF*AF
    );
}

function solvePoly(a, b){
    var yPoly   = bezout(a, b);
    var yRoots  = yPoly.getRoots();
    var epsilon = 1e-3;
    var norm0   = ( a[0]*a[0] + 2*a[1]*a[1] + a[2]*a[2] ) * epsilon;
    var norm1   = ( b[0]*b[0] + 2*b[1]*b[1] + b[2]*b[2] ) * epsilon;
    var roots = new Array();
//    console.log("No Intersection");

    for ( var y = 0; y < yRoots.length; y++ ) {
        var xPoly = new Polynomial(
            a[0],
            a[3] + yRoots[y] * a[1],
            a[5] + yRoots[y] * (a[4] + yRoots[y]*a[2])
        );
        var xRoots = xPoly.getRoots();
        for ( var x = 0; x < xRoots.length; x++ ) {
            var test =
                ( a[0]*xRoots[x] + a[1]*yRoots[y] + a[3] ) * xRoots[x] +
                    ( a[2]*yRoots[y] + a[4] ) * yRoots[y] + a[5];
            if ( Math.abs(test) < norm0 ) {
                test =
                    ( b[0]*xRoots[x] + b[1]*yRoots[y] + b[3] ) * xRoots[x] +
                        ( b[2]*yRoots[y] + b[4] ) * yRoots[y] + b[5];
                if ( Math.abs(test) < norm1 ) {
                    roots.push({
                        x:xRoots[x], y:yRoots[y]
                    });
                }
            }
        }
    }
    return roots;
}

function solveLinear(a, b){
    var yPoly   = bezout(a, b);
    var yRoots  = yPoly.getRoots();
    var roots = new Array();

    for ( var y = 0; y < yRoots.length; y++ ) {
        var xPoly = new Polynomial(
            a[0],
            a[3] + yRoots[y] * a[1],
            a[5] + yRoots[y] * (a[4] + yRoots[y]*a[2])
        );
        var xRoots = xPoly.getRoots();
        for ( var x = 0; x < xRoots.length; x++ ) {
            roots.push({
                x:xRoots[x], y:yRoots[y]
            });
        }
    }
    return roots;
}

function parseFormula(formula){
    var result = new Array();
    var left = formula.split("=")[0];
    var right = formula.split("=")[1];
    var coeff_xsq= 0, coeff_ysq= 0, coeff_xy= 0, coeff_x = 0, coeff_y = 0, constant = 0;

// parse left side
    left = replaceAll("x^2","XSQ",left);
    left = replaceAll("y^2","YSQ",left);
    left = replaceAll("xy","X*Y",left);
    left = replaceAll("+","%%plus", left);
    left = replaceAll("-","%%minus", left);
    left = replaceAll("plus","+", left);
    left = replaceAll("minus","-", left);
    var terms = left.split("%%");
    terms.forEach(function(term){
        console.log(term);
        if (term.indexOf("XSQ")!=-1){
            var current = term.split("XSQ");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_xsq += parseFloat(current[0]);
        }
        else if (term.indexOf("X*Y")!=-1){
            var current = term.split("X*Y");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_xy += parseFloat(current[0]);
        }
        else if (term.indexOf("YSQ")!=-1){
            var current = term.split("YSQ");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_ysq += parseFloat(current[0]);
        }
        else if (term.indexOf("x")!=-1){
            var current = term.split("x");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_x += parseFloat(current[0]);
        }
        else if (term.indexOf("y")!=-1){
            var current = term.split("y");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            if (current[0]==""||current[0]=="+") current[0]=1;

            coeff_y += parseFloat(current[0]);
        }
        else {
            if (term!="") constant += parseFloat(term);
        }
    });

// parse right side
    right = replaceAll("x^2","XSQ",right);
    right = replaceAll("y^2","YSQ",right);
    right = replaceAll("xy","X*Y",right);
    right = replaceAll("+","%%plus", right);
    right = replaceAll("-","%%minus", right);
    right = replaceAll("plus","+", right);
    right = replaceAll("minus","-", right);
    terms = right.split("%%");
    terms.forEach(function(term){
        console.log(term);
        if (term.indexOf("XSQ")!=-1){
            var current = term.split("XSQ");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_xsq -= parseFloat(current[0]);
        }
        else if (term.indexOf("X*Y")!=-1){
            var current = term.split("X*Y");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_xy -= parseFloat(current[0]);
        }
        else if (term.indexOf("YSQ")!=-1){
            var current = term.split("YSQ");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_ysq -= parseFloat(current[0]);
        }
        else if (term.indexOf("x")!=-1){
            var current = term.split("x");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_x -= parseFloat(current[0]);
        }
        else if (term.indexOf("y")!=-1){
            var current = term.split("y");
            if (current[0]==""||current[0]=="+") current[0]=1;
            else if (current[0]=="-") current[0]=-1;
            coeff_y -= parseFloat(current[0]);
        }
        else {
            if (term!="") constant -= parseFloat(term);
        }
    });
    result.push({coeff:coeff_xsq,var:"x^2"});
    result.push({coeff:coeff_xy,var:"xy"});
    result.push({coeff:coeff_ysq,var:"y^2"});
    result.push({coeff:coeff_x,var:"x"});
    result.push({coeff:coeff_y,var:"y"});
    result.push({coeff:constant,var:"const"});
    return result;
}



