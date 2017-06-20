var SessionsController = function() {
    SessionsController.$inject = ["$rootScope", "$scope","$state", "$stateParams", "DataService"];

    function SessionsController($rootScope, $scope, $state, $stateParams, DataService) {

        var sessionId = parseInt($stateParams.sessionId);

        this.dataService = DataService;
        this.dataService.resetData();

        this.players = this.dataService.players;
        this.sessions = this.dataService.sessions;
        this.playerScores = this.dataService.playerScores;

        //todo some logic to check for existing data        
      
        this.session = null;
        var self = this;

        this.dataService.getScoresBySession(sessionId).then(function(result) {            
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

            var sessionObj = self.sessions.filter(function(e) {
                return e.ID == sessionId;
            });
            if (sessionObj.length == 0) {
                console.log("No session found");
                return;
            }
            self.session = sessionObj[0];
        });

        var xx = 42;
    }

    return SessionsController;
}();