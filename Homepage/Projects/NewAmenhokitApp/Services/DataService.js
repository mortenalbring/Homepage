var DataService = function () {
    DataService.$inject = ["$http"];

    function DataService($http) {
        this.$http = $http;
        this.players = [];
        this.sessions = [];
        this.playerScores = [];

    }
    DataService.prototype.resetData = function() {
        this.players = [];
        this.sessions = [];
        this.playerScores = [];
    }
    DataService.prototype.updateScore = function(id, newscore) {
        return this.$http.post('/Amenhokit/UpdateScore',
            {
                id: id,
                newScore: newscore
            });
    }

    DataService.prototype.getAllPlayers = function() {
        return this.$http.post('/Amenhokit/GetPlayers');
    }

    DataService.prototype.getAllScores = function () {
        return this.$http.get('/Amenhokit/GetAllScores');
    }

    DataService.prototype.getScoresBySession = function (sessionId) {
        return this.$http.post('/Amenhokit/GetScoresBySession/',
        {
            sessionId: sessionId
        });
    }
    DataService.prototype.getScoresByPlayer = function (playerId) {
        return this.$http.post('/Amenhokit/GetScoresByPlayer/',
        {
            playerId: playerId
        });
    }
    DataService.prototype.addPlayer = function (player) {
        var exists = this.players.filter(function (e) {
            return e.ID == player.ID;
        });
        if (exists.length == 0) {
            this.players.push(player);
        }
    }

    DataService.prototype.addSession = function (session, sessionDate) {
        processDate(session, sessionDate);
        var sessionId = session.ID;
        var exists = this.sessions.filter(function (e) {
            return e.ID == sessionId;
        });
        if (exists.length == 0) {                 
            this.sessions.push(session);
        }
      
        function processDate(session, sessionDate) {
            var dateSplit = sessionDate.split('-');
            if (dateSplit.length >= 2) {

                var year = parseInt(dateSplit[0]);
                var month = parseInt(dateSplit[1]);
                var day = parseInt(dateSplit[2]);
                session.DateParsed = new Date(year, month - 1, day);
            }
        }
    }

    DataService.prototype.addGame = function (game) {
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

    DataService.prototype.addPlayerScore = function (playerScore) {

        var player = this.players.filter(function (e) {
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

    return DataService;
}();