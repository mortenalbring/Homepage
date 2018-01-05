var GraphD3Controller = function() {
    GraphD3Controller.$inject = [
        "$rootScope", "$scope", "$state", "$window", "$timeout", "DataService", "BowlingService"
    ];

    function GraphD3Controller($rootScope, $scope, $state, $window, $timeout, DataService, BowlingService) {

        this.dataService = DataService;

        var svg = d3.select("#graph-container"),
            margin = { top: 20, right: 80, bottom: 50, left: 50 },
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%Y%m%d");

        var x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.score); });

        d3.tsv("/Content/datafiles/linechartdata2.txt", type, function (error, data) {
            if (error) throw error;

          

            var seriesNames = d3.keys(data[0])
                .filter(function (d) { return d !== "date"; })
                .sort();
            var series = seriesNames.map(function (series) {
                return data.map(function (d) {
                    return { date: d.date, score: d[series] };
                }).filter(function(v) {
                    return v.score > 0;
                });
            });

            
            x.domain(d3.extent(d3.merge(series), function (d) { return d.date; })).nice();
            y.domain(d3.extent(d3.merge(series), function (d) { return d.score; })).nice();


          
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Score");


            g.selectAll(".legend")
                .data(seriesNames)
                .enter()
                
                .append("text")
                .attr("y", function(d, i) {
                    return i * 15;
                })
                .style("font", "10px sans-serif")
                .attr("x",20)
                .attr("class", "legend")
                .style("fill", function(d, i) { return z(i) })                
                
                .text(function(d) {
                    return d;
                });

            

            g.selectAll("dot")
                .data(series)
                .enter().append("g")
                .attr("class", "series")
                .style("fill", function(d, i) { return z(i) })
                .selectAll(".point")
                .data(function(d) { return d; })
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("r", function(d) {
                    if (d.score > 0) {
                        return 5;
                    }
                        return 0;

                    }
                )
                .attr("cx", function (d) {
                    var zz = 42;

                    return x(d.date);
                })
                .attr("cy", function (d) {
                   
                        return y(d.score);    
                    
                  
                });

             

        
        });

        function type(d, _, columns) {
            d.date = parseTime(d.date);
            for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
        }

    }

    return GraphD3Controller;

}();