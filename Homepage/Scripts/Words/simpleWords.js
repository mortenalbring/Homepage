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

    initSvgStatic(d3.select("#simpleWords1wc"), "simpleWords1pt");
    
    
    function initSvgStatic(svg, containerId) {

// Use a timeout to allow the rest of the page to load first.
        d3.timeout(function() {
            var domVars = WordsGeneral.ParseDomVariables(svg, containerId);
            d3.json("/Scripts/Words/Json/" + domVars.JsonPath).then(function (graph) {

                
                var width = domVars.Width;
                var height = domVars.Height;

                var g = svg.append("g");
                WordsGeneral.FilterDataOnGroup(graph, domVars.Group);

                var nodes = graph.nodes;
                var links = graph.links;
                
                console.log(nodes);
                console.log(links);
                var n = 100;
                var radius = 14;
                var color = d3.scaleLinear()
                    .domain([1, domVars.MaxGroup])
                    .range(["red", "orange", "yellow", "green", "blue", "indigo", "violet"]);

                var attractForce = d3.forceManyBody()
                    .strength(domVars.AttractForce.Strength)
                    .distanceMax(domVars.AttractForce.DistanceMax)
                    .distanceMin(domVars.AttractForce.DistanceMin);

                var repelForce = d3.forceManyBody()
                    .strength(domVars.RepelForce.Strength)
                    .distanceMax(domVars.RepelForce.DistanceMax)
                    .distanceMin(domVars.RepelForce.DistanceMin);


                //var repelForce = d3.forceManyBody().strength(-40).distanceMax(80).distanceMin(10);



                var simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().id(function (d) {
                        return d.id;
                    }).distance(domVars.LinkDistance).iterations(1))
                    .force("charge", d3.forceManyBody().strength(-80))
                    //        .force('y', forceY)
                    .force("center", d3.forceCenter(domVars.Width / 2, domVars.Height / 2))
                    
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
                nodeGroup.append("circle")
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
                    .attr('y', function(d) {return d.y})
                ///.call(d3.drag()
                // .on("start", dragstarted)
                // .on("drag", dragged)
                // .on("end", dragended))
                ;


                nodeGroup.append("title")
                    .text(function (d) {
                        return d.id;
                    });

                //Group containing link line and link text
                var linkGroup = g.append("g")
                    .attr("class", "links")
                    .selectAll("g")
                    .data(graph.links)
                    .enter()
                    .append("g")
                    
                    .attr("class", "link-group");


                //Lines connecting nodes
                linkGroup.append("line")
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; })
                    .attr("stroke-width", function (d) {
                        return Math.sqrt(d.value);
                    });

                //Tiny text along link lines
                linkGroup.append("text")
                    .attr('x', function (d) {
                        return d.x;
                    })
                    .attr('y', function(d) {return d.y})
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

                
            });

        });
        
    }
}

init();
