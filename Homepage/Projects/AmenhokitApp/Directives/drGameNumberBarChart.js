var drGameNumberBarChart = function ($rootScope, $window, $location) {
    return {
        restrict: "EA",
        template: "<div class='graph-control-container full-height'>" +
           "<ul class='graph-button-container'>" +
           "<li ng-class=\"{'button-active' : sortprop == 'gamenumber'}\" ng-click=sortBy('gamenumber',true)>Sort by game number</li>" +
           "<li ng-class=\"{'button-active' : sortprop == 'average'}\" ng-click=sortBy('average',true)>Sort by score</li>" +
           "<li ng-class=\"{'button-active' : sortprop == 'count'}\" ng-click=sortBy('count',true)>Sort by play count</li>" +
           "</ul>" +
            "<div class='barchart-gamenumber'>" +
           "</div>" +
           "</div>",

        link: function (scope, elem, attrs) {

            scope.sortBy = function (prop, redraw) {
                scope.sortprop = prop;
                if (prop == 'gamenumber') {
                    plotData.sort(function (a, b) {
                        return parseInt(a.GameNumber) - parseInt(b.GameNumber);
                    });
                }
                if (prop == 'average') {
                    plotData.sort(function (a, b) {
                        return parseInt(a.Average) - parseInt(b.Average);
                    });

                }
                if (prop == 'count') {
                    plotData.sort(function (a, b) {
                        return parseInt(a.Count) - parseInt(b.Count);
                    });

                }
                if (redraw) {
                    drawBarChart();
                }



            }

            var d3 = $window.d3;
            var rawSvg = elem.find(".barchart-gamenumber")[0];
            var svg = d3.select(rawSvg);

            var elemheight = svg.style('height');


            var plotData = scope[attrs.chartData];
            var playerAverage = scope[attrs.playerAverage];

            scope.sortBy('gamenumber', false);

            var x = d3.scale.linear()
                .domain([0, d3.max(plotData, function (d) {
                    return d.Average;
                })])
                .range([0, 100]);

            var colorscale = d3.scale.linear()
                .domain([
                    d3.min(plotData, function (d) {
                        return d.Average;
                    }),
                    playerAverage,
                    d3.max(plotData, function (d) {
                        return d.Average;
                    })
                ])
                .range(["rgb(228,26,28)", "rgb(55,126,184)", "rgb(77,175,74)"]);

            function drawBarChart() {
                svg.selectAll("*").remove();

                var newbar = svg.selectAll("div")
                    .data(plotData)
                    .enter().append("div")
                    .attr("class","gamenumber-bar")
                    .style("background-color", function(d) {                        
                        return colorscale(d.Average);
                    });
           

                newbar.style("height", "10%")
                    .transition()
                    .duration(1000)
                    .ease('bounce')
                    .style("height", function (d) { return x(d.Average) + "%"; });                

                newbar.on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);

                    var diff = (d.Average - playerAverage);
                    var diffchar = "+";
                    if (diff < 0) {
                        diffchar = "";
                    }

                    tooltip.html("Game " + d.GameNumber + "<br>" +
                            "Average score: " + d.Average + " (" + diffchar + diff + ")" + "<br>" +
                            "Games played: " + d.Count)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

                newbar.append("div")
                    .attr("class", "gamenumber-info")
                    .text(function (d) {
                        return "Game " + d.GameNumber;
                    });
                newbar.append("div")
                    .attr("class", "gamenumber-info")
                    .text(function (d) {
                        return "Average : " + d.Average;
                    });


                /*
                svg.insert("div", ":first-child")
                .style("height", function () { return x(playerAverage) + "%"; })
                    .style("background-color", function () { return colorscale(playerAverage) })
                .attr("class", "bar playeraverage")
                .text(function () { return "Player Average : " + playerAverage });
                */

                var tooltip = svg.append("div")
                 .attr("class", "tooltip")
                 .style("opacity", 0);
            }

            drawBarChart();




        }
    }

}