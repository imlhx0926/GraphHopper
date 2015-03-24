Gh.define("Geo.Game", ["Observer", "Baseline", "PredefinedShapes", "ShapeFactory", "Utility"], function (Observer, Baseline, PredefinedShapes, ShapeFactory, Utility) {

    function Game() {
        this.shapes = [];
        this.intersects = [];
        this._currentAction = "select";
        Object.defineProperty(this, "currentAction", {
            set: function (value) {
                var old = this._currentAction;
                this._currentAction = value;
                if (old != value) {
                    //change sketching method
                }
            },
            get: function () {
                return this._currentAction;
            }
        });
    }

    Game.prototype = {
        init: function () {
            var baseline = new Baseline();
            var utility = new Utility();
            baseline.game = this;
            utility.game = this;
            this.baseline = baseline;
            this.utility = utility;
            baseline.init();
            for (var i = 0; i < PredefinedShapes.length; i++) {
                this.createShape(PredefinedShapes[i]);
            }

            baseline.drawAllShapes();
        },

        createShape: function (data) {
            var shape = ShapeFactory.createShape(data);
            shape.game = this;
            shape.baseline = this.baseline;
            if (shape.init) {
                shape.init();
            }
            if (!shape.disabled){
                this.shapes.forEach(function(obj){
                    shape.game.utility.intersect(shape,obj);
                });
            }
            this.shapes.push(shape);
            return shape;
        }

    }.extend(Observer);

    return Game;
});