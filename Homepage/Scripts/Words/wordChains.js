function init() {
    //This is for the d3 v5 word chains and generates a dynamic force graph (not static)
    $('.wordsChain').each(function (d) {
        var svgId = "#" + this.id;
        initSvg(d3.select(svgId), "wordsChainp");
    });
    
    initSvg(d3.select("#simpleWords1wc"), "simpleWords1pt");
    
    function initSvg(svg, containerId) {

        var domVariables = WordsGeneral.ParseDomVariables(svg, containerId);

        //var color = d3.scaleSequential().domain([1,10])(d3.schemeCategory20);
        //var color = d3.scaleSequential(d3.schemeCategory20);
        var color = d3.scaleLinear()
            .domain([1, domVariables.MaxGroup])
            .range(["red", "orange", "yellow", "green", "blue", "indigo", "violet"]);

        var attractForce = d3.forceManyBody().strength(5).distanceMax(400).distanceMin(60);
        var repelForce = d3.forceManyBody().strength(-80).distanceMax(80).distanceMin(10);


        var forceY = d3.forceY(domVariables.Height / 2).strength(2);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }).distance(domVariables.LinkDistance).iterations(1))
            .force("charge", d3.forceManyBody().strength(-80))
            //        .force('y', forceY)
            .force("center", d3.forceCenter(domVariables.Width / 2, domVariables.Height / 2))
            .force("attractForce", attractForce)
            .force("repelForce", repelForce)
        ;

        var radius = 15;

        d3.json("/Scripts/Words/Json/" + domVariables.JsonPath).then(function (graph) {

            WordsGeneral.FilterDataOnGroup(graph, domVariables.Group);

            var linkGroup = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter()
                .append("g")
                .attr("class", "link-group");


            var linkLine = linkGroup.append("line")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

            var linkText = linkGroup.append("text")
                .text(function (d) {
                    if (d.diffChar) {
                        return d.diffChar
                    } else {
                        return "";
                    }
                });

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter()
                .append("g")
                .attr("class", "node-group")
            ;

            var circles = node.append("circle")
                .attr("r", radius)
                .attr("fill", function (d) {
                    return color(d.group);
                })
                .attr("opacity", 0.1)
            ;

            var nodelabels = node.append("text")
                .text(function (d) {
                    return d.id;
                })
                .attr("text-anchor", "middle")
                .attr("fill", function (d) {
                    return "#111";
                })
                .attr('class', function (d) {
                    var className = "node-text";
                    if (d.type && d.type === 1) {
                        className = className + " bold";
                    }
                    return className;
                })
                .attr('x', function (d) {
                    return 0;
                })
                .attr('y', 3)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));


            node.append("title")
                .text(function (d) {
                    return d.id;
                });

            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(graph.links);

            function ticked() {
                linkLine
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

                linkText.attr("transform", function (d) {
                    var resX = (d.source.x + d.target.x) / 2;
                    var resY = (d.source.y + d.target.y) / 2;

                    return "translate(" + resX + "," + resY + ")";
                });

                node
                    .attr("transform", function (d) {
                        var resX = Math.max(radius, Math.min(domVariables.Width - radius, d.x));
                        var resY = Math.max(radius, Math.min(domVariables.Height - radius, d.y));
                        return "translate(" + resX + "," + resY + ")";
                    })
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
    }

}

init();
