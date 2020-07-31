﻿function init() {
//This is for d3 v5 word chains and generates a static force graph
    $('.simpleWords').each(function (d) {
        var svgId = "#" + this.id;
        initSvgStatic(d3.select(svgId), "simpleWords1p");
    });
    $('.simpleWordsBig').each(function (d) {
        var svgId = "#" + this.id;
        initSvgStatic(d3.select(svgId), "simpleWords1pt");
    });

    initSvgStatic(d3.select("#simpleWords1wc"), "simpleWords1pt");
    
    
    function initSvgStatic(svg, containerId) {

// Use a timeout to allow the rest of the page to load first.
        d3.timeout(function() {
            var domVariables = WordsGeneral.ParseDomVariables(svg, containerId);
            d3.json("/Scripts/Words/Json/" + domVariables.JsonPath).then(function (graph) {

                
                var width = domVariables.Width;
                var height = domVariables.Height;

                var g = svg.append("g");
                WordsGeneral.FilterDataOnGroup(graph, domVariables.Group);

                var nodes = graph.nodes;
                var links = graph.links;
                
                console.log(nodes);
                console.log(links);
                var n = 100;
                var radius = 14;
                var color = d3.scaleLinear()
                    .domain([1, domVariables.MaxGroup])
                    .range(["red", "orange", "yellow", "green", "blue", "indigo", "violet"]);

                var attractForce = d3.forceManyBody().strength(5).distanceMax(400).distanceMin(60);
                var repelForce = d3.forceManyBody().strength(-40).distanceMax(80).distanceMin(10);



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

                simulation
                    .nodes(graph.nodes);

                simulation.force("link")
                    .links(graph.links);

                simulation.stop();


                // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
                for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                    simulation.tick();
                }

                // g.append("g")
                //     .attr("stroke", "#000")
                //     .attr("stroke-width", 1.5)
                //     .selectAll("line")
                //     .data(links)
                //     .enter().append("line")
                //     .attr("x1", function(d) { return d.source.x; })
                //     .attr("y1", function(d) { return d.source.y; })
                //     .attr("x2", function(d) { return d.target.x; })
                //     .attr("y2", function(d) { return d.target.y; });

                var node = g.append("g")
                        .attr("class", "nodes")
                        .selectAll("g")
                    .data(nodes)
                    .enter()
                    .append("g")
                    .attr("class", "node-group")
                ;

                // var node = svg.append("g")
                //     .attr("class", "nodes")
                //     .selectAll("g")
                //     .data(graph.nodes)
                //     .enter()
                //     .append("g")
                //     .attr("class", "node-group")
                //;


                var linkGroup = g.append("g")
                    .attr("class", "links")
                    .selectAll("g")
                    .data(graph.links)
                    .enter()
                    .append("g")
                    
                    .attr("class", "link-group");


                var linkLine = linkGroup.append("line")
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; })
                    .attr("stroke-width", function (d) {
                        return Math.sqrt(d.value);
                    });

                var linkText = linkGroup.append("text")
                    .attr('x', function (d) {
                        return d.x;
                    })
                    .attr('y', function(d) {return d.y})
                    .text(function (d) {
                        if (d.diffChar) {
                            return d.diffChar
                        } else {
                            return "";
                        }
                    });



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
                
                var circles = node.append("circle")
                    .attr("r", function(d) {
                        
                      return d.id.length * 2.5;  
                    } )
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
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
                        return d.x;
                    })
                    .attr('y', function(d) {return d.y})
                    ///.call(d3.drag()
                       // .on("start", dragstarted)
                       // .on("drag", dragged)
                       // .on("end", dragended))
                ;


                node.append("title")
                    .text(function (d) {
                        return d.id;
                    });
            });

        });
        
    }
    
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