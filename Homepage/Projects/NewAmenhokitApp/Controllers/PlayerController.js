var PlayerController = function () {
    PlayerController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "DataService"];

    function PlayerController($rootScope, $scope, $state, $stateParams, DataService) {
        google.charts.load('current', { 'packages': ['calendar'] });

        var playerId = parseInt($stateParams.playerId);
        
        this.dataService = DataService;
        this.dataService.sessions = [];
        this.dataService.playerScores = [];

        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        //todo some logic to check for existing data        

        this.sessionDataPoints = [];

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
                self.dataService.addGame(game);
                self.dataService.addPlayerScore(playerScore);
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
            /*
            dataTable.addRows([
               [new Date(2012, 3, 13), 37032],
               [new Date(2012, 3, 14), 38024],
               [new Date(2012, 3, 15), 38024],
               [new Date(2012, 3, 16), 38108],
               [new Date(2012, 3, 17), 38229],
               // Many rows omitted for brevity.
               [new Date(2013, 9, 4), 38177],
               [new Date(2013, 9, 5), 38705],
               [new Date(2013, 9, 12), 38210],
               [new Date(2013, 9, 13), 38029],
               [new Date(2013, 9, 19), 38823],
               [new Date(2013, 9, 23), 38345],
               [new Date(2013, 9, 24), 38436],
               [new Date(2013, 9, 30), 38447]
            ]);
            */
            var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

            var options = {
                title: "Score",
                
            };

            chart.draw(dataTable, options);
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
            for (var j = 0; j < scores.length; j++) {
                var zz = 42;
                cumScore = cumScore + scores[j].Score;
            }
            var averageScore = cumScore / scores.length;

            var dataPoint = {Date: sessionDate, Score: averageScore}

            var xx = 42;
            this.sessionDataPoints.push(dataPoint);

        }
    }
    

    return PlayerController;
}();