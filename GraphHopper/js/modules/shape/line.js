Gh.define("Line", ["Shape", "Point", "ShapeType"], function (Shape, Point, ShapeType) {
    function Line(shapeOptions) {
//    Shape.call(this, ShapeType.LINE, shapeOptions.color);
        this.vertices = [];
        this.paramters = {A:0, B:0, C:0};
        for (var i = 0; i < shapeOptions.vertices.length; i++) {
            this.vertices[i] = new Point(shapeOptions.vertices[i]);
        }

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
                    for (var i = 0; i < this.vertices.length; i++) {
                        this.vertices[i].showName = value;
                    }
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

    Line.prototype = new Shape(ShapeType.LINE);
    Line.prototype.init = function () {
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].baseline = this.baseline;
            this.vertices[i].init(1);
//      this.vertices[i].showAngle = this._showAngle;
            if (i == 0) {
                this.vertices[i].neighbor = [this.vertices[this.vertices.length - 1], this.vertices[i + 1]];
            } else if (0 < i && i < (this.vertices.length - 1)) {
                this.vertices[i].neighbor = [this.vertices[i - 1], this.vertices[i + 1]];
            } else {
                this.vertices[i].neighbor = [this.vertices[i - 1], this.vertices[0]];
            }
            this.updateParameters();
        }
    };
    Line.prototype.draw = function (isFinal) {
        isFinal = isFinal != undefined ? isFinal : true;
        this.baseline.drawLine(this.vertices[0], this.vertices[1], isFinal);
        this.baseline.drawPoint(this.vertices[0], isFinal);
        this.baseline.drawPoint(this.vertices[1], isFinal);
    };
    Line.prototype.updateParameters = function(){
        this.paramters.A = this.vertices[1].y - this.vertices[0].y;
        this.paramters.B = this.vertices[0].x - this.vertices[1].x;
        this.paramters.C = this.vertices[0].y * this.vertices[1].x - this.vertices[0].x * this.vertices[1].y;
    };
    return Line;
});