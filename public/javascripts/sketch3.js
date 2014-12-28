(function () {
    var frame = 0;
    var canvas;

    var width, height;

    var mouseX;
    var mouseY;

    function lerp(a, b, x) {
        return a + (b-a) * x;
    }
    function map(x, xStart, xStop, yStart, yStop) {
        return lerp(yStart, yStop, (x - xStart) / (xStop - xStart));
    }

    function fn(x, y) {
        var dx = (x - width/2);
        var dy = (y - height/2);
        var length2 = dx*dx + dy*dy;
        var z1 = 23000 / (1 + Math.exp(-length2 / 10000));
        var z2 = 600 * Math.cos(length2 / 25000 * map(mouseX, 0, width, 0.9, 1.1) + frame / map(mouseX, 0, width, 43, 11));

        return lerp(z1, z2, (1+Math.sin(frame / 100))/2);
    }

    function gradient(x, y) {
        var epsilon = 1e-4;
        var ddx = (fn(x + epsilon, y) - fn(x, y)) / epsilon;
        var ddy = (fn(x, y + epsilon) - fn(x, y)) / epsilon;

        return [ddx, ddy];
    }

    function permutedLine(ox, oy, nx, ny, context) {
        function permutedMove(x, y) {
            var grad = gradient(x, y);
            context.moveTo(x + grad[0], y + grad[1]);
        }
        function permutedPoint(x, y) {
            var grad = gradient(x, y);
            context.lineTo(x + grad[0], y + grad[1]);
        }

        permutedMove(ox, oy);

        var STEPS = 10;
        for( var t = 1; t <= STEPS; t += 1) {
            var percentage = t / STEPS;
            permutedPoint(ox + (nx - ox) * percentage,
                          oy + (ny - oy) * percentage);
        }
    }

    function init($sketchElement, context) {
        canvas = $sketchElement.find("canvas")[0];
    }

    function animate($sketchElement, context) {
        frame++;
        width = canvas.width;
        height = canvas.height;

        if (frame % 1000 < 500) {
            context.strokeStyle = "rgba(0,0,0,0.05)";
        } else {
            context.strokeStyle = "rgba(255,255,255,0.05)";
        }
        context.beginPath();
        var GRIDSIZE = 50;
        for (var x = -GRIDSIZE + frame % GRIDSIZE; x < width + GRIDSIZE; x += GRIDSIZE) {
            for (var y = -GRIDSIZE + frame % GRIDSIZE; y < height + GRIDSIZE; y += GRIDSIZE) {

                // permutedLine(x, y, x + GRIDSIZE, y + GRIDSIZE, context);
                permutedLine(x + GRIDSIZE, y, x, y + GRIDSIZE, context);
                // permutedLine(x + GRIDSIZE, y + GRIDSIZE, x, y + GRIDSIZE, context);
                // permutedLine(x, y + GRIDSIZE, x, y, context);
            }
        }
        context.stroke();
    }

    function mousemove(event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    }

    var sketch3 = {
        init: init,
        animate: animate,
        mousemove: mousemove
    };
    initializeSketch(sketch3, "sketch3");
})();

