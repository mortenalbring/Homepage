var SessionDisplayController = function($routeParams, $scope, DataService, BowlingService) {
    $scope.sessions = DataService.sessions;
    $scope.players = DataService.players;

    var finalCallback = function () {
        $scope.loading = false;
    }

    if ($routeParams.sessionId) {

        finalCallback = function () {

            var selectedSession = $scope.sessions.filter(function (e) {
                return e.ID == $routeParams.sessionId;
            });
            if (selectedSession && selectedSession.length === 1) {
                $scope.selectedSession = selectedSession[0];
                $scope.activePlayers = [];

                $scope.plotData = [];

                for (var i = 0; i < $scope.selectedSession.Games.length; i++) {
                    for (var j = 0; j < $scope.selectedSession.Games[i].Scores.length; j++) {

                        var playerId = $scope.selectedSession.Games[i].Scores[j].Player;

                        var ss = $scope.selectedSession.Games[i].Scores[j].Scorestring;
                        $scope.selectedSession.Games[i].Scores[j].FrameArray = BowlingService.CalculateFrameScores(ss);
                        $scope.plotData.push($scope.selectedSession.Games[i].Scores[j]);


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