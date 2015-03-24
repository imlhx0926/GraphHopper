Gh.define("Circle", ["Shape", "Point", "ShapeType"], function (Shape, Point, ShapeType) {
    function Circle(shapeOptions) {
        console.log(shapeOptions);
//    Shape.call(this, ShapeType.LINE, shapeOptions.color);
        this.center = new Point(shapeOptions.center);
        this.point = new Point(shapeOptions.point);
        this.radius = shapeOptions.radius;
        this.offsetX = this.center.x - this.point.x;
        this.offsetY = this.center.y - this.point.y;
//    /*
//     * @property {Boolean} showAngle
//     * True if showing this triangle's angle.
//     */
//    this._showAngle = shapeOptions.showAngle ? shapeOptions.showAngle : true;
//    Object.defineProperty(this, "showAngle", {
//      set: function (value) {
//        var old = this._showAngle;
//        this._showAngle = value;
//        if (!this._hidden && old != value) {
//          for (var i = 0; i < this.vertices.length; i++) {
//            this.vertices[i].showAngle = value;
//          }
//          this.baseline.drawAllShapes();
//        }
//      },
//      get: function () {
//        return this._showAngle;
//      },
//      enumerable: true,
//      configurable: true
//    });

        /*
         * @property {Boolean} showVerticesName
         * True if showing this triangle's vertices name.
         */
        this._showVerticesName = shapeOptions.showVerticesName ? shapeOptions.showVerticesName : true;
        Object.defineProperty(this, "showVerticesName", {
            set: function (value) {
                var old = this._showVerticesName;
                this._showVerticesName = value;
                if (!this._hidden && old != value) {
                    this.center.showName = value;
                    this.point.showName = value;
                    this.baseline.drawAllShapes();
                }
            },
            get: function () {
                return this._showVerticesName;
            },
            enumerable: true,
            configurable: true
        });
    }

    Circle.prototype = new Shape(ShapeType.CIRCLE);
    Circle.prototype.init = function () {
        this.center.baseline = this.baseline;
        this.point.baseline = this.baseline;
        this.center.init(0);
        this.point.init(0);
    };
    Circle.prototype.transform = function (dest){
        this.baseline.selectedVertex._x = dest.x;
        this.baseline.selectedVertex._y = dest.y;
        this.baseline.selectedVertex._pageX = this.baseline.centerX + dest.x * this.baseline.scaleWorld;
        this.baseline.selectedVertex._pageY = this.baseline.centerY - dest.y * this.baseline.scaleWorld;
        if(this.baseline.selectedVertex==this.center){
            this.point._x = this.center.x - this.offsetX;
            this.point._y = this.center.y - this.offsetY;
            this.point._pageX = this.baseline.centerX + this.point._x * this.baseline.scaleWorld;
            this.point._pageY = this.baseline.centerY - this.point._y * this.baseline.scaleWorld;
        }
        else if(this.baseline.selectedVertex==this.point){
            this.radius = this.baseline.calDistance(this.center,this.point);
            this.offsetX = this.center.x - this.point.x;
            this.offsetY = this.center.y - this.point.y;
        }
    };
    Circle.prototype.draw = function (isFinal) {
        isFinal = isFinal != undefined ? isFinal : true;
        this.baseline.drawCircle(this.center, this.radius, isFinal);
        this.baseline.drawPoint(this.center, isFinal);
        this.baseline.drawPoint(this.point, isFinal);
    };

    return Circle;
});