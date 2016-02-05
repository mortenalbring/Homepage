var DataService = function($q,AjaxService) {
    var self = this;

    this.sessions = [];
    this.players = [];
    this.playerscores = [];
    this.games = [];

    

    function processScoreResults(scores) {
        var scoresList = [];

        for (var j = 0; j < scores.length; j++) {
            var matchingSession = self.sessions.filter(function (e) {
                return e.ID === scores[j].Session;
            });

            if (matchingSession.length > 0) {
                var matchingGame = matchingSession[0].Games.filter(function (e) {
                    return e.ID == scores[j].Game;
                });

                if (matchingGame.length > 0) {

                    var newScore = {};
                    newScore.ID = scores[j].ID;
                    newScore.Player = scores[j].Player;
                    newScore.Score = scores[j].Score;
                    newScore.Scorestring = scores[j].Scorestring;

                    matchingGame[0].Scores.push(newScore);

                    scoresList.push(newScore);
                }
            }
        }
        return scoresList;
    }


    function processGameResponse(games) {
        var gamesList = [];

        for (var j = 0; j < games.length; j++) {
            var matchingSession = self.sessions.filter(function (e) {
                return e.ID === games[j].Session;
            });

            if (matchingSession.length > 0) {
                var newGame = {};
                newGame.ID = games[j].ID;
                newGame.Session = games[j].Session;
                newGame.Lane = games[j].Lane;
                newGame.GameNumber = games[j].GameNumber;
                newGame.Scores = [];

                matchingSession[0].Games.push(newGame);

                gamesList.push(newGame);
            }
        }

        return gamesList;
    }


    function makeGamesList(responses) {
        var gamesList = [];

        for (var j = 0; j < responses.length; j++) {
            if (responses[j].data.success) {
                var games = responses[j].data.games;
                var gameObjs = processGameResponse(games);
               
                for (var l = 0; l < gameObjs.length; l++) {
                    self.games.push(gameObjs[l]);
                    gamesList.push(gameObjs[l]);
                }
            }
        }
        return gamesList;
    }

    function makeScoresList(scoresResponses) {
        var scoresList = [];

        for (var m = 0; m < scoresResponses.length; m++) {
            if (scoresResponses[m].data.success) {
                var scores = scoresResponses[m].data.playerScores;
                var scoreObjs = processScoreResults(scores);

                for (var n = 0; n < scoreObjs.length; n++) {
                    scoresList.push(scoreObjs[n]);
                    self.playerscores.push(scoreObjs[n]);
                }
            }
        }

        return scoresList;
    }

    function makeUniquePlayerIdList(scoresList) {
        var uniquePlayerIds = [];
        for (var o = 0; o < scoresList.length; o++) {            
            var scorePid = scoresList[o].Player;
            var indx = uniquePlayerIds.indexOf(scorePid);
            if (indx === -1) {
                uniquePlayerIds.push(scorePid);
            }
        }

        return uniquePlayerIds;
    }

    function processPlayerQueries(responses, scoresList) {
        for (var j = 0; j < responses.length; j++) {
            if (responses[j].data.success) {
                var player = responses[j].data.player;

                self.players.push(player);

                var playerscores = scoresList.filter(function (e) {
                    return e.Player == player.ID;
                });

                for (var l = 0; l < playerscores.length; l++) {
                    playerscores[l].Name = player.Name;

                }
            }
        }

    }

    function getAllGames(sessionIds) {
        var gamesQueryList = [];
        for (var i = 0; i < sessionIds.length; i++) {
            gamesQueryList.push(AjaxService.GetGames(sessionIds[i]));
        }

        $q.all(gamesQueryList).then(function (responses) {
            var gamesList = makeGamesList(responses);

            var scoresQueryList = [];
            for (var k = 0; k < gamesList.length; k++) {
                scoresQueryList.push(AjaxService.GetScores(gamesList[k].Session, gamesList[k].ID));
            }

            $q.all(scoresQueryList).then(function (scoresResponses) {
                var scoresList = makeScoresList(scoresResponses);
                var uniquePlayerIds = makeUniquePlayerIdList(scoresList);

                var playerQueryList = [];
                for (var p = 0; p < uniquePlayerIds.length; p++) {
                    playerQueryList.push(AjaxService.GetPlayer(uniquePlayerIds[p]));
                }

                $q.all(playerQueryList).then(function (responses) {
                    processPlayerQueries(responses, scoresList);
                    
                });
            });
        });
    }
    
    this.GetAllData = function() {

        AjaxService.ListSessions().then(function (response) {

            if (response.data.success) {

                var sessionIDs = [];

                var sessions = response.data.sessions;

                for (var i = 0; i < sessions.length; i++) {
                    var newsession = {};
                    newsession.ID = sessions[i].ID;
                    newsession.Date = new Date(parseInt(sessions[i].Date.substr(6)));
                    newsession.PdfDocument = sessions[i].PdfDocument;
                    newsession.Games = [];
                    self.sessions.push(newsession);

                    sessionIDs.push(newsession.ID);
                }

                getAllGames(sessionIDs);
            }
        });

    }



}