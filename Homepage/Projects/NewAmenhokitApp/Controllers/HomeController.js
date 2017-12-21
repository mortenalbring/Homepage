var HomeController = function () {
    HomeController.$inject = ["$rootScope", "$scope", "$state", "$window","$timeout", "DataService", "BowlingService"];

    function HomeController($rootScope, $scope, $state, $window, $timeout, DataService, BowlingService) {
        try {
            google.charts.load('current', { 'packages': ['scatter'] });
        } catch (err) {
            console.log("Unable to load google charts package");
        }

        var self = this;


        this.viewOptions = {
            allScoresDisplayLimit: 10
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
            function() {

                renderChart();
            });



        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        DataService.getPlayersFromFile().then(function(result) {
            self.players = result.data;
        });

        DataService.getTeamReport().then(function(result) {
            self.teamReport = result.data;
        })
        DataService.getPlayerReports().then(function(result) {
            for (var i = 0; i < result.data.length; i++) {
                self.playerReports.push(result.data[i]);
            }            
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
             } catch(err) {
                 console.log("Unable to load google charts");
             }

        });


        function renderChart() {
            try {
                var chart = new google.charts.Scatter(document.getElementById('chart_div'));

                chart.draw(self.multiTable, google.charts.Scatter.convertOptions(self.options));
            } catch (err) {
                console.log("Unable to render chart");
            }
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
                title: 'All scores',
                hAxis: {
                    format: 'MM/yyyy',
                    gridlines: { count: 15 }
                },
                vAxis: {
                    viewWindowMode: 'pretty',
                    textPosition: 'in'
                },
                chartArea: {width:'90%', height:'90%'},
            
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
            renderChart();
        }

    }

    HomeController.prototype.filterByPlayerCount = function(outputArray, minCount) {
        var filteredArray = [];
        for (var i = 0; i < this.uniquePlayers.length; i++) {

            var playerName = this.uniquePlayers[i];
            
            var playerScores = outputArray.filter(function(e) {
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
    HomeController.prototype.findUniquePlayers = function(outputArray) {
        var uniquePlayers = [];
        for (var k = 0; k < outputArray.length; k++) {

            if (uniquePlayers.indexOf(outputArray[k].Name) == -1) {
                uniquePlayers.push(outputArray[k].Name);
            }
        }
        return uniquePlayers;
    }

    HomeController.prototype.makeTableRows = function (outputArray) {
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

    HomeController.prototype.makeDateObjects = function(data) {

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

   
    return HomeController;

}();