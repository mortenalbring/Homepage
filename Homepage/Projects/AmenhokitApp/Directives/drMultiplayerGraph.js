var drMultiplayerGraph = function ($rootScope, $window, $location) {
    return {
        restrict: "EA",
        template: "<div class='graph-control-container'>" +
            "<svg id='graph-container'></svg>" +
            "<br>" +
            "<ul class='graph-button-container'>" +
                "<li ng-class=\"{'button-active' : !selectedPlayer}\"><div ng-click='setSelectedPlayer()'>All Players</li>" +
                "<li ng-repeat='playerName in playerNames' ng-class=\"{'button-active' : selectedPlayer == playerName}\">" +
                    "<div ng-click='setSelectedPlayer(playerName)'>{{playerName | titlecase}}</div>" +
                "</li>" +
            "</ul>" +
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

            scope.selectedGame = 1;
            scope.selectedPlayer = null;
            scope.setSelectedGame = function (game) {
                scope.selectedGame = game;
                drawLineChart();
            }
            scope.setSelectedPlayer = function (player) {
                scope.selectedPlayer = player;
                drawLineChart();
            }


            scope.selected = null;

            var plotData = scope[attrs.chartData];
            var xScale, yScale, xAxisGen, yAxisGen;

            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);
            var elemwidth = svg.style('width');
            elemwidth = 800;


            var margin = { top: 10, right: 50, bottom: 60, left: 35 },
                width = parseInt(elemwidth) - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;


            function setChartParameters(container) {

                var dateArray = plotData.map(function (o) {
                    return o.Date;
                }).sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });

                var minDate = dateArray[0];
                var maxDate = dateArray[dateArray.length - 1];



                xScale = d3.time.scale()
                .domain([minDate, maxDate])
                .range([0, width - 100]);


                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(10);


                var hscore = Math.max.apply(Math, plotData.map(function (o) {
                    return o.Score;
                }));

                var gameNumbers = plotData.map(function (e) {
                    return e.GameNumber;
                }).filter(function (item, i, ar) { return ar.indexOf(item) === i; });;
                var playerNames = plotData.map(function (e) {
                    return e.Name;
                }).filter(function (item, i, ar) { return ar.indexOf(item) === i; });;

                var playerIds = plotData.map(function (e) {
                    return e.Player;
                }).filter(function (item, i, ar) { return ar.indexOf(item) === i; });;

                scope.gameNumbers = gameNumbers;
                scope.playerNames = playerNames;


                yScale = d3.scale.linear()
               .domain([0, hscore])
               .range([height, 0]);

                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

                var isActive = true;

                var points = container.selectAll(".point")
               .data(plotData)
               .enter().append("svg:circle")
               .attr("stroke", "black")
                    .attr("opacity", 0.1)
               .attr("fill", function (d, i) { return getPlayerColor(d.Player); })
               .attr("cx", function (d, i) {
                   var yy = xScale(d.Date);
                   return xScale(d.Date);
               })
               .attr("cy", function (d, i) { return yScale(d.Score) })
               .attr("r", function (d, i) {

                   return 3;
               })
               .on("click", function (d) {
                   var xx = 42;
                   /*
                   $rootScope.$apply(function () {
                       $location.path("/session/" + d.Session);
                   });
                   */

               })
               .on("mouseover", function (d) {
                   $rootScope.$apply(function () {
                       scope.selected = d;
                   });
               });

                var line = d3.svg.line()
              .interpolate("basis")
              .x(function (d) {
                  return xScale(d.Date);
              })
              .y(function (d) {
                  return yScale(d.Average);
              });


                for (var j = 0; j < playerIds.length; j++) {
                    var playerData = plotData.filter(function (e) {
                        return e.Player == playerIds[j];
                    });

                    var playerDates = playerData.map(function (e) {
                        return e.Date;
                    }).filter(function (item, i, ar) { return ar.indexOf(item) === i; }).sort(function (a, b) {
                        return new Date(a) - new Date(b);
                    });

                    var playerAverages = [];

                    for (var k = 0; k < playerDates.length; k++) {
                        var playerDateScores = playerData.filter(function (e) {
                            return e.Date === playerDates[k];
                        }).map(function (f) {
                            return f.Score;
                        });

                        var sum = 0;
                        for (var l = 0; l < playerDateScores.length; l++) {
                            sum = sum + playerDateScores[l];
                        }
                        var average = sum / playerDateScores.length;

                        var obj = {
                            Date: playerDates[k],
                            Average: average
                        };
                        playerAverages.push(obj);

                    }                    

                    container.append("path")
                        .attr("class", "line")
                        .attr("fill", "none")
                        .attr("stroke-width", function () {
                            if (isActive) {
                                return 3;
                            }
                            return 1;
                        })
                        .attr("stroke-opacity", function () {
                            if (isActive) {
                                return 1;
                            }
                            return 0.2;
                        })
                        .attr("stroke", function () { return getPlayerColor(playerIds[j]); })
                        .attr("d", function (d) { return line(playerAverages); });
                }

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