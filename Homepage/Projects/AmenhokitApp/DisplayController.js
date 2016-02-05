var DisplayController = function ($routeParams, $scope, DataService) {
    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;

    DataService.GetAllData();
}