var drGraph = function ($rootScope, $window,$location) {
    return {
        restrict: "EA",
        template: "<div class='graph-control-container'>" +
            "<svg id='graph-container'></svg>" +
            "<br>" +
            "<div ng-if='selected'>" +
            "{{selected.ID}} | Score : {{selected.Score}}, Lane: {{selected.Lane}}, Date : {{selected.Date}} " +
            "</div>" +
            "<ul class='graph-button-container'>" +
            "<li>Interpolation</li>" +
                    "<li ng-repeat='interpolateOption in interpolateOptions' ng-class=\"{'button-active' : selectedInterpolate == interpolateOption}\">" +
                    "<div ng-click='setSelectedInterpolation(interpolateOption)'>{{interpolateOption | titlecase}}</div>" +
                "</li>" +
            "</ul>" +
            "</div>",

        link: function (scope, elem, attrs) {

            scope.selected = null;

            scope.selectedInterpolate = 'basis'
            scope.interpolateOptions = ['linear','bundle','cardinal', 'basis','monotone'];

            scope.setSelectedInterpolation = function(interpolation) {
                scope.selectedInterpolate = interpolation;
                drawLineChart();
            }
         
            var plotData = scope[attrs.chartData];
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);

            var elemwidth = svg.style('width');

            var margin = { top: 30, right: 50, bottom: 60, left: 50 },
                width = parseInt(elemwidth) - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            function calculateAverages() {

                var datesList = [];

                for (var i = 0; i < plotData.length; i++) {
                    var indx = datesList.indexOf(plotData[i].Date);
                    if (indx == -1) {
                        datesList.push(plotData[i].Date);
                    }
                }

                var averageData = [];
                for (var j = 0; j < datesList.length; j++) {
                    var matchingDates = plotData.filter(function (e) {
                        return e.Date == datesList[j];
                    });

                    var sum = 0;
                    for (var k = 0; k < matchingDates.length; k++) {
                        sum = sum + matchingDates[k].Score;
                    }
                    var average = sum / matchingDates.length;

                    averageData.push({ Date: datesList[j], AverageScore: average });
                }

                return averageData;
            }

            var averageData = calculateAverages();

            function setChartParameters(container) {
                xScale = d3.time.scale()
                    .domain([plotData[0].Date, plotData[plotData.length - 1].Date])
                    .range([0, width]);


                yScale = d3.scale.linear()
                    .domain([
                        0, d3.max(plotData, function (d) {
                            return d.Score;
                        })
                    ])
                    .range([height, 0]);

                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5);

                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

                lineFun = d3.svg.line()
                    .x(function (d) {
                        return xScale(d.Date);
                    })
                    .y(function (d) {
                        return yScale(d.AverageScore);
                    })
                    .interpolate(scope.selectedInterpolate);

                var points = container.selectAll(".point")
                    .data(plotData)
                    .enter().append("svg:circle")
                    .attr("stroke", "black")
                    //.attr("fill", function(d, i) { return "blue" })
                    .attr("cx", function (d, i) { return xScale(d.Date) })
                    .attr("cy", function (d, i) { return yScale(d.Score) })
                    .attr("class", "data-circle")
                    .attr("r", function (d, i) { return 4 })
                    .on("click", function(d) {
                        var xx = 42;
                        $rootScope.$apply(function() {
                            $location.path("/session/" + d.Session);
                        });

                    })
                    .on("mouseover", function (d) {
                        $rootScope.$apply(function () {
                            scope.selected = d;
                        });
                    });;
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

                container.append("path")
                    .attr({
                        d: lineFun(averageData),
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    })
                    .attr("opacity", "1")
                    .attr("stroke", "blue")                

                
                ;
            }

            drawLineChart();

        }
    }
};