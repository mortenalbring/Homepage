//var width = window.innerWidth / 2;
//var height = width;

var width = 400;
var height = 400;
var nodes = [];
var x = 400;
var y = 400;
var iterations = 1000;
var radius = 0.5;

var marginLeft = 10;
var marginTop = 1;

var anchorRadius = 2;
var animSpeed = 10;

document.getElementById('iterMaxCount').value = iterations;
document.getElementById('dataRadius').value = radius;
document.getElementById('dataSpeed').value = animSpeed;

var svg = d3.select("#fractal").append("svg")
//    .attr("width", width)
//    .attr("height", height)
    .attr("style","border: 1px solid white")
    .attr("viewBox","0 0 100 100")
;

function drawAnchors() {
    calc();
    drawUpTo(3);
}


function parseGuiVariables() {
    var iterTextVal = document.getElementById('iterMaxCount').value;
    var parsedInt = parseInt(iterTextVal,10);
    if (parsedInt > 0) {
        iterations = parsedInt;
    }

    var radiusTextVal= document.getElementById('dataRadius').value;
    var parsedRadius = parseFloat(radiusTextVal);
    if (parsedRadius > 0) {
        radius = parsedRadius;
    }

    var speedTextVal = document.getElementById('dataSpeed').value;
    var parsedSpeed = parseFloat(speedTextVal);
    if (parsedSpeed > 0) {
        animSpeed = parsedSpeed;
    }
}

function calc() {
    parseGuiVariables();
    
    
    var strokeWidthAnchor = 1.0;
    var strokeWidthPoint = radius / 10;
    
    var anchorOffset = 5;
    
    nodes[0] = {x: width - anchorRadius-anchorOffset, y: height - anchorRadius-anchorOffset, r: 255, g: 0, b: 0, radius: anchorRadius, strokeWidth: strokeWidthAnchor};
    nodes[1] = {x: anchorRadius+anchorOffset, y: height - anchorRadius-anchorOffset, r: 0, g: 255, b: 0, radius: anchorRadius, strokeWidth: strokeWidthAnchor};
    nodes[2] = {x: (width / 2), y: anchorRadius+anchorOffset, r: 0, g: 0, b: 255, radius: anchorRadius, strokeWidth: strokeWidthAnchor};

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
        nodes[i] = {x: x, y: y, r: r, g: g, b: b, radius: radius, strokeWidth: strokeWidthPoint}
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


function drawUpTo(max, stopOnMax) {
    if (max > nodes.length) {
        if (stopOnMax) {
            stop();
        }
        return;
    }
    var subsetNodes = [];
    document.getElementById('iter').textContent = max + "/" + nodes.length;
    for (var i = 0; i < max; i++) {
        subsetNodes[i] = nodes[i];
    }

    node = svg.selectAll("circle").data(subsetNodes)

    node.enter().insert("circle")

    node.attr("cx", function (d) {
        var xperc = (d.x / width) * 100 + "%";
        return xperc
    })
        .attr("cy", function (d) {
            var yperc = (d.y / height) * 100 + "%";
            return yperc
        })
        .attr("r", function (d) {
            return d.radius
        })
        .style("stroke-width", function(d) {
            return d.strokeWidth;
        })
        .style("stroke", function (d) {
            return "white";
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
        drawUpTo(i,true);
    }, animSpeed);

}


function startLoop() {
    stop();
    calc();

    var i = 1;
    setInterval(function () {
        if (i <= iterations) {
            i++;
        }
        else {
            i = 1;
        }
        drawUpTo(i, false);
    }, animSpeed);

}
drawAnchors();
startLoop();