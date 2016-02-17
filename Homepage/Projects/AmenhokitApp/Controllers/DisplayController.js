﻿var DisplayController = function ($routeParams, $scope, DataService) { 
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

        $.each($scope.selectedPlayerScores, function (i, o) {
            if (o.Score > highestgame.Score) {
                highestgame = o;
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
        });
        $scope.lanestotals = [];
        $.each(lanestotal, function (i, o) {
            o.Average = parseInt(o.ScoreSum / o.Count);
            $scope.lanestotals.push(o);
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


            $scope.loading = false;
        }
    }
    if ($routeParams.sessionId) {

        finalCallback = function () {

            var selectedSession = $scope.sessions.filter(function (e) {
                return e.ID == $routeParams.sessionId;
            });
            if (selectedSession && selectedSession.length === 1) {
                $scope.selectedSession = selectedSession[0];
                $scope.activePlayers = [];
                
                for (var i = 0; i < $scope.selectedSession.Games.length; i++) {
                    for (var j = 0; j < $scope.selectedSession.Games[i].Scores.length; j++) {

                        var playerId = $scope.selectedSession.Games[i].Scores[j].Player;

                        var indx = $scope.activePlayers.indexOf(playerId);
                        if (indx === -1) {
                            $scope.activePlayers.push(playerId);
                        }
                    }
                }                               

            }

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