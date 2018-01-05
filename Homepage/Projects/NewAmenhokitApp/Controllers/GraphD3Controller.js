var GraphD3Controller = function() {
    GraphD3Controller.$inject = [
        "$rootScope", "$scope", "$state", "$window", "$timeout", "DataService", "BowlingService"
    ];

    function GraphD3Controller($rootScope, $scope, $state, $window, $timeout, DataService, BowlingService) {

        this.dataService = DataService;

        var svg = d3.select("#graph-container"),
            margin = { top: 20, right: 80, bottom: 30, left: 50 },
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
            .y(function (d) { return y(d.temperature); });

        d3.tsv("/Content/datafiles/linechartdata2.txt", type, function (error, data) {
            if (error) throw error;

            var cities = data.columns.slice(1).map(function (id) {
                return {
                    id: id,
                    values: data.map(function (d) {
                        return { date: d.date, temperature: d[id] };
                    })
                };
            });

            var seriesNames = d3.keys(data[0])
                .filter(function (d) { return d !== "date"; })
                .sort();
            var series = seriesNames.map(function (series) {
                return data.map(function (d) {
                    return { date: d.date, temperature: d[series] };
                });
            });

            x.domain(d3.extent(data, function (d) { return d.date; }));

            y.domain([
                d3.min(cities, function (c) { return d3.min(c.values, function (d) { return d.temperature; }); }),
                d3.max(cities, function (c) { return d3.max(c.values, function (d) { return d.temperature; }); })
            ]);

            z.domain(cities.map(function (c) { return c.id; }));

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
                .text("Temperature, ºF");


            g.selectAll(".legend")
                .data(seriesNames)
                .enter()
                
                .append("text")
                .attr("y", function(d, i) {
                    return i * 15;
                })
                .attr("x",200)
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
                    if (d.temperature > 0) {
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
                   
                        return y(d.temperature);    
                    
                  
                });

             

        
            var city = g.selectAll(".city")
                .data(cities)
                .enter().append("g")
                .attr("class", "city");


            /*
            city.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line(d.values); })
                .style("stroke", function (d) { return z(d.id); });

            */
            city.append("text")
                .datum(function (d) { return { id: d.id, value: d.values[d.values.length - 1] }; })
                .attr("transform", function (d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "10px sans-serif")
                .text(function (d) { return d.id; });
        });

        function type(d, _, columns) {
            d.date = parseTime(d.date);
            for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
        }

    }

    return GraphD3Controller;

}();