﻿var HomeController = function () {
    HomeController.$inject = ["$rootScope", "$scope", "$state", "DataService"];

    function HomeController($rootScope, $scope, $state, DataService) {
        google.charts.load('current', { 'packages': ['corechart'] });



        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.test = "moop";
        this.dataService = DataService;

        this.allScores = [];
        this.bowlingDataTable = [];

        var self = this;

        DataService.getAllScores()
            .then(function (result) {
                var outputArray = [];
                var ouputDataTable = [];

                for (var i = 0; i < result.data.length; i++) {

                    var player = result.data[i].Player;
                    var playerScore = result.data[i].PlayerScore;
                    var session = result.data[i].Session;

                    var playerName = player.Name;
                    var finalScore = playerScore.Score;
                    var sessionDate = result.data[i].DateTime;
                    var dateSplit = sessionDate.split('-');
                    var outobj = {};
                    outobj.Name = playerName;
                    outobj.Score = finalScore;
                    outobj.DateString = sessionDate;

                    if (dateSplit.length >= 2) {

                        var year = dateSplit[0];
                        var month = dateSplit[1];
                        var day = dateSplit[2];
                        outobj.Date = new Date(year, month, day);
                        outputArray.push(outobj);
                    }

                }

                var tableData = [];
                var uniqueDates = [];
                for (var j = 0; j < outputArray.length; j++) {
                    if (uniqueDates.indexOf(outputArray[j].DateString) == -1) {
                        uniqueDates.push(outputArray[j].DateString);
                    }
                }
                var uniquePlayers = [];
                for (var k = 0; k < outputArray.length; k++) {

                    if (uniquePlayers.indexOf(outputArray[k].Name) == -1) {
                        uniquePlayers.push(outputArray[k].Name);
                    }
                }

                var tableRows = [];
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

                            var cumscore = 0;

                            for (var m = 0; m < matchingScores.length; m++) {
                                cumscore = cumscore + matchingScores[m].Score;
                            }
                            var averageScore = cumscore / matchingScores.length;
                            tableRow.push(averageScore);
                        } else {
                            tableRow.push(null);
                        }

                        tableRows.push(tableRow);
                    }
                }


                self.bowlingDataTable = tableRows;



                self.allScores = outputArray;

                google.charts.setOnLoadCallback(drawChart);

            });


        function drawChart() {

            var bowlingData = self.allScores;

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

                var year = dateSplit[0];
                var month = dateSplit[1];
                var day = dateSplit[2];
                var dateObj = new Date(year, month, day);
               
                outputRow.push(dateObj);
                for (var l = 1; l < bowlingTable[k].length; l++) {
                    outputRow.push(bowlingTable[k][l]);
                }
                
                multiTable.addRow(outputRow);
            }

            var testArr = [['A', 'B']];
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('date', 'Date');
            dataTable.addColumn('number', 'Score');

            var testRows = [];
            for (var i = 0; i < bowlingData.length; i++) {
                var testKey = i;
                var dateKey = new Date(1900, 1, 1);

                var bowlingDate = bowlingData[i].Date;


                var testVal = bowlingData[i].Score;
                var testElem = [testKey, testVal];
                testArr.push(testElem);
                var testElem2 = [bowlingDate, testVal];
                testRows.push(testElem2);
            }

            dataTable.addRows(testRows);

            var options = {
                title: 'All scores',
                hAxis: {
                    format: 'd/M/yy',
                    gridlines: { count: 15 }
                },
                vAxis: { title: 'Score', minValue: 0, maxValue: 250 },
                legend: 'none'
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(multiTable, options);
        }

    }


    return HomeController;

}();