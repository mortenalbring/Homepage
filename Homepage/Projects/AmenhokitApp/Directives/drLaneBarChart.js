var drLaneBarChart = function ($rootScope, $window, $location) {
    return {
        restrict: "EA",
        template: "<div class='graph-control-container'>" +
           "<div class='barchart'>" +
           "</div>",

        link: function (scope, elem, attrs) {
            var d3 = $window.d3;
            var rawSvg = elem.find(".barchart")[0];
            var svg = d3.select(rawSvg);

            var plotData = scope[attrs.chartData];
            var playerAverage = scope[attrs.playerAverage];

            plotData.sort(function (a, b) {
                return parseInt(a.Lane) - parseInt(b.Lane);
            })
            var x = d3.scale.linear()
                .domain([0, d3.max(plotData, function (d) {
                    return d.Average;
                })])
                .range([0, 100]);

            var tooltip = svg.append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var newbar = svg.selectAll("div")
                .data(plotData)
                .enter().append("div")
                .style("width", function(d) { return x(d.Average) + "%"; })
                .attr("class", function(d) {
                    if (d.Average > playerAverage) {
                        return "bar goodlane";
                    }
                    return "bar badlane";
                })
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);

                    var diff = (d.Average - playerAverage);
                    var diffchar = "+";
                    if (diff < 0) {
                        diffchar = "";
                    }

                    tooltip.html("Lane " + d.Lane + "<br>" +
                            "Average score: " + d.Average + " (" + diffchar + diff + ")" + "<br>" +
                            "Games played: " + d.Count)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                }).text(function (d) { return "Lane " + d.Lane + "Average : " + d.Average });

            newbar.append("span").text(function(d) {
                return "Average : " + d.Average
            });

            svg.insert("div", ":first-child")
            .style("width", function () { return x(playerAverage) + "%"; })
            .attr("class", "bar playeraverage")
            .text(function () { return "Player Average : " + playerAverage });

        }
    }

}