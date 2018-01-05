var GraphController = function () {
    GraphController.$inject = ["$rootScope", "$scope", "$state", "$window", "$timeout", "DataService", "BowlingService"];

    function GraphController($rootScope, $scope, $state, $window, $timeout, DataService, BowlingService) {
        try {
            google.charts.load('current', { 'packages': ['scatter', 'line'] });
            google.charts.load('current', { 'packages': ['corechart', 'scatter'] });
        } catch (err) {
            console.log("Unable to load google charts package");
        }

        var self = this;

      //  this.drawD3Graph();
        

        this.viewOptions = {
            allScoresDisplayLimit: 10,
            chartType: 'd3'
        }

        this.graphOptions = {
            lineChart: {
                hAxis: {
                    title: 'Date',
                    
                    gridlines: { count: 15 }

                },
                vAxis: {
                    title: 'Score',
                    viewWindowMode: 'pretty'                
                    

                },
                curveType: 'function',
                interpolateNulls: true,

                theme: 'maximized',
                pointsVisible: true,
                pointSize: 8

            },

        }

        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dataService = DataService;
        this.bowlingService = BowlingService;
        this.dataService.resetData();

        this.allScores = [];
        this.bowlingDataTable = [];
        this.uniquePlayers = [];
        this.playerReports = [];

        this.width = this.$window.innerWidth;

        angular.element($window).bind('resize',
            function () {

                self.renderChart();
            });



        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        DataService.getPlayersFromFile().then(function (result) {
            self.players = result.data;
        });

        DataService.getTeamReport().then(function (result) {
            self.teamReport = result.data;
        })
        DataService.getPlayerReports().then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                self.playerReports.push(result.data[i]);
            }
        });

        DataService.getLineChartData().then(function (result) {

            self.lineChartData = result.data;

            try {
                google.charts.setOnLoadCallback(drawLineChart);
            } catch (err) {
                console.log("Unable to load google charts");
            }



            var xx = 42;
        });
        DataService.getGraphDataFromFile().then(function (result) {
            var graphData = result.data;
            self.makeDateObjects(graphData);

            self.uniquePlayers = self.findUniquePlayers(graphData);
            var filteredArray = self.filterByPlayerCount(graphData, 10);
            var tableRows = self.makeTableRows(filteredArray);


            self.bowlingDataTable = tableRows;

            self.allScores = graphData;
            try {
                google.charts.setOnLoadCallback(drawChart);
            } catch (err) {
                console.log("Unable to load google charts");
            }

        });

        function drawLineChart() {

            var lineChartData = [];
            var datalines = self.lineChartData.split('\n');

            var headers = datalines[0];
            var headerData = headers.split('\t');
            lineChartData.push(headerData);

            for (var i = 1; i < datalines.length; i++) {
                var ddata = datalines[i].split('\t');
                lineChartData.push(ddata);
            }

            var lineChartTable = new google.visualization.DataTable();

            lineChartTable.addColumn('date', 'Date');

            for (var j = 1; j < headerData.length; j++) {
                lineChartTable.addColumn('number', headerData[j]);
            }
            for (var i = 1; i < datalines.length; i++) {
                var outputRow = [];
                var ddata = datalines[i].split('\t');
                if (ddata.length < 2) {
                    continue;
                }
                var dateElement = ddata[0];

                var dateObj = makeDateObj(dateElement);
                outputRow.push(dateObj);
                for (var k = 1; k < (ddata.length - 1); k++) {
                    var rowdata = ddata[k];
                    if (rowdata == "") {
                        outputRow.push(null);
                    } else {
                        outputRow.push(parseInt(rowdata));
                    }

                }
                try {
                    lineChartTable.addRow(outputRow);
                } catch (error) {
                    var zz = 42;
                }
            }

            self.lineChartTable = lineChartTable;





        }

        function makeDateObj(dateString) {
            var dateSplit = dateString.split("-");

            if (dateSplit.length <= 2) {
                return null;
            }

            var year = parseInt(dateSplit[0]);
            var month = parseInt(dateSplit[1]);
            var day = parseInt(dateSplit[2]);
            var dateObj = new Date(year, month - 1, day);

            return dateObj;

        }


    
        function drawChart() {
            var bowlingTable = self.bowlingDataTable;

            var multiTable = new google.visualization.DataTable();
            multiTable.addColumn('date', 'Date');

            var headerRow = bowlingTable[0];
            for (var j = 1; j < headerRow.length; j++) {
                multiTable.addColumn('number', headerRow[j]);
            }

            for (var k = 1; k < bowlingTable.length; k++) {
                var outputRow = [];
                var dateString = bowlingTable[k][0];
                var dateSplit = dateString.split("-");

                if (dateSplit.length <= 2) {
                    continue;
                }

                var year = parseInt(dateSplit[0]);
                var month = parseInt(dateSplit[1]);
                var day = parseInt(dateSplit[2]);
                var dateObj = new Date(year, month - 1, day);

                outputRow.push(dateObj);
                for (var l = 1; l < bowlingTable[k].length; l++) {
                    outputRow.push(bowlingTable[k][l]);
                }

                multiTable.addRow(outputRow);
            }

            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('date', 'Date');
            dataTable.addColumn('number', 'Score');

            var options = {
                curveType: 'function',
                interpolateNulls: true,
                title: 'All scores',
                hAxis: {
                    format: 'MM/yyyy',
                    gridlines: { count: 15 }
                },
                vAxis: {
                    viewWindowMode: 'pretty',
                    textPosition: 'in'
                },
                chartArea: { width: '90%', height: '90%' },
              
                legend: { position: 'top' },
                trendlines: {}
            };


            var trendObjs = [];
            for (var i = 0; i < self.uniquePlayers.length; i++) {
                var trendObj = {}
                trendObj = { type: 'linear', opacity: 0.25 }
                trendObjs.push(trendObj);
            }

            var rv = {};
            for (var m = 0; m < trendObjs.length; m++) {
                rv[m] = trendObjs[m];
            }
            options.trendlines = rv;


            self.multiTable = multiTable;
            self.options = options;
            self.renderChart();
        }

    }


    GraphController.prototype.renderChart = function () {
        var self = this;
        try {
            if (!self.linechart) {
                self.linechart = new google.visualization.LineChart(document.getElementById('line_chart_div'));
            }
            if (!self.classicChart) {
                self.classicChart = new google.visualization.LineChart(document.getElementById('classic_chart_div'));
            }
            if (!self.materialChart) {
                self.materialChart = new google.charts.Scatter(document.getElementById('chart_div'));
            }


            if (self.viewOptions.chartType == 'line') {
                self.linechart.draw(self.lineChartTable, self.graphOptions.lineChart);
            }

            if (self.viewOptions.chartType == 'scatter') {
                self.classicChart.draw(self.multiTable, self.options);
            }
            if (self.viewOptions.chartType == 'scatter-material') {
                self.materialChart.draw(self.multiTable, google.charts.Scatter.convertOptions(self.options));
            }



        } catch (err) {
            console.log("Unable to render chart");
        }

    }
    GraphController.prototype.setChartType = function (type) {
        this.viewOptions.chartType = type;
        this.renderChart();
    }
    GraphController.prototype.filterByPlayerCount = function (outputArray, minCount) {
        var filteredArray = [];
        for (var i = 0; i < this.uniquePlayers.length; i++) {

            var playerName = this.uniquePlayers[i];

            var playerScores = outputArray.filter(function (e) {
                return e.Name == playerName;
            });

            var scoreCount = playerScores.length;

            if (scoreCount > minCount) {

                for (var j = 0; j < playerScores.length; j++) {

                    filteredArray.push(playerScores[j]);

                }
            }
        }

        return filteredArray;
    }
    GraphController.prototype.findUniquePlayers = function (outputArray) {
        var uniquePlayers = [];
        for (var k = 0; k < outputArray.length; k++) {

            if (uniquePlayers.indexOf(outputArray[k].Name) == -1) {
                uniquePlayers.push(outputArray[k].Name);
            }
        }
        return uniquePlayers;
    }

    GraphController.prototype.makeTableRows = function (outputArray) {
        var t0 = performance.now();

        var self = this;
        var tableRows = [];

        var uniquePlayers = self.findUniquePlayers(outputArray);

        var uniqueDates = [];
        for (var j = 0; j < outputArray.length; j++) {
            if (uniqueDates.indexOf(outputArray[j].DateString) == -1) {
                uniqueDates.push(outputArray[j].DateString);
            }
        }



        var tableHeaders = ["Score"];
        for (var i = 0; i < uniquePlayers.length; i++) {
            tableHeaders.push(uniquePlayers[i]);
        }
        tableRows.push(tableHeaders);


        for (var l = 0; l < uniqueDates.length; l++) {
            var dateString = uniqueDates[l];
            var tableRow = [dateString];

            for (var i = 0; i < uniquePlayers.length; i++) {

                var playerName = uniquePlayers[i];

                var matchingScores = outputArray.filter(function (e) {
                    return e.Name == playerName && e.DateString == dateString;
                });

                if (matchingScores.length > 0) {
                    var highestGameScore = 0;
                    for (var m = 0; m < matchingScores.length; m++) {
                        if (matchingScores[m].Score > highestGameScore) {
                            highestGameScore = matchingScores[m].Score;
                        }
                    }

                    tableRow.push(highestGameScore);
                } else {
                    tableRow.push(null);
                }

                tableRows.push(tableRow);
            }
        }
        var t1 = performance.now();
        console.log("Make Table Rows " + (t1 - t0) + " ms");
        return tableRows;
    }

    GraphController.prototype.makeDateObjects = function (data) {

        for (var i = 0; i < data.length; i++) {
            var sessionDate = data[i].DateString;
            var dateSplit = sessionDate.split('-');
            if (dateSplit.length >= 2) {

                var year = parseInt(dateSplit[0]);
                var month = parseInt(dateSplit[1]);
                var day = parseInt(dateSplit[2]);
                data[i].Date = new Date(year, month - 1, day);
            }
        }

    }

    GraphController.prototype.drawD3Graph = function() {
        
        var data = [[5, 3], [10, 17], [15, 4], [2, 8]];

        var margin = { top: 20, right: 15, bottom: 60, left: 60 }
            , width = 960 - margin.left - margin.right
            , height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .domain([0, d3.max(data, function (d) { return d[0]; })])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, function (d) { return d[1]; })])
            .range([height, 0]);

        var chart = d3.select('#graph-container')
            .append('svg:svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart')

        var main = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main')

        // draw the x axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        main.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'main axis date')
            .call(xAxis);

        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        main.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'main axis date')
            .call(yAxis);

        var g = main.append("svg:g");

        g.selectAll("scatter-dots")
            .data(data)
            .enter().append("svg:circle")
            .attr("cx", function (d, i) { return x(d[0]); })
            .attr("cy", function (d) { return y(d[1]); })
            .attr("r", 8);


        d3.tsv("/Content/datafiles/linechartdata.txt",
            function(data) {

                g.selectAll(".dot")
                    .data(data)
                    .enter().append("svg:circle")
                    .attr("class", "dot")
                    .attr("r", 3.5)
                    .attr("cx", function(d, i) {

                        var date = d.Date;
                        var dataPoint = d[0];
                        var dataScale = x(date);

                        return x(date);
                    })
                    .attr("cy", function (d) {
                        var mortscore = d.mort;

                        var dataPoint = d[1];
                        var dataScale = y(mortscore);
                        return y(mortscore);
                    });

                var zz = 42;
            });

        var xx = 42;
    }


    return GraphController;

}();