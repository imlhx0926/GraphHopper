Gh.define("Triangle", ["Shape", "Point", "ShapeType"], function (Shape, Point, ShapeType) {
//  var shapeOpt;
    function Triangle(shapeOptions) {
//    shapeOpt = shapeOptions;
//    Shape.call(this, ShapeType.TRIANGLE, shapeOptions.color);
        this.vertices = [];
        for (var i = 0; i < shapeOptions.vertices.length; i++) {
            this.vertices[i] = new Point(shapeOptions.vertices[i]);
        }

        /*
         * @property {Boolean} showAngle
         * True if showing this triangle's angle.
         */
        this._showAngle = shapeOptions.showAngle ? shapeOptions.showAngle : true;
        Object.defineProperty(this, "showAngle", {
            set: function (value) {
                var old = this._showAngle;
                this._showAngle = value;
                if (!this._hidden && old != value) {
                    for (var i = 0; i < this.vertices.length; i++) {
                        this.vertices[i].showAngle = value;
                    }
                    this.baseline.drawAllShapes();
                }
            },
            get: function () {
                return this._showAngle;
            },
            enumerable: true,
            configurable: true
        });

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

    Triangle.prototype = new Shape(ShapeType.TRIANGLE);
    Triangle.prototype.init = function () {
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].baseline = this.baseline;
            this.vertices[i].init(1);
            this.vertices[i].showAngle = this._showAngle;
            if (i == 0) {
                this.vertices[i].neighbor = [this.vertices[this.vertices.length - 1], this.vertices[i + 1]];
            } else if (0 < i && i < (this.vertices.length - 1)) {
                this.vertices[i].neighbor = [this.vertices[i - 1], this.vertices[i + 1]];
            } else {
                this.vertices[i].neighbor = [this.vertices[i - 1], this.vertices[0]];
            }
        }
    };
    Triangle.prototype.area = function () {
        return Math.abs(0.5 * (this.vertices[0].x * this.vertices[1].y + this.vertices[0].y * this.vertices[2].x + this.vertices[1].x * this.vertices[2].y - this.vertices[0].x * this.vertices[2].y - this.vertices[0].y * this.vertices[1].x - this.vertices[1].y * this.vertices[2].x));
    };
    Triangle.prototype.draw = function (isFinal) {
        isFinal = isFinal != undefined ? isFinal : true;
        this.baseline.drawTriangle(this, isFinal);
    };

    return Triangle;
});

function generateTriangle(alpha, beta, c){
    alpha = alpha*Math.PI/180;
    beta = beta*Math.PI/180;
    var gamma = Math.PI - alpha - beta;
    console.log(alpha, beta, gamma);
    var A = {x:0, y:0, name: game.utility.getName()};
    var B = {x:0, y:0, name: game.utility.getName()};
    var C = {x:0, y:0, name: game.utility.getName()};
    B.x = A.x + c*Math.cos(alpha);
    B.y = A.y + c*Math.sin(alpha);
    C.x = A.x + c*Math.sin(beta)/Math.sin(gamma);
    C.y = A.y;
    console.log(alpha, beta, gamma);
    console.log(A,B,C);
    var triangle = {
            type: 7,
            vertices: [A,B,C]
        };
    game.createShape(triangle);
    game.baseline.drawAllShapes();

}