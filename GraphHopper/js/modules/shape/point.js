Gh.define("Point", ["Shape", "ShapeType"], function (Shape, ShapeType) {
    function Point(pointOptions) {
//    Shape.call(this, ShapeType.POINT, pointOptions.color);

        /*
         * @property {int} pointType
         * PointType of this point. 0 : single point, 1 : vertex, 2: intersection point.
         */
        this.pointType = pointOptions.pointType ? pointOptions.pointType : 0;

        /*
         * @property {String} name
         * Name of this point.
         */
        this._name = "";
        Object.defineProperty(this, "name", {
            set: function (value) {
                this._name = value;
                // Redraw canvas after the point's name been changed.
                if (!this._hidden && this.showName) {
                    this.baseline.drawAllShapes();
                }
            },
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Double} x
         * x coordinate of this point.
         */
        this._x = pointOptions.x;
        Object.defineProperty(this, "x", {
            set: function (value) {
                this._x = value;
                this._pageX = this.baseline.centerX + this._x * this.baseline.scaleWorld;
                // Redraw canvas after the point's name been changed.
                if (!this.hidden) {
                    this.baseline.drawAllShapes();
                    console.log('draw');
                }
            },
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Double} y
         * y coordinate of this point.
         */
        this._y = pointOptions.y;
        Object.defineProperty(this, "y", {
            set: function (value) {
                this._y = value;
                this._pageY = this.baseline.centerY - this._y * this.baseline.scaleWorld;

                // Redraw canvas after the point's name been changed.
                if (!this.hidden) {
                    this.baseline.drawAllShapes();
                    console.log('draw');
                }
            },
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Double} pageX
         * x-coordinate of a point's position relative to the page.
         */
        this._pageX = null;
        Object.defineProperty(this, "pageX", {
            set: function (value) {
                this._pageX = value;
                // Redraw canvas after the point's name been changed.
                if (!this.hidden) {
                    this.baseline.drawAllShapes();
                    console.log('draw');
                }
            },
            get: function () {
                return this._pageX;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Double} pageY
         * y-coordinate of a point's position relative to the page.
         */
        this._pageY = null;
        Object.defineProperty(this, "pageY", {
            set: function (value) {
                this._pageY = value;
                // Redraw canvas after the point's name been changed.
                if (!this.hidden) {
                    this.baseline.drawAllShapes();
                    console.log('draw');
                }
            },
            get: function () {
                return this._pageY;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Boolean} showName
         * True if showing this point's name.
         */
        this._showName = pointOptions.showName ? pointOptions.showName : true;
        Object.defineProperty(this, "showName", {
            set: function (value) {
                var old = this._showName;
                this._showName = value;
                if (!this._hidden && old != value) {
                    this.baseline.drawAllShapes();
                }
            },
            get: function () {
                return this._showName;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Boolean} showCoordinate
         * True if showing this point's coordinate.
         */
        this._showCoordinate = pointOptions.showCoordinate ? pointOptions.showCoordinate : true;
        Object.defineProperty(this, "showCoordinate", {
            set: function (value) {
                var old = this._showCoordinate;
                this._showCoordinate = value;
                if (!this._hidden && old != value) {
                    this.baseline.drawAllShapes();
                }
            },
            get: function () {
                return this._showCoordinate;
            },
            enumerable: true,
            configurable: true
        });

        /*
         * @property {Boolean} showTooltip(NYI)
         * True if showing this point's tooltip.
         * TODO
         */
        this.showTooltip = pointOptions.showTooltip ? pointOptions.showTooltip : true;
    }

    Point.prototype = new Shape(ShapeType.POINT);
    Point.prototype.init = function (pointType) {
        this.pointType = pointType ? pointType : 0;
        this._name = this.baseline.game.utility.getName();
        this._pageX = this.baseline.centerX + this._x * this.baseline.scaleWorld;
        this._pageY = this.baseline.centerY - this._y * this.baseline.scaleWorld;
    };
    Point.prototype.draw = function (isFinal) {
        isFinal = isFinal != undefined ? isFinal : true;
        this.baseline.drawPoint(this, isFinal);
    };

    return Point;
});