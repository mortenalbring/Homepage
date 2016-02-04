var HomeController = function ($routeParams, $http, $q, $scope) {

    $scope.sessions = [];

    function ajaxListSessions() {
        return $http({
            method: 'GET',
            url: '/Amenhokit/ListSessions'
        });
    }

    function ajaxGetGames(sessionId) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/GetGames',
            data: { sessionId: sessionId }
        });
    }

    function ajaxGetScores(sessionId, gameId) {
        return $http({
            method: 'POST',
            url: '/Amenhokit/GetScores',
            data: { sessionId: sessionId, gameId: gameId }
        });
    }


    function processScoreResults(scores) {
        var scoresList = [];

        for (var j = 0; j < scores.length; j++) {
            var matchingSession = $scope.sessions.filter(function (e) {
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
            var matchingSession = $scope.sessions.filter(function (e) {
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

                //getScores(matchingSession[0].ID, newGame.ID);

            }
        }

        return gamesList;
    }

    function getAllGames(sessionIds) {
        var gamesQueryList = [];
        for (var i = 0; i < sessionIds.length; i++) {
            gamesQueryList.push(ajaxGetGames(sessionIds[i]));
        }

        

        $q.all(gamesQueryList).then(function (responses) {
            var gamesList = [];

            for (var j = 0; j < responses.length; j++) {
                if (responses[j].data.success) {
                    var games = responses[j].data.games;
                    var gameObjs = processGameResponse(games);
                    for (var l = 0; l < gameObjs.length; l++) {
                        gamesList.push(gameObjs[l]);
                    }
                    
                }
            }

            var scoresQueryList = [];
            for (var k = 0; k < gamesList.length; k++) {
                scoresQueryList.push(ajaxGetScores(gamesList[k].Session, gamesList[k].ID));
            }

            $q.all(scoresQueryList).then(function(scoresResponses) {
                var scoresList = [];

                for (var m = 0; m < scoresResponses.length; m++) {
                    if (scoresResponses[m].data.success) {
                        var scores = scoresResponses[m].data.playerScores;
                        var scoreObjs = processScoreResults(scores);

                        for (var n = 0; n < scoreObjs.length; n++) {
                            scoresList.push(scoreObjs[n]);
                        }
                    }
                }

                var uniquePlayerIds = [];
                for (var o = 0; o < scoresList.length; o++) {
                    var scorePid = scoresList[o].Player;
                    var indx = uniquePlayerIds.indexOf(scorePid);
                    if (indx === -1) {
                        uniquePlayerIds.push(scorePid);
                    }
                }

                var xxx = 42;

                for (var p = 0; p < uniquePlayerIds.length; p++) {
                    //Get player names

                }



            });

        });
    }

    ajaxListSessions().then(function (response) {
        if (response.data.success) {

            var sessionIDs = [];

            var sessions = response.data.sessions;

            for (var i = 0; i < sessions.length; i++) {
                var newsession = {};
                newsession.ID = sessions[i].ID;
                newsession.Date = new Date(parseInt(sessions[i].Date.substr(6)));
                newsession.PdfDocument = sessions[i].PdfDocument;
                newsession.Games = [];
                $scope.sessions.push(newsession);

                sessionIDs.push(newsession.ID);

                //getGames(newsession.ID);
            }

            getAllGames(sessionIDs);


        }
    });
    

    $scope.selectedFile = null;

    $scope.gameInfo = [];

    $scope.filelist = [];

    $scope.testscorestring = "1 2 X 1 / 1 4 3 / 1 2 X 3 X 2 3 2";

    $scope.calculateScore = function () {
        $http({
            method: 'POST',
            url: '/Projects/CalculateScore',
            data: JSON.stringify({ scorestring: $scope.testscorestring })
        }).then(function (response) {
            if (response.data.success) {
                var xx = 42;
                $scope.testscorestringscore = response.data.data;
            } else {
                $scope.testscorestringscore = response.data.message;
            }
        });
    }
    $scope.calculateScore();

    $scope.process = function (file) {
        $http({
            method: 'POST',
            url: '/Projects/ProcessFile',
            data: JSON.stringify({ filename: file })
        }).then(function (response) {
            $scope.gameInfo = [];
            var data = response.data;
            $scope.displayGameInfo(data);
        });
    }


    if ($routeParams.filename) {
        $scope.process($routeParams.filename);

    } else {
        $http({
            method: 'GET',
            url: '/Projects/GetGameInfo'
        }).then(function (response) {
            console.log(response);
            var data = response.data;

            $scope.displayGameInfo(data);

        }), function error(response) {
            console.log(response);
        };
    }


    $http({
        method: 'GET',
        url: '/Projects/ListFiles'
    }).then(function (response) {
        var data = response.data;

        for (var i = 0; i < data.length; i++) {

            console.log(data[i]);

            var spl = data[i].split("\\");
            var filename = spl[spl.length - 1];

            $scope.filelist.push(filename);


        }


    });


    $scope.displayGameInfo = function (data) {

        if (data.success) {
            for (var i = 0; i < data.data.length; i++) {
                $scope.gameInfo.push(data.data[i]);

            }

        } else {
            console.log(data.message);
        }


    }
};