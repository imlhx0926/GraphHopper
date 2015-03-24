/**
 * Created with JetBrains WebStorm.
 * User: haoxinliu
 * Date: 10/9/13
 * Time: 4:22 PM
 * To change this template use File | Settings | File Templates.
 */

Gh.define("Utility", ["Observer","ShapeType","Point"], function (Observer,ShapeType,Point) {
    var Utility = function () {
        this.names = [];
    };
    Utility.prototype = {
        intersect: function (obj1, obj2) {
            if (obj1.type == ShapeType.CIRCLE && obj2.type == ShapeType.CIRCLE) {
                this.intersectCircleCircle(obj1, obj2);
            }
            else if ((obj1.type == ShapeType.LINE || obj1.type == "ray") && (obj2.type == ShapeType.LINE || obj2.type == "ray")) {
                this.intersectLineLine(obj1, obj2);
            }
            else if (obj1.type == ShapeType.CIRCLE && (obj2.type == ShapeType.LINE || obj2.type == "ray")) {
                this.intersectCircleLine(obj1, obj2);
            }
            else if ((obj1.type == ShapeType.LINE || obj1.type == "ray") && obj2.type == ShapeType.CIRCLE) {
                this.intersectCircleLine(obj2, obj1);
            }
            else if (obj1.type == "ellipse" && obj2.type == "ellipse") {
                this.intersectEllipseEllipse(obj1, obj2);
            }
            else if (obj1.type == "ellipse" && obj2.type == "circle") {
                this.intersectCircleEllipse(obj2, obj1);
            }
            else if (obj1.type == "circle" && obj2.type == "ellipse") {
                this.intersectCircleEllipse(obj1, obj2);
            }
            else if ((obj1.type == "line" || "ray") && obj2.type == "ellipse") {
                this.intersectEllipseLine(obj2, obj1);
            }
            else if (obj1.type == "ellipse" && (obj2.type == "line" || obj2.type == "ray")) {
                this.intersectEllipseLine(obj1, obj2);
            }
        },

        intersectLineLine: function (obj1, obj2) {
            var a1 = obj1.vertices[0], a2 = obj1.vertices[1];
            var b1 = obj2.vertices[0], b2 = obj2.vertices[1];
            var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
            var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
            var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
            if (u_b != 0) {
                var ua = ua_t / u_b;
                var ub = ub_t / u_b;
                if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                    this.addIntersectPoint({
                        type: ShapeType.POINT,
                        obj1: obj1,
                        obj2: obj2,
                        x: a1.x + ua * (a2.x - a1.x),
                        y: a1.y + ua * (a2.y - a1.y)
                    });
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
        },

        intersectCircleCircle: function (obj1, obj2) {
            var x1, x2, y1, y2;//此為兩圓相交的坐標
            if (obj1.center.y != obj2.center.y)//兩圓圓心Y值不同時
            {//m= y=mx+k的x項系數、k= y=mx+k的k項常數、 a、b、c= x=(-b±√(b^2-4ac))/2a的係數
                var m = (obj1.center.x - obj2.center.x) / (obj2.center.y - obj1.center.y),
                    k = (Math.pow(obj1.radius, 2) - Math.pow(obj2.radius, 2) + Math.pow(obj2.center.x, 2) - Math.pow(obj1.center.x, 2) + Math.pow(obj2.center.y, 2) - Math.pow(obj1.center.y, 2)) / (2 * (obj2.center.y - obj1.center.y));
                var a = 1 + Math.pow(m, 2),
                    b = 2 * (k * m - obj2.center.x - m * obj2.center.y),
                    c = Math.pow(obj2.center.x, 2) + Math.pow(obj2.center.y, 2) + Math.pow(k, 2) - 2 * k * obj2.center.y - Math.pow(obj2.radius, 2);

                if (b * b - 4 * a * c >= 0)//有交點時
                {
                    x1 = ((-b) + Math.sqrt(b * b - 4 * a * c)) / (2 * a);//x=(-b+√(b^2-4ac))/2a
                    y1 = m * x1 + k;//y=mx+k
                    x2 = ((-b) - Math.sqrt(b * b - 4 * a * c)) / (2 * a);//x=(-b-√(b^2-4ac))/2a
                    y2 = m * x2 + k;//y=mx+k
                    if (b * b - 4 * a * c > 0) {
                        console.log("The cross points are (" + x1 + "," + y1 + ")(" + x2 + "," + y2 + ")");
                        this.addIntersectPoint({
                            type: ShapeType.POINT,
                            obj1: obj1,
                            obj2: obj2,
                            x: x1,
                            y: y1
                        });
                        this.addIntersectPoint({
                            type: ShapeType.POINT,
                            obj1: obj1,
                            obj2: obj2,
                            x: x2,
                            y: y2
                        });
                    }//兩交點
                    else {
                        console.log("The cross points are (" + x1 + "," + y1 + ")");
                        this.addIntersectPoint({
                            type: ShapeType.POINT,
                            obj1: obj1,
                            obj2: obj2,
                            x: x1,
                            y: y1
                        });
                    }//一交點
                }
                else//沒有交點時
                    console.log("No cross points.");
            }
            else if ((obj1.center.y == obj2.center.y))//兩圓圓心Y值相同時
            {//x1= 兩交點的x值、 a、b、c= x=(-b±√(b^2-4ac))/2a的係數
                x1 = -(Math.pow(obj1.center.x, 2) - Math.pow(obj2.center.x, 2) - Math.pow(obj1.radius, 2) + Math.pow(obj2.radius, 2)) / (2 * obj2.center.x - 2 * obj1.center.x);
                var a = 1,
                    b = -2 * obj1.center.y,
                    c = Math.pow(x1, 2) + Math.pow(obj1.center.x, 2) - 2 * obj1.center.x * x1 + Math.pow(obj1.center.y, 2) - Math.pow(obj1.radius, 2);
                if (b * b - 4 * a * c >= 0) {
                    y1 = ((-b) + Math.sqrt(b * b - 4 * a * c)) / (2 * a);//y=(-b+√(b^2-4ac))/2a
                    y2 = ((-b) - Math.sqrt(b * b - 4 * a * c)) / (2 * a);//y=(-b-√(b^2-4ac))/2a
                    if (b * b - 4 * a * c > 0) {
                        console.log("The cross points are (" + x1 + "," + y1 + ")(" + x1 + "," + y2 + ")");
                        addIntersectPoint({x: x1, y: y1}, obj1.id, obj2.id);
                        addIntersectPoint({x: x1, y: y2}, obj1.id, obj2.id);
                    }//兩交點
                    else {
                        console.log("The cross points are (" + x1 + "," + y1 + ")");
                        addIntersectPoint({x: x1, y: y1}, obj1.id, obj2.id);
                    }//一交點
                }
                else//沒有交點時
                    console.log("No cross points.");
            }
        },

        intersectCircleLine: function (obj1, obj2) {
            var c = obj1.center, r = obj1.radius;
            var a1 = obj2.vertices[0], a2 = obj2.vertices[1];
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
                        this.addIntersectPoint({
                            type: ShapeType.POINT,
                            obj1: obj1,
                            obj2: obj2,
                            x: this.lerp(a1, a2, u1).x,
                            y: this.lerp(a1, a2, u1).y
                        });
                    if (0 <= u2 && u2 <= 1)
                        this.addIntersectPoint({
                            type: ShapeType.POINT,
                            obj1: obj1,
                            obj2: obj2,
                            x: this.lerp(a1, a2, u2).x,
                            y: this.lerp(a1, a2, u2).y
                        });
                }
            }
        },

        intersectCircleEllipse: function (obj1, obj2) {
            var circle = {
                a: obj1.radius,
                b: obj1.radius,
                focal1: {x: obj1.center.x, y: obj1.center.y},
                focal2: {x: obj1.center.x, y: obj1.center.y},
                alpha: 0
            }
            return intersectEllipseEllipse(circle, obj2);
        },

        intersectEllipseLine: function (obj1, obj2) {
            var c1 = {x: (obj1.focal1.x + obj1.focal2.x) / 2, y: (obj1.focal1.y + obj1.focal2.y) / 2},
                rx1 = obj1.a, ry1 = obj1.b, alpha1 = obj1.alpha;

            var A1 = Math.pow((Math.cos(alpha1) * ry1), 2) + Math.pow((Math.sin(alpha1) * rx1), 2),
                B1 = 2 * Math.cos(alpha1) * Math.sin(alpha1) * (ry1 * ry1 - rx1 * rx1),
                C1 = Math.pow((Math.sin(alpha1) * ry1), 2) + Math.pow((Math.cos(alpha1) * rx1), 2);

            var a = [
                A1, B1, C1, -(2 * A1 * c1.x + B1 * c1.y), -(2 * C1 * c1.y + B1 * c1.x),
                A1 * c1.x * c1.x + B1 * c1.x * c1.y + C1 * c1.y * c1.y - rx1 * rx1 * ry1 * ry1
            ];
            var b = [
                0, 0, 0, obj2.A, obj2.B, obj2.C
            ];
            var roots = solveLinear(a, b);
            roots.forEach(function (root) {
                console.log(obj2.A * root.x + obj2.B * root.y + obj2.C);
                if (Math.abs(obj2.A * root.x + obj2.B * root.y + obj2.C) < 1e-10)
                    if ((obj2.start.x - root.x) * (obj2.end.x - root.x) < 0 && (obj2.start.y - root.y) * (obj2.end.y - root.y))
                        addIntersectPoint(root, obj1.id, obj2.id);
            });
        },

        intersectEllipseEllipse: function (obj1, obj2) {

            var c1 = {x: (obj1.focal1.x + obj1.focal2.x) / 2, y: (obj1.focal1.y + obj1.focal2.y) / 2},
                rx1 = obj1.a, ry1 = obj1.b, alpha1 = obj1.alpha,
                c2 = {x: (obj2.focal1.x + obj2.focal2.x) / 2, y: (obj2.focal1.y + obj2.focal2.y) / 2},
                rx2 = obj2.a, ry2 = obj2.b, alpha2 = obj2.alpha;

            var A1 = Math.pow((Math.cos(alpha1) * ry1), 2) + Math.pow((Math.sin(alpha1) * rx1), 2),
                B1 = 2 * Math.cos(alpha1) * Math.sin(alpha1) * (ry1 * ry1 - rx1 * rx1),
                C1 = Math.pow((Math.sin(alpha1) * ry1), 2) + Math.pow((Math.cos(alpha1) * rx1), 2);

            var A2 = Math.pow((Math.cos(alpha2) * ry2), 2) + Math.pow((Math.sin(alpha2) * rx2), 2),
                B2 = 2 * Math.cos(alpha2) * Math.sin(alpha2) * (ry2 * ry2 - rx2 * rx2),
                C2 = Math.pow((Math.sin(alpha2) * ry2), 2) + Math.pow((Math.cos(alpha2) * rx2), 2);
            var a = [
                A1, B1, C1, -(2 * A1 * c1.x + B1 * c1.y), -(2 * C1 * c1.y + B1 * c1.x),
                A1 * c1.x * c1.x + B1 * c1.x * c1.y + C1 * c1.y * c1.y - rx1 * rx1 * ry1 * ry1
            ];
            var b = [
                A2, B2, C2, -(2 * A2 * c2.x + B2 * c2.y), -(2 * C2 * c2.y + B2 * c2.x),
                A2 * c2.x * c2.x + B2 * c2.x * c2.y + C2 * c2.y * c2.y - rx2 * rx2 * ry2 * ry2
            ];
            var roots = solvePoly(a, b);
            roots.forEach(function (root) {
                addIntersectPoint(root, obj1.id, obj2.id);
            });

//    if ( result.points.length > 0 ) result.status = "Intersection";
//
//    return result;
        },

        addIntersectPoint: function(point){
            var intersect = new Point(point);
            intersect.baseline = this.game.baseline;
            intersect.obj1 = point.obj1;
            intersect.obj2 = point.obj2;
            intersect.init(2);
            intersect.draw();
            this.game.intersects.push(intersect);
        },

        lerp: function (a1, a2, t) {  // Linear interpolation
            return {
                x: a1.x + (a2.x - a1.x) * t,
                y: a1.y + (a2.y - a1.y) * t
            };
        },

        getName: function(){
            var charCode = 65;
            while (this.names.indexOf(String.fromCharCode(charCode))!=-1){
                charCode+=1;
            };
            this.names.push(String.fromCharCode(charCode));
            return String.fromCharCode(charCode);
        }
    }.extend(Observer);
    return Utility;
});


