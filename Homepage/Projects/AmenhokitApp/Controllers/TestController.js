var TestController = function ($scope, BowlingService) {
    $scope.testScoreStrings = [];

    
    

    function makeScore(scorestring,expected) {
        var obj = {};
        obj.Scorestring = scorestring;
        obj.FrameScores = BowlingService.CalculateFrameScores(scorestring);
        obj.Expected = expected;

        return obj;
    }

    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X 1 1", 12));
    $scope.testScoreStrings.push(makeScore("MORT 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", 20));
    $scope.testScoreStrings.push(makeScore("MORT 9 / 9 / 9 / 9 / 9 / 9 / 9 / 9 / 9 / 9 / 1", 182));
    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 / 1", 11));
    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 / 5", 15));

    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X 1 1", 12));
    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 5 / X", 20));
    $scope.testScoreStrings.push(makeScore("MORT X X 5 3 9 / 6 2 0 7 8 1 0 0 X X X X", 151));
    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X X X", 30));
    $scope.testScoreStrings.push(makeScore("MORT 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 X X X X",60 ));
    $scope.testScoreStrings.push(makeScore("MORT 1 / 6 / 3 2 X 5 0 X 3 / X 4 2 5 / 3",129 ));
    $scope.testScoreStrings.push(makeScore("GEORGE 5 1 7 / 6 - 7 2 X 3 1 3 - 6 - 6 / 3 6", 86 ));
    $scope.testScoreStrings.push(makeScore("GEORGE 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 / 3 6", 22));
    $scope.testScoreStrings.push(makeScore("MORT 5 2 6 / 9 - 5 - 7 2 7 - 9 / 7 1 X 1 4", 101));


}