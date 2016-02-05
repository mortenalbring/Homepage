var DisplayController = function ($routeParams, $scope, DataService) {
    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;
    $scope.players = DataService.players;

    if ($scope.sessions.length == 0) {
        DataService.GetAllData();
    }

    if ($routeParams.playerId) {
        $scope.selectedPlayer = $scope.players.filter(function(e) {
            return e.ID == $routeParams.playerId;
        });

    }
    
   
}