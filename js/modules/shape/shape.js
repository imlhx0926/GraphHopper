Gh.define("Shape", [], function () {
    function Shape(type, color) {
//    this.game = null;
        this.baseline = null;

        /**
         * @property {String} color
         * Color of the shape.
         */
        this.color = color ? color : 'black';
        this.type = type;

        /**
         * @property {Boolean} hidden
         * True if this shape is hidden.
         */
        this._hidden = false;
        Object.defineProperty(this, "hidden", {
            set: function (value) {
                var old = this._hidden;
                this._hidden = value;
                // Redraw canvas after the point's name been changed.
                if (old != value) {
                    this.baseline.drawAllShapes();
                }
            },
            get: function () {
                return this._hidden;
            },
            enumerable: true,
            configurable: true
        });

        /**
         * @property {Boolean} disabled(NYI)
         * True if this shape is disabled.
         * TODO
         */
        this.disabled = false;
    }

    Shape.prototype = {
        /*
         * Show the shape.
         */
        show: function () {
            this.hidden = false;
        },

        /*
         * Hide the shape.
         */
        hide: function () {
            this.hidden = true;
        },

        /*
         * Remove the shape.
         */
        remove: function () {
            this.game.shapes.splice(this, 1);
            this.baseline.drawAllShapes();
        },

        /*
         * Enable the shape.
         * TODO
         */
        enable: function () {
            this.disabled = false;
        },

        /**
         * Disable the shape.
         * TODO
         */
        disable: function () {
            this.disabled = true;
        },

        transform: function (dest) {
            var self = this.baseline;
            this.baseline.selectedVertex._x = dest.x;
            this.baseline.selectedVertex._y = dest.y;
            this.baseline.selectedVertex._pageX = this.baseline.centerX + dest.x * this.baseline.scaleWorld;
            this.baseline.selectedVertex._pageY = this.baseline.centerY - dest.y * this.baseline.scaleWorld;
        }
    };

    return Shape;
});