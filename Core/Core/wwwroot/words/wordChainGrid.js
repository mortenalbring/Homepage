
function drawGraphChains(graphData) {

    var svg = d3.select("#wordChains"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    
    var groupMax = Math.max.apply(Math, graphData.nodes.map(function (o) { return o.group;}))
    var groupMin = Math.min.apply(Math, graphData.nodes.map(function (o) { return o.group;}))

    var combMax = Math.max.apply(Math, graphData.nodes.map(function (o) { return o.group*100+o.id.length;}))
    var combMin = Math.min.apply(Math, graphData.nodes.map(function (o) { return o.group*100+o.id.length;}))

    var idLengthMax = Math.max.apply(Math, graphData.nodes.map(function (o) { return o.id.length;}))
    var idLengthMin = Math.min.apply(Math, graphData.nodes.map(function (o) { return o.id.length;}))

    console.log("comb" + combMin + ":" + combMax);
    
    var combinedColor = d3.scaleLinear()
        .domain([combMin, combMax])
        .range(["red","yellow", "blue"])
        .interpolate(d3.interpolateHcl)
    ;
    
    var groupColor = d3.scaleLinear()
        .domain([groupMin, groupMax])
        .range(["red", "blue", "green"])
        .interpolate(d3.interpolateHcl)
    ;

    var lengthColor = d3.scaleOrdinal()
        .domain([idLengthMin, idLengthMax])
        .range(["red", "orange", "yellow","green","blue"])
        
    ;
    
    
    var attractForce = d3.forceManyBody()
        .strength(30)
        .distanceMax(50)
        .distanceMin(10);
    var repelForce = d3.forceManyBody()
        .strength(300)
        .distanceMax(5)
        .distanceMin(1);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }).distance(10).iterations(1))

        .force("radial", d3.forceRadial(width/3,width/2,height/2).strength(0.01))
        .force("charge", d3.forceManyBody().strength(-20))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
          .force("attractForce", attractForce)
           .force("repelForce", repelForce)
        .force('collision', d3.forceCollide().radius(function (d) {
            return d.id.length * 3.5
        }))
    ;

    simulation.force('y', d3.forceY().y(function (d) {
        return d.id.length * 20;
    }))


    function dragstarted(event, d) {
        d3.select(this).raise().attr("stroke", "black");
    }

    function dragged(event, d) {
        d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
    }

    function dragended(event, d) {
        d3.select(this).attr("stroke", null);
    }
    
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("stroke", function(d) {
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

        })
        .attr("stroke",function(d) {
  
            return "white";
        })
        .attr("stroke-width", function(d) {
            return "1.5px";
        })
        .attr("opacity", defaultNodeCircleOpacity)
        .attr("fill", function (d) {
            var combVal = d.group*100+d.id.length;
            
            return lengthColor(d.id.length);
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
            return "[" + d.group + "] " + d.id + "";
        });


    simulation
        .nodes(graphData.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graphData.links);


   
    
    function ticked() {
        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            
        
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

 
    }
}


d3.timeout(function () {
    
    var parentElement = document.getElementById("wordChains");
    if (parentElement != null) {
        
        var cw = parentElement.parentElement.clientWidth;
        $('#wordChains').attr("width",cw);
    }

    var path = "/words/Json/en/wordChainsEnglish20210914Depth8.json";

    d3.json(path).then(function (graph) {

        var safeLinks = [];
        for (let i = 0; i < graph.links.length; i++) {
            var source = graph.links[i].source;
            var target = graph.links[i].target;

            var exists = false;
            var existt = false;
            for (let j = 0; j < graph.nodes.length; j++) {
                if (graph.nodes[j].id === source) {
                    exists = true;
                }
                if (graph.nodes[j].id === target) {
                    existt = true;
                }
            }
            if (exists && existt) {
                safeLinks.push(graph.links[i]);
            }
            else {
                console.log("bad link");
                console.log(graph.links[i]);
            }
        }
        graph.links = safeLinks;
        console.log(graph);
        drawGraphChains(graph);

    });


});