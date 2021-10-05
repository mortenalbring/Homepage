﻿
d3.json("/Projects/GetWordsData",function(error,data) {createNetwork(data)});

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function createNetwork(data) {
console.log(data);
    var edges = data.links;
    var nodes = data.nodes;

//create a network from an edgelist

    var colors = ["#996666", "#66CCCC", "#FFFF99", "#CC9999", "#666633", "#993300", "#999966", "#660000", "#996699", "#cc6633", "#ff9966", "#339999", "#6699cc", "#ffcc66", "#ff6600", "#00ccccc"]

//This isn't "gravity" it's the visual centering of the network based on its mass
    var networkCenter = d3.forceCenter().x(250).y(250);

//CHARGE
    var manyBody = d3.forceManyBody().strength(-150).distanceMax(100);

//Specify module position for the three largest modules. This is the x-y center of the modules
//singletons and small modules will be handled as a whole
    var modulePosition = {
        "2": {x: 0, y: 0},
        "3": {x: 200, y: 25},
        "1": {x: 0, y: 200}
    }

//Make the x-position equal to the x-position specified in the module positioning object or, if not in
//the hash, then set it to 250
    var forceX = d3.forceX(function (d) {return modulePosition[d.module] ? modulePosition[d.module].x : 250})
        .strength(0.05)

//Same for forceY--these act as a gravity parameter so the different strength determines how closely
//the individual nodes are pulled to the center of their module position
    var forceY = d3.forceY(function (d) {return modulePosition[d.module] ? modulePosition[d.module].y : 250})
        .strength(0.05);

    var force = d3.forceSimulation(nodes)
        .force("charge", manyBody)
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(30).iterations(1))
        .force("center", networkCenter)
        .force("x", forceX)
        .force("y", forceY)
        .on("tick", updateNetwork);

    var edgeEnter = d3.select("svg.main").selectAll("g.edge")
        .data(edges)
        .enter()
        .append("g")
        .attr("class", "edge");

    edgeEnter
        .append("line")
        .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})
        .style("stroke", "black")
        .style("pointer-events", "none");

    var nodeEnter = d3.select("svg.main").selectAll("g.node")
        .data(nodes, function (d) {return d.id})
        .enter()
        .append("g")
        .attr("class", "node")

    nodeEnter.append("circle")
        .attr("r", 8)
        .style("fill", "black")
        .style("stroke", "black")
        .style("stroke-width", function (d) {return d.border ? "3px" : "1px"})

    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 3)
        .style("stroke-width", "1px")
        .style("stroke-opacity", 0.75)
        .style("stroke", "white")
        .style("font-size", "8px")
        .text(function (d) {return d.id})
        .style("pointer-events", "none")

    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 3)
        .style("font-size", "8px")
        .text(function (d) {return d.id})
        .style("pointer-events", "none")

//  force.start();

    function updateNetwork(e) {
        d3.select("svg.main").selectAll("line")
            .attr("x1", function (d) {return d.source.x})
            .attr("y1", function (d) {return d.source.y})
            .attr("x2", function (d) {return d.target.x})
            .attr("y2", function (d) {return d.target.y});

        d3.select("svg.main").selectAll("g.node")
            .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

    }

}