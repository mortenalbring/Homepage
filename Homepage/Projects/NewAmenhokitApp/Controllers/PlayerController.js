var PlayerController = function () {
    PlayerController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "DataService", "BowlingService"];

    function PlayerController($rootScope, $scope, $state, $stateParams, DataService, BowlingService) {
        var self = this;

        google.charts.load('current', { 'packages': ['calendar', 'corechart'] }).then(function () {
            self.scatterChart = new google.visualization.ScatterChart(document.getElementById('scatter-chart'));
        });

        this.scatterChartOptions = {
            title: 'Scores over time',
            animation: {
                duration: 500,
                startup: true,
                easing: 'inAndOut'

            },
            hAxis: {
                format: 'MM/yyyy',
                gridlines: { count: 15 }
            },
            legend: "none",
            vAxis: {
                viewWindowMode: 'pretty',
                textPosition: 'in'
            },
            chartArea: {
                width: '80%',
                height: '80%'
            },
            trendlines: {
                0: {}
            },
            displayToggle: 'highest'


        }

        var playerId = parseInt($stateParams.playerId);
        this.$rootScope = $rootScope;
        this.dataService = DataService;
        this.bowlingService = BowlingService;
        this.dataService.resetData();
        this.$state = $state;
        this.sessionDataPoints = [];

        this.player = null;
        this.selected = {
            session: null
        }

        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        this.unfilteredDataPoints = [];

        //todo some logic to check for existing data        

        this.highestScore = 0;
        this.highestScoreSession = null;

        this.allPlayers = [];
        this.dataService.getAllPlayers().then(function (result) {

            if (result.data.success) {
                for (var i = 0; i < result.data.players.length; i++) {
                    self.allPlayers.push(result.data.players[i]);
                }
            }

        });

        this.dataService.getScoresByPlayer(playerId).then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                var player = result.data[i].Player;
                var playerScore = result.data[i].PlayerScore;
                var session = result.data[i].Session;
                var game = result.data[i].Game;
                var sessionDate = result.data[i].DateTime;

                self.dataService.addPlayer(player);
                self.dataService.addSession(session, sessionDate);

                if (playerScore.Score > self.highestScore) {
                    self.highestScore = playerScore.Score;
                    self.highestScoreSession = session;
                }
                self.dataService.addGame(game);
                self.dataService.addPlayerScore(playerScore);
            }

            var playerObj = self.players.filter(function (e) { return e.ID == playerId });
            if (playerObj.length > 0) {
                self.player = playerObj[0];
            }
            self.makeSessionScoreTable();

            google.charts.setOnLoadCallback(drawCalendarAndScatterChart);

        });




        function drawCalendarAndScatterChart() {
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Score' });

            for (var i = 0; i < self.sessionDataPoints.length; i++) {
                dataTable.addRow([self.sessionDataPoints[i].Date, self.sessionDataPoints[i].Score]);
            }

            var calendarChart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

            var calendarOptions = {
                title: "Highest score per session"
            };


            self.scatterChart.draw(dataTable, self.scatterChartOptions);
            calendarChart.draw(dataTable, calendarOptions);
            google.visualization.events.addListener(calendarChart, 'select', calendarChartHandler);
            google.visualization.events.addListener(self.scatterChart, 'select', scatterChartHandler);


            function scatterChartHandler(e) {
                var selectedItem = self.scatterChart.getSelection();

                var selectedRow = selectedItem[0].row;

                if (selectedRow) {
                    var val1 = dataTable.getValue(selectedRow, 0);

                    var matchingData = self.sessionDataPoints.filter(function (e) { return e.Date == val1 });
                    if (matchingData.length > 0) {
                        self.$rootScope.$apply(function () {
                            self.selected.session = matchingData[0];
                            self.$state.go('sessions', { sessionId: self.selected.session.ID });
                        });

                    }
                }
            }

            function calendarChartHandler(e) {

                var selectedItem = calendarChart.getSelection();
                //alert('A table row was selected');

                var selectedRow = selectedItem[0].row;
                if (selectedRow) {
                    var rowprop = dataTable.getRowProperties(selectedRow);
                    var val1 = dataTable.getValue(selectedRow, 0);
                    var val2 = dataTable.getValue(selectedRow, 1);

                    var matchingData = self.sessionDataPoints.filter(function (e) { return e.Date == val1 });
                    if (matchingData.length > 0) {
                        self.$rootScope.$apply(function () {
                            self.selected.session = matchingData[0];
                            self.$state.go('sessions', { sessionId: self.selected.session.ID });
                        });

                    }
                }

            }
        }
    }


    PlayerController.prototype.drawScatterChartFiltered = function () {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Score' });

        for (var i = 0; i < this.sessionDataPoints.length; i++) {
            dataTable.addRow([this.sessionDataPoints[i].Date, this.sessionDataPoints[i].Score]);
        }
        this.scatterChartOptions.displayToggle = 'highest';
        this.scatterChartOptions.title = 'Scores over time (highest per session)';
        this.scatterChart.draw(dataTable, this.scatterChartOptions);
    }

    PlayerController.prototype.drawScatterChartUnfiltered = function () {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Score' });

        for (var i = 0; i < this.unfilteredDataPoints.length; i++) {
            dataTable.addRow([this.unfilteredDataPoints[i].Date, this.unfilteredDataPoints[i].Score]);
        }
        this.scatterChartOptions.displayToggle = 'unfiltered';
        this.scatterChartOptions.title = 'Scores over time (unfiltered)';
        this.scatterChart.draw(dataTable, this.scatterChartOptions);
    }

    PlayerController.prototype.makeSessionScoreTable = function () {
        var self = this;
        for (var i = 0; i < this.sessions.length; i++) {

            var session = this.sessions[i];

            var sessionDate = session.DateParsed;

            var scores = this.playerScores.filter(function (e) {
                return e.Session == session.ID;
            });


            var highestSessionScore = 0;
            for (var j = 0; j < scores.length; j++) {
                if (scores[j].Score > highestSessionScore) {
                    highestSessionScore = scores[j].Score;
                }

                var unfilteredDataPoint = { Date: sessionDate, Score: scores[j].Score, ID: session.ID }
                this.unfilteredDataPoints.push(unfilteredDataPoint);
            }
            var dataPoint = { Date: sessionDate, Score: highestSessionScore, ID: session.ID }
            self.sessionDataPoints.push(dataPoint);

        }
    }


    return PlayerController;
}();