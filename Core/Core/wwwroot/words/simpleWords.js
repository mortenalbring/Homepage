ConnectedNodes = [];


function init() {
//This is for d3 v5 word chains and generates a static force graph
    $('.simpleWords').each(function (d) {
        var svgId = "#" + this.id;
        initSvgStatic(d3.select(svgId), "simpleWords1p");
    });
    $('.simpleWordsBig').each(function (d) {
        var svgId = "#" + this.id;
        initSvgStatic(d3.select(svgId), "simpleWords1pt");
    });

    $('#childNext').on('click', function () {

        var svgId = "#simpleWorldsNChildren1";
        var jsonfolder = $(svgId).attr("jsonfolder");
        var current = parseInt($(svgId).attr("jsoncurrent"));
        var maxJson = parseInt($(svgId).attr("jsonmax"));
        var nextJson = current + 1;
        if (nextJson > maxJson) {
            nextJson = 1;
        }
        var nextJsonFile = jsonfolder + "\\children" + nextJson + ".json";
        
        var linkDist = 100 - 15*nextJson;
        if (linkDist < 0) {
            linkDist = 10;
        }
        
        
        var buttonText = "Generation " + nextJson;
        $('#childNextText').text(buttonText);

        $(svgId).attr("json", nextJsonFile);
        $(svgId).attr("jsoncurrent", nextJson);
        $(svgId).attr("linkdistance", linkDist);

        d3.selectAll(svgId + " > *").remove();

        initSvgStatic(d3.select(svgId), "simpleWords1pt");
    })

    initSvgStatic(d3.select("#simpleWords1wc"), "simpleWords1pt");
    initSvgStatic(d3.select("#simpleWords2wc"), "simpleWords1pt");

    initSvgStatic(d3.select("#simpleWords1no"), "simpleWords1ptno");
    initSvgStatic(d3.select("#wordChainLongEnglish"), "simpleWords1pt");

    function initSvgStatic(svg, containerId) {

        function GetColours(graph, domVariables, maxGroup) {
            var maxNodeLength = 0;
            var minNodeLength = 999;
            for (let i = 0; i < graph.nodes.length; i++) {
                var n = graph.nodes[i];
                if (n.id.length > maxNodeLength) {
                    maxNodeLength = n.id.length;
                }
                if (n.id.length < minNodeLength) {
                    minNodeLength = n.id.length;
                }

            }

            var nodeColor = d3.scaleLinear()
                .domain([1, maxGroup])
                .range(["red", "blue", "green"]);

            if (domVariables.ColorStyle == 1) {
                nodeColor = d3.scaleLinear()
                    .domain([minNodeLength, maxNodeLength])
                    .range(["red", "orange", "yellow"]);
            }

            var linksColor = d3.scaleLinear()
                .domain([minNodeLength, maxNodeLength])
                .range(["red", "blue", "green"]);

            var output = [nodeColor, linksColor];

            return output;

        }

        function PutNodes(g, graph, lines, nodes, color, domVariables) {

            var defaultNodeCircleOpacity = 0.6;

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

                    if (domVariables.ColorStyle === 1) {
                        return color(d.id.length);
                    }
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

            nodeGroup.on('mouseover', function (event, d) {


            })
            nodeGroup.on('mouseout', function (d) {

            })

            return nodeGroup;
        }

        function PutLinks(g, graph, color) {
            //Group containing link line and link text
            var linkGroup = g.append("g")
                .attr("class", "links")
                .selectAll("g")
                .data(graph.links)
                .enter()
                .append("g")
                .attr("class", "link-group");


            linkGroup.append("title").text(function (d) {
                var snode;
                var tnode;
                for (let i = 0; i < graph.nodes.length; i++) {
                    if (d.source.id == graph.nodes[i].id) {
                        snode = graph.nodes[i].id;
                    }
                    if (d.target.id == graph.nodes[i].id) {
                        tnode = graph.nodes[i].id;
                    }
                }
                if (snode && tnode) {
                    return snode + " [" + d.diffChar + "] " + tnode;
                }
                return "";
            })

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
                .attr("stroke-opacity", function (d) {
                    return 0.2;
                })
                .attr("stroke-width", function (d) {
                    return 10;
                })
                .attr("stroke", function (d) {
                    var snode;
                    var tnode;
                    for (let i = 0; i < graph.nodes.length; i++) {
                        if (d.source.id == graph.nodes[i].id) {
                            snode = graph.nodes[i].id;
                        }
                        if (d.target.id == graph.nodes[i].id) {
                            tnode = graph.nodes[i].id;
                        }
                    }

                    if (snode && tnode) {
                        var smallest = snode.length;
                        if (tnode.length < snode.length) {
                            smallest = tnode.length;
                        }
                        var lendiff = snode.length - tnode.length;
                        if (lendiff < 0) {
                            lendiff = lendiff * -1;
                        }
                        return color(smallest + lendiff);
                    }

                    return "green"
                })

            ;

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
            d3.json("/words/Json/" + domVariables.JsonPath).then(function (graph) {


                var width = domVariables.Width;
                var height = domVariables.Height;

             

                var g = svg.append("g");
                WordsGeneral.FilterDataOnGroup(graph, domVariables.Group);

                var nodes = graph.nodes;
                var maxGroup = 0;
                for (let i = 0; i < nodes.length; i++) {
                    var group = nodes[i].group;
                    if (group > maxGroup) {
                        maxGroup = group;
                    }
                }

                var centreGroupX = WordsGeneral.MakeCenterGroup(50, domVariables.Width - 50, maxGroup, 100);
                var centreGroupY = WordsGeneral.MakeCenterGroup(50, domVariables.Height - 50, maxGroup, 50);


                var colours = GetColours(graph, domVariables, maxGroup);
                var nodeColor = colours[0];
                var linksColor = colours[1];


           

                var attractForce = d3.forceManyBody()
                    .strength(domVariables.AttractForce.Strength)
                    .distanceMax(domVariables.AttractForce.DistanceMax)
                    .distanceMin(domVariables.AttractForce.DistanceMin);
                var repelForce = d3.forceManyBody()
                    .strength(domVariables.RepelForce.Strength)
                    .distanceMax(domVariables.RepelForce.DistanceMax)
                    .distanceMin(domVariables.RepelForce.DistanceMin);

                var simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().id(function (d) {
                        return d.id;
                    }).distance(domVariables.LinkDistance).iterations(1))
                    .force("charge", d3.forceManyBody().strength(domVariables.Charge))
                    .force('center', d3.forceCenter(width / 2, height / 2).strength(1.5))
                    .force("attractForce", attractForce)
                    .force("repelForce", repelForce)
                    .force('collision', d3.forceCollide().radius(function (d) {
                        return d.id.length * 2.9
                    }))

                ;
                if (domVariables.UseForceYByHeight) {
                    simulation.force('y', d3.forceY().y(function (d) {
                        return d.id.length * 2;
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
                    .nodes(graph.nodes);

                simulation.force("link")
                    .links(graph.links);

                simulation.stop();


                // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
                for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                    simulation.tick();
                }

                var lines = PutLinks(g, graph, linksColor);

                var nodeGroups = PutNodes(g, graph, lines, nodes, nodeColor, domVariables);
                // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
                for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                    simulation.tick();


                }
            });

        });

    }
}

init();
