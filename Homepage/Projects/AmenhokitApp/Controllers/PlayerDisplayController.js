var PlayerDisplayController = function($routeParams, $scope, DataService, BowlingService) {
    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;
    $scope.players = DataService.players;
    $scope.loading = false;


    var finalCallback = function () {
        $scope.loading = false;
    }

    function calculateStats() {
        var highestgame = {};
        highestgame.Score = 0;
        var scoresum = 0;

        var lanestotal = [];
        var gamenumberstotal = [];

        $scope.turkeyGames = [];
        $scope.cloverGames = [];

        $.each($scope.selectedPlayerScores, function (i, o) {
            if (o.Score > highestgame.Score) {
                highestgame = o;
            }

            var turkeyMatches = (o.Scorestring.match(/X X X/g) || []).length;
            if (turkeyMatches > 0) {
                $scope.turkeyGames.push(o);
            }
            var cloverMatches = (o.Scorestring.match(/X X X X/g) || []).length;
            if (cloverMatches > 0) {
                $scope.cloverGames.push(o);
            }

            scoresum = scoresum + o.Score;
            var lane = o.Lane;

            var matching = lanestotal.filter(function (e) {
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

            var gamenumber = o.GameNumber;
            var matching = gamenumberstotal.filter(function (e) {
                return e.GameNumber == gamenumber;
            });
            if (matching.length == 1) {
                matching[0].Count = matching[0].Count + 1;
                matching[0].ScoreSum = matching[0].ScoreSum + o.Score;
            }
            else {
                gamenumberstotal.push({
                    GameNumber: gamenumber,
                    Count: 1,
                    ScoreSum: o.Score
                });
            }
        });

        $scope.lanestotals = [];
        $.each(lanestotal, function (i, o) {
            o.Average = parseInt(o.ScoreSum / o.Count);
            $scope.lanestotals.push(o);
        });
        $scope.gamenumberstotal = [];
        $.each(gamenumberstotal, function (i, o) {
            o.Average = parseInt(o.ScoreSum / o.Count);
            $scope.gamenumberstotal.push(o);
        });



        $scope.averageScore = parseInt(scoresum / $scope.selectedPlayerScores.length);

        $scope.highestgame = highestgame;
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

            calculateStats();

            $scope.selectedPlayerScores.sort(function (a, b) {
                return new Date(a.Date) - new Date(b.Date);
            });

            $scope.loading = false;
        }
    }

    if ($scope.sessions.length === 0) {
        $scope.loading = true;
        DataService.GetAllData(finalCallback);
    } else {
        finalCallback();
    }
}