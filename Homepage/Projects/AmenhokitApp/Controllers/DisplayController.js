var DisplayController = function ($routeParams, $scope, DataService) {

    function getGameFor(playerScore) {
        var result = $scope.games.filter(function (e) {
            if (e.Scores.indexOf(playerScore) !== -1) {
                return e;
            }

        });

        if ((result) && (result.length == 1)) {

            return result[0];
        }
        return null;
    }

    function getSessionFor(game) {
        var result = $scope.sessions.filter(function (e) {
            if (e.Games.indexOf(game) !== -1) {
                return e;
            }

        });

        if ((result) && (result.length == 1)) {

            return result[0];
        }
        return null;
    }


    $scope.gamePropertyFor = function (playerScore, property) {
        var game = getGameFor(playerScore);
        if (!game) { return null; }
        if (property == 'GameNumber') {
            return game.GameNumber;
        }
        if (property == 'Lane') {
            return game.Lane;
        }


        return null;

    }

    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;
    $scope.players = DataService.players;
    $scope.loading = false;
    

    var finalCallback = function () {
        console.log('done');
    }


    if ($routeParams.playerId) {
        finalCallback = function () {
            var selectedPlayer = $scope.players.filter(function (e) {
                return e.ID == $routeParams.playerId;
            });
            if ((selectedPlayer) && (selectedPlayer.length == 1)) {
                $scope.selectedPlayer = selectedPlayer[0];
            }
            

            $scope.selectedPlayerScores = $scope.playerscores.filter(function (e) {
                return e.Player == $routeParams.playerId;
            });

            var highestgame = {};
            highestgame.Score = 0;
            var scoresum = 0;

            var lanestotal = [];

            $.each($scope.selectedPlayerScores, function (i, o) {
                if (o.Score > highestgame.Score) {
                    highestgame = o;
                }
                scoresum = scoresum + o.Score;
                var lane = $scope.gamePropertyFor(o, 'Lane');

                var matching = lanestotal.filter(function(e) {
                    return e.Lane == lane;
                });
                if (matching.length == 1) {
                    matching[0].Count = matching[0].Count + 1;
                    matching[0].ScoreSum = matching[0].ScoreSum + o.Score;
                } else {
                    lanestotal.push({
                        Lane: lane,
                        Count: 1,
                        ScoreSum: o.Score
                    });
                }
            });
            $scope.lanestotals = [];
            $.each(lanestotal, function(i, o) {
                o.Average = parseInt(o.ScoreSum / o.Count);
                $scope.lanestotals.push(o);
            });
            

            $scope.averageScore = parseInt(scoresum / $scope.selectedPlayerScores.length);

            $scope.highestgame = highestgame;



            $scope.loading = false;
        }


    }

    if ($scope.sessions.length == 0) {
        $scope.loading = true;
        DataService.GetAllData(finalCallback);
    } else {
        finalCallback();
    }

    $scope.sessionPropertyFor = function (playerScore, property) {
        var game = getGameFor(playerScore);
        if (!game) { return null; }

        var session = getSessionFor(game);

        if (property == 'Date') {
            return session.Date;
        }

        return null;


    }



}