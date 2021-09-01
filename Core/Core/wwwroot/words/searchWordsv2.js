



function drawGraph(graphData) {

    var svg = d3.select("#simpleWords2wd"),
        width = +svg.attr("width"),
        height = +svg.attr("height");


    var maxval = Math.max.apply(Math, graphData.nodes.map(function(o) { return o.group; }))
    var minval = Math.min.apply(Math, graphData.nodes.map(function(o) { return o.group; }))


    var color = d3.scaleLinear()
        .domain([minval, maxval])
        .range(["red", "blue", "green"]);
    

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody().strength(-25))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(1));


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

    var circles = node.append("circle")
        .attr("r", function(d) {
            if (!d.linkCount) {
                return 2;
            }
            
            if (d.linkCount < linkCountFilter) {
                return 0;
            }
            return d.linkCount * 2;
        })
        .attr("fill", function (d) {
            return color(d.group);
        });

    var lables = node.append("text")
        .text(function (d) {
            return d.id;
        })
        .attr('x', 6)
        .attr('y', 3)
        .style("font-size", function(d) {
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
            return d.id;
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
                return "translate(" + newx + "," + newy + ")";
            })
        
     
        
        
    }


}

$('#btnSearchWord').click(function() {
    var searchVal = $('#btnSearchInput').val();
    if (searchVal.length < 3) {
        return;
    }
    console.log("Search Val : " + searchVal);

    var svg = d3.select("#simpleWords2wd");
    
    svg.selectAll("*").remove();

    var newterm = "test";
    var path = "/words/Json/" + "EnglishSowpodsdeepwordchain.json";

    d3.json(path).then(function (graph) {
        console.log(graph);

        var graphData = WordsGeneral.FilterDataOnTermExactRecursive(graph, searchVal);
        console.log(graphData);
        drawGraph(graphData);

    });
})

d3.timeout(function () {
    
    var path = "/words/Json/" + "EnglishSowpodsdeepwordchain.json";
    
    d3.json(path).then(function (graph) {
        console.log(graph);

        var graphData = WordsGeneral.FilterDataOnTermExactRecursive(graph, "test");

        //WordsGeneral.FilterDataOnTermExactRecursive(graph, "test");

      drawGraph(graphData);
      
    });


});