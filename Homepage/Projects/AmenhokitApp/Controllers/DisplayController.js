var DisplayController = function ($routeParams, $scope, DataService, BowlingService) {
    $scope.sessions = DataService.sessions;
    $scope.games = DataService.games;
    $scope.playerscores = DataService.playerscores;
    $scope.players = DataService.players;
    $scope.loading = false;
    $scope.chartData = [];


    var finalCallback = function () {
        $scope.loading = false;
    }
   

    if ($scope.sessions.length === 0) {
        $scope.loading = true;
        DataService.GetAllData(finalCallback);
    } else {
        finalCallback();
    }



}