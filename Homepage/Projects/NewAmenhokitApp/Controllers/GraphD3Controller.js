var GraphD3Controller = function () {
    GraphD3Controller.$inject = [
        "$rootScope", "$scope", "$state", "$window", "$timeout", "DataService", "BowlingService"
    ];

    function GraphD3Controller($rootScope, $scope, $state, $window, $timeout, DataService, BowlingService) {

        this.dataService = DataService;

        this.svg = d3.select("#graph");
        this.margin = { top: 20, right: 80, bottom: 50, left: 50 };

        this.width = this.svg.attr("width") - this.margin.left - this.margin.right;
        this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;
        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


        this.parseTime = d3.timeParse("%Y%m%d");

        this.x = d3.scaleTime().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);
        this.z = d3.scaleOrdinal(d3.schemeCategory10);

        this.tooltip = d3.select("#graph-container").append("div").attr("class", "tooltip").style("opacity", 0);

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.score); });

        this.selectedSeries = null;

        this.data = null;

        var self = this;

        this.allScoreFile = "/Content/datafiles/linechartdata2.txt";
        this.bestScoreFile = "/Content/datafiles/linechartdataall.txt";

        this.loadFileAndDraw(this.bestScoreFile);
         
    }

    GraphD3Controller.prototype.loadFileAndDraw = function (file) {
        var self = this;
        d3.tsv(file, type, function (error, data) {
            if (error) throw error;
            self.data = data;
            self.renderChart(data);
        });

        function type(d, _, columns) {
            d.date = self.parseTime(d.date);
            for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
        }
    }
 


    GraphD3Controller.prototype.setAllScoreFile = function() {
        this.clearChart();
        this.loadFileAndDraw(this.allScoreFile);
    }
    GraphD3Controller.prototype.setBestScoreFile = function () {
        this.clearChart();
        this.loadFileAndDraw(this.bestScoreFile);
    }

    GraphD3Controller.prototype.clearChart = function () {
        var self = this;

        self.g.remove();

        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    }
    GraphD3Controller.prototype.setSelectedSeries = function (series) {
        if (this.selectedSeries === series) {
            this.selectedSeries = null;
        } else {
            this.selectedSeries = series;
        }
        this.clearChart();
        this.renderChart(this.data);

    }
 
    GraphD3Controller.prototype.renderChart = function (data) {
        var self = this;

        function makeXGridlines() {
            return d3.axisBottom(self.x)
                .ticks(15);
        }

        function makeYGridlines() {
            return d3.axisLeft(self.y)
                .ticks(15);
        }

        function leastSquares(xSeries, ySeries) {
            var reduceSumFunc = function (prev, cur) { return prev + cur; };

            var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
            var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

            var ssXX = xSeries.map(function (d) { return Math.pow(d - xBar, 2); })
                .reduce(reduceSumFunc);

            var ssYY = ySeries.map(function (d) { return Math.pow(d - yBar, 2); })
                .reduce(reduceSumFunc);

            var ssXY = xSeries.map(function (d, i) { return (d - xBar) * (ySeries[i] - yBar); })
                .reduce(reduceSumFunc);

            var slope = ssXY / ssXX;
            var intercept = yBar - (xBar * slope);
            var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

            return [slope, intercept, rSquare];
        }

        var seriesNames = d3.keys(data[0])
            .filter(function (d) { return d !== "date"; })
            .sort();
        var series = seriesNames.map(function (series) {
            return data.map(function (d) {
                return { series: series, date: d.date, score: d[series] };
            }).filter(function (v) {
                return v.score > 0;
            });
        });

        var trendLines = [];

        for (var j = 0; j < series.length; j++) {
            var seriesData = series[j];
            var xSeries = [];
            var ySeries = [];
            for (var k = 0; k < seriesData.length; k++) {
                var d = seriesData[k];
                xSeries.push(k);
                ySeries.push(d.score);
            }           

            var leastSquaresCoeff = leastSquares(xSeries, ySeries);

            var x1 = seriesData[0].date;
            var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
            var x2 = seriesData[seriesData.length-1].date;
            var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
            var seriesName = seriesData[0].series;

            var trendData = [[x1, y1, x2, y2, seriesName]];

            trendLines.push(trendData);

         
        }

       
        self.x.domain(d3.extent(d3.merge(series), function (d) { return d.date; })).nice();
        self.y.domain(d3.extent(d3.merge(series), function (d) { return d.score; })).nice();

        self.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + self.height + ")")
            .call(d3.axisBottom(self.x));

        self.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(self.y));


        // add the X gridlines
        self.g.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + self.height + ")")

            .call(makeXGridlines()
                .tickSize(-self.height)
                .tickFormat("")
            );

        // add the Y gridlines
        self.g.append("g")
            .attr("class", "grid")
            .call(makeYGridlines()
                .tickSize(-self.width)
                .tickFormat("")
            );

        self.g.selectAll(".legend")
            .data(seriesNames)
            .enter()    
            .append("text")
            .attr("y", function (d, i) {return (i * 20) + 20;})
          
            .attr("x", 20)
            .attr("class", "legend")
            .style("fill", function (d, i) { return self.z(i) })
            .on("click", function (d) {self.setSelectedSeries(d);})
            .text(function (d) {
                if (self.selectedSeries && self.selectedSeries === d) {
                    return d + "*";
                }
                return d;
            });

        self.g.selectAll(".trendlines")
            .data(trendLines)
            .enter()
            .append("g")
            .style("stroke", function (d, i) { return self.z(i) })
            .selectAll('.trendline')
            .data(function (d) { return d; })
            .enter()
            .append("line")
            .attr("x1", function (d) { return self.x(d[0]); })
            .attr("y1", function (d) { return self.y(d[1]); })
            .attr("x2", function (d) { return self.x(d[2]); })
            .attr("y2", function (d) { return self.y(d[3]); })
            .attr("opacity",0.5)
            .attr("stroke-width", function(d) {
                if (self.selectedSeries && self.selectedSeries === d[4]) {
                    return 2;
                }       
                if (!self.selectedSeries) {
                    return 2;
                }
                return 0;
            });


        self.g.selectAll("dot")
            .data(series)
            .enter().append("g")
            .attr("class", "series")
            .style("fill", function (d, i) { return self.z(i) })
            .selectAll(".point")
            .data(function (d) { return d; })
            .enter()
            .append("circle")
          
            .style("opacity", 0.9)
            .on("click", function (d) {
                self.setSelectedSeries(d.series);
            })
            .on("mouseover", function (d) {
                var niceDate = d.date.getFullYear() + "-" + (d.date.getMonth() + 1) + "-" + d.date.getDate();

                var indx = seriesNames.indexOf(d.series);
                var color = self.z(indx);
                self.tooltip.transition().duration(200).style("opacity", .9);
                self.tooltip.html(
                    niceDate + "<br/>" +
                    d.series + "<br/>" + d.score)
                    .style("left", "40%")
                    .style("background", color)
                    .style("top", "40px");
            })
            .on("mouseout", function (d) {
                self.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .attr("class", "point")
            .attr("r", function (d) {
                if (self.selectedSeries && self.selectedSeries !== d.series) {
                    return 0;
                }
                return 5;
            })
            .attr("cx", function (d) {
                return self.x(d.date);
            })
            .attr("cy", function (d) {
                return self.y(d.score);
            });


    }

    return GraphD3Controller;

}();