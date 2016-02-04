var HomeController = function ($routeParams, $http, $scope) {

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


    function getScores(sessionId, gameId) {
        ajaxGetScores(sessionId, gameId).then(function (scoresresponse) {
            if (scoresresponse.data.success) {
                var scores = scoresresponse.data.playerScores;

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
                        }


                    }
                }
            }
        });
    }


    function getGames(id) {
        ajaxGetGames(id).then(function (gamesresponse) {
            if (gamesresponse.data.success) {
                var games = gamesresponse.data.games;

                for (var j = 0; j < games.length; j++) {
                    var matchingSession = $scope.sessions.filter(function (e) {
                        return e.ID === games[j].Session;
                    });

                    if (matchingSession.length > 0) {
                        var newGame = {};
                        newGame.ID = games[j].ID;
                        newGame.Lane = games[j].Lane;
                        newGame.GameNumber = games[j].GameNumber;
                        newGame.Scores = [];

                        matchingSession[0].Games.push(newGame);

                        getScores(matchingSession[0].ID,newGame.ID);

                    }
                }
            }
        });
    }

    ajaxListSessions().then(function (response) {
        if (response.data.success) {
            var sessions = response.data.sessions;

            for (var i = 0; i < sessions.length; i++) {
                var newsession = {};
                newsession.ID = sessions[i].ID;
                newsession.Date = new Date(parseInt(sessions[i].Date.substr(6)));
                newsession.PdfDocument = sessions[i].PdfDocument;
                newsession.Games = [];
                $scope.sessions.push(newsession);
                getGames(newsession.ID);

            }


        }
    });


    $scope.test = "moop";

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