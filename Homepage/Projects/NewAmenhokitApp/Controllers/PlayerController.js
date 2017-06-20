var PlayerController = function () {
    PlayerController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "DataService"];

    function PlayerController($rootScope, $scope, $state, $stateParams, DataService) {

        var playerId = parseInt($stateParams.playerId);
        
        this.dataService = DataService;
        this.dataService.sessions = [];
        this.dataService.playerScores = [];

        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        //todo some logic to check for existing data        

     

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
        });
        
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

        }
    }
    

    return PlayerController;
}();