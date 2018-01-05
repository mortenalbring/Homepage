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

        d3.tsv("/Content/datafiles/linechartdata2.txt", type, function (error, data) {
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

    GraphD3Controller.prototype.clearChart = function() {
        var self = this;

        self.g.remove();

        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    }
    GraphD3Controller.prototype.setSelectedSeries = function(series) {
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


        self.x.domain(d3.extent(d3.merge(series), function (d) { return d.date; })).nice();
        self.y.domain(d3.extent(d3.merge(series), function (d) { return d.score; })).nice();

        self.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + self.height + ")")
            .call(d3.axisBottom(self.x));

        self.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(self.y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Score");


        self.g.selectAll(".legend")
            .data(seriesNames)
            .enter()

            .append("text")
            .attr("y", function (d, i) {
                return i * 18;
            })
            .style("font", "14px sans-serif")
            .attr("x", 20)
            .attr("class", "legend")
            .style("fill", function (d, i) { return self.z(i) })
            .on("click", function (d) {
                self.setSelectedSeries(d);
            })
            .text(function (d) {
                if (self.selectedSeries && self.selectedSeries === d) {
                    return d + "*";
                }
                return d;
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
                
                self.tooltip.transition().duration(200).style("opacity", .9);
                self.tooltip.html(d.series + "<br/>" + d.score)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
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