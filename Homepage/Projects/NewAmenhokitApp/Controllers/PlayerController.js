var PlayerController = function () {
    PlayerController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "DataService","BowlingService"];

    function PlayerController($rootScope, $scope, $state, $stateParams, DataService, BowlingService) {
        google.charts.load('current', { 'packages': ['calendar'] });

        var playerId = parseInt($stateParams.playerId);
        this.$rootScope = $rootScope;
        this.dataService = DataService;
        this.bowlingService = BowlingService;
        this.dataService.resetData();
        this.$state = $state;

        this.player = null;
        this.selected = {
            session: null
    }

        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        //todo some logic to check for existing data        
      
        this.sessionDataPoints = [];
        this.highestScore = 0;
        this.highestScoreSession = null;

        var self = this;

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

            google.charts.setOnLoadCallback(drawChart);

        });
        

        function drawChart() {

           
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Score' });            

            for (var i = 0; i < self.sessionDataPoints.length; i++) {
                dataTable.addRow([self.sessionDataPoints[i].Date, self.sessionDataPoints[i].Score]);
            }
   
            var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

            var options = {
                title: "Highest score per session",
                
            };

            chart.draw(dataTable, options);
            google.visualization.events.addListener(chart, 'select', selectHandler);
            function selectHandler(e) {

                var selectedItem = chart.getSelection();
                //alert('A table row was selected');
                
                var selectedRow = selectedItem[0].row;
                if (selectedRow) {
                    var rowprop = dataTable.getRowProperties(selectedRow);
                    var val1 = dataTable.getValue(selectedRow, 0);
                    var val2 = dataTable.getValue(selectedRow, 1);

                    var matchingData = self.sessionDataPoints.filter(function (e) { return e.Date == val1 });
                    if (matchingData.length > 0) {
                        self.$rootScope.$apply(function() {
                            self.selected.session = matchingData[0];
                            self.$state.go('sessions', { sessionId: self.selected.session.ID });
                        });

                    }                    
                }
                
            }
        }
    }



    PlayerController.prototype.makeSessionScoreTable = function() {
        for (var i = 0; i < this.sessions.length; i++) {

            var session = this.sessions[i];

            var sessionDate = session.DateParsed;

            var scores = this.playerScores.filter(function(e) {
                return e.Session == session.ID;
            });

            var cumScore = 0;
            var highestSessionScore = 0; 
            for (var j = 0; j < scores.length; j++) {                
                if (scores[j].Score > highestSessionScore) {
                    highestSessionScore = scores[j].Score;
                }
                cumScore = cumScore + scores[j].Score;
            }
            var averageScore = parseInt(cumScore / scores.length);

            var dataPoint = { Date: sessionDate, Score: highestSessionScore, ID: session.ID}

            var xx = 42;
            this.sessionDataPoints.push(dataPoint);

        }
    }
    

    return PlayerController;
}();