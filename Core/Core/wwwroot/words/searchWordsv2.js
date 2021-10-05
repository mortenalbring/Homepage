var infoTextBoxSelected;
var infoTextBoxNew;

function drawGraph(graphData, searchVal) {


    function handleClick(d) {

        searchVal = d.id;
        d.highlight = true;
        d.fixed = true;
        
        var graphData = WordsGeneral.FilterDataOnTermExact(WordsGeneral.DataArchive, searchVal);
        var combinedData = WordsGeneral.CombineData(WordsGeneral.FilteredDataArchive, graphData);
        
        WordsGeneral.FilteredDataArchive = JSON.parse(JSON.stringify(combinedData));


        var newNodes = [];
        for (let i = 0; i < combinedData.nodes.length; i++) {
            if (combinedData.nodes[i].new) {
                newNodes.push(combinedData.nodes[i]);
            }
        }

        for (let i = 0; i < combinedData.nodes.length; i++) {
            if (combinedData.nodes[i].id === searchVal) {
                combinedData.nodes[i].highlight = true;
                combinedData.nodes[i].fixed = true;
            }
        }

        for (let i = 0; i < WordsGeneral.FilteredDataArchive.nodes.length; i++) {
            WordsGeneral.FilteredDataArchive.nodes[i].new = false;
        }

        var svg = d3.select("#searchWordsSvg");
        svg.selectAll("*").remove();

        var newNodeText = "";
        for (let i = 0; i < newNodes.length; i++) {
            if (i === 0) {
                newNodeText = newNodes[i].id;
            } else {
                newNodeText = newNodeText + ", " + newNodes[i].id;
            }
        }

        var infoText = "New nodes: " + newNodeText;

        infoTextBoxNew = svg.append("g").append("text")
            .attr("x", 20)
            .attr("y", 30)
            .attr("fill", "white")
            .style("font-size", "10px")
            .text(infoText);

        infoTextBoxSelected = svg.append("g").append("text")
            .attr("x", 20)
            .attr("y", 20)
            .attr("fill", "white")
            .style("font-size", "10px")
            .text("Selected: '" + searchVal + "'");
        drawGraph(combinedData, searchVal);
    }


    var svg = d3.select("#searchWordsSvg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");


    // var maxval = Math.max.apply(Math, graphData.nodes.map(function (o) {
    //     return o.linkCount;
    // }))
    // var minval = Math.min.apply(Math, graphData.nodes.map(function (o) {
    //     return o.linkCount;
    // }))

    var maxval = Math.max.apply(Math, graphData.nodes.map(function (o) {
        return o.id.length;
    }))
    var minval = Math.min.apply(Math, graphData.nodes.map(function (o) {
        return o.id.length;
    }))

    var color = d3.scaleSequential()
        .interpolator(d3.interpolateViridis)
        .domain([minval, maxval]);

    // var color = d3.scaleLinear()
    //     .domain([minval, maxval])
    //     .range(["red", "blue", "green"])
    //     .interpolate(d3.interpolateHcl)
    // ;

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
        .attr("stroke", function (d) {
            var aveval = (d.source.length + d.target.length) / 2;
            return color(d.source.length)
        })
        .attr("stroke-opacity", function (d) {
            return 1
        })
        .attr("stroke-width", function (d) {
            var ll = d.source.length;
            return ll
        });

    var node = svg.append("g")
        .attr("class", "search-nodes")
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
           
            handleClick(d);

        })
        .attr("stroke", function (d) {
            if (d.highlight) {
                return "blue";
            }
            if (d.new) {
                return "yellow";
            }
            return "white";
        })
        .attr("stroke-width", function (d) {
            return "1.5px";
        })
        .attr("opacity", defaultNodeCircleOpacity)
        .attr("fill", function (d) {
            return color(d.id.length);
        });

    var lables = node.append("text")
        .text(function (d) {
            return d.id;

        })
        .on("click", function (event, d) {

            handleClick(d);

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
        node
            .attr("transform", function (d) {
                var newx = Math.max(radius, Math.min(width - radius, d.x));
                var newy = Math.max(radius, Math.min(width - radius, d.y));
              
                if (newx && newy) {
                    return "translate(" + newx + "," + newy + ")";
                }

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

$('#btnSearchWord').click(function () {
    var searchVal = $('#btnSearchInput').val();
    if (searchVal.length < 3) {
        return;
    }

    var svg = d3.select("#searchWordsSvg");
    svg.selectAll("*").remove();

    var path = "/words/Json/EnglishSowpodsdeepwordchain.json";


    var graphData = WordsGeneral.FilterDataOnTermExact(WordsGeneral.DataArchive, searchVal);
    WordsGeneral.FilteredDataArchive = JSON.parse(JSON.stringify(graphData));

    drawGraph(graphData, searchVal);
})

d3.timeout(function () {


    var parentElement = document.getElementById("searchWordsSvg");
    if (parentElement != null) {

        var cw = parentElement.parentElement.clientWidth;
        $('#searchWordsSvg').attr("width", cw);
    }


    var path = "/words/Json/EnglishSowpodsdeepwordchain.json";

    d3.json(path).then(function (graph) {
        WordsGeneral.DataArchive = JSON.parse(JSON.stringify(graph));
        console.log(WordsGeneral.DataArchive);

        var searchVal = "word";
        var graphData = WordsGeneral.FilterDataOnTermExactRecursive(graph, searchVal);
        WordsGeneral.FilteredDataArchive = JSON.parse(JSON.stringify(graphData));
        //WordsGeneral.FilterDataOnTermExactRecursive(graph, "test");

        drawGraph(graphData, searchVal);
    });


});