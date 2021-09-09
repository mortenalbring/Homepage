var TotalGraphData;

function drawGraph(graphData, searchVal) {

    var svg = d3.select("#simpleWords2wd"),
        width = +svg.attr("width"),
        height = +svg.attr("height");


    var maxval = Math.max.apply(Math, graphData.nodes.map(function (o) {
        return o.linkCount;
    }))
    var minval = Math.min.apply(Math, graphData.nodes.map(function (o) {
        return o.linkCount;
    }))

    console.log("max min" + maxval + "  " + minval);
    var color = d3.scaleLinear()
        .domain([minval, maxval])
        .range(["red","blue","green"])
        .interpolate(d3.interpolateHcl)
    ;
    
    var attractForce = d3.forceManyBody()
        .strength(3)
        .distanceMax(50)
        .distanceMin(10);
    var repelForce = d3.forceManyBody()
        .strength(-300)
        .distanceMax(5)
        .distanceMin(1);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody().strength(-25))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      //  .force("attractForce", attractForce)
     //   .force("repelForce", repelForce)
        .force('collision', d3.forceCollide().radius(function (d) {
            return d.id.length * 3.5
        }))
    ;

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return 1
        });

    var node = svg.append("g")
        .attr("class", "nodes")
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
        .on("click", function(event, d) {
            console.log(d);

            searchVal = d.id;

            var svg = d3.select("#simpleWords2wd");
            svg.selectAll("*").remove();

            var path = "/words/Json/EnglishSowpodsdeepwordchain.json";
            d3.json(path).then(function (graph) {
                console.log("New data found")
                console.log(TotalGraphData);
                
                var graphData = WordsGeneral.FilterDataOnTermExactRecursive(graph, searchVal);
                
                var combinedData = WordsGeneral.CombineData(TotalGraphData,graphData);
                console.log(combinedData);
                
                drawGraph(combinedData,searchVal);

            });
             
            
        })
        .attr("opacity", defaultNodeCircleOpacity)
        .attr("fill", function (d) {
            return color(d.linkCount);
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

$('#btnSearchWord').click(function () {
    var searchVal = $('#btnSearchInput').val();
    if (searchVal.length < 3) {
        return;
    }

    var svg = d3.select("#simpleWords2wd");
    svg.selectAll("*").remove();
    
    var path = "/words/Json/EnglishSowpodsdeepwordchain.json";

    d3.json(path).then(function (graph) {
        var graphData = WordsGeneral.FilterDataOnTermExactRecursive(graph, searchVal);
        console.log(graphData);
        
        drawGraph(graphData,searchVal);

    });
})

d3.timeout(function () {

    var path = "/words/Json/EnglishSowpodsdeepwordchain.json";

    d3.json(path).then(function (graph) {
        

        var searchVal = "test";
        var graphData = WordsGeneral.FilterDataOnTermExactRecursive(graph, searchVal);
        TotalGraphData = graphData;
        //WordsGeneral.FilterDataOnTermExactRecursive(graph, "test");

        drawGraph(graphData,searchVal);

    });


});