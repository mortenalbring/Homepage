function init() {
  
 
    initSvg("simpleWordDataEnglish.json", d3.select("#simpleWords1a"), "simpleWords1p");
    initSvg("simpleWordDataEnglish.json",d3.select("#simpleWords1b"), "simpleWords1p");
    initSvg("simpleWordDataEnglish.json",d3.select("#simpleWords1c"), "simpleWords1p");
    initSvg("simpleWordDataEnglish.json",d3.select("#simpleWords1d"), "simpleWords1p");
    initSvg("simpleWordDataEnglish.json",d3.select("#simpleWords1e"), "simpleWords1p");
    initSvg("simpleWordDataEnglish.json",d3.select("#simpleWords1t"), "simpleWords1pt");

    initSvg("simpleWordDataNorsk.json",d3.select("#simpleWordsnorsk"), "simpleWords1pt");


    function getDiffCharacter(source, target) {
        var diffChar = "";
        for (var oo = 0; oo < source.length; oo++) {
            var charats = source.charAt(oo);
            if (oo < target.length) {
                var charatt = target.charAt(oo);
                if (charats != charatt) {
                    diffChar = charats;
                    break;
                }
            } else {
                diffChar = charats;
            }
        }
       
        return diffChar;
    }

    function filterDataOnGroup(graph, group) {
        var filteredNodes = [];
        for (var i = 0; i < graph.nodes.length; i++) {
            var n = graph.nodes[i];
             
            if (n.group === group || group === -1) {
                var exists = false;
                for (var b = 0; b < filteredNodes.length ; b++) {
                    if (filteredNodes[b].id === n.id) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    filteredNodes.push(n);    
                }
            }
        }
        graph.nodes = filteredNodes;
        var filteredLinks = [];
        for (var j = 0; j < graph.links.length; j++) {
            var searchLink = graph.links[j];
            var source = searchLink.source;
            var target = searchLink.target;

            var founds = false;
            var foundt = false;
            for (var l = 0; l < graph.nodes.length; l++) {
                var searchNode = graph.nodes[l];
                if (searchNode.id === source) {
                    founds = true;
                }
                if (searchNode.id === target) {
                    foundt = true;
                }
            }
            if (founds && foundt) {

                var diffChar = getDiffCharacter(source, target);

                console.log(source + " " + target + " " + diffChar);
                searchLink.diffChar = diffChar;
                filteredLinks.push(searchLink);
            }
        }
        graph.links = filteredLinks;
    }

    function initSvg(jsonPath,svg, containerId) {
        var parentElement = document.getElementById(containerId);

        var parentWidth = parentElement.clientWidth;
        var pheight = parentElement.clientHeight;
        

        var group = parseInt(svg.attr("group"));
        var height = svg.attr("height");
        var width = svg.attr("width");
        if (width > parentWidth) {
            width = parentWidth;
            svg.attr("width", width);
        }

        //var color = d3.scaleSequential().domain([1,10])(d3.schemeCategory20);
        //var color = d3.scaleSequential(d3.schemeCategory20);
        var color = d3.scaleLinear()
            .domain([1, 36])
            .range(["red", "orange", "green", "blue", "violet"]);

        var attractForce = d3.forceManyBody().strength(50).distanceMax(400).distanceMin(60);
        var repelForce = d3.forceManyBody().strength(-200).distanceMax(100).distanceMin(10);

        var forceY = d3.forceY(height / 2).strength(0.85);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }).distance(40).iterations(1))
            .force("charge", d3.forceManyBody().strength(-30))
            //   .force('y', forceY)
            .force("center", d3.forceCenter(width / 2, height / 2))
    .force("attractForce",attractForce)
            .force("repelForce",repelForce)
        ;
   
        var radius = 15;

        d3.json("/Scripts/Words/" + jsonPath).then(function(graph) {
           
            filterDataOnGroup(graph, group);

            var linkGroup = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter()
                .append("g")
                .attr("class","link-group");
            
             
            var linkLine = linkGroup.append("line")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

           var linkText = linkGroup.append("text")
                .text(function(d) {
                    if (d.diffChar) {
                        return d.diffChar
                    }
                    else {
                        return "";
                    }
                });
           
            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter()
                .append("g")
                .attr("class","node-group")
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
                .attr("text-anchor","middle")
                .attr("fill", function (d) {
                    return color(d.group);
                })
                .attr('class',function(d) {
                    var className = "node-text";
                    if (d.type && d.type === 1) {
                        className = className + " bold";
                    }
                    return className;
                })
                .attr('x', function(d) {
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

                linkText.attr("transform", function(d) {
                    var resX = (d.source.x + d.target.x) /2;
                    var resY = (d.source.y + d.target.y) /2;

                    return "translate(" + resX + "," + resY + ")";
                });

                node
                    .attr("transform", function (d) {
                        var resX = Math.max(radius, Math.min(width - radius, d.x));
                        var resY = Math.max(radius, Math.min(height - radius, d.y));
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
