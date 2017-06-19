var HomeController = function () {
    HomeController.$inject = ["$rootScope", "$scope", "$state", "DataService"];

    function HomeController($rootScope, $scope, $state, DataService) {
        google.charts.load('current', { 'packages': ['corechart'] });

        var self = this;

        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.dataService = DataService;

        this.allScores = [];
        this.bowlingDataTable = [];
        this.uniquePlayers = [];
        this.players = [];


        this.sessions = [];
        this.playerScores = [];

        DataService.getAllScores()
            .then(function (result) {
                var outputArray = [];
                var ouputDataTable = [];

                for (var i = 0; i < result.data.length; i++) {

                    var player = result.data[i].Player;
                    var playerScore = result.data[i].PlayerScore;
                    var session = result.data[i].Session;
                    var game = result.data[i].Game;


                    var playerName = player.Name;
                    /*
                    if (playerName != "mort" && playerName != "george" && playerName != "bern" && playerName != "tom") {
                        continue;
                    }
                    */
                    var finalScore = playerScore.Score;
                    var sessionDate = result.data[i].DateTime;
                    self.addPlayer(player);
                    self.addSession(session, sessionDate);
                    self.addGame(game);
                    self.addPlayerScore(playerScore);

                    var dateSplit = sessionDate.split('-');
                    var outobj = {};
                    outobj.Name = playerName;
                    outobj.Score = finalScore;
                    outobj.DateString = sessionDate;

                    if (dateSplit.length >= 2) {

                        var year = parseInt(dateSplit[0]);
                        var month = parseInt(dateSplit[1]);
                        var day = parseInt(dateSplit[2]);
                        outobj.Date = new Date(year, month - 1, day);


                        outputArray.push(outobj);
                    }

                }

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

                self.uniquePlayers = uniquePlayers;

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
                vAxis: { title: 'Score', minValue: 0, maxValue: 200 },
                legend: { position: 'top' },
                trendlines: {}
            };


            var trendObjs = [];
            for (var i = 0; i < self.uniquePlayers.length; i++) {
                var trendObj = {}
                var inc = i + 1;
                trendObj = { type: 'linear', opacity: 0.25 }
                trendObjs.push(trendObj);
            }

            var rv = {};
            for (var m = 0; m < trendObjs.length; m++) {
                rv[m] = trendObjs[m];
            }
            options.trendlines = rv;




            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(multiTable, options);
        }

    }

    HomeController.prototype.addSession = function (session, sessionDate) {
        var sessionId = session.ID;
        var exists = this.sessions.filter(function (e) {
            return e.ID == sessionId;
        });
        if (exists.length == 0) {

            var dateSplit = sessionDate.split('-');

            if (dateSplit.length >= 2) {

                var year = parseInt(dateSplit[0]);
                var month = parseInt(dateSplit[1]);
                var day = parseInt(dateSplit[2]);
                session.DateParsed = new Date(year, month - 1, day);
            }

            this.sessions.push(session);
        }
    }
    HomeController.prototype.addPlayer = function (player) {
        var exists = this.players.filter(function (e) {
            return e.ID == player.ID;
        });
        if (exists.length == 0) {
            this.players.push(player);
        }
    }
    HomeController.prototype.addGame = function (game) {
        var sessionId = game.Session;

        var sessionObjs = this.sessions.filter(function (e) {
            return e.ID == sessionId;
        });

        if (sessionObjs.length > 0) {
            var sessionObj = sessionObjs[0];
            if (!sessionObj.Games) {
                sessionObj.Games = [];
            }

            var exists = sessionObj.Games.filter(function (e) {
                return e.ID == game.ID;
            });
            if (exists.length == 0) {
                sessionObj.Games.push(game);
            }

        } else {
            console.log("No session object found for " + game);
        }
    }

    HomeController.prototype.addPlayerScore = function (playerScore) {

        var player = this.players.filter(function(e) {
            return e.ID == playerScore.Player;
        });

        if (player.length == 0) {
            console.log("No player found for PlayerScore " + playerScore.ID);
            return;
        }
        playerScore.Player = player[0];

        this.playerScores.push(playerScore);
        var sessionId = playerScore.Session;
        var gameId = playerScore.Game;
        var sessionObjs = this.sessions.filter(function (e) {
            return e.ID == sessionId;
        });

        if (sessionObjs.length == 0) {
            console.log("No session found for PlayerScore" + playerScore.ID);
            return;
        }


        var sessionObj = sessionObjs[0];

        var gameObjs = sessionObj.Games.filter(function (e) {
            return e.ID == gameId;
        });

        if (gameObjs.length == 0) {
            console.log("No game found for PlayerScore" + playerScore.ID);
            return;
        }
        var gameObj = gameObjs[0];
        if (!gameObj.PlayerScores) {
            gameObj.PlayerScores = [];
        }
        gameObj.PlayerScores.push(playerScore);        
    }
    return HomeController;

}();