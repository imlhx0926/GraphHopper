Gh.define("congruentTriangles", ["Shape", "Point", "Triangle", "ShapeType"], function (Shape, Point, Triangle, ShapeType) {
    function congruentTriangles(shapeOptions){
        this.triangle1 = new Triangle(shapeOptions.triangle1);
        this.triangle2 = new Triangle(shapeOptions.triangle2);
    }
    congruentTriangles.prototype = new Shape(ShapeType.CONGRUENTTRIANGLES);
    congruentTriangles.prototype.init = function(){

    }
    congruentTriangles.prototype.transform = function(dest){
        var matchingTriangle = null;
        var matchingIndex = 0;
        for (var i=0; i<this.triangle1.vertices.length; i++){
            var vertex = this.triangle1.vertices[i];
            if (this.baseline.selectedVertex==vertex){
                matchingTriangle = this.triangle2;
                matchingIndex = i;
            }
        }
        for (var i=0; i<this.triangle2.vertices.length; i++){
            var vertex = this.triangle2.vertices[i];
            if (this.baseline.selectedVertex==vertex){
                matchingTriangle = this.triangle1;
                matchingIndex = i;
            }
        }
        var vector = {
            x: dest.x - this.selectedVertex._x,
            y: dest.y - this.selectedVertex._y
        }
        this.selectedVertex._x = dest.x;
        this.selectedVertex._y = dest.y;
        this.selectedVertex._pageX = this.centerX + dest.x * this.scaleWorld;
        this.selectedVertex._pageY = this.centerY - dest.y * this.scaleWorld;
        matchingTriangle.vertices[matchingIndex]._x = 0;
        matchingTriangle.vertices[matchingIndex]._y = 0;
    }
});
