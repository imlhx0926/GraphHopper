Gh.define("ShapeFactory", ["ShapeType", "Triangle", "Line", "Point", "Circle"], function (ShapeType, Triangle, Line, Point, Circle) {
    var ShapeConstructors = [].slice.call(arguments).slice(1);

    var ShapeFactory = {
        createShape: function (data) {
            var shape;

            var type = data.type;
            console.log(ShapeConstructors);
            shape = new (ShapeConstructors[7 - type])(data);
            return shape;
        }
    };

    return ShapeFactory;
});