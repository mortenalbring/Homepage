


function init() {
    
  
    
    initSvgStatic(d3.select("#simpleWords2wd"), "simpleWords1pt");

    function initSvgStatic(svg, containerId) {

        function PutNodes(g, graph, lines, nodes, color) {

            var defaultNodeCircleOpacity = 0.2;

            //Group containing circle and text
            var nodeGroup = g.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node-group")
            ;

            //Circles around nodes
            var nodeCircles = nodeGroup.append("circle")
                .attr("r", function (d) {
                    return d.id.length * 3;
                })
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("fill", function (d) {
                    return color(d.group);
                })
                .attr("opacity", defaultNodeCircleOpacity)
            ;

            //Node text labels
            nodeGroup.append("text")
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
                    return d.x;
                })
                .attr('y', function (d) {
                    return d.y
                })
            ///.call(d3.drag()
            // .on("start", dragstarted)
            // .on("drag", dragged)
            // .on("end", dragended))
            ;


            nodeGroup.append("title")
                .text(function (d) {
                    return "[" + d.group + "] " + d.id;
                });

            nodeGroup.on('mouseover', function (d) {
                var nodeIds = [];
                nodeIds.push(d.id);
                lines.attr('stroke-width', function (ld) {

                    if (ld.source.id === d.id) {
                        nodeIds.push(ld.target.id);

                        return 20;
                    }
                    if (ld.target.id === d.id) {
                        nodeIds.push(ld.source.id);

                        return 20;
                    }
                    return 10;

                });

                nodeCircles.attr('opacity', function (dd) {
                    if (nodeIds.includes(dd.id)) {
                        return 0.5;
                    }

                    return defaultNodeCircleOpacity;
                })


            })
            nodeGroup.on('mouseout', function (d) {
                lines.attr('stroke-width', function (ld) {
                    return 10;
                });

                nodeCircles.attr('fill', function (dd) {
                    return color(dd.group);
                })

                nodeCircles.attr('opacity', function (dd) {
                    return defaultNodeCircleOpacity;
                })

            })
        }

        function PutLinks(g, graph) {
            console.log("putlinks " + graph.links.length);
            //Group containing link line and link text
            var linkGroup = g.append("g")
                .attr("class", "links")
                .selectAll("g")
                .data(graph.links)
                .enter()
                .append("g")

                .attr("class", "link-group");


            //Lines connecting nodes
            var lines = linkGroup.append("line")
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
                })
                .attr("stroke-width", function (d) {
                    return 10;
                });

            //Tiny text along link lines
            linkGroup.append("text")
                .attr('x', function (d) {
                    return d.x;
                })
                .attr('y', function (d) {
                    return d.y
                })
                .attr("transform", function (d) {
                    var resX = (d.source.x + d.target.x) / 2;
                    var resY = (d.source.y + d.target.y) / 2;

                    return "translate(" + resX + "," + resY + ")";
                })
                .text(function (d) {
                    if (d.diffChar) {
                        return d.diffChar
                    } else {
                        return "";
                    }
                });

            return lines;
        }

// Use a timeout to allow the rest of the page to load first.
        d3.timeout(function () {
            var domVariables = WordsGeneral.ParseDomVariables(svg, containerId);
            if (domVariables == null) {
                return;
            }
            console.log("calling d3 json.." + domVariables.JsonPath);
            
            d3.json("/words/Json/" + domVariables.JsonPath).then(function (jsonData) {
                console.log("d3 json recieved!");

                
                var origData = jsonData;
                

                $('#btnSearchWord').click(function() {
                    svg.selectAll("*").remove();
                    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                        simulation.tick();
                    }
                    simulation.restart();
                    
                    var newterm = "test";
                    var newGraph = WordsGeneral.FilterDataOnTerm(origData, newterm);
                    
                    console.log("click!")
                    console.log(newGraph);
                    drawGraph(newGraph);
                })
                
                var centreGroupX = WordsGeneral.MakeCenterGroup(50, domVariables.Width - 50, domVariables.MaxGroup, 100);
                var centreGroupY = WordsGeneral.MakeCenterGroup(50, domVariables.Height - 50, domVariables.MaxGroup, 50);


                
                var graphData = WordsGeneral.FilterDataOnTerm(origData, "test");

                console.log(graphData);
                
                var simulation;

                function drawGraph(graphData) {

                    var g = svg.append("g");
                    var nodes = graphData.nodes;
                    var links = graphData.links;

                    console.log("drawGraph links length: " +links.length);


                    var maxval = Math.max.apply(Math, nodes.map(function(o) { return o.group; }))
                    var minval = Math.min.apply(Math, nodes.map(function(o) { return o.group; }))


                    var color = d3.scaleLinear()
                        .domain([minval, maxval])
                        .range(["red", "blue", "green"]);

                    var attractForce = d3.forceManyBody()
                        .strength(domVariables.AttractForce.Strength)
                        .distanceMax(domVariables.AttractForce.DistanceMax)
                        .distanceMin(domVariables.AttractForce.DistanceMin);
                    var repelForce = d3.forceManyBody()
                        .strength(domVariables.RepelForce.Strength)
                        .distanceMax(domVariables.RepelForce.DistanceMax)
                        .distanceMin(domVariables.RepelForce.DistanceMin);
                    
                    
                    simulation = d3.forceSimulation()
                        .force("link", d3.forceLink().id(function (d) {
                            return d.id;
                        }).distance(domVariables.LinkDistance).iterations(1))
                        .force("charge", d3.forceManyBody().strength(domVariables.Charge))
                        .force('center', d3.forceCenter().x((domVariables.Width / 2)).y((domVariables.Height / 2)))
                        .force("attractForce", attractForce)
                        .force("repelForce", repelForce)
                        .force('collision', d3.forceCollide().radius(function (d) {
                            return d.id.length * 2.9
                        }))

                    ;
                    if (domVariables.UseForceYByHeight) {
                        simulation.force('y', d3.forceY().y(function (d) {
                            return domVariables.Height / 2
                        }))
                    }
                    if (domVariables.UseForceYByGroup) {
                        simulation.force('y', d3.forceY().y(function (d) {
                            return centreGroupY[d.group]
                        }))
                    }

                    if (domVariables.UseForceXByGroup) {
                        simulation.force('x', d3.forceX().x(function (d) {
                            return centreGroupX[d.group];
                        }));
                    }

                    simulation
                        .nodes(graphData.nodes);

                    simulation.force("link")
                        .links(graphData.links);

                    simulation.stop();


                    // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
                    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                        simulation.tick();
                    }

                    var lines = PutLinks(g, graphData);

                    PutNodes(g, graphData, lines, nodes, color);
                }

                
                drawGraph(graphData);
            });

        });

    }
}

init();