var drMultiLineGraph = function ($rootScope, $window, $location) {
    return {
        restrict: "EA",
        template: "<svg id='graph-container'></svg>" +
            "<br>" +
            "<button ng-click='setSelectedGame(1)'>Game 1</button>" +
            "<button ng-click='setSelectedGame(2)'>Game 2</button>" +
            "<button ng-click='setSelectedGame(3)'>Game 3</button>" +
            "<div ng-if='selected'>" +
            "{{selected.ID}} | Score : {{selected.Score}}, Lane: {{selected.Lane}}, Date : {{selected.Date}} " +
            "</div>",

        link: function (scope, elem, attrs) {
            function getPlayerColor(player) {
                switch (player) {
                    case 1:
                        //Bern
                        return "blue";
                    case 2:
                        //Mort
                        return "red";                        
                    case 3:
                        //George
                        return "hotpink";                        
                    case 4:
                        //Simon
                        return "green";                        
                    case 5:
                        //Tom 
                        return "orange";
                    case 7:
                        //Seona
                        return "black";
                    default:
                        return "grey";
                }
            }
            
            scope.selectedGame = null;
            scope.setSelectedGame = function(game) {
                var xx = 42;
                scope.selectedGame = game;
                drawLineChart();
            }

            scope.selected = null;

            var plotData = scope[attrs.chartData];
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen;

            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);

            var margin = { top: 30, right: 50, bottom: 60, left: 50 },
                width = 600 - margin.left - margin.right,
                height = 270 - margin.top - margin.bottom;

      
            function setChartParameters(container) {
                xScale = d3.scale.linear()
                    .domain([1, 10])
                    .range([0, width]);


           

                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(10);

                
                var hscore = Math.max.apply(Math, plotData.map(function (o) {
                    return Math.max.apply(Math, o.FrameArray.map(function(e) {
                        return e.Cumulative;
                    }));                    
                }));

                yScale = d3.scale.linear()
               .domain([0, hscore])
               .range([height, 0]);

                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);



                for (var j = 0; j < plotData.length; j++) {
                    if (scope.selectedGame) {
                        if (plotData[j].GameNumber !== scope.selectedGame) {
                            continue;
                        }
                    }
                    var frameArray = plotData[j].FrameArray;
                  
                    var player = plotData[j].Player;                    

                    var line = d3.svg.line()
                        .interpolate("basis")                        
                        .x(function(d) { return xScale(d.Frame) })
                        .y(function (d) { return yScale(d.Cumulative) });
                    container.append("path")
                        .attr("class", "line")
                        .attr("fill", "none")
                        .attr("stroke-width", 2)
                        .attr("stroke", function () {return getPlayerColor(player);} )
                        .attr("d", function(d) { return line(frameArray); });

                    var points = container.selectAll(".point")
                   .data(frameArray)
                   .enter().append("svg:circle")
                   .attr("stroke", "black")
                   .attr("fill", function (d, i) { return getPlayerColor(player); })
                   .attr("cx", function (d, i) { return xScale(d.Frame) })
                   .attr("cy", function (d, i) { return yScale(d.Cumulative) })                   
                   .attr("r", function (d, i) { return 3 })
                   .on("click", function (d) {
                       var xx = 42;
                       $rootScope.$apply(function () {
                           $location.path("/session/" + d.Session);
                       });

                   })
                   .on("mouseover", function (d) {
                       $rootScope.$apply(function () {
                           scope.selected = d;
                       });
                   });;
                }
                
                /*
                var points = container.selectAll(".point")
                    .data(plotData)
                    .enter().append("svg:circle")
                    .attr("stroke", "black")
                    //.attr("fill", function(d, i) { return "blue" })
                    .attr("cx", function (d, i) { return xScale(d.Date) })
                    .attr("cy", function (d, i) { return yScale(d.Score) })
                    .attr("class", "data-circle")
                    .attr("r", function (d, i) { return 3 })
                    .on("click", function (d) {
                        var xx = 42;
                        $rootScope.$apply(function () {
                            $location.path("/session/" + d.Session);
                        });

                    })
                    .on("mouseover", function (d) {
                        $rootScope.$apply(function () {
                            scope.selected = d;
                        });
                    });;
                    */
            }


            function drawLineChart() {
                svg.selectAll("*").remove();
                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                var container = svg.append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                setChartParameters(container);

                container.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxisGen);

                container.append("g")
                    .attr("class", "y axis")
                    //.attr("transform", "translate(0," + -1 * margin.bottom  + ")")
                    .call(yAxisGen);                               
            }

            drawLineChart();

        }
    }
};