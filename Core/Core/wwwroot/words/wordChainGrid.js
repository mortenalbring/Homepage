function drawGraphChains(graphData) {

    var svg = d3.select("#wordChains"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    var groupMax = Math.max.apply(Math, graphData.nodes.map(function (o) { return o.group;}))
    var groupMin = Math.min.apply(Math, graphData.nodes.map(function (o) { return o.group;}))

    var idLengthMax = Math.max.apply(Math, graphData.nodes.map(function (o) { return o.id.length;}))
    var idLengthMin = Math.min.apply(Math, graphData.nodes.map(function (o) { return o.id.length;}))
    
    var groupColor = d3.scaleLinear()
        .domain([groupMin, groupMax])
        .range(["red", "blue", "green"])
        .interpolate(d3.interpolateHcl)
    ;

    var lengthColor = d3.scaleLinear()
        .domain([idLengthMin, idLengthMax])
        .range(["red", "blue", "green"])
        .interpolate(d3.interpolateHcl)
    ;
    
    
    var attractForce = d3.forceManyBody()
        .strength(30)
        .distanceMax(50)
        .distanceMin(10);
    var repelForce = d3.forceManyBody()
        .strength(30)
        .distanceMax(5)
        .distanceMin(1);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }).distance(10).iterations(1))

        .force("charge", d3.forceManyBody().strength(-25))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
          .force("attractForce", attractForce)
           .force("repelForce", repelForce)
        .force('collision', d3.forceCollide().radius(function (d) {
            return d.id.length * 3.5
        }))
    ;

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("stroke", function(d) {
            console.log(d);
            var ss = (d.source.length + d.target.length) /2;
            
            return lengthColor(ss);
        })
        .attr("stroke-opacity", function (d) {
            return 0.5
        })
        .attr("stroke-width", function (d) {
            var ll = d.source.length + d.target.length;
            return ll
        });

    var node = svg.append("g")
        .selectAll("g")
        .data(graphData.nodes)
        .enter().append("g")

    var radius = 5;
    var linkCountFilter = -1;
    var defaultNodeCircleOpacity = 0.8;

    var circles = node.append("circle")
        .attr("r", function (d) {

            return d.id.length * 3;
            //
            // if (!d.linkCount) {
            //     return 2;
            // }
            //
            // if (d.linkCount < linkCountFilter) {
            //     return 0;
            // }
            // return d.linkCount * 2;
        })
        .on("click", function (event, d) {
            searchVal = d.id;

        })
        .attr("stroke",function(d) {
  
            return "white";
        })
        .attr("stroke-width", function(d) {
            return "1.5px";
        })
        .attr("opacity", defaultNodeCircleOpacity)
        .attr("fill", function (d) {
            return groupColor(d.group);
        });

    var lables = node.append("text")
        .text(function (d) {
            return d.id;

        })
        .attr("text-anchor", "middle")
        .attr('x', 0)
        .attr('y', 3)
        .style("font-size", function (d) {
            if (!d.linkCount) {
                return "10px";
            }
            if (d.linkCount < linkCountFilter) {
                return 0;
            }
            return "10px";
        })
    ;

    node.append("title")
        .text(function (d) {
            return "[" + d.group + "] " + d.id + " (" + d.linkCount + ")";
        });


    simulation
        .nodes(graphData.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graphData.links);

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("transform", function (d) {
                var newx = Math.max(radius, Math.min(width - radius, d.x));
                var newy = Math.max(radius, Math.min(width - radius, d.y));
                if (newx && newy) {
                    return "translate(" + newx + "," + newy + ")";
                }

            })
    }
}


d3.timeout(function () {

    var path = "/words/Json/en/wordChainsEnglish20210914.json";

    d3.json(path).then(function (graph) {

        drawGraphChains(graph);

    });


});