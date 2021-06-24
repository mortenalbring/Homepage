//var width = window.innerWidth / 2;
//var height = width;

var width = 400;
var height = 400;
var nodes = [];
var x = 400;
var y = 400;
var iterations = 100;
var radius = 2;

var marginLeft = 10;
var marginTop = 10;

var anchorRadius = 4;

document.getElementById('iterMaxCount').value = iterations;

var svg = d3.select("#fractal").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style","border: 1px solid white")
//    .attr("viewBox","0 0 100 100")
;



//restart();
function drawAnchors() {
    calc();
    drawUpTo(3);
}
drawAnchors();
function calc() {
    
    var iterTextVal = document.getElementById('iterMaxCount').value;
    var parsedInt = parseInt(iterTextVal,10);
    if (parsedInt > 0) {
        iterations = parsedInt;
    }
    
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
    var highestTimeoutId = setInterval(";",1);
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearInterval(i);
    }
   // svg.selectAll("*").remove();
}


function drawUpTo(max) {
    if (max >= nodes.length) {
        stop();
    }
    var subsetNodes = [];
    document.getElementById('iter').textContent = max + "/" + nodes.length;
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


function restart() {
    stop();
    calc();
 

    var i = 1;
    setInterval(function () {
        if (i < iterations) {
            i++;
        }
        drawUpTo(i);
    }, 10);

}
