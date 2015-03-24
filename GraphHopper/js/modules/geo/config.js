Gh.define("Config", [], function () {
    return {
        scaleWorld: 20,
        canvasDiv: 'canvasDiv',
        draftCanvas: 'draftCanvas',
        finalCanvas: 'finalCanvas',
        baselineCanvas: 'baselineCanvas',
//    centerX : Math.round(document.getElementById(this.canvasDiv).offsetWidth/40)*20,
//    centerY : Math.round(document.getElementById(this.canvasDiv).offsetHeight/40)*20
        colors: {
            bg: "#ffffff",
            obj: "#000000",
            grid: "#81DAF5",
            axis: "#f00",
            keyPoint: "ff0000"
        }
    };
});

Gh.define("ShapeType", [], function () {
    return {
//        TOTAL: 8,
        TRIANGLE: 7,
        LINE: 6,
        POINT: 5,
        CIRCLE: 4
//        CHARIOT: 3,
//        CANNON: 2,
//        SOLDIER: 1,
//        BLANK: 0
    };
});

Gh.define("PredefinedShapes", ["ShapeType"], function (ShapeType) {
    return [
        {
            type: ShapeType.TRIANGLE,
            vertices: [
                {
                    x: 10.0,
                    y: 10.0,
                    name: "A"
                },
                {
                    x: 0,
                    y: 10.0,
                    name: "B"
                },
                {
                    x: 10.0,
                    y: 0,
                    name: "C"
                }
            ]
        },
        {
            type: ShapeType.TRIANGLE,
            vertices: [
                {
                    x: 18.0,
                    y: 1.0,
                    name: "D"
                },
                {
                    x: 0,
                    y: 0,
                    name: "E"
                },
                {
                    x: -7,
                    y: -12,
                    name: "F"
                }
            ]
        },
        {
            type: ShapeType.POINT,
            x: -10,
            y: -10,
            name: 'W'
        },
        {
            type: ShapeType.LINE,
            vertices: [
                {
                    x: -16,
                    y: 14,
                    name: 'X'
                },
                {
                    x: 7,
                    y: 6,
                    name: 'Y'
                }
            ]
        }
    ];
});