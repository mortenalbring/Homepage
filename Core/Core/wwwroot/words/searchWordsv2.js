var svg = d3.select("#simpleWords2wd"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal();
var radius = 3;
var forceX = d3.forceX(width / 2).strength(0.015);
var forceY = d3.forceY(height / 2).strength(0.015);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(20).iterations(1))
    .force("charge", d3.forceManyBody().distanceMax(90).strength(-90))
    .force('x', forceX)
    .force('y', forceY);
console.log("yarp");
d3.json("/words/Json/simpleWordDataEnglish.json", function (error, data) {
    if (error) {
        console.log(error);
    };
    console.log(data);
    var graph = data;

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g");

    var circles = node.append("circle")
        .attr("r", 5)
        .attr("fill", function (d) { return color(d.id.length); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var labels = node.append("text")
        .text(function (d) {
            return d.id;
        })
        .attr('x', 6)
        .attr('y', 3);

    node.append("title")
        .text(function (d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    simulation.start();
    // var n = 10;
    // for (var i = 0; i < n; ++i) {
    //     simulation.tick();  
    // } 
    simulation.stop();

    function ticked() {

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node
            .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    }
});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function tickActions() {
    //constrains the nodes to be within a box

} 