var width = window.innerWidth / 2;
var height = width;
var nodes = [];
var x = 0;
var y = 0;
var iterations = 1000;
var radius = 2;

var svg = d3.select("#fractal").append("svg")
    .attr("width", width)
    .attr("height", height);


var marginLeft = 10;
var marginTop = 10;

var anchorRadius = 4;


restart();

function calc() {
    nodes[0] = {x: width - anchorRadius, y: height - anchorRadius, r: 255, g: 0, b: 0, radius: anchorRadius};
    nodes[1] = {x: anchorRadius, y: height - anchorRadius, r: 0, g: 255, b: 0, radius: anchorRadius};
    nodes[2] = {x: (width / 2), y: anchorRadius, r: 0, g: 0, b: 255, radius: anchorRadius};

    var r = 0;
    var g = 0;
    var b = 0;

    for (i = 3; i < iterations; i++) {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                x = x / 2;
                y = (height + y) / 2;
                r = 0;
                g = 255;
                b = 0;
                break
            case 1:
                x = (width + x) / 2;
                y = (height + y) / 2;
                r = 255;
                g = 0;
                b = 0;
                break
            case 2:
                x = (width / 2 + x) / 2;
                y = y / 2;
                r = 0;
                g = 0;
                b = 255;
                break
        }
        nodes[i] = {x: x, y: y, r: r, g: g, b: b, radius: radius}
    }
    nodes.length = iterations;
}

function stop() {
    d3.selectAll("svg > *").remove();
}


function drawUpTo(max) {

    var subsetNodes = [];

    for (var i = 0; i < max; i++) {
        subsetNodes[i] = nodes[i];
    }

    node = svg.selectAll("circle").data(subsetNodes)

    node.enter().insert("circle")

    node.attr("cx", function (d) {
        return d.x
    })
        .attr("cy", function (d) {
            return d.y
        })
        .attr("r", function (d) {
            return d.radius
        })
        .style("fill", function (d) {
            return "rgb(" + d.r + "," + d.g + "," + d.b + ")"
        })
    ;

    node.exit().remove()
}

var interValId = 0;

function restart() {
    calc();
    console.log(interValId);
    if (interValId && interValId !== 0) {
        clearInterval(interValId);
    }

    var i = 1;
    interValId = setInterval(function () {
        if (i < iterations) {
            i++;
        }
        drawUpTo(i);
    }, 100);
    console.log(interValId);

}
