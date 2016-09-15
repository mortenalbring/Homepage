var ManualEntryController = function($routeParams, $scope, DataService, BowlingService) {
    $scope.calculateScore = function(string) {
        var score = BowlingService.CalculateFrameScores(string);

        $scope.scoreStringCalculated = score;

    }
}