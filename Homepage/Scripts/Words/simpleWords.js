function init() {
    var elemsvg = d3.select("svg"),
        elemgroup = +svg.attr("group"),
        elemwidth = +svg.attr("width"),
        elemheight = +svg.attr("height");
    
    
    
    
    function initSvg(svg,group,width,height) {

        console.log(group);

        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var forceY = d3.forceY(function(d) {    var fx = d.group * 2;    return fx;}).strength(1);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(20).iterations(1))
            .force("charge", d3.forceManyBody().distanceMax(40).strength(-40))
            // .force('y', forceY)
            .force("center", d3.forceCenter(width / 2, height / 2));

        var radius = 5;

        d3.json("/Scripts/Words/wordSet1.json", function(error, graph) {
            if (error) throw error;


            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter().append("g");

            var circles = node.append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return color(d.group); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            var lables = node.append("text")
                .text(function(d) {
                    return d.id;
                })
                .attr('x', 6)
                .attr('y', 3);

            node.append("title")
                .text(function(d) { return d.id; });

            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(graph.links);

            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("transform", function(d) {
                        var resX = Math.max(radius, Math.min(width - radius,d.x));
                        var resY = Math.max(radius, Math.min(height - radius,d.y));
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
